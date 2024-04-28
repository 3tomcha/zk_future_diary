"use client"
import useLocation from '../hooks/useLocation';
// ユーザーの位置情報の取得
// verifyapi

export default function Verify() {
  const { getLocation, userLatitude, userLongitude } = useLocation();

  return (
    <div className="container">
      <button onClick={getLocation}>getLocation</button>
      <h1>未来日記</h1>
    </div>
  )
}