"use strict";

let yargs = require("yargs");

/**
 * Append the correct CLI Switches to
 * the underlying Chrome instance
 *
 * @param {import("electron").App} app
 * @param {import("electron-store")} config
 */
let cliSwitchHandler = function(app, config) {
	const angleBackend = /** @type {string} */ (config.get("angleBackend", "default"));
	const colorProfile = /** @type {string} */ (config.get("colorProfile", "default"));

	app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

	if (!config.get("acceleratedCanvas", true)) app.commandLine.appendSwitch("disable-accelerated-2d-canvas", "true");
	if (config.get("disableFrameRateLimit", true)) {
		app.commandLine.appendSwitch("disable-frame-rate-limit");
		app.commandLine.appendSwitch("disable-oop-rasterization");
		app.commandLine.appendSwitch("disable-oop-rasterization-ddl");
		app.commandLine.appendSwitch("disable-pixel-canvas-recording");
		app.commandLine.appendSwitch("disable-gpu-vsync");
		app.commandLine.appendSwitch("disable-skia-renderer");
		app.commandLine.appendSwitch('disable-features', 'ForcePreferredIntervalForVideo');
		app.commandLine.appendSwitch('disable-features', 'UsePreferredIntervalForVideo');
		app.commandLine.appendSwitch('disable-print-preview');
		app.commandLine.appendSwitch('disable-metrics-repo');
		app.commandLine.appendSwitch('disable-metrics');
		app.commandLine.appendSwitch('disable-logging');
		app.commandLine.appendSwitch('disable-hang-monitor');
		app.commandLine.appendSwitch('disable-component-update');
		app.commandLine.appendSwitch('enable-javascript-harmony');
		app.commandLine.appendSwitch('enable-future-v8-vm-features');
		app.commandLine.appendSwitch('disable-background-timer-throttling');
		app.commandLine.appendSwitch('disable-renderer-backgrounding');
		app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
		app.commandLine.appendSwitch('renderer-process-limit', '100');
		app.commandLine.appendSwitch('disable-low-end-device-mode');
		app.commandLine.appendSwitch('enable-native-gpu-memory-buffers');
		app.commandLine.appendSwitch('high-dpi-support', '1');
		app.commandLine.appendSwitch('no-pings');
		app.commandLine.appendSwitch('enable-quic');
		app.commandLine.appendSwitch('ignore-gpu-blocklist');
		app.commandLine.appendSwitch('enable-highres-timer');
		app.commandLine.appendSwitch("disable-features", "CanvasOopRasterization");
		app.commandLine.appendSwitch('no-proxy-server');
	}
	if (config.get("inProcessGPU", false)) app.commandLine.appendSwitch("in-process-gpu");
	if (angleBackend !== "default") app.commandLine.appendSwitch("use-angle", angleBackend);
	if (colorProfile !== "default") app.commandLine.appendSwitch("force-color-profile", colorProfile);

	yargs.parse(
		/** @type {string} */
		(config.get("chromiumFlags", "")),
		(_, argv) => Object.entries(argv).slice(1, -1).forEach(entry => app.commandLine.appendSwitch(entry[0], entry[1]))
	);
};

module.exports = cliSwitchHandler;
