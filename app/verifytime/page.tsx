// app/verifytime/page.tsx
import React from 'react';

const VerifyTimePage = async () => {
  // 現在の時間を取得
  const getCurrentTime = () => {
    const now = new Date();
    return now.toISOString(); // ISO 8601形式で時間を返す
  };

  // ゼロ知識証明に渡すために現在の時間を取得
  const currentTime = getCurrentTime();
  console.log("Current Time:", currentTime);

  return (
    <div>
      <h1>現在の時間</h1>
      <p>{currentTime}</p>
    </div>
  );
};

export default VerifyTimePage;
