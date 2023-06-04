import type { Dispatch, SetStateAction } from 'react';

export type boardSizeHash = { width: number; height: number };
export type userInputArray = (0 | 1 | 2 | 3)[][];
export type boardArray = number[][];

export const generateEmptyBoard = (boardSize: boardSizeHash): userInputArray => {
  return Array.from({ length: boardSize.height }, () => {
    return Array<number>(boardSize.width).fill(0) as (0 | 1 | 2 | 3)[];
  });
};

// Find all the empty cell in the board
export const findEmptyCell = (
  userInput: userInputArray,
  mineMap: boardArray,
  emptyCellList: boardArray
) => {
  for (let y = 0; y < userInput.length; y++) {
    for (let x = 0; x < userInput[0].length; x++) {
      const count = calculateMineCount(x, y, userInput, mineMap);
      if (count === 0) emptyCellList.push([x, y]);
    }
  }
  return emptyCellList;
};

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

// Calculate number of mine nearby
export const calculateMineCount = (
  x: number,
  y: number,
  userInput: userInputArray,
  mineMap: boardArray
) => {
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

// Reveal nearby cell if it's empty
export const revealNearbyCell = (
  x: number,
  y: number,
  userInput: userInputArray,
  mineMap: boardArray,
  board: boardArray,
  emptyCellList: boardArray
) => {
  if (
    x < 0 ||
    x >= userInput[0].length ||
    y < 0 ||
    y >= userInput.length ||
    board[y][x] !== 0 ||
    mineMap[y][x] === 1
  ) {
    return;
  }

  const count = calculateMineCount(x, y, userInput, mineMap);
  board[y][x] = count || -1;
  // Reveal neighboring cells recursively only if current visited cell is empty
  // if not empty and not mine, set the current cell to number of nearby mine
  if (count === 0 && emptyCellList.some((i) => i[0] === x && i[1] === y)) {
    for (const [dx, dy] of directions) {
      revealNearbyCell(x + dx, y + dy, userInput, mineMap, board, emptyCellList);
    }
  }
};

// Reveal all mine (n: flag (12) or mine (11) indication)
export const revealMines = (
  n: 11 | 12,
  userInput: userInputArray,
  mineMap: boardArray,
  board: boardArray
) => {
  for (let y = 0; y < userInput.length; y++) {
    for (let x = 0; x < userInput[0].length; x++) {
      if (mineMap[y][x] === 1) board[y][x] = n;
    }
  }
};

// Generate a board each render
export const generateBoard = (
  userInput: userInputArray,
  mineMap: boardArray,
  board: boardArray,
  emptyCellList: boardArray
) => {
  const yLength = userInput.length;
  const xLength = userInput[0].length;

  // Initialize empty board
  board = Array.from({ length: yLength }, () => Array(xLength).fill(0));

  // Generate the board based on userInput and mineMap
  for (let y = 0; y < yLength; y++) {
    for (let x = 0; x < xLength; x++) {
      switch (userInput[y][x]) {
        case 1:
          if (mineMap[y][x] === 1) {
            // Reveal all mines
            revealMines(11, userInput, mineMap, board);
          } else {
            revealNearbyCell(x, y, userInput, mineMap, board, emptyCellList);
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

  return board;
};

// PLant mines only once when game start
export const plantMines = (
  x: number,
  y: number,
  userInput: userInputArray,
  mineCount: number,
  mineMap: boardArray,
  setMineMap: Dispatch<SetStateAction<boardArray>>
) => {
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
