import styles from "../styles/OptionCard.module.css";

function OptionCard({ onClick, top, bottom }) {
  return (
    <button type="button" className={styles.optionCard} onClick={onClick}>
      <div className={styles.topHalf}>{top}</div>
      <div className={styles.bottomHalf}>{bottom}</div>
    </button>
  );
}

export default OptionCard;
