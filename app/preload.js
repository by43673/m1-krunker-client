"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var preload_exports = {};
__export(preload_exports, {
  getTimezoneByRegionKey: () => getTimezoneByRegionKey,
  regionMappings: () => regionMappings,
  strippedConsole: () => strippedConsole,
  styleSettingsCSS: () => styleSettingsCSS
});
module.exports = __toCommonJS(preload_exports);
var import_fs = require("fs");
var import_path = require("path");
var import_electron = require("electron");
var import_matchmaker = require("./matchmaker");
var import_utils = require("./utils");
var import_settingsui = require("./settingsui");
var import_compare_versions = require("compare-versions");
var import_dayjs = __toESM(require("dayjs"));
var import_utc = __toESM(require("dayjs/plugin/utc"));
import_dayjs.default.extend(import_utc.default);
window.OffCliV = true;
const strippedConsole = {
  error: console.error.bind(console),
  log: console.log.bind(console),
  warn: console.warn.bind(console),
  time: console.time.bind(console),
  timeEnd: console.timeEnd.bind(console)
};
const $assets = (0, import_path.resolve)(__dirname, "..", "assets");
const repoID = "KraXen72/crankshaft";
const styleSettingsCSS = {
  hideAds: (0, import_fs.readFileSync)((0, import_path.join)($assets, "hideAds.css"), { encoding: "utf-8" }),
  menuTimer: (0, import_fs.readFileSync)((0, import_path.join)($assets, "menuTimer.css"), { encoding: "utf-8" }),
  quickClassPicker: (0, import_fs.readFileSync)((0, import_path.join)($assets, "quickClassPicker.css"), { encoding: "utf-8" }) + (0, import_utils.hiddenClassesImages)(16),
  hideReCaptcha: "body > div:not([class]):not([id]) > div:not(:empty):not([class]):not([id]) { display: none; }"
};
import_electron.ipcRenderer.on("main_did-finish-load", (event, _userPrefs) => patchSettings(_userPrefs));
import_electron.ipcRenderer.on("checkForUpdates", async (event, currentVersion) => {
  const releases = await fetch(`https://api.github.com/repos/${repoID}/releases/latest`);
  const response = await releases.json();
  const latestVersion = response.tag_name;
  const comparison = (0, import_compare_versions.compareVersions)(currentVersion, latestVersion);
  const updateElement = (0, import_utils.createElement)("div", {
    class: ["crankshaft-holder-update", "refresh-popup"],
    id: "#loadInfoUpdateHolder"
  });
  if (comparison === -1) {
    updateElement.appendChild((0, import_utils.createElement)("a", { text: `New update! Download ${latestVersion}` }));
    const callback = () => {
      import_electron.ipcRenderer.send("openExternal", `https://github.com/${repoID}/releases/latest`);
    };
    try {
      updateElement.removeEventListener("click", callback);
    } catch (e) {
    }
    updateElement.addEventListener("click", callback);
  } else {
    updateElement.appendChild((0, import_utils.createElement)("span", { text: "No new updates" }));
  }
  strippedConsole.log(`Crankshaft client v${currentVersion} latest: v${latestVersion}`);
  document.body.appendChild(updateElement);
  let hideTimeout = setTimeout(() => updateElement.remove(), 5e3);
  updateElement.onmouseenter = () => clearTimeout(hideTimeout);
  updateElement.onmouseleave = () => {
    hideTimeout = setTimeout(() => updateElement.remove(), 5e3);
  };
  document.addEventListener("pointerlockchange", () => {
    clearTimeout(hideTimeout);
    updateElement.remove();
  }, { once: true });
});
import_electron.ipcRenderer.on("initDiscordRPC", () => {
  function updateRPC() {
    strippedConsole.log("> updated RPC");
    const classElem = document.getElementById("menuClassName");
    const skinElem = document.querySelector("#menuClassSubtext > span");
    const mapElem = document.getElementById("mapInfo");
    const gameActivity = (0, import_utils.hasOwn)(window, "getGameActivity") ? window.getGameActivity() : {};
    let overWriteDetails = false;
    if (!(0, import_utils.hasOwn)(gameActivity, "class"))
      gameActivity.class = { name: classElem?.textContent ?? "" };
    if (!(0, import_utils.hasOwn)(gameActivity, "map") || !(0, import_utils.hasOwn)(gameActivity, "mode"))
      overWriteDetails = mapElem?.textContent ?? "Loading game...";
    const data = {
      details: overWriteDetails || `${gameActivity.mode} on ${gameActivity.map}`,
      state: `${gameActivity.class.name} \u2022 ${skinElem === null ? "" : skinElem.textContent}`
    };
    if (!skinElem) {
      import_electron.ipcRenderer.send("preload_updates_DiscordRPC", { details: "Loading krunker...", state: "github.com/KraXen72/crankshaft" });
    } else {
      import_electron.ipcRenderer.send("preload_updates_DiscordRPC", data);
    }
  }
  import_electron.ipcRenderer.on("main_did-finish-load", updateRPC);
  window.addEventListener("load", () => {
    updateRPC();
    setTimeout(() => {
      try {
        document.getElementById("windowCloser").addEventListener("click", updateRPC);
      } catch (e) {
        strippedConsole.error("didn't hook wincloser", e);
      }
      try {
        document.getElementById("customizeButton").addEventListener("click", updateRPC);
      } catch (e) {
        strippedConsole.error("didn't hook customizeButton", e);
      }
    }, 4e3);
  });
  document.addEventListener("pointerlockchange", updateRPC);
});
import_electron.ipcRenderer.on("matchmakerRedirect", (_event, _userPrefs) => (0, import_matchmaker.fetchGame)(_userPrefs));
import_electron.ipcRenderer.on("injectClientCSS", (_event, _userPrefs, version) => {
  const { matchmaker, matchmaker_F6 } = _userPrefs;
  document.addEventListener("keydown", (event) => {
    if (event.code === "Escape")
      document.exitPointerLock();
    if (event.code === "F1" && matchmaker && !matchmaker_F6)
      import_electron.ipcRenderer.send("matchmaker_requests_userPrefs");
  });
  const { hideAds, menuTimer, quickClassPicker, hideReCaptcha, clientSplash, userscripts } = _userPrefs;
  const splashId = "Crankshaft-splash-css";
  const settId = "Crankshaft-settings-css";
  const settCss = (0, import_fs.readFileSync)((0, import_path.join)($assets, "settingCss.css"), { encoding: "utf-8" });
  (0, import_utils.injectSettingsCSS)(settCss, settId);
  if (clientSplash) {
    const splashCSS = (0, import_fs.readFileSync)((0, import_path.join)($assets, "splashCss.css"), { encoding: "utf-8" });
    (0, import_utils.injectSettingsCSS)(splashCSS, splashId);
    const instructionHider = document.getElementById("instructionHider");
    if (instructionHider === null)
      throw "Krunker didn't create #instructionHider";
    const logoSVG = (0, import_utils.createElement)("svg", {
      id: "crankshaft-logo-holder",
      innerHTML: (0, import_fs.readFileSync)((0, import_path.join)($assets, "full_logo.svg"), { encoding: "utf-8" })
    });
    const clearSplash = (_observer) => {
      try {
        logoSVG.remove();
        _observer.disconnect();
      } catch (e) {
        console.log("splash screen was already cleared.");
      }
    };
    instructionHider.appendChild(logoSVG);
    logoSVG.appendChild((0, import_utils.createElement)("div", { class: "crankshaft-holder-l", id: "#loadInfoLHolder", text: `v${version}` }));
    logoSVG.appendChild((0, import_utils.createElement)("div", { class: "crankshaft-holder-r", id: "#loadInfoRHolder", text: "Client by KraXen72" }));
    const observerConfig = { attributes: true, childList: true, subtree: true };
    const callback = (mutationList, observer2) => {
      for (const mutation of mutationList)
        if (mutation.type === "childList")
          clearSplash(observer2);
    };
    const observer = new MutationObserver(callback);
    observer.observe(document.getElementById("instructions"), observerConfig);
    document.addEventListener("pointerlockchange", () => {
      clearSplash(observer);
    }, { once: true });
  }
  if (hideAds === "block" || hideAds === "hide") {
    (0, import_utils.toggleSettingCSS)(styleSettingsCSS.hideAds, "hideAds", true);
    document.getElementById("hiddenClasses").classList.add("hiddenClasses-hideAds-bottomOffset");
  }
  if (menuTimer)
    (0, import_utils.toggleSettingCSS)(styleSettingsCSS.menuTimer, "menuTimer", true);
  if (quickClassPicker)
    (0, import_utils.toggleSettingCSS)(styleSettingsCSS.quickClassPicker, "quickClassPicker", true);
  if (hideReCaptcha)
    (0, import_utils.toggleSettingCSS)(styleSettingsCSS.hideReCaptcha, "hideReCaptcha", true);
  if (userscripts)
    import_electron.ipcRenderer.send("initializeUserscripts");
});
const regionMappings = [
  { name: "Frankfurt", id: "de-fra", code: "FRA", offset: 2 },
  { name: "Silicon Valley", id: "us-ca-sv", code: "SV", offset: -7 },
  { name: "Sydney", id: "au-syd", code: "SYD", offset: 10 },
  { name: "Tokyo", id: "jb-hnd", code: "TOK", offset: 9 },
  { name: "Miami", id: "us-fl", code: "MIA", offset: -4 },
  { name: "Singapore", id: "sgp", code: "SIN", offset: 8 },
  { name: "New York", id: "us-nj", code: "NY", offset: -4 },
  { name: "Mumbai", id: "as-mb", code: "MBI", offset: 5.5 },
  { name: "Dallas", id: "us-tx", code: "DAL", offset: -5 },
  { name: "Brazil", id: "brz", code: "BRZ", offset: -3 },
  // approximate, BRT
  { name: "Middle East", id: "me-bhn", code: "BHN", offset: 3 },
  // approximate, Saudi arabia
  { name: "South Africa", id: "af-ct", code: "AFR", offset: 2 },
  // approximate, SAST
  // found in matchmaker, but not region picker
  { name: "China (hidden)", id: "", code: "CHI", offset: 8 },
  // approximate, Beijing
  { name: "London (hidden)", id: "", code: "LON", offset: 1 },
  { name: "Seattle (hidden)", id: "", code: "STL", offset: -7 },
  { name: "Mexico (hidden)", id: "", code: "MX", offset: -6 }
];
const regionOptionsRegex = new RegExp("s*<option value=.*(de-fra).*(us-ca-sv).*</option>", "gu");
function getTimezoneByRegionKey(key, value) {
  if (key === "id" && value === "")
    throw new Error("getTimezoneByRegionKey: forbidden to get regions by id with empty id, would match multiple hidden regions");
  const date = (0, import_dayjs.default)().utc();
  const possibleRegions = regionMappings.filter((reg) => reg[key] === value);
  if (possibleRegions.length === 0)
    throw new Error(`getTimezoneByRegionKey: couldn't get region object for '${key}' === '${value}'`);
  const region = possibleRegions[0];
  const localDate = region.offset > 0 ? date.add(region.offset, "hour") : date.subtract(Math.abs(region.offset), "hour");
  return `[${localDate.format("HH:mm")}]`;
}
function patchSettings(_userPrefs) {
  let interval = null;
  function hookSettings() {
    const settingsWindow = window.windows[0];
    let selectedTab = settingsWindow.tabIndex;
    const isClientTab = () => {
      const allTabsCount = settingsWindow.tabs[settingsWindow.settingType].length - 1;
      return selectedTab === allTabsCount;
    };
    const showWindowHook = window.showWindow.bind(window);
    const getSettingsHook = settingsWindow.getSettings.bind(settingsWindow);
    const changeTabHook = settingsWindow.changeTab.bind(settingsWindow);
    window.showWindow = (...args) => {
      const result = showWindowHook(...args);
      if (args[0] === 1) {
        if (settingsWindow.settingType === "basic")
          settingsWindow.toggleType({ checked: true });
        const advSliderElem = document.querySelector(".advancedSwitch input#typeBtn");
        advSliderElem.disabled = true;
        advSliderElem.nextElementSibling.setAttribute("title", "Crankshaft auto-enables advanced settings mode");
        if (isClientTab())
          (0, import_settingsui.renderSettings)();
      }
      return result;
    };
    settingsWindow.changeTab = (...args) => {
      const result = changeTabHook(...args);
      selectedTab = settingsWindow.tabIndex;
      const settHolder = document.getElementById("settHolder");
      if (!isClientTab() && settHolder !== null)
        settHolder.classList.remove("Crankshaft-settings");
      if (isClientTab())
        (0, import_settingsui.renderSettings)();
      return result;
    };
    settingsWindow.getSettings = (...args) => {
      const result = getSettingsHook(...args);
      if (!_userPrefs.regionTimezones)
        return result;
      if (result.includes('window.setSetting("defaultRegion"') && result.match(regionOptionsRegex).length > 0) {
        const optionsHTML = result.match(regionOptionsRegex)[0];
        const optionElements = [...(0, import_utils.createElement)("div", { innerHTML: optionsHTML }).children];
        for (let i = 0; i < optionElements.length; i++) {
          const opt = optionElements[i];
          opt.textContent += ` ${getTimezoneByRegionKey("id", opt.value)}`;
        }
        const tempHolder = document.createElement("div");
        optionElements.forEach((opt) => tempHolder.appendChild(opt));
        const patchedHTML = tempHolder.innerHTML;
        return result.replace(optionsHTML, patchedHTML);
      }
      return result;
    };
  }
  function waitForWindow0() {
    if ((0, import_utils.hasOwn)(window, "showWindow") && typeof window.showWindow === "function" && (0, import_utils.hasOwn)(window, "windows") && Array.isArray(window.windows) && window.windows.length >= 0 && typeof window.windows[0] !== "undefined" && typeof window.windows[0].changeTab === "function") {
      clearInterval(interval);
      hookSettings();
    }
  }
  interval = setInterval(waitForWindow0, 250);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getTimezoneByRegionKey,
  regionMappings,
  strippedConsole,
  styleSettingsCSS
});
