import { useEffect, useState } from 'react';
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
  const board: number[][] = [];

  const isPlaying = userInput.some((row) => row.some((input) => input !== 0));
  const isFailure = userInput.some((row, y) =>
    row.some((input, x) => input === 1 && bombMap[y][x] === 1)
  );
  const isFirst = userInput.every((row) => row.every((cell) => cell !== 1));

  // Check for each nearby clear cell
  // const visitCell = (x: number, y: number) => {
  //   let bombNumber = 0;
  //   for (const [dx, dy] of directions) {
  //     // For each direction, if there are bomb, increase the count of bombNumber by if there are bomb or not
  //     if (bombMap[y + dy] !== undefined && bombMap[y + dy][x + dx] !== undefined) {
  //       bombNumber++;
  //     }
  //   }
  //   if (bombNumber === 0) {
  //     // If there are no bomb nearby, check if nearby cell is not bomb or already clear
  //     for (const [dx, dy] of directions) {
  //       if (
  //         board[y + dy][x + dx] !== undefined &&
  //         (board[y + dy][x + dx] === 0 ||
  //           board[y + dy][x + dx] === 9 ||
  //           board[y + dy][x + dx] === 10)
  //       ) {
  //         board[y + dy][x + dx] = bombNumber;
  //         visitCell(x + dx, y + dy);
  //       }
  //     }
  //   }
  // };

  // Generate random bomb
  useEffect(() => {
    if (isPlaying) {
      const newBombMap = bombMap;
      for (let i = 0; i < bombCount; i++) {
        const x = Math.floor(Math.random() * 8);
        const y = Math.floor(Math.random() * 8);
        newBombMap[y][x] = 1;
      }
      setBombMap(newBombMap);
    }
  }, [isPlaying, bombMap]);

  // Generate a board each render
  const generateBoard = () => {
    const rows = userInput.length;
    const cols = userInput[0].length;

    // Calculate the board based on userInput and bombMap
    for (let y = 0; y < userInput.length; y++) {
      const row: number[] = [];
      for (let x = 0; x < userInput[0].length; x++) {
        if (userInput[y][x] === 0) {
          row.push(userInput[y][x]);
        }
        if (userInput[y][x] === 1) {
          // Left click
          if (bombMap[y][x] === 1) {
            row.push(11); // Bomb
          } else {
            // Calculate the number of surrounding bombs
            let count = 0;
            for (const [dx, dy] of directions) {
              const newX = x + dx;
              const newY = y + dy;
              if (
                newX >= 0 &&
                newX < cols &&
                newY >= 0 &&
                newY < rows &&
                bombMap[newY][newX] === 1
              ) {
                count++;
              }
            }
            row.push(count); // Number of surrounding bombs
          }
        } else if (userInput[y][x] === 2) {
          // Question mark
          row.push(9);
        } else if (userInput[y][x] === 3) {
          // Flag mark
          row.push(10);
        }
      }
      board.push(row);
    }
    console.log(board);
  };

  generateBoard();

  const revealCell = (x: number, y: number) => {
    // If input 1, reveal clicked cell
    // If clicked cell is already clicked, nothing happen
    // If clicked cell is a mine, reveal all mine and end game
    // If clicked cell has a mine nearby, reveal only that cell with number icon
    // If clicked cell doesn't have a mine nearby, reveal all nearby cell without mine nearby
    const updatedBoard = JSON.parse(JSON.stringify(board));

    if (board[y][x] === 0) {
      const newUserInput: (0 | 1 | 2 | 3)[][] = JSON.parse(JSON.stringify(userInput));
      newUserInput[y][x] = 1;
      setUserInput(newUserInput);
    }
  };

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
              onClick={() => revealCell(x, y)}
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
