"use strict";var ee=Object.create;var S=Object.defineProperty;var te=Object.getOwnPropertyDescriptor;var oe=Object.getOwnPropertyNames;var ae=Object.getPrototypeOf,ne=Object.prototype.hasOwnProperty;var L=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),se=(e,t)=>{for(var o in t)S(e,o,{get:t[o],enumerable:!0})},$=(e,t,o,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of oe(t))!ne.call(e,n)&&n!==o&&S(e,n,{get:()=>t[n],enumerable:!(a=te(t,n))||a.enumerable});return e};var T=(e,t,o)=>(o=e!=null?ee(ae(e)):{},$(t||!e||!e.__esModule?S(o,"default",{value:e,enumerable:!0}):o,e)),ie=e=>$(S({},"__esModule",{value:!0}),e);var O=L((Ge,ce)=>{ce.exports={name:"dotenv",version:"17.2.3",description:"Loads environment variables from .env file",main:"lib/main.js",types:"lib/main.d.ts",exports:{".":{types:"./lib/main.d.ts",require:"./lib/main.js",default:"./lib/main.js"},"./config":"./config.js","./config.js":"./config.js","./lib/env-options":"./lib/env-options.js","./lib/env-options.js":"./lib/env-options.js","./lib/cli-options":"./lib/cli-options.js","./lib/cli-options.js":"./lib/cli-options.js","./package.json":"./package.json"},scripts:{"dts-check":"tsc --project tests/types/tsconfig.json",lint:"standard",pretest:"npm run lint && npm run dts-check",test:"tap run tests/**/*.js --allow-empty-coverage --disable-coverage --timeout=60000","test:coverage":"tap run tests/**/*.js --show-full-coverage --timeout=60000 --coverage-report=text --coverage-report=lcov",prerelease:"npm test",release:"standard-version"},repository:{type:"git",url:"git://github.com/motdotla/dotenv.git"},homepage:"https://github.com/motdotla/dotenv#readme",funding:"https://dotenvx.com",keywords:["dotenv","env",".env","environment","variables","config","settings"],readmeFilename:"README.md",license:"BSD-2-Clause",devDependencies:{"@types/node":"^18.11.3",decache:"^4.6.2",sinon:"^14.0.1",standard:"^17.0.0","standard-version":"^9.5.0",tap:"^19.2.0",typescript:"^4.8.4"},engines:{node:">=12"},browser:{fs:!1}}});var H=L((Qe,b)=>{var V=require("fs"),D=require("path"),de=require("os"),le=require("crypto"),pe=O(),N=pe.version,_=["\u{1F510} encrypt with Dotenvx: https://dotenvx.com","\u{1F510} prevent committing .env to code: https://dotenvx.com/precommit","\u{1F510} prevent building .env in docker: https://dotenvx.com/prebuild","\u{1F4E1} add observability to secrets: https://dotenvx.com/ops","\u{1F465} sync secrets across teammates & machines: https://dotenvx.com/ops","\u{1F5C2}\uFE0F backup and recover secrets: https://dotenvx.com/ops","\u2705 audit secrets and track compliance: https://dotenvx.com/ops","\u{1F504} add secrets lifecycle management: https://dotenvx.com/ops","\u{1F511} add access controls to secrets: https://dotenvx.com/ops","\u{1F6E0}\uFE0F  run anywhere with `dotenvx run -- yourcommand`","\u2699\uFE0F  specify custom .env file path with { path: '/custom/path/.env' }","\u2699\uFE0F  enable debug logging with { debug: true }","\u2699\uFE0F  override existing env vars with { override: true }","\u2699\uFE0F  suppress all logs with { quiet: true }","\u2699\uFE0F  write to custom object with { processEnv: myObject }","\u2699\uFE0F  load multiple .env files with { path: ['.env.local', '.env'] }"];function ue(){return _[Math.floor(Math.random()*_.length)]}function C(e){return typeof e=="string"?!["false","0","no","off",""].includes(e.toLowerCase()):!!e}function ve(){return process.stdout.isTTY}function ge(e){return ve()?`\x1B[2m${e}\x1B[0m`:e}var me=/(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;function fe(e){let t={},o=e.toString();o=o.replace(/\r\n?/mg,`
`);let a;for(;(a=me.exec(o))!=null;){let n=a[1],i=a[2]||"";i=i.trim();let s=i[0];i=i.replace(/^(['"`])([\s\S]*)\1$/mg,"$2"),s==='"'&&(i=i.replace(/\\n/g,`
`),i=i.replace(/\\r/g,"\r")),t[n]=i}return t}function he(e){e=e||{};let t=U(e);e.path=t;let o=p.configDotenv(e);if(!o.parsed){let s=new Error(`MISSING_DATA: Cannot parse ${t} for an unknown reason`);throw s.code="MISSING_DATA",s}let a=j(e).split(","),n=a.length,i;for(let s=0;s<n;s++)try{let c=a[s].trim(),d=ye(o,c);i=p.decrypt(d.ciphertext,d.key);break}catch(c){if(s+1>=n)throw c}return p.parse(i)}function be(e){console.error(`[dotenv@${N}][WARN] ${e}`)}function I(e){console.log(`[dotenv@${N}][DEBUG] ${e}`)}function F(e){console.log(`[dotenv@${N}] ${e}`)}function j(e){return e&&e.DOTENV_KEY&&e.DOTENV_KEY.length>0?e.DOTENV_KEY:process.env.DOTENV_KEY&&process.env.DOTENV_KEY.length>0?process.env.DOTENV_KEY:""}function ye(e,t){let o;try{o=new URL(t)}catch(c){if(c.code==="ERR_INVALID_URL"){let d=new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");throw d.code="INVALID_DOTENV_KEY",d}throw c}let a=o.password;if(!a){let c=new Error("INVALID_DOTENV_KEY: Missing key part");throw c.code="INVALID_DOTENV_KEY",c}let n=o.searchParams.get("environment");if(!n){let c=new Error("INVALID_DOTENV_KEY: Missing environment part");throw c.code="INVALID_DOTENV_KEY",c}let i=`DOTENV_VAULT_${n.toUpperCase()}`,s=e.parsed[i];if(!s){let c=new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${i} in your .env.vault file.`);throw c.code="NOT_FOUND_DOTENV_ENVIRONMENT",c}return{ciphertext:s,key:a}}function U(e){let t=null;if(e&&e.path&&e.path.length>0)if(Array.isArray(e.path))for(let o of e.path)V.existsSync(o)&&(t=o.endsWith(".vault")?o:`${o}.vault`);else t=e.path.endsWith(".vault")?e.path:`${e.path}.vault`;else t=D.resolve(process.cwd(),".env.vault");return V.existsSync(t)?t:null}function R(e){return e[0]==="~"?D.join(de.homedir(),e.slice(1)):e}function xe(e){let t=C(process.env.DOTENV_CONFIG_DEBUG||e&&e.debug),o=C(process.env.DOTENV_CONFIG_QUIET||e&&e.quiet);(t||!o)&&F("Loading env from encrypted .env.vault");let a=p._parseVault(e),n=process.env;return e&&e.processEnv!=null&&(n=e.processEnv),p.populate(n,a,e),{parsed:a}}function we(e){let t=D.resolve(process.cwd(),".env"),o="utf8",a=process.env;e&&e.processEnv!=null&&(a=e.processEnv);let n=C(a.DOTENV_CONFIG_DEBUG||e&&e.debug),i=C(a.DOTENV_CONFIG_QUIET||e&&e.quiet);e&&e.encoding?o=e.encoding:n&&I("No encoding is specified. UTF-8 is used by default");let s=[t];if(e&&e.path)if(!Array.isArray(e.path))s=[R(e.path)];else{s=[];for(let g of e.path)s.push(R(g))}let c,d={};for(let g of s)try{let h=p.parse(V.readFileSync(g,{encoding:o}));p.populate(d,h,e)}catch(h){n&&I(`Failed to load ${g} ${h.message}`),c=h}let f=p.populate(a,d,e);if(n=C(a.DOTENV_CONFIG_DEBUG||n),i=C(a.DOTENV_CONFIG_QUIET||i),n||!i){let g=Object.keys(f).length,h=[];for(let M of s)try{let w=D.relative(process.cwd(),M);h.push(w)}catch(w){n&&I(`Failed to load ${M} ${w.message}`),c=w}F(`injecting env (${g}) from ${h.join(",")} ${ge(`-- tip: ${ue()}`)}`)}return c?{parsed:d,error:c}:{parsed:d}}function ke(e){if(j(e).length===0)return p.configDotenv(e);let t=U(e);return t?p._configVault(e):(be(`You set DOTENV_KEY but you are missing a .env.vault file at ${t}. Did you forget to build it?`),p.configDotenv(e))}function Ee(e,t){let o=Buffer.from(t.slice(-64),"hex"),a=Buffer.from(e,"base64"),n=a.subarray(0,12),i=a.subarray(-16);a=a.subarray(12,-16);try{let s=le.createDecipheriv("aes-256-gcm",o,n);return s.setAuthTag(i),`${s.update(a)}${s.final()}`}catch(s){let c=s instanceof RangeError,d=s.message==="Invalid key length",f=s.message==="Unsupported state or unable to authenticate data";if(c||d){let g=new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");throw g.code="INVALID_DOTENV_KEY",g}else if(f){let g=new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");throw g.code="DECRYPTION_FAILED",g}else throw s}}function Ce(e,t,o={}){let a=!!(o&&o.debug),n=!!(o&&o.override),i={};if(typeof t!="object"){let s=new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");throw s.code="OBJECT_REQUIRED",s}for(let s of Object.keys(t))Object.prototype.hasOwnProperty.call(e,s)?(n===!0&&(e[s]=t[s],i[s]=t[s]),a&&I(n===!0?`"${s}" is already defined and WAS overwritten`:`"${s}" is already defined and was NOT overwritten`)):(e[s]=t[s],i[s]=t[s]);return i}var p={configDotenv:we,_configVault:xe,_parseVault:he,config:ke,decrypt:Ee,parse:fe,populate:Ce};b.exports.configDotenv=p.configDotenv;b.exports._configVault=p._configVault;b.exports._parseVault=p._parseVault;b.exports.config=p.config;b.exports.decrypt=p.decrypt;b.exports.parse=p.parse;b.exports.populate=p.populate;b.exports=p});var Ye={};se(Ye,{activate:()=>Be,deactivate:()=>Te});module.exports=ie(Ye);var K=require("https"),B=require("crypto"),r=T(require("vscode"));var l=T(require("vscode")),P=class{constructor(t){this.context=t}views=[];accessToken;setAccessToken(t){this.accessToken=t,this.views.forEach(o=>{o.webview.html=this.getHtmlForWebview(o.webview)})}getClientId(){let t=process.env.SPOTIFY_CLIENT_ID;if(t)return t;let o=l.workspace.getConfiguration("codebeats").get("spotifyClientId");return o||l.workspace.getConfiguration("music-player").get("spotifyClientId")}sendPlaybackInfo(t){this.views.forEach(o=>{o.webview.postMessage({type:"playbackInfo",data:t})})}getHtmlForWebview(t){return this.getHtml(t)}resolveWebviewView(t){console.log("resolveWebviewView called for:",t.title),this.views.includes(t)||this.views.push(t),t.webview.options={enableScripts:!0,localResourceRoots:[this.context.extensionUri]},t.webview.html=this.getHtmlForWebview(t.webview),t.onDidDispose(()=>{let o=this.views.indexOf(t);o>-1&&this.views.splice(o,1)}),t.webview.onDidReceiveMessage(async o=>{if(!(!o||!o.type))switch(o.type){case"selectDevice":l.commands.executeCommand("music-player.selectDevice");break;case"togglePlayPause":l.commands.executeCommand("music-player.togglePlayPause");break;case"play":l.commands.executeCommand("music-player.play");break;case"pause":l.commands.executeCommand("music-player.pause");break;case"next":l.commands.executeCommand("music-player.next");break;case"previous":l.commands.executeCommand("music-player.previous");break;case"login":l.commands.executeCommand("music-player.login");break;case"logout":l.commands.executeCommand("music-player.logout");break;case"openSpotifyDashboard":l.env.openExternal(l.Uri.parse("https://developer.spotify.com/dashboard/create"));break;case"openSettings":l.commands.executeCommand("workbench.action.openSettings","codebeats.spotifyClientId");break;case"getCurrentPlayback":let a=await l.commands.executeCommand("music-player.getCurrentPlayback");this.sendPlaybackInfo(a);break;case"setVolume":l.commands.executeCommand("music-player.setVolume",o.volume);break;case"toggleShuffle":l.commands.executeCommand("music-player.toggleShuffle");break;case"cycleRepeat":l.commands.executeCommand("music-player.cycleRepeat");break;case"toggleLike":l.commands.executeCommand("music-player.toggleLike");break}}),console.log("Webview resolution complete")}getHtml(t){let o=re(),a=!!this.accessToken,n=!!this.getClientId();return`<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${t.cspSource} 'nonce-${o}'; img-src https: data:; script-src 'nonce-${o}';">
			<style nonce="${o}">
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
					display: ${a?"block":"none"};
					margin-top: 16px;
					padding-top: 16px;
					border-top: 1px solid var(--vscode-widget-border);
					text-align: center;
				}
				
				/* Compact Controls */
				.controls-section {
					display: ${a?"block":"none"};
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
						${a?`
					<button id="view-toggle" class="view-toggle-btn" title="Toggle Compact View">
						<svg class="icon-expand" viewBox="0 0 24 24" fill="currentColor">
							<path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
						</svg>
						<svg class="icon-collapse hidden" viewBox="0 0 24 24" fill="currentColor">
							<path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
						</svg>
					</button>
						`:""}
						<div class="status-pill ${a?"connected":""}">
							<span class="status-dot"></span>
							${a?"LIVE":"OFFLINE"}
						</div>
					</div>
			</div>

			${a?`
					<div class="now-playing-card" id="now-playing-card">
						<div id="now-playing">
					<div class="no-playback">
								<div class="no-playback-icon">\u{1F3A7}</div>
								<div class="no-playback-text">Waiting for playback...</div>
					</div>
				</div>
					</div>
				`:n?`
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
				`:`
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

			<script nonce="${o}">
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
				const authenticated = ${a};
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
		</html>`}};function re(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";return Array.from({length:16},()=>e.charAt(Math.floor(Math.random()*e.length))).join("")}var G=T(H()),Q=T(require("path")),z=4567,X=`https://127.0.0.1:${z}/callback`,A="music-player.spotify.tokens",Ie="user-read-playback-state user-modify-playback-state user-library-read user-library-modify",k=!1,u,m;async function Be(e){let t=Q.join(e.extensionPath,".env");G.config({path:t}),process.env.NODE_TLS_REJECT_UNAUTHORIZED="0",u=new P(e);let o=r.window.registerWebviewViewProvider("music-player.sidebar",u,{webviewOptions:{retainContextWhenHidden:!0}});console.log("Activity bar webview provider registered:",o);let a=r.window.registerWebviewViewProvider("music-player.sidebar-explorer",u,{webviewOptions:{retainContextWhenHidden:!0}});console.log("Explorer webview provider registered:",a);let n=[o,a,r.commands.registerCommand("music-player.selectDevice",async()=>{console.log("Select device command triggered");let s=await Re(e);if(!s||s.length===0){r.window.showInformationMessage("No Spotify devices found. Open Spotify on a device and try again.");return}let c=await r.window.showQuickPick(s.map(d=>({label:d.name+(d.is_active?" \u2014 active":""),description:d.id,id:d.id})),{placeHolder:"Choose a device to transfer playback to"});c?.id&&await Fe(e,c.id,!0)}),r.commands.registerCommand("music-player.login",()=>Pe(e)),r.commands.registerCommand("music-player.logout",()=>De(e)),r.commands.registerCommand("music-player.togglePlayPause",()=>Ae(e)),r.commands.registerCommand("music-player.play",()=>q(e)),r.commands.registerCommand("music-player.pause",()=>Y(e)),r.commands.registerCommand("music-player.next",()=>Me(e)),r.commands.registerCommand("music-player.previous",()=>Ve(e)),r.commands.registerCommand("music-player.getCurrentPlayback",()=>v(e)),r.commands.registerCommand("music-player.setVolume",s=>Ne(e,s)),r.commands.registerCommand("music-player.toggleShuffle",()=>ze(e)),r.commands.registerCommand("music-player.cycleRepeat",()=>Le(e)),r.commands.registerCommand("music-player.toggleLike",()=>Oe(e))];m=r.window.createStatusBarItem(r.StatusBarAlignment.Right,100),m.command="music-player.statusBarClick",m.text="$(music) CodeBeats",m.tooltip="Click to play/pause",m.show(),e.subscriptions.push(m);let i=r.commands.registerCommand("music-player.statusBarClick",async()=>{(await v(e))?.isPlaying?await Y(e):await q(e)});e.subscriptions.push(...n,i),J(e).then(s=>{s&&(u?.setAccessToken(s.accessToken),Se(e))})}function Se(e){(async()=>{let o=await v(e);if(m)if(o&&o.track&&!o.noDevice){let a=o.isPlaying?"$(play)":"$(debug-pause)",n=`${o.track} - ${o.artist}`;m.text=`${a} ${n}`,m.tooltip=`${n}
Click to ${o.isPlaying?"pause":"play"}`}else m.text="$(music) CodeBeats",m.tooltip="No active playback"})()}function Te(){}function Z(){let e=process.env.SPOTIFY_CLIENT_ID;if(e)return e;let t=r.workspace.getConfiguration("codebeats").get("spotifyClientId");return t||r.workspace.getConfiguration("music-player").get("spotifyClientId")}async function Pe(e){let t=Z();if(!t){r.window.showInformationMessage("Welcome to CodeBeats! \u{1F3B5} Open the sidebar to connect your Spotify account.");return}let{verifier:o,challenge:a}=qe(),n=(0,B.randomBytes)(16).toString("hex"),i=new URL("https://accounts.spotify.com/authorize");i.searchParams.set("response_type","code"),i.searchParams.set("client_id",t),i.searchParams.set("redirect_uri",X),i.searchParams.set("scope",Ie.split(" ").join("+")),i.searchParams.set("code_challenge_method","S256"),i.searchParams.set("code_challenge",a),i.searchParams.set("state",n);let s=(0,K.createServer)(He(),async(c,d)=>{let f=new URL(c.url??"",`https://127.0.0.1:${z}`);if(f.pathname!=="/callback"){d.writeHead(404).end();return}let g=f.searchParams.get("state"),h=f.searchParams.get("code");if(f.searchParams.get("error")||!h||g!==n){d.writeHead(400,{"Content-Type":"text/plain"}).end("Authentication failed. Please try again."),s.close(),r.window.showErrorMessage("Spotify authentication failed. Please try again.");return}d.writeHead(200,{"Content-Type":"text/plain"}).end("Authentication successful! You can close this tab."),s.close();let w=await je({code:h,verifier:o,clientId:t});if(!w){r.window.showErrorMessage("Failed to obtain access token from Spotify. Please try again.");return}await e.secrets.store(A,JSON.stringify(w)),u?.setAccessToken(w.accessToken),r.window.showInformationMessage("Successfully authenticated with Spotify!")});s.listen(z,()=>{r.env.openExternal(r.Uri.parse(i.toString()))})}async function De(e){await r.window.showWarningMessage("Are you sure you want to sign out of Spotify? You will need to re-authenticate.","Sign Out","Cancel")==="Sign Out"&&(await e.secrets.delete(A),u?.setAccessToken(void 0),m&&m.hide(),r.window.showInformationMessage('Successfully signed out of Spotify. Click "Connect Spotify" to sign in again.'))}async function y(e,t,o){let a=await E(e);if(!a){r.window.showErrorMessage("Not authenticated with Spotify. Please log in.");return}let n=await fetch(t,{...o,headers:{Authorization:`Bearer ${a.accessToken}`,"Content-Type":"application/json",...o.headers||{}}});if(!n.ok){let i=await x(n);if(k&&console.error(`API Error - Endpoint: ${t} - Status: ${n.status} ${n.statusText} - Body: ${i??"No response body"}`),n.status===403)await r.window.showErrorMessage(`Spotify API access denied (403). Endpoint: ${t}. Your account must be added to the app allowlist in Developer Dashboard.`,"Open Dashboard")==="Open Dashboard"&&r.env.openExternal(r.Uri.parse("https://developer.spotify.com/dashboard"));else if(n.status===404&&i?.includes("NO_ACTIVE_DEVICE")){let s=await r.window.showInformationMessage("No active Spotify device found. Please open Spotify on your computer, phone, or web player.","Select Device","Open Spotify Web");s==="Select Device"?r.commands.executeCommand("music-player.selectDevice"):s==="Open Spotify Web"&&r.env.openExternal(r.Uri.parse("https://open.spotify.com"))}else r.window.showErrorMessage(`Spotify API request failed: ${n.status} ${n.statusText} - Endpoint: ${t} - ${i??"No response body"}`);return}return n}async function Ae(e){let t=await v(e);if(!t||t.noDevice){r.window.showInformationMessage("No active Spotify device found. Please open Spotify.");return}t.isPlaying?await y(e,"https://api.spotify.com/v1/me/player/pause",{method:"PUT"}):await y(e,"https://api.spotify.com/v1/me/player/play",{method:"PUT"});let o=await v(e);u?.sendPlaybackInfo(o)}async function q(e){await y(e,"https://api.spotify.com/v1/me/player/play",{method:"PUT"});let t=await v(e);u?.sendPlaybackInfo(t)}async function Y(e){await y(e,"https://api.spotify.com/v1/me/player/pause",{method:"PUT"});let t=await v(e);u?.sendPlaybackInfo(t)}async function Me(e){await y(e,"https://api.spotify.com/v1/me/player/next",{method:"POST"});let t=await v(e);u?.sendPlaybackInfo(t)}async function Ve(e){await y(e,"https://api.spotify.com/v1/me/player/previous",{method:"POST"});let t=await v(e);u?.sendPlaybackInfo(t)}async function v(e){let t=await E(e);if(!t)return;let o="https://api.spotify.com/v1/me/player",a=await fetch(o,{headers:{Authorization:`Bearer ${t.accessToken}`}});if(!a.ok){if(a.status===204)return{isPlaying:!1,noDevice:!0};let d=await x(a);k&&console.error(`API Error - Endpoint: ${o} - Status: ${a.status} ${a.statusText} - Body: ${d??"No response body"}`);return}let n=await a.json(),i=await _e(e),s=n.item?.id,c=s?await $e(e,s):!1;return{isPlaying:n.is_playing,track:n.item?.name,trackId:s,artist:n.item?.artists?.map(d=>d.name).join(", "),album:n.item?.album?.name,albumArt:n.item?.album?.images?.[0]?.url,progressMs:n.progress_ms,durationMs:n.item?.duration_ms,volume:n.device?.volume_percent,shuffleState:n.shuffle_state,repeatState:n.repeat_state,isLiked:c,nextTrack:i?.nextTrack,nextArtist:i?.nextArtist,deviceName:n.device?.name,deviceType:n.device?.type}}async function Ne(e,t){let o=Math.max(0,Math.min(100,Math.round(t)));await y(e,`https://api.spotify.com/v1/me/player/volume?volume_percent=${o}`,{method:"PUT"});let a=await v(e);u?.sendPlaybackInfo(a)}async function ze(e){let o=!(await v(e))?.shuffleState;await y(e,`https://api.spotify.com/v1/me/player/shuffle?state=${o}`,{method:"PUT"});let a=await v(e);u?.sendPlaybackInfo(a)}async function Le(e){let o=(await v(e))?.repeatState||"off",a="off";o==="off"?a="context":o==="context"&&(a="track"),await y(e,`https://api.spotify.com/v1/me/player/repeat?state=${a}`,{method:"PUT"});let n=await v(e);u?.sendPlaybackInfo(n)}async function $e(e,t){let o=await E(e);if(!o)return!1;let a=`https://api.spotify.com/v1/me/tracks/contains?ids=${t}`,n=await fetch(a,{headers:{Authorization:`Bearer ${o.accessToken}`}});if(!n.ok){let s=await x(n);return console.error(`\u{1F6A8} API Error - Endpoint: ${a} - Status: ${n.status} ${n.statusText} - Body: ${s??"No response body"}`),!1}return(await n.json())[0]===!0}async function Oe(e){let t=await v(e),o=t?.trackId;if(!o){r.window.showWarningMessage("No track currently playing");return}let a=t?.isLiked,n=await E(e);if(!n){r.window.showErrorMessage("Not authenticated with Spotify. Please log in.");return}let i=a?"DELETE":"PUT",s=`https://api.spotify.com/v1/me/tracks?ids=${o}`,c=await fetch(s,{method:i,headers:{Authorization:`Bearer ${n.accessToken}`,"Content-Type":"application/json"}});if(c.ok){let d=a?"Removed from Liked Songs":"Added to Liked Songs";r.window.showInformationMessage(d);let f=await v(e);u?.sendPlaybackInfo(f)}else{let d=await x(c);k&&console.error(`API Error - Endpoint: ${s} - Status: ${c.status} ${c.statusText} - Body: ${d??"No response body"}`),r.window.showErrorMessage("Failed to update liked status")}}async function _e(e){let t=await E(e);if(!t)return;let o="https://api.spotify.com/v1/me/player/queue",a=await fetch(o,{headers:{Authorization:`Bearer ${t.accessToken}`}});if(!a.ok){let s=await x(a);k&&console.error(`API Error - Endpoint: ${o} - Status: ${a.status} ${a.statusText} - Body: ${s??"No response body"}`);return}let i=(await a.json()).queue?.[0];if(i)return{nextTrack:i.name,nextArtist:i.artists?.map(s=>s.name).join(", ")}}async function Re(e){let t=await E(e);if(!t)return r.window.showErrorMessage("Not authenticated with Spotify. Please log in."),[];let o="https://api.spotify.com/v1/me/player/devices",a=await fetch(o,{headers:{Authorization:`Bearer ${t.accessToken}`}});if(!a.ok){let i=await x(a);if(k&&console.error(`API Error - Endpoint: ${o} - Status: ${a.status} ${a.statusText} - Body: ${i??"No response body"}`),a.status===403){let s=await r.window.showErrorMessage(`Spotify API access denied (403 Forbidden). Endpoint: ${o}. Your account may not be on the app allowlist.`,"Open Dashboard","Learn More");s==="Open Dashboard"?r.env.openExternal(r.Uri.parse("https://developer.spotify.com/dashboard")):s==="Learn More"&&r.env.openExternal(r.Uri.parse("https://developer.spotify.com/documentation/web-api/concepts/quota-modes"))}else r.window.showErrorMessage(`Failed to fetch devices: ${a.status} ${a.statusText} - Endpoint: ${o} - ${i??""}`);return[]}return((await a.json()).devices||[]).map(i=>({id:i.id,name:i.name,is_active:i.is_active}))}async function Fe(e,t,o=!0){let a=await E(e);if(!a){r.window.showErrorMessage("Not authenticated with Spotify. Please log in.");return}let n="https://api.spotify.com/v1/me/player",i=await fetch(n,{method:"PUT",headers:{Authorization:`Bearer ${a.accessToken}`,"Content-Type":"application/json"},body:JSON.stringify({device_ids:[t],play:o})});if(!i.ok){let s=await x(i);k&&console.error(`API Error - Endpoint: ${n} (PUT) - Status: ${i.status} ${i.statusText} - Body: ${s??"No response body"}`),r.window.showErrorMessage(`Failed to transfer playback: ${i.status} ${i.statusText} - Endpoint: ${n} - ${s??""}`);return}r.window.showInformationMessage("Playback transferred to selected device.")}async function E(e){let t=Z();if(!t)return;let o=await J(e);if(!o)return;if(o.expiresAt>Date.now()+6e4)return o;let a=await Ue(o.refreshToken,t);if(!a)return;let n={accessToken:a.access_token,refreshToken:a.refresh_token??o.refreshToken,expiresAt:Date.now()+a.expires_in*1e3};return await e.secrets.store(A,JSON.stringify(n)),u?.setAccessToken(n.accessToken),n}async function je(e){let t="https://accounts.spotify.com/api/token",o=await fetch(t,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({grant_type:"authorization_code",code:e.code,redirect_uri:X,client_id:e.clientId,code_verifier:e.verifier})});if(!o.ok){let n=await x(o);k&&console.error(`API Error - Endpoint: ${t} (exchangeCodeForToken) - Status: ${o.status} ${o.statusText} - Body: ${n??"No response body"}`);return}let a=await o.json();return{accessToken:a.access_token,refreshToken:a.refresh_token??"",expiresAt:Date.now()+a.expires_in*1e3}}async function Ue(e,t){let o="https://accounts.spotify.com/api/token",a=await fetch(o,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({grant_type:"refresh_token",refresh_token:e,client_id:t})});if(!a.ok){let n=await x(a);k&&console.error(`API Error - Endpoint: ${o} (refreshToken) - Status: ${a.status} ${a.statusText} - Body: ${n??"No response body"}`);return}return await a.json()}function He(){return{key:`-----BEGIN PRIVATE KEY-----
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
-----END PRIVATE KEY-----`,cert:`-----BEGIN CERTIFICATE-----
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
-----END CERTIFICATE-----`}}function qe(){let e=W((0,B.randomBytes)(32)),t=W((0,B.createHash)("sha256").update(e).digest());return{verifier:e,challenge:t}}function W(e){return e.toString("base64").replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}async function J(e){let t=await e.secrets.get(A);if(t)try{return JSON.parse(t)}catch(o){console.error("Failed to parse token set from secrets:",o);return}}async function x(e){try{return await e.text()}catch(t){console.error("Failed to read response body",t);return}}0&&(module.exports={activate,deactivate});
