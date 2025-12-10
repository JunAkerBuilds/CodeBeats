"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarProvider = void 0;
class SidebarProvider {
    context;
    view;
    accessToken;
    constructor(context) {
        this.context = context;
    }
    setAccessToken(token) {
        this.accessToken = token;
        this.view?.webview.postMessage({ type: 'auth', token });
    }
    resolveWebviewView(webviewView) {
        this.view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.context.extensionUri]
        };
        webviewView.webview.html = this.getHtml(webviewView.webview);
        if (this.accessToken) {
            webviewView.webview.postMessage({ type: 'auth', token: this.accessToken });
        }
    }
    getHtml(webview) {
        const nonce = getNonce();
        const csp = [
            "default-src 'none'",
            `img-src ${webview.cspSource} https:`,
            `style-src 'nonce-${nonce}' ${webview.cspSource}`,
            `script-src 'nonce-${nonce}' https://sdk.scdn.co`,
            "media-src https://*.spotifycdn.com https://*.scdn.co blob:",
            `connect-src https://api.spotify.com https://sdk.scdn.co https://*.spotify.com https://*.spotifycdn.com ${webview.cspSource}`
        ].join('; ');
        return /* html */ `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="${csp}">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<style nonce="${nonce}">
					body {
						background: var(--vscode-editor-background);
						color: var(--vscode-foreground);
						font-family: var(--vscode-font-family);
						padding: 12px;
					}
					h3 {
						margin-top: 0;
					}
					.status {
						margin: 8px 0 0;
						font-size: 12px;
						color: var(--vscode-descriptionForeground);
					}
				</style>
			</head>
			<body>
				<h3>Spotify Player</h3>
				<div id="status" class="status">Run “Music Player: Connect Spotify” to start.</div>
				<script nonce="${nonce}">
					const vscode = acquireVsCodeApi();
					let player;
					let latestToken;

					window.addEventListener('message', event => {
						if (event.data?.type === 'auth') {
							latestToken = event.data.token;
							startPlayer();
						}
					});

					function startPlayer() {
						if (!latestToken) {
							setStatus('Waiting for Spotify authentication…');
							return;
						}

						const createPlayer = () => {
							if (player) {
								player.disconnect();
							}

							player = new Spotify.Player({
								name: 'VS Code Music Player',
								getOAuthToken: cb => cb(latestToken),
								volume: 0.5
							});

							player.addListener('ready', ({ device_id }) => {
								setStatus('Ready. Select "VS Code Music Player" in your Spotify devices to route audio here.');
								console.log('Ready with Device ID', device_id);
							});

							player.addListener('not_ready', () => {
								setStatus('Player is not ready. Check your connection and try again.');
							});

							player.connect();
						};

						if (window.Spotify) {
							createPlayer();
							return;
						}

						const script = document.createElement('script');
						script.id = 'spotify-sdk';
						script.src = 'https://sdk.scdn.co/spotify-player.js';
						script.onload = () => window.onSpotifyWebPlaybackSDKReady?.();
						document.body.appendChild(script);
						window.onSpotifyWebPlaybackSDKReady = createPlayer;
					}

					function setStatus(message) {
						const el = document.getElementById('status');
						if (el) {
							el.textContent = message;
						}
					}
				</script>
			</body>
			</html>
		`;
    }
}
exports.SidebarProvider = SidebarProvider;
function getNonce() {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 16 }, () => possible.charAt(Math.floor(Math.random() * possible.length))).join('');
}
//# sourceMappingURL=sidebar.js.map