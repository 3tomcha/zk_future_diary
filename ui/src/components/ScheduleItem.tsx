import styles from "./ScheduleItem.module.css";

type Schedule = {
  time: string;
  value: string;
  image?: string;
  onVerify: () => void;
};

export default function ScheduleItem({ time, value, image, onVerify }: Schedule) {
  return (
    <>
      <li className={styles.scheduleItem}>
        <div>
          <span className={styles.time}>{time}</span>: {value}
        </div>
        <div className={styles.verifyButtons}>
          <button className={styles.verify} onClick={onVerify}>verify time</button>
          <button className={styles.verify} onClick={onVerify}>verify location</button>
          <button className={styles.verify} onClick={onVerify}>verify activity</button>
        </div>
      </li>
      {image && <img src={image} alt="aa" />}
    </>
  );
}
