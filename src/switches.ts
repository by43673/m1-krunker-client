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
            'enable-javascript-harmony',
	'enable-future-v8-vm-features',
	'enable-webgl', // might be useless since this is default but ensure
	'enable-webgl2-compute-context',
	'disable-background-timer-throttling',
	'disable-renderer-backgrounding'

        ],
        experimentalFlags_increaseLimits: [
            'disable-gpu-driver-bug-workarounds'
        ],
        experimentalFlags_lowLatency: [
            'enable-highres-timer',
            'enable-quic',
            'ignore-gpu-blocklist'
        ],
        experimentalFlags_experimental: [
            'enable-features=BlinkCompositorUseDisplayThreadPriority',
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
            'disable-blink-features=LayoutNGFragmentItem',
            'disable-blink-features=LayoutNGFieldset',
            'disable-blink-features=LayoutNGForControls',
            'disable-blink-features=LayoutNGLayoutOverflow',
            'disable-blink-features=LayoutNGWebkitBox',
            'disable-features=UsePreferredIntervalForVideo',
	    'disable-features=ForcePreferredIntervalForVideo',
	    'disable-features=H264DecoderBufferIsCompleteFrame'
        ]
    };

    for (const [switchType, switchItems] of Object.entries(switches)) {
        if (userPrefs[switchType]) {
            app.commandLine.appendSwitch(...switchItems);
        }
    }

    const angleBackend = userPrefs['angle-backend'];
    if (angleBackend !== 'default') {
        if (angleBackend === 'vulkan') {
            app.commandLine.appendSwitch('use-angle', 'vulkan', 'use-vulkan', '--enable-features=Vulkan');
            console.log('VULKAN INITIALIZED');
        } else {
            app.commandLine.appendSwitch('use-angle', angleBackend as string);
            console.log(`Using Angle: ${angleBackend}`);
        }
    }

    if (userPrefs.inProcessGPU) {
        app.commandLine.appendSwitch('in-process-gpu');
        console.log('In Process GPU is active');
    }
}
