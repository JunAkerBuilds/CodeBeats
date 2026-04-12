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
const aestheticFooter = document.getElementById('aesthetic-footer');

let setViewMode = () => {};

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
	const expandIcon = viewToggleBtn.querySelector('.icon-expand');
	const collapseIcon = viewToggleBtn.querySelector('.icon-collapse');
	
	setViewMode = (isCompact) => {
		document.body.classList.toggle('compact-view', isCompact);
		if (expandIcon && collapseIcon) {
			expandIcon.classList.toggle('hidden', isCompact);
			collapseIcon.classList.toggle('hidden', !isCompact);
		}
		localStorage.setItem('codebeats-view-mode', isCompact ? 'compact' : 'full');
		// Update footer visibility based on both conditions
		updateAestheticFooterVisibility();
	};
	
	// Load saved preference
	const savedView = localStorage.getItem('codebeats-view-mode');
	if (savedView === 'compact') {
		setViewMode(true);
	} else {
		setViewMode(false);
	}
	
	viewToggleBtn.addEventListener('click', () => {
		const isCompact = !document.body.classList.contains('compact-view');
		setViewMode(isCompact);
	});
}

const aestheticToggleBtn = document.getElementById('aesthetic-toggle');

// Helper function to update footer visibility based on both conditions
function updateAestheticFooterVisibility() {
	if (!aestheticFooter) return;
	
	const isAestheticView = document.body.classList.contains('aesthetic-view');
	const isCompactView = document.body.classList.contains('compact-view');
	
	// Hide footer when both aesthetic view and compact view are enabled
	if (isAestheticView && isCompactView) {
		aestheticFooter.classList.add('hidden');
	} else if (isAestheticView && !isCompactView) {
		// Show footer only when aesthetic view is enabled and compact view is NOT enabled
		aestheticFooter.classList.remove('hidden');
	} else {
		// Hide footer when aesthetic view is disabled
		aestheticFooter.classList.add('hidden');
	}
}

function applyAestheticMode(enabled) {
	document.body.classList.toggle('aesthetic-view', enabled);
	if (aestheticToggleBtn) {
		aestheticToggleBtn.classList.toggle('active', enabled);
	}
	if (enabled && viewToggleBtn) {
		setViewMode(false);
	}
	if (enabled) {
		// Remove play indicator when aesthetic view is enabled
		const playIndicator = document.querySelector('.play-indicator');
		if (playIndicator) {
			playIndicator.remove();
		}
		// Try to generate gradient from current album artwork if available
		const albumArtImg = document.querySelector('.album-art img');
		if (albumArtImg && albumArtImg.src) {
			generateGradientFromAlbum(albumArtImg.src);
		} else {
			// Otherwise load the last saved gradient
			loadLastGradient();
		}
	} else {
		// Reset to default background when disabling aesthetic mode
		document.body.style.background = '';
	}
	// Update footer visibility based on both conditions
	updateAestheticFooterVisibility();
	localStorage.setItem('codebeats-aesthetic-mode', enabled ? 'on' : 'off');
}

if (aestheticToggleBtn) {
	const savedAesthetic = localStorage.getItem('codebeats-aesthetic-mode') === 'on';
	if (savedAesthetic) {
		applyAestheticMode(true);
		// Load last gradient on initial load if aesthetic mode is enabled
		setTimeout(() => {
			loadLastGradient();
		}, 100);
	}
	
	aestheticToggleBtn.addEventListener('click', () => {
		const enable = !document.body.classList.contains('aesthetic-view');
		applyAestheticMode(enable);
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

// Load playlists button
const loadPlaylistsBtn = document.getElementById('load-playlists-btn');
if (loadPlaylistsBtn) {
	loadPlaylistsBtn.addEventListener('click', () => {
		const loadingEl = document.getElementById('playlists-loading');
		const emptyEl = document.getElementById('playlists-empty');
		const listEl = document.getElementById('playlists-list');
		
		if (loadingEl) loadingEl.classList.remove('hidden');
		if (emptyEl) emptyEl.classList.add('hidden');
		if (listEl) listEl.innerHTML = '';
		
		vscode.postMessage({ type: 'getUserPlaylists' });
	});
}

// Queue toggle button setup function (called when queue is created/updated)
function setupQueueToggle() {
	const queueToggle = document.getElementById('queue-toggle');
	if (!queueToggle) return;
	
	// Remove existing listener to avoid duplicates
	const newToggle = queueToggle.cloneNode(true);
	queueToggle.parentNode?.replaceChild(newToggle, queueToggle);
	
	// Load saved preference
	const queueCollapsed = localStorage.getItem('codebeats-queue-collapsed') === 'true';
	const queueList = document.getElementById('queue-list');
	if (queueList) {
		if (queueCollapsed) {
			queueList.classList.add('collapsed');
			newToggle.classList.add('collapsed');
		}
	}
	
	newToggle.addEventListener('click', () => {
		const queueList = document.getElementById('queue-list');
		if (!queueList) return;
		
		const isCollapsed = queueList.classList.toggle('collapsed');
		newToggle.classList.toggle('collapsed', isCollapsed);
		localStorage.setItem('codebeats-queue-collapsed', isCollapsed.toString());
	});
}

// Playlists toggle button
const playlistsToggle = document.getElementById('playlists-toggle');
if (playlistsToggle) {
	// Load saved preference
	const playlistsCollapsed = localStorage.getItem('codebeats-playlists-collapsed') === 'true';
	const playlistsList = document.getElementById('playlists-list');
	if (playlistsList) {
		if (playlistsCollapsed) {
			playlistsList.classList.add('collapsed');
			playlistsToggle.classList.add('collapsed');
		}
	}
	
	playlistsToggle.addEventListener('click', () => {
		const playlistsList = document.getElementById('playlists-list');
		if (!playlistsList) return;
		
		const isCollapsed = playlistsList.classList.toggle('collapsed');
		playlistsToggle.classList.toggle('collapsed', isCollapsed);
		localStorage.setItem('codebeats-playlists-collapsed', isCollapsed.toString());
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
const footerPlayBtn = document.getElementById('footer-play');

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

if (footerPlayBtn) {
	footerPlayBtn.addEventListener('click', () => {
		vscode.postMessage({ type: 'togglePlayPause' });
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

// Extract dominant colors from album artwork and generate gradient
function generateGradientFromAlbum(albumArtUrl, saveToStorage = true) {
	if (!albumArtUrl) {
		return;
	}
	
	const img = new Image();
	img.crossOrigin = 'anonymous';
	
	img.onload = function() {
		try {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			
			// Limit canvas size for performance
			const maxSize = 200;
			const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
			canvas.width = img.width * scale;
			canvas.height = img.height * scale;
			
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			
			// Sample colors from different regions of the image
			const samplePoints = [
				{ x: 0.1, y: 0.1 }, // Top-left
				{ x: 0.9, y: 0.1 }, // Top-right
				{ x: 0.5, y: 0.5 }, // Center
				{ x: 0.1, y: 0.9 }, // Bottom-left
				{ x: 0.9, y: 0.9 }, // Bottom-right
				{ x: 0.3, y: 0.3 }, // Additional samples for better color extraction
				{ x: 0.7, y: 0.7 }
			];
			
			const colors = samplePoints.map(point => {
				const x = Math.floor(point.x * canvas.width);
				const y = Math.floor(point.y * canvas.height);
				const pixelData = ctx.getImageData(x, y, 1, 1).data;
				return {
					r: pixelData[0],
					g: pixelData[1],
					b: pixelData[2],
					brightness: (pixelData[0] + pixelData[1] + pixelData[2]) / 3
				};
			});
			
			// Find the most vibrant (highest saturation) color
			const vibrant = colors.reduce((max, color) => {
				const saturation = Math.max(color.r, color.g, color.b) - Math.min(color.r, color.g, color.b);
				const maxSaturation = Math.max(max.r, max.g, max.b) - Math.min(max.r, max.g, max.b);
				return saturation > maxSaturation ? color : max;
			}, colors[0]);
			
			// Find the darkest color
			const dark = colors.reduce((min, color) => {
				return color.brightness < min.brightness ? color : min;
			}, colors[0]);
			
			// Create a mid-tone color by blending vibrant and dark
			const mid = {
				r: Math.floor((vibrant.r * 0.6 + dark.r * 0.4)),
				g: Math.floor((vibrant.g * 0.6 + dark.g * 0.4)),
				b: Math.floor((vibrant.b * 0.6 + dark.b * 0.4))
			};
			
			// Enhance colors slightly for better visual appeal
			const enhanceColor = (color, factor = 1.1) => ({
				r: Math.min(255, Math.floor(color.r * factor)),
				g: Math.min(255, Math.floor(color.g * factor)),
				b: Math.min(255, Math.floor(color.b * factor))
			});
			
			const topColor = enhanceColor(vibrant, 1.15);
			const midColor = mid;
			const bottomColor = {
				r: Math.max(0, Math.min(255, dark.r - 15)),
				g: Math.max(0, Math.min(255, dark.g - 15)),
				b: Math.max(0, Math.min(255, dark.b - 15))
			};
			
			// Generate gradient
			const color1 = `rgb(${topColor.r}, ${topColor.g}, ${topColor.b})`;
			const color2 = `rgb(${midColor.r}, ${midColor.g}, ${midColor.b})`;
			const color3 = `rgb(${bottomColor.r}, ${bottomColor.g}, ${bottomColor.b})`;
			
			const gradient = `linear-gradient(180deg, ${color1} 0%, ${color2} 38%, ${color3} 100%)`;
			
			// Save to localStorage for persistence
			if (saveToStorage) {
				localStorage.setItem('codebeats-last-gradient', gradient);
				localStorage.setItem('codebeats-last-album-art', albumArtUrl);
			}
			
			// Apply gradient if in aesthetic mode
			if (document.body.classList.contains('aesthetic-view')) {
				document.body.style.background = gradient;
			}
		} catch (e) {
			console.error('Error generating gradient:', e);
			// Fallback to last saved gradient or default
			loadLastGradient();
		}
	};
	
	img.onerror = function() {
		// Fallback to last saved gradient or default
		loadLastGradient();
	};
	
	img.src = albumArtUrl;
}

// Load the last saved gradient from localStorage
function loadLastGradient() {
	if (!document.body.classList.contains('aesthetic-view')) {
		return;
	}
	
	const lastGradient = localStorage.getItem('codebeats-last-gradient');
	if (lastGradient) {
		document.body.style.background = lastGradient;
	} else {
		// Fallback to default gradient
		document.body.style.background = 'linear-gradient(180deg, #b19fc2 0%, #8f829a 38%, #5a5c63 100%)';
	}
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

function updateAestheticFooter(data) {
	const footer = document.getElementById('aesthetic-footer');
	if (!footer) return;
	
	const isAesthetic = document.body.classList.contains('aesthetic-view');
	
	const titleEl = document.getElementById('footer-title');
	const metaEl = document.getElementById('footer-meta');
	const chipEl = document.getElementById('footer-chip');
	
	// Update footer content based on playback state
	if (!data || data.noDevice || !data.track) {
		// No track playing - show default state
		if (titleEl) {
			titleEl.textContent = 'Not playing';
			titleEl.title = 'Not playing';
		}
		
		if (metaEl) {
			metaEl.textContent = data?.noDevice ? 'No active device found' : 'Connect to Spotify to start playing';
			metaEl.title = data?.noDevice ? 'No active device found' : 'Connect to Spotify to start playing';
		}
		
		if (footerPlayBtn) {
			footerPlayBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
		}
		return;
	}
	
	// Update with track information
	if (titleEl) {
		titleEl.textContent = data.track || 'Not playing';
		titleEl.title = data.track || '';
	}
	
	if (metaEl) {
		const artistPart = data.artist || 'Unknown Artist';
		const albumPart = data.album ? ` • ${data.album}` : '';
		metaEl.textContent = `${artistPart}${albumPart}`;
		metaEl.title = `${artistPart}${albumPart}`;
	}
	
	if (footerPlayBtn) {
		footerPlayBtn.innerHTML = data.isPlaying ?
			'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>' :
			'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
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
		nowPlayingEl.innerHTML = `
			<div class="no-playback">
				<div class="no-playback-icon">🎧</div>
				<div class="no-playback-text">${data?.noDevice ? 'No active device found' : 'Nothing playing'}</div>
			</div>
		`;
		if (cardEl) cardEl.classList.remove('playing');
		isPlaying = false;
		currentTrackId = null;
		stopProgressAnimation();
		updatePlayPauseIcon();
		updateAestheticFooter(data);
		// Load last saved gradient when no playback
		if (document.body.classList.contains('aesthetic-view')) {
			loadLastGradient();
		}
		return;
	}

	// Check if track changed
	const trackChanged = currentTrackId !== data.trackId;
	currentTrackId = data.trackId;
	
	// Generate gradient from album artwork if in aesthetic mode
	if (trackChanged && data.albumArt && document.body.classList.contains('aesthetic-view')) {
		generateGradientFromAlbum(data.albumArt);
	}
	
	isPlaying = data.isPlaying;
	const spinClass = isPlaying ? 'spinning' : '';
	const progress = data.progressMs && data.durationMs ? (data.progressMs / data.durationMs) * 100 : 0;
	
	// Update progress tracking for smooth animation
	lastProgressMs = data.progressMs || 0;
	lastDurationMs = data.durationMs || 0;
	lastUpdateTime = Date.now();
	
	// Only replace HTML if track changed, otherwise just update dynamic elements
	if (trackChanged) {
		nowPlayingEl.innerHTML = `
			<div class="album-container">
				<div class="album-art-wrapper">
				<div class="album-art ${spinClass}">
					${data.albumArt ? 
						`<img src="${data.albumArt}" alt="Album art" />` : 
							`<span class="vinyl-icon">💿</span>`
					}
				</div>
					${isPlaying && !document.body.classList.contains('aesthetic-view') ? `
						<div class="play-indicator">
							<div class="equalizer">
								<div class="eq-bar"></div>
								<div class="eq-bar"></div>
								<div class="eq-bar"></div>
							</div>
						</div>
					` : ''}
				</div>
				<div class="compact-track-info">
					<div class="compact-track-name" title="${data.track}">${data.track}</div>
					<div class="compact-track-artist" title="${data.artist}">${data.artist || 'Unknown Artist'}</div>
				</div>
				<div class="track-details">
					<div class="track-name" title="${data.track}">${data.track}</div>
					<div class="track-artist" title="${data.artist}">${data.artist || 'Unknown Artist'}</div>
					${data.album ? `<div class="track-album" title="${data.album}">${data.album}</div>` : ''}
				</div>
			</div>
			${data.progressMs && data.durationMs ? `
				<div class="progress-container">
					<div class="progress-times">
						<span>${formatTime(data.progressMs)}</span>
						<span>${formatTime(data.durationMs)}</span>
					</div>
					<div class="progress-bar">
						<div class="progress-fill" data-progress="${progress}"></div>
					</div>
				</div>
			` : ''}
			${data.nextTrack ? `
				<div class="up-next">
					<div class="up-next-label">
						<svg class="icon" viewBox="0 0 24 24" fill="currentColor">
							<path d="M16 18h2V6h-2v12zM6 18l8.5-6L6 6v12z"/>
						</svg>
						Up Next
					</div>
					<div class="next-track-name" title="${data.nextTrack}">${data.nextTrack}</div>
					<div class="next-track-artist" title="${data.nextArtist}">${data.nextArtist || 'Unknown Artist'}</div>
				</div>
			` : ''}
			${data.queue && data.queue.length > 0 ? `
				<div class="queue-section" id="queue-section">
					<div class="queue-header">
						<div class="queue-label">
							<svg class="icon" viewBox="0 0 24 24" fill="currentColor">
								<path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v14.18l4.5-2.18-.82-1.64L17 18.64V6z"/>
							</svg>
							Queue • <span class="queue-count">${data.queue.length} track${data.queue.length !== 1 ? 's' : ''}</span>
						</div>
						<button class="section-toggle" id="queue-toggle" title="Toggle queue visibility">
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
							</svg>
						</button>
					</div>
					<div class="queue-list" id="queue-list">
						${data.queue.map((track, index) => `
							<div class="queue-item" data-track-id="${track.id}">
								<div class="queue-item-art">
									${track.albumArt ? 
										`<img src="${track.albumArt}" alt="Album art" />` : 
										`<span class="vinyl-icon">💿</span>`
									}
								</div>
								<div class="queue-item-info">
									<div class="queue-item-name" title="${track.name}">${track.name}</div>
									<div class="queue-item-artist" title="${track.artist}">${track.artist}</div>
								</div>
								${track.durationMs ? `<div class="queue-item-duration">${formatTime(track.durationMs)}</div>` : ''}
							</div>
						`).join('')}
					</div>
				</div>
			` : ''}
		`;
		
		// Setup queue toggle after queue section is created
		setTimeout(() => setupQueueToggle(), 50);
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
		
		// Update play indicator (hide in aesthetic view)
		const playIndicator = nowPlayingEl.querySelector('.play-indicator');
		const isAestheticView = document.body.classList.contains('aesthetic-view');
		if (isPlaying && !playIndicator && !isAestheticView) {
			const albumArtWrapper = nowPlayingEl.querySelector('.album-art-wrapper');
			if (albumArtWrapper) {
				const indicator = document.createElement('div');
				indicator.className = 'play-indicator';
				indicator.innerHTML = `
					<div class="equalizer">
						<div class="eq-bar"></div>
						<div class="eq-bar"></div>
						<div class="eq-bar"></div>
					</div>
				`;
				albumArtWrapper.appendChild(indicator);
			}
		} else if ((!isPlaying || isAestheticView) && playIndicator) {
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
	
	// Update queue if present
	if (data.queue) {
		updateQueue(data.queue);
	} else if (trackChanged) {
		// If track changed but no queue, setup toggle anyway in case queue section exists
		setTimeout(() => setupQueueToggle(), 100);
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
	
	updateAestheticFooter(data);
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

// Update queue section
function updateQueue(queue) {
	const queueSection = document.getElementById('queue-section');
	const queueList = document.getElementById('queue-list');
	
	if (!queue || !Array.isArray(queue) || queue.length === 0) {
		if (queueSection) {
			queueSection.style.display = 'none';
		}
		return;
	}
	
	if (!queueSection || !queueList) {
		// Queue section doesn't exist yet, it will be created in updateNowPlaying
		return;
	}
	
	// Preserve collapsed state
	const wasCollapsed = queueList.classList.contains('collapsed');
	
	queueList.innerHTML = queue.map((track, index) => `
		<div class="queue-item" data-track-id="${track.id}">
			<div class="queue-item-art">
				${track.albumArt ? 
					`<img src="${track.albumArt}" alt="Album art" />` : 
					`<span class="vinyl-icon">💿</span>`
				}
			</div>
			<div class="queue-item-info">
				<div class="queue-item-name" title="${track.name}">${track.name}</div>
				<div class="queue-item-artist" title="${track.artist}">${track.artist}</div>
			</div>
			${track.durationMs ? `<div class="queue-item-duration">${formatTime(track.durationMs)}</div>` : ''}
		</div>
	`).join('');
	
	// Restore collapsed state
	if (wasCollapsed) {
		queueList.classList.add('collapsed');
	}
	
	// Update queue count
	const queueCount = queueSection.querySelector('.queue-count');
	if (queueCount) {
		queueCount.textContent = `${queue.length} track${queue.length !== 1 ? 's' : ''}`;
	}
	
	// Also update in the label if it exists
	const queueLabel = queueSection.querySelector('.queue-label');
	if (queueLabel) {
		const countSpan = queueLabel.querySelector('.queue-count');
		if (countSpan) {
			countSpan.textContent = `${queue.length} track${queue.length !== 1 ? 's' : ''}`;
		}
	}
	
	queueSection.style.display = 'block';
	
	// Re-setup toggle button after queue is updated
	setupQueueToggle();
}

// Update playlists display
function updatePlaylists(playlists) {
	const playlistsList = document.getElementById('playlists-list');
	const playlistsLoading = document.getElementById('playlists-loading');
	const playlistsEmpty = document.getElementById('playlists-empty');
	const loadBtn = document.getElementById('load-playlists-btn');
	
	if (!playlistsList) return;
	
	if (playlistsLoading) playlistsLoading.classList.add('hidden');
	
	// Preserve collapsed state
	const wasCollapsed = playlistsList.classList.contains('collapsed');
	
	if (!playlists || !Array.isArray(playlists) || playlists.length === 0) {
		if (playlistsEmpty) playlistsEmpty.classList.remove('hidden');
		playlistsList.innerHTML = '';
		return;
	}
	
	if (playlistsEmpty) playlistsEmpty.classList.add('hidden');
	
	playlistsList.innerHTML = playlists.map((playlist) => `
		<div class="playlist-item" data-playlist-id="${playlist.id}">
			<div class="playlist-item-art">
				${playlist.imageUrl ? 
					`<img src="${playlist.imageUrl}" alt="Playlist cover" />` : 
					`<span class="vinyl-icon">💿</span>`
				}
				<div class="playlist-play-icon">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M8 5v14l11-7z"/>
					</svg>
				</div>
			</div>
			<div class="playlist-item-info">
				<div class="playlist-item-name" title="${playlist.name}">${playlist.name}</div>
				<div class="playlist-item-meta" title="${playlist.owner} • ${playlist.trackCount} tracks">
					${playlist.owner} • ${playlist.trackCount} track${playlist.trackCount !== 1 ? 's' : ''}
				</div>
			</div>
		</div>
	`).join('');
	
	// Restore collapsed state
	if (wasCollapsed) {
		playlistsList.classList.add('collapsed');
	}
	
	// Add click handlers to playlist items
	playlistsList.querySelectorAll('.playlist-item').forEach(item => {
		item.addEventListener('click', () => {
			const playlistId = item.getAttribute('data-playlist-id');
			if (playlistId) {
				vscode.postMessage({ type: 'playPlaylist', playlistId: playlistId });
			}
		});
	});
	
	// Hide load button after playlists are loaded
	if (loadBtn) {
		loadBtn.style.display = 'none';
	}
}

// Listen for messages
window.addEventListener('message', event => {
	const message = event.data;
	if (message.type === 'playbackInfo') {
		updateNowPlaying(message.data);
		// Update queue if present in playback info
		if (message.data.queue) {
			updateQueue(message.data.queue);
		}
	} else if (message.type === 'queueData') {
		updateQueue(message.data?.queue);
	} else if (message.type === 'playlistsData') {
		updatePlaylists(message.data);
	}
});

// Fetch current playback if authenticated
const authenticated = document.body.dataset.authenticated === 'true';
let pollInterval = null;

if (authenticated) {
	vscode.postMessage({ type: 'getCurrentPlayback' });
	
	// Setup queue toggle on initial load if queue section exists
	setTimeout(() => setupQueueToggle(), 200);
	
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
