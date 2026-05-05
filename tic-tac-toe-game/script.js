const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const xScoreText = document.getElementById("xScore");
const oScoreText = document.getElementById("oScore");

const clickSound = new Audio("assets/click.mp3");
const winSound = new Audio("assets/win.mp3");

let currentPlayer = "X";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];

let xScore = 0;
let oScore = 0;

const winningConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

// USER CLICK
function handleCellClick() {
    const cellIndex = this.getAttribute("data-index");

    if (gameState[cellIndex] !== "" || !gameActive || currentPlayer !== "X") {
        return;
    }

    makeMove(cellIndex, "X");

    if(gameActive){
        setTimeout(computerMove, 500);
    }
}

// COMMON MOVE FUNCTION
function makeMove(index, player){
    gameState[index] = player;
    cells[index].textContent = player;

    clickSound.play();

    if(player === "X"){
        cells[index].classList.add("x-style");
    } else {
        cells[index].classList.add("o-style");
    }

    currentPlayer = player;
    checkWinner();

    if(gameActive){
        currentPlayer = player === "X" ? "O" : "X";
        statusText.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

// COMPUTER RANDOM MOVE
function computerMove(){
    let emptyCells = [];

    gameState.forEach((cell, index) => {
        if(cell === ""){
            emptyCells.push(index);
        }
    });

    if(emptyCells.length === 0) return;

    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    makeMove(randomIndex, "O");
}

// WIN CHECK
function checkWinner() {
    let roundWon = false;
    let winningPattern = [];

    for(let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if(a === "" || b === "" || c === "") {
            continue;
        }

        if(a === b && b === c) {
            roundWon = true;
            winningPattern = winCondition;
            break;
        }
    }

    if(roundWon) {
        statusText.textContent = `Player ${currentPlayer} Wins! 🎉`;
        gameActive = false;
        winSound.play();

        if(currentPlayer === "X"){
            xScore++;
            xScoreText.textContent = `X: ${xScore}`;
        } else {
            oScore++;
            oScoreText.textContent = `O: ${oScore}`;
        }

        winningPattern.forEach(index => {
            cells[index].classList.add("winner");
        });
        return;
    }

    if(!gameState.includes("")) {
        statusText.textContent = "Game Draw! 🤝";
        gameActive = false;
        return;
    }
}

// RESET GAME
function restartGame() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    statusText.textContent = "Player X's Turn";

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winner", "x-style", "o-style");
    });
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
restartBtn.addEventListener("click", restartGame);