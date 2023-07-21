const startButton = document.querySelector(".start");

let canvas;
let context;

const snake = [
    {x: 200, y: 200},
    {x: 250, y: 200},
    {x: 300, y: 200}
];

const snakeColors = {
    body: "#E55807",
    head: "#F86F03"
};

const snakeSize = 50;
let direction;

startButton.addEventListener("click", startGame);

function startGame() {
    createCanvas();
    drawGame();
    gameLoop();
}

function createCanvas() {
    const body = document.querySelector("body");
    body.innerHTML = "";

    body.appendChild(document.createElement("canvas"));

    canvas = document.querySelector("canvas");
    canvas.innerText = "Seu navegador não suporta o jogo.";
    canvas.width = "700";
    canvas.height = "700";
    canvas.id = "game-screen";
    
    context = canvas.getContext("2d");
    // context.fillStyle = "#F00";
    // context.fillRect(10, 10, 10, 10);
}

function drawGame() {
    const colors = {
        firstColor: "#54B435",
        secondColor: "#82CD47"
    };

    drawLine(colors.firstColor, colors.secondColor, 0);
    drawLine(colors.secondColor, colors.firstColor, 100);
    drawLine(colors.firstColor, colors.secondColor, 200);
    drawLine(colors.secondColor, colors.firstColor, 300);
    drawLine(colors.firstColor, colors.secondColor, 400);
    drawLine(colors.secondColor, colors.firstColor, 500);
    drawLine(colors.firstColor, colors.secondColor, 600);

    drawSnake();
}

function gameLoop() {
    setInterval(() => {
        console.log("rodando");

        context.clearRect(0, 0, 700, 700);
        
        moveSnake();

        drawGame();
    }, 300);
}

function drawLine(firstColor, secondColor, yPosition) {
    for (let i = 0; i < 8; i++) {
        context.fillStyle = firstColor;
        context.fillRect(i * 200, yPosition, 100, 100);
    }

    for (let i = 0; i < 8; i++) {
        context.fillStyle = secondColor;
        context.fillRect((i * 200) + 100, yPosition, 100, 100);
    }
}

function moveSnake() {
    if (!direction) return;

    const head = snake[snake.length - 1];

    if (direction === "right") {
        snake.push({x: head.x + 50, y: head.y});
    }

    if (direction === "left") {
        snake.push({x: head.x - 50, y: head.y});
    }

    if (direction === "down") {
        snake.push({x: head.x, y: head.y + 50});
    }

    if (direction === "up") {
        snake.push({x: head.x, y: head.y - 50});
    }

    snake.shift();
}

function drawSnake() {
    context.fillStyle = snakeColors.body;

    snake.forEach((position, index) => {
        if (index === snake.length - 1) {
            context.fillStyle = snakeColors.head;
        }

        context.fillRect(position.x, position.y, snakeSize, snakeSize);
    })
}