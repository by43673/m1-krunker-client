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
var matchmaker_exports = {};
__export(matchmaker_exports, {
  MATCHMAKER_GAMEMODES: () => MATCHMAKER_GAMEMODES,
  MATCHMAKER_REGIONS: () => MATCHMAKER_REGIONS,
  fetchGame: () => fetchGame
});
module.exports = __toCommonJS(matchmaker_exports);
var import_preload = require("./preload");
var import_utils = require("./utils");
const MATCHMAKER_GAMEMODES = ["Free for All", "Team Deathmatch", "Hardpoint", "Capture the Flag", "Parkour", "Hide & Seek", "Infected", "Race", "Last Man Standing", "Simon Says", "Gun Game", "Prop Hunt", "Boss Hunt", "Classic FFA", "Deposit", "Stalker", "King of the Hill", "One in the Chamber", "Trade", "Kill Confirmed", "Defuse", "Sharp Shooter", "Traitor", "Raid", "Blitz", "Domination", "Squad Deathmatch", "Kranked FFA", "Team Defender", "Deposit FFA", "Chaos Snipers", "Bighead FFA"];
const MATCHMAKER_REGIONS = ["MBI", "NY", "FRA", "SIN", "DAL", "SYD", "MIA", "BHN", "TOK", "BRZ", "AFR", "LON", "CHI", "SV", "STL", "MX"];
function getGameMode(num) {
  return MATCHMAKER_GAMEMODES[num];
}
function matchmakerMessageText(game, meeting, all) {
  return `Game found! ${game.gameID} (${meeting}/${all} games meet criteria)
	
	Region: ${game.region}
	Map: ${game.map}
	Gamemode: ${game.gamemode}
	Players: ${game.playerCount}/${game.playerLimit}
	Time remaining: ${(0, import_utils.secondsToTimestring)(game.remainingTime)}
	
	Join game?`;
}
async function fetchGame(_userPrefs) {
  const criteria = {
    regions: _userPrefs.matchmaker_regions,
    gameModes: _userPrefs.matchmaker_gamemodes,
    minPlayers: _userPrefs.matchmaker_minPlayers,
    maxPlayers: _userPrefs.matchmaker_maxPlayers,
    minRemainingTime: _userPrefs.matchmaker_minRemainingTime
  };
  const response = await fetch(`https://matchmaker.krunker.io/game-list?hostname=${window.location.hostname}`);
  const result = await response.json();
  const games = [];
  for (const game of result.games) {
    const gameID = game[0];
    const region = gameID.split(":")[0];
    const playerCount = game[2];
    const playerLimit = game[3];
    const map = game[4].i;
    const gamemode = getGameMode(game[4].g);
    const remainingTime = game[5];
    if (!criteria.regions.includes(region) || !criteria.gameModes.includes(gamemode) || playerCount < criteria.minPlayers || playerCount > criteria.maxPlayers || remainingTime < criteria.minRemainingTime || playerCount === playerLimit || window.location.href.includes(gameID))
      continue;
    games.push({ gameID, region, playerCount, playerLimit, map, gamemode, remainingTime });
  }
  if (games.length > 0) {
    const game = games[Math.floor(Math.random() * games.length)];
    if (confirm(matchmakerMessageText(game, games.length, result.games.length)))
      window.location.href = `https://krunker.io/?game=${game.gameID}`;
  } else {
    alert("Couldn't find any games matching your criteria. Please change them or try again later.");
    import_preload.strippedConsole.log(criteria);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MATCHMAKER_GAMEMODES,
  MATCHMAKER_REGIONS,
  fetchGame
});
