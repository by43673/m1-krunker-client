"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var settingsui_exports = {};
__export(settingsui_exports, {
  renderSettings: () => renderSettings
});
module.exports = __toCommonJS(settingsui_exports);
var import_fs = require("fs");
var import_electron = require("electron");
var import_utils = require("./utils");
var import_preload = require("./preload");
var import_userscripts = require("./userscripts");
var import_matchmaker = require("./matchmaker");
var _wrapper, _disabled;
var RefreshEnum = /* @__PURE__ */ ((RefreshEnum2) => {
  RefreshEnum2[RefreshEnum2["notNeeded"] = 0] = "notNeeded";
  RefreshEnum2[RefreshEnum2["refresh"] = 1] = "refresh";
  RefreshEnum2[RefreshEnum2["reloadApp"] = 2] = "reloadApp";
  return RefreshEnum2;
})(RefreshEnum || {});
let userPrefs;
let userPrefsPath;
let userPrefsCache;
let refreshNeeded = 0 /* notNeeded */;
let refreshNotifElement;
document.addEventListener("DOMContentLoaded", () => {
  import_electron.ipcRenderer.send("settingsUI_requests_userPrefs");
});
import_electron.ipcRenderer.on("m_userPrefs_for_settingsUI", (event, recieved_userPrefsPath, recieved_userPrefs) => {
  userPrefsPath = recieved_userPrefsPath;
  userPrefs = recieved_userPrefs;
  userPrefsCache = { ...recieved_userPrefs };
});
function transformMarrySettings(data, desc, callback) {
  const renderReadySettings = Object.keys(desc).map((key) => ({ key, ...desc[key] })).map((obj) => ({ callback, value: data[obj.key], ...obj }));
  return renderReadySettings;
}
const settingsDesc = {
  fpsUncap: { title: "Un-cap FPS", type: "bool", desc: "", safety: 0, cat: 0 },
  "angle-backend": { title: "ANGLE Backend", type: "sel", safety: 0, opts: ["default", "gl", "d3d11", "d3d9", "d3d11on12", "vulkan"], cat: 0 },
  fullscreen: { title: "Start in Windowed/Fullscreen mode", type: "sel", desc: "Use 'borderless' if you have client-capped fps and unstable fps in fullscreen", safety: 0, cat: 0, opts: ["windowed", "maximized", "fullscreen", "borderless"] },
  inProcessGPU: { title: "In-Process GPU (video capture)", type: "bool", desc: "Enables video capture & embeds the GPU under the same process", safety: 1, cat: 0 },
  resourceSwapper: { title: "Resource swapper", type: "bool", desc: "Enable Krunker Resource Swapper. Reads Documents/Crankshaft/swapper", safety: 0, cat: 0 },
  discordRPC: { title: "Discord Rich Presence", type: "bool", desc: "Enable Discord Rich Presence. Shows Gamemode, Map, Class and Skin", safety: 0, cat: 0 },
  extendedRPC: { title: "Extended Discord RPC", type: "bool", desc: "Adds Github + Discord buttons to RPC. No effect if RPC is off.", safety: 0, cat: 0, instant: true },
  hideAds: { title: "Hide/Block Ads", type: "sel", desc: "With 'hide' you can still claim free KR. Using 'block' also blocks trackers.", safety: 0, cat: 0, refreshOnly: true, opts: ["block", "hide", "off"] },
  customFilters: { title: "Custom Filters", type: "bool", desc: "Enable custom network filters. Reads Documents/Crankshaft/filters.txt", safety: 0, cat: 0, refreshOnly: true },
  userscripts: { title: "Userscript support", type: "bool", desc: "Enable userscript support. place .js files in Documents/Crankshaft/scripts", safety: 1, cat: 0 },
  menuTimer: { title: "Menu Timer", type: "bool", safety: 0, cat: 1, instant: true },
  hideReCaptcha: { title: "Hide reCaptcha", type: "bool", safety: 0, cat: 1, instant: true },
  quickClassPicker: { title: "Quick Class Picker", type: "bool", safety: 0, cat: 1, instant: true },
  clientSplash: { title: "Client Splash Screen", type: "bool", safety: 0, cat: 1, refreshOnly: true },
  regionTimezones: { title: "Region Picker Timezones", type: "bool", desc: "Adds local time to all region pickers", safety: 0, cat: 1, refreshOnly: true },
  matchmaker: { title: "Custom Matchmaker", type: "bool", desc: "Configurable matchmaker. Default hotkey F1", safety: 0, cat: 2, refreshOnly: true },
  matchmaker_F6: { title: "F6 hotkey", type: "bool", desc: "Replace default 'New Lobby' F6 hotkey with Matchmaker ", safety: 0, cat: 2 },
  matchmaker_regions: { title: "Whitelisted regions", type: "multisel", desc: "", safety: 0, cat: 2, opts: import_matchmaker.MATCHMAKER_REGIONS, cols: 16, instant: true },
  matchmaker_gamemodes: { title: "Whitelisted gamemodes", type: "multisel", desc: "", safety: 0, cat: 2, opts: import_matchmaker.MATCHMAKER_GAMEMODES, cols: 4, instant: true },
  matchmaker_minRemainingTime: { title: "Minimum remaining seconds", type: "num", min: 0, max: 3600, safety: 0, cat: 2, instant: true },
  matchmaker_minPlayers: { title: "Minimum players in Lobby", type: "num", min: 0, max: 7, safety: 0, cat: 2, instant: true },
  matchmaker_maxPlayers: { title: "Maximum players in Lobby", type: "num", min: 0, max: 7, safety: 0, cat: 2, instant: true, desc: "if you set the criteria too strictly, matchmaker won't find anything" },
  logDebugToConsole: { title: "Log debug & GPU info to electron console", type: "bool", safety: 0, cat: 3 },
  alwaysWaitForDevTools: { title: "Always wait for DevTools", desc: "Crankshaft uses an alt. method to open Devtools in a new window if they take too long. This disables that. Might cause DevTools to not work", type: "bool", safety: 3, cat: 3 },
  safeFlags_removeUselessFeatures: { title: "Remove useless features", type: "bool", desc: "Adds a lot of flags that disable useless features.", safety: 1, cat: 3 },
  safeFlags_gpuRasterizing: { title: "GPU rasterization", type: "bool", desc: "Enable GPU rasterization and disable Zero-copy rasterizer so rasterizing is stable", safety: 2, cat: 3 },
  safeFlags_helpfulFlags: { title: "(Potentially) useful flags", type: "bool", desc: "Enables javascript-harmony, future-v8-vm-features, webgl2-compute-context.", safety: 3, cat: 3 },
  disableAccelerated2D: { title: "Disable Accelerated 2D canvas", type: "bool", desc: "", safety: 3, cat: 3 },
  experimentalFlags_increaseLimits: { title: "Increase limits flags", type: "bool", desc: "Sets renderer-process-limit, max-active-webgl-contexts and webrtc-max-cpu-consumption-percentage to 100, adds ignore-gpu-blacklist", safety: 4, cat: 3 },
  experimentalFlags_lowLatency: { title: "Lower Latency flags", type: "bool", desc: "Adds following flags: enable-highres-timer, enable-quic (experimental low-latency protocol) and enable-accelerated-2d-canvas", safety: 4, cat: 3 },
  experimentalFlags_experimental: { title: "Experimental flags", type: "bool", desc: "Adds following flags: disable-low-end-device-mode, high-dpi-support, ignore-gpu-blacklist, no-pings and no-proxy-server", safety: 4, cat: 3 }
};
const safetyDesc = [
  "This setting is safe/standard",
  "Proceed with caution",
  "This setting is not recommended",
  "This setting is experimental",
  "This setting is experimental and unstable. Use at your own risk."
];
const categoryNames = [
  { name: "Client Settings", cat: "mainSettings" },
  { name: "Visual Settings", cat: "styleSettings" },
  { name: "Matchmaker", cat: "matchmakerSettings" },
  { name: "Advanced Settings", cat: "advSettings" }
];
const refreshToUnloadMessage = "REFRESH PAGE TO UNLOAD USERSCRIPT";
function saveSettings() {
  (0, import_fs.writeFileSync)(userPrefsPath, JSON.stringify(userPrefs, null, 2), { encoding: "utf-8" });
  import_electron.ipcRenderer.send("settingsUI_updates_userPrefs", userPrefs);
}
function recalculateRefreshNeeded() {
  refreshNeeded = 0 /* notNeeded */;
  for (let i = 0; i < Object.keys(userPrefs).length; i++) {
    const cache = (item) => Array.isArray(item) ? [...item] : item;
    const key = Object.keys(userPrefs)[i];
    const descObj = settingsDesc[key];
    const setting = cache(userPrefs[key]);
    const cachedSetting = cache(userPrefsCache[key]);
    const settingsEqual = Array.isArray(setting) && Array.isArray(cachedSetting) ? (0, import_utils.haveSameContents)(setting, cachedSetting) : setting === cachedSetting;
    if (!settingsEqual) {
      if (descObj?.instant) {
        continue;
      } else if (descObj?.refreshOnly) {
        if (refreshNeeded < 1 /* refresh */)
          refreshNeeded = 1 /* refresh */;
      } else {
        refreshNeeded = 2 /* reloadApp */;
      }
    }
  }
}
function saveUserscriptTracker() {
  (0, import_fs.writeFileSync)(import_userscripts.su.userscriptTrackerPath, JSON.stringify(import_userscripts.su.userscriptTracker, null, 2), { encoding: "utf-8" });
}
class SettingElem {
  constructor(props) {
    __privateAdd(this, _wrapper, void 0);
    __privateAdd(this, _disabled, void 0);
    this.props = props;
    this.type = props.type;
    this.HTML = "";
    this.updateMethod = "";
    this.updateKey = "";
    __privateSet(this, _wrapper, false);
    __privateSet(this, _disabled, false);
    if (this.props.safety > 0)
      this.HTML += skeleton.safetyIcon(safetyDesc[this.props.safety]);
    else if (this.props.instant || this.props.refreshOnly)
      this.HTML += skeleton.refreshIcon(this.props.instant ? "instant" : "refresh-icon");
    if (this.props.key === "matchmaker_regions" && userPrefs.regionTimezones) {
      this.props.cols = 8;
      this.props.optDescriptions = import_matchmaker.MATCHMAKER_REGIONS.map((regionCode) => (0, import_preload.getTimezoneByRegionKey)("code", regionCode));
    }
    if ("userscriptReference" in props) {
      const userscript = props.userscriptReference;
      if (userscript.hasRan && !props.instant && props.type === "bool" && props.value === false) {
        __privateSet(this, _disabled, true);
        this.props.desc = refreshToUnloadMessage;
      }
    }
    switch (props.type) {
      case "bool":
        this.HTML += `<span class="setting-title">${props.title}</span> 
					<label class="switch">
							<input class="s-update" type="checkbox" ${props.value ? "checked" : ""} ${__privateGet(this, _disabled) ? "disabled" : ""}/>
							<div class="slider round"></div>
					</label>`;
        this.updateKey = "checked";
        this.updateMethod = "onchange";
        break;
      case "text":
        this.HTML += `<span class="setting-title">${props.title}</span>
					<span class="setting-input-wrapper">
							<input type="text" class="rb-input s-update inputGrey2" name="${props.key}" autocomplete="off" value="${props.value}"/>
					</span>`;
        this.updateKey = "value";
        this.updateMethod = "oninput";
        break;
      case "num":
        this.HTML += `<span class="setting-title">${props.title}</span>
				<span class="setting-input-wrapper">
					<input type="number" class="rb-input s-update sliderVal" name="${props.key}" 
						autocomplete="off" value="${props.value}" 
						min="${props.min}" max="${props.max}" step="${props?.step ?? 1}"
					/>
				</span>`;
        this.updateKey = "valueAsNumber";
        this.updateMethod = "onchange";
        break;
      case "heading":
        this.HTML = `<h1 class="setting-title">${props.title}</h1>`;
        break;
      case "sel":
        this.HTML += `<span class="setting-title">${props.title}</span>
          <select class="s-update inputGrey2">
						${props.opts.map((opt) => `<option value ="${opt}">${opt}</option>`).join("")}
					</select>`;
        this.updateKey = "value";
        this.updateMethod = "onchange";
        break;
      case "multisel": {
        const hasValidDescriptions = (0, import_utils.hasOwn)(this.props, "optDescriptions") && this.props.opts.length === this.props.optDescriptions.length;
        if ((0, import_utils.hasOwn)(this.props, "optDescriptions") && !hasValidDescriptions)
          throw new Error(`Setting '${this.props.key}' declared 'optDescriptions', but a different amount than 'opts'!`);
        this.HTML += `<span class="setting-title">${props.title}</span>
					<div class="crankshaft-multisel-parent s-update" ${props?.cols ? `style="grid-template-columns:repeat(${props.cols}, 1fr)"` : ""}>
						${props.opts.map((opt, i) => `<label class="hostOpt">
							<span class="optName">${opt}</span>
							${hasValidDescriptions ? `<span class="optDescription">${this.props.optDescriptions[i]}</span>` : ""}
							<input type="checkbox" name="${opt}" ${props.value.includes(opt) ? "checked" : ""} />
							<div class="optCheck"></div>
						</label>`).join("")}
					</div>`;
        this.updateKey = "value";
        this.updateMethod = "onchange";
        break;
      }
      default:
        this.HTML = `<span class="setting-title">${props.title}</span><span>Unknown setting type</span>`;
    }
    if (Boolean(props.desc) && props.desc !== "")
      this.HTML += `<div class="setting-desc-new">${props.desc}</div>`;
  }
  /**
   * update the settings when you change something in the gui
   * @param {{elem: HTMLElement, callback: 'normal'|Function}} elemAndCb
   */
  update({ elem, callback }) {
    if (this.updateKey === "")
      throw "Invalid update key";
    const target = elem.querySelector(".s-update");
    let dirtyValue = target[this.updateKey];
    if (this.props.type === "multisel") {
      dirtyValue = [...target.children].filter((child) => child.querySelector("input:checked")).map((child) => child.querySelector(".optName").textContent);
    }
    if (typeof dirtyValue === "number") {
      const updateUI = () => {
        target.value = dirtyValue.toString();
      };
      if (Number.isNaN(dirtyValue)) {
        target.value = userPrefs[this.props.key].toString();
        return;
      }
      if ((0, import_utils.hasOwn)(this.props, "min") && dirtyValue < this.props.min) {
        dirtyValue = this.props.min;
        updateUI();
      }
      if ((0, import_utils.hasOwn)(this.props, "max") && dirtyValue > this.props.max) {
        dirtyValue = this.props.max;
        updateUI();
      }
    }
    const value = dirtyValue;
    if (callback === "normal") {
      import_electron.ipcRenderer.send("logMainConsole", `recieved an update for ${this.props.key}: ${value}`);
      userPrefs[this.props.key] = value;
      saveSettings();
      if (this.props.key === "hideAds") {
        const adsHidden = value === "hide" || value === "block";
        (0, import_utils.toggleSettingCSS)(import_preload.styleSettingsCSS.hideAds, this.props.key, adsHidden);
        (0, import_utils.classListSet)(document.getElementById("hiddenClasses"), adsHidden, "hiddenClasses-hideAds-bottomOffset");
      }
      if (typeof value === "boolean") {
        if (this.props.key === "menuTimer")
          (0, import_utils.toggleSettingCSS)(import_preload.styleSettingsCSS.menuTimer, this.props.key, value);
        if (this.props.key === "quickClassPicker")
          (0, import_utils.toggleSettingCSS)(import_preload.styleSettingsCSS.quickClassPicker, this.props.key, value);
        if (this.props.key === "hideReCaptcha")
          (0, import_utils.toggleSettingCSS)(import_preload.styleSettingsCSS.hideReCaptcha, this.props.key, value);
      }
    } else if (callback === "userscript") {
      if (typeof value !== "boolean")
        throw `Callback cannot be "userscript" for non-boolean values, like: ${value.toString()}`;
      let refreshSettings = false;
      if ("userscriptReference" in this.props) {
        const userscript = this.props.userscriptReference;
        if (value && (!userscript.hasRan || this.props.instant)) {
          userscript.load();
          if (!userscript.hasRan)
            refreshSettings = true;
          userscript.hasRan = true;
        } else if (!value) {
          if (this.props.instant && typeof userscript.unload === "function") {
            userscript.unload();
          } else {
            elem.querySelector(".setting-desc-new").textContent = refreshToUnloadMessage;
            target.setAttribute("disabled", "");
            __privateSet(this, _disabled, true);
          }
        }
        import_electron.ipcRenderer.send("logMainConsole", `userscript: recieved an update for ${userscript.name}: ${value}`);
        import_userscripts.su.userscriptTracker[userscript.name] = value;
      } else {
        import_electron.ipcRenderer.send("logMainConsole", `userscript: recieved an update for ${this.props.title}: ${value}`);
        import_userscripts.su.userscriptTracker[this.props.title] = value;
      }
      saveUserscriptTracker();
      if (refreshSettings)
        setTimeout(renderSettings, 400);
    } else {
      callback(value);
    }
    recalculateRefreshNeeded();
    try {
      refreshNotifElement.remove();
    } catch (e) {
    }
    if (refreshNeeded > 0) {
      refreshNotifElement = (0, import_utils.createElement)("div", {
        class: ["crankshaft-holder-update", "refresh-popup"],
        innerHTML: skeleton.refreshElem(refreshNeeded)
      });
      document.body.appendChild(refreshNotifElement);
    }
  }
  /** this initializes the element and its eventlisteners.*/
  get elem() {
    if (__privateGet(this, _wrapper) !== false)
      return __privateGet(this, _wrapper);
    const wrapper = (0, import_utils.createElement)("div", {
      class: ["setting", "settName", `safety-${this.props.safety}`, this.props.type],
      id: `settingElem-${this.props.key}`,
      innerHTML: this.HTML
    });
    if (this.type === "sel")
      wrapper.querySelector("select").value = this.props.value;
    if (typeof this.props.callback === "undefined")
      this.props.callback = "normal";
    wrapper[this.updateMethod] = () => {
      this.update({ elem: wrapper, callback: this.props.callback });
    };
    __privateSet(this, _wrapper, wrapper);
    return wrapper;
  }
}
_wrapper = new WeakMap();
_disabled = new WeakMap();
const skeleton = {
  /** make a setting cateogry */
  category: (title, innerHTML, elemClass = "mainSettings") => `
	<div class="setHed Crankshaft-setHed"><span class="material-icons plusOrMinus">keyboard_arrow_down</span> ${title}</div>
	<div class="setBodH Crankshaft-setBodH ${elemClass}">
			${innerHTML}
	</div>`,
  /** 
   * make a setting with some text (notice) 
   * @param desc description of the notice 
   * @param opts desc => description, iconHTML => icon's html, generate through skeleton's *icon methods
   */
  notice: (notice, opts) => `
	<div class="settName setting">
		${opts?.iconHTML ?? false ? opts.iconHTML : ""}
		<span class="setting-title crankshaft-gray">${notice}</span>
		${opts?.desc ?? false ? `<div class="setting-desc-new">${opts.desc}</div>` : ""}
	</div>`,
  /** wrapped safety warning icon (color gets applied through css) */
  safetyIcon: (safety) => `
	<span class="setting-desc desc-icon" title="${safety}">
		<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 12.5ZM3.425 20.5Q2.9 20.5 2.65 20.05Q2.4 19.6 2.65 19.15L11.2 4.35Q11.475 3.9 12 3.9Q12.525 3.9 12.8 4.35L21.35 19.15Q21.6 19.6 21.35 20.05Q21.1 20.5 20.575 20.5ZM12 10.2Q11.675 10.2 11.463 10.412Q11.25 10.625 11.25 10.95V14.45Q11.25 14.75 11.463 14.975Q11.675 15.2 12 15.2Q12.325 15.2 12.538 14.975Q12.75 14.75 12.75 14.45V10.95Q12.75 10.625 12.538 10.412Q12.325 10.2 12 10.2ZM12 17.8Q12.35 17.8 12.575 17.575Q12.8 17.35 12.8 17Q12.8 16.65 12.575 16.425Q12.35 16.2 12 16.2Q11.65 16.2 11.425 16.425Q11.2 16.65 11.2 17Q11.2 17.35 11.425 17.575Q11.65 17.8 12 17.8ZM4.45 19H19.55L12 6Z"/></svg>
	</span>`,
  /** wrapped refresh icon (color gets applied through css) */
  refreshIcon: (mode) => `
	<span class="setting-desc desc-icon ${mode}" title="${mode === "instant" ? "Applies instantly! (No refresh of page required)" : "Refresh page to see changes"}">
		<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M12 6v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.2.2-.51 0-.71l-2.79-2.79c-.31-.31-.85-.09-.85.36V4c-4.42 0-8 3.58-8 8 0 1.04.2 2.04.57 2.95.27.67 1.13.85 1.64.34.27-.27.38-.68.23-1.04C6.15 13.56 6 12.79 6 12c0-3.31 2.69-6 6-6zm5.79 2.71c-.27.27-.38.69-.23 1.04.28.7.44 1.46.44 2.25 0 3.31-2.69 6-6 6v-1.79c0-.45-.54-.67-.85-.35l-2.79 2.79c-.2.2-.2.51 0 .71l2.79 2.79c.31.31.85.09.85-.35V20c4.42 0 8-3.58 8-8 0-1.04-.2-2.04-.57-2.95-.27-.67-1.13-.85-1.64-.34z"/></svg>
	</span>`,
  /** make a settings category header element */
  catHedElem: (title) => (0, import_utils.createElement)("div", {
    class: "setHed Crankshaft-setHed".split(" "),
    innerHTML: `<span class="material-icons plusOrMinus">keyboard_arrow_down</span> ${title}`
  }),
  /** make a settings category body element */
  catBodElem: (elemClass, content) => (0, import_utils.createElement)("div", {
    class: `setBodH Crankshaft-setBodH ${elemClass}`.split(" "),
    innerHTML: content
  }),
  refreshElem: (level) => {
    switch (level) {
      case 2 /* reloadApp */:
        return '<span class="restart-msg">Restart client fully to see changes</span>';
      case 1 /* refresh */:
        return `<span class="reload-msg">${skeleton.refreshIcon("refresh-icon")}Reload page with <code>F5</code> or <code>F6</code> to see changes</span>`;
      case 0 /* notNeeded */:
      default:
        return "";
    }
  }
};
function renderSettings() {
  const settHolder = document.getElementById("settHolder");
  settHolder.textContent = "";
  settHolder.classList.add("Crankshaft-settings");
  settHolder.appendChild(skeleton.catHedElem(categoryNames[0].name));
  settHolder.appendChild(skeleton.catBodElem(categoryNames[0].cat, skeleton.notice("These settings need a client restart to work.")));
  const csSettings = new DocumentFragment();
  const settings = transformMarrySettings(userPrefs, settingsDesc, "normal");
  for (const setObj of settings) {
    const setElem = new SettingElem(setObj);
    const settElemMade = setElem.elem;
    if ("cat" in setObj) {
      const cat = categoryNames[setObj.cat];
      if (csSettings.querySelector(`.${cat.cat}`) === null) {
        csSettings.appendChild(skeleton.catHedElem(cat.name));
        csSettings.appendChild(skeleton.catBodElem(cat.cat, "note" in cat ? skeleton.notice(cat.note) : ""));
      }
      csSettings.querySelector(`.${cat.cat}`).appendChild(settElemMade);
    } else {
      csSettings.querySelector(".setBodH.mainSettings").appendChild(settElemMade);
    }
  }
  if (userPrefs.userscripts) {
    csSettings.appendChild(skeleton.catHedElem("Userscripts"));
    if (import_userscripts.su.userscripts.length > 0) {
      csSettings.appendChild(skeleton.catBodElem("userscripts", skeleton.notice("NOTE: refresh page to see changes", { iconHTML: skeleton.refreshIcon("refresh-icon") })));
    } else {
      csSettings.appendChild(skeleton.catBodElem("userscripts", skeleton.notice(
        "No userscripts...",
        { desc: 'Go to the Crankshaft <a href="https://github.com/KraXen72/crankshaft#userscripts">README.md</a> to download some made by the client dev.' }
      )));
    }
    const userscriptSettings = import_userscripts.su.userscripts.map((userscript) => {
      const obj = {
        key: userscript.name.slice(0, -3),
        // remove .js
        title: userscript.name,
        value: import_userscripts.su.userscriptTracker[userscript.name],
        type: "bool",
        desc: userscript.fullpath,
        safety: 0,
        userscriptReference: userscript,
        callback: "userscript"
      };
      if (userscript.meta) {
        const thisMeta = userscript.meta;
        Object.assign(obj, {
          title: "name" in thisMeta && thisMeta.name ? thisMeta.name : userscript.name,
          desc: `${"desc" in thisMeta && thisMeta.desc ? thisMeta.desc.slice(0, 60) : ""}
						${"author" in thisMeta && thisMeta.author ? `&#8226; ${thisMeta.author}` : ""}
						${"version" in thisMeta && thisMeta.version ? `&#8226; v${thisMeta.version}` : ""}
						${"src" in thisMeta && thisMeta.src ? ` &#8226; <a target="_blank" href="${thisMeta.src}">source</a>` : ""}`
        });
      }
      if (userscript.unload)
        obj.instant = true;
      return obj;
    });
    document.querySelector(".Crankshaft-settings").textContent = "";
    document.querySelector(".Crankshaft-settings").append(csSettings);
    for (const i of userscriptSettings) {
      const userSet = new SettingElem(i);
      document.querySelector(".Crankshaft-settings .setBodH.userscripts").appendChild(userSet.elem);
    }
  } else {
    document.querySelector(".Crankshaft-settings").textContent = "";
    document.querySelector(".Crankshaft-settings").append(csSettings);
  }
  function toggleCategory(me) {
    const sibling = me.nextElementSibling;
    sibling.classList.toggle("setting-category-collapsed");
    const iconElem = me.querySelector(".material-icons");
    if (iconElem.innerHTML.toString() === "keyboard_arrow_down")
      iconElem.innerHTML = "keyboard_arrow_right";
    else
      iconElem.innerHTML = "keyboard_arrow_down";
  }
  const settHeaders = [...document.querySelectorAll(".Crankshaft-setHed")];
  settHeaders.forEach((header) => {
    const collapseCallback = () => {
      toggleCategory(header);
    };
    try {
      header.removeEventListener("click", collapseCallback);
    } catch (e) {
    }
    header.addEventListener("click", collapseCallback);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  renderSettings
});
