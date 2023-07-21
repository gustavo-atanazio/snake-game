const startButton = document.querySelector(".start");
let canvas;
let context;

startButton.addEventListener("click", startGame);

function startGame() {
    createCanvas();
}

function createCanvas() {
    const body = document.querySelector("body");
    body.innerHTML = "";

    body.appendChild(document.createElement("canvas"));

    canvas = document.querySelector("canvas");
    canvas.innerText = "Seu navegador não suporta o jogo.";
    canvas.width = "600";
    canvas.height = "600";
    canvas.id = "game-screen";
    
    context = canvas.getContext("2d");
    context.fillStyle = "#F00";
    context.fillRect(10, 10, 10, 10);
}