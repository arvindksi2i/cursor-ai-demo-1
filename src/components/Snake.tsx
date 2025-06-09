import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from 'primereact/button';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 }
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 150;

export default function Snake() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<number>();

  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const checkCollision = (head: Position): boolean => {
    // Check wall collision
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }

    // Check self collision
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
  };

  const moveSnake = useCallback(() => {
    const head = snake[0];
    const newHead = { ...head };

    switch (direction) {
      case 'UP':
        newHead.y -= 1;
        break;
      case 'DOWN':
        newHead.y += 1;
        break;
      case 'LEFT':
        newHead.x -= 1;
        break;
      case 'RIGHT':
        newHead.x += 1;
        break;
    }

    if (checkCollision(newHead)) {
      setIsGameOver(true);
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }

    const newSnake = [newHead, ...snake];
    
    if (newHead.x === food.x && newHead.y === food.y) {
      setFood(generateFood());
      setScore(prev => prev + 10);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, generateFood, score, highScore]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    
    if (isGameOver) return;

    // Prevent default behavior for arrow keys and WASD
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
      event.preventDefault();
    }

    switch (key) {
      case 'arrowup':
      case 'w':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'arrowdown':
      case 's':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'arrowleft':
      case 'a':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'arrowright':
      case 'd':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
    }
  }, [direction, isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!isGameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, GAME_SPEED);
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [moveSnake, isGameOver]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
  };

  return (
    <div className="snake-container">
      <div className="game-info">
        <div className="scores">
          <span style={{ color: '#950101' }}>Score: {score}</span>
          <span style={{ color: '#3D0000' }}>High Score: {highScore}</span>
        </div>
        {isGameOver && (
          <div className="game-over">
            <h3 style={{ color: '#FF0000' }}>Game Over!</h3>
            <Button
              label="Play Again"
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
          </div>
        )}
      </div>

      <div
        className="game-board"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          position: 'relative',
          backgroundColor: 'var(--surface-ground)',
          border: '2px solid #3D0000',
          borderRadius: '8px'
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className="snake-segment"
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              position: 'absolute',
              backgroundColor: index === 0 ? '#FF0000' : '#950101',
              borderRadius: '4px'
            }}
          />
        ))}
        <div
          className="food"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
            position: 'absolute',
            backgroundColor: '#3D0000',
            borderRadius: '50%'
          }}
        />
      </div>

      <div className="controls-info">
        <p style={{ color: 'var(--text-color-secondary)' }}>
          Use arrow keys or WASD to control the snake
        </p>
      </div>
    </div>
  );
} 