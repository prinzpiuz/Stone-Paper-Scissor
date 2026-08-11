import { onBeforeUnmount, onMounted, ref } from "vue";
import P2PT from "p2pt";
import { GAME_ANNOUNCE_URLS, REVEAL_MS, TIMER } from "@/constants";
import { DRAW, WIN, isMove, outcome, randomMove } from "@/game";

// Owns the peer connection and the round state machine. Components only read
// the refs it returns and call submitMove; nothing about the wire protocol or
// the timers leaks into a template.
export function useP2PGame({ gameCode, playerName, onOpponentName }) {
  const timeLeft = ref(TIMER);
  const timedOut = ref(false);
  const opponentConnected = ref(false);
  const peerLost = ref(false);
  const myScore = ref(0);
  const opponentScore = ref(0);
  const myMove = ref(null);
  const opponentMove = ref(null);
  const revealed = ref(false);

  let p2pt = null;
  let peer = null;
  let tickHandle = null;
  let revealHandle = null;
  // Rounds are numbered so a move that arrives while the previous result is
  // still on screen is held back instead of being applied to the wrong round.
  let roundNumber = 0;
  const bufferedMoves = new Map();

  function send(payload) {
    if (!peer) return;
    p2pt.send(peer, JSON.stringify(payload));
  }

  function startRound() {
    clearTimers();
    myMove.value = null;
    // A move for this round may already have arrived during the reveal pause.
    opponentMove.value = bufferedMoves.get(roundNumber) ?? null;
    bufferedMoves.delete(roundNumber);
    revealed.value = false;
    timedOut.value = false;
    timeLeft.value = TIMER;
    tickHandle = setInterval(tick, 1000);
  }

  function tick() {
    timeLeft.value -= 1;
    if (timeLeft.value > 0) return;

    timeLeft.value = 0;
    clearInterval(tickHandle);
    tickHandle = null;
    if (myMove.value === null) {
      timedOut.value = true;
      submitMove(randomMove());
    }
  }

  function submitMove(move) {
    // One move per round, and only once there is somebody to play against.
    if (!opponentConnected.value || revealed.value || myMove.value !== null) {
      return;
    }

    myMove.value = move;
    send({ type: "move", round: roundNumber, move });
    resolveRound();
  }

  function receiveMove(round, move) {
    if (!isMove(move)) return;
    if (round === roundNumber) {
      opponentMove.value = move;
      resolveRound();
    } else if (round > roundNumber) {
      bufferedMoves.set(round, move);
    }
  }

  function resolveRound() {
    if (myMove.value === null || opponentMove.value === null) return;

    clearTimers();
    revealed.value = true;

    // Both peers score the same pair of moves, so the totals stay in sync
    // without either side having to trust a score sent over the wire.
    const result = outcome(myMove.value, opponentMove.value);
    if (result === WIN) myScore.value += 1;
    else if (result !== DRAW) opponentScore.value += 1;

    roundNumber += 1;
    revealHandle = setTimeout(startRound, REVEAL_MS);
  }

  function clearTimers() {
    clearInterval(tickHandle);
    clearTimeout(revealHandle);
    tickHandle = null;
    revealHandle = null;
  }

  function onPeerConnect(connectedPeer) {
    // The room is a two player game: ignore anybody joining after the opponent.
    if (peer && peer !== connectedPeer) return;
    peer = connectedPeer;
    peerLost.value = false;
    send({ type: "hello", name: playerName });
  }

  function onPeerClose(closedPeer) {
    if (closedPeer !== peer) return;
    peer = null;
    opponentConnected.value = false;
    peerLost.value = true;
    clearTimers();
    // The reconnecting peer restarts at round 0, so drop any stale round state.
    roundNumber = 0;
    bufferedMoves.clear();
  }

  function onMessage(fromPeer, raw) {
    if (fromPeer !== peer) return;

    let msg;
    try {
      msg = JSON.parse(raw);
    } catch (e) {
      return;
    }

    if (msg.type === "hello") {
      onOpponentName(String(msg.name || "opponent").slice(0, 32));
      if (!opponentConnected.value) {
        opponentConnected.value = true;
        startRound();
      }
    } else if (msg.type === "move") {
      receiveMove(msg.round, msg.move);
    }
  }

  onMounted(() => {
    p2pt = new P2PT(GAME_ANNOUNCE_URLS, gameCode);
    p2pt.on("peerconnect", onPeerConnect);
    p2pt.on("peerclose", onPeerClose);
    p2pt.on("msg", onMessage);
    p2pt.start();
  });

  onBeforeUnmount(() => {
    clearTimers();
    if (p2pt) p2pt.destroy();
    p2pt = null;
    peer = null;
  });

  return {
    timeLeft,
    timedOut,
    opponentConnected,
    peerLost,
    myScore,
    opponentScore,
    myMove,
    opponentMove,
    revealed,
    submitMove
  };
}
