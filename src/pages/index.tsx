import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  // 0 -> non click
  // 1 -> left click
  // 2 -> question mark
  // 3 -> flag mark
  const [userInput, setUserInput] = useState<(0 | 1 | 2 | 3)[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  // o -> bomb
  // 1 -> no bomb
  const [bombMap, setBombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const bombCount = 10;
  const directions = [
    [-1, 0], // Up
    [-1, 1], // Up-Right
    [0, 1], // Right
    [1, 1], // Down-Right
    [1, 0], // Down
    [1, -1], // Down-Left
    [0, -1], // Left
    [-1, -1], // Up-Left
  ];

  // -1 -> clear (nothing)
  // 0 -> square (has border)
  // 1-8 -> number
  // 9 -> square + question mark
  // 10 -> square + flag
  // 11 -> clear + bomb
  // 12 -> clear + flag
  let board: number[][] = [];

  const isPlaying = userInput.some((row) => row.some((input) => input !== 0));
  const isFailure = userInput.some((row, y) =>
    row.some((input, x) => input === 1 && bombMap[y][x] === 1)
  );
  const isFirst = userInput.every((row) => row.every((cell) => cell !== 1));
  const emptyCellList: number[][] = [];

  // PLant bombs only once
  const plantMines = () => {
    const newBombMap = bombMap;
    for (let i = 0; i < bombCount; i++) {
      const x = Math.floor(Math.random() * 8);
      const y = Math.floor(Math.random() * 8);
      newBombMap[y][x] = 1;
    }
    setBombMap(newBombMap);
  };

  // Calculate bomb count nearby
  const calculateBombCount = (x: number, y: number) => {
    let count = 0;
    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      if (
        newX >= 0 &&
        newX < userInput[0].length &&
        newY >= 0 &&
        newY < userInput.length &&
        bombMap[newY][newX] === 1
      ) {
        count++;
      }
    }
    return count;
  };

  // Find empty cell
  const findEmptyCell = () => {
    for (let y = 0; y < userInput.length; y++) {
      for (let x = 0; x < userInput[0].length; x++) {
        const count = calculateBombCount(x, y);
        if (count === 0) emptyCellList.push([x, y]);
      }
    }
  };

  // Generate a board each render
  const generateBoard = () => {
    const yLength = userInput.length;
    const xLength = userInput[0].length;

    // Initialize empty board
    board = Array.from({ length: yLength }, () => Array(xLength).fill(0));

    // Reveal nearby cell if it's empty
    const revealNearbyCell = (x: number, y: number) => {
      if (
        x < 0 ||
        x >= xLength ||
        y < 0 ||
        y >= yLength ||
        board[y][x] !== 0 ||
        bombMap[y][x] === 1
      ) {
        return;
      }

      const count = calculateBombCount(x, y);
      board[y][x] = count || -1;
      // Reveal neighboring cells recursively only if current visited cell is empty
      // if not empty and not bomb, set the current cell to number of nearby bomb
      if (count === 0) {
        if (emptyCellList.some((i) => i[0] === x && i[1] === y)) {
          for (const [dx, dy] of directions) {
            revealNearbyCell(x + dx, y + dy);
          }
        }
      }
    };

    // Generate the board based on userInput and bombMap
    for (let y = 0; y < yLength; y++) {
      for (let x = 0; x < xLength; x++) {
        if (userInput[y][x] === 1) {
          if (bombMap[y][x] === 1) {
            // Reveal all bombs
            board[y][x] = 11;
          } else {
            revealNearbyCell(x, y);
          }
        }
      }
    }
    console.log(board);
  };

  // Generate empty cell and board each render
  findEmptyCell();
  generateBoard();

  // Left Click
  const onClick = (x: number, y: number) => {
    // Generate random bomb only once at the start
    if (isFirst) {
      plantMines();
    }

    if (board[y][x] === 0) {
      const newUserInput: (0 | 1 | 2 | 3)[][] = JSON.parse(JSON.stringify(userInput));
      newUserInput[y][x] = 1;
      setUserInput(newUserInput);
    }
  };

  // Right Click
  const handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((val, x) => (
            <div
              className={styles.cell}
              key={`${x}-${y}`}
              onClick={() => onClick(x, y)}
              onContextMenu={handleContextMenu}
            >
              {val !== -1 &&
                (val === 0 ? (
                  <div className={styles.square} />
                ) : val === 9 ? (
                  // Question mark
                  <div className={styles.square}>
                    <div
                      className={styles.icon}
                      style={{ backgroundPosition: `${-30 * (val - 1)}px` }}
                    />
                  </div>
                ) : val === 10 ? (
                  // Flag mark
                  <div className={styles.square}>
                    <div
                      className={styles.icon}
                      style={{ backgroundPosition: `${-30 * (val - 1)}px` }}
                    />
                  </div>
                ) : val === 12 ? (
                  // Flag clear
                  <div className={styles.icon} style={{ backgroundPosition: `${-30 * 9}px` }} />
                ) : (
                  // Other; icon and bomb
                  <div
                    className={styles.icon}
                    style={{ backgroundPosition: `${-30 * (val - 1)}px` }}
                  />
                ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
