let currentPlayer = "player1";
let gameOver = false;
let isSoundOn = true;

function playClickSound() {
  if (!isSoundOn) return;
  const sound = document.getElementById("clickSound");
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

function toggleSound() {
  isSoundOn = !isSoundOn;
  const btn = document.getElementById("soundToggleBtn");
  if (btn) btn.innerText = isSoundOn ? "🔊 Sound On" : "🔇 Sound Off";
  playClickSound();
}

function updateTurnText(message = null) {
  const name = localStorage.getItem(currentPlayer) || "Player";
  const turnText = document.getElementById("turnInfo");
  if (turnText) {
    turnText.innerText = message ? message : `Turn: ${name}`;
  }
}

function switchTurn() {
  currentPlayer = currentPlayer === "player1" ? "player2" : "player1";
  updateTurnText();
}

function goToGame() {
  document.querySelector(".firstpage").style.display = "none";
  document.querySelector(".secondpage").style.display = "block";
  document.querySelector(".gamepage").style.display = "none";
  document.getElementById("settingsModal").style.display = "none";
  document.querySelector(".setting-box").style.display = "none";
  restartGame();
}

function closewinner() {
  document.querySelector(".gamepage").style.display = "none";
  document.querySelector(".firstpage").style.display = "block";
  document.querySelector(".winnerpage").style.display = "none";
  restartGame();
}

function startGame() {
  const p1 = document.getElementById("player1").value.trim() || "Player 1";
  const p2 = document.getElementById("player2").value.trim() || "Player 2";
  localStorage.setItem("player1", p1);
  localStorage.setItem("player2", p2);

  currentPlayer = "player1";
  document.querySelector(".secondpage").style.display = "none";
  document.querySelector(".gamepage").style.display = "flex";
  updateTurnText();
}

function goBack() {
  document.querySelector(".secondpage").style.display = "none";
  document.querySelector(".firstpage").style.display = "block";
  document.querySelector(".gamepage").style.display = "none";
  document.getElementById("settingsModal").style.display = "none";
}

function goHome() {
  document.querySelector(".gamepage").style.display = "none";
  document.querySelector(".firstpage").style.display = "block";
  document.getElementById("settingsModal").style.display = "none";
  restartGame();
}

function openSettings(event) {
  event.stopPropagation();

  document.getElementById("settingsModal").style.display = "flex";

  const soundBtn = document.getElementById("soundToggleBtn");
  if (soundBtn) {
    soundBtn.innerText = isSoundOn ? "🔊 Sound On" : "🔇 Sound Off";
  }
}

function closeSettings() {
  document.getElementById("settingsModal").style.display = "none";
}

function restartGame() {
  closeSettings();

  document.querySelectorAll(".boxtext").forEach((box) => (box.innerText = ""));
  document
    .querySelectorAll(".box")
    .forEach((box) => box.classList.remove("win"));

  const line = document.getElementById("win-line");
  if (line) line.style.display = "none";

  gameOver = false;
  currentPlayer = "player1";
  updateTurnText();
}

function restartGameFromWinner() {
  playClickSound();
  document.querySelector(".winnerpage").style.display = "none";
  document.querySelector(".loser-name").style.display = "block";
  restartGame();
}

function checkWinner() {
  const boxes = document.querySelectorAll(".boxtext");
  const boxDivs = document.querySelectorAll(".box");
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    const valA = boxes[a].innerText;
    const valB = boxes[b].innerText;
    const valC = boxes[c].innerText;

    if (valA && valA === valB && valB === valC) {
      gameOver = true;
      const winner =
        valA === "O"
          ? localStorage.getItem("player1")
          : localStorage.getItem("player2");
      const loser =
        valA === "O"
          ? localStorage.getItem("player2")
          : localStorage.getItem("player1");

      [a, b, c].forEach((i) => boxDivs[i].classList.add("win"));
      fireConfetti();

      document.getElementById("winnerName").innerText = winner;
      document.getElementById("loserName").innerText = loser;
      document.querySelector(".winnerpage").style.display = "flex";
      return true;
    }
  }

  const allFilled = [...boxes].every((box) => box.innerText !== "");
  if (allFilled) {
    gameOver = true;
    document.getElementById(
      "winnerMessage"
    ).innerHTML = `<span id="winnerName">It's a Draw!</span>`;
    document.querySelector(".loser-name").style.display = "none";
    document.querySelector(".winnerpage").style.display = "flex";
    return true;
  }

  return false;
}

function fireConfetti() {
  confetti({
    particleCount: 500,
    spread: 1000,
    origin: { y: 0.6 },
  });
}

window.onload = function () {
  updateTurnText();

  const boxes = document.querySelectorAll(".box");
  boxes.forEach((box) => {
    box.addEventListener("click", () => {
      if (gameOver) return;

      const boxText = box.querySelector(".boxtext");
      if (boxText.innerText === "") {
        playClickSound();
        boxText.innerText = currentPlayer === "player1" ? "O" : "X";
        if (!checkWinner()) {
          switchTurn();
        }
      }
    });
  });
};
