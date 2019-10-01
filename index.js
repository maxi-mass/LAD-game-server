const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
    extended: true
}));

// Создаем пустое игровое поле, представляющее собой 7 столбцов в 6 клеток высотой
let board = [];
for (let r = 0; r < 6; r++) {
    let row = [];
    for (let c = 0; c < 7; c++) {
        row.push(null)
    }
    board.push(row);
}

let state = {
    player1: 1,
    player2: 2,
    currentPlayer: 1,
    board,
    isGameOver: false,
    message: ""
};

const checkVertical = function (board) {
    for (let r = 3; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
            if (board[r][c]) {
                if (board[r][c] === board[r - 1][c] &&
                    board[r][c] === board[r - 2][c] &&
                    board[r][c] === board[r - 3][c]) {
                    return board[r][c];
                }
            }
        }
    }
};

const checkHorizontal = board => {
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c]) {
                if (board[r][c] === board[r][c + 1] &&
                    board[r][c] === board[r][c + 2] &&
                    board[r][c] === board[r][c + 3]) {
                    return board[r][c];
                }
            }
        }
    }
};

const checkDiagonalRight = board => {
    for (let r = 3; r < 6; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c]) {
                if (board[r][c] === board[r - 1][c + 1] &&
                    board[r][c] === board[r - 2][c + 2] &&
                    board[r][c] === board[r - 3][c + 3]) {
                    return board[r][c];
                }
            }
        }
    }
};

const checkDiagonalLeft = board => {
    for (let r = 3; r < 6; r++) {
        for (let c = 3; c < 7; c++) {
            if (board[r][c]) {
                if (board[r][c] === board[r - 1][c - 1] &&
                    board[r][c] === board[r - 2][c - 2] &&
                    board[r][c] === board[r - 3][c - 3]) {
                    return board[r][c];
                }
            }
        }
    }
};

const checkDraw = board => {
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
            if (board[r][c] === null) {
                return null;
            }
        }
    }
    return 'draw';
};

const checkAll = board => {
    return checkVertical(board) || checkDiagonalRight(board) || checkDiagonalLeft(board) || checkHorizontal(board) || checkDraw(board);
};

app.get('/data', function (req, res) {
    let board = [];
    for (let r = 0; r < 6; r++) {
        let row = [];
        for (let c = 0; c < 7; c++) {
            row.push(null)
        }
        board.push(row);
    }
    
    state = {
        player1: 1,
        player2: 2,
        currentPlayer: 1,
        board,
        isGameOver: false,
        message: ""
    };

    res.send(state);
});

app.post('/play', function (request, response) {
    let columnIndex = request.body.columnIndex;
    let currentPlayer = request.body.currentPlayer;

    // Закрасить поле на доске после хода игрока
    for (let r = 5; r >= 0; r--) {
        if (!state.board[r][columnIndex]) {
            state.board[r][columnIndex] = currentPlayer;
            break;
        }
    }
    let result = checkAll(state.board);

    if (result === state.player1) {
        state.isGameOver = true;
        state.message = 'Игрок 1 (красные фишки) выиграл!';
    } else if (result === state.player2) {
        state.isGameOver = true;
        state.message = 'Игрок 2 (желтые фишки) выиграл!';
    } else if (result === 'draw') {
        state.isGameOver = true;
        state.message = 'Ничья';
    } else {
        state.currentPlayer = (state.currentPlayer == state.player1) ? state.player2 : state.player1;
    }

    response.send(state);
});

app.listen(4000);