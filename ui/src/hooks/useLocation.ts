"use client"
import { useState } from "react"

export default function useLocation() {
  const [userLatitude, setUserLatitude] = useState(0)
  const [userLongitude, setUserLongitude] = useState(0)

  const getLocation = async () => {
    console.log("getLocation")
    if (navigator.geolocation) {
      console.log(navigator.geolocation)
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLatitude(position.coords.latitude)
        setUserLongitude(position.coords.longitude)

        alert("Latitude: " + position.coords.latitude +
          "\nLongitude: " + position.coords.longitude);
      })
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  return {
    getLocation,
    userLatitude,
    userLongitude
  };
}