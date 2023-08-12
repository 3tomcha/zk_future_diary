type Location = {
  latitude: number;
  longitude: number;
};

export default function useSubMint() {
  const R = 6371; // 地球の半径 (キロメートル)

  /**
   * 角度をラジアンに変換します
   * @param degrees 角度
   * @returns ラジアン
   */
  const degreesToRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  /**
   * 2つの座標間の距離をキロメートルで計算します
   * @param lat1 緯度1
   * @param lon1 経度1
   * @param lat2 緯度2
   * @param lon2 経度2
   * @returns 距離 (キロメートル)
   */
  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  /**
   * 2つの座標が10km以内にあるかどうかを判定します
   * @param lat1 緯度1
   * @param lon1 経度1
   * @param lat2 緯度2
   * @param lon2 経度2
   * @returns 10km以内であればtrue、そうでなければfalse
   */
  const isWithin10Km = (lat1: number, lon1: number, lat2: number, lon2: number): boolean => {
    return haversineDistance(lat1, lon1, lat2, lon2) <= 10;
  };



  const subMint = (userLocation: Location, targetLocation: Location) => {
    console.log("subMint clicked")
    console.log(userLocation);
    console.log(targetLocation);

    if (isWithin10Km(userLocation.latitude, userLocation.longitude, targetLocation.latitude, targetLocation.longitude))
      console.log("subMint works")
  }

  return {
    subMint
  }
}