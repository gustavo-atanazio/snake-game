const body = document.querySelector("body");
const startButton = document.querySelector(".start");
const buttonsContainer = document.querySelector(".arrows-container");

const gameOverElement = document.querySelector('.game-over');
const restartButton = document.querySelector('#restart');

let canvas, context;

let upButton, leftButton, rightButton, downButton;

const pointSize = 50;

// Snake properties
let snake = [
    {x: 200, y: 200},
    {x: 250, y: 200},
    {x: 300, y: 200}
];

const snakeColors = {
    body: "#E55807",
    head: "#F86F03"
};

let direction = "right";

// Apple properties
function randomPosition() {
    const randomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
    }

    // Note: 700 must be the canvas width
    const number = randomNumber(0, 700 - pointSize);
    return Math.floor(number / pointSize) * pointSize;
}

const apple = {
    x: randomPosition(),
    y: randomPosition()
};

// Score properties
let scoreElement;
let score = 0;
const pointAudio = new Audio("./sounds/point_audio.mp3");

let loop;

startButton.onclick = () => {
    renderScore();

    body.appendChild(gameOverElement);

    createCanvas();
    showButtons();
    drawBoard();
    gameLoop();
};

restartButton.onclick = () => {
    restart();

    renderScore();

    body.appendChild(gameOverElement);
    gameOverElement.classList.add('none');

    createCanvas();
    showButtons();
    drawBoard();
    gameLoop();
}

function renderScore() {
    body.innerHTML = "";

    const scoreContainer = document.createElement("div");
    scoreContainer.classList.add("score-container");
    body.appendChild(scoreContainer);

    const h1 = document.createElement("h1");
    h1.innerText = "Score";
    scoreContainer.appendChild(h1);

    scoreElement = document.createElement("span");
    scoreElement.innerText = score;
    scoreContainer.appendChild(scoreElement);
    scoreElement = document.querySelector("span");
}

function createCanvas() {
    const canvasElement = document.createElement("canvas");
    body.appendChild(canvasElement);

    canvasElement.innerText = "Seu navegador não suporta o jogo.";
    canvasElement.width = "700";
    canvasElement.height = "700";
    canvasElement.id = "game-screen";
    
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");
}

function showButtons() {
    // Desktop verification
    if (window.screen.width >= 768) return;

    // Showing buttons
    body.appendChild(buttonsContainer);
    buttonsContainer.style.display = "block";

    // Adjusting the view
    body.style.justifyContent = "space-around";
    body.style.gap = "0";

    upButton = document.querySelector(".up-arrow");
    leftButton = document.querySelector(".left-arrow");
    rightButton = document.querySelector(".right-arrow");
    downButton = document.querySelector(".down-arrow");
}

function drawBoard() {
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
}

function gameLoop() {
    loop = setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        drawBoard();
        spawnApple();
        checkButtonPressed();
        moveSnake();
        drawSnake();
        checkCollision();
        checkEat();
    }, 300);
}

function drawLine(firstColor, secondColor, yPosition) {
    for (let i = 0; i < 7; i++) {
        context.fillStyle = firstColor;
        context.fillRect(i * 200, yPosition, 100, 100);
    }

    for (let i = 0; i < 7; i++) {
        context.fillStyle = secondColor;
        context.fillRect((i * 200) + 100, yPosition, 100, 100);
    }
}

function spawnApple() {
    const { x, y } = apple;

    context.fillStyle = "#F00";
    context.fillRect(x, y, pointSize, pointSize);
}

function drawSnake() {
    context.fillStyle = snakeColors.body;

    snake.forEach((position, index) => {
        if (index === snake.length - 1) {
            context.fillStyle = snakeColors.head;
        }

        context.fillRect(position.x, position.y, pointSize, pointSize);
    })
}

function moveSnake() {
    if (!direction) return;

    const head = snake[snake.length - 1];

    if (direction === "right") {
        snake.push({x: head.x + pointSize, y: head.y});
    }

    if (direction === "left") {
        snake.push({x: head.x - pointSize, y: head.y});
    }

    if (direction === "down") {
        snake.push({x: head.x, y: head.y + pointSize});
    }

    if (direction === "up") {
        snake.push({x: head.x, y: head.y - pointSize});
    }

    snake.shift();
}

function checkEat() {
    const head = snake[snake.length - 1];

    if (head.x === apple.x && head.y === apple.y) {
        snake.push(head);
        pointAudio.play();

        // Assigning points
        score += 10;
        scoreElement.innerText = score;

        // Ensunring that apple won't spawn in the same position as snake
        let x = randomPosition();
        let y = randomPosition();

        while (snake.find(position => position.x === x && position.y === y)) {
            x = randomPosition();
            y = randomPosition();
        }

        apple.x = x;
        apple.y = y;
    }
}

function checkCollision() {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - pointSize;
    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

    const selfCollision = snake.find((position, index) => {
        return index < snake.length - 2 && position.x === head.x && position.y === head.y;
    });

    if (wallCollision || selfCollision) {
        gameOver();
    }
}

function checkButtonPressed() {
    if (!direction) return;

    // Mobile verification
    if (window.screen.width < 768) {
        upButton.addEventListener("click", () => {
            if (direction === "down") return;
    
            upButton.classList.add("pressed");
            direction = "up";
    
            setTimeout(() => {
                upButton.classList.remove("pressed");
            }, 300);
        });
    
        leftButton.addEventListener("click", () => {
            if (direction === "right") return;
    
            leftButton.classList.add("pressed");
            direction = "left";
    
            setTimeout(() => {
                leftButton.classList.remove("pressed");
            }, 300);
        });
    
        rightButton.addEventListener("click", () => {
            if (direction === "left") return;
    
            rightButton.classList.add("pressed");
            direction = "right";
    
            setTimeout(() => {
                rightButton.classList.remove("pressed");
            }, 300);
        });
    
        downButton.addEventListener("click", () => {
            if (direction === "up") return;
    
            downButton.classList.add("pressed");
            direction = "down";
    
            setTimeout(() => {
                downButton.classList.remove("pressed");
            }, 300);
        });
    }

    // Desktop verification
    if (window.screen.width >= 768) {
        document.addEventListener("keydown", ({ key }) => {
            if (key === "ArrowUp" && direction !== "down") {
                direction = "up";
            }

            if (key === "ArrowLeft" && direction !== "right") {
                direction = "left";
            }

            if (key === "ArrowRight" && direction !== "left") {
                direction = "right";
            }

            if (key === "ArrowDown" && direction !== "up") {
                direction = "down";
            }
        });
    }
}

function gameOver() {
    const scoreView = document.querySelector('#score-view');

    clearInterval(loop);
    gameOverElement.classList.remove('none');
    scoreView.innerText = score;
}

function restart() {
    snake = [
        {x: 200, y: 200},
        {x: 250, y: 200},
        {x: 300, y: 200}
    ];

    direction = 'right';
    score = 0;
}