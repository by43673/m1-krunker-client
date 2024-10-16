import { app } from 'electron';

/// <reference path="global.d.ts" />

/** applies command line switches to the app based on the passed userprefs */
export function applyCommandLineSwitches(userPrefs: UserPrefs) {
	if (userPrefs.safeFlags_removeUselessFeatures) {
		app.commandLine.appendSwitch('disable-breakpad');
		app.commandLine.appendSwitch('disable-print-preview');
		app.commandLine.appendSwitch('disable-metrics-repo');
		app.commandLine.appendSwitch('disable-metrics');
		app.commandLine.appendSwitch('disable-2d-canvas-clip-aa');
		app.commandLine.appendSwitch('disable-bundled-ppapi-flash');
		app.commandLine.appendSwitch('disable-logging');
		app.commandLine.appendSwitch('disable-hang-monitor');
		app.commandLine.appendSwitch('disable-component-update');
		console.log('Removed useless features');
	}
	if (userPrefs.safeFlags_helpfulFlags) {
		app.commandLine.appendSwitch('enable-webgl2-compute-context');
		app.commandLine.appendSwitch('enable-future-v8-vm-features');
		app.commandLine.appendSwitch('disable-background-timer-throttling');
		app.commandLine.appendSwitch('disable-renderer-backgrounding');
		app.commandLine.appendSwitch('enable-features', 'BlinkCompositorUseDisplayThreadPriority');
		app.commandLine.appendSwitch('enable-features', 'GpuUseDisplayThreadPriority');
		app.commandLine.appendSwitch('enable-features', 'BrowserUseDisplayThreadPriority');
		app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
		app.commandLine.appendSwitch('disable-features', 'UserInteractiveCompositingMac');
		app.commandLine.appendSwitch('disable-features', 'UsePreferredIntervalForVideo');
		app.commandLine.appendSwitch('use-gl', 'angle');
		app.commandLine.appendSwitch('use-cmd-decoder', 'passthrough');	
		app.commandLine.appendSwitch('enable-passthrough-raster-decoder');
		app.commandLine.appendSwitch('disable-features', 'DefaultEnableOopRasterization'); 
		console.log('Applied helpful flags');
	}
	if (userPrefs.experimentalFlags_increaseLimits) {
		app.commandLine.appendSwitch('renderer-process-limit', '100');
		app.commandLine.appendSwitch('max-active-webgl-contexts', '100');
		app.commandLine.appendSwitch('webrtc-max-cpu-consumption-percentage', '100');
		console.log('Applied flags to increase limits');
	}
	if (userPrefs.experimentalFlags_lowLatency) {
		app.commandLine.appendSwitch('enable-highres-timer');
		app.commandLine.appendSwitch('enable-quic');	
		app.commandLine.appendSwitch('ignore-gpu-blocklist');
		app.commandLine.appendSwitch('quic-max-packet-length', '1460');
		app.commandLine.appendSwitch('high-dpi-support', '1');		
		console.log('Applied latency-reducing flags');
	}
	if (userPrefs.experimentalFlags_experimental) {
		app.commandLine.appendSwitch('use-direct-composition');
		app.commandLine.appendSwitch('enable-features', 'DirectCompositionOverlays'); 
		console.log('Enabled Experiments');
	}
	if (userPrefs.safeFlags_gpuRasterizing) {
		app.commandLine.appendSwitch('enable-gpu-rasterization');
		app.commandLine.appendSwitch('disable-zero-copy');
		app.commandLine.appendSwitch('enable-oop-rasterization');
		console.log('GPU rasterization active');
	}

	if (userPrefs.fpsUncap) {
		app.commandLine.appendSwitch('disable-frame-rate-limit');
		app.commandLine.appendSwitch('disable-gpu-vsync');
		app.commandLine.appendSwitch('max-gum-fps', '9999');
		app.commandLine.appendSwitch('enable-features', 'MainLatencyRecovery'); 
		
		console.log('Removed FPS Cap');
	}

	if (userPrefs['angle-backend'] !== 'default') {
		if (userPrefs['angle-backend'] === 'vulkan') {
			app.commandLine.appendSwitch('use-angle', 'metal');
			console.log('Metal INITIALIZED');
		} else {
			app.commandLine.appendSwitch('use-angle', userPrefs['angle-backend'] as string);

			console.log(`Using Angle: ${userPrefs['angle-backend']}`);
		}
	}

	if (userPrefs.inProcessGPU) {
		app.commandLine.appendSwitch('in-process-gpu');
		console.log('In Process GPU is active');
	}
}
