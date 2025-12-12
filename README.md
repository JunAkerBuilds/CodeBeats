<div align='center'>

# VS Code CodeBeats

<img src="https://github.com/junakerbuilds/codebeats/raw/main/icon.png" alt="CodeBeats icon" width="160">
</div>    

<p align="center">
    A sleek, modern Spotify controller for Visual Studio Code. Control your music without leaving your editor. 
    <br>
    Keep coding, keep vibing~
    <br>
    <br>
    <a href="https://github.com/junakerbuilds/codebeats/issues/new?template=bug_report.md&title=">Report a Bug</a>
    ·
    <a href="https://github.com/junakerbuilds/codebeats/issues/new?template=feature_request.md&title=">Request feature</a>

    
</p>

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/aker.codebeats?color=blue&logo=visual-studio)](https://marketplace.visualstudio.com/items?itemName=aker.codebeats)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/aker.codebeats?logo=visualstudio)](https://marketplace.visualstudio.com/items?itemName=aker.codebeats)
[![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/aker.codebeats?logo=visualstudio)](https://marketplace.visualstudio.com/items?itemName=aker.codebeats)



![screenshot](https://github.com/JunAkerBuilds/CodeBeats/raw/main/assets/full-view.gif)

## Table of Contents
- [Installation](#installation)
- [Quick start with CodeBeats](#quick-start-with-codebeats)
- [Using CodeBeats](#using-codebeats)
- [Contributing](#contributing)
- [Credits](#credits)


## Installation

Install this extension from the [VS Code marketplace](https://marketplace.visualstudio.com/items?itemName=aker.codebeats).

OR

With VS Code open, search for `CodeBeats` in the extension panel (`Ctrl+Shift+X` on Windows/Linux or `Cmd(⌘)+Shift+X` on MacOS) and click install.

OR

With VS Code open, launch VS Code Quick Open (`Ctrl+P` on Windows/Linux or `Cmd(⌘)+P` on MacOS), paste the following command, and press enter.

`ext install aker.codebeats`

## Quick start with CodeBeats

CodeBeats uses Spotify's Web API to control playback. Spotify Premium is required for playback control (per Spotify's API rules).

Congrats on installing CodeBeats! Follow these steps to get set up: 
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
4. Authorize CodeBeats in your browser
5. Start playing music!

## Using CodeBeats

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

### Full view & Compact view 
Two layouts are available — switch anytime:

![screenshot](https://github.com/JunAkerBuilds/CodeBeats/raw/main/assets/compact-view.gif)


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Credits
- Built by [Jun](https://github.com/ZijunYe) & [Aker](https://github.com/Akerrules) 
- Built with [VS Code Extension API](https://code.visualstudio.com/api)
- Powered by [Spotify Web API](https://developer.spotify.com/documentation/web-api)
