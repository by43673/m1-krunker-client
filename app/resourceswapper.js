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
var resourceswapper_exports = {};
__export(resourceswapper_exports, {
  default: () => resourceswapper_default
});
module.exports = __toCommonJS(resourceswapper_exports);
var import_fs = require("fs");
var import_path = require("path");
const TARGET_GAME_DOMAIN = "krunker.io";
class resourceswapper_default {
  /**
   * Set the target window.
   *
   * @param browserWindow - The target window.
   */
  constructor(browserWindow, swapDir) {
    this.urls = [];
    this.started = false;
    this.browserWindow = browserWindow;
    this.swapDir = swapDir;
  }
  /** Initialize the resource swapper for the target window.*/
  start() {
    if (this.started)
      return;
    if (!(0, import_fs.existsSync)(this.swapDir))
      (0, import_fs.mkdirSync)(this.swapDir, { recursive: true });
    this.recursiveSwap("");
    if (this.urls.length) {
      this.browserWindow.webContents.session.webRequest.onBeforeRequest({ urls: this.urls }, (details, callback) => {
        const path = new URL(details.url).pathname;
        const resultPath = path.startsWith("/assets/") ? (0, import_path.join)(this.swapDir, path.substring(7)) : (0, import_path.join)(this.swapDir, path);
        callback({ redirectURL: `krunker-resource-swapper:/${resultPath}` });
      });
    }
    this.browserWindow.webContents.session.webRequest.onHeadersReceived(({ responseHeaders }, callback) => {
      for (const key in responseHeaders) {
        const lowercase = key.toLowerCase();
        if (lowercase === "access-control-allow-credentials" && responseHeaders[key][0] === "true")
          return callback(responseHeaders);
        if (lowercase === "access-control-allow-origin") {
          delete responseHeaders[key];
          break;
        }
      }
      return callback({
        responseHeaders: {
          ...responseHeaders,
          "access-control-allow-origin": ["*"]
        }
      });
    });
    this.started = true;
  }
  /**
   * Recursively swap all files in the target directory.
   *
   * @param prefix - The target directory to swap.
   */
  recursiveSwap(prefix) {
    try {
      for (const dirent of (0, import_fs.readdirSync)((0, import_path.join)(this.swapDir, prefix), { withFileTypes: true })) {
        const name = `${prefix}/${dirent.name}`;
        if (dirent.isDirectory()) {
          this.recursiveSwap(name);
        } else {
          const tests = [
            `*://*.${TARGET_GAME_DOMAIN}${name}`,
            `*://*.${TARGET_GAME_DOMAIN}${name}?*`,
            `*://*.${TARGET_GAME_DOMAIN}/assets${name}`,
            `*://*.${TARGET_GAME_DOMAIN}/assets${name}?*`
          ];
          this.urls.push(.../^\/(?:models|textures|sound|scares|videos)(?:$|\/)/u.test(name) ? tests : [
            ...tests,
            `*://comp.${TARGET_GAME_DOMAIN}${name}?*`,
            `*://comp.${TARGET_GAME_DOMAIN}/assets/${name}?*`
          ]);
        }
      }
    } catch (err) {
      console.error(`Failed to resource-swap with prefix: ${prefix}`);
    }
  }
}
