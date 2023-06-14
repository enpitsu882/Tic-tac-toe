import React, { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const board = [];
  for (let i = 0; i < 3; i++) {
    const boardRow = [];
    for (let j = 3 * i; j < 3 * i + 3; j++) {
      boardRow.push(
        <Square key={j} value={squares[j]} onSquareClick={() => handleClick(j)} />
      );
    }
    board.push(
      <div key={i} className="board-row">{boardRow}</div>
    );
  }

  return (
    <React.Fragment>
      <div className="status">{status}</div>
      {board}
    </React.Fragment>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [sortAsc, setSortAsc] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === currentMove) {
      description = 'You are at move #' + move;
    } else if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    if (move === currentMove) {
      return (
        <li key={move}>
          <p>{description}</p>
        </li>
      );
    } else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

  const RadioButton = () => {
    if (sortAsc) {
      return (
        <React.Fragment>
          <input type="radio" id="sortChoice1" name="sort" value="asc" onChange={() => { setSortAsc(true); }} checked />
          <label for="contactChoice1">昇順</label>

          <input type="radio" id="sortChoice2" name="sort" value="desc" onChange={() => { setSortAsc(false); }} />
          <label for="contactChoice2">降順</label>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <input type="radio" id="sortChoice1" name="sort" value="asc" onChange={() => { setSortAsc(true); }} />
          <label for="contactChoice1">昇順</label>

          <input type="radio" id="sortChoice2" name="sort" value="desc" onChange={() => { setSortAsc(false); }} checked />
          <label for="contactChoice2">降順</label>
        </React.Fragment>
      )
    }
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>
          <RadioButton />
        </ol>
        {sortAsc ? <ol>{moves}</ol> : <ol reversed>{moves.reverse()}</ol>}
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
