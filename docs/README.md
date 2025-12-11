# CodeBeats Website

This is the website for the CodeBeats VS Code extension, designed to be hosted on GitHub Pages.

## Setup for GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to **Pages** in the left sidebar
3. Under **Source**, select **Deploy from a branch**
4. Choose **main** (or **master**) as the branch
5. Select **/docs** as the folder
6. Click **Save**

Your website will be available at: `https://[your-username].github.io/CodeBeats/`

## Local Development

To preview the website locally, you can use any static file server:

### Using Python 3:
```bash
cd docs
python3 -m http.server 8000
```

### Using Node.js (with http-server):
```bash
npx http-server docs -p 8000
```

Then open `http://localhost:8000` in your browser.

## File Structure

- `index.html` - Main HTML file
- `styles.css` - All styling and responsive design
- `script.js` - Interactive features and animations
- `.nojekyll` - Prevents Jekyll processing (required for GitHub Pages)

## Customization

The website uses CSS variables for easy theming. Main colors are defined in `styles.css`:

- `--spotify-green`: #1DB954 (Spotify brand color)
- `--bg-primary`: #0a0a0a (Main background)
- `--bg-secondary`: #121212 (Secondary background)
- `--text-primary`: #ffffff (Primary text color)

Modify these variables to customize the color scheme.

