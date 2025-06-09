import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';

type Player = 'X' | 'O';
type GameMode = 'pvp' | 'pvc';
type Square = Player | null;
type Board = Square[];

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const gameModeOptions = [
    { label: 'Player vs Player', value: 'pvp' },
    { label: 'Player vs Computer', value: 'pvc' }
  ];

  const checkWinner = (squares: Board): Player | 'Draw' | null => {
    // Check for winner
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a] as Player;
      }
    }
    
    // Check for draw
    if (squares.every(square => square !== null)) {
      return 'Draw';
    }
    
    return null;
  };

  const getComputerMove = (squares: Board): number => {
    // Try to win
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        const boardCopy = [...squares];
        boardCopy[i] = 'O';
        if (checkWinner(boardCopy) === 'O') {
          return i;
        }
      }
    }

    // Block player's winning move
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        const boardCopy = [...squares];
        boardCopy[i] = 'X';
        if (checkWinner(boardCopy) === 'X') {
          return i;
        }
      }
    }

    // Try to take center
    if (!squares[4]) return 4;

    // Take any corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => !squares[i]);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available space
    const availableSpaces = squares
      .map((square, index) => square === null ? index : null)
      .filter((index): index is number => index !== null);
    
    return availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
  };

  useEffect(() => {
    if (gameMode === 'pvc' && currentPlayer === 'O' && !winner) {
      const timer = setTimeout(() => {
        const computerMove = getComputerMove(board);
        handleMove(computerMove);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode]);

  const handleMove = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner !== 'Draw') {
        setScores(prev => ({
          ...prev,
          [gameWinner]: prev[gameWinner] + 1
        }));
      }
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0 });
    resetGame();
  };

  return (
    <div className="tictactoe-container">
      <div className="game-controls">
        <SelectButton
          value={gameMode}
          onChange={(e) => {
            setGameMode(e.value);
            resetGame();
          }}
          options={gameModeOptions}
          className="game-mode-selector"
          pt={{
            button: { className: 'p-button-text' }
          }}
        />
        <div className="scores">
          <span className="score x-score">X: {scores.X}</span>
          <span className="score o-score">O: {scores.O}</span>
        </div>
      </div>

      <div className="status" style={{ color: winner ? '#FF0000' : '#950101' }}>
        {winner
          ? winner === 'Draw'
            ? "It's a Draw!"
            : `Player ${winner} Wins!`
          : `Current Player: ${currentPlayer}`}
      </div>

      <div className="board">
        {board.map((square, index) => (
          <button
            key={index}
            className={`square ${square || ''}`}
            onClick={() => handleMove(index)}
            disabled={!!winner || (gameMode === 'pvc' && currentPlayer === 'O')}
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '2px solid #3D0000',
              color: square === 'X' ? '#FF0000' : '#950101'
            }}
          >
            {square}
          </button>
        ))}
      </div>

      <div className="game-buttons">
        <Button
          label="New Game"
          icon="pi pi-refresh"
          onClick={resetGame}
          className="p-button-outlined"
          style={{
            borderColor: '#950101',
            color: '#950101'
          }}
          pt={{
            root: { className: 'p-button-lg' }
          }}
        />
        <Button
          label="Reset Scores"
          icon="pi pi-trash"
          onClick={resetScores}
          className="p-button-outlined p-button-danger"
          style={{
            borderColor: '#FF0000',
            color: '#FF0000'
          }}
          pt={{
            root: { className: 'p-button-lg' }
          }}
        />
      </div>
    </div>
  );
} 