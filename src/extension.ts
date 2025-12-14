import { createServer } from 'https';
import { createHash, randomBytes } from 'crypto';
import * as vscode from 'vscode';
import { SidebarProvider } from './sidebar';
import * as dotenv from 'dotenv';
import * as path from 'path';

type TokenSet = {
	accessToken: string;
	refreshToken: string;
	expiresAt: number;
}

type TokenResponse = {
	access_token: string;
	refresh_token?: string;
	expires_in: number;
}

const REDIRECT_PORT = 4567;
const REDIRECT_URI = `https://127.0.0.1:${REDIRECT_PORT}/callback`;
const TOKEN_SECRET_KEY = 'music-player.spotify.tokens';
const SPOTIFY_SCOPES = 'user-read-playback-state user-modify-playback-state user-library-read user-library-modify playlist-read-private playlist-read-collaborative';
const DEBUG = false; // Set to true for detailed API error logging

let sideBar: SidebarProvider | undefined;
let statusBarItem: vscode.StatusBarItem | undefined;
let authServer: ReturnType<typeof createServer> | undefined;
let authTimeout: NodeJS.Timeout | undefined;

export async function activate(context: vscode.ExtensionContext) {
	// Load environment variables from .env file
	const envPath = path.join(context.extensionPath, '.env');
	dotenv.config({ path: envPath });
	
	// Allow self-signed certificates for localhost development
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
	
	sideBar = new SidebarProvider(context);

	// Register for activity bar view
	const webviewProvider = vscode.window.registerWebviewViewProvider(
		'music-player.sidebar',
		sideBar,
		{
			webviewOptions: {
				retainContextWhenHidden: true
			}
		}
	);
	console.log('Activity bar webview provider registered:', webviewProvider);
	
	// Register for explorer view (using the same provider instance)
	const explorerWebviewProvider = vscode.window.registerWebviewViewProvider(
		'music-player.sidebar-explorer',
		sideBar,
		{
			webviewOptions: {
				retainContextWhenHidden: true
			}
		}
	);
	console.log('Explorer webview provider registered:', explorerWebviewProvider);

	const disposables = [
		webviewProvider,
		explorerWebviewProvider,
		vscode.commands.registerCommand('music-player.selectDevice', async () => {
			console.log('Select device command triggered');
			const devices = await listDevices(context);
			if (!devices || devices.length === 0) {
				vscode.window.showInformationMessage('No Spotify devices found. Open Spotify on a device and try again.');
				return;
			}
			const pick = await vscode.window.showQuickPick(
				devices.map(d => ({ label: d.name + (d.is_active ? ' — active' : ''), description: d.id, id: d.id })),
				{ placeHolder: 'Choose a device to transfer playback to' }
			);
			if (pick?.id) {
				await transferPlayback(context, pick.id, true);
			}
		}),
		vscode.commands.registerCommand('music-player.login', () => login(context)),
		vscode.commands.registerCommand('music-player.logout', () => logout(context)),
		vscode.commands.registerCommand('music-player.togglePlayPause', () => togglePlayPause(context)),
		vscode.commands.registerCommand('music-player.play', () => play(context)),
		vscode.commands.registerCommand('music-player.pause', () => pause(context)),
		vscode.commands.registerCommand('music-player.next', () => nextTrack(context)),
		vscode.commands.registerCommand('music-player.previous', () => previousTrack(context)),
		vscode.commands.registerCommand('music-player.getCurrentPlayback', () => getCurrentPlayback(context)),
		vscode.commands.registerCommand('music-player.setVolume', (volume: number) => setVolume(context, volume)),
		vscode.commands.registerCommand('music-player.toggleShuffle', () => toggleShuffle(context)),
		vscode.commands.registerCommand('music-player.cycleRepeat', () => cycleRepeat(context)),
		vscode.commands.registerCommand('music-player.toggleLike', () => toggleLike(context)),
		vscode.commands.registerCommand('music-player.getQueue', () => getQueue(context)),
		vscode.commands.registerCommand('music-player.getUserPlaylists', () => getUserPlaylists(context)),
		vscode.commands.registerCommand('music-player.playPlaylist', (playlistId: string) => playPlaylist(context, playlistId)),
		vscode.commands.registerCommand('music-player.playTrack', (trackId: string) => playTrack(context, trackId)),
	];

	// Create status bar item
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.command = 'music-player.statusBarClick';
	statusBarItem.text = '$(music) CodeBeats';
	statusBarItem.tooltip = 'Click to play/pause';
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);
	
	// Status bar click command
	const statusBarCommand = vscode.commands.registerCommand('music-player.statusBarClick', async () => {
		const playbackInfo = await getCurrentPlayback(context);
		if (playbackInfo?.isPlaying) {
			await pause(context);
		} else {
			await play(context);
		}
	});

	context.subscriptions.push(...disposables, statusBarCommand);
	
	// Load token and set it in sidebar on startup if we have a token
	loadTokenSet(context).then(token => {
		if (token) {
			sideBar?.setAccessToken(token.accessToken);
			// Start updating status bar
			startStatusBarUpdates(context);
		}
	});
	
}

// Update status bar with current track info
function startStatusBarUpdates(context: vscode.ExtensionContext) {
	const updateStatusBar = async () => {
		const playbackInfo = await getCurrentPlayback(context);
		if (!statusBarItem) return;
		
		if (playbackInfo && playbackInfo.track && !playbackInfo.noDevice) {
			const icon = playbackInfo.isPlaying ? '$(play)' : '$(debug-pause)';
			const trackInfo = `${playbackInfo.track} - ${playbackInfo.artist}`;
			statusBarItem.text = `${icon} ${trackInfo}`;
			statusBarItem.tooltip = `${trackInfo}\nClick to ${playbackInfo.isPlaying ? 'pause' : 'play'}`;
		} else {
			statusBarItem.text = '$(music) CodeBeats';
			statusBarItem.tooltip = 'No active playback';
		}
	};
	
	// Initial update
	updateStatusBar();
}

export function deactivate() {
	// Clean up auth server if it's still running
	if (authServer) {
		authServer.close();
		authServer = undefined;
	}
	if (authTimeout) {
		clearTimeout(authTimeout);
		authTimeout = undefined;
	}
}

function getClientId(): string | undefined {
	// First try to get from environment variable (.env file)
	const envClientId = process.env.SPOTIFY_CLIENT_ID;
	if (envClientId) {
		return envClientId;
	}
	
	// Try new setting name
	const newSetting = vscode.workspace.getConfiguration('codebeats').get<string>('spotifyClientId');
	if (newSetting) {
		return newSetting;
	}
	
	// Fallback to old setting name for backward compatibility
	return vscode.workspace.getConfiguration('music-player').get<string>('spotifyClientId');
}

async function login(context: vscode.ExtensionContext) {
	const clientId = getClientId();
	if (!clientId) {
		vscode.window.showInformationMessage('Welcome to CodeBeats! 🎵 Open the sidebar to connect your Spotify account.');
		return;
	}

	// Close any existing auth server and clear timeout
	if (authServer) {
		authServer.close();
		authServer = undefined;
	}
	if (authTimeout) {
		clearTimeout(authTimeout);
		authTimeout = undefined;
	}

	const { verifier, challenge } = createPkcePair(); 
	const state = randomBytes(16).toString('hex');
	const authUrl = new URL('https://accounts.spotify.com/authorize');
	authUrl.searchParams.set('response_type', 'code');
	authUrl.searchParams.set('client_id', clientId);
	authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
	authUrl.searchParams.set('scope', SPOTIFY_SCOPES.split(' ').join('+'));
	authUrl.searchParams.set('code_challenge_method', 'S256');
	authUrl.searchParams.set('code_challenge', challenge);
	authUrl.searchParams.set('state', state);

	const cleanup = () => {
		if (authServer) {
			authServer.close();
			authServer = undefined;
		}
		if (authTimeout) {
			clearTimeout(authTimeout);
			authTimeout = undefined;
		}
	};

	authServer = createServer(getSelfSignedCert(), async (req, res) => {
		const targetUrl = new URL(req.url ?? '', `https://127.0.0.1:${REDIRECT_PORT}`);
		if (targetUrl.pathname !== '/callback') {
			res.writeHead(404).end(); 
			return; 
		} 

		const returnedState = targetUrl.searchParams.get('state');
		const code = targetUrl.searchParams.get('code');
		const error = targetUrl.searchParams.get('error');
		if(error || !code || returnedState !== state){
			res.writeHead(400, {'Content-Type': 'text/plain'}).end('Authentication failed. Please try again.');
			cleanup();
			vscode.window.showErrorMessage('Spotify authentication failed. Please try again.');
			return; 
		}

		res.writeHead(200, {'Content-Type': 'text/plain'}).end('Authentication successful! You can close this tab.');
		cleanup();

		const tokenSet = await exchangeCodeForToken({code, verifier, clientId});
		if (!tokenSet){
			vscode.window.showErrorMessage('Failed to obtain access token from Spotify. Please try again.');
			return; 
		}
		
		await context.secrets.store(TOKEN_SECRET_KEY, JSON.stringify(tokenSet));
		sideBar?.setAccessToken(tokenSet.accessToken);
		vscode.window.showInformationMessage('Successfully authenticated with Spotify!');
	});

	// Set a timeout to close the server if no callback is received within 5 minutes
	authTimeout = setTimeout(() => {
		if (authServer) {
			authServer.close();
			authServer = undefined;
		}
		authTimeout = undefined;
		vscode.window.showWarningMessage('Authentication timed out. Please try connecting again.');
	}, 5 * 60 * 1000); // 5 minutes

	authServer.listen(REDIRECT_PORT, () => {
		vscode.env.openExternal(vscode.Uri.parse(authUrl.toString()));
	});

	// Handle server errors (e.g., port already in use)
	authServer.on('error', (err: NodeJS.ErrnoException) => {
		if (err.code === 'EADDRINUSE') {
			// Port is already in use - try to close existing server and retry
			vscode.window.showWarningMessage('Port is already in use. Closing existing connection and retrying...');
			cleanup();
			// Retry after a short delay
			setTimeout(() => {
				login(context);
			}, 1000);
		} else {
			cleanup();
			vscode.window.showErrorMessage(`Failed to start authentication server: ${err.message}`);
		}
	});

}

async function logout(context: vscode.ExtensionContext) {
	const confirm = await vscode.window.showWarningMessage(
		'Are you sure you want to sign out of Spotify? You will need to re-authenticate.',
		'Sign Out',
		'Cancel'
	);
	
	if (confirm !== 'Sign Out') {
		return;
	}
	
	// Clear stored tokens
	await context.secrets.delete(TOKEN_SECRET_KEY);
	
	// Clear sidebar access token
	sideBar?.setAccessToken(undefined);
	
	// Stop status bar updates
	if (statusBarItem) {
		statusBarItem.hide();
	}
	
	vscode.window.showInformationMessage('Successfully signed out of Spotify. Click "Connect Spotify" to sign in again.');
}


async function callPlayerEndpoint(context: vscode.ExtensionContext, url:string, init: RequestInit, retryCount = 0): Promise<Response | undefined>{
	const tokenSet = await ensureValidToken(context);
	if (!tokenSet){
		vscode.window.showErrorMessage('Not authenticated with Spotify. Please log in.');
		return; 
	}

	const maxRetries = 3;
	const baseDelay = 1000; // 1 second base delay

	const response = await fetch(url, {
		...init,
		headers: {
			'Authorization': `Bearer ${tokenSet.accessToken}`,
			'Content-Type': 'application/json',
			...(init.headers || {})
		}
	});

	if (!response.ok){
		const body = await safeReadBody(response);
		if (DEBUG) {
			console.error(`API Error - Endpoint: ${url} - Status: ${response.status} ${response.statusText} - Body: ${body ?? 'No response body'}`);
		}
		
		// Handle 429 (Rate Limit) with retry logic
		if (response.status === 429) {
			const retryAfter = response.headers.get('Retry-After');
			const delay = retryAfter ? parseInt(retryAfter) * 1000 : baseDelay * Math.pow(2, retryCount);
			
			if (retryCount < maxRetries) {
				if (DEBUG) {
					console.log(`Rate limited (429). Retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
				}
				
				// Wait before retrying with exponential backoff
				await new Promise(resolve => setTimeout(resolve, delay));
				
				// Retry the request
				return callPlayerEndpoint(context, url, init, retryCount + 1);
			} else {
				// Max retries reached
				const isVolumeEndpoint = url.includes('/volume');
				const errorMessage = isVolumeEndpoint 
					? 'Volume update rate limit exceeded. Please wait a moment before adjusting volume again.'
					: `Spotify API rate limit exceeded (429). Please wait a moment and try again.`;
				
				vscode.window.showWarningMessage(errorMessage);
				return undefined;
			}
		}
		
		if (response.status === 403) {
			const action = await vscode.window.showErrorMessage(
				`Spotify API access denied (403). Endpoint: ${url}. Your account must be added to the app allowlist in Developer Dashboard.`,
				'Open Dashboard'
			);
			
			if (action === 'Open Dashboard') {
				vscode.env.openExternal(vscode.Uri.parse('https://developer.spotify.com/dashboard'));
			}
		} else if (response.status === 404 && body?.includes('NO_ACTIVE_DEVICE')) {
			const action = await vscode.window.showInformationMessage(
				'No active Spotify device found. Please open Spotify on your computer, phone, or web player.',
				'Select Device',
				'Open Spotify Web'
			);
			
			if (action === 'Select Device') {
				vscode.commands.executeCommand('music-player.selectDevice');
			} else if (action === 'Open Spotify Web') {
				vscode.env.openExternal(vscode.Uri.parse('https://open.spotify.com'));
			}
		} else {
			vscode.window.showErrorMessage(`Spotify API request failed: ${response.status} ${response.statusText} - Endpoint: ${url} - ${body ?? 'No response body'}`);
		}
		return undefined; 
	}

	return response;
}


async function togglePlayPause(context: vscode.ExtensionContext) {
	// Get current playback state to determine what to do
	const playback = await getCurrentPlayback(context);
	
	if (!playback || playback.noDevice) {
		vscode.window.showInformationMessage('No active Spotify device found. Please open Spotify.');
		return;
	}
	
	// Toggle based on current state
	if (playback.isPlaying) {
		await callPlayerEndpoint(context, 'https://api.spotify.com/v1/me/player/pause', {
			method: 'PUT',
		});
	} else {
		await callPlayerEndpoint(context, 'https://api.spotify.com/v1/me/player/play', {
			method: 'PUT',
		});
	}
	
	// Update UI
	const updated = await getCurrentPlayback(context);
	sideBar?.sendPlaybackInfo(updated);
}

async function play(context: vscode.ExtensionContext) {
	await callPlayerEndpoint(context, 'https://api.spotify.com/v1/me/player/play', {
		method: 'PUT',
	});
	
	// Update UI
	const updated = await getCurrentPlayback(context);
	sideBar?.sendPlaybackInfo(updated);
}

async function pause(context:vscode.ExtensionContext) {
	await callPlayerEndpoint(context, 'https://api.spotify.com/v1/me/player/pause', {
		method: 'PUT',
	});
	
	// Update UI
	const updated = await getCurrentPlayback(context);
	sideBar?.sendPlaybackInfo(updated);
}

async function nextTrack(context: vscode.ExtensionContext) {
	await callPlayerEndpoint(context, 'https://api.spotify.com/v1/me/player/next', {
		method: 'POST',
	});
	
	// Update UI
	const updated = await getCurrentPlayback(context);
	sideBar?.sendPlaybackInfo(updated);
}

async function previousTrack(context: vscode.ExtensionContext) {
	await callPlayerEndpoint(context, 'https://api.spotify.com/v1/me/player/previous', {
		method: 'POST',
	});
	
	// Update UI
	const updated = await getCurrentPlayback(context);
	sideBar?.sendPlaybackInfo(updated);
}

async function getCurrentPlayback(context: vscode.ExtensionContext): Promise<any | undefined> {
	const tokenSet = await ensureValidToken(context);
	if (!tokenSet) {
		return undefined;
	}

	const url = 'https://api.spotify.com/v1/me/player';
	const response = await fetch(url, {
		headers: { Authorization: `Bearer ${tokenSet.accessToken}` }
	});

	if (!response.ok) {
		if (response.status === 204) {
			// No active device
			return { isPlaying: false, noDevice: true };
		}
		const body = await safeReadBody(response);
		if (DEBUG) {
			console.error(`API Error - Endpoint: ${url} - Status: ${response.status} ${response.statusText} - Body: ${body ?? 'No response body'}`);
		}
		return undefined;
	}

	const data = await safeJsonParse<any>(response);
	if (!data) {
		return undefined;
	}
	
	// Fetch the queue to get next track and full queue
	const queueData = await getQueue(context);
	
	// Check if current track is liked
	const trackId = data.item?.id;
	const isLiked = trackId ? await checkIfTrackIsLiked(context, trackId) : false;
	
	return {
		isPlaying: data.is_playing,
		track: data.item?.name,
		trackId: trackId,
		artist: data.item?.artists?.map((a: any) => a.name).join(', '),
		album: data.item?.album?.name,
		albumArt: data.item?.album?.images?.[0]?.url,
		progressMs: data.progress_ms,
		durationMs: data.item?.duration_ms,
		volume: data.device?.volume_percent,
		shuffleState: data.shuffle_state,
		repeatState: data.repeat_state, // off, track, context
		isLiked: isLiked,
		nextTrack: queueData?.nextTrack,
		nextArtist: queueData?.nextArtist,
		queue: queueData?.queue || [],
		deviceName: data.device?.name,
		deviceType: data.device?.type
	};
}

async function setVolume(context: vscode.ExtensionContext, volumePercent: number) {
	// Clamp volume between 0 and 100
	const volume = Math.max(0, Math.min(100, Math.round(volumePercent)));
	
	await callPlayerEndpoint(context, `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {
		method: 'PUT',
	});
	
	// Update UI
	const updated = await getCurrentPlayback(context);
	sideBar?.sendPlaybackInfo(updated);
}

async function toggleShuffle(context: vscode.ExtensionContext) {
	const playbackInfo = await getCurrentPlayback(context);
	const newShuffleState = !playbackInfo?.shuffleState;
	
	await callPlayerEndpoint(context, `https://api.spotify.com/v1/me/player/shuffle?state=${newShuffleState}`, {
		method: 'PUT',
	});
	
	// Update sidebar immediately
	const updated = await getCurrentPlayback(context);
	sideBar?.sendPlaybackInfo(updated);
}

async function cycleRepeat(context: vscode.ExtensionContext) {
	const playbackInfo = await getCurrentPlayback(context);
	const currentRepeat = playbackInfo?.repeatState || 'off';
	
	// Cycle: off -> context -> track -> off
	let newRepeat = 'off';
	if (currentRepeat === 'off') {
		newRepeat = 'context';
	} else if (currentRepeat === 'context') {
		newRepeat = 'track';
	}
	
	await callPlayerEndpoint(context, `https://api.spotify.com/v1/me/player/repeat?state=${newRepeat}`, {
		method: 'PUT',
	});
	
	// Update sidebar immediately
	const updated = await getCurrentPlayback(context);
	sideBar?.sendPlaybackInfo(updated);
}

async function checkIfTrackIsLiked(context: vscode.ExtensionContext, trackId: string): Promise<boolean> {
	const tokenSet = await ensureValidToken(context);
	if (!tokenSet) {
		return false;
	}

	const url = `https://api.spotify.com/v1/me/tracks/contains?ids=${trackId}`;
	const response = await fetch(url, {
		headers: { Authorization: `Bearer ${tokenSet.accessToken}` }
	});

	if (!response.ok) {
		const body = await safeReadBody(response);
		console.error(`🚨 API Error - Endpoint: ${url} - Status: ${response.status} ${response.statusText} - Body: ${body ?? 'No response body'}`);
		return false;
	}

	const data = await safeJsonParse<boolean[]>(response);
	if (!data || !Array.isArray(data) || data.length === 0) {
		return false;
	}
	return data[0] === true;
}

async function toggleLike(context: vscode.ExtensionContext) {
	const playbackInfo = await getCurrentPlayback(context);
	const trackId = playbackInfo?.trackId;
	
	if (!trackId) {
		vscode.window.showWarningMessage('No track currently playing');
		return;
	}
	
	const isLiked = playbackInfo?.isLiked;
	const tokenSet = await ensureValidToken(context);
	if (!tokenSet) {
		vscode.window.showErrorMessage('Not authenticated with Spotify. Please log in.');
		return;
	}
	
	const method = isLiked ? 'DELETE' : 'PUT';
	const url = `https://api.spotify.com/v1/me/tracks?ids=${trackId}`;
	const response = await fetch(url, {
		method: method,
		headers: {
			'Authorization': `Bearer ${tokenSet.accessToken}`,
			'Content-Type': 'application/json'
		}
	});
	
	if (response.ok) {
		const message = isLiked ? 'Removed from Liked Songs' : 'Added to Liked Songs';
		vscode.window.showInformationMessage(message);
		
		// Update sidebar immediately
		const updated = await getCurrentPlayback(context);
		sideBar?.sendPlaybackInfo(updated);
	} else {
		const body = await safeReadBody(response);
		if (DEBUG) {
			console.error(`API Error - Endpoint: ${url} - Status: ${response.status} ${response.statusText} - Body: ${body ?? 'No response body'}`);
		}
		vscode.window.showErrorMessage('Failed to update liked status');
	}
}

async function getQueue(context: vscode.ExtensionContext): Promise<{ nextTrack?: string; nextArtist?: string; queue?: Array<{ id: string; name: string; artist: string; albumArt?: string; durationMs?: number }> } | undefined> {
	const tokenSet = await ensureValidToken(context);
	if (!tokenSet) {
		return undefined;
	}

	const url = 'https://api.spotify.com/v1/me/player/queue';
	const response = await fetch(url, {
		headers: { Authorization: `Bearer ${tokenSet.accessToken}` }
	});

	if (!response.ok) {
		const body = await safeReadBody(response);
		if (DEBUG) {
			console.error(`API Error - Endpoint: ${url} - Status: ${response.status} ${response.statusText} - Body: ${body ?? 'No response body'}`);
		}
		return undefined;
	}

	const data = await safeJsonParse<any>(response);
	if (!data || !data.queue || !Array.isArray(data.queue)) {
		return undefined;
	}
	
	const nextTrack = data.queue[0];
	const queue = data.queue.map((track: any) => ({
		id: track.id,
		name: track.name,
		artist: track.artists?.map((a: any) => a.name).join(', ') || 'Unknown Artist',
		albumArt: track.album?.images?.[2]?.url || track.album?.images?.[1]?.url || track.album?.images?.[0]?.url,
		durationMs: track.duration_ms
	}));

	return {
		nextTrack: nextTrack?.name,
		nextArtist: nextTrack?.artists?.map((a: any) => a.name).join(', '),
		queue: queue
	};
}

// List available Spotify devices for the current user
async function listDevices(context: vscode.ExtensionContext): Promise<Array<{ id: string; name: string; is_active: boolean }>> {
	const tokenSet = await ensureValidToken(context);
	if (!tokenSet) {
		vscode.window.showErrorMessage('Not authenticated with Spotify. Please log in.');
		return [];
	}

	const url = 'https://api.spotify.com/v1/me/player/devices';
	const resp = await fetch(url, {
		headers: { Authorization: `Bearer ${tokenSet.accessToken}` }
	});

	if (!resp.ok) {
		const body = await safeReadBody(resp);
		if (DEBUG) {
			console.error(`API Error - Endpoint: ${url} - Status: ${resp.status} ${resp.statusText} - Body: ${body ?? 'No response body'}`);
		}
		
		if (resp.status === 403) {
			const action = await vscode.window.showErrorMessage(
				`Spotify API access denied (403 Forbidden). Endpoint: ${url}. Your account may not be on the app allowlist.`,
				'Open Dashboard',
				'Learn More'
			);
			
			if (action === 'Open Dashboard') {
				vscode.env.openExternal(vscode.Uri.parse('https://developer.spotify.com/dashboard'));
			} else if (action === 'Learn More') {
				vscode.env.openExternal(vscode.Uri.parse('https://developer.spotify.com/documentation/web-api/concepts/quota-modes'));
			}
		} else {
			vscode.window.showErrorMessage(`Failed to fetch devices: ${resp.status} ${resp.statusText} - Endpoint: ${url} - ${body ?? ''}`);
		}
		return [];
	}

	const data = await safeJsonParse<any>(resp);
	if (!data || !data.devices) {
		return [];
	}
	return (data.devices || []).map((d: any) => ({ id: d.id, name: d.name, is_active: d.is_active }));
}

// Get user's playlists
async function getUserPlaylists(context: vscode.ExtensionContext): Promise<Array<{ id: string; name: string; description: string; imageUrl?: string; owner: string; trackCount: number }>> {
	const tokenSet = await ensureValidToken(context);
	if (!tokenSet) {
		vscode.window.showErrorMessage('Not authenticated with Spotify. Please log in.');
		return [];
	}

	const playlists: Array<{ id: string; name: string; description: string; imageUrl?: string; owner: string; trackCount: number }> = [];
	let url = 'https://api.spotify.com/v1/me/playlists?limit=50';

	while (url) {
		const response = await fetch(url, {
			headers: { Authorization: `Bearer ${tokenSet.accessToken}` }
		});

		if (!response.ok) {
			const body = await safeReadBody(response);
			if (DEBUG) {
				console.error(`API Error - Endpoint: ${url} - Status: ${response.status} ${response.statusText} - Body: ${body ?? 'No response body'}`);
			}
			
			if (response.status === 403) {
				const action = await vscode.window.showErrorMessage(
					`Spotify API access denied (403 Forbidden). Playlist access requires playlist-read-private and playlist-read-collaborative scopes. Please re-authenticate.`,
					'Re-authenticate',
					'Learn More'
				);
				
				if (action === 'Re-authenticate') {
					vscode.commands.executeCommand('music-player.logout');
					setTimeout(() => vscode.commands.executeCommand('music-player.login'), 1000);
				} else if (action === 'Learn More') {
					vscode.env.openExternal(vscode.Uri.parse('https://developer.spotify.com/documentation/web-api/concepts/scopes'));
				}
			} else {
				vscode.window.showErrorMessage(`Failed to fetch playlists: ${response.status} ${response.statusText}`);
			}
			break;
		}

		const data = await safeJsonParse<any>(response);
		if (!data || !data.items) {
			break;
		}

		playlists.push(...data.items.map((playlist: any) => ({
			id: playlist.id,
			name: playlist.name,
			description: playlist.description || '',
			imageUrl: playlist.images?.[0]?.url || playlist.images?.[1]?.url,
			owner: playlist.owner?.display_name || playlist.owner?.id || 'Unknown',
			trackCount: playlist.tracks?.total || 0
		})));

		url = data.next || undefined;
	}

	return playlists;
}

// Play a playlist
async function playPlaylist(context: vscode.ExtensionContext, playlistId: string) {
	const tokenSet = await ensureValidToken(context);
	if (!tokenSet) {
		vscode.window.showErrorMessage('Not authenticated with Spotify. Please log in.');
		return;
	}

	const url = 'https://api.spotify.com/v1/me/player/play';
	const response = await fetch(url, {
		method: 'PUT',
		headers: {
			'Authorization': `Bearer ${tokenSet.accessToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			context_uri: `spotify:playlist:${playlistId}`
		})
	});

	if (!response.ok) {
		const body = await safeReadBody(response);
		if (DEBUG) {
			console.error(`API Error - Endpoint: ${url} - Status: ${response.status} ${response.statusText} - Body: ${body ?? 'No response body'}`);
		}
		
		if (response.status === 404 && body?.includes('NO_ACTIVE_DEVICE')) {
			const action = await vscode.window.showInformationMessage(
				'No active Spotify device found. Please open Spotify on your computer, phone, or web player.',
				'Select Device',
				'Open Spotify Web'
			);
			
			if (action === 'Select Device') {
				vscode.commands.executeCommand('music-player.selectDevice');
			} else if (action === 'Open Spotify Web') {
				vscode.env.openExternal(vscode.Uri.parse('https://open.spotify.com'));
			}
		} else {
			vscode.window.showErrorMessage(`Failed to play playlist: ${response.status} ${response.statusText}`);
		}
		return;
	}

	// Update UI after a short delay to allow playback to start
	setTimeout(async () => {
		const updated = await getCurrentPlayback(context);
		sideBar?.sendPlaybackInfo(updated);
	}, 1000);
}

// Play a specific track by ID (skip to it in queue without disrupting the queue)
async function playTrack(context: vscode.ExtensionContext, trackId: string) {
	const tokenSet = await ensureValidToken(context);
	if (!tokenSet) {
		vscode.window.showErrorMessage('Not authenticated with Spotify. Please log in.');
		return;
	}

	// Get current queue to find the position of the track
	const currentQueue = await getQueue(context);
	if (!currentQueue || !currentQueue.queue || currentQueue.queue.length === 0) {
		vscode.window.showInformationMessage('Queue is empty. Cannot skip to track.');
		return;
	}

	// Find the track in the queue
	const trackIndex = currentQueue.queue.findIndex((track: any) => track.id === trackId);
	if (trackIndex < 0) {
		vscode.window.showInformationMessage('Track not found in current queue.');
		return;
	}

	// Skip forward to the track (skip trackIndex times to reach it)
	// Note: trackIndex 0 is the next track, so we skip that many times
	for (let i = 0; i <= trackIndex; i++) {
		await callPlayerEndpoint(context, 'https://api.spotify.com/v1/me/player/next', {
			method: 'POST',
		});
		// Small delay between skips to avoid rate limiting and allow queue to update
		if (i < trackIndex) {
			await new Promise(resolve => setTimeout(resolve, 300));
		}
	}

	// Update UI after a short delay to allow playback to start
	setTimeout(async () => {
		const updated = await getCurrentPlayback(context);
		sideBar?.sendPlaybackInfo(updated);
	}, 1000);
}

// Transfer playback to the given device id
async function transferPlayback(context: vscode.ExtensionContext, deviceId: string, play = true) {
	const tokenSet = await ensureValidToken(context);
	if (!tokenSet) {
		vscode.window.showErrorMessage('Not authenticated with Spotify. Please log in.');
		return;
	}

	const url = 'https://api.spotify.com/v1/me/player';
	const resp = await fetch(url, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${tokenSet.accessToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ device_ids: [deviceId], play })
	});

	if (!resp.ok) {
		const body = await safeReadBody(resp);
		if (DEBUG) {
			console.error(`API Error - Endpoint: ${url} (PUT) - Status: ${resp.status} ${resp.statusText} - Body: ${body ?? 'No response body'}`);
		}
		vscode.window.showErrorMessage(`Failed to transfer playback: ${resp.status} ${resp.statusText} - Endpoint: ${url} - ${body ?? ''}`);
		return;
	}

	vscode.window.showInformationMessage('Playback transferred to selected device.');
}


async function ensureValidToken(context: vscode.ExtensionContext): Promise<TokenSet | undefined> {
	const clientId = getClientId();
	if(!clientId){
		return undefined; 
	} 

	const stored = await loadTokenSet(context);
	if (!stored){
		return undefined; 
	}

	if(stored.expiresAt > Date.now() + 60000){
		return stored; 
	}
	const regreshed = await refreshToken(stored.refreshToken, clientId);
	if (!regreshed){
		return undefined; 
	}

	const updated:TokenSet ={
		accessToken: regreshed.access_token,
		refreshToken: regreshed.refresh_token ?? stored.refreshToken,
		expiresAt: Date.now() + regreshed.expires_in * 1000,
	};

	await context.secrets.store(TOKEN_SECRET_KEY, JSON.stringify(updated));
	sideBar?.setAccessToken(updated.accessToken);
	return updated;

}

async function exchangeCodeForToken(params: { code: string; verifier: string; clientId: string }): Promise<TokenSet | undefined> {
	const url = 'https://accounts.spotify.com/api/token';
	const response = await fetch(url, {
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
		const body = await safeReadBody(response);
		if (DEBUG) {
			console.error(`API Error - Endpoint: ${url} (exchangeCodeForToken) - Status: ${response.status} ${response.statusText} - Body: ${body ?? 'No response body'}`);
		}
		return undefined;
	}

	const token = await safeJsonParse<TokenResponse>(response);
	if (!token || !token.access_token) {
		return undefined;
	}
	return {
		accessToken: token.access_token,
		refreshToken: token.refresh_token ?? '',
		expiresAt: Date.now() + token.expires_in * 1000
	};
}


async function refreshToken(refreshTokenValue: string, clientId: string): Promise<TokenResponse | undefined> {
	const url = 'https://accounts.spotify.com/api/token';
	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshTokenValue,
			client_id: clientId
		})
	});

	if (!response.ok) {
		const body = await safeReadBody(response);
		if (DEBUG) {
			console.error(`API Error - Endpoint: ${url} (refreshToken) - Status: ${response.status} ${response.statusText} - Body: ${body ?? 'No response body'}`);
		}
		return undefined;
	}

	return await safeJsonParse<TokenResponse>(response);
}

function getSelfSignedCert() {
	return {
		key: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDQ7EG0tqgbA/aU
sN43svXyOuU014Itj+/s15qp7pwgPSKircUtaBncIuJE/Dt2yCQX3F2601aO+ZIo
4CnUYYVpCZ7Z2c2uDM57D5NEH5NTcgixCAPgoPteCzmRpNeIzAFYCgOKGs7a1KBz
hv8AGCuRQUZCdjeVh1quiRewOOrnZX3JFJonZQXN1nYfa4bOP19e62HgyzIy4T2R
0kU/bAde58GLRRwHz9p9kpP116SgJUvBmbj3JLQmRHjYNG6dlPwc2ZFCpOUFepO4
4dfYhOsjqOtBXYv+l+OWgUElTGt1ZWl+Id2LJIl+GXZrEwGyZBYSCgEFgWZh34Nb
R5pco5GBAgMBAAECggEAbaWAunIeecczs0e76GmQ8Kb+QiRUmsru9VMWRdcHs1fC
hLRERpda8xCPxfrGzoktgCRUQMfHptPOZIt5CJCB7uVwrA7GBnGMMEO1W0xjCqlP
bHGzb0GtiubDOO/VemLu1aCzyNhW9bwf1WHlFMyamOo0EI9wjpZx/iXO+9pzVisX
1u8jfgUjUIqQ6LsRo31eS/9gj+UNpoYpu4gCzgMpoery4pDbJ0uQ/V6HrIBr6W0W
FqPemOOxvf1BpwbDcFZmXws9mWWzEq1sl0vv+/85yw8gIhOPpWAXO/+Lj22Nraao
sCwI9pzmJKiNYDKQ8Y8SfpNLpuFf78ms2epKMqkt3QKBgQDv1AYlMVPB5RkxJo/5
m6Ews/gNs+RgLh8F6n4hWZr9uNNI53McwBoTGt75t7voD4/LV+tfErlx3nvhTzNJ
NgIALO06dLbWRcb8XVUXKc9JDtChMgqHiWrLg2P9f0mCGAJoZYd5opwxtHC3+hDl
Esh7DmxxyILfPDSh4K4Ra4g/awKBgQDfArycceBH4OzVe2gwzehLEyOk6/6ebWDH
qXWSSKi4z3Nx1U9zN7tu8QlaMiOuvKdWqPJGDwFdDC40pWk9WQgnMTkX5jyAso24
NJUDIi9onqqcS6EYj8OpBJKLxVKvKrpBX+at7lbP3E5VkJbOTOqoGBATL3hgsDDk
xZBi/4GJwwKBgQCh/9lq1CgcqFFdBwxn8j1utZKQRvy0D1N7Xot2oZ11V5y4+Uaj
nAvA7fzCN98hASoDlE70eKR1i3CooCQnhujRD4frXZ2HnbitDaqFrANN+UjqKfA8
35EZCZbITGvuCaPOuw5JFpNla9pcG/m/kvGDVhngvi3Q900iL6/FKprtIwKBgFU+
e5Ala0CudnkH6gS1wHRqBXb2CmbOkm7flKRtB6lVCuDZU7xL8mZu1k9W2RLi4+gZ
PjqPY8sIa+UN0VN048vvYc6D4F6lYcymtMr010BbXgXOVu7HjVfe+pFYxMlWQMna
eZfEggSERqEoWqzS8+N7BzH+NDppPtdDuXRODFr3AoGAfdlMTGBxIlUWIE+EjXrh
sgikv63yRWFoyjrb8ugo5VDWTlcNuSeWO6cU5sWV7CieghA2Xw+lazXCOWKx8VaB
eLRJyGo6bOoa3fokHgs6QRkqVsQghTADdujy9hxsTjCaxYIbG24lhIwRseh4+nyk
YpAVmaftqMilE5tUfGj4Oa8=
-----END PRIVATE KEY-----`,
		cert: `-----BEGIN CERTIFICATE-----
MIICyTCCAbGgAwIBAgIJAPyglQNqntLeMA0GCSqGSIb3DQEBCwUAMBQxEjAQBgNV
BAMMCTEyNy4wLjAuMTAeFw0yNTEyMDgwMzQyMjBaFw0yNjEyMDgwMzQyMjBaMBQx
EjAQBgNVBAMMCTEyNy4wLjAuMTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBANDsQbS2qBsD9pSw3jey9fI65TTXgi2P7+zXmqnunCA9IqKtxS1oGdwi4kT8
O3bIJBfcXbrTVo75kijgKdRhhWkJntnZza4MznsPk0Qfk1NyCLEIA+Cg+14LOZGk
14jMAVgKA4oaztrUoHOG/wAYK5FBRkJ2N5WHWq6JF7A46udlfckUmidlBc3Wdh9r
hs4/X17rYeDLMjLhPZHSRT9sB17nwYtFHAfP2n2Sk/XXpKAlS8GZuPcktCZEeNg0
bp2U/BzZkUKk5QV6k7jh19iE6yOo60Fdi/6X45aBQSVMa3VlaX4h3YskiX4ZdmsT
AbJkFhIKAQWBZmHfg1tHmlyjkYECAwEAAaMeMBwwGgYDVR0RBBMwEYcEfwAAAYIJ
bG9jYWxob3N0MA0GCSqGSIb3DQEBCwUAA4IBAQB8NqgT57fkmm+m8qB5Suti3oxP
axYd7SiMGQk1TYo+MmUYtECWpQsF8RMrgbnNtGwoHaTl8/9EdwTGXSIujPOAoe/S
rTZrkybjMkR26I38RkgZYPCV7vrXa5qEZD6mPVWYo/1tEcB4oROejIDrKDzpOAWO
gO14BJjFtnIGxSD8vxN/Q15WRHfs9cP8PQopKNjAXoiZHHZ/khLnS6CeQYEIzWfb
msWHu1lCd6fs8L/zNc+wjHeeE2P4ZLLB3imtwYiwQV81wpcFYVkdhLYBNB/BkmKe
zpqXHf+zrjF0INz8Tk5iXyFl2UId2FgCKcYESfUXVgXa90nr7XxkMaXlMgBr
-----END CERTIFICATE-----`
	};
}

function createPkcePair() {
	const verifier = base64Url(randomBytes(32));
	const challenge = base64Url(createHash('sha256').update(verifier).digest());
	return { verifier, challenge };
}

function base64Url(buffer: Buffer) {
	return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}


async function loadTokenSet(context: vscode.ExtensionContext): Promise<TokenSet | undefined> {
	const raw = await context.secrets.get(TOKEN_SECRET_KEY);
	if (!raw || raw.trim().length === 0) {
		return undefined;
	}
	
	try {
		const tokenSet = JSON.parse(raw) as TokenSet;
		return tokenSet;
	} catch (e) {
		console.error('Failed to parse token set from secrets:', e);
		// Clear corrupted token
		await context.secrets.delete(TOKEN_SECRET_KEY);
		return undefined;
	}
} 

async function safeReadBody(response: Response): Promise<string | undefined> {
	try {
		return await response.text();
	} catch (error) {
		console.error('Failed to read response body', error);
		return undefined;
	}
}

async function safeJsonParse<T>(response: Response): Promise<T | undefined> {
	try {
		const text = await response.text();
		if (!text || text.trim().length === 0) {
			return undefined;
		}
		return JSON.parse(text) as T;
	} catch (error) {
		console.error('Failed to parse JSON response:', error);
		return undefined;
	}
}
