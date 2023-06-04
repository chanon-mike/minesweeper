import type { boardArray, userInputArray } from '../../pages';
import Cell from '../Cell/Cell';
import styles from './Board.module.css';

type BoardProps = {
  board: boardArray;
  userInput: userInputArray;
  onCellClick: (x: number, y: number) => void;
  onContextMenu: (x: number, y: number, e: React.MouseEvent<HTMLElement>) => void;
};

const Board = ({ board, userInput, onCellClick, onContextMenu }: BoardProps) => {
  return (
    <div
      className={styles.board}
      style={{ minWidth: userInput[0].length * 60, minHeight: userInput.length * 60 }}
    >
      {board.map((row, y) =>
        row.map((val, x) => (
          <Cell
            key={`${x}-${y}`}
            x={x}
            y={y}
            val={val}
            onClick={onCellClick}
            handleContextMenu={onContextMenu}
          />
        ))
      )}
    </div>
  );
};

export default Board;
