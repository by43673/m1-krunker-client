"use strict";
var a=Object.defineProperty;var p=Object.getOwnPropertyDescriptor;var i=Object.getOwnPropertyNames;var m=Object.prototype.hasOwnProperty;var b=(e,o)=>{for(var l in o)a(e,l,{get:o[l],enumerable:!0})},f=(e,o,l,s)=>{if(o&&typeof o=="object"||typeof o=="function")for(let r of i(o))!m.call(e,r)&&r!==l&&a(e,r,{get:()=>o[r],enumerable:!(s=p(o,r))||s.enumerable});return e};var g=e=>f(a({},"__esModule",{value:!0}),e);var y={};b(y,{aboutSubmenu:()=>u,constructDevtoolsSubmenu:()=>D,csMenuTemplate:()=>T,genericMainSubmenu:()=>h,macAppMenuArr:()=>C});module.exports=g(y);var t=require("electron");const u=[{label:"Consider supporting development by donating <3",enabled:!1},{label:"Donate: liberapay (recurring)",registerAccelerator:!1,click:()=>t.shell.openExternal("https://liberapay.com/KraXen72")},{label:"Donate: ko-fi (one time)",registerAccelerator:!1,click:()=>t.shell.openExternal("https://ko-fi.com/kraxen72")},{type:"separator"},{label:"Github repo",registerAccelerator:!1,click:()=>t.shell.openExternal("https://github.com/KraXen72/crankshaft")},{label:"Client Discord",registerAccelerator:!1,click:()=>t.shell.openExternal("https://discord.gg/ZeVuxG7gQJ")}],C=process.platform==="darwin"?[{label:t.app.name,submenu:[...u,{type:"separator"},{role:"hide"},{role:"hideOthers"},{role:"unhide"},{type:"separator"},{role:"services"},{role:"quit",registerAccelerator:!1}]}]:[],h={label:"Window",submenu:[{label:"Refresh",role:"reload",accelerator:"F5"}]};function D(e,o=null,l){function r(){e.webContents.closeDevTools();const n=new t.BrowserWindow;n.setMenuBarVisibility(!1),e.webContents.setDevToolsWebContents(n.webContents),e.webContents.openDevTools({mode:"detach"}),e.once("closed",()=>n.destroy())}function c(){if(o===!0)e.webContents.openDevTools(l);else if(o===!1)r();else if(o===null){e.webContents.openDevTools(l);const n=setTimeout(()=>{o=!1,r()},500);e.webContents.once("devtools-opened",()=>{o=!0,clearTimeout(n)})}}return[{label:"Toggle Developer Tools",accelerator:"CommandOrControl+Shift+I",click:()=>{c()}},{label:"Toggle Developer Tools (F12)",accelerator:"F12",click:()=>{c()}}]}const T=[{label:"Edit",submenu:[{role:"undo"},{role:"redo"},{type:"separator"},{role:"cut"},{role:"copy"},{role:"paste"},{role:"delete"},{type:"separator"},{role:"selectAll"}]},{label:"Page",submenu:[{role:"reload"},{role:"forceReload"},{type:"separator"},{type:"separator"},{role:"zoomIn"},{role:"zoomOut"},{role:"resetZoom"},{type:"separator"},{role:"togglefullscreen"}]}];0&&(module.exports={aboutSubmenu,constructDevtoolsSubmenu,csMenuTemplate,genericMainSubmenu,macAppMenuArr});
