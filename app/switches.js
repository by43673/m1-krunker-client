"use strict";
var c=Object.defineProperty;var o=Object.getOwnPropertyDescriptor;var l=Object.getOwnPropertyNames;var m=Object.prototype.hasOwnProperty;var t=(a,n)=>{for(var p in n)c(a,p,{get:n[p],enumerable:!0})},s=(a,n,p,d)=>{if(n&&typeof n=="object"||typeof n=="function")for(let i of l(n))!m.call(a,i)&&i!==p&&c(a,i,{get:()=>n[i],enumerable:!(d=o(n,i))||d.enumerable});return a};var r=a=>s(c({},"__esModule",{value:!0}),a);var h={};t(h,{applyCommandLineSwitches:()=>g});module.exports=r(h);var e=require("electron");function g(a){a.safeFlags_removeUselessFeatures&&(e.app.commandLine.appendSwitch("disable-breakpad"),e.app.commandLine.appendSwitch("disable-print-preview"),e.app.commandLine.appendSwitch("disable-metrics-repo"),e.app.commandLine.appendSwitch("disable-metrics"),e.app.commandLine.appendSwitch("disable-2d-canvas-clip-aa"),e.app.commandLine.appendSwitch("disable-bundled-ppapi-flash"),e.app.commandLine.appendSwitch("disable-logging"),e.app.commandLine.appendSwitch("disable-hang-monitor"),e.app.commandLine.appendSwitch("disable-component-update"),process.platform==="darwin"&&e.app.commandLine.appendSwitch("disable-dev-shm-usage"),console.log("Removed useless features")),a.safeFlags_helpfulFlags&&(e.app.commandLine.appendSwitch("enable-future-v8-vm-features"),e.app.commandLine.appendSwitch("enable-webgl2-compute-context"),e.app.commandLine.appendSwitch("disable-background-timer-throttling"),e.app.commandLine.appendSwitch("disable-renderer-backgrounding"),console.log("Applied helpful flags")),a.experimentalFlags_increaseLimits&&(e.app.commandLine.appendSwitch("renderer-process-limit","100"),e.app.commandLine.appendSwitch("max-active-webgl-contexts","100"),e.app.commandLine.appendSwitch("webrtc-max-cpu-consumption-percentage","100"),e.app.commandLine.appendSwitch("ignore-gpu-blacklist"),console.log("Applied flags to increase limits")),a.experimentalFlags_lowLatency&&(e.app.commandLine.appendSwitch("enable-features","BlinkCompositorUseDisplayThreadPriority"),e.app.commandLine.appendSwitch("enable-features","GpuUseDisplayThreadPriority"),console.log("Applied latency-reducing flags")),a.experimentalFlags_experimental&&(e.app.commandLine.appendSwitch("enable-features","DefaultPassthroughCommandDecoder"),e.app.commandLine.appendSwitch("enable-features","CanvasOopRasterization"),console.log("Enabled Experiments")),a.safeFlags_gpuRasterizing&&(e.app.commandLine.appendSwitch("enable-gpu-rasterization"),e.app.commandLine.appendSwitch("enable-gpu-rasterization"),e.app.commandLine.appendSwitch("disable-zero-copy"),console.log("GPU rasterization active")),a.fpsUncap&&(e.app.commandLine.appendSwitch("disable-frame-rate-limit"),e.app.commandLine.appendSwitch("disable-gpu-vsync"),e.app.commandLine.appendSwitch("max-gum-fps","9999"),e.app.commandLine.appendSwitch("disable-features","UsePreferredIntervalForVideo"),e.app.commandLine.appendSwitch("autoplay-policy","no-user-gesture-required"),console.log("Removed FPS Cap")),a["angle-backend"]!=="default"&&(a["angle-backend"]==="vulkan"?(e.app.commandLine.appendSwitch("use-angle","vulkan"),e.app.commandLine.appendSwitch("use-vulkan"),e.app.commandLine.appendSwitch("--enable-features=Vulkan"),console.log("VULKAN INITIALIZED")):(e.app.commandLine.appendSwitch("use-angle",a["angle-backend"]),console.log(`Using Angle: ${a["angle-backend"]}`))),a.inProcessGPU&&(e.app.commandLine.appendSwitch("in-process-gpu"),console.log("In Process GPU is active"))}0&&(module.exports={applyCommandLineSwitches});
