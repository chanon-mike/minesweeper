import { useEffect, useState } from 'react';
import Board from '../components/Board/Board';
import Header from '../components/Header/Header';
import UpdateSizeForm from '../components/UpdateSizeForm/UpdateSizeForm';
import type { boardArray, boardSizeHash, userInputArray } from '../utils/boardUtils';
import {
  findEmptyCell,
  generateBoard,
  generateEmptyBoard,
  plantMines,
  revealMines,
} from '../utils/boardUtils';
import styles from './index.module.css';

const initialBoardSize: boardSizeHash = {
  width: 8,
  height: 8,
};
const initialUserInput: userInputArray = generateEmptyBoard(initialBoardSize);
const initialMineMap: boardArray = generateEmptyBoard(initialBoardSize);

const Home = () => {
  // - State -
  // initial board size of 8 x 8
  const [boardSize, setBoardSize] = useState<boardSizeHash>(initialBoardSize);
  // 0 -> non click
  // 1 -> left click
  // 2 -> flag mark
  // 3 -> question mark
  const [userInput, setUserInput] = useState<userInputArray>(initialUserInput);
  // o -> mine
  // 1 -> no mine
  const [mineMap, setMineMap] = useState(initialMineMap);
  // Time count from when the game start
  const [counter, setCounter] = useState(0);
  const mineCount = 10;
  // -1 -> clear (nothing)
  // 0 -> square (has border)
  // 1-8 -> number
  // 9 -> square + flag
  // 10 -> square + question mark
  // 11 -> clear + mine
  // 12 -> clear + flag
  let board: boardArray = [];
  let emptyCellList: boardArray = [];

  // Generate empty cell and board each render
  emptyCellList = findEmptyCell(userInput, mineMap, emptyCellList);
  board = generateBoard(userInput, mineMap, board, emptyCellList);

  // - Game status -
  const isPlaying = userInput.some((row) => row.some((input) => input !== 0));
  const isFailing = userInput.some((row, y) =>
    row.some((input, x) => input === 1 && mineMap[y][x] === 1)
  );
  const isFirst = userInput.every((row) => row.every((cell) => cell !== 1));
  const isWinning =
    board.flat().filter((cell) => cell !== 0 && cell < 9).length + mineCount ===
    userInput.length * userInput[0].length; // Check if game end (if open cell count + mine count == board size)

  // - Utility UI value -
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
    revealMines(12, userInput, mineMap, board);
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
      plantMines(x, y, userInput, mineCount, mineMap, setMineMap);
      setCounter(0);
    }

    if (board[y][x] === 0 && !isFailing) {
      // Receive user input
      const newUserInput: userInputArray = JSON.parse(JSON.stringify(userInput));
      newUserInput[y][x] = 1;
      setUserInput(newUserInput);
    }
  };

  // Right Click
  const handleContextMenu = (x: number, y: number, e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const newUserInput: userInputArray = JSON.parse(JSON.stringify(userInput));

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
    const newBoardSize = {
      width: boardSize.width,
      height: boardSize.height,
    };
    const newInitialBoard: userInputArray = generateEmptyBoard(newBoardSize);
    board = newInitialBoard;
    setUserInput(newInitialBoard);
    setMineMap(newInitialBoard);
    setCounter(0);
  };

  // Handle change size event
  const handleSizeUpdate = () => {
    const newBoardSize = {
      width: boardSize.width,
      height: boardSize.height,
    };
    const updatedUserInput = generateEmptyBoard(newBoardSize);
    const updatedMineMap = generateEmptyBoard(newBoardSize);
    setUserInput(updatedUserInput);
    setMineMap(updatedMineMap);
  };

  return (
    <div className={styles.container}>
      <UpdateSizeForm
        boardSize={boardSize}
        setBoardSize={setBoardSize}
        handleSizeUpdate={handleSizeUpdate}
      />
      <div className={styles.minesweeper}>
        <Header
          userInput={userInput}
          displayNum={displayNum}
          restartGame={restartGame}
          faceValue={faceValue}
        />
        <Board
          board={board}
          userInput={userInput}
          onCellClick={onClick}
          onContextMenu={handleContextMenu}
        />
      </div>
    </div>
  );
};

export default Home;
