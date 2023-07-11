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
var menu_exports = {};
__export(menu_exports, {
  aboutSubmenu: () => aboutSubmenu,
  constructDevtoolsSubmenu: () => constructDevtoolsSubmenu,
  csMenuTemplate: () => csMenuTemplate,
  genericMainSubmenu: () => genericMainSubmenu,
  macAppMenuArr: () => macAppMenuArr
});
module.exports = __toCommonJS(menu_exports);
var import_electron = require("electron");
const aboutSubmenu = [
  { label: "Consider supporting development by donating <3", enabled: false },
  { label: "Donate: liberapay (recurring)", registerAccelerator: false, click: () => import_electron.shell.openExternal("https://liberapay.com/KraXen72") },
  { label: "Donate: ko-fi (one time)", registerAccelerator: false, click: () => import_electron.shell.openExternal("https://ko-fi.com/kraxen72") },
  { type: "separator" },
  { label: "Github repo", registerAccelerator: false, click: () => import_electron.shell.openExternal("https://github.com/KraXen72/crankshaft") },
  { label: "Client Discord", registerAccelerator: false, click: () => import_electron.shell.openExternal("https://discord.gg/ZeVuxG7gQJ") }
];
const macAppMenuArr = process.platform === "darwin" ? [{
  label: import_electron.app.name,
  submenu: [
    ...aboutSubmenu,
    { type: "separator" },
    { role: "hide" },
    { role: "hideOthers" },
    { role: "unhide" },
    { type: "separator" },
    { role: "services" },
    { role: "quit", registerAccelerator: false }
  ]
}] : [];
const genericMainSubmenu = {
  label: "Window",
  submenu: [
    { label: "Refresh", role: "reload", accelerator: "F5" }
  ]
};
function constructDevtoolsSubmenu(providedWindow, skipFallback = null, options) {
  const maxLag = 500;
  function fallbackDevtools() {
    providedWindow.webContents.closeDevTools();
    const devtoolsWindow = new import_electron.BrowserWindow();
    devtoolsWindow.setMenuBarVisibility(false);
    providedWindow.webContents.setDevToolsWebContents(devtoolsWindow.webContents);
    providedWindow.webContents.openDevTools({ mode: "detach" });
    providedWindow.once("closed", () => devtoolsWindow.destroy());
  }
  function openDevToolsWithFallback() {
    if (skipFallback === true) {
      providedWindow.webContents.openDevTools(options);
    } else if (skipFallback === false) {
      fallbackDevtools();
    } else if (skipFallback === null) {
      providedWindow.webContents.openDevTools(options);
      const popupDevtoolTimeout = setTimeout(() => {
        skipFallback = false;
        fallbackDevtools();
      }, maxLag);
      providedWindow.webContents.once("devtools-opened", () => {
        skipFallback = true;
        clearTimeout(popupDevtoolTimeout);
      });
    }
  }
  return [
    { label: "Toggle Developer Tools", accelerator: "CommandOrControl+Shift+I", click: () => {
      openDevToolsWithFallback();
    } },
    { label: "Toggle Developer Tools (F12)", accelerator: "F12", click: () => {
      openDevToolsWithFallback();
    } }
  ];
}
const csMenuTemplate = [
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "delete" },
      { type: "separator" },
      { role: "selectAll" }
    ]
  },
  {
    label: "Page",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { type: "separator" },
      { type: "separator" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { role: "resetZoom" },
      { type: "separator" },
      { role: "togglefullscreen" }
    ]
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  aboutSubmenu,
  constructDevtoolsSubmenu,
  csMenuTemplate,
  genericMainSubmenu,
  macAppMenuArr
});
