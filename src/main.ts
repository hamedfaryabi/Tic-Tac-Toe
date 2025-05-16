import './style.css'

type Player = 'x' | 'o' | null;

const board = document.getElementById("board") as HTMLDivElement;
const sections = document.querySelectorAll('.section') as NodeListOf<HTMLDivElement>;
const gameOver = document.getElementById("game-over") as HTMLDivElement;
const gameOverText = document.getElementById("game-over-text") as HTMLDivElement;
const restartButton = document.getElementById("restart-button") as HTMLButtonElement;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]


const state = {
  initialPlayer: 'x' as 'x' | 'o',
  player: 'x' as 'x' | 'o',
  gameOver: false,
  winner: null as Player,
  board: Array(9).fill(null) as Player[],
  wins: {
    x: 0,
    o: 0
  }
}


restartButton.addEventListener('click', (event) => {
  event.preventDefault();

  const nextPlayer = state.initialPlayer === 'x' ? 'o' : 'x';

  state.player = nextPlayer;
  board.classList = nextPlayer;
  state.initialPlayer = nextPlayer;


  state.gameOver = false;
  state.winner = null;
  state.board = Array(9).fill(null);

  gameOverText.innerHTML = "";
  gameOver.style.display = 'none';

  sections.forEach((section) => {
    section.classList.remove('x', 'o');
  })
})

sections.forEach((section) => {
  section.addEventListener('click', (event) => {
    event.preventDefault();
    const index = section.dataset.index as string;
    if (state.board[+index]) return;
    handleClick(section);
  })
})

function handleClick(section: HTMLDivElement) {
  const index = section.dataset.index;
  if (!index || state.gameOver) return;

  state.board[+index] = state.player;
  section.classList.add(state.player);

  setTimeout(() => {
    if (hasWinner()) {
      state.gameOver = true;
      state.winner = state.player;
      updateWins();
      handleGameOver();
    } else if (isFull()) {
      state.gameOver = true;
      state.winner = null;
      handleGameOver();
    } else {
      state.gameOver = false;
      state.winner = null;

      switchPlayer();
    }
  })
}

function hasWinner(): boolean {
  const currentIsWinner = winningCombinations.some((combination) => {
    return combination.every((index) => state.board[index] === state.player);
  })
  return currentIsWinner;
}

function updateWins() {
  const winnerWins = state.wins[state.player] + 1;
  state.wins[state.player] = winnerWins;

  const winnerSpan = document.getElementById(`${state.player}-score`) as HTMLSpanElement;
  winnerSpan.innerHTML = winnerWins.toString();
}

function isFull(): boolean {
  return state.board.every((item) => item !== null);
}

function switchPlayer() {
  // next player
  const nextPlayer = state.player === 'x' ? 'o' : 'x';
  state.player = nextPlayer;
  board.classList.remove('x', 'o');
  board.classList.add(nextPlayer);
}

function handleGameOver() {
  if (state.winner) {
    gameOverText.innerHTML = `Player <span class="player ${state.winner}">${state.winner.toUpperCase()}</span> wins!`;
  } else {
    gameOverText.innerHTML = '<span class="draw">Draw!</span>';
  }

  gameOver.style.display = 'flex';
}
