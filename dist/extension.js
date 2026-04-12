"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/dotenv/package.json"(exports2, module2) {
    module2.exports = {
      name: "dotenv",
      version: "17.2.3",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        pretest: "npm run lint && npm run dts-check",
        test: "tap run tests/**/*.js --allow-empty-coverage --disable-coverage --timeout=60000",
        "test:coverage": "tap run tests/**/*.js --show-full-coverage --timeout=60000 --coverage-report=text --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      homepage: "https://github.com/motdotla/dotenv#readme",
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@types/node": "^18.11.3",
        decache: "^4.6.2",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-version": "^9.5.0",
        tap: "^19.2.0",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports2, module2) {
    var fs2 = require("fs");
    var path3 = require("path");
    var os = require("os");
    var crypto = require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var TIPS = [
      "\u{1F510} encrypt with Dotenvx: https://dotenvx.com",
      "\u{1F510} prevent committing .env to code: https://dotenvx.com/precommit",
      "\u{1F510} prevent building .env in docker: https://dotenvx.com/prebuild",
      "\u{1F4E1} add observability to secrets: https://dotenvx.com/ops",
      "\u{1F465} sync secrets across teammates & machines: https://dotenvx.com/ops",
      "\u{1F5C2}\uFE0F backup and recover secrets: https://dotenvx.com/ops",
      "\u2705 audit secrets and track compliance: https://dotenvx.com/ops",
      "\u{1F504} add secrets lifecycle management: https://dotenvx.com/ops",
      "\u{1F511} add access controls to secrets: https://dotenvx.com/ops",
      "\u{1F6E0}\uFE0F  run anywhere with `dotenvx run -- yourcommand`",
      "\u2699\uFE0F  specify custom .env file path with { path: '/custom/path/.env' }",
      "\u2699\uFE0F  enable debug logging with { debug: true }",
      "\u2699\uFE0F  override existing env vars with { override: true }",
      "\u2699\uFE0F  suppress all logs with { quiet: true }",
      "\u2699\uFE0F  write to custom object with { processEnv: myObject }",
      "\u2699\uFE0F  load multiple .env files with { path: ['.env.local', '.env'] }"
    ];
    function _getRandomTip() {
      return TIPS[Math.floor(Math.random() * TIPS.length)];
    }
    function parseBoolean(value) {
      if (typeof value === "string") {
        return !["false", "0", "no", "off", ""].includes(value.toLowerCase());
      }
      return Boolean(value);
    }
    function supportsAnsi() {
      return process.stdout.isTTY;
    }
    function dim(text) {
      return supportsAnsi() ? `\x1B[2m${text}\x1B[0m` : text;
    }
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      options = options || {};
      const vaultPath = _vaultPath(options);
      options.path = vaultPath;
      const result = DotenvModule.configDotenv(options);
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _warn(message) {
      console.error(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _log(message) {
      console.log(`[dotenv@${version}] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs2.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path3.resolve(process.cwd(), ".env.vault");
      }
      if (fs2.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path3.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      const debug = parseBoolean(process.env.DOTENV_CONFIG_DEBUG || options && options.debug);
      const quiet = parseBoolean(process.env.DOTENV_CONFIG_QUIET || options && options.quiet);
      if (debug || !quiet) {
        _log("Loading env from encrypted .env.vault");
      }
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path3.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      let debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || options && options.debug);
      let quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || options && options.quiet);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path4 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs2.readFileSync(path4, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path4} ${e.message}`);
          }
          lastError = e;
        }
      }
      const populated = DotenvModule.populate(processEnv, parsedAll, options);
      debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug);
      quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet);
      if (debug || !quiet) {
        const keysCount = Object.keys(populated).length;
        const shortPaths = [];
        for (const filePath of optionPaths) {
          try {
            const relative = path3.relative(process.cwd(), filePath);
            shortPaths.push(relative);
          } catch (e) {
            if (debug) {
              _debug(`Failed to load ${filePath} ${e.message}`);
            }
            lastError = e;
          }
        }
        _log(`injecting env (${keysCount}) from ${shortPaths.join(",")} ${dim(`-- tip: ${_getRandomTip()}`)}`);
      }
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config2(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      const populated = {};
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
            populated[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
          populated[key] = parsed[key];
        }
      }
      return populated;
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config: config2,
      decrypt,
      parse,
      populate
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  }
});

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var import_https = require("https");
var import_crypto = require("crypto");
var vscode2 = __toESM(require("vscode"));

// src/sidebar.ts
var vscode = __toESM(require("vscode"));
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var SidebarProvider = class {
  constructor(context) {
    this.context = context;
  }
  views = [];
  accessToken;
  setAccessToken(token) {
    this.accessToken = token;
    this.views.forEach((view) => {
      view.webview.html = this.getHtmlForWebview(view.webview);
    });
  }
  getClientId() {
    const envClientId = process.env.SPOTIFY_CLIENT_ID;
    if (envClientId) {
      return envClientId;
    }
    const newSetting = vscode.workspace.getConfiguration("codebeats").get("spotifyClientId");
    if (newSetting) {
      return newSetting;
    }
    return vscode.workspace.getConfiguration("music-player").get("spotifyClientId");
  }
  sendPlaybackInfo(info) {
    this.views.forEach((view) => {
      view.webview.postMessage({ type: "playbackInfo", data: info });
    });
  }
  getHtmlForWebview(webview) {
    return this.getHtml(webview);
  }
  resolveWebviewView(webviewView) {
    console.log("resolveWebviewView called for:", webviewView.title);
    if (!this.views.includes(webviewView)) {
      this.views.push(webviewView);
    }
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri]
    };
    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
    webviewView.onDidDispose(() => {
      const index = this.views.indexOf(webviewView);
      if (index > -1) {
        this.views.splice(index, 1);
      }
    });
    webviewView.webview.onDidReceiveMessage(async (message) => {
      if (!message || !message.type) {
        return;
      }
      switch (message.type) {
        case "selectDevice":
          vscode.commands.executeCommand("music-player.selectDevice");
          break;
        case "togglePlayPause":
          vscode.commands.executeCommand("music-player.togglePlayPause");
          break;
        case "play":
          vscode.commands.executeCommand("music-player.play");
          break;
        case "pause":
          vscode.commands.executeCommand("music-player.pause");
          break;
        case "next":
          vscode.commands.executeCommand("music-player.next");
          break;
        case "previous":
          vscode.commands.executeCommand("music-player.previous");
          break;
        case "login":
          vscode.commands.executeCommand("music-player.login");
          break;
        case "logout":
          vscode.commands.executeCommand("music-player.logout");
          break;
        case "openSpotifyDashboard":
          vscode.env.openExternal(vscode.Uri.parse("https://developer.spotify.com/dashboard/create"));
          break;
        case "openSettings":
          vscode.commands.executeCommand("workbench.action.openSettings", "codebeats.spotifyClientId");
          break;
        case "getCurrentPlayback":
          const result = await vscode.commands.executeCommand("music-player.getCurrentPlayback");
          this.sendPlaybackInfo(result);
          break;
        case "setVolume":
          vscode.commands.executeCommand("music-player.setVolume", message.volume);
          break;
        case "toggleShuffle":
          vscode.commands.executeCommand("music-player.toggleShuffle");
          break;
        case "cycleRepeat":
          vscode.commands.executeCommand("music-player.cycleRepeat");
          break;
        case "toggleLike":
          vscode.commands.executeCommand("music-player.toggleLike");
          break;
        case "getQueue":
          const queueResult = await vscode.commands.executeCommand("music-player.getQueue");
          webviewView.webview.postMessage({ type: "queueData", data: queueResult });
          break;
        case "getUserPlaylists":
          const playlistsResult = await vscode.commands.executeCommand("music-player.getUserPlaylists");
          webviewView.webview.postMessage({ type: "playlistsData", data: playlistsResult });
          break;
        case "playPlaylist":
          vscode.commands.executeCommand("music-player.playPlaylist", message.playlistId);
          break;
      }
    });
    console.log("Webview resolution complete");
  }
  getHtml(webview) {
    const nonce = getNonce();
    const isAuthenticated = !!this.accessToken;
    const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src", "sidebar", "sidebar.css"));
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src", "sidebar", "sidebar.js"));
    const iconUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "icon.png"));
    const hasClientId = !!this.getClientId();
    try {
      const htmlTemplate = this.readSidebarFile("src", "sidebar.html");
      return this.applyTemplateVariables(htmlTemplate, {
        AUTHENTICATED: String(isAuthenticated),
        CSP_SOURCE: webview.cspSource,
        CSS_URI: cssUri.toString(),
        HEADER_BUTTONS: this.getHeaderButtons(isAuthenticated),
        ICON_URI: iconUri.toString(),
        MAIN_CONTENT: this.getMainContent(isAuthenticated, hasClientId),
        NONCE: nonce,
        SCRIPT_URI: scriptUri.toString(),
        STATUS_CLASS: isAuthenticated ? "connected" : "",
        STATUS_TEXT: isAuthenticated ? "LIVE" : "OFFLINE"
      });
    } catch (error) {
      console.error("Error loading HTML template:", error);
      return this.getInlineHtmlFallback(webview, nonce, isAuthenticated, iconUri);
    }
  }
  getInlineHtmlFallback(webview, nonce, isAuthenticated, iconUri) {
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
					${isAuthenticated ? "<p>\u2705 Connected to Spotify</p>" : `<p>Connect your Spotify account to start using CodeBeats!</p><button class="btn" onclick="vscode.postMessage({type: 'login'})">Connect Spotify</button>`}
				</div>
			</div>
			<script nonce="${nonce}">
				const vscode = acquireVsCodeApi();
			</script>
		</body>
		</html>`;
  }
  readSidebarFile(...pathSegments) {
    return fs.readFileSync(path.join(this.context.extensionPath, ...pathSegments), "utf-8");
  }
  applyTemplateVariables(template, values) {
    return Object.entries(values).reduce((output, [key, value]) => {
      return output.replace(new RegExp(`{{${key}}}`, "g"), value);
    }, template);
  }
  getHeaderButtons(isAuthenticated) {
    if (!isAuthenticated) {
      return "";
    }
    return this.readSidebarFile("src", "sidebar", "templates", "header-buttons.html");
  }
  getMainContent(isAuthenticated, hasClientId) {
    if (isAuthenticated) {
      const authenticatedSections = [
        "now-playing.html",
        "controls.html",
        "device.html",
        "playlists.html",
        "sign-out.html"
      ];
      return authenticatedSections.map((file) => this.readSidebarFile("src", "sidebar", "templates", file)).join("\n");
    }
    if (!hasClientId) {
      return this.readSidebarFile("src", "sidebar", "templates", "setup-state.html");
    }
    return this.readSidebarFile("src", "sidebar", "templates", "auth-state.html");
  }
};
function getNonce() {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 16 }, () => possible.charAt(Math.floor(Math.random() * possible.length))).join("");
}

// src/extension.ts
var dotenv = __toESM(require_main());
var path2 = __toESM(require("path"));
var REDIRECT_PORT = 4567;
var REDIRECT_URI = `https://127.0.0.1:${REDIRECT_PORT}/callback`;
var TOKEN_SECRET_KEY = "music-player.spotify.tokens";
var SPOTIFY_SCOPES = "user-read-playback-state user-modify-playback-state user-library-read user-library-modify playlist-read-private playlist-read-collaborative";
var DEBUG = false;
var sideBar;
var statusBarItem;
var authServer;
var authTimeout;
async function activate(context) {
  const envPath = path2.join(context.extensionPath, ".env");
  dotenv.config({ path: envPath });
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  sideBar = new SidebarProvider(context);
  const webviewProvider = vscode2.window.registerWebviewViewProvider(
    "music-player.sidebar",
    sideBar,
    {
      webviewOptions: {
        retainContextWhenHidden: true
      }
    }
  );
  console.log("Activity bar webview provider registered:", webviewProvider);
  const explorerWebviewProvider = vscode2.window.registerWebviewViewProvider(
    "music-player.sidebar-explorer",
    sideBar,
    {
      webviewOptions: {
        retainContextWhenHidden: true
      }
    }
  );
  console.log("Explorer webview provider registered:", explorerWebviewProvider);
  const disposables = [
    webviewProvider,
    explorerWebviewProvider,
    vscode2.commands.registerCommand("music-player.selectDevice", async () => {
      console.log("Select device command triggered");
      const devices = await listDevices(context);
      if (!devices || devices.length === 0) {
        vscode2.window.showInformationMessage("No Spotify devices found. Open Spotify on a device and try again.");
        return;
      }
      const pick = await vscode2.window.showQuickPick(
        devices.map((d) => ({ label: d.name + (d.is_active ? " \u2014 active" : ""), description: d.id, id: d.id })),
        { placeHolder: "Choose a device to transfer playback to" }
      );
      if (pick?.id) {
        await transferPlayback(context, pick.id, true);
      }
    }),
    vscode2.commands.registerCommand("music-player.login", () => login(context)),
    vscode2.commands.registerCommand("music-player.logout", () => logout(context)),
    vscode2.commands.registerCommand("music-player.togglePlayPause", () => togglePlayPause(context)),
    vscode2.commands.registerCommand("music-player.play", () => play(context)),
    vscode2.commands.registerCommand("music-player.pause", () => pause(context)),
    vscode2.commands.registerCommand("music-player.next", () => nextTrack(context)),
    vscode2.commands.registerCommand("music-player.previous", () => previousTrack(context)),
    vscode2.commands.registerCommand("music-player.getCurrentPlayback", () => getCurrentPlayback(context)),
    vscode2.commands.registerCommand("music-player.setVolume", (volume) => setVolume(context, volume)),
    vscode2.commands.registerCommand("music-player.toggleShuffle", () => toggleShuffle(context)),
    vscode2.commands.registerCommand("music-player.cycleRepeat", () => cycleRepeat(context)),
    vscode2.commands.registerCommand("music-player.toggleLike", () => toggleLike(context)),
    vscode2.commands.registerCommand("music-player.getQueue", () => getQueue(context)),
    vscode2.commands.registerCommand("music-player.getUserPlaylists", () => getUserPlaylists(context)),
    vscode2.commands.registerCommand("music-player.playPlaylist", (playlistId) => playPlaylist(context, playlistId))
  ];
  statusBarItem = vscode2.window.createStatusBarItem(vscode2.StatusBarAlignment.Right, 100);
  statusBarItem.command = "music-player.statusBarClick";
  statusBarItem.text = "$(music) CodeBeats";
  statusBarItem.tooltip = "Click to play/pause";
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);
  const statusBarCommand = vscode2.commands.registerCommand("music-player.statusBarClick", async () => {
    const playbackInfo = await getCurrentPlayback(context);
    if (playbackInfo?.isPlaying) {
      await pause(context);
    } else {
      await play(context);
    }
  });
  context.subscriptions.push(...disposables, statusBarCommand);
  loadTokenSet(context).then((token) => {
    if (token) {
      sideBar?.setAccessToken(token.accessToken);
      startStatusBarUpdates(context);
    }
  });
}
function startStatusBarUpdates(context) {
  const updateStatusBar = async () => {
    const playbackInfo = await getCurrentPlayback(context);
    if (!statusBarItem) {
      return;
    }
    if (playbackInfo && playbackInfo.track && !playbackInfo.noDevice) {
      const icon = playbackInfo.isPlaying ? "$(play)" : "$(debug-pause)";
      const trackInfo = `${playbackInfo.track} - ${playbackInfo.artist}`;
      statusBarItem.text = `${icon} ${trackInfo}`;
      statusBarItem.tooltip = `${trackInfo}
Click to ${playbackInfo.isPlaying ? "pause" : "play"}`;
    } else {
      statusBarItem.text = "$(music) CodeBeats";
      statusBarItem.tooltip = "No active playback";
    }
  };
  updateStatusBar();
}
function deactivate() {
  if (authServer) {
    authServer.close();
    authServer = void 0;
  }
  if (authTimeout) {
    clearTimeout(authTimeout);
    authTimeout = void 0;
  }
}
function getClientId() {
  const envClientId = process.env.SPOTIFY_CLIENT_ID;
  if (envClientId) {
    return envClientId;
  }
  const newSetting = vscode2.workspace.getConfiguration("codebeats").get("spotifyClientId");
  if (newSetting) {
    return newSetting;
  }
  return vscode2.workspace.getConfiguration("music-player").get("spotifyClientId");
}
async function login(context) {
  const clientId = getClientId();
  if (!clientId) {
    vscode2.window.showInformationMessage("Welcome to CodeBeats! \u{1F3B5} Open the sidebar to connect your Spotify account.");
    return;
  }
  if (authServer) {
    authServer.close();
    authServer = void 0;
  }
  if (authTimeout) {
    clearTimeout(authTimeout);
    authTimeout = void 0;
  }
  const { verifier, challenge } = createPkcePair();
  const state = (0, import_crypto.randomBytes)(16).toString("hex");
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("scope", SPOTIFY_SCOPES.split(" ").join("+"));
  authUrl.searchParams.set("code_challenge_method", "S256");
  authUrl.searchParams.set("code_challenge", challenge);
  authUrl.searchParams.set("state", state);
  const cleanup = () => {
    if (authServer) {
      authServer.close();
      authServer = void 0;
    }
    if (authTimeout) {
      clearTimeout(authTimeout);
      authTimeout = void 0;
    }
  };
  authServer = (0, import_https.createServer)(getSelfSignedCert(), async (req, res) => {
    const targetUrl = new URL(req.url ?? "", `https://127.0.0.1:${REDIRECT_PORT}`);
    if (targetUrl.pathname !== "/callback") {
      res.writeHead(404).end();
      return;
    }
    const returnedState = targetUrl.searchParams.get("state");
    const code = targetUrl.searchParams.get("code");
    const error = targetUrl.searchParams.get("error");
    if (error || !code || returnedState !== state) {
      res.writeHead(400, { "Content-Type": "text/plain" }).end("Authentication failed. Please try again.");
      cleanup();
      vscode2.window.showErrorMessage("Spotify authentication failed. Please try again.");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/plain" }).end("Authentication successful! You can close this tab.");
    cleanup();
    const tokenSet = await exchangeCodeForToken({ code, verifier, clientId });
    if (!tokenSet) {
      vscode2.window.showErrorMessage("Failed to obtain access token from Spotify. Please try again.");
      return;
    }
    await context.secrets.store(TOKEN_SECRET_KEY, JSON.stringify(tokenSet));
    sideBar?.setAccessToken(tokenSet.accessToken);
    vscode2.window.showInformationMessage("Successfully authenticated with Spotify!");
  });
  authTimeout = setTimeout(() => {
    if (authServer) {
      authServer.close();
      authServer = void 0;
    }
    authTimeout = void 0;
    vscode2.window.showWarningMessage("Authentication timed out. Please try connecting again.");
  }, 5 * 60 * 1e3);
  authServer.listen(REDIRECT_PORT, () => {
    vscode2.env.openExternal(vscode2.Uri.parse(authUrl.toString()));
  });
  authServer.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      vscode2.window.showWarningMessage("Port is already in use. Closing existing connection and retrying...");
      cleanup();
      setTimeout(() => {
        login(context);
      }, 1e3);
    } else {
      cleanup();
      vscode2.window.showErrorMessage(`Failed to start authentication server: ${err.message}`);
    }
  });
}
async function logout(context) {
  const confirm = await vscode2.window.showWarningMessage(
    "Are you sure you want to sign out of Spotify? You will need to re-authenticate.",
    "Sign Out",
    "Cancel"
  );
  if (confirm !== "Sign Out") {
    return;
  }
  await context.secrets.delete(TOKEN_SECRET_KEY);
  sideBar?.setAccessToken(void 0);
  if (statusBarItem) {
    statusBarItem.hide();
  }
  vscode2.window.showInformationMessage('Successfully signed out of Spotify. Click "Connect Spotify" to sign in again.');
}
async function callPlayerEndpoint(context, url, init, retryCount = 0) {
  const tokenSet = await ensureValidToken(context);
  if (!tokenSet) {
    vscode2.window.showErrorMessage("Not authenticated with Spotify. Please log in.");
    return;
  }
  const maxRetries = 3;
  const baseDelay = 1e3;
  const response = await fetch(url, {
    ...init,
    headers: {
      "Authorization": `Bearer ${tokenSet.accessToken}`,
      "Content-Type": "application/json",
      ...init.headers || {}
    }
  });
  if (!response.ok) {
    const body = await safeReadBody(response);
    if (DEBUG) {
      console.error(`API Error - Endpoint: ${url} - Status: ${response.status} ${response.statusText} - Body: ${body ?? "No response body"}`);
    }
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      const delay = retryAfter ? parseInt(retryAfter) * 1e3 : baseDelay * Math.pow(2, retryCount);
      if (retryCount < maxRetries) {
        if (DEBUG) {
          console.log(`Rate limited (429). Retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        return callPlayerEndpoint(context, url, init, retryCount + 1);
      } else {
        const isVolumeEndpoint = url.includes("/volume");
        const errorMessage = isVolumeEndpoint ? "Volume update rate limit exceeded. Please wait a moment before adjusting volume again." : `Spotify API rate limit exceeded (429). Please wait a moment and try again.`;
        vscode2.window.showWarningMessage(errorMessage);
        return void 0;
      }
    }
    if (response.status === 403) {
      const action = await vscode2.window.showErrorMessage(
        `Spotify API access denied (403). Endpoint: ${url}. Your account must be added to the app allowlist in Developer Dashboard.`,
        "Open Dashboard"
      );
      if (action === "Open Dashboard") {
        vscode2.env.openExternal(vscode2.Uri.parse("https://developer.spotify.com/dashboard"));
      }
    } else if (response.status === 404 && body?.includes("NO_ACTIVE_DEVICE")) {
      const action = await vscode2.window.showInformationMessage(
        "No active Spotify device found. Please open Spotify on your computer, phone, or web player.",
        "Select Device",
        "Open Spotify Web"
      );
      if (action === "Select Device") {
        vscode2.commands.executeCommand("music-player.selectDevice");
      } else if (action === "Open Spotify Web") {
        vscode2.env.openExternal(vscode2.Uri.parse("https://open.spotify.com"));
      }
    } else {
      vscode2.window.showErrorMessage(`Spotify API request failed: ${response.status} ${response.statusText} - Endpoint: ${url} - ${body ?? "No response body"}`);
    }
    return void 0;
  }
  return response;
}
async function togglePlayPause(context) {
  const playback = await getCurrentPlayback(context);
  if (!playback || playback.noDevice) {
    vscode2.window.showInformationMessage("No active Spotify device found. Please open Spotify.");
    return;
  }
  if (playback.isPlaying) {
    await callPlayerEndpoint(context, "https://api.spotify.com/v1/me/player/pause", {
      method: "PUT"
    });
  } else {
    await callPlayerEndpoint(context, "https://api.spotify.com/v1/me/player/play", {
      method: "PUT"
    });
  }
  const updated = await getCurrentPlayback(context);
  sideBar?.sendPlaybackInfo(updated);
}
async function play(context) {
  await callPlayerEndpoint(context, "https://api.spotify.com/v1/me/player/play", {
    method: "PUT"
  });
  const updated = await getCurrentPlayback(context);
  sideBar?.sendPlaybackInfo(updated);
}
async function pause(context) {
  await callPlayerEndpoint(context, "https://api.spotify.com/v1/me/player/pause", {
    method: "PUT"
  });
  const updated = await getCurrentPlayback(context);
  sideBar?.sendPlaybackInfo(updated);
}
async function nextTrack(context) {
  await callPlayerEndpoint(context, "https://api.spotify.com/v1/me/player/next", {
    method: "POST"
  });
  const updated = await getCurrentPlayback(context);
  sideBar?.sendPlaybackInfo(updated);
}
async function previousTrack(context) {
  await callPlayerEndpoint(context, "https://api.spotify.com/v1/me/player/previous", {
    method: "POST"
  });
  const updated = await getCurrentPlayback(context);
  sideBar?.sendPlaybackInfo(updated);
}
async function getCurrentPlayback(context) {
  const tokenSet = await ensureValidToken(context);
  if (!tokenSet) {
    return void 0;
  }
  const url = "https://api.spotify.com/v1/me/player";
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${tokenSet.accessToken}` }
  });
  if (!response.ok) {
    if (response.status === 204) {
      return { isPlaying: false, noDevice: true };
    }
    const body = await safeReadBody(response);
    if (DEBUG) {
      console.error(`API Error - Endpoint: ${url} - Status: ${response.status} ${response.statusText} - Body: ${body ?? "No response body"}`);
    }
    return void 0;
  }
  const data = await safeJsonParse(response);
  if (!data) {
    return void 0;
  }
  const queueData = await getQueue(context);
  const trackId = data.item?.id;
  const isLiked = trackId ? await checkIfTrackIsLiked(context, trackId) : false;
  return {
    isPlaying: data.is_playing,
    track: data.item?.name,
    trackId,
    artist: data.item?.artists?.map((a) => a.name).join(", "),
    album: data.item?.album?.name,
    albumArt: data.item?.album?.images?.[0]?.url,
    progressMs: data.progress_ms,
    durationMs: data.item?.duration_ms,
    volume: data.device?.volume_percent,
    shuffleState: data.shuffle_state,
    repeatState: data.repeat_state,
    // off, track, context
    isLiked,
    nextTrack: queueData?.nextTrack,
    nextArtist: queueData?.nextArtist,
    queue: queueData?.queue || [],
    deviceName: data.device?.name,
    deviceType: data.device?.type
  };
}
async function setVolume(context, volumePercent) {
  const volume = Math.max(0, Math.min(100, Math.round(volumePercent)));
  await callPlayerEndpoint(context, `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {
    method: "PUT"
  });
  const updated = await getCurrentPlayback(context);
  sideBar?.sendPlaybackInfo(updated);
}
async function toggleShuffle(context) {
  const playbackInfo = await getCurrentPlayback(context);
  const newShuffleState = !playbackInfo?.shuffleState;
  await callPlayerEndpoint(context, `https://api.spotify.com/v1/me/player/shuffle?state=${newShuffleState}`, {
    method: "PUT"
  });
  const updated = await getCurrentPlayback(context);
  sideBar?.sendPlaybackInfo(updated);
}
async function cycleRepeat(context) {
  const playbackInfo = await getCurrentPlayback(context);
  const currentRepeat = playbackInfo?.repeatState || "off";
  let newRepeat = "off";
  if (currentRepeat === "off") {
    newRepeat = "context";
  } else if (currentRepeat === "context") {
    newRepeat = "track";
  }
  await callPlayerEndpoint(context, `https://api.spotify.com/v1/me/player/repeat?state=${newRepeat}`, {
    method: "PUT"
  });
  const updated = await getCurrentPlayback(context);
  sideBar?.sendPlaybackInfo(updated);
}
async function checkIfTrackIsLiked(context, trackId) {
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
    console.error(`\u{1F6A8} API Error - Endpoint: ${url} - Status: ${response.status} ${response.statusText} - Body: ${body ?? "No response body"}`);
    return false;
  }
  const data = await safeJsonParse(response);
  if (!data || !Array.isArray(data) || data.length === 0) {
    return false;
  }
  return data[0] === true;
}
async function toggleLike(context) {
  const playbackInfo = await getCurrentPlayback(context);
  const trackId = playbackInfo?.trackId;
  if (!trackId) {
    vscode2.window.showWarningMessage("No track currently playing");
    return;
  }
  const isLiked = playbackInfo?.isLiked;
  const tokenSet = await ensureValidToken(context);
  if (!tokenSet) {
    vscode2.window.showErrorMessage("Not authenticated with Spotify. Please log in.");
    return;
  }
  const method = isLiked ? "DELETE" : "PUT";
  const url = `https://api.spotify.com/v1/me/tracks?ids=${trackId}`;
  const response = await fetch(url, {
    method,
    headers: {
      "Authorization": `Bearer ${tokenSet.accessToken}`,
      "Content-Type": "application/json"
    }
  });
  if (response.ok) {
    const message = isLiked ? "Removed from Liked Songs" : "Added to Liked Songs";
    vscode2.window.showInformationMessage(message);
    const updated = await getCurrentPlayback(context);
    sideBar?.sendPlaybackInfo(updated);
  } else {
    const body = await safeReadBody(response);
    if (DEBUG) {
      console.error(`API Error - Endpoint: ${url} - Status: ${response.status} ${response.statusText} - Body: ${body ?? "No response body"}`);
    }
    vscode2.window.showErrorMessage("Failed to update liked status");
  }
}
async function getQueue(context) {
  const tokenSet = await ensureValidToken(context);
  if (!tokenSet) {
    return void 0;
  }
  const url = "https://api.spotify.com/v1/me/player/queue";
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${tokenSet.accessToken}` }
  });
  if (!response.ok) {
    const body = await safeReadBody(response);
    if (DEBUG) {
      console.error(`API Error - Endpoint: ${url} - Status: ${response.status} ${response.statusText} - Body: ${body ?? "No response body"}`);
    }
    return void 0;
  }
  const data = await safeJsonParse(response);
  if (!data || !data.queue || !Array.isArray(data.queue)) {
    return void 0;
  }
  const nextTrack2 = data.queue[0];
  const queue = data.queue.map((track) => ({
    id: track.id,
    name: track.name,
    artist: track.artists?.map((a) => a.name).join(", ") || "Unknown Artist",
    albumArt: track.album?.images?.[2]?.url || track.album?.images?.[1]?.url || track.album?.images?.[0]?.url,
    durationMs: track.duration_ms
  }));
  return {
    nextTrack: nextTrack2?.name,
    nextArtist: nextTrack2?.artists?.map((a) => a.name).join(", "),
    queue
  };
}
async function listDevices(context) {
  const tokenSet = await ensureValidToken(context);
  if (!tokenSet) {
    vscode2.window.showErrorMessage("Not authenticated with Spotify. Please log in.");
    return [];
  }
  const url = "https://api.spotify.com/v1/me/player/devices";
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${tokenSet.accessToken}` }
  });
  if (!resp.ok) {
    const body = await safeReadBody(resp);
    if (DEBUG) {
      console.error(`API Error - Endpoint: ${url} - Status: ${resp.status} ${resp.statusText} - Body: ${body ?? "No response body"}`);
    }
    if (resp.status === 403) {
      const action = await vscode2.window.showErrorMessage(
        `Spotify API access denied (403 Forbidden). Endpoint: ${url}. Your account may not be on the app allowlist.`,
        "Open Dashboard",
        "Learn More"
      );
      if (action === "Open Dashboard") {
        vscode2.env.openExternal(vscode2.Uri.parse("https://developer.spotify.com/dashboard"));
      } else if (action === "Learn More") {
        vscode2.env.openExternal(vscode2.Uri.parse("https://developer.spotify.com/documentation/web-api/concepts/quota-modes"));
      }
    } else {
      vscode2.window.showErrorMessage(`Failed to fetch devices: ${resp.status} ${resp.statusText} - Endpoint: ${url} - ${body ?? ""}`);
    }
    return [];
  }
  const data = await safeJsonParse(resp);
  if (!data || !data.devices) {
    return [];
  }
  return (data.devices || []).map((d) => ({ id: d.id, name: d.name, is_active: d.is_active }));
}
async function getUserPlaylists(context) {
  const tokenSet = await ensureValidToken(context);
  if (!tokenSet) {
    vscode2.window.showErrorMessage("Not authenticated with Spotify. Please log in.");
    return [];
  }
  const playlists = [];
  let url = "https://api.spotify.com/v1/me/playlists?limit=50";
  while (url) {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${tokenSet.accessToken}` }
    });
    if (!response.ok) {
      const body = await safeReadBody(response);
      if (DEBUG) {
        console.error(`API Error - Endpoint: ${url} - Status: ${response.status} ${response.statusText} - Body: ${body ?? "No response body"}`);
      }
      if (response.status === 403) {
        const action = await vscode2.window.showErrorMessage(
          `Spotify API access denied (403 Forbidden). Playlist access requires playlist-read-private and playlist-read-collaborative scopes. Please re-authenticate.`,
          "Re-authenticate",
          "Learn More"
        );
        if (action === "Re-authenticate") {
          vscode2.commands.executeCommand("music-player.logout");
          setTimeout(() => vscode2.commands.executeCommand("music-player.login"), 1e3);
        } else if (action === "Learn More") {
          vscode2.env.openExternal(vscode2.Uri.parse("https://developer.spotify.com/documentation/web-api/concepts/scopes"));
        }
      } else {
        vscode2.window.showErrorMessage(`Failed to fetch playlists: ${response.status} ${response.statusText}`);
      }
      break;
    }
    const data = await safeJsonParse(response);
    if (!data || !data.items) {
      break;
    }
    playlists.push(...data.items.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description || "",
      imageUrl: playlist.images?.[0]?.url || playlist.images?.[1]?.url,
      owner: playlist.owner?.display_name || playlist.owner?.id || "Unknown",
      trackCount: playlist.tracks?.total || 0
    })));
    url = data.next || void 0;
  }
  return playlists;
}
async function playPlaylist(context, playlistId) {
  const tokenSet = await ensureValidToken(context);
  if (!tokenSet) {
    vscode2.window.showErrorMessage("Not authenticated with Spotify. Please log in.");
    return;
  }
  const url = "https://api.spotify.com/v1/me/player/play";
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${tokenSet.accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      context_uri: `spotify:playlist:${playlistId}`
    })
  });
  if (!response.ok) {
    const body = await safeReadBody(response);
    if (DEBUG) {
      console.error(`API Error - Endpoint: ${url} - Status: ${response.status} ${response.statusText} - Body: ${body ?? "No response body"}`);
    }
    if (response.status === 404 && body?.includes("NO_ACTIVE_DEVICE")) {
      const action = await vscode2.window.showInformationMessage(
        "No active Spotify device found. Please open Spotify on your computer, phone, or web player.",
        "Select Device",
        "Open Spotify Web"
      );
      if (action === "Select Device") {
        vscode2.commands.executeCommand("music-player.selectDevice");
      } else if (action === "Open Spotify Web") {
        vscode2.env.openExternal(vscode2.Uri.parse("https://open.spotify.com"));
      }
    } else {
      vscode2.window.showErrorMessage(`Failed to play playlist: ${response.status} ${response.statusText}`);
    }
    return;
  }
  setTimeout(async () => {
    const updated = await getCurrentPlayback(context);
    sideBar?.sendPlaybackInfo(updated);
  }, 1e3);
}
async function transferPlayback(context, deviceId, play2 = true) {
  const tokenSet = await ensureValidToken(context);
  if (!tokenSet) {
    vscode2.window.showErrorMessage("Not authenticated with Spotify. Please log in.");
    return;
  }
  const url = "https://api.spotify.com/v1/me/player";
  const resp = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${tokenSet.accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ device_ids: [deviceId], play: play2 })
  });
  if (!resp.ok) {
    const body = await safeReadBody(resp);
    if (DEBUG) {
      console.error(`API Error - Endpoint: ${url} (PUT) - Status: ${resp.status} ${resp.statusText} - Body: ${body ?? "No response body"}`);
    }
    vscode2.window.showErrorMessage(`Failed to transfer playback: ${resp.status} ${resp.statusText} - Endpoint: ${url} - ${body ?? ""}`);
    return;
  }
  vscode2.window.showInformationMessage("Playback transferred to selected device.");
}
async function ensureValidToken(context) {
  const clientId = getClientId();
  if (!clientId) {
    return void 0;
  }
  const stored = await loadTokenSet(context);
  if (!stored) {
    return void 0;
  }
  if (stored.expiresAt > Date.now() + 6e4) {
    return stored;
  }
  const regreshed = await refreshToken(stored.refreshToken, clientId);
  if (!regreshed) {
    return void 0;
  }
  const updated = {
    accessToken: regreshed.access_token,
    refreshToken: regreshed.refresh_token ?? stored.refreshToken,
    expiresAt: Date.now() + regreshed.expires_in * 1e3
  };
  await context.secrets.store(TOKEN_SECRET_KEY, JSON.stringify(updated));
  sideBar?.setAccessToken(updated.accessToken);
  return updated;
}
async function exchangeCodeForToken(params) {
  const url = "https://accounts.spotify.com/api/token";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: params.code,
      redirect_uri: REDIRECT_URI,
      client_id: params.clientId,
      code_verifier: params.verifier
    })
  });
  if (!response.ok) {
    const body = await safeReadBody(response);
    if (DEBUG) {
      console.error(`API Error - Endpoint: ${url} (exchangeCodeForToken) - Status: ${response.status} ${response.statusText} - Body: ${body ?? "No response body"}`);
    }
    return void 0;
  }
  const token = await safeJsonParse(response);
  if (!token || !token.access_token) {
    return void 0;
  }
  return {
    accessToken: token.access_token,
    refreshToken: token.refresh_token ?? "",
    expiresAt: Date.now() + token.expires_in * 1e3
  };
}
async function refreshToken(refreshTokenValue, clientId) {
  const url = "https://accounts.spotify.com/api/token";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshTokenValue,
      client_id: clientId
    })
  });
  if (!response.ok) {
    const body = await safeReadBody(response);
    if (DEBUG) {
      console.error(`API Error - Endpoint: ${url} (refreshToken) - Status: ${response.status} ${response.statusText} - Body: ${body ?? "No response body"}`);
    }
    return void 0;
  }
  return await safeJsonParse(response);
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
  const verifier = base64Url((0, import_crypto.randomBytes)(32));
  const challenge = base64Url((0, import_crypto.createHash)("sha256").update(verifier).digest());
  return { verifier, challenge };
}
function base64Url(buffer) {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function loadTokenSet(context) {
  const raw = await context.secrets.get(TOKEN_SECRET_KEY);
  if (!raw || raw.trim().length === 0) {
    return void 0;
  }
  try {
    const tokenSet = JSON.parse(raw);
    return tokenSet;
  } catch (e) {
    console.error("Failed to parse token set from secrets:", e);
    await context.secrets.delete(TOKEN_SECRET_KEY);
    return void 0;
  }
}
async function safeReadBody(response) {
  try {
    return await response.text();
  } catch (error) {
    console.error("Failed to read response body", error);
    return void 0;
  }
}
async function safeJsonParse(response) {
  try {
    const text = await response.text();
    if (!text || text.trim().length === 0) {
      return void 0;
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    return void 0;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
