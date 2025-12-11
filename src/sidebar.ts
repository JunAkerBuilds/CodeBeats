
import * as vscode from 'vscode';

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
			if (!message || !message.type) return;
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
			}
		});

		console.log('Webview resolution complete');
	}

	private getHtml(webview: vscode.Webview) {
		const nonce = getNonce();
		const isAuthenticated = !!this.accessToken;
		const hasClientId = !!this.getClientId();
		
		return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'nonce-${nonce}'; img-src https: data:; script-src 'nonce-${nonce}';">
			<style nonce="${nonce}">
				* {
					box-sizing: border-box;
					margin: 0;
					padding: 0;
				}
				
				/* Utility class for hiding elements (CSP-safe) */
				.hidden {
					display: none !important;
				}
				
				body {
					background: var(--vscode-editor-background);
					color: var(--vscode-foreground);
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
					padding: 0;
					margin: 0;
					font-size: 12px;
					overflow-x: hidden;
				}
				
				/* Animated gradient background */
				.bg-gradient {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					height: 150px;
					background: linear-gradient(135deg, rgba(29, 185, 84, 0.1) 0%, rgba(30, 215, 96, 0.05) 50%, transparent 100%);
					z-index: 0;
					pointer-events: none;
					animation: gradientShift 8s ease infinite;
				}
				
				@keyframes gradientShift {
					0%, 100% { opacity: 0.5; }
					50% { opacity: 0.7; }
				}
				
				.container {
					position: relative;
					z-index: 1;
					padding: 12px;
				}
				
				/* Theme-aware variables */
				:root {
					--card-bg: rgba(255, 255, 255, 0.03);
					--card-border: rgba(255, 255, 255, 0.08);
					--card-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
					--button-bg: rgba(255, 255, 255, 0.08);
					--button-hover-bg: rgba(255, 255, 255, 0.15);
					--border-color: rgba(255, 255, 255, 0.08);
					--overlay-bg: rgba(0, 0, 0, 0.3);
				}
				
				/* Light theme adjustments */
				body[data-vscode-theme-kind="vscode-light"],
				body[data-vscode-theme-kind="vscode-high-contrast-light"] {
					--card-bg: rgba(0, 0, 0, 0.04);
					--card-border: rgba(0, 0, 0, 0.1);
					--card-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
					--button-bg: rgba(0, 0, 0, 0.06);
					--button-hover-bg: rgba(0, 0, 0, 0.12);
					--border-color: rgba(0, 0, 0, 0.12);
					--overlay-bg: rgba(0, 0, 0, 0.15);
				}
				
				/* Light theme specific element adjustments */
				body[data-vscode-theme-kind="vscode-light"] .logo,
				body[data-vscode-theme-kind="vscode-high-contrast-light"] .logo {
					box-shadow: 0 2px 8px rgba(29, 185, 84, 0.2);
				}
				
				body[data-vscode-theme-kind="vscode-light"] .btn:hover,
				body[data-vscode-theme-kind="vscode-high-contrast-light"] .btn:hover {
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
				}
				
				body[data-vscode-theme-kind="vscode-light"] .btn-play-pause,
				body[data-vscode-theme-kind="vscode-high-contrast-light"] .btn-play-pause {
					box-shadow: 0 3px 12px rgba(29, 185, 84, 0.3);
				}
				
				body[data-vscode-theme-kind="vscode-light"] .btn-play-pause:hover,
				body[data-vscode-theme-kind="vscode-high-contrast-light"] .btn-play-pause:hover {
					box-shadow: 0 5px 20px rgba(29, 185, 84, 0.4);
				}
				
				/* Header */
				.header {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 12px;
					padding-bottom: 8px;
					border-bottom: 1px solid var(--border-color);
				}
				
				.header-left {
					display: flex;
					align-items: center;
					gap: 8px;
				}
				
				.header-right {
					display: flex;
					align-items: center;
					gap: 8px;
				}
				
				.logo {
					width: 24px;
					height: 24px;
					display: flex;
					align-items: center;
					justify-content: center;
					background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%);
					border-radius: 6px;
					box-shadow: 0 2px 8px rgba(29, 185, 84, 0.3);
				}
				
				.header-title {
					font-size: 13px;
					font-weight: 700;
					letter-spacing: -0.2px;
					background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-clip: text;
				}
				
				.status-pill {
					display: inline-flex;
					align-items: center;
					gap: 4px;
					padding: 4px 8px;
					border-radius: 12px;
					font-size: 9px;
					font-weight: 600;
					text-transform: uppercase;
					letter-spacing: 0.5px;
					background: rgba(255, 59, 48, 0.15);
					color: #ff3b30;
					border: 1px solid rgba(255, 59, 48, 0.3);
				}
				
				.status-pill.connected {
					background: rgba(29, 185, 84, 0.15);
					color: #1DB954;
					border: 1px solid rgba(29, 185, 84, 0.3);
				}
				
				.status-dot {
					width: 5px;
					height: 5px;
					border-radius: 50%;
					background: currentColor;
					animation: pulse 2s ease infinite;
				}
				
				@keyframes pulse {
					0%, 100% { opacity: 1; transform: scale(1); }
					50% { opacity: 0.6; transform: scale(0.9); }
				}
				
				/* View Toggle Button */
				.view-toggle-btn {
					width: 24px;
					height: 24px;
					padding: 4px;
					background: var(--button-bg);
					border: 1px solid var(--card-border);
					border-radius: 6px;
					cursor: pointer;
					display: flex;
					align-items: center;
					justify-content: center;
					transition: all 0.2s ease;
					opacity: 0.7;
				}
				
				.view-toggle-btn:hover {
					background: var(--button-hover-bg);
					opacity: 1;
					transform: scale(1.05);
				}
				
				.view-toggle-btn:active {
					transform: scale(0.95);
				}
				
				.view-toggle-btn svg {
					width: 14px;
					height: 14px;
					color: var(--vscode-foreground);
				}
				
				/* Compact View Styles - Horizontal Mini Player */
				body.compact-view .additional-controls,
				body.compact-view .control-label,
				body.compact-view .volume-control,
				body.compact-view .device-card,
				body.compact-view .up-next,
				body.compact-view .track-details,
				body.compact-view .progress-times,
				body.compact-view .sign-out-section {
					display: none !important;
				}
				
				/* Keep control-group but make it transparent wrapper */
				body.compact-view .control-group {
					background: transparent !important;
					padding: 0 !important;
					margin: 0 !important;
				}
				
				/* Make container relative for absolute positioning */
				body.compact-view .container {
					position: relative !important;
				}
				
				/* Position controls-section to overlay now-playing-card */
				body.compact-view .controls-section {
					position: absolute !important;
					top: 52px !important; /* After header */
					right: 20px !important; /* Moved in from edge */
					height: 72px !important; /* Height of compact card */
					width: auto !important;
					display: flex !important;
					align-items: center !important;
					pointer-events: none !important;
					padding: 0 !important;
					margin: 0 !important;
					background: transparent !important;
					z-index: 5 !important;
				}
				
				/* Position playback controls center-right inside music box */
				body.compact-view .playback-controls {
					display: flex !important;
					gap: 4px !important;
					margin: 0 !important;
					padding: 0 !important;
					grid-template-columns: none !important;
					flex-shrink: 0;
					position: relative !important;
					pointer-events: auto !important;
				}
				
				body.compact-view .now-playing-card {
					padding: 8px;
					margin-bottom: 8px;
					position: relative !important;
				}
				
				body.compact-view .album-container {
					display: flex !important;
					flex-direction: row !important;
					align-items: center !important;
					gap: 8px !important;
					margin: 0 0 4px 0 !important;
				}
				
				body.compact-view .album-art-wrapper {
					flex-shrink: 0 !important;
					width: 48px !important;
					height: 48px !important;
					margin: 0 !important;
					position: relative;
				}
				
				body.compact-view .album-art {
					width: 48px !important;
					height: 48px !important;
					border-radius: 6px !important;
					overflow: hidden;
					position: relative;
				}
				
				body.compact-view .album-art img {
					width: 100% !important;
					height: 100% !important;
					object-fit: cover;
					position: absolute;
					top: 0;
					left: 0;
					transform-origin: center center;
				}
				
				body.compact-view .album-art .vinyl-icon {
					font-size: 28px !important;
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100%;
					height: 100%;
				}
				
				/* Compact track info - hidden by default, shown in compact view */
				.compact-track-info {
					display: none;
					flex-direction: column;
					justify-content: center;
					flex: 1;
					min-width: 0;
				}
				
				body.compact-view .compact-track-info {
					display: flex !important;
					flex: 1 !important;
					min-width: 0 !important;
					padding-right: 105px !important; /* Space for 3 buttons */
				}
				
				.compact-track-name {
					font-size: 12px;
					font-weight: 700;
					color: var(--vscode-foreground);
					margin-bottom: 3px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					line-height: 1.3;
				}
				
				.compact-track-artist {
					font-size: 10px;
					color: var(--vscode-descriptionForeground);
					opacity: 0.8;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					line-height: 1.3;
				}
				
				body.compact-view .progress-container {
					margin-top: 4px !important;
					padding: 0 !important;
				}
				
				body.compact-view .progress-bar {
					height: 2px !important;
					margin: 0 !important;
				}
				
				body.compact-view .play-indicator {
					position: absolute !important;
					top: 2px !important;
					right: 2px !important;
					width: 16px !important;
					height: 16px !important;
					background: rgba(0, 0, 0, 0.6) !important;
					border-radius: 3px !important;
					padding: 2px !important;
				}
				
				body.compact-view .equalizer {
					gap: 1px !important;
					width: 100% !important;
					height: 100% !important;
				}
				
				body.compact-view .eq-bar {
					width: 2px !important;
				}
				
				/* Compact view buttons */
				body.compact-view .playback-controls button {
					padding: 4px !important;
					min-width: 28px !important;
					height: 28px !important;
					border-radius: 6px !important;
				}
				
				body.compact-view .btn-play-pause {
					padding: 5px !important;
					min-width: 32px !important;
					height: 28px !important;
				}
				
				body.compact-view .playback-controls svg {
					width: 14px !important;
					height: 14px !important;
				}
				
				body.compact-view .btn-play-pause svg {
					width: 16px !important;
					height: 16px !important;
				}
				
				/* Now Playing Card - Compact Record Player */
				.now-playing-card {
					background: var(--card-bg);
					backdrop-filter: blur(20px);
					-webkit-backdrop-filter: blur(20px);
					border: 1px solid var(--card-border);
					border-radius: 12px;
					padding: 16px;
					margin-bottom: 12px;
					position: relative;
					overflow: hidden;
					box-shadow: var(--card-shadow);
					transition: all 0.3s ease;
				}
				
				.now-playing-card:hover {
					border-color: rgba(29, 185, 84, 0.3);
					box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
				}
				
				.now-playing-card::before {
					content: '';
					position: absolute;
					top: -100%;
					left: -100%;
					width: 300%;
					height: 300%;
					background: radial-gradient(circle at center, rgba(29, 185, 84, 0.08) 0%, transparent 50%);
					pointer-events: none;
					transition: all 0.5s ease;
				}
				
				.now-playing-card.playing::before {
					animation: bgPulse 4s ease infinite;
				}
				
				@keyframes bgPulse {
					0%, 100% { transform: translate(0, 0); opacity: 0.4; }
					50% { transform: translate(10%, 10%); opacity: 0.6; }
				}
				
				/* Centered Record Player Layout */
				.album-container {
					display: flex;
					flex-direction: column;
					align-items: center;
					gap: 12px;
					position: relative;
					z-index: 1;
				}
				
				.album-art-wrapper {
					position: relative;
					flex-shrink: 0;
				}
				
				/* Large Vinyl Record Album Art */
				.album-art {
					width: 120px;
					height: 120px;
					border-radius: 50%;
					background: linear-gradient(135deg, rgba(29, 185, 84, 0.2) 0%, rgba(30, 215, 96, 0.1) 100%);
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative;
					overflow: hidden;
					box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5),
					            inset 0 0 0 8px rgba(0, 0, 0, 0.3),
					            inset 0 0 0 12px rgba(255, 255, 255, 0.05);
					transition: all 0.3s ease;
				}
				
				.album-art::after {
					content: '';
					position: absolute;
					width: 24px;
					height: 24px;
					background: radial-gradient(circle, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%);
					border-radius: 50%;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					z-index: 2;
				}
				
				.album-art:hover {
					transform: scale(1.05);
					box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6),
					            inset 0 0 0 8px rgba(0, 0, 0, 0.3),
					            inset 0 0 0 12px rgba(255, 255, 255, 0.05);
				}
				
				.album-art img {
					width: 100%;
					height: 100%;
					object-fit: cover;
					border-radius: 50%;
					transform-origin: center center;
				}
				
				.album-art.spinning img {
					animation: smoothSpin 8s linear infinite;
					transform-origin: center center;
				}
				
				@keyframes smoothSpin {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}
				
				.vinyl-icon {
					font-size: 48px;
					opacity: 0.4;
				}
				
				.play-indicator {
					position: absolute;
					bottom: 0;
					right: 0;
					width: 32px;
					height: 32px;
					background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%);
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					box-shadow: 0 4px 12px rgba(29, 185, 84, 0.6);
					border: 3px solid var(--vscode-editor-background);
					z-index: 3;
				}
				
				.equalizer {
					display: flex;
					gap: 2px;
					height: 14px;
					align-items: flex-end;
				}
				
				.eq-bar {
					width: 3px;
					background: white;
					border-radius: 2px;
					animation: equalize 0.8s ease-in-out infinite;
				}
				
				.eq-bar:nth-child(1) { animation-delay: 0s; }
				.eq-bar:nth-child(2) { animation-delay: 0.2s; }
				.eq-bar:nth-child(3) { animation-delay: 0.4s; }
				
				@keyframes equalize {
					0%, 100% { height: 40%; }
					50% { height: 100%; }
				}
				
				/* Centered Track Info */
				.track-details {
					text-align: center;
					width: 100%;
				}
				
				.track-name {
					font-size: 14px;
					font-weight: 700;
					margin-bottom: 4px;
					color: var(--vscode-foreground);
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					letter-spacing: -0.2px;
				}
				
				.track-artist {
					font-size: 11px;
					color: var(--vscode-descriptionForeground);
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					opacity: 0.8;
				}
				
				.track-album {
					font-size: 10px;
					color: var(--vscode-descriptionForeground);
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					opacity: 0.5;
					margin-top: 2px;
				}
				
				/* Up Next Section */
				.up-next {
					margin-top: 12px;
					padding-top: 12px;
					border-top: 1px solid rgba(255, 255, 255, 0.08);
				}
				
				.up-next-label {
					font-size: 9px;
					font-weight: 700;
					text-transform: uppercase;
					letter-spacing: 0.8px;
					color: var(--vscode-descriptionForeground);
					opacity: 0.5;
					margin-bottom: 6px;
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 4px;
				}
				
				.next-track-name {
					font-size: 12px;
					font-weight: 600;
					color: var(--vscode-foreground);
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					opacity: 0.9;
				}
				
				.next-track-artist {
					font-size: 10px;
					color: var(--vscode-descriptionForeground);
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					opacity: 0.6;
					margin-top: 2px;
				}
				
				/* Compact Progress Bar */
				.progress-container {
					margin-top: 12px;
					position: relative;
					z-index: 1;
					width: 100%;
				}
				
				.progress-times {
					display: flex;
					justify-content: space-between;
					font-size: 9px;
					color: var(--vscode-descriptionForeground);
					margin-bottom: 6px;
					opacity: 0.6;
				}
				
				.progress-bar {
					height: 3px;
					background: var(--button-hover-bg);
					border-radius: 3px;
					overflow: hidden;
					position: relative;
				}
				
				.progress-fill {
					height: 100%;
					background: linear-gradient(90deg, #1DB954 0%, #1ed760 100%);
					border-radius: 3px;
					transition: width 0.3s ease;
					box-shadow: 0 0 8px rgba(29, 185, 84, 0.5);
				}
				
				/* Compact No Playback State */
				.no-playback {
					text-align: center;
					padding: 24px 16px;
					color: var(--vscode-descriptionForeground);
				}
				
				.no-playback-icon {
					font-size: 40px;
					margin-bottom: 8px;
					opacity: 0.3;
					animation: float 3s ease-in-out infinite;
				}
				
				@keyframes float {
					0%, 100% { transform: translateY(0px); }
					50% { transform: translateY(-8px); }
				}
				
				.no-playback-text {
					font-size: 11px;
					opacity: 0.5;
				}
				
				/* Compact Auth Section */
				.auth-section {
					background: var(--card-bg);
					backdrop-filter: blur(20px);
					-webkit-backdrop-filter: blur(20px);
					border: 1px solid var(--card-border);
					border-radius: 12px;
					padding: 20px 16px;
					text-align: center;
					margin-bottom: 12px;
					box-shadow: var(--card-shadow);
				}
				
				.auth-icon {
					font-size: 40px;
					margin-bottom: 12px;
					display: block;
					animation: float 3s ease-in-out infinite;
				}
				
				.auth-section h3 {
					font-size: 14px;
					font-weight: 700;
					margin-bottom: 6px;
					letter-spacing: -0.2px;
				}
				
				.auth-section p {
					font-size: 11px;
					color: var(--vscode-descriptionForeground);
					line-height: 1.5;
					margin-bottom: 14px;
					opacity: 0.7;
				}
				
				/* Setup Section */
				.setup-section {
					background: var(--card-bg);
					backdrop-filter: blur(20px);
					-webkit-backdrop-filter: blur(20px);
					border: 1px solid var(--card-border);
					border-radius: 12px;
					padding: 24px 20px;
					margin-bottom: 12px;
					box-shadow: var(--card-shadow);
				}
				
				.setup-icon {
					font-size: 48px;
					text-align: center;
					margin-bottom: 16px;
					animation: float 3s ease-in-out infinite;
				}
				
				.setup-section h2 {
					font-size: 16px;
					font-weight: 700;
					text-align: center;
					margin-bottom: 8px;
					letter-spacing: -0.3px;
				}
				
				.setup-desc {
					font-size: 12px;
					color: var(--vscode-descriptionForeground);
					text-align: center;
					line-height: 1.6;
					margin-bottom: 24px;
					opacity: 0.8;
				}
				
				.setup-steps {
					display: flex;
					flex-direction: column;
					gap: 16px;
					margin-bottom: 20px;
				}
				
				.setup-step {
					display: flex;
					gap: 12px;
					align-items: flex-start;
				}
				
				.step-number {
					flex-shrink: 0;
					width: 28px;
					height: 28px;
					background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%);
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-weight: 700;
					font-size: 13px;
					color: white;
					box-shadow: 0 2px 8px rgba(29, 185, 84, 0.3);
				}
				
				.step-content {
					flex: 1;
				}
				
				.step-content h4 {
					font-size: 13px;
					font-weight: 600;
					margin-bottom: 4px;
					letter-spacing: -0.2px;
				}
				
				.step-content p {
					font-size: 11px;
					color: var(--vscode-descriptionForeground);
					line-height: 1.5;
					margin-bottom: 8px;
					opacity: 0.8;
				}
				
				.code-block {
					display: block;
					background: var(--vscode-textCodeBlock-background);
					border: 1px solid var(--card-border);
					border-radius: 4px;
					padding: 8px;
					font-family: 'SF Mono', Monaco, 'Courier New', monospace;
					font-size: 10px;
					color: #1ed760;
					word-break: break-all;
					margin-top: 6px;
				}
				
				.api-highlight {
					color: #1ed760;
					font-weight: 700;
				}
				
				.setup-complete {
					text-align: center;
					margin: 20px 0 16px;
					padding: 16px;
					background: rgba(29, 185, 84, 0.08);
					border: 1px solid rgba(29, 185, 84, 0.2);
					border-radius: 8px;
				}
				
				.setup-complete-text {
					font-size: 12px;
					color: var(--vscode-foreground);
					margin-bottom: 12px;
					opacity: 0.9;
				}
				
				.setup-help {
					text-align: center;
					padding-top: 16px;
					border-top: 1px solid var(--border-color);
				}
				
				.btn-link {
					background: transparent;
					color: var(--vscode-textLink-foreground);
					border: none;
					padding: 8px;
					font-size: 11px;
					opacity: 0.9;
				}
				
				.btn-link:hover {
					opacity: 1;
					background: var(--button-bg);
					text-decoration: underline;
				}
				
				/* Compact Buttons */
				.btn {
					background: var(--button-bg);
					color: var(--vscode-foreground);
					border: 1px solid var(--card-border);
					padding: 10px 12px;
					cursor: pointer;
					border-radius: 10px;
					font-size: 12px;
					font-family: inherit;
					font-weight: 600;
					transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 6px;
					position: relative;
					overflow: hidden;
				}
				
				.btn::before {
					content: '';
					position: absolute;
					top: 50%;
					left: 50%;
					width: 0;
					height: 0;
					border-radius: 50%;
					background: rgba(255, 255, 255, 0.1);
					transform: translate(-50%, -50%);
					transition: width 0.6s, height 0.6s;
				}
				
				.btn:hover::before {
					width: 300px;
					height: 300px;
				}
				
				.btn:hover {
					background: var(--button-hover-bg);
					border-color: rgba(29, 185, 84, 0.3);
					transform: translateY(-2px);
					box-shadow: 0 8px 16px var(--overlay-bg);
				}
				
				.btn:active {
					transform: translateY(0);
				}
				
				.btn svg {
					position: relative;
					z-index: 1;
				}
				
				.btn span {
					position: relative;
					z-index: 1;
				}
				
				.btn-spotify {
					background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%);
					color: white;
					border: none;
					padding: 12px 20px;
					font-size: 13px;
					box-shadow: 0 4px 16px rgba(29, 185, 84, 0.4);
				}
				
				.btn-spotify:hover {
					box-shadow: 0 6px 20px rgba(29, 185, 84, 0.6);
					transform: translateY(-2px);
				}
				
				.btn-logout {
					background: transparent;
					color: var(--vscode-descriptionForeground);
					border: 1px solid var(--vscode-input-border);
					padding: 8px 16px;
					font-size: 12px;
					opacity: 0.8;
				}
				
				.btn-logout:hover {
					opacity: 1;
					background: var(--vscode-button-secondaryBackground);
					color: var(--vscode-button-secondaryForeground);
				}
				
				.sign-out-section {
					display: ${isAuthenticated ? 'block' : 'none'};
					margin-top: 16px;
					padding-top: 16px;
					border-top: 1px solid var(--vscode-widget-border);
					text-align: center;
				}
				
				/* Compact Controls */
				.controls-section {
					display: ${isAuthenticated ? 'block' : 'none'};
				}
				
				.control-group {
					margin-bottom: 12px;
				}
				
				.control-label {
					font-size: 9px;
					font-weight: 700;
					text-transform: uppercase;
					letter-spacing: 0.8px;
					color: var(--vscode-descriptionForeground);
					margin-bottom: 8px;
					opacity: 0.5;
				}
				
				.playback-controls {
					display: grid;
					grid-template-columns: 1fr 1.3fr 1fr;
					gap: 6px;
					margin-bottom: 6px;
				}
				
				.btn-play-pause {
					background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%);
					color: white;
					border: none;
					box-shadow: 0 3px 12px rgba(29, 185, 84, 0.4);
					padding: 12px;
				}
				
				.btn-play-pause:hover {
					box-shadow: 0 4px 16px rgba(29, 185, 84, 0.6);
				}
				
				.btn-secondary {
					padding: 10px;
				}
				
				.btn-full-width {
					width: 100%;
					margin-top: 6px;
				}
				
				/* Volume Controls */
				.volume-control {
					display: flex;
					align-items: center;
					gap: 10px;
					padding: 10px 12px;
					background: var(--button-bg);
					border-radius: 8px;
					margin-top: 6px;
				}
				
				.volume-icon {
					width: 18px;
					height: 18px;
					flex-shrink: 0;
					opacity: 0.7;
					transition: all 0.2s ease;
					cursor: pointer;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				
				.volume-icon svg {
					width: 100%;
					height: 100%;
				}
				
				.volume-icon:hover {
					opacity: 1;
					transform: scale(1.1);
				}
				
				.volume-icon:active {
					transform: scale(0.95);
				}
				
				.volume-slider-container {
					flex: 1;
					position: relative;
				}
				
				.volume-slider {
					-webkit-appearance: none;
					appearance: none;
					width: 100%;
					height: 4px;
					background: var(--button-hover-bg);
					border-radius: 4px;
					outline: none;
					cursor: pointer;
					transition: all 0.2s ease;
					margin: 0;
					padding: 0;
					vertical-align: middle;
				}
				
				.volume-slider:hover {
					background: rgba(255, 255, 255, 0.15);
				}
				
				.volume-slider::-webkit-slider-thumb {
					-webkit-appearance: none;
					appearance: none;
					width: 14px;
					height: 14px;
					background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%);
					border-radius: 50%;
					cursor: pointer;
					box-shadow: 0 2px 8px rgba(29, 185, 84, 0.4);
					transition: all 0.2s ease;
					margin-top: -5px;
				}
				
				.volume-slider::-webkit-slider-thumb:hover {
					transform: scale(1.2);
					box-shadow: 0 3px 12px rgba(29, 185, 84, 0.6);
				}
				
				.volume-slider::-moz-range-thumb {
					width: 14px;
					height: 14px;
					background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%);
					border-radius: 50%;
					cursor: pointer;
					border: none;
					box-shadow: 0 2px 8px rgba(29, 185, 84, 0.4);
					transition: all 0.2s ease;
					margin-top: 0;
				}
				
				.volume-slider::-moz-range-thumb:hover {
					transform: scale(1.2);
					box-shadow: 0 3px 12px rgba(29, 185, 84, 0.6);
				}
				
				.volume-slider::-webkit-slider-runnable-track {
					height: 4px;
					background: transparent;
					border-radius: 4px;
				}
				
				.volume-slider::-moz-range-track {
					height: 4px;
					background: transparent;
					border-radius: 4px;
				}
				
				.volume-value {
					font-size: 10px;
					color: var(--vscode-descriptionForeground);
					min-width: 28px;
					text-align: right;
					opacity: 0.6;
					font-weight: 600;
				}
				
				/* Additional Controls */
				.additional-controls {
					display: flex;
					gap: 6px;
					margin-top: 8px;
				}
				
				.btn-icon-only {
					flex: 1;
					padding: 10px;
					display: flex;
					align-items: center;
					justify-content: center;
					background: var(--button-bg);
					border: 1px solid var(--card-border);
					transition: all 0.2s ease;
				}
				
				.btn-icon-only.active {
					background: rgba(29, 185, 84, 0.2);
					border-color: rgba(29, 185, 84, 0.4);
					color: #1DB954;
				}
				
				.btn-icon-only:hover {
					background: var(--button-hover-bg);
					border-color: var(--border-color);
				}
				
				.btn-icon-only.active:hover {
					background: rgba(29, 185, 84, 0.3);
					border-color: rgba(29, 185, 84, 0.5);
				}
				
				.btn-like {
					background: var(--button-bg);
				}
				
				.btn-like.liked {
					background: rgba(29, 185, 84, 0.2);
					border-color: rgba(29, 185, 84, 0.4);
					color: #1DB954;
				}
				
				.btn-like.liked svg {
					fill: #1DB954;
				}
				
				.heart-animation {
					animation: heartBeat 0.3s ease;
				}
				
				@keyframes heartBeat {
					0%, 100% { transform: scale(1); }
					25% { transform: scale(1.3); }
					50% { transform: scale(1.1); }
				}
				
				/* Compact Info Card */
				.device-card {
					background: var(--card-bg);
					border: 1px solid var(--card-border);
					border-radius: 8px;
					padding: 12px;
					margin-top: 12px;
				}
				
				.device-header {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 8px;
				}
				
				.device-info {
					display: flex;
					align-items: center;
					gap: 10px;
					flex: 1;
					min-width: 0;
				}
				
				.device-text {
					flex: 1;
					min-width: 0;
				}
				
				.device-label {
					font-size: 9px;
					text-transform: uppercase;
					letter-spacing: 0.5px;
					color: var(--vscode-descriptionForeground);
					opacity: 0.6;
					margin-bottom: 2px;
				}
				
				.device-name {
					font-size: 11px;
					font-weight: 500;
					color: var(--vscode-foreground);
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				
				.device-name.no-device {
					opacity: 0.5;
					font-style: italic;
				}
				
				.device-name.connected {
					color: #1ed760;
				}
				
				.info-card {
					background: rgba(30, 215, 96, 0.05);
					border: 1px solid rgba(30, 215, 96, 0.15);
					border-left: 2px solid #1ed760;
					padding: 10px 12px;
					border-radius: 6px;
					margin-top: 12px;
				}
				
				.info-card-title {
					font-size: 10px;
					font-weight: 700;
					color: #1ed760;
					margin-bottom: 4px;
					display: flex;
					align-items: center;
					gap: 4px;
				}
				
				.info-card-text {
					font-size: 10px;
					color: var(--vscode-descriptionForeground);
					line-height: 1.5;
					opacity: 0.7;
				}
				
				/* Compact SVG Icons */
				.icon {
					width: 14px;
					height: 14px;
					fill: currentColor;
				}
				
				.icon-lg {
					width: 18px;
					height: 18px;
				}
				
				.logo .icon {
					width: 14px;
					height: 14px;
				}
				
				/* Scrollbar */
				::-webkit-scrollbar {
					width: 8px;
				}
				
				::-webkit-scrollbar-track {
					background: transparent;
				}
				
				::-webkit-scrollbar-thumb {
					background: var(--button-bg);
					border-radius: 4px;
				}
				
				::-webkit-scrollbar-thumb:hover {
					background: var(--button-hover-bg);
				}
			</style>
		</head>
		<body>
			<div class="bg-gradient"></div>
			<div class="container">
			<div class="header">
					<div class="header-left">
						<div class="logo">
							<svg class="icon" viewBox="0 0 24 24" fill="white">
								<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
							</svg>
						</div>
						<div class="header-title">CodeBeats</div>
					</div>
					<div class="header-right">
						${isAuthenticated ? `
					<button id="view-toggle" class="view-toggle-btn" title="Toggle Compact View">
						<svg class="icon-expand" viewBox="0 0 24 24" fill="currentColor">
							<path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
						</svg>
						<svg class="icon-collapse hidden" viewBox="0 0 24 24" fill="currentColor">
							<path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
						</svg>
					</button>
						` : ''}
						<div class="status-pill ${isAuthenticated ? 'connected' : ''}">
							<span class="status-dot"></span>
							${isAuthenticated ? 'LIVE' : 'OFFLINE'}
						</div>
					</div>
			</div>

			${isAuthenticated ? `
					<div class="now-playing-card" id="now-playing-card">
						<div id="now-playing">
					<div class="no-playback">
								<div class="no-playback-icon">🎧</div>
								<div class="no-playback-text">Waiting for playback...</div>
					</div>
				</div>
					</div>
				` : !hasClientId ? `
					<div class="setup-section">
						<div class="setup-icon">🚀</div>
						<h2>Welcome to CodeBeats!</h2>
						<p class="setup-desc">To get started, you'll need to set up a free Spotify Developer app. It only takes 5 minutes!</p>
						
						<div class="setup-steps">
							<div class="setup-step">
								<div class="step-number">1</div>
								<div class="step-content">
									<h4>Create Spotify App</h4>
									<p>Go to Spotify Developer Dashboard and click "Create app"</p>
									<button id="open-spotify-dashboard" class="btn btn-secondary">
										<svg class="icon" viewBox="0 0 24 24" fill="currentColor">
											<path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
										</svg>
										Open Dashboard
									</button>
								</div>
							</div>
							
							<div class="setup-step">
								<div class="step-number">2</div>
								<div class="step-content">
									<h4>Add Redirect URI</h4>
									<p>In the form, add this redirect URI:</p>
									<code class="code-block">https://127.0.0.1:4567/callback</code>
								</div>
							</div>
							
							<div class="setup-step">
								<div class="step-number">3</div>
								<div class="step-content">
									<h4>Select API Type</h4>
									<p>In "Which API/SDKs", select <span class="api-highlight">Web API</span></p>
								</div>
							</div>
							
							<div class="setup-step">
								<div class="step-number">4</div>
								<div class="step-content">
									<h4>Copy Client ID</h4>
									<p>After saving, copy your Client ID from the app settings</p>
								</div>
							</div>
							
							<div class="setup-step">
								<div class="step-number">5</div>
								<div class="step-content">
									<h4>Configure Client ID in VS Code</h4>
									<p>Copy your Client ID and paste it in VS Code settings</p>
									<button id="open-settings" class="btn btn-secondary">
										<svg class="icon" viewBox="0 0 24 24" fill="currentColor">
											<path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
										</svg>
										Open Settings
									</button>
								</div>
							</div>
						</div>
						
						<div class="setup-complete">
							<p class="setup-complete-text">✅ Once you've configured your Client ID, click below to connect:</p>
							<button id="setup-connect-btn" class="btn btn-spotify">
								<svg class="icon-lg" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
								</svg>
						<span>Connect Spotify</span>
					</button>
						</div>
				</div>
			` : `
				<div class="auth-section">
						<span class="auth-icon">🎵</span>
						<h3>Connect to Spotify</h3>
						<p>Link your Spotify account to control playback directly from VS Code</p>
						<button id="login-btn" class="btn btn-spotify">
							<svg class="icon-lg" viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
							</svg>
							<span>Connect Account</span>
						</button>
				</div>
				`}

				<div class="controls-section">
					<div class="control-group">
						<div class="control-label">Playback Controls</div>
						<div class="playback-controls">
							<button id="prev-btn" class="btn btn-secondary">
								<svg class="icon" viewBox="0 0 24 24" fill="currentColor">
									<path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z"/>
								</svg>
							</button>
						<button id="play-pause-btn" class="btn btn-play-pause">
							<svg id="play-icon" class="icon-lg" viewBox="0 0 24 24" fill="currentColor">
								<path d="M8 5v14l11-7z"/>
							</svg>
							<svg id="pause-icon" class="icon-lg hidden" viewBox="0 0 24 24" fill="currentColor">
								<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
							</svg>
							</button>
							<button id="next-btn" class="btn btn-secondary">
								<svg class="icon" viewBox="0 0 24 24" fill="currentColor">
									<path d="M16 18h2V6h-2v12zM6 18l8.5-6L6 6v12z"/>
								</svg>
							</button>
						</div>
						<div class="additional-controls">
							<button id="shuffle-btn" class="btn btn-icon-only" title="Shuffle">
								<svg class="icon" viewBox="0 0 24 24" fill="currentColor">
									<path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
								</svg>
							</button>
							<button id="like-btn" class="btn btn-icon-only btn-like" title="Like">
								<svg class="icon" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
								</svg>
							</button>
							<button id="repeat-btn" class="btn btn-icon-only" title="Repeat Off">
								<svg class="icon" viewBox="0 0 24 24" fill="currentColor">
									<path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
								</svg>
						</button>
						</div>
					</div>

					<div class="control-group">
						<div class="control-label">Volume</div>
						<div class="volume-control">
							<div id="volume-icon" class="volume-icon" title="Click to mute/unmute">
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
								</svg>
				</div>
							<div class="volume-slider-container">
								<input 
									type="range" 
									id="volume-slider" 
									class="volume-slider" 
									min="0" 
									max="100" 
									value="50"
								/>
							</div>
							<span id="volume-value" class="volume-value">50%</span>
						</div>
					</div>
				</div>

				<div class="device-card" id="device-card">
					<div class="device-header">
						<div class="device-info">
							<svg class="icon" viewBox="0 0 24 24" fill="currentColor">
								<path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z"/>
							</svg>
							<div class="device-text">
								<div class="device-label">Device</div>
								<div class="device-name" id="device-name">No device selected</div>
							</div>
						</div>
						<button id="select-device-btn" class="btn btn-icon-only" title="Select Device">
							<svg class="icon" viewBox="0 0 24 24" fill="currentColor">
								<path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
							</svg>
						</button>
					</div>
				</div>
				
				<div class="sign-out-section">
					<button id="logout-btn" class="btn btn-logout">
						<svg class="icon" viewBox="0 0 24 24" fill="currentColor">
							<path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
						</svg>
						<span>Sign Out</span>
					</button>
				</div>
			</div>

			<script nonce="${nonce}">
				const vscode = acquireVsCodeApi();
				let isPlaying = false;
				let lastProgressMs = 0;
				let lastDurationMs = 0;
				let lastUpdateTime = 0;
				let animationFrameId = null;
				let currentTrackId = null; // Track current track ID to detect changes
				
				// Volume controls (declared at top level for access in updateNowPlaying)
				const volumeSlider = document.getElementById('volume-slider');
				const volumeValue = document.getElementById('volume-value');
				const volumeIcon = document.getElementById('volume-icon');
				let previousVolume = 50; // Store volume before muting
				let isUserAdjustingVolume = false; // Track if user is actively adjusting volume
				let lastUserSetVolume = null; // Track the last volume the user set
				let volumeUpdateTimestamp = 0; // Track when we last sent a volume update
				
				// Login button
				const loginBtn = document.getElementById('login-btn');
				if (loginBtn) {
					loginBtn.addEventListener('click', () => {
						vscode.postMessage({ type: 'login' });
					});
				}
				
				// Setup connect button (in setup UI)
				const setupConnectBtn = document.getElementById('setup-connect-btn');
				if (setupConnectBtn) {
					setupConnectBtn.addEventListener('click', () => {
						vscode.postMessage({ type: 'login' });
					});
				}
				
				// Logout button
				const logoutBtn = document.getElementById('logout-btn');
				if (logoutBtn) {
					logoutBtn.addEventListener('click', () => {
						vscode.postMessage({ type: 'logout' });
					});
				}
				
				// View toggle button
				const viewToggleBtn = document.getElementById('view-toggle');
				if (viewToggleBtn) {
					// Load saved preference
					const savedView = localStorage.getItem('codebeats-view-mode');
					if (savedView === 'compact') {
						document.body.classList.add('compact-view');
						viewToggleBtn.querySelector('.icon-expand').classList.add('hidden');
						viewToggleBtn.querySelector('.icon-collapse').classList.remove('hidden');
					}
					
					viewToggleBtn.addEventListener('click', () => {
						const isCompact = document.body.classList.toggle('compact-view');
						
						// Toggle icons
						const expandIcon = viewToggleBtn.querySelector('.icon-expand');
						const collapseIcon = viewToggleBtn.querySelector('.icon-collapse');
						if (isCompact) {
							expandIcon.classList.add('hidden');
							collapseIcon.classList.remove('hidden');
							localStorage.setItem('codebeats-view-mode', 'compact');
						} else {
							expandIcon.classList.remove('hidden');
							collapseIcon.classList.add('hidden');
							localStorage.setItem('codebeats-view-mode', 'full');
						}
					});
				}
				
				// Setup buttons
				const openDashboardBtn = document.getElementById('open-spotify-dashboard');
				if (openDashboardBtn) {
					openDashboardBtn.addEventListener('click', () => {
						vscode.postMessage({ type: 'openSpotifyDashboard' });
					});
				}
				
				const openSettingsBtn = document.getElementById('open-settings');
				if (openSettingsBtn) {
					openSettingsBtn.addEventListener('click', () => {
						vscode.postMessage({ type: 'openSettings' });
					});
				}
				
				
				// Select device button
				const selectDeviceBtn = document.getElementById('select-device-btn');
				if (selectDeviceBtn) {
					selectDeviceBtn.addEventListener('click', () => {
						vscode.postMessage({ type: 'selectDevice' });
					});
				}

				// Playback controls
				const playPauseBtn = document.getElementById('play-pause-btn');
				const playIcon = document.getElementById('play-icon');
				const pauseIcon = document.getElementById('pause-icon');
				const nextBtn = document.getElementById('next-btn');
				const prevBtn = document.getElementById('prev-btn');
				const shuffleBtn = document.getElementById('shuffle-btn');
				const repeatBtn = document.getElementById('repeat-btn');
				const likeBtn = document.getElementById('like-btn');
				
				if (playPauseBtn) {
					playPauseBtn.addEventListener('click', () => {
						vscode.postMessage({ type: 'togglePlayPause' });
					});
				}
				
				if (nextBtn) {
					nextBtn.addEventListener('click', () => {
						vscode.postMessage({ type: 'next' });
					});
				}
				
				if (prevBtn) {
					prevBtn.addEventListener('click', () => {
						vscode.postMessage({ type: 'previous' });
					});
				}
				
				// Additional controls
				if (shuffleBtn) {
					shuffleBtn.addEventListener('click', () => {
						vscode.postMessage({ type: 'toggleShuffle' });
					});
				}
				
				if (repeatBtn) {
					repeatBtn.addEventListener('click', () => {
						vscode.postMessage({ type: 'cycleRepeat' });
					});
				}
				
				if (likeBtn) {
					likeBtn.addEventListener('click', () => {
						const svg = likeBtn.querySelector('svg');
						if (svg) {
							svg.classList.add('heart-animation');
							setTimeout(() => svg.classList.remove('heart-animation'), 300);
						}
						vscode.postMessage({ type: 'toggleLike' });
					});
				}
				
				// Volume icon click to mute/unmute
				if (volumeIcon && volumeSlider && volumeValue) {
					volumeIcon.addEventListener('click', () => {
						const currentVolume = parseInt(volumeSlider.value);
						
						if (currentVolume > 0) {
							// Mute: save current volume and set to 0
							previousVolume = currentVolume;
							lastUserSetVolume = 0;
							volumeUpdateTimestamp = Date.now();
							volumeSlider.value = '0';
							volumeValue.textContent = '0%';
							updateVolumeIcon(0);
							vscode.postMessage({ type: 'setVolume', volume: 0 });
						} else {
							// Unmute: restore previous volume
							const restoreVolume = previousVolume || 50;
							lastUserSetVolume = restoreVolume;
							volumeUpdateTimestamp = Date.now();
							volumeSlider.value = restoreVolume.toString();
							volumeValue.textContent = restoreVolume + '%';
							updateVolumeIcon(restoreVolume);
							vscode.postMessage({ type: 'setVolume', volume: restoreVolume });
						}
						
						// Prevent playback updates from overriding for a short time
						isUserAdjustingVolume = true;
						setTimeout(() => {
							isUserAdjustingVolume = false;
						}, 500);
					});
				}
				
				// Volume slider event listener with debouncing
				if (volumeSlider && volumeValue) {
					let volumeUpdateTimeout = null;
					
					volumeSlider.addEventListener('mousedown', () => {
						// User started dragging
						isUserAdjustingVolume = true;
					});
					
					volumeSlider.addEventListener('touchstart', () => {
						// User started dragging on touch device
						isUserAdjustingVolume = true;
					});
					
					volumeSlider.addEventListener('input', (e) => {
						const volume = parseInt(e.target.value);
						lastUserSetVolume = volume;
						volumeValue.textContent = volume + '%';
						
						// Update icon based on volume
						updateVolumeIcon(volume);
						
						// Store as previous volume if not muting
						if (volume > 0) {
							previousVolume = volume;
						}
						
						// Debounce: Clear previous timeout and set a new one
						// This prevents rapid API calls while dragging the slider
						if (volumeUpdateTimeout) {
							clearTimeout(volumeUpdateTimeout);
						}
						
						// Only send API call after user stops dragging for 300ms
						volumeUpdateTimeout = setTimeout(() => {
							volumeUpdateTimestamp = Date.now();
							vscode.postMessage({ type: 'setVolume', volume: volume });
							volumeUpdateTimeout = null;
							// Keep flag true for a bit longer to prevent immediate override
							setTimeout(() => {
								isUserAdjustingVolume = false;
							}, 500);
						}, 300);
					});
					
					// Also send immediately on change event (when user releases slider)
					volumeSlider.addEventListener('change', (e) => {
						const volume = parseInt(e.target.value);
						lastUserSetVolume = volume;
						volumeUpdateTimestamp = Date.now();
						
						// Clear any pending timeout since we're sending immediately
						if (volumeUpdateTimeout) {
							clearTimeout(volumeUpdateTimeout);
							volumeUpdateTimeout = null;
						}
						
						vscode.postMessage({ type: 'setVolume', volume: volume });
						
						// Keep flag true for a bit to prevent immediate override from playback update
						setTimeout(() => {
							isUserAdjustingVolume = false;
						}, 500);
					});
					
					// Reset flag when user releases (mouseup/touchend)
					volumeSlider.addEventListener('mouseup', () => {
						// Flag will be reset after a delay in change handler
					});
					
					volumeSlider.addEventListener('touchend', () => {
						// Flag will be reset after a delay in change handler
					});
				}
				
				function updateVolumeIcon(volume) {
					if (!volumeIcon) return;
					
					const svg = volumeIcon.querySelector('svg');
					if (!svg) return;
					
					if (volume === 0) {
						// Muted icon with X
						svg.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
					} else if (volume < 50) {
						// Low volume icon
						svg.innerHTML = '<path d="M7 9v6h4l5 5V4l-5 5H7z"/>';
					} else {
						// High volume icon
						svg.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
					}
				}

				function formatTime(ms) {
					if (!ms) return '0:00';
					const minutes = Math.floor(ms / 60000);
					const seconds = Math.floor((ms % 60000) / 1000);
					return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
				}
				
				// Update device name display
				function updateDeviceName(deviceName) {
					const deviceNameEl = document.getElementById('device-name');
					if (!deviceNameEl) return;
					
					if (deviceName) {
						deviceNameEl.textContent = deviceName;
						deviceNameEl.classList.remove('no-device');
						deviceNameEl.classList.add('connected');
					} else {
						deviceNameEl.textContent = 'No device selected';
						deviceNameEl.classList.add('no-device');
						deviceNameEl.classList.remove('connected');
					}
				}
				
				// Smooth progress animation
				function animateProgress() {
					if (!isPlaying || !lastDurationMs) {
						return;
					}
					
					const now = Date.now();
					const elapsed = now - lastUpdateTime;
					const currentProgress = Math.min(lastProgressMs + elapsed, lastDurationMs);
					
					// Update progress bar
					const progressBar = document.querySelector('.progress-fill');
					const progressTimeSpan = document.querySelector('.progress-times span:first-child');
					
					if (progressBar && progressTimeSpan) {
						const percentage = (currentProgress / lastDurationMs) * 100;
						progressBar.style.width = percentage + '%';
						progressTimeSpan.textContent = formatTime(currentProgress);
					}
					
					// Continue animation
					if (currentProgress < lastDurationMs) {
						animationFrameId = requestAnimationFrame(animateProgress);
					}
				}
				
				function startProgressAnimation() {
					if (animationFrameId) {
						cancelAnimationFrame(animationFrameId);
					}
					animationFrameId = requestAnimationFrame(animateProgress);
				}
				
				function stopProgressAnimation() {
					if (animationFrameId) {
						cancelAnimationFrame(animationFrameId);
						animationFrameId = null;
					}
				}

				// Update now playing
				function updateNowPlaying(data) {
					const nowPlayingEl = document.getElementById('now-playing');
					const cardEl = document.getElementById('now-playing-card');
					if (!nowPlayingEl) return;

					if (!data || data.noDevice || !data.track) {
						nowPlayingEl.innerHTML = \`
							<div class="no-playback">
								<div class="no-playback-icon">🎧</div>
								<div class="no-playback-text">\${data?.noDevice ? 'No active device found' : 'Nothing playing'}</div>
							</div>
						\`;
						if (cardEl) cardEl.classList.remove('playing');
						isPlaying = false;
						currentTrackId = null;
						stopProgressAnimation();
						updatePlayPauseIcon();
						return;
					}

					// Check if track changed
					const trackChanged = currentTrackId !== data.trackId;
					currentTrackId = data.trackId;
					
					isPlaying = data.isPlaying;
					const spinClass = isPlaying ? 'spinning' : '';
					const progress = data.progressMs && data.durationMs ? (data.progressMs / data.durationMs) * 100 : 0;
					
					// Update progress tracking for smooth animation
					lastProgressMs = data.progressMs || 0;
					lastDurationMs = data.durationMs || 0;
					lastUpdateTime = Date.now();
					
					// Only replace HTML if track changed, otherwise just update dynamic elements
					if (trackChanged) {
						nowPlayingEl.innerHTML = \`
							<div class="album-container">
								<div class="album-art-wrapper">
								<div class="album-art \${spinClass}">
									\${data.albumArt ? 
										\`<img src="\${data.albumArt}" alt="Album art" />\` : 
											\`<span class="vinyl-icon">💿</span>\`
									}
								</div>
									\${isPlaying ? \`
										<div class="play-indicator">
											<div class="equalizer">
												<div class="eq-bar"></div>
												<div class="eq-bar"></div>
												<div class="eq-bar"></div>
											</div>
										</div>
									\` : ''}
								</div>
								<div class="compact-track-info">
									<div class="compact-track-name" title="\${data.track}">\${data.track}</div>
									<div class="compact-track-artist" title="\${data.artist}">\${data.artist || 'Unknown Artist'}</div>
								</div>
								<div class="track-details">
									<div class="track-name" title="\${data.track}">\${data.track}</div>
									<div class="track-artist" title="\${data.artist}">\${data.artist || 'Unknown Artist'}</div>
									\${data.album ? \`<div class="track-album" title="\${data.album}">\${data.album}</div>\` : ''}
								</div>
							</div>
							\${data.progressMs && data.durationMs ? \`
								<div class="progress-container">
									<div class="progress-times">
										<span>\${formatTime(data.progressMs)}</span>
										<span>\${formatTime(data.durationMs)}</span>
									</div>
									<div class="progress-bar">
										<div class="progress-fill" data-progress="\${progress}"></div>
									</div>
								</div>
							\` : ''}
							\${data.nextTrack ? \`
								<div class="up-next">
									<div class="up-next-label">
										<svg class="icon" viewBox="0 0 24 24" fill="currentColor">
											<path d="M16 18h2V6h-2v12zM6 18l8.5-6L6 6v12z"/>
										</svg>
										Up Next
									</div>
									<div class="next-track-name" title="\${data.nextTrack}">\${data.nextTrack}</div>
									<div class="next-track-artist" title="\${data.nextArtist}">\${data.nextArtist || 'Unknown Artist'}</div>
								</div>
							\` : ''}
						\`;
					} else {
						// Track hasn't changed, just update dynamic elements
						const albumArt = nowPlayingEl.querySelector('.album-art');
						if (albumArt) {
							// Update spinning class without recreating element
							if (isPlaying) {
								albumArt.classList.add('spinning');
							} else {
								albumArt.classList.remove('spinning');
							}
						}
						
						// Update play indicator
						const playIndicator = nowPlayingEl.querySelector('.play-indicator');
						if (isPlaying && !playIndicator) {
							const albumArtWrapper = nowPlayingEl.querySelector('.album-art-wrapper');
							if (albumArtWrapper) {
								const indicator = document.createElement('div');
								indicator.className = 'play-indicator';
								indicator.innerHTML = \`
									<div class="equalizer">
										<div class="eq-bar"></div>
										<div class="eq-bar"></div>
										<div class="eq-bar"></div>
									</div>
								\`;
								albumArtWrapper.appendChild(indicator);
							}
						} else if (!isPlaying && playIndicator) {
							playIndicator.remove();
						}
					}
					
					// Always update progress bar and times (even if track hasn't changed)
					const progressFill = document.querySelector('.progress-fill');
					const progressTimes = document.querySelectorAll('.progress-times span');
					if (progressFill) {
						progressFill.style.width = progress + '%';
					}
					if (progressTimes.length >= 2 && data.progressMs && data.durationMs) {
						progressTimes[0].textContent = formatTime(data.progressMs);
						progressTimes[1].textContent = formatTime(data.durationMs);
					}
					
					// Update device name
					updateDeviceName(data.deviceName);
					
					if (cardEl) {
						if (isPlaying) {
							cardEl.classList.add('playing');
							startProgressAnimation();
						} else {
							cardEl.classList.remove('playing');
							stopProgressAnimation();
						}
					}
					
					// Update volume slider if volume data is available
					// But don't update if user is actively adjusting or just adjusted volume
					if (data.volume !== undefined && volumeSlider && volumeValue) {
						const currentSliderVolume = parseInt(volumeSlider.value);
						const timeSinceLastUpdate = Date.now() - volumeUpdateTimestamp;
						
						// Don't update if:
						// 1. User is actively adjusting the slider
						// 2. User just set a volume (within last 2 seconds) and the values are close
						// 3. The difference is very small (less than 2) to avoid flicker
						const shouldUpdate = !isUserAdjustingVolume && 
							!(lastUserSetVolume !== null && timeSinceLastUpdate < 2000 && Math.abs(lastUserSetVolume - data.volume) <= 5) &&
							Math.abs(currentSliderVolume - data.volume) > 2;
						
						if (shouldUpdate) {
							volumeSlider.value = data.volume;
							volumeValue.textContent = data.volume + '%';
							updateVolumeIcon(data.volume);
							if (data.volume > 0) {
								previousVolume = data.volume;
							}
							// Reset the last user set volume since we've synced with server
							lastUserSetVolume = null;
						}
					}
					
					// Update shuffle button state
					if (shuffleBtn) {
						if (data.shuffleState) {
							shuffleBtn.classList.add('active');
							shuffleBtn.title = 'Shuffle On';
						} else {
							shuffleBtn.classList.remove('active');
							shuffleBtn.title = 'Shuffle Off';
						}
					}
					
					// Update repeat button state
					if (repeatBtn) {
						const svg = repeatBtn.querySelector('svg');
						if (svg) {
							if (data.repeatState === 'track') {
								repeatBtn.classList.add('active');
								repeatBtn.title = 'Repeat Track';
								// Repeat one icon
								svg.innerHTML = '<path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z"/>';
							} else if (data.repeatState === 'context') {
								repeatBtn.classList.add('active');
								repeatBtn.title = 'Repeat Context';
								// Repeat all icon
								svg.innerHTML = '<path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>';
							} else {
								repeatBtn.classList.remove('active');
								repeatBtn.title = 'Repeat Off';
								// Repeat off icon
								svg.innerHTML = '<path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>';
							}
						}
					}
					
					// Update like button state
					if (likeBtn) {
						if (data.isLiked) {
							likeBtn.classList.add('liked');
							likeBtn.title = 'Remove from Liked Songs';
						} else {
							likeBtn.classList.remove('liked');
							likeBtn.title = 'Add to Liked Songs';
						}
					}
					
					updatePlayPauseIcon();
				}
				
				function updatePlayPauseIcon() {
					if (playIcon && pauseIcon) {
						if (isPlaying) {
							playIcon.classList.add('hidden');
							pauseIcon.classList.remove('hidden');
						} else {
							playIcon.classList.remove('hidden');
							pauseIcon.classList.add('hidden');
						}
					}
				}

				// Listen for messages
				window.addEventListener('message', event => {
					const message = event.data;
					if (message.type === 'playbackInfo') {
						updateNowPlaying(message.data);
					}
				});

				// Fetch current playback if authenticated
				const authenticated = ${isAuthenticated};
				let pollInterval = null;
				
				if (authenticated) {
					vscode.postMessage({ type: 'getCurrentPlayback' });
					
					// Poll for updates only when playing
					pollInterval = setInterval(() => {
						if (isPlaying) {
							vscode.postMessage({ type: 'getCurrentPlayback' });
						}
					}, 2000);
				}
				
				// Clean up interval on page unload
				window.addEventListener('beforeunload', () => {
					if (pollInterval) {
						clearInterval(pollInterval);
					}
				});
			</script>
		</body>
		</html>`;
	}
}

function getNonce() {
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	return Array.from({ length: 16 }, () => possible.charAt(Math.floor(Math.random() * possible.length))).join('');
}
