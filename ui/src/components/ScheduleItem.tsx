import { useEffect, useState } from "react";
import styles from "./ScheduleItem.module.css";
import { useGenerateImage } from "@/hooks/useGenerateImage";

type Schedule = {
  time: string;
  value: string;
  location: string;
  image?: string;
  onVerify: () => void;
};

export default function ScheduleItem({ time, value, location, onVerify, onImage }: Schedule) {
  const { image, fetchImage } = useGenerateImage();
  const handleImage = async () => {
    await fetchImage(value)
  }
  return (
    <>
      <li className={styles.scheduleItem}>
        <div className={styles.container}>
          <span className={styles.time}>{time}</span>: {value}: {location}
          {image && (
            <img src={image} className={styles.image} alt="aa" />
          )}
        </div>
        <div className={styles.verifyButtons}>
          <button onClick={handleImage}>create image</button>
          <button className={styles.verify} onClick={onVerify}>verify time</button>
          <button className={styles.verify} onClick={onVerify}>verify activity</button>
          <button className={styles.verify} onClick={onVerify}>verify location</button>
        </div>
      </li>
    </>
  );
}
