import { useEffect, useState } from "react";
import styles from "./ScheduleItem.module.css";
import { useGenerateImage } from "@/hooks/useGenerateImage";

type Schedule = {
  time: string;
  value: string;
  location: string;
  image?: string;
  onVerify: (startTimestamp: Number, endTimestamp: Number) => void;
};

function convertTimeToTimestamp(time: string): number {
  // 現在の日付を取得
  const today = new Date();

  // 05:00のような時刻を "hours:minutes" 形式で受け取る
  const [hours, minutes] = time.split(':').map(Number);

  // 今日の日付にその時刻を設定
  today.setHours(hours, minutes, 0, 0);

  // UNIXタイムスタンプに変換（ミリ秒を秒に変換）
  return Math.floor(today.getTime() / 1000);
}

export default function ScheduleItem({ time, value, location, onVerify }: Schedule) {
  const { image, fetchImage } = useGenerateImage();
  const handleImage = async () => {
    await fetchImage(value)
  }
  const handleVerifyTime = () => {
    const startTimestamp = convertTimeToTimestamp(time);
    const endTimestamp = convertTimeToTimestamp(time) + 3600;
    onVerify(startTimestamp, endTimestamp)
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
          <button className={styles.verify} onClick={handleVerifyTime}>verify time</button>
          <button className={styles.verify} onClick={handleVerifyTime}>verify activity</button>
          <button className={styles.verify} onClick={handleVerifyTime}>verify location</button>
        </div>
      </li>
    </>
  );
}
