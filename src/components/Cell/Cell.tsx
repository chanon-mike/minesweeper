import styles from './Cell.module.css';

type CellProps = {
  x: number;
  y: number;
  val: number;
  onClick: (x: number, y: number) => void;
  handleContextMenu: (x: number, y: number, e: React.MouseEvent<HTMLElement>) => void;
};

const Cell = ({ x, y, val, onClick, handleContextMenu }: CellProps) => {
  return (
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
            <div className={styles.icon} style={{ backgroundPosition: `${-30 * (val - 1)}px` }} />
          </div>
        ) : val === 12 ? (
          // Flag clear
          <div className={styles.icon} style={{ backgroundPosition: `${-30 * 9}px` }} />
        ) : (
          // Other; number and mine
          <div className={styles.icon} style={{ backgroundPosition: `${-30 * (val - 1)}px` }} />
        ))}
    </div>
  );
};

export default Cell;
