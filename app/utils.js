"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var utils_exports = {};
__export(utils_exports, {
  classListSet: () => classListSet,
  createElement: () => createElement,
  debounce: () => debounce,
  hasOwn: () => hasOwn,
  haveSameContents: () => haveSameContents,
  hiddenClassesImages: () => hiddenClassesImages,
  injectSettingsCSS: () => injectSettingsCSS,
  secondsToTimestring: () => secondsToTimestring,
  toggleSettingCSS: () => toggleSettingCSS,
  userscriptToggleCSS: () => userscriptToggleCSS
});
module.exports = __toCommonJS(utils_exports);
var import_electron = require("electron");
var import_preload = require("./preload");
const insertedCSS = {};
const injectSettingsCSS = (css, identifier = "settings") => {
  import_electron.webFrame.insertCSS(css);
};
function createElement(type, options = {}) {
  const element = document.createElement(type);
  Object.entries(options).forEach(([key, value]) => {
    if (key === "class") {
      if (Array.isArray(value))
        value.forEach((cls) => {
          element.classList.add(cls);
        });
      else
        element.classList.add(value);
      return;
    }
    if (key === "dataset") {
      Object.entries(value).forEach((entry) => {
        const [dataKey, dataValue] = entry;
        element.dataset[dataKey] = dataValue;
      });
      return;
    }
    if (key === "text") {
      element.textContent = value;
      return;
    }
    if (key === "innerHTML") {
      element.innerHTML = value;
      return;
    }
    element.setAttribute(key, value);
  });
  return element;
}
function toggleSettingCSS(css, identifier, value = "toggle") {
  function inject() {
    insertedCSS[identifier] = import_electron.webFrame.insertCSS(css);
  }
  function uninject() {
    try {
      import_electron.webFrame.removeInsertedCSS(insertedCSS[identifier]);
      delete insertedCSS[identifier];
    } catch (error) {
      import_preload.strippedConsole.error("couldn't uninject css: ", error);
    }
  }
  if (value === "toggle") {
    if (!(identifier in insertedCSS))
      inject();
    else
      uninject();
  } else if (!(identifier in insertedCSS) && value === true) {
    inject();
  } else if (identifier in insertedCSS && value === false) {
    uninject();
  }
}
function userscriptToggleCSS(css, identifier, value = "toggle") {
  const reservedKeywords = ["menuTimer", "hideAds", "hideReCaptcha"];
  if (!reservedKeywords.includes(identifier))
    toggleSettingCSS(css, identifier, value);
  else
    import_preload.strippedConsole.error(`identifier '${identifier}' is reserved by crankshaft. Try something else.`);
}
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
function hiddenClassesImages(classesCount) {
  const prepend = "menuClassPicker0".slice(0, -1);
  const gaps = 4 * (classesCount - 1);
  const theoreticalButtonSize = Math.round((810 - gaps) / classesCount);
  const buttonSize = Math.min(theoreticalButtonSize, 50);
  let css = `#hiddenClasses [id^="menuClassPicker"] {
		width: ${buttonSize}px; height: ${buttonSize}px;
		background-size: ${buttonSize - 6}px ${buttonSize - 6}px; 
	}
`;
  for (let i = 0; i < classesCount; i++)
    css += `#${prepend}${i} { background-image: url("https://assets.krunker.io/textures/classes/icon_${i}.png"); } 
`;
  return css;
}
function secondsToTimestring(num) {
  const minutes = Math.floor(num / 60);
  const seconds = num % 60;
  if (minutes < 1)
    return `${num}s`;
  return `${minutes}m ${seconds}s`;
}
function haveSameContents(array1, array2) {
  for (const value of /* @__PURE__ */ new Set([...array1, ...array2]))
    if (array1.filter((e) => e === value).length !== array2.filter((e) => e === value).length)
      return false;
  return true;
}
function classListSet(element, value, ...classNames) {
  if (value)
    element.classList.add(...classNames);
  else
    element.classList.remove(...classNames);
}
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  classListSet,
  createElement,
  debounce,
  hasOwn,
  haveSameContents,
  hiddenClassesImages,
  injectSettingsCSS,
  secondsToTimestring,
  toggleSettingCSS,
  userscriptToggleCSS
});
