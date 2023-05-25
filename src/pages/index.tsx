import { useEffect, useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  // 0 -> non click
  // 1 -> left click
  // 2 -> question mark
  // 3 -> flag mark
  const [userInput, setUserInput] = useState<(0 | 1 | 2 | 3)[][]>([
    [-1, 0, 1, 2, 8, 9, 10, 11],
    [12, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const bombCount = 10;
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
  const isPlaying = userInput.some((row) => row.some((input) => input !== 0));
  const isFailure = userInput.some((row, y) =>
    row.some((input, x) => input === 1 && bombMap[y][x] === 1)
  );
  // -1 -> clear (nothing)
  // 0 -> square (has border)
  // 1-8 -> number
  // 9 -> square + question mark
  // 10 -> square + flag
  // 11 -> clear + bomb
  // 12 -> clear + flag
  const board: number[][] = [];

  // Generate random bomb
  useEffect(() => {
    if (isPlaying) {
      // Generate random bomb
      const newBombMap = bombMap;
      for (let i = 0; i < bombCount; i++) {
        const x = Math.floor(Math.random() * 8);
        const y = Math.floor(Math.random() * 8);
        newBombMap[y][x] = 1;
      }
      setBombMap(newBombMap);
    }
  }, [isPlaying, bombMap]);

  // Reveal board based on userInput
  userInput.forEach((row) => {
    const boardRow = [...row];
    board.push(boardRow);
  });

  // Place bomb after first input
  // bombMap.forEach((row, y) => {
  //   row.forEach((val, x) => {
  //     // if (bombMap[y][x])
  //     board[y][x] = bombMap[y][x];
  //   });
  // });

  // const onClick = () => {};

  console.log(bombMap);

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((val, x) => (
            <div className={styles.cell} key={`${x}-${y}`}>
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
