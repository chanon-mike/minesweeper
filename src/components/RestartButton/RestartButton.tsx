import type { userInputArray } from '../../utils/boardUtils';
import styles from './RestartButton.module.css';

type RestartButtonProps = {
  userInput: userInputArray;
  faceValue: 11 | 12 | 13;
  restartGame: () => void;
};

const RestartButton = ({ restartGame, userInput, faceValue }: RestartButtonProps) => {
  return (
    <button
      onClick={restartGame}
      className={styles.restart}
      style={
        userInput[0].length < 6
          ? { display: 'none' }
          : { display: 'flex' } && { backgroundPosition: `${-29.95 * 1.5 * faceValue}px` }
      }
    />
  );
};

export default RestartButton;
