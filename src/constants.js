// Seconds a player gets to pick a move before one is chosen at random.
export const TIMER = 20;

// How long both hands stay revealed before the next round starts (ms).
export const REVEAL_MS = 3000;

// WebTorrent trackers used for peer discovery. A local tracker is used during
// development so the game works without hitting the public ones.
const PUBLIC_TRACKERS = [
  "wss://tracker.openwebtorrent.com",
  "wss://tracker.btorrent.xyz:443/announce",
  "wss://tracker.novage.com.ua:443/announce",
  "wss://tracker.sloppyta.co:443/announce"
];

const LOCAL_TRACKERS = ["ws://localhost:8085"];

export const GAME_ANNOUNCE_URLS = import.meta.env.DEV
  ? LOCAL_TRACKERS.concat(PUBLIC_TRACKERS)
  : PUBLIC_TRACKERS;
