# This is a krunker client modified for native m1 mac arm. Everything is crankshaft copy except flags I added to fix hireg issues. To download, go to releases and then install the dmg from the google drive link. 
 Feel free to look at switches.ts for the flags I used. 
 FYI: Electron version I used(for crankshaft): electron-nightly@12.0.0-nightly.20201116. 
 One issue right now is that the csgo custom game in krunker doesn't seem to work. This seems like a chromium bug(specifically chromium 88) where if I use disable-blink-features=LayoutNGFragmentItem, there is a "Oh Snap!" issue. 
 
 I tried to use electron 12(chromium 89) with disable-blink-features=CompositeSVG for LaF. Pls tell me if it worked.
 
Use third party software such as usb overdrive to keybind to fix aim freeze. No flags atm to fix this(impossible to fix with flags)
Here is an example on how to do it: bind left click to m5 and bind m5 to left click. In krunker, set shoot to m5(which is actually u left clicking but krunker thinks it is m5)

# if u get this app is damaged error: open terminal -> type this in: xattr -cr /Applications/Appname.app
ex:
if crankshaft: if idkr-> xattr -cr /Applications/crankshaft.app

