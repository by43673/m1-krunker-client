# This is a krunker client modified for native m1 mac arm. Everything is crankshaft copy except flags I added to fix hireg issues. To download, go to releases and then install the dmg from the google drive link. 
# Important!!!!
Currently, there is an issue with the electron version I am using. Feel free to check my LaF mac client for alternatives. If you want to use crankshaft and experiment, try replacing electron with npm remove electron && npm install electron@12.0.0-beta.24 and change the flags to 

app.commandLine.appendSwitch('disable-features', 'UsePreferredIntervalForVideo');
app.commandLine.appendSwitch('disable-features', 'FragmentItem'); 
app.commandLine.appendSwitch('disable-features', 'LayoutNGFieldset'); 
app.commandLine.appendSwitch('disable-features', 'EditingNG'); 
app.commandLine.appendSwitch('disable-blink-features', 'CompositeSVG'); 

instead of these: 

app.commandLine.appendSwitch('disable-features', 'UsePreferredIntervalForVideo');
app.commandLine.appendSwitch('disable-features', 'LayoutNGFieldset');
app.commandLine.appendSwitch('disable-blink-features', 'LayoutNGFragmentItem');
app.commandLine.appendSwitch('disable-blink-features', 'EditingNG');

 Feel free to look at switches.ts for the flags I used. 
 FYI: Electron version I used(for crankshaft) initially: electron-nightly@12.0.0-nightly.20201116. 

It is a good electron version if one can fix the black screen issue. Currently, I fixed it by blocking all ad filters in crankshaft settings but to do that one needs to install x64 version of crankshaft in the original crankshaft page, then turn on the block all ad filters settings from an old version of crankshaft(prob like 3 or 2 versions before the most recent one as of oct 15th 2023) and then build the crankshaft app for m1 and replace the x64 version.(this will save the crankshaft setting and thus make the client actually work).

# Important(Yes, again)
Use third party software such as usb overdrive or logitech ghub to keybind to fix aim freeze. No flags atm to fix this(impossible to fix with flags)
Here is an example on how to do it: bind left click to m5 and bind m5 to left click. In krunker, set shoot to m5(which is actually u left clicking but krunker thinks it is m5)

# if u get this app is damaged error: open terminal -> type this in: xattr -cr /Applications/Appname.app
ex:
if crankshaft: if idkr-> xattr -cr /Applications/crankshaft.app

