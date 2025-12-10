# 🎵 CodeBeats

A sleek, modern Spotify controller for Visual Studio Code. Control your music without leaving your editor.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/JunAkerBuilds/CodeBeats)

## 📸 Screenshots

### Compact Player View

![Compact Player](https://github.com/JunAkerBuilds/CodeBeats/raw/main/assets/compact-player.png)

### Full View Player

![Full View Player](https://github.com/JunAkerBuilds/CodeBeats/raw/main/assets/Fullview-player.png)

## ✨ Features

### 🎛️ **Complete Playback Control**

- **Play/Pause** - Control playback with a single click
- **Next/Previous** - Skip tracks effortlessly
- **Shuffle** - Toggle shuffle mode on/off
- **Repeat** - Cycle through off/context/track modes
- **Volume Control** - Smooth slider with mute/unmute
- **Progress Bar** - Real-time track progress with smooth animations

### 💚 **Smart Music Management**

- **Like/Unlike Tracks** - Save favorites to your Spotify library
- **Now Playing** - Beautiful vinyl record player display
- **Up Next** - See what's coming up in your queue
- **Device Selection** - Switch between Spotify devices easily

### 📊 **Status Bar Integration**

- **Always Visible** - Current track info in VS Code status bar
- **Quick Controls** - Click to play/pause instantly
- **Live Updates** - Auto-refreshes every 5 seconds

### 🎨 **Beautiful UI**

- **Compact Design** - Fits perfectly in your sidebar
- **Vinyl Aesthetics** - Spinning album art record player
- **Smooth Animations** - Polished transitions and effects
- **Glassmorphism** - Modern, frosted glass design
- **Dark Theme Optimized** - Seamless VS Code integration

### 🔍 **Multiple Access Points**

- **Activity Bar Icon** - Dedicated music note icon
- **Explorer Sidebar** - Available in file explorer
- **Status Bar** - Quick access from bottom bar

## 📦 Installation

### From VS Code Marketplace (Coming Soon)

1. Open VS Code
2. Go to Extensions (`Cmd+Shift+X` / `Ctrl+Shift+X`)
3. Search for "CodeBeats"
4. Click Install
5. **⚠️ Setup Required** - See Quick Start below (5 minutes)

## 🚀 Quick Start

### 1. Create Spotify Developer App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in and click **"Create app"**
3. Fill in the form (in order):
   - **App name**: "CodeBeats" (or any name)
   - **App description**: "VS Code music controller"
   - **Redirect URI**: `https://127.0.0.1:4567/callback` ⚠️ **Important!**
   - **Which API/SDKs**: Select **"Web API"** ✅
   - ℹ️ _CodeBeats is a remote control (uses Web API), not a player (doesn't need Web Playback SDK)_
4. Accept terms and click **"Save"**
5. Copy your **Client ID**

### 2. Configure Client ID

**Option A - VS Code Settings (Recommended):**

1. Open Settings: `Cmd+,` (Mac) or `Ctrl+,` (Windows/Linux)
2. Search for: `spotify` or `codebeats`
3. Find **"CodeBeats: Spotify Client Id"**
4. Paste your Client ID
5. Done! ✅

### 3. Connect Spotify

1. Click the **music note icon** (♪) in the Activity Bar
2. Click **"Connect Spotify"**
3. **Browser security warning**: Click "Advanced" → "Proceed" (this is safe)
4. Authorize in your browser
5. Start playing music! 🎉

## 🎮 Usage

### Playback Controls

- **Play/Pause** - Main play button or click status bar
- **Skip** - Previous/Next buttons
- **Shuffle** - Click 🔀 to toggle
- **Repeat** - Click 🔁 to cycle modes
- **Like** - Click 💚 to save to Liked Songs

### Volume Control

- **Drag slider** - Adjust volume (0-100%)
- **Click speaker icon** - Mute/unmute
- **Icon changes** - Reflects volume level

### Device Selection

- Click **"Select Playback Device"**
- Choose from available Spotify devices
- Transfers playback instantly

## ⚙️ Configuration

### Environment Variables (.env file)

```env
SPOTIFY_CLIENT_ID=your_client_id_here
```

### VS Code Settings

Alternatively, use VS Code settings:

```json
{
  "codebeats.spotifyClientId": "your_client_id_here"
}
```

## 🔒 Privacy & Security

- **Secure Authentication** - Uses Spotify's PKCE OAuth flow
- **Local Storage** - Tokens stored in VS Code's secure secret storage
- **No Backend** - Direct connection to Spotify API
- **Open Source** - Audit the code yourself

### Required Permissions

CodeBeats requests these Spotify scopes:

- `user-read-playback-state` - Read current playback
- `user-modify-playback-state` - Control playback
- `user-library-read` - Check if tracks are liked
- `user-library-modify` - Like/unlike tracks
- `streaming` - Stream audio (future feature)

## 🛠️ Troubleshooting

### "403 Forbidden" Error

**Problem**: Your account isn't on the app allowlist.

**Solution**:

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Open your app → Settings → User Management
3. Add your Spotify email
4. Accept the invitation

### "No Active Device" Error

**Problem**: Spotify isn't running on any device.

**Solution**:

1. Open Spotify on your phone, computer, or web player
2. Play any track
3. Refresh CodeBeats

### Volume Control Not Working

**Problem**: Some devices don't support volume API.

**Note**: Spotify's volume API doesn't work on all devices (e.g., some mobile devices). This is a Spotify limitation, not a bug.

### More Help

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Built with [VS Code Extension API](https://code.visualstudio.com/api)
- Powered by [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- Inspired by music lovers who code

## 🎯 Roadmap

- [ ] Search functionality
- [ ] Playlist browsing
- [ ] Recently played tracks
- [ ] Keyboard shortcuts
- [ ] Lyrics display
- [ ] Queue management
- [ ] Desktop notifications

---

**Made with 💚 by developers, for developers**

_Keep coding, keep vibing_ 🎵
