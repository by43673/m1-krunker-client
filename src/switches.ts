import { app } from 'electron';

/// <reference path="global.d.ts" />

/** applies command line switches to the app based on the passed userprefs */
export function applyCommandLineSwitches(userPrefs: UserPrefs) {
	if (userPrefs.safeFlags_removeUselessFeatures) {
		app.commandLine.appendSwitch('disable-breakpad');
		app.commandLine.appendSwitch('disable-print-preview');
		app.commandLine.appendSwitch('disable-2d-canvas-clip-aa');
		app.commandLine.appendSwitch('disable-logging');
		app.commandLine.appendSwitch('disable-hang-monitor');
		app.commandLine.appendSwitch('disable-component-update');
	}
	if (userPrefs.safeFlags_helpfulFlags) {
		app.commandLine.appendSwitch('disable-background-timer-throttling');
		app.commandLine.appendSwitch('disable-renderer-backgrounding');
	}
	if (userPrefs.experimentalFlags_increaseLimits) {
		app.commandLine.appendSwitch('renderer-process-limit', '100');
		app.commandLine.appendSwitch('max-active-webgl-contexts', '100');
		app.commandLine.appendSwitch('webrtc-max-cpu-consumption-percentage', '100');
	}
	if (userPrefs.experimentalFlags_lowLatency) {
		app.commandLine.appendSwitch('enable-highres-timer');
		app.commandLine.appendSwitch('enable-quic');
		app.commandLine.appendSwitch('ignore-gpu-blocklist');
		app.commandLine.appendSwitch('high-dpi-support', '1');
	}
	if (userPrefs.experimentalFlags_experimental) {
		app.commandLine.appendSwitch('use-cmd-decoder', 'passthrough');
	}
	if (userPrefs.safeFlags_gpuRasterizing) {
		app.commandLine.appendSwitch('enable-gpu-rasterization');
		app.commandLine.appendSwitch('enable-oop-rasterization');
		app.commandLine.appendSwitch('disable-zero-copy');
	}

	if (userPrefs.fpsUncap) {
		app.commandLine.appendSwitch('disable-frame-rate-limit');
		app.commandLine.appendSwitch('disable-gpu-vsync');
		app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
		app.commandLine.appendSwitch('disable-blink-features', 'ExperimentalIsInputPending');	
		app.commandLine.appendSwitch('disable-blink-features', 'CompositeSVG');
		app.commandLine.appendSwitch('disable-blink-features', 'CompositeRelativeKeyframes');
		app.commandLine.appendSwitch('disable-blink-features', 'LayoutNGFragmentItem');
		app.commandLine.appendSwitch('disable-blink-features', 'LayoutNGFieldset');
		app.commandLine.appendSwitch('disable-blink-features', 'LayoutNGForControls');
		app.commandLine.appendSwitch('disable-blink-features', 'LayoutNGLayoutOverflow');
		app.commandLine.appendSwitch('disable-blink-features', 'LayoutNGWebkitBox');
		app.commandLine.appendSwitch('disable-features', 'UsePreferredIntervalForVideo');
		app.commandLine.appendSwitch('disable-features', 'ParentNodeReplaceChildren');
		app.commandLine.appendSwitch('disable-features', 'enable-pixel-canvas-recording');	
		app.commandLine.appendSwitch('disable-features', 'FontPreloadingDelaysRendering');	
		app.commandLine.appendSwitch('disable-features', 'AlignFontDisplayAutoTimeoutWithLCPGoal');
		app.commandLine.appendSwitch('disable-features', 'DecodeJpeg420ImagesToYUV');	
		app.commandLine.appendSwitch('disable-blink-features', 'CSSFocusVisible');
		app.commandLine.appendSwitch('disable-blink-features', 'CSSFontMetricsOverride');
		app.commandLine.appendSwitch('disable-blink-features', 'CSSMarkerPseudoElement');
		app.commandLine.appendSwitch('disable-blink-features', 'CSSOMViewScrollCoordinates');
		app.commandLine.appendSwitch('disable-blink-features', 'CSSAspectRatioProperty');
		app.commandLine.appendSwitch('disable-blink-features', 'CSSKeyframesMemoryReduction');
		app.commandLine.appendSwitch('disable-blink-features', 'CSSPseudoIs');
		app.commandLine.appendSwitch('disable-blink-features', 'CSSPseudoWhere');
		app.commandLine.appendSwitch('disable-blink-features', 'CSSReducedFontLoadingLayoutInvalidations');
		app.commandLine.appendSwitch('disable-blink-features', 'CSSReducedFontLoadingInvalidations');
		app.commandLine.appendSwitch('disable-features', 'VaapiVP9Encoder');
		app.commandLine.appendSwitch('disable-features', 'MediaCapabilitiesQueryGpuFactories');	
		app.commandLine.appendSwitch('disable-features', 'CompressParkableStrings');
		app.commandLine.appendSwitch('disable-features', 'ParkableStringsToDisk');
		app.commandLine.appendSwitch('disable-features', 'CompositeCrossOriginIframes');

	}

	if (userPrefs['angle-backend'] !== 'default') {
		if (userPrefs['angle-backend'] === 'vulkan') {
			app.commandLine.appendSwitch('use-angle', 'vulkan');
			app.commandLine.appendSwitch('use-vulkan');
			app.commandLine.appendSwitch('--enable-features=Vulkan');

			console.log('VULKAN INITIALIZED');
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

