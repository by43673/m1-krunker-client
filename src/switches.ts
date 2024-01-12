import { app } from 'electron';

/// <reference path="global.d.ts" />

/** applies command line switches to the app based on the passed userprefs */
export function applyCommandLineSwitches(userPrefs: UserPrefs) {
    const switches: { [key: string]: string[] } = {
        safeFlags_removeUselessFeatures: [
            'disable-breakpad',
            'autoplay-policy=no-user-gesture-required',
            'disable-print-preview',
            'disable-2d-canvas-clip-aa',
            'disable-logging',
            'disable-hang-monitor',
            'disable-component-update'
        ],
        safeFlags_helpfulFlags: [
            'disable-background-timer-throttling',
            'disable-renderer-backgrounding'
        ],
        experimentalFlags_increaseLimits: [
	     'renderer-process-limit',
	     'max-active-webgl-contexts=100',
	     'webrtc-max-cpu-consumption-percentage=100'
	],
        experimentalFlags_lowLatency: [
            'enable-highres-timer',
            'enable-quic',
            'ignore-gpu-blocklist'
        ],
        experimentalFlags_experimental: [
	    'use-gl=angle',
            'enable-features=DefaultPassthroughCommandDecoder'
	],
        safeFlags_gpuRasterizing: [
            'enable-gpu-rasterization',
            'enable-oop-rasterization',
            'disable-zero-copy'
        ],
        fpsUncap: [
            'disable-frame-rate-limit',
            'disable-gpu-vsync',
            'disable-blink-features=ExperimentalIsInputPending',
            'disable-blink-features=CompositeSVG',
            'disable-blink-features=CompositeRelativeKeyframes',
            'disable-blink-features=LayoutNGFragmentItem',
            'disable-blink-features=LayoutNGFieldset',
            'disable-blink-features=LayoutNGForControls',
            'disable-blink-features=LayoutNGLayoutOverflow',
            'disable-blink-features=LayoutNGWebkitBox',
            'disable-blink-features=TableCellNewPercents',
            'disable-features=UsePreferredIntervalForVideo',
            'disable-features=ParentNodeReplaceChildren',
            'disable-features=FontPreloadingDelaysRendering',
            'disable-features=AlignFontDisplayAutoTimeoutWithLCPGoal',
            'disable-features=DecodeJpeg420ImagesToYUV',
            'disable-blink-features=CSSFocusVisible',
            'disable-blink-features=CSSFontMetricsOverride',
            'disable-blink-features=CSSMarkerPseudoElement',
            'disable-blink-features=CSSOMViewScrollCoordinates',
            'disable-blink-features=CSSAspectRatioProperty',
            'disable-blink-features=FlexAspectRatio',
            'disable-blink-features=CSSKeyframesMemoryReduction',
            'disable-blink-features=CSSPseudoIs',
            'disable-blink-features=CSSPseudoWhere',
            'disable-blink-features=CSSReducedFontLoadingLayoutInvalidations',
            'disable-features=CompressParkableStrings',
            'disable-features=ParkableStringsToDisk',
            'disable-features=CompositeCrossOriginIframes',
            'disable-features=VaapiVP9Encoder',
            'disable-features=MediaCapabilitiesQueryGpuFactories'
        ]
    };

    for (const switchType in switches) {
        if (userPrefs[switchType]) {
            switches[switchType].forEach((switchItem) => {
                app.commandLine.appendSwitch(switchItem);
            });
        }
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
