import { join as pathJoin, resolve as pathResolve } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { BrowserWindow, Menu, MenuItem, MenuItemConstructorOptions, app, clipboard, dialog, ipcMain, protocol, shell, screen, BrowserWindowConstructorOptions } from 'electron';
import { aboutSubmenu, macAppMenuArr, genericMainSubmenu, csMenuTemplate, constructDevtoolsSubmenu } from './menu';
import { applyCommandLineSwitches } from './switches';
import Swapper from './resourceswapper';

/// <reference path="global.d.ts" />

const docsPath = app.getPath('documents');
const swapperPath = pathJoin(docsPath, 'Crankshaft/swapper');
const settingsPath = pathJoin(docsPath, 'Crankshaft/settings.json');
const filtersPath = pathJoin(docsPath, 'Crankshaft/filters.txt');
const userscriptsPath = pathJoin(docsPath, 'Crankshaft/scripts');
const userscriptTrackerPath = pathJoin(userscriptsPath, 'tracker.json');

const settingsSkeleton = {
	fpsUncap: true,
	inProcessGPU: false,
	disableAccelerated2D: false,
	hideReCaptcha: true,
	menuTimer: false,
	quickClassPicker: false,
	fullscreen: 'windowed', // windowed, maximized, fullscreen, borderless
	resourceSwapper: true,
	userscripts: false,
	clientSplash: true,
	discordRPC: false,
	extendedRPC: true,
	'angle-backend': 'default',
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
	matchmaker_regions: [] as string[],
	matchmaker_gamemodes: [] as string[],
	matchmaker_minPlayers: 1,
	matchmaker_maxPlayers: 6,
	matchmaker_minRemainingTime: 120,
	hideAds: 'hide',
	customFilters: false,
	regionTimezones: false
};


if (!existsSync(swapperPath)) mkdirSync(swapperPath, { recursive: true });
if (!existsSync(userscriptsPath)) mkdirSync(userscriptsPath, { recursive: true });
if (!existsSync(userscriptTrackerPath)) writeFileSync(userscriptTrackerPath, '{}', { encoding: 'utf-8' });
if (!existsSync(filtersPath)) {
	writeFileSync(filtersPath,
		`# Welcome to the filters file! Filters follow the URL pattern format:
# https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns
# Hashtags are used for comments, and each line is a new filter.
# Here's an example of a filter that blocks the cosmetic bundle popup audio:
# *://assets.krunker.io/sound/bundle_*.mp3*
`);
}

// Before we can read the settings, we need to make sure they exist, if they don't, then we create a template
if (!existsSync(settingsPath)) writeFileSync(settingsPath, JSON.stringify(settingsSkeleton, null, 2), { encoding: 'utf-8', flag: 'wx' });

const userPrefs = settingsSkeleton;
Object.assign(userPrefs, JSON.parse(readFileSync(settingsPath, { encoding: 'utf-8' })));

// convert legacy settings files to newer formats
let modifiedSettings = false;

// initially, fullscreen was a true/false, now it's "windowed", "fullscreen" or "borderless"
if (typeof userPrefs.fullscreen === 'boolean') {
	modifiedSettings = true;
	if (userPrefs.fullscreen === true) userPrefs.fullscreen = 'fullscreen'; else userPrefs.fullscreen = 'windowed';
}

// initially, hideAds was a true/false, now it's "block", "hide" or "off"
if (typeof userPrefs.hideAds === 'boolean') {
	modifiedSettings = true;
	if (userPrefs.hideAds === true) userPrefs.hideAds = 'hide'; else userPrefs.hideAds = 'off';
}
if (modifiedSettings) writeFileSync(settingsPath, JSON.stringify(userPrefs, null, 2), { encoding: 'utf-8' });

let mainWindow: BrowserWindow;
let socialWindowReference: BrowserWindow;

ipcMain.on('logMainConsole', (event, data) => { console.log(data); });


ipcMain.on('initializeUserscripts', () => {
	mainWindow.webContents.send('main_initializes_userscripts', userscriptsPath, __dirname);
});
ipcMain.on('settingsUI_requests_userPrefs', () => {
	mainWindow.webContents.send('m_userPrefs_for_settingsUI', settingsPath, userPrefs);
});

ipcMain.on('matchmaker_requests_userPrefs', () => {
	mainWindow.webContents.send('matchmakerRedirect', userPrefs);
});

ipcMain.on('settingsUI_updates_userPrefs', (event, data) => {
	Object.assign(userPrefs, data);
});

ipcMain.on('openExternal', (event, url: string) => { shell.openExternal(url); });

const $assets = pathResolve(__dirname, '..', 'assets');
const hideAdsCSS = readFileSync(pathJoin($assets, 'hideAds.css'), { encoding: 'utf-8' });

function customGenericWin(url: string, providedMenuTemplate: (MenuItemConstructorOptions | MenuItem)[], addAdditionalSubmenus = true) {
	const genericWin = new BrowserWindow({
		autoHideMenuBar: true,
		show: false,
		width: 1600,
		height: 900,
		center: true,
		webPreferences: {
			spellcheck: false,
			enableRemoteModule: false,
			nodeIntegration: false
		} as Electron.WebPreferences
	});

	const injectablePosition = process.platform === 'darwin' ? 1 : 0; 
	const { submenu } = providedMenuTemplate[injectablePosition];

	if (addAdditionalSubmenus && Array.isArray(submenu)) {
		providedMenuTemplate[injectablePosition].submenu = submenu.concat([
			{ label: 'Copy current url to clipboard', accelerator: 'F7', click: () => { clipboard.writeText(genericWin.webContents.getURL()); } },
			{ label: 'Debug: Display original url', accelerator: 'CommandOrControl+F1', click: () => { dialog.showMessageBoxSync(genericWin, { message: url }); } },
			{ type: 'separator' },
			{
				label: 'Go to previous page (Go Back)',
				registerAccelerator: false,
				click: () => {
					if (genericWin.webContents.canGoBack()) genericWin.webContents.goBack();
				}
			},
			{
				label: 'Go to next page (Go Forward)',
				registerAccelerator: false,
				click: () => {
					if (genericWin.webContents.canGoForward()) genericWin.webContents.goForward();
				}
			},
			{ type: 'separator' },
			...constructDevtoolsSubmenu(genericWin, userPrefs.alwaysWaitForDevTools || null)
		]);
	}

	const thisMenu = Menu.buildFromTemplate(providedMenuTemplate);

	genericWin.setMenu(thisMenu);
	genericWin.setMenuBarVisibility(false);
	genericWin.loadURL(url);

	genericWin.once('ready-to-show', () => {
		if (userPrefs.hideAds === 'hide' || userPrefs.hideAds === 'block') genericWin.webContents.insertCSS(hideAdsCSS);
		genericWin.show();
	});
	if (userPrefs.hideAds === 'hide' || userPrefs.hideAds === 'block') {
		// re-inject hide ads even when going back and forth in history
		genericWin.webContents.on('did-navigate', () => { genericWin.webContents.insertCSS(hideAdsCSS); });
	}
	genericWin.once('close', () => { genericWin.destroy(); });

	return genericWin;
}

applyCommandLineSwitches(userPrefs);

if (userPrefs.resourceSwapper) {
	protocol.registerSchemesAsPrivileged([ {
		scheme: 'krunker-resource-swapper',
		privileges: {
			secure: true,
			corsEnabled: true,
			bypassCSP: true
		}
	} ]);
}

app.on('ready', () => {
	app.setAppUserModelId(process.execPath);

	if (userPrefs.resourceSwapper) protocol.registerFileProtocol('krunker-resource-swapper', (request, callback) => callback(decodeURI(request.url.replace(/krunker-resource-swapper:/u, ''))));

	const mainWindowProps: BrowserWindowConstructorOptions = {
		show: false,
		width: 1600,
		height: 900,
		center: true,
		webPreferences: {
			preload: pathJoin(__dirname, 'preload.js'),
			enableRemoteModule: false,
			spellcheck: false,
			nodeIntegration: false
		},
		backgroundColor: '#000000'
	};

	switch (userPrefs.fullscreen) {
		case 'fullscreen':
			mainWindowProps.fullscreen = true;
			break;
		case 'borderless': {
			const dimensions = screen.getPrimaryDisplay().bounds;
			const borderlessProps: BrowserWindowConstructorOptions = {
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
		case 'windowed':
		default:
			mainWindowProps.fullscreen = false;
			break;
	}

	mainWindow = new BrowserWindow(mainWindowProps);
	if (userPrefs.fullscreen === 'borderless') mainWindow.moveTop();

	mainWindow.on('ready-to-show', () => {
		if (userPrefs.fullscreen === 'maximized' && !mainWindow.isMaximized()) mainWindow.maximize();
		if (!mainWindow.isVisible()) mainWindow.show();
		const filter: WebRequestFilter = { urls: [] };
		const blockFilters = [
			'*://*.pollfish.com/*',
			'*://www.paypalobjects.com/*',
			'*://fran-cdn.frvr.com/prebid*',
			'*://fran-cdn.frvr.com/gpt_*',
			'*://c.amazon-adsystem.com/*',
			'*://fran-cdn.frvr.com/pubads_*',
			'*://platform.twitter.com/*',
			'*://cookiepro.com/*',
			'*://*.cookiepro.com/*',
			'*://www.googletagmanager.com/*',
			'*://storage.googleapis.com/pollfish_production/*',
			'*://krunker.io/libs/frvr-channel-web*',
			'*://apis.google.com/js/platform.js',
			'*://imasdk.googleapis.com/*'
		];
		if (userPrefs.hideAds === 'block') filter.urls.push(...blockFilters);
		if (userPrefs.customFilters) {
			let conf = readFileSync(filtersPath, 'utf8').split('\n');

			for (let i = 0; i < conf.length; i++) conf[i] = conf[i].split('#')[0];
			conf = conf.filter(line => line.trim().length > 0);
			for (const item of conf) filter.urls.push(item);
		}
		mainWindow.webContents.session.webRequest.onBeforeRequest(filter, (details, callback) => {
			if (userPrefs.hideAds !== 'block') {
				callback({ cancel: false });
				return;
			}
			console.log(`Blocked ${details.url}`);
			callback({ cancel: true });
		});

		if (mainWindow.webContents.getURL().endsWith('dummy.html')) { mainWindow.loadURL('https://krunker.io'); return; }

		mainWindow.webContents.send('injectClientCSS', userPrefs, app.getVersion()); // tell preload to inject settingcss and splashcss + other

		if (userPrefs.discordRPC) {
			// eslint-disable-next-line
			const DiscordRPC = require('discord-rpc');
			const rpc = new DiscordRPC.Client({ transport: 'ipc' });
			const startTimestamp = new Date();
			const clientId = '988529967220523068';

			// eslint-disable-next-line no-inner-declarations
			function updateRPC({ details, state }: RPCargs) {
				const data = {
					details,
					state,
					startTimestamp,
					largeImageKey: 'logo',
					largeImageText: 'Playing Krunker',
					instance: true
				};
				if (userPrefs.extendedRPC) {
					Object.assign(data, {
						buttons: [
							{ label: 'Github', url: 'https://github.com/KraXen72/crankshaft' },
							{ label: 'Discord Server', url: 'https://discord.gg/ZeVuxG7gQJ' }
						]
					});
				}
				rpc.setActivity(data);
			}

			rpc.login({ clientId }).catch(console.error); // login to the RPC
			mainWindow.webContents.send('initDiscordRPC'); // tell preload to init rpc
			ipcMain.on('preload_updates_DiscordRPC', (event, data: RPCargs) => { updateRPC(data); });
		}
	});

	mainWindow.once('ready-to-show', () => {
		mainWindow.webContents.send('checkForUpdates', app.getVersion());
		mainWindow.webContents.on('did-finish-load', () => mainWindow.webContents.send('main_did-finish-load', userPrefs));
	});

	mainWindow.loadFile(pathJoin($assets, 'dummy.html'));

	if (userPrefs.logDebugToConsole) {
		console.log('GPU INFO BEGIN');
		app.getGPUInfo('complete').then(completeObj => {
			console.dir(completeObj);
		});

		console.log('GPU FEATURES BEGIN');
		console.dir(app.getGPUFeatureStatus());
	}

	/** submenu for in-game shortcuts */
	const gameSubmenu: (MenuItemConstructorOptions | MenuItem) = {
		label: 'Game',
		submenu: [
			{ label: 'Reload this game', accelerator: 'F5', click: () => { mainWindow.reload(); } },
			{
				label: 'Find new Lobby',
				accelerator: 'F6',
				click: () => {
					if (userPrefs.matchmaker && userPrefs.matchmaker_F6) mainWindow.webContents.send('matchmakerRedirect', userPrefs);
					else mainWindow.loadURL('https://krunker.io');
				}
			},
			{ label: 'Copy game link to clipboard', accelerator: 'F7', click: () => { clipboard.writeText(mainWindow.webContents.getURL()); } },
			{
				label: 'Join game link from clipboard',
				accelerator: 'CommandOrControl+F7',
				click: () => {
					const copiedText = clipboard.readText();
					if (copiedText.includes('https://krunker.io/?game')) mainWindow.webContents.loadURL(copiedText);
				}
			},
			{ type: 'separator' },
			...constructDevtoolsSubmenu(mainWindow, userPrefs.alwaysWaitForDevTools || null)
		]
	};

	if (process.platform !== 'darwin') csMenuTemplate.push({ label: 'About', submenu: aboutSubmenu });

	const csMenu = Menu.buildFromTemplate([...macAppMenuArr, gameSubmenu, ...csMenuTemplate]);
	const strippedMenuTemplate = [...macAppMenuArr, genericMainSubmenu, ...csMenuTemplate];

	Menu.setApplicationMenu(csMenu);

	mainWindow.setMenu(csMenu);
	mainWindow.setAutoHideMenuBar(true);
	mainWindow.setMenuBarVisibility(false);

	mainWindow.webContents.on('new-window', (event, url) => {
		console.log('url trying to open:', url, 'socialWindowReference:', typeof socialWindowReference);
		const freeSpinHostnames = ['youtube.com', 'twitch.tv', 'twitter.com', 'reddit.com', 'discord.com', 'accounts.google.com', 'instagram.com'];

		// sanity check, if social window is destroyed but the reference still exists
		if (typeof socialWindowReference !== 'undefined' && socialWindowReference.isDestroyed()) socialWindowReference = void 0;

		if (url.includes('https://krunker.io/social.html') && typeof socialWindowReference !== 'undefined') {
			event.preventDefault();
			socialWindowReference.loadURL(url); // if a designated socialWindow exists already, just load the url there
		} else if (freeSpinHostnames.some(fsUrl => url.includes(fsUrl))) {
			const pick = dialog.showMessageBoxSync({
				title: 'Opening a new url',
				noLink: false,
				message: `You're trying to open ${url}`,
				buttons: ['Open in default browser', 'Open as a new window in client', 'Open in this window', "Don't open"]
			});
			switch (pick) {
				case 0: 
					event.preventDefault();
					shell.openExternal(url);
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

		} else if (url.includes('comp.krunker.io')
			|| url.startsWith('https://krunker.io/?game')
			|| url.startsWith('https://krunker.io/?play')
			|| (url.includes('?game=') && url.includes('&matchId='))
		) {
			event.preventDefault();
			mainWindow.loadURL(url);
		} else { 
			event.preventDefault();
			console.log(`genericWindow created for ${url}`, socialWindowReference);
			const genericWin = customGenericWin(url, strippedMenuTemplate);
			event.newGuest = genericWin;

			if (url.includes('https://krunker.io/social.html')) {
				socialWindowReference = genericWin;
				// eslint-disable-next-line no-void
				genericWin.on('close', () => { socialWindowReference = void 0; });

				genericWin.webContents.on('will-navigate', (evt, willnavUrl) => { 
					if (willnavUrl.includes('https://krunker.io/social.html')) {
						genericWin.loadURL(willnavUrl);
					} else {
						evt.preventDefault();
						shell.openExternal(willnavUrl);
					}
				});
			}
		}
	});

	if (userPrefs.resourceSwapper) {
		const CrankshaftSwapInstance = new Swapper(mainWindow, swapperPath);
		CrankshaftSwapInstance.start();
	}
});

// eslint-disable-next-line consistent-return
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') return app.quit();
});
