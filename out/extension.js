"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const https_1 = require("https");
const crypto_1 = require("crypto");
const vscode = __importStar(require("vscode"));
const sidebar_1 = require("./sidebar");
const REDIRECT_PORT = 4567;
const REDIRECT_URI = `https://localhost:${REDIRECT_PORT}/callback`;
const TOKEN_SECRET_KEY = 'music-player.spotify.tokens';
const SPOTIFY_SCOPES = 'user-read-playback-state user-modify-playback-state streaming';
let sideBar;
function activate(context) {
    sideBar = new sidebar_1.SidebarProvider(context);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('music-player.sidebar', sideBar), vscode.commands.registerCommand('music-player.login', () => login(context)), vscode.commands.registerCommand('music-player.play', () => play(context)), vscode.commands.registerCommand('music-player.pause', () => pause(context)), vscode.commands.registerCommand('music-player.next', () => nextTrack(context)), vscode.commands.registerCommand('music-player.previous', () => previousTrack(context)));
}
function deactivate() {
    //nothing to clean up
}
function getClientId() {
    return vscode.workspace.getConfiguration('music-player').get('spotifyClientId');
}
async function login(context) {
    const clientId = getClientId();
    if (!clientId) {
        vscode.window.showErrorMessage('Spotify Client ID is not set. Please set it in the extension settings.');
        return;
    }
    const { verifier, challenge } = createPkcePair();
    const state = (0, crypto_1.randomBytes)(16).toString('hex');
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('scope', SPOTIFY_SCOPES);
    authUrl.searchParams.set('code_challenge_method', 'S256');
    authUrl.searchParams.set('code_challenge', challenge);
    authUrl.searchParams.set('scope', SPOTIFY_SCOPES);
    authUrl.searchParams.set('state', state);
    const server = (0, https_1.createServer)(getSelfSignedCert(), async (req, res) => {
        const targetUrl = new URL(req.url ?? '', `https://localhost:${REDIRECT_PORT}`);
        if (targetUrl.pathname !== '/callback') {
            res.writeHead(404).end();
            return;
        }
        const returnedState = targetUrl.searchParams.get('state');
        const code = targetUrl.searchParams.get('code');
        const error = targetUrl.searchParams.get('error');
        if (error || !code || returnedState !== state) {
            res.writeHead(400, { 'Content-Type': 'text/plain' }).end('Authentication failed. Please try again.');
            server.close();
            vscode.window.showErrorMessage('Spotify authentication failed. Please try again.');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' }).end('Authentication successful! You can close this tab.');
        server.close();
        const tokenSet = await exchangeCodeForToken({ code, verifier, clientId });
        if (!tokenSet) {
            vscode.window.showErrorMessage('Failed to obtain access token from Spotify. Please try again.');
            return;
        }
        await context.secrets.store(TOKEN_SECRET_KEY, JSON.stringify(tokenSet));
        sideBar?.setAccessToken(tokenSet.accessToken);
        vscode.window.showInformationMessage('Successfully authenticated with Spotify!');
    });
    server.listen(REDIRECT_PORT, () => {
        vscode.env.openExternal(vscode.Uri.parse(authUrl.toString()));
    });
}
async function callPlayerEndpoint(context, url, init) {
    const tokenSet = await ensureValidToken(context);
    if (!tokenSet) {
        vscode.window.showErrorMessage('Not authenticated with Spotify. Please log in.');
        return;
    }
    const response = await fetch(url, {
        ...init,
        headers: {
            'Authorization': `Bearer ${tokenSet.accessToken}`,
            'Content-Type': 'application/json',
            ...(init.headers || {})
        }
    });
    if (!response.ok) {
        const body = await safeReadBody(response);
        vscode.window.showErrorMessage(`Spotify API request failed: ${response.status} ${response.statusText} - ${body ?? 'No response body'}`);
        return;
    }
    return response;
}
async function play(context) {
    await callPlayerEndpoint(context, 'https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
    });
}
async function pause(context) {
    await callPlayerEndpoint(context, 'https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
    });
}
async function nextTrack(context) {
    await callPlayerEndpoint(context, 'https://api.spotify.com/v1/me/player/next', {
        method: 'POST',
    });
}
async function previousTrack(context) {
    await callPlayerEndpoint(context, 'https://api.spotify.com/v1/me/player/previous', {
        method: 'POST',
    });
}
async function ensureValidToken(context) {
    const clientId = getClientId();
    if (!clientId) {
        return undefined;
    }
    const stored = await loadTokenSet(context);
    if (!stored) {
        return undefined;
    }
    if (stored.expiresAt > Date.now() + 60000) {
        return stored;
    }
    const regreshed = await refreshToken(stored.refreshToken, clientId);
    if (!regreshed) {
        return undefined;
    }
    const updated = {
        accessToken: regreshed.access_token,
        refreshToken: regreshed.refresh_token ?? stored.refreshToken,
        expiresAt: Date.now() + regreshed.expires_in * 1000,
    };
    await context.secrets.store(TOKEN_SECRET_KEY, JSON.stringify(updated));
    sideBar?.setAccessToken(updated.accessToken);
    return updated;
}
async function exchangeCodeForToken(params) {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: params.code,
            redirect_uri: REDIRECT_URI,
            client_id: params.clientId,
            code_verifier: params.verifier
        })
    });
    if (!response.ok) {
        return undefined;
    }
    const token = await response.json();
    return {
        accessToken: token.access_token,
        refreshToken: token.refresh_token ?? '',
        expiresAt: Date.now() + token.expires_in * 1000
    };
}
async function refreshToken(refreshTokenValue, clientId) {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshTokenValue,
            client_id: clientId
        })
    });
    if (!response.ok) {
        return undefined;
    }
    return await response.json();
}
function getSelfSignedCert() {
    return {
        key: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC55zhfRzfqZPZ0
XY2+rN+lHLSl7v1YolBZRBIDFiQAeS8OUKc34jz/mA9Ai0q5/4rBG6RgD0pA0E1O
dCPlOl4cW6z1+/lgKE3TAYPj64vn1EixwQLSnGdtwVbYqFL1slYL955Y/VPeNyfK
8wBF+v699LdFW52FDN1QDYze4h3gRwHVQuqyDoBBq5ygmPM+B2kYOR7ZoeP6nc5J
YaonFFWVwtPi/0vtqYjrJP44LJpNote/nwJ5O0gFUIw4ngCOyHI7u3cnGtoCPDMs
bWcuw0Unyplho/KLDNArSkLSTZMMbFaWlv7HW202QXG5OZUk96H9nMgeX2IGUnf3
SbwHhnkxAgMBAAECggEAReIBcu+WuWoSq1OvwQnDWJId5nKckgESKzxHeRmNlw/2
/G6dLYjCXWKP+Tdjc9/4DPeTJvkYdJzZMrC9/aGfVxGvRxjdeaQs/TEIn1kgUpme
ahOgOAPLbZrMRs2fwfS0G/ONdu5j5JjfQI9wft4HfOjNLClwYV+gokM1vWNKz8+9
VdN2VMeWMRLcHXadvryYKIrYUDr/h/Lw92ur29lscISNDOPvb1brPJU9WmzZp8We
dn3bbjhvmfiZP5cOwt32vXhE63+a7Md8MMWAbaU6R7LwG/qmc+5g1nxBr4MoHLeJ
ieKPjAul0bcC55L8WMlcOJUFjNdckYuOVuCvmV96QQKBgQDkQF5hf2ZQI6u9oUBT
cjr073Ge82ZdR8MV4GD/rVRs+jNGQ/RQB64ZkNxEa0zquIDBoZO/+75k/oXxmQzm
9XRld6xxGbHy2ULJ7oVSxfWHc3L5Hwf28apiP3Qk/WULz/zC8qK4Tkysqc0nYvuP
AyX4GL2ikDG/QjVecVUFzJW0DQKBgQDQgOQ+S343wiEnBsyutDT1yhAFn8lkAK4n
KCd+y6lLTggIzjWLGRU4Xfp638NWazOP5vd/DMOx6bw7BXtA+5S1ZtaYR/g8cqTw
yIJGK/oCPF9b8DLMMCH+zvqRQrb8iMt0M89vA2++9Hu5X0iqW8jiB0ZUtmdlkpu1
XhA+av/ctQKBgQC5FRDzEjFOjn42eEkG4Tu5XWfOsiOxQ/2HAbjl2hD5hTCKq5Oy
SWf9Rx+1QyTNt+qAGJsMNABBOLo4HBkANsy5cn8b/u/ysgWcZJMreWYM/aqfI3B7
5553qGhvjiGfoHmfQsx7ktJNuCqo43SElNL3CGjNJwuPwQoxmMiOuUQzCQKBgEK8
ztHFtjvArn3gZkmRMtZte91g/MQ+l3+/EY07QQ/yhQ3UezzvpWQqaI9F6i9SFun7
osKO4mCjEPXPVllBbaL2rL+HYcRvaa4Mb+5oCxkGG/vAkXHcAjWeKIOwWAPTAVRL
dRzye6UieiumfQrSYCVA8NkSnVvcpmxSFF72Prl1AoGAcQHRG0maVZN1gQJHnJ8d
fiMq89n4i8JR1I3iakN2UzGS5pD1ecVm2VEl7xK/dV6jSovNDsuG7O9meHi/q2/x
3RokPIbL6LY/ZO9QMkZeW5U6EQU6HMIQMg9kzgSJHGueSyxrJHnwp264GP2U90n2
RhvWIxxd/NIigZYOBxzlJmc=
-----END PRIVATE KEY-----`,
        cert: `-----BEGIN CERTIFICATE-----
MIICpDCCAYwCCQCzhILdIbDgsjANBgkqhkiG9w0BAQsFADAUMRIwEAYDVQQDDAls
b2NhbGhvc3QwHhcNMjUxMjA4MDE1MTUwWhcNMjYxMjA4MDE1MTUwWjAUMRIwEAYD
VQQDDAlsb2NhbGhvc3QwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC5
5zhfRzfqZPZ0XY2+rN+lHLSl7v1YolBZRBIDFiQAeS8OUKc34jz/mA9Ai0q5/4rB
G6RgD0pA0E1OdCPlOl4cW6z1+/lgKE3TAYPj64vn1EixwQLSnGdtwVbYqFL1slYL
955Y/VPeNyfK8wBF+v699LdFW52FDN1QDYze4h3gRwHVQuqyDoBBq5ygmPM+B2kY
OR7ZoeP6nc5JYaonFFWVwtPi/0vtqYjrJP44LJpNote/nwJ5O0gFUIw4ngCOyHI7
u3cnGtoCPDMsbWcuw0Unyplho/KLDNArSkLSTZMMbFaWlv7HW202QXG5OZUk96H9
nMgeX2IGUnf3SbwHhnkxAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAEDQ4RVgOUd2
nl0UHVYpkcAw+JBRIcWE1xYiWiff9rzztbMHWNkGImcAQNm7/wSA/LMbgmwMD2Jw
v9qcc2ZlSicnTBsS+t4fc/xG11MFwFKUx2zCnMeCTDDgEw/odsOKdWnzi97SPYWQ
OQ/V4PiMzFpOWgVxzsDxv9A4JGSmTVy9kbBZ8nNOfXH6DfJ4Rhfet4JarxBkg4WJ
sR28Sc4WYoB19TTusvrnYCsvzOV/3//xgMGVqn0Kvgxp0BM99GNv7qpIk37vddz3
BTtbfLqytG0NcBhvoUiGo3NO8pmeS1xGHHK0b/ZHd7ugbpz3vPXK47hvja4vQX5g
ehRPdA5gOHU=
-----END CERTIFICATE-----`
    };
}
function createPkcePair() {
    const verifier = base64Url((0, crypto_1.randomBytes)(32));
    const challenge = base64Url((0, crypto_1.createHash)('sha256').update(verifier).digest());
    return { verifier, challenge };
}
function base64Url(buffer) {
    return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function loadTokenSet(context) {
    const raw = await context.secrets.get(TOKEN_SECRET_KEY);
    if (!raw) {
        return undefined;
    }
    try {
        const tokenSet = JSON.parse(raw);
        return tokenSet;
    }
    catch (e) {
        console.error('Failed to parse token set from secrets:', e);
        return undefined;
    }
}
async function safeReadBody(response) {
    try {
        return await response.text();
    }
    catch (error) {
        console.error('Failed to read response body', error);
        return undefined;
    }
}
//# sourceMappingURL=extension.js.map