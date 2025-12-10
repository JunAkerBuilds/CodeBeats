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
    var fs = require("fs");
    var path2 = require("path");
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
            if (fs.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path2.resolve(process.cwd(), ".env.vault");
      }
      if (fs.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path2.join(os.homedir(), envPath.slice(1)) : envPath;
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
      const dotenvPath = path2.resolve(process.cwd(), ".env");
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
      for (const path3 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs.readFileSync(path3, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path3} ${e.message}`);
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
            const relative = path2.relative(process.cwd(), filePath);
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
      if (!message || !message.type) return;
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
      }
    });
    console.log("Webview resolution complete");
  }
  getHtml(webview) {
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
				}
				
				.album-art.spinning img {
					animation: smoothSpin 8s linear infinite;
				}
				
				@keyframes smoothSpin {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
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
					display: ${isAuthenticated ? "block" : "none"};
					margin-top: 16px;
					padding-top: 16px;
					border-top: 1px solid var(--vscode-widget-border);
					text-align: center;
				}
				
				/* Compact Controls */
				.controls-section {
					display: ${isAuthenticated ? "block" : "none"};
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
						` : ""}
						<div class="status-pill ${isAuthenticated ? "connected" : ""}">
							<span class="status-dot"></span>
							${isAuthenticated ? "LIVE" : "OFFLINE"}
						</div>
					</div>
			</div>

			${isAuthenticated ? `
					<div class="now-playing-card" id="now-playing-card">
						<div id="now-playing">
					<div class="no-playback">
								<div class="no-playback-icon">\u{1F3A7}</div>
								<div class="no-playback-text">Waiting for playback...</div>
					</div>
				</div>
					</div>
				` : !hasClientId ? `
					<div class="setup-section">
						<div class="setup-icon">\u{1F680}</div>
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
							<p class="setup-complete-text">\u2705 Once you've configured your Client ID, click below to connect:</p>
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
						<span class="auth-icon">\u{1F3B5}</span>
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
				
				// Volume controls (declared at top level for access in updateNowPlaying)
				const volumeSlider = document.getElementById('volume-slider');
				const volumeValue = document.getElementById('volume-value');
				const volumeIcon = document.getElementById('volume-icon');
				let previousVolume = 50; // Store volume before muting
				
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
							volumeSlider.value = '0';
							volumeValue.textContent = '0%';
							updateVolumeIcon(0);
							vscode.postMessage({ type: 'setVolume', volume: 0 });
						} else {
							// Unmute: restore previous volume
							const restoreVolume = previousVolume || 50;
							volumeSlider.value = restoreVolume.toString();
							volumeValue.textContent = restoreVolume + '%';
							updateVolumeIcon(restoreVolume);
							vscode.postMessage({ type: 'setVolume', volume: restoreVolume });
						}
					});
				}
				
				// Volume slider event listener
				if (volumeSlider && volumeValue) {
					volumeSlider.addEventListener('input', (e) => {
						const volume = parseInt(e.target.value);
						volumeValue.textContent = volume + '%';
						
						// Update icon based on volume
						updateVolumeIcon(volume);
						
						// Store as previous volume if not muting
						if (volume > 0) {
							previousVolume = volume;
						}
						
						vscode.postMessage({ type: 'setVolume', volume: volume });
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
								<div class="no-playback-icon">\u{1F3A7}</div>
								<div class="no-playback-text">\${data?.noDevice ? 'No active device found' : 'Nothing playing'}</div>
							</div>
						\`;
						if (cardEl) cardEl.classList.remove('playing');
						isPlaying = false;
						stopProgressAnimation();
						updatePlayPauseIcon();
						return;
					}

					isPlaying = data.isPlaying;
					const spinClass = isPlaying ? 'spinning' : '';
					const progress = data.progressMs && data.durationMs ? (data.progressMs / data.durationMs) * 100 : 0;
					
					// Update progress tracking for smooth animation
					lastProgressMs = data.progressMs || 0;
					lastDurationMs = data.durationMs || 0;
					lastUpdateTime = Date.now();
					
					nowPlayingEl.innerHTML = \`
						<div class="album-container">
							<div class="album-art-wrapper">
							<div class="album-art \${spinClass}">
								\${data.albumArt ? 
									\`<img src="\${data.albumArt}" alt="Album art" />\` : 
										\`<span class="vinyl-icon">\u{1F4BF}</span>\`
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
					
					// Set progress width via JavaScript (CSP-safe)
					const progressFill = document.querySelector('.progress-fill');
					if (progressFill) {
						const progressValue = progressFill.getAttribute('data-progress');
						if (progressValue) {
							progressFill.style.width = progressValue + '%';
						}
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
					if (data.volume !== undefined && volumeSlider && volumeValue) {
						const currentSliderVolume = parseInt(volumeSlider.value);
						// Only update if significantly different (avoid fighting with user input)
						if (Math.abs(currentSliderVolume - data.volume) > 2) {
							volumeSlider.value = data.volume;
							volumeValue.textContent = data.volume + '%';
							updateVolumeIcon(data.volume);
							if (data.volume > 0) {
								previousVolume = data.volume;
							}
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
};
function getNonce() {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 16 }, () => possible.charAt(Math.floor(Math.random() * possible.length))).join("");
}

// src/extension.ts
var dotenv = __toESM(require_main());
var path = __toESM(require("path"));
var REDIRECT_PORT = 4567;
var REDIRECT_URI = `https://127.0.0.1:${REDIRECT_PORT}/callback`;
var TOKEN_SECRET_KEY = "music-player.spotify.tokens";
var SPOTIFY_SCOPES = "user-read-playback-state user-modify-playback-state user-library-read user-library-modify";
var DEBUG = false;
var sideBar;
var statusBarItem;
async function activate(context) {
  const envPath = path.join(context.extensionPath, ".env");
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
    vscode2.commands.registerCommand("music-player.toggleLike", () => toggleLike(context))
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
    if (!statusBarItem) return;
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
  const server = (0, import_https.createServer)(getSelfSignedCert(), async (req, res) => {
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
      server.close();
      vscode2.window.showErrorMessage("Spotify authentication failed. Please try again.");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/plain" }).end("Authentication successful! You can close this tab.");
    server.close();
    const tokenSet = await exchangeCodeForToken({ code, verifier, clientId });
    if (!tokenSet) {
      vscode2.window.showErrorMessage("Failed to obtain access token from Spotify. Please try again.");
      return;
    }
    await context.secrets.store(TOKEN_SECRET_KEY, JSON.stringify(tokenSet));
    sideBar?.setAccessToken(tokenSet.accessToken);
    vscode2.window.showInformationMessage("Successfully authenticated with Spotify!");
  });
  server.listen(REDIRECT_PORT, () => {
    vscode2.env.openExternal(vscode2.Uri.parse(authUrl.toString()));
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
async function callPlayerEndpoint(context, url, init) {
  const tokenSet = await ensureValidToken(context);
  if (!tokenSet) {
    vscode2.window.showErrorMessage("Not authenticated with Spotify. Please log in.");
    return;
  }
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
    return;
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
  const data = await response.json();
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
  const data = await response.json();
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
  const data = await response.json();
  const nextTrack2 = data.queue?.[0];
  if (!nextTrack2) {
    return void 0;
  }
  return {
    nextTrack: nextTrack2.name,
    nextArtist: nextTrack2.artists?.map((a) => a.name).join(", ")
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
  const data = await resp.json();
  return (data.devices || []).map((d) => ({ id: d.id, name: d.name, is_active: d.is_active }));
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
  const token = await response.json();
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
  return await response.json();
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
  if (!raw) {
    return void 0;
  }
  try {
    const tokenSet = JSON.parse(raw);
    return tokenSet;
  } catch (e) {
    console.error("Failed to parse token set from secrets:", e);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
