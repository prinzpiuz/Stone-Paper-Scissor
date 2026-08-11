// How the game's moves are drawn. Kept apart from src/game.js so the rules
// stay free of anything view related.
export const MOVE_COLORS = {
  stone: "red",
  paper: "blue",
  scissors: "green"
};

const MOVE_ICONS = {
  stone: "fa-hand-rock",
  paper: "fa-hand-paper",
  scissors: "fa-hand-scissors"
};

// Solid hand marks the played move, outlined hands are the ones not picked.
export function handClass(move, chosen = null) {
  return `${chosen === move ? "fas" : "far"} ${MOVE_ICONS[move]}`;
}
