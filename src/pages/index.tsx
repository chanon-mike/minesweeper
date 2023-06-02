import { useEffect, useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  // 0 -> non click
  // 1 -> left click
  // 2 -> flag mark
  // 3 -> question mark
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
  // o -> mine
  // 1 -> no mine
  const [mineMap, setMineMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  // (startTime, currentTime)
  const [counter, setCounter] = useState(0);

  const mineCount = 10;
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
  // 9 -> square + flag
  // 10 -> square + question mark
  // 11 -> clear + mine
  // 12 -> clear + flag
  let board: number[][] = [];

  const isPlaying = userInput.some((row) => row.some((input) => input !== 0));
  const isFailing = userInput.some((row, y) =>
    row.some((input, x) => input === 1 && mineMap[y][x] === 1)
  );
  const isFirst = userInput.every((row) => row.every((cell) => cell !== 1));
  const emptyCellList: number[][] = [];

  // PLant mines only once when game start
  const plantMines = (x: number, y: number) => {
    const newmineMap = JSON.parse(JSON.stringify(mineMap));
    let currentMineCount = 0;

    while (currentMineCount !== mineCount) {
      let randX = Math.floor(Math.random() * userInput[0].length);
      let randY = Math.floor(Math.random() * userInput.length);
      // When first click result in mine, shift it to random place
      while (randX === x && randY === y) {
        randX = Math.floor(Math.random() * userInput[0].length);
        randY = Math.floor(Math.random() * userInput.length);
      }
      // Assign a mine to random coor, iterate current mine count
      newmineMap[randY][randX] = 1;
      currentMineCount = newmineMap.flat().filter((cell: number) => cell === 1).length;
    }
    setMineMap(newmineMap);
  };

  // Calculate mine count nearby
  const calculateMineCount = (x: number, y: number) => {
    let count = 0;
    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      if (
        newX >= 0 &&
        newX < userInput[0].length &&
        newY >= 0 &&
        newY < userInput.length &&
        mineMap[newY][newX] === 1
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
        const count = calculateMineCount(x, y);
        if (count === 0) emptyCellList.push([x, y]);
      }
    }
  };

  // Reveal all mine (n: flag or bomb indication)
  const revealMines = (n: number) => {
    for (let y = 0; y < userInput.length; y++) {
      for (let x = 0; x < userInput[0].length; x++) {
        if (mineMap[y][x] === 1) board[y][x] = n;
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
        mineMap[y][x] === 1
      ) {
        return;
      }

      const count = calculateMineCount(x, y);
      board[y][x] = count || -1;
      // Reveal neighboring cells recursively only if current visited cell is empty
      // if not empty and not mine, set the current cell to number of nearby mine
      if (count === 0) {
        if (emptyCellList.some((i) => i[0] === x && i[1] === y)) {
          for (const [dx, dy] of directions) {
            revealNearbyCell(x + dx, y + dy);
          }
        }
      }
    };

    // Generate the board based on userInput and mineMap
    for (let y = 0; y < yLength; y++) {
      for (let x = 0; x < xLength; x++) {
        switch (userInput[y][x]) {
          case 1:
            if (mineMap[y][x] === 1) {
              // Reveal all mines
              revealMines(11);
            } else {
              revealNearbyCell(x, y);
            }
            break;
          case 2:
            // question mark
            board[y][x] = 10;
            break;
          case 3:
            // flag mark
            board[y][x] = 9;
            break;
        }
      }
    }
  };

  // Generate empty cell and board each render
  findEmptyCell();
  generateBoard();

  // Count the cell that already flip after generate board (only clear and number)
  const openCellCount = board.flat().filter((cell) => cell !== 0 && cell < 9).length;
  // Check if game end (reveal flag)
  const isWinning = openCellCount + mineCount === userInput.length * userInput[0].length;
  // 11 - smily face (normal)
  // 12 - smug face (win)
  // 13 - dead face (lose)
  const faceValue = isWinning ? 12 : !isFailing ? 11 : 13;
  // Placeable number (flag, counter) format in 3 digit
  const placeableFlagCount = mineCount - board.flat().filter((cell) => cell === 10).length;
  const displayNum = {
    placeableFlagCount: `000${(placeableFlagCount > 999
      ? 999
      : placeableFlagCount
    ).toString()}`.slice(-3),
    counterCount: `000${counter.toString()}`.slice(-3),
  };

  // Game end when open all cell except mine (reveal flag)
  if (isWinning) {
    revealMines(12);
  }

  // Counter time interval for each second
  useEffect(() => {
    if (counter < 999) {
      const timer =
        isPlaying && !isFailing && !isWinning && setTimeout(() => setCounter(counter + 1), 1000);
      return () => clearInterval(timer as NodeJS.Timeout);
    }
  }, [counter, isPlaying, isFailing, isWinning]);

  // Left Click
  const onClick = (x: number, y: number) => {
    // Generate random mine only once at the start
    if (isFirst) {
      plantMines(x, y);
      setCounter(0);
    }

    if (board[y][x] === 0 && !isFailing) {
      // Receive user input
      const newUserInput: (0 | 1 | 2 | 3)[][] = JSON.parse(JSON.stringify(userInput));
      newUserInput[y][x] = 1;
      setUserInput(newUserInput);
    }
  };

  // Right Click
  const handleContextMenu = (x: number, y: number, e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const newUserInput: (0 | 1 | 2 | 3)[][] = JSON.parse(JSON.stringify(userInput));

    if (!isFailing) {
      if (board[y][x] === 0) {
        // flag
        newUserInput[y][x] = 2;
      } else if (userInput[y][x] === 2) {
        // question mark
        newUserInput[y][x] = 3;
      } else if (userInput[y][x] === 3) {
        // return to normal
        newUserInput[y][x] = 0;
      }
    }
    setUserInput(newUserInput);
  };

  // Restart
  const restartGame = () => {
    // Initialize empty board
    const newInitialBoard: (0 | 1 | 2 | 3)[][] = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    board = newInitialBoard;
    setUserInput(newInitialBoard);
    setMineMap(newInitialBoard);
    setCounter(0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.minesweeper}>
        <div className={styles.header}>
          <div className={styles.number} style={{ left: 15 }}>
            <div className={styles.backgroundNum}>888</div>
            <span>{displayNum.placeableFlagCount.charAt(0)}</span>
            <span>{displayNum.placeableFlagCount.charAt(1)}</span>
            <span>{displayNum.placeableFlagCount.charAt(2)}</span>
          </div>
          <button
            onClick={restartGame}
            style={{ backgroundPosition: `${-29.95 * 1.5 * faceValue}px` }}
          />
          <div className={styles.number} style={{ right: 15 }}>
            <div className={styles.backgroundNum}>888</div>
            <span>{displayNum.counterCount.charAt(0)}</span>
            <span>{displayNum.counterCount.charAt(1)}</span>
            <span>{displayNum.counterCount.charAt(2)}</span>
          </div>
        </div>
        <div className={styles.board}>
          {board.map((row, y) =>
            row.map((val, x) => (
              <div
                className={styles.cell}
                key={`${x}-${y}`}
                onClick={() => onClick(x, y)}
                onContextMenu={(e) => handleContextMenu(x, y, e)}
              >
                {/* {mineMap[y][x]} */}
                {val !== -1 &&
                  (val === 0 ? (
                    // Empty
                    <div className={styles.square} />
                  ) : val === 9 || val === 10 ? (
                    // Flag mark and question mark
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
                    // Other; number and mine
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
    </div>
  );
};

export default Home;
