
                app.commandLine.appendSwitch("disable-frame-rate-limit");
		app.commandLine.appendSwitch("enable-gpu-rasterization");
		app.commandLine.appendSwitch('disable-features', 'CompositingOptimizations');
		app.commandLine.appendSwitch("disable-oop-rasterization");
		app.commandLine.appendSwitch("disable-zero-copy");
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
		app.commandLine.appendSwitch("disable-gpu-vsync");
		app.commandLine.appendSwitch('no-proxy-server');
         
