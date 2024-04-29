"use client"
import useLocation from '../hooks/useLocation';
import { useState } from "react";
// ユーザーの位置情報の取得
// verifyapi

export default function Verify() {
  const { getLocation, userLatitude, userLongitude } = useLocation();
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handlePosition = async () => {
    const res = await fetch(`/api/position`)
    console.log(res)
    if (res.ok) {
      const position = await res.json();
      console.log(position);
      setLatitude(position.latitude);
      setLongitude(position.longitude);
    }
  }

  return (
    <div className="container">
      <button onClick={getLocation}>getLocation</button>
      <button onClick={handlePosition}>handlePosition</button>
      <h1>未来日記</h1>
    </div>
  )
}