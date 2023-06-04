import type { userInputArray } from '../../pages';
import Counter from '../Counter/Counter';
import RestartButton from '../RestartButton/RestartButton';
import styles from './Header.module.css';

type HeaderProps = {
  userInput: userInputArray;
  displayNum: {
    placeableFlagCount: string;
    counterCount: string;
  };
  faceValue: 11 | 12 | 13;
  restartGame: () => void;
};

const Header = ({ userInput, displayNum, faceValue, restartGame }: HeaderProps) => {
  return (
    <div
      className={styles.header}
      style={userInput[0].length < 3 ? { display: 'none' } : { display: 'flex' }}
    >
      <Counter userInput={userInput} displayNum={displayNum} displayVal={'placeableFlagCount'} />
      <RestartButton restartGame={restartGame} userInput={userInput} faceValue={faceValue} />
      <Counter userInput={userInput} displayNum={displayNum} displayVal={'counterCount'} />
    </div>
  );
};

export default Header;
