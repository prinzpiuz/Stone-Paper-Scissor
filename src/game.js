export const GAME_CODE_LENGTH = 4;

export const MOVES = ["stone", "paper", "scissors"];

// move -> the move it defeats
const BEATS = {
  stone: "scissors",
  paper: "stone",
  scissors: "paper"
};

export const WIN = 1;
export const DRAW = 0;
export const LOSS = -1;

// Both peers run this on the same pair of moves, so no score has to be sent
// across the wire for the two sides to agree.
export function outcome(mine, theirs) {
  if (mine === theirs) return DRAW;
  return BEATS[mine] === theirs ? WIN : LOSS;
}

export function isMove(value) {
  return MOVES.includes(value);
}

export function randomMove() {
  return MOVES[randomInt(MOVES.length)];
}

const CODE_ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789"; // no 0/1/l/o lookalikes

export function newGameCode() {
  let code = "";
  for (let i = 0; i < GAME_CODE_LENGTH; i += 1) {
    code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return code;
}

export function normalizeGameCode(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function isGameCodeValid(value) {
  const code = normalizeGameCode(value);
  return (
    code.length === GAME_CODE_LENGTH &&
    [...code].every(char => CODE_ALPHABET.includes(char))
  );
}

function randomInt(max) {
  // Rejection sampling keeps every value equally likely; the modulo shortcut
  // would bias towards the start of the alphabet.
  const limit = Math.floor(0xffffffff / max) * max;
  const buffer = new Uint32Array(1);
  let value;
  do {
    crypto.getRandomValues(buffer);
    [value] = buffer;
  } while (value >= limit);
  return value % max;
}
