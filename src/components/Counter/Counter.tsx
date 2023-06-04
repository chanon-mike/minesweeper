import type { userInputArray } from '../../pages';
import styles from './Counter.module.css';

type CounterProps = {
  userInput: userInputArray;
  displayNum: {
    placeableFlagCount: string;
    counterCount: string;
  };
  displayVal: 'placeableFlagCount' | 'counterCount';
};

const Counter = ({ userInput, displayNum, displayVal }: CounterProps) => {
  if (displayVal === 'placeableFlagCount') {
    return (
      <div
        className={styles.number}
        style={userInput[0].length < 3 ? { display: 'none' } : { display: 'flex' } && { left: 10 }}
      >
        <div className={styles.backgroundNum}>888</div>
        <span>{displayNum.placeableFlagCount.charAt(0)}</span>
        <span>{displayNum.placeableFlagCount.charAt(1)}</span>
        <span>{displayNum.placeableFlagCount.charAt(2)}</span>
      </div>
    );
  } else if (displayVal === 'counterCount') {
    return (
      <div
        className={styles.number}
        style={userInput[0].length < 4 ? { display: 'none' } : { display: 'flex' } && { right: 10 }}
      >
        <div className={styles.backgroundNum}>888</div>
        <span>{displayNum.counterCount.charAt(0)}</span>
        <span>{displayNum.counterCount.charAt(1)}</span>
        <span>{displayNum.counterCount.charAt(2)}</span>
      </div>
    );
  } else {
    return null;
  }
};

export default Counter;
