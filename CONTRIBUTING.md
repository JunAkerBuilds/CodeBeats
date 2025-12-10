# Contributing to CodeBeats

First off, thank you for considering contributing to CodeBeats! 🎉

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to make CodeBeats better!

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title** - Describe the issue briefly
- **Steps to reproduce** - How can we see the bug?
- **Expected behavior** - What should happen?
- **Actual behavior** - What actually happens?
- **Environment** - VS Code version, OS, etc.
- **Screenshots** - If applicable

### 💡 Suggesting Features

Feature requests are welcome! Please:

- **Check existing issues** - Maybe it's already planned
- **Describe the feature** - What should it do?
- **Explain the use case** - Why is it useful?
- **Consider alternatives** - Are there other solutions?

### 🔧 Pull Requests

1. **Fork the repository**
2. **Create a branch** - `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly** - Make sure nothing breaks
5. **Follow code style** - Use ESLint configuration
6. **Commit with clear messages**
7. **Push to your fork**
8. **Open a Pull Request**

## Development Setup

### Prerequisites

- Node.js (v16 or later)
- VS Code
- Spotify account
- Git

### Getting Started

1. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/codebeats.git
   cd codebeats
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Spotify credentials**
   - Create a Spotify app at [developer.spotify.com](https://developer.spotify.com/dashboard)
   - Add redirect URI: `https://127.0.0.1:4567/callback`
   - Create `.env` file with your Client ID

4. **Build the extension**
   ```bash
   npm run compile
   ```

5. **Launch Extension Development Host**
   - Press `F5` in VS Code
   - Or use "Run Extension" from Run and Debug panel

### Project Structure

```
codebeats/
├── src/
│   ├── extension.ts      # Main extension logic
│   ├── sidebar.ts         # Sidebar webview provider
│   └── test/              # Tests
├── dist/                  # Compiled output
├── docs/                  # Documentation
├── package.json           # Extension manifest
└── README.md             # Main documentation
```

### Building

```bash
# Development build
npm run compile

# Watch mode (auto-rebuild on changes)
npm run watch

# Production build
npm run package
```

### Testing

```bash
# Run linter
npm run lint

# Type checking
npm run check-types

# Run tests
npm test
```

## Code Style

- **TypeScript** - Use TypeScript for type safety
- **ESLint** - Follow the provided ESLint config
- **Formatting** - Use consistent indentation (tabs)
- **Comments** - Add comments for complex logic
- **Naming** - Use descriptive variable names

### Example

```typescript
// Good
async function getCurrentPlayback(context: vscode.ExtensionContext): Promise<PlaybackInfo> {
	const tokenSet = await ensureValidToken(context);
	// ... implementation
}

// Avoid
async function get(c: any): Promise<any> {
	const t = await ev(c);
	// ... implementation
}
```

## Commit Messages

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build/tooling changes

### Examples

```
feat: add search functionality
fix: resolve 403 error on initial auth
docs: update setup instructions
refactor: simplify volume control logic
```

## Pull Request Process

1. **Update documentation** - If you change functionality
2. **Add tests** - For new features
3. **Test thoroughly** - Make sure nothing breaks
4. **Update CHANGELOG** - Add entry for your changes
5. **Request review** - Tag maintainers if needed

## Questions?

- **Open an issue** - For bugs or features
- **Start a discussion** - For general questions
- **Check docs/** - Detailed documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making CodeBeats better!** 💚

