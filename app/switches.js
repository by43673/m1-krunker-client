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
var switches_exports = {};
__export(switches_exports, {
  applyCommandLineSwitches: () => applyCommandLineSwitches
});
module.exports = __toCommonJS(switches_exports);
var import_electron = require("electron");
function applyCommandLineSwitches(userPrefs) {
  if (userPrefs.safeFlags_removeUselessFeatures) {
    import_electron.app.commandLine.appendSwitch("disable-breakpad");
    import_electron.app.commandLine.appendSwitch("disable-print-preview");
    import_electron.app.commandLine.appendSwitch("disable-metrics-repo");
    import_electron.app.commandLine.appendSwitch("disable-metrics");
    import_electron.app.commandLine.appendSwitch("disable-bundled-ppapi-flash");
    import_electron.app.commandLine.appendSwitch("disable-logging");
    import_electron.app.commandLine.appendSwitch("disable-hang-monitor");
    import_electron.app.commandLine.appendSwitch("disable-component-update");
    if (process.platform === "darwin")
      import_electron.app.commandLine.appendSwitch("disable-dev-shm-usage");
    console.log("Removed useless features");
  }
  if (userPrefs.safeFlags_helpfulFlags) {
    import_electron.app.commandLine.appendSwitch("enable-javascript-harmony");
    import_electron.app.commandLine.appendSwitch("enable-future-v8-vm-features");
    import_electron.app.commandLine.appendSwitch("enable-webgl");
    import_electron.app.commandLine.appendSwitch("enable-webgl2-compute-context");
    import_electron.app.commandLine.appendSwitch("disable-background-timer-throttling");
    import_electron.app.commandLine.appendSwitch("disable-renderer-backgrounding");
    import_electron.app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
    console.log("Applied helpful flags");
  }
  if (userPrefs.experimentalFlags_increaseLimits) {
    import_electron.app.commandLine.appendSwitch("renderer-process-limit", "100");
    import_electron.app.commandLine.appendSwitch("max-active-webgl-contexts", "100");
    import_electron.app.commandLine.appendSwitch("webrtc-max-cpu-consumption-percentage", "100");
    console.log("Applied flags to increase limits");
  }
  if (userPrefs.experimentalFlags_lowLatency) {
    import_electron.app.commandLine.appendSwitch("enable-highres-timer");
    import_electron.app.commandLine.appendSwitch("enable-quic");
    import_electron.app.commandLine.appendSwitch("enable-accelerated-2d-canvas");
    import_electron.app.commandLine.appendSwitch("disable-gpu-vsync");
    console.log("Applied latency-reducing flags");
  }
  if (userPrefs.experimentalFlags_experimental) {
    import_electron.app.commandLine.appendSwitch("disable-low-end-device-mode");
    import_electron.app.commandLine.appendSwitch("enable-accelerated-video-decode");
    import_electron.app.commandLine.appendSwitch("enable-native-gpu-memory-buffers");
    import_electron.app.commandLine.appendSwitch("high-dpi-support", "1");
    import_electron.app.commandLine.appendSwitch("ignore-gpu-blocklist");
    import_electron.app.commandLine.appendSwitch("no-pings");
    import_electron.app.commandLine.appendSwitch("no-proxy-server");
    console.log("Enabled Experiments");
  }
  if (userPrefs.safeFlags_gpuRasterizing) {
    import_electron.app.commandLine.appendSwitch("enable-gpu-rasterization");
    import_electron.app.commandLine.appendSwitch("disable-zero-copy");
    console.log("GPU rasterization active");
  }
  if (userPrefs.fpsUncap) {
    import_electron.app.commandLine.appendSwitch("disable-frame-rate-limit");
    import_electron.app.commandLine.appendSwitch("disable-blink-features", "LayoutNGFragmentItem");
    import_electron.app.commandLine.appendSwitch("disable-blink-features", "LayoutNGFieldset");
    console.log("Removed FPS Cap");
  }
  if (userPrefs["angle-backend"] !== "default") {
    if (userPrefs["angle-backend"] === "vulkan") {
      import_electron.app.commandLine.appendSwitch("use-angle", "vulkan");
      import_electron.app.commandLine.appendSwitch("use-vulkan");
      import_electron.app.commandLine.appendSwitch("--enable-features=Vulkan");
      console.log("VULKAN INITIALIZED");
    } else {
      import_electron.app.commandLine.appendSwitch("use-angle", userPrefs["angle-backend"]);
      console.log(`Using Angle: ${userPrefs["angle-backend"]}`);
    }
  }
  if (userPrefs.inProcessGPU) {
    import_electron.app.commandLine.appendSwitch("in-process-gpu");
    console.log("In Process GPU is active");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  applyCommandLineSwitches
});
