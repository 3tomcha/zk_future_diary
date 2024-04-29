"use client"
import { useState } from "react"

export default function useLocation() {
  const [userLatitude, setUserLatitude] = useState(0)
  const [userLongitude, setUserLongitude] = useState(0)

  const getLocation = () => {
    console.log("getLocation")
    if (navigator.geolocation) {
      console.log(navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
      }))
      // 位置情報を取得する
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  const showPosition = (position: GeolocationPosition) => {
    console.log(position)
    alert("Latitude: " + position.coords.latitude +
      "\nLongitude: " + position.coords.longitude);
    setUserLatitude(position.coords.latitude)
    setUserLongitude(position.coords.longitude)
  }

  return {
    getLocation,
    showPosition,
    userLatitude,
    userLongitude
  };
}
