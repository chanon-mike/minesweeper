import type { Dispatch, SetStateAction } from 'react';
import type { boardSizeHash } from '../../pages';
import styles from './UpdateSizeForm.module.css';

type UpdateSizeFormProps = {
  boardSize: boardSizeHash;
  setBoardSize: Dispatch<SetStateAction<boardSizeHash>>;
  handleSizeUpdate: () => void;
};

const UpdateSizeForm = ({ boardSize, setBoardSize, handleSizeUpdate }: UpdateSizeFormProps) => {
  return (
    <form>
      <label>
        Width:
        <input
          type="number"
          className={styles.sizeInput}
          value={boardSize.width}
          onChange={(e) =>
            setBoardSize((prevSize) => ({
              ...prevSize,
              width: parseInt(e.target.value),
            }))
          }
        />
      </label>
      <label>
        Height:
        <input
          type="number"
          className={styles.sizeInput}
          value={boardSize.height}
          onChange={(e) =>
            setBoardSize((prevSize) => ({
              ...prevSize,
              height: parseInt(e.target.value),
            }))
          }
        />
      </label>
      <button type="button" onClick={handleSizeUpdate}>
        Update Size
      </button>
    </form>
  );
};

export default UpdateSizeForm;
