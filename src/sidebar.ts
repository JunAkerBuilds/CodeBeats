
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class SidebarProvider implements vscode.WebviewViewProvider {
	private views: vscode.WebviewView[] = [];
	private accessToken?: string;

	constructor(private readonly context: vscode.ExtensionContext) {}

	setAccessToken(token: string | undefined) {
		this.accessToken = token;
		// Refresh all views to show authenticated state
		this.views.forEach(view => {
			view.webview.html = this.getHtmlForWebview(view.webview);
		});
	}
	
	private getClientId(): string | undefined {
		// Check .env first
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

	sendPlaybackInfo(info: any) {
		// Send to all registered views
		this.views.forEach(view => {
			view.webview.postMessage({ type: 'playbackInfo', data: info });
		});
	}

	getHtmlForWebview(webview: vscode.Webview): string {
		return this.getHtml(webview);
	}

	resolveWebviewView(webviewView: vscode.WebviewView) {
		console.log('resolveWebviewView called for:', webviewView.title);
		
		// Add to views array if not already present
		if (!this.views.includes(webviewView)) {
			this.views.push(webviewView);
		}
		
		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [this.context.extensionUri]
		};

		webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
		
		// Remove from array when disposed
		webviewView.onDidDispose(() => {
			const index = this.views.indexOf(webviewView);
			if (index > -1) {
				this.views.splice(index, 1);
			}
		});

		// Handle button clicks from the webview
		webviewView.webview.onDidReceiveMessage(async message => {
			if (!message || !message.type) {
				return;
			}
			switch (message.type) {
				case 'selectDevice':
					vscode.commands.executeCommand('music-player.selectDevice');
					break;
				case 'togglePlayPause':
					vscode.commands.executeCommand('music-player.togglePlayPause');
					break;
				case 'play':
					vscode.commands.executeCommand('music-player.play');
					break;
				case 'pause':
					vscode.commands.executeCommand('music-player.pause');
					break;
				case 'next':
					vscode.commands.executeCommand('music-player.next');
					break;
				case 'previous':
					vscode.commands.executeCommand('music-player.previous');
					break;
				case 'login':
					vscode.commands.executeCommand('music-player.login');
					break;
				case 'logout':
					vscode.commands.executeCommand('music-player.logout');
					break;
				case 'openSpotifyDashboard':
					vscode.env.openExternal(vscode.Uri.parse('https://developer.spotify.com/dashboard/create'));
					break;
				case 'openSettings':
					vscode.commands.executeCommand('workbench.action.openSettings', 'codebeats.spotifyClientId');
					break;
				case 'getCurrentPlayback':
					const result = await vscode.commands.executeCommand('music-player.getCurrentPlayback');
					this.sendPlaybackInfo(result);
					break;
				case 'setVolume':
					vscode.commands.executeCommand('music-player.setVolume', message.volume);
					break;
				case 'toggleShuffle':
					vscode.commands.executeCommand('music-player.toggleShuffle');
					break;
				case 'cycleRepeat':
					vscode.commands.executeCommand('music-player.cycleRepeat');
					break;
				case 'toggleLike':
					vscode.commands.executeCommand('music-player.toggleLike');
					break;
				case 'getQueue':
					const queueResult = await vscode.commands.executeCommand('music-player.getQueue');
					// Send queue data to webview
					webviewView.webview.postMessage({ type: 'queueData', data: queueResult });
					break;
				case 'getUserPlaylists':
					const playlistsResult = await vscode.commands.executeCommand('music-player.getUserPlaylists');
					// Send playlists data to webview
					webviewView.webview.postMessage({ type: 'playlistsData', data: playlistsResult });
					break;
				case 'playPlaylist':
					vscode.commands.executeCommand('music-player.playPlaylist', message.playlistId);
					break;
			}
		});

		console.log('Webview resolution complete');
	}

	private getHtml(webview: vscode.Webview) {
		const nonce = getNonce();
		const isAuthenticated = !!this.accessToken;
		const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src', 'sidebar', 'sidebar.css'));
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src', 'sidebar', 'sidebar.js'));
		const iconUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'icon.png'));
		const hasClientId = !!this.getClientId();
		
		try {
			const htmlTemplate = this.readSidebarFile('src', 'sidebar.html');
			return this.applyTemplateVariables(htmlTemplate, {
				AUTHENTICATED: String(isAuthenticated),
				CSP_SOURCE: webview.cspSource,
				CSS_URI: cssUri.toString(),
				HEADER_BUTTONS: this.getHeaderButtons(isAuthenticated),
				ICON_URI: iconUri.toString(),
				MAIN_CONTENT: this.getMainContent(isAuthenticated, hasClientId),
				NONCE: nonce,
				SCRIPT_URI: scriptUri.toString(),
				STATUS_CLASS: isAuthenticated ? 'connected' : '',
				STATUS_TEXT: isAuthenticated ? 'LIVE' : 'OFFLINE'
			});
		} catch (error) {
			console.error('Error loading HTML template:', error);
			// Fallback to inline template if external file not found
			return this.getInlineHtmlFallback(webview, nonce, isAuthenticated, iconUri);
		}
	}
	
	private getInlineHtmlFallback(webview: vscode.Webview, nonce: string, isAuthenticated: boolean, iconUri: vscode.Uri): string {
		// Fallback inline HTML in case the external template file is not found
		return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'nonce-${nonce}'; img-src ${webview.cspSource} https: data:; script-src 'nonce-${nonce}';">
			<style nonce="${nonce}">
				:root {
					--color-primary: #1DB954;
					--color-primary-dark: #1aa34a;
				}
				body {
					margin: 0;
					padding: 12px;
					background: var(--vscode-editor-background);
					color: var(--vscode-foreground);
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
					font-size: 12px;
					line-height: 1.5;
				}
				.container {
					max-width: 100%;
				}
				.card {
					background: var(--vscode-editor-background);
					border: 1px solid var(--vscode-editorWidget-border);
					padding: 12px;
					border-radius: 8px;
					margin-bottom: 8px;
				}
				.btn {
					background: var(--color-primary);
					color: white;
					border: none;
					padding: 8px 12px;
					border-radius: 6px;
					cursor: pointer;
					font-size: 12px;
					font-weight: 600;
				}
				.btn:hover {
					background: var(--color-primary-dark);
				}
			</style>
		</head>
		<body>
			<div class="container">
				<div class="card">
					<h2>CodeBeats</h2>
					${isAuthenticated 
						? '<p>✅ Connected to Spotify</p>' 
						: '<p>Connect your Spotify account to start using CodeBeats!</p><button class="btn" onclick="vscode.postMessage({type: \'login\'})">Connect Spotify</button>'}
				</div>
			</div>
			<script nonce="${nonce}">
				const vscode = acquireVsCodeApi();
			</script>
		</body>
		</html>`;
	}
	
	private readSidebarFile(...pathSegments: string[]): string {
		return fs.readFileSync(path.join(this.context.extensionPath, ...pathSegments), 'utf-8');
	}

	private applyTemplateVariables(template: string, values: Record<string, string>): string {
		return Object.entries(values).reduce((output, [key, value]) => {
			return output.replace(new RegExp(`{{${key}}}`, 'g'), value);
		}, template);
	}

	private getHeaderButtons(isAuthenticated: boolean): string {
		if (!isAuthenticated) {
			return '';
		}
		return this.readSidebarFile('src', 'sidebar', 'templates', 'header-buttons.html');
	}

	private getMainContent(isAuthenticated: boolean, hasClientId: boolean): string {
		if (isAuthenticated) {
			const authenticatedSections = [
				'now-playing.html',
				'controls.html',
				'device.html',
				'playlists.html',
				'sign-out.html'
			];
			return authenticatedSections
				.map(file => this.readSidebarFile('src', 'sidebar', 'templates', file))
				.join('\n');
		}

		if (!hasClientId) {
			return this.readSidebarFile('src', 'sidebar', 'templates', 'setup-state.html');
		}

		return this.readSidebarFile('src', 'sidebar', 'templates', 'auth-state.html');
	}
}

function getNonce() {
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	return Array.from({ length: 16 }, () => possible.charAt(Math.floor(Math.random() * possible.length))).join('');
}
