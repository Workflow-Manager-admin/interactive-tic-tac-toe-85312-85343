import React, { useState, useEffect } from "react";
import "./App.css";

const COLOR_PRIMARY = "#1976D2";
const COLOR_SECONDARY = "#43A047";
const COLOR_ACCENT = "#FFEB3B";

// --- Square: single tic-tac-toe cell ---
function Square({ value, onClick, disabled }) {
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      disabled={disabled || value !== null}
      aria-label={value ? `Cell ${value}` : "Empty cell"}
    >
      {value}
    </button>
  );
}

// --- Game Board: 3x3 tic-tac-toe grid ---
function Board({ squares, onSquareClick, disabled }) {
  return (
    <div className="ttt-board">
      {squares.map((value, idx) => (
        <Square
          key={idx}
          value={value}
          onClick={() => onSquareClick(idx)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

// --- Info/Status Area ---
function GameInfo({ player, status, winner, isDraw }) {
  let statusContent;
  if (winner) {
    statusContent = (
      <span className="ttt-status-win">
        {winner === "Draw"
          ? "Draw!"
          : (
            <>
              <b
                style={{
                  color: winner === "X" ? COLOR_PRIMARY : COLOR_SECONDARY,
                }}
              >{winner}</b>{" "}
              wins!
            </>
          )}
      </span>
    );
  } else if (isDraw) {
    statusContent = <span className="ttt-status-draw">It's a Draw!</span>;
  } else {
    statusContent = (
      <span>
        Turn:{" "}
        <b
          style={{
            color: player === "X" ? COLOR_PRIMARY : COLOR_SECONDARY,
          }}
        >
          {player}
        </b>
      </span>
    );
  }
  return <div className="ttt-info">{statusContent}</div>;
}

// --- Main App ---
/**
 * PUBLIC_INTERFACE
 * React Tic Tac Toe
 * Features: new game, responsive 3x3 grid, player turns, win/draw/result, restart
 */
function App() {
  // null | 'X' | 'O'
  const [board, setBoard] = useState(Array(9).fill(null));
  // 'X' starts by default
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [started, setStarted] = useState(false);

  // Theme can be extended but is 'light' only for now
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  // Calculate winner or draw
  useEffect(() => {
    const res = calculateWinner(board);
    if (res) {
      setWinner(res);
      setIsDraw(false);
    } else if (board.every((i) => i !== null)) {
      setIsDraw(true);
      setWinner(null);
    } else {
      setWinner(null);
      setIsDraw(false);
    }
  }, [board]);

  // Handle square click
  function handleSquare(idx) {
    if (winner || board[idx] !== null || isDraw) return;
    const newBoard = board.slice();
    newBoard[idx] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext((x) => !x);
    setStarted(true);
  }

  // Handle new game
  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setIsDraw(false);
    setStarted(false);
  }

  // PUBLIC_INTERFACE
  function handleStartGame() {
    handleRestart();
    setStarted(true);
  }

  const currentPlayer = isXNext ? "X" : "O";

  return (
    <div className="ttt-app">
      <div className="ttt-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>

        <Board
          squares={board}
          onSquareClick={handleSquare}
          disabled={!!winner || isDraw || !started}
        />

        <GameInfo
          player={currentPlayer}
          status={null}
          winner={winner}
          isDraw={isDraw}
        />

        <div className="ttt-actions">
          {!started ? (
            <button
              className="ttt-btn ttt-btn-accent"
              onClick={handleStartGame}
              data-testid="start-btn"
            >
              Start New Game
            </button>
          ) : (
            <button
              className="ttt-btn"
              style={{ marginTop: 0 }}
              onClick={handleRestart}
              data-testid="restart-btn"
            >
              Restart
            </button>
          )}
        </div>

        <footer className="ttt-footer">
          <span>
            <span style={{ color: COLOR_PRIMARY, fontWeight: 600 }}>X</span> vs{" "}
            <span style={{ color: COLOR_SECONDARY, fontWeight: 600 }}>O</span>
          </span>
        </footer>
      </div>
    </div>
  );
}

// --- Helper: winner calculation ---
/**
 * PUBLIC_INTERFACE
 * Calculate the winner from the board
 * @param {Array} squares
 * @returns ('X'|'O'|null)
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6]  // diagonals
  ];
  for (const [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

export default App;
