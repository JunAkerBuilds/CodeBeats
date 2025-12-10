# Changelog

All notable changes to the CodeBeats extension will be documented in this file.

## [1.0.0] - 10-12-2025

### 🎉 Initial Release

The first production-ready release of CodeBeats - a beautiful Spotify controller for VS Code!

### ✨ Features

#### Playback Control

- **Play/Pause** - Control music playback with intuitive buttons
- **Next/Previous Track** - Skip through your music effortlessly
- **Shuffle Toggle** - Turn shuffle mode on/off
- **Repeat Modes** - Cycle through off/context/track repeat modes
- **Volume Control** - Smooth slider with precise volume adjustment (0-100%)
- **Mute/Unmute** - Click speaker icon to quickly mute/unmute
- **Progress Bar** - Real-time track progress with smooth 60fps animations
- **Device Selection** - Switch playback between Spotify devices

#### Music Management

- **Like/Unlike Tracks** - Save tracks to your Liked Songs library with one click
- **Heart Animation** - Satisfying pulse animation when liking tracks
- **Track Information** - View current track, artist, and album
- **Album Artwork** - Beautiful spinning vinyl record display
- **Up Next** - See the next track in your queue

#### User Interface

- **Compact Design** - Space-efficient sidebar layout
- **Vinyl Record Player** - Aesthetic spinning album art
- **Glassmorphism** - Modern frosted glass effects
- **Smooth Animations** - Polished transitions throughout
- **Visual Feedback** - Clear active state indicators
- **Dark Theme Optimized** - Seamless VS Code integration

#### Status Bar Integration

- **Current Track Display** - Always-visible track info in status bar
- **Play/Pause Toggle** - Click status bar to control playback
- **Live Updates** - Auto-refreshes every 5 seconds
- **Smart Icons** - Shows play/pause state clearly

#### Access Points

- **Activity Bar Icon** - Dedicated music note (♪) icon in Activity Bar
- **Explorer View** - Available in File Explorer sidebar
- **Status Bar** - Quick access from bottom bar

#### Technical

- **Secure Authentication** - PKCE OAuth 2.0 flow
- **Token Management** - Automatic token refresh
- **Error Handling** - Helpful error messages with quick fixes
- **Multi-View Support** - Synced state across all views

### 🔒 Security

- Secure token storage using VS Code's Secret Storage API
- No backend server required - direct Spotify API integration
- PKCE authentication for enhanced security
- Tokens encrypted at rest

### 📚 Documentation

- Comprehensive setup guide (SPOTIFY_SETUP.md)
- Quick start instructions (QUICK_START.md)
- 403 error fix guide (FIX_403_ERROR.md)
- Technical implementation details
- Testing guide

### 🎨 Design

- Spotify green (#1DB954) accent color
- Professional button designs with hover effects
- Custom SVG icons for all controls
- Responsive layout for narrow sidebars
- Accessibility-focused design

### 🛠️ Developer Experience

- TypeScript for type safety
- ESLint for code quality
- esbuild for fast compilation
- Source maps for debugging
- Comprehensive error handling

---

## [Unreleased]

### Planned Features

- Search functionality (tracks, artists, albums)
- Playlist browsing
- Recently played tracks
- Keyboard shortcuts
- Lyrics display
- Queue management
- Desktop notifications
- Customizable themes
- Mini player mode

---

## Version History

- **1.0.0** (2024-12-09) - Initial production release
- **0.0.1** (Development) - Pre-release development

---

For more details, see the [README](README.md) or visit the [GitHub repository](https://github.com/yourusername/codebeats).
