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

  const showError = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      default:
        alert("An unknown error occurred.");
        break;
    }
  }

  return {
    getLocation,
    showPosition,
    userLatitude,
    userLongitude
  };
}
