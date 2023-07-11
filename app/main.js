"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_path = require("path");
var import_fs = require("fs");
var import_electron = require("electron");
var import_menu = require("./menu");
var import_switches = require("./switches");
var import_resourceswapper = __toESM(require("./resourceswapper"));
const docsPath = import_electron.app.getPath("documents");
const swapperPath = (0, import_path.join)(docsPath, "Crankshaft/swapper");
const settingsPath = (0, import_path.join)(docsPath, "Crankshaft/settings.json");
const filtersPath = (0, import_path.join)(docsPath, "Crankshaft/filters.txt");
const userscriptsPath = (0, import_path.join)(docsPath, "Crankshaft/scripts");
const userscriptTrackerPath = (0, import_path.join)(userscriptsPath, "tracker.json");
import_electron.app.userAgentFallback = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Electron/10.4.7 Safari/537.36";
const settingsSkeleton = {
  fpsUncap: true,
  inProcessGPU: false,
  disableAccelerated2D: false,
  hideReCaptcha: true,
  menuTimer: false,
  quickClassPicker: false,
  fullscreen: "windowed",
  // windowed, maximized, fullscreen, borderless
  resourceSwapper: true,
  userscripts: false,
  clientSplash: true,
  discordRPC: false,
  extendedRPC: true,
  "angle-backend": "default",
  logDebugToConsole: false,
  alwaysWaitForDevTools: false,
  safeFlags_removeUselessFeatures: true,
  safeFlags_helpfulFlags: true,
  safeFlags_gpuRasterizing: false,
  experimentalFlags_increaseLimits: false,
  experimentalFlags_lowLatency: false,
  experimentalFlags_experimental: false,
  matchmaker: false,
  matchmaker_F6: false,
  matchmaker_regions: [],
  matchmaker_gamemodes: [],
  matchmaker_minPlayers: 1,
  matchmaker_maxPlayers: 6,
  matchmaker_minRemainingTime: 120,
  hideAds: "hide",
  customFilters: false,
  regionTimezones: false
};
if (!(0, import_fs.existsSync)(swapperPath))
  (0, import_fs.mkdirSync)(swapperPath, { recursive: true });
if (!(0, import_fs.existsSync)(userscriptsPath))
  (0, import_fs.mkdirSync)(userscriptsPath, { recursive: true });
if (!(0, import_fs.existsSync)(userscriptTrackerPath))
  (0, import_fs.writeFileSync)(userscriptTrackerPath, "{}", { encoding: "utf-8" });
if (!(0, import_fs.existsSync)(filtersPath)) {
  (0, import_fs.writeFileSync)(
    filtersPath,
    `# Welcome to the filters file! Filters follow the URL pattern format:
# https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns
# Hashtags are used for comments, and each line is a new filter.
# Here's an example of a filter that blocks the cosmetic bundle popup audio:
# *://assets.krunker.io/sound/bundle_*.mp3*
`
  );
}
if (!(0, import_fs.existsSync)(settingsPath))
  (0, import_fs.writeFileSync)(settingsPath, JSON.stringify(settingsSkeleton, null, 2), { encoding: "utf-8", flag: "wx" });
const userPrefs = settingsSkeleton;
Object.assign(userPrefs, JSON.parse((0, import_fs.readFileSync)(settingsPath, { encoding: "utf-8" })));
let modifiedSettings = false;
if (typeof userPrefs.fullscreen === "boolean") {
  modifiedSettings = true;
  if (userPrefs.fullscreen === true)
    userPrefs.fullscreen = "fullscreen";
  else
    userPrefs.fullscreen = "windowed";
}
if (typeof userPrefs.hideAds === "boolean") {
  modifiedSettings = true;
  if (userPrefs.hideAds === true)
    userPrefs.hideAds = "hide";
  else
    userPrefs.hideAds = "off";
}
if (modifiedSettings)
  (0, import_fs.writeFileSync)(settingsPath, JSON.stringify(userPrefs, null, 2), { encoding: "utf-8" });
let mainWindow;
let socialWindowReference;
import_electron.ipcMain.on("logMainConsole", (event, data) => {
  console.log(data);
});
import_electron.ipcMain.on("initializeUserscripts", () => {
  mainWindow.webContents.send("main_initializes_userscripts", userscriptsPath, __dirname);
});
import_electron.ipcMain.on("settingsUI_requests_userPrefs", () => {
  mainWindow.webContents.send("m_userPrefs_for_settingsUI", settingsPath, userPrefs);
});
import_electron.ipcMain.on("matchmaker_requests_userPrefs", () => {
  mainWindow.webContents.send("matchmakerRedirect", userPrefs);
});
import_electron.ipcMain.on("settingsUI_updates_userPrefs", (event, data) => {
  Object.assign(userPrefs, data);
});
import_electron.ipcMain.on("openExternal", (event, url) => {
  import_electron.shell.openExternal(url);
});
const $assets = (0, import_path.resolve)(__dirname, "..", "assets");
const hideAdsCSS = (0, import_fs.readFileSync)((0, import_path.join)($assets, "hideAds.css"), { encoding: "utf-8" });
function customGenericWin(url, providedMenuTemplate, addAdditionalSubmenus = true) {
  const genericWin = new import_electron.BrowserWindow({
    autoHideMenuBar: true,
    show: false,
    width: 1600,
    height: 900,
    center: true,
    webPreferences: {
      spellcheck: false,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  });
  const injectablePosition = process.platform === "darwin" ? 1 : 0;
  const { submenu } = providedMenuTemplate[injectablePosition];
  if (addAdditionalSubmenus && Array.isArray(submenu)) {
    providedMenuTemplate[injectablePosition].submenu = submenu.concat([
      { label: "Copy current url to clipboard", accelerator: "F7", click: () => {
        import_electron.clipboard.writeText(genericWin.webContents.getURL());
      } },
      { label: "Debug: Display original url", accelerator: "CommandOrControl+F1", click: () => {
        import_electron.dialog.showMessageBoxSync(genericWin, { message: url });
      } },
      { type: "separator" },
      {
        label: "Go to previous page (Go Back)",
        registerAccelerator: false,
        click: () => {
          if (genericWin.webContents.canGoBack())
            genericWin.webContents.goBack();
        }
      },
      {
        label: "Go to next page (Go Forward)",
        registerAccelerator: false,
        click: () => {
          if (genericWin.webContents.canGoForward())
            genericWin.webContents.goForward();
        }
      },
      { type: "separator" },
      ...(0, import_menu.constructDevtoolsSubmenu)(genericWin, userPrefs.alwaysWaitForDevTools || null)
    ]);
  }
  const thisMenu = import_electron.Menu.buildFromTemplate(providedMenuTemplate);
  genericWin.setMenu(thisMenu);
  genericWin.setMenuBarVisibility(false);
  genericWin.loadURL(url);
  genericWin.once("ready-to-show", () => {
    if (userPrefs.hideAds === "hide" || userPrefs.hideAds === "block")
      genericWin.webContents.insertCSS(hideAdsCSS);
    genericWin.show();
  });
  if (userPrefs.hideAds === "hide" || userPrefs.hideAds === "block") {
    genericWin.webContents.on("did-navigate", () => {
      genericWin.webContents.insertCSS(hideAdsCSS);
    });
  }
  genericWin.once("close", () => {
    genericWin.destroy();
  });
  return genericWin;
}
(0, import_switches.applyCommandLineSwitches)(userPrefs);
if (userPrefs.resourceSwapper) {
  import_electron.protocol.registerSchemesAsPrivileged([{
    scheme: "krunker-resource-swapper",
    privileges: {
      secure: true,
      corsEnabled: true,
      bypassCSP: true
    }
  }]);
}
import_electron.app.on("ready", () => {
  import_electron.app.setAppUserModelId(process.execPath);
  if (userPrefs.resourceSwapper)
    import_electron.protocol.registerFileProtocol("krunker-resource-swapper", (request, callback) => callback(decodeURI(request.url.replace(/krunker-resource-swapper:/u, ""))));
  const mainWindowProps = {
    show: false,
    width: 1600,
    height: 900,
    center: true,
    webPreferences: {
      preload: (0, import_path.join)(__dirname, "preload.js"),
      enableRemoteModule: false,
      spellcheck: false,
      nodeIntegration: false
    },
    backgroundColor: "#000000"
  };
  switch (userPrefs.fullscreen) {
    case "fullscreen":
      mainWindowProps.fullscreen = true;
      break;
    case "borderless": {
      const dimensions = import_electron.screen.getPrimaryDisplay().bounds;
      const borderlessProps = {
        frame: false,
        kiosk: true,
        fullscreenable: false,
        fullscreen: false,
        width: dimensions.width,
        height: dimensions.height
      };
      Object.assign(mainWindowProps, borderlessProps);
      break;
    }
    case "windowed":
    default:
      mainWindowProps.fullscreen = false;
      break;
  }
  mainWindow = new import_electron.BrowserWindow(mainWindowProps);
  if (userPrefs.fullscreen === "borderless")
    mainWindow.moveTop();
  mainWindow.on("ready-to-show", () => {
    if (userPrefs.fullscreen === "maximized" && !mainWindow.isMaximized())
      mainWindow.maximize();
    if (!mainWindow.isVisible())
      mainWindow.show();
    const filter = { urls: [] };
    const blockFilters = [
      "*://*.pollfish.com/*",
      "*://www.paypalobjects.com/*",
      "*://fran-cdn.frvr.com/prebid*",
      "*://fran-cdn.frvr.com/gpt_*",
      "*://c.amazon-adsystem.com/*",
      "*://fran-cdn.frvr.com/pubads_*",
      "*://platform.twitter.com/*",
      "*://cookiepro.com/*",
      "*://*.cookiepro.com/*",
      "*://www.googletagmanager.com/*",
      "*://storage.googleapis.com/pollfish_production/*",
      "*://krunker.io/libs/frvr-channel-web*",
      "*://apis.google.com/js/platform.js",
      "*://imasdk.googleapis.com/*"
    ];
    if (userPrefs.hideAds === "block")
      filter.urls.push(...blockFilters);
    if (userPrefs.customFilters) {
      let conf = (0, import_fs.readFileSync)(filtersPath, "utf8").split("\n");
      for (let i = 0; i < conf.length; i++)
        conf[i] = conf[i].split("#")[0];
      conf = conf.filter((line) => line.trim().length > 0);
      for (const item of conf)
        filter.urls.push(item);
    }
    mainWindow.webContents.session.webRequest.onBeforeRequest(filter, (details, callback) => {
      if (userPrefs.hideAds !== "block") {
        callback({ cancel: false });
        return;
      }
      console.log(`Blocked ${details.url}`);
      callback({ cancel: true });
    });
    if (mainWindow.webContents.getURL().endsWith("dummy.html")) {
      mainWindow.loadURL("https://krunker.io");
      return;
    }
    mainWindow.webContents.send("injectClientCSS", userPrefs, import_electron.app.getVersion());
    if (userPrefs.discordRPC) {
      let updateRPC = function({ details, state }) {
        const data = {
          details,
          state,
          startTimestamp,
          largeImageKey: "logo",
          largeImageText: "Playing Krunker",
          instance: true
        };
        if (userPrefs.extendedRPC) {
          Object.assign(data, {
            buttons: [
              { label: "Github", url: "https://github.com/KraXen72/crankshaft" },
              { label: "Discord Server", url: "https://discord.gg/ZeVuxG7gQJ" }
            ]
          });
        }
        rpc.setActivity(data);
      };
      const DiscordRPC = require("discord-rpc");
      const rpc = new DiscordRPC.Client({ transport: "ipc" });
      const startTimestamp = /* @__PURE__ */ new Date();
      const clientId = "988529967220523068";
      rpc.login({ clientId }).catch(console.error);
      mainWindow.webContents.send("initDiscordRPC");
      import_electron.ipcMain.on("preload_updates_DiscordRPC", (event, data) => {
        updateRPC(data);
      });
    }
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow.webContents.send("checkForUpdates", import_electron.app.getVersion());
    mainWindow.webContents.on("did-finish-load", () => mainWindow.webContents.send("main_did-finish-load", userPrefs));
  });
  mainWindow.loadFile((0, import_path.join)($assets, "dummy.html"));
  if (userPrefs.logDebugToConsole) {
    console.log("GPU INFO BEGIN");
    import_electron.app.getGPUInfo("complete").then((completeObj) => {
      console.dir(completeObj);
    });
    console.log("GPU FEATURES BEGIN");
    console.dir(import_electron.app.getGPUFeatureStatus());
  }
  const gameSubmenu = {
    label: "Game",
    submenu: [
      { label: "Reload this game", accelerator: "F5", click: () => {
        mainWindow.reload();
      } },
      {
        label: "Find new Lobby",
        accelerator: "F6",
        click: () => {
          if (userPrefs.matchmaker && userPrefs.matchmaker_F6)
            mainWindow.webContents.send("matchmakerRedirect", userPrefs);
          else
            mainWindow.loadURL("https://krunker.io");
        }
      },
      { label: "Copy game link to clipboard", accelerator: "F7", click: () => {
        import_electron.clipboard.writeText(mainWindow.webContents.getURL());
      } },
      {
        label: "Join game link from clipboard",
        accelerator: "CommandOrControl+F7",
        click: () => {
          const copiedText = import_electron.clipboard.readText();
          if (copiedText.includes("https://krunker.io/?game"))
            mainWindow.webContents.loadURL(copiedText);
        }
      },
      { type: "separator" },
      ...(0, import_menu.constructDevtoolsSubmenu)(mainWindow, userPrefs.alwaysWaitForDevTools || null)
    ]
  };
  if (process.platform !== "darwin")
    import_menu.csMenuTemplate.push({ label: "About", submenu: import_menu.aboutSubmenu });
  const csMenu = import_electron.Menu.buildFromTemplate([...import_menu.macAppMenuArr, gameSubmenu, ...import_menu.csMenuTemplate]);
  const strippedMenuTemplate = [...import_menu.macAppMenuArr, import_menu.genericMainSubmenu, ...import_menu.csMenuTemplate];
  import_electron.Menu.setApplicationMenu(csMenu);
  mainWindow.setMenu(csMenu);
  mainWindow.setAutoHideMenuBar(true);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.webContents.on("new-window", (event, url) => {
    console.log("url trying to open:", url, "socialWindowReference:", typeof socialWindowReference);
    const freeSpinHostnames = ["youtube.com", "twitch.tv", "twitter.com", "reddit.com", "discord.com", "accounts.google.com", "instagram.com"];
    if (typeof socialWindowReference !== "undefined" && socialWindowReference.isDestroyed())
      socialWindowReference = void 0;
    if (url.includes("https://krunker.io/social.html") && typeof socialWindowReference !== "undefined") {
      event.preventDefault();
      socialWindowReference.loadURL(url);
    } else if (freeSpinHostnames.some((fsUrl) => url.includes(fsUrl))) {
      const pick = import_electron.dialog.showMessageBoxSync({
        title: "Opening a new url",
        noLink: false,
        message: `You're trying to open ${url}`,
        buttons: ["Open in default browser", "Open as a new window in client", "Open in this window", "Don't open"]
      });
      switch (pick) {
        case 0:
          event.preventDefault();
          import_electron.shell.openExternal(url);
          break;
        case 2:
          event.preventDefault();
          mainWindow.loadURL(url);
          break;
        case 3:
          event.preventDefault();
          break;
        case 1:
        default: {
          event.preventDefault();
          const genericWin = customGenericWin(url, strippedMenuTemplate);
          event.newGuest = genericWin;
          break;
        }
      }
    } else if (url.includes("comp.krunker.io") || url.startsWith("https://krunker.io/?game") || url.startsWith("https://krunker.io/?play") || url.includes("?game=") && url.includes("&matchId=")) {
      event.preventDefault();
      mainWindow.loadURL(url);
    } else {
      event.preventDefault();
      console.log(`genericWindow created for ${url}`, socialWindowReference);
      const genericWin = customGenericWin(url, strippedMenuTemplate);
      event.newGuest = genericWin;
      if (url.includes("https://krunker.io/social.html")) {
        socialWindowReference = genericWin;
        genericWin.on("close", () => {
          socialWindowReference = void 0;
        });
        genericWin.webContents.on("will-navigate", (evt, willnavUrl) => {
          if (willnavUrl.includes("https://krunker.io/social.html")) {
            genericWin.loadURL(willnavUrl);
          } else {
            evt.preventDefault();
            import_electron.shell.openExternal(willnavUrl);
          }
        });
      }
    }
  });
  if (userPrefs.resourceSwapper) {
    const CrankshaftSwapInstance = new import_resourceswapper.default(mainWindow, swapperPath);
    CrankshaftSwapInstance.start();
  }
});
import_electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin")
    return import_electron.app.quit();
});
