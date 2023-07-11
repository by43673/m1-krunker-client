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
var userscripts_exports = {};
__export(userscripts_exports, {
  su: () => su
});
module.exports = __toCommonJS(userscripts_exports);
var import_fs = require("fs");
var import_path = require("path");
var import_electron = require("electron");
var import_preload = require("./preload");
var import_utils = require("./utils");
var _strictMode;
const su = {
  userscriptsPath: "",
  userscriptTrackerPath: "",
  userscripts: [],
  userscriptTracker: {}
};
const errAlert = (err, name) => {
  alert(`Userscript '${name}' had an error:

${err.toString()}

Please fix the error, disable the userscript in the 'tracker.json' file or delete it.
Feel free to check console for stack trace`);
};
class Userscript {
  constructor(props) {
    // this is public so settings can just show a "reload page" message when needed
    __privateAdd(this, _strictMode, void 0);
    this.runAt = "document-end";
    this.hasRan = false;
    __privateSet(this, _strictMode, false);
    this.name = props.name;
    this.fullpath = props.fullpath;
    this.meta = false;
    this.unload = false;
    this.content = (0, import_fs.readFileSync)(this.fullpath, { encoding: "utf-8" });
    if (this.content.startsWith('"use strict"'))
      __privateSet(this, _strictMode, true);
    if (this.content.includes("// ==UserScript==") && this.content.includes("// ==/UserScript==")) {
      const metaParser = require("userscript-meta");
      let chunk = this.content.split("\n");
      chunk = chunk.length === 1 ? [chunk] : chunk;
      const startLine = chunk.findIndex((line) => line.includes("// ==UserScript=="));
      const endLine = chunk.findIndex((line) => line.includes("// ==/UserScript=="));
      if (startLine !== -1 && endLine !== -1) {
        chunk = chunk.slice(startLine, endLine + 1).join("\n");
        this.meta = metaParser.parse(chunk);
        for (const metaKey of Object.keys(this.meta)) {
          const meta = this.meta[metaKey];
          if (Array.isArray(meta))
            this.meta[metaKey] = meta[meta.length - 1];
        }
        if ("run-at" in this.meta && this.meta["run-at"] === "document.start")
          this.runAt = "document-start";
      }
    }
  }
  /** runs the userscript */
  load() {
    try {
      const exported = new Function(this.content).apply({
        unload: false,
        _console: import_preload.strippedConsole,
        _css: import_utils.userscriptToggleCSS
      });
      if (typeof exported !== "undefined") {
        if ("unload" in exported)
          this.unload = exported.unload;
      }
      import_preload.strippedConsole.log(
        `%c[cs]${__privateGet(this, _strictMode) ? "%c[strict]" : "%c[non-strict]"} %cran %c'${this.name.toString()}' `,
        "color: lightblue; font-weight: bold;",
        __privateGet(this, _strictMode) ? "color: #62dd4f" : "color: orange",
        "color: white;",
        "color: lightgreen;"
      );
    } catch (error) {
      errAlert(error, this.name);
      import_preload.strippedConsole.error(error);
    }
  }
}
_strictMode = new WeakMap();
import_electron.ipcRenderer.on("main_initializes_userscripts", (event, recieved_userscriptsPath) => {
  su.userscriptsPath = recieved_userscriptsPath;
  su.userscriptTrackerPath = (0, import_path.resolve)(su.userscriptsPath, "tracker.json");
  su.userscripts = (0, import_fs.readdirSync)(su.userscriptsPath, { withFileTypes: true }).filter((entry) => entry.name.endsWith(".js")).map((entry) => new Userscript({ name: entry.name, fullpath: (0, import_path.resolve)(su.userscriptsPath, entry.name).toString() }));
  const tracker = {};
  su.userscripts.forEach((u) => {
    tracker[u.name] = false;
  });
  Object.assign(tracker, JSON.parse((0, import_fs.readFileSync)(su.userscriptTrackerPath, { encoding: "utf-8" })));
  (0, import_fs.writeFileSync)(su.userscriptTrackerPath, JSON.stringify(tracker, null, 2), { encoding: "utf-8" });
  su.userscriptTracker = tracker;
  su.userscripts.forEach((u) => {
    if (tracker[u.name]) {
      if (u.runAt === "document-start") {
        u.load();
      } else {
        const callback = () => u.load();
        try {
          document.removeEventListener("DOMContentLoaded", callback);
        } catch (e) {
        }
        document.addEventListener("DOMContentLoaded", callback, { once: true });
      }
    }
  });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  su
});
