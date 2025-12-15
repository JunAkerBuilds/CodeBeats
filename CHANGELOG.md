# Changelog

All notable changes to the CodeBeats extension will be documented in this file. Keep the newest entries at the top for the VS Code Marketplace.

## [1.0.4] - 2025-12-15

- **New: Smart Queue Skipping** - Click any track in your queue to jump straight to it! When playing a playlist (without shuffle), it instantly jumps to that track. For shuffled playlists or manual queues, it quickly skips through tracks to get there.
- **Improved: Queue Performance** - Queue display now limited to 10 tracks for better performance and cleaner interface.
- **Changed: VS Code Compatibility** - Updated minimum VS Code version requirement to 1.104.0 for broader compatibility.

## [1.0.3] - 2025-12-13

- **New: Queue Track Selection** - Click any track in the queue to skip forward to it without disrupting the queue order.
- **Fixed: Device Name Update** - Device name now updates immediately in the UI after selecting a device from the device picker.
- **Fixed: Queue Scroll** - Removed outer scroll from queue section for cleaner interface.

## [1.0.2] - 2025-12-11

- **New: Queue Viewing** - View all upcoming tracks in your playback queue with album art, track names, artists, and durations.
- **New: Playlist Management** - Browse and play your Spotify playlists directly from the sidebar. Click any playlist to start playing it.
- **New: Collapsible Sections** - Toggle buttons to show/hide queue and playlist sections for a cleaner interface.

## [1.0.1] - 2025-12-10

- Improved sidebar volume control with clearer affordances and smoother adjustment.
- New album artwork animation with continuous 360° rotation.
- Added authentication relaunch tab for smoother sign-in retries.
- Refreshed extension icon for the Marketplace listing.
- Updated README to reflect the latest UX changes.
- Added an issue report template to streamline bug submissions.

## [1.0.0] - 2024-12-09

- First production release of the CodeBeats Spotify controller.
- Playback controls: play/pause, next/previous, shuffle toggle, repeat modes, volume slider with mute, seek/progress bar.
- Track context: title, artist, album art with vinyl animation, and next-up preview.
- Device switching between available Spotify devices.
- Liked songs toggle with animated heart feedback.
- Status bar integration for quick play/pause and now-playing info.
- Secure PKCE authentication with VS Code secret storage; tokens refreshed automatically.
- Polished UI: glassmorphism styling, responsive sidebar layout, smooth animations, Spotify-green accent.
- Documentation included: setup, quick start, and troubleshooting guides.
