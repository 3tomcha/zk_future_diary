"use client"
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import "./map.css"
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import L from 'leaflet';
import useClient from "../hooks/useClient";
import { SBTAbi } from "../abi/SBT.abi";
import { SBTContractAddress } from "../const/contract";

type NFTs = {
  image: string,
  latitude: number,
  longitude: number,
}[]

const createCustomIcon = (hash: string) => {
  return new L.Icon({
    iconUrl: `https://gateway.pinata.cloud/ipfs/${hash}`,
    iconSize: [100, 100],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
  });
}

export default function Map() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const { publicClient } = useClient();
  const [nfts, setNFTs] = useState<NFTs>();


  const getNFTInfo = async () => {
    const currentTokenId = await publicClient.readContract({
      address: SBTContractAddress,
      abi: SBTAbi,
      functionName: "currentTokenId",
    })
    const nfts = [];
    for (let index = 3; index <= currentTokenId; index++) {
      const res = await publicClient.readContract({
        address: SBTContractAddress,
        abi: SBTAbi,
        functionName: "tokenURI",
        args: [BigInt(index)],
      })
      console.log(res)
      const res1 = await fetch(`https://gateway.pinata.cloud/ipfs/${res}`);
      console.log(res1)
      const json1 = await res1?.json()
      console.log(json1)
      const image1 = json1?.image?.split("ipfs://")[1]
      console.log(image1)
      const latitude = parseFloat(json1?.attribute?.latitude);
      const longitude = parseFloat(json1?.attribute?.longitude);
      console.log(image1)
      console.log(latitude)
      console.log(longitude)
      if (latitude && longitude) {
        nfts.push({
          image: image1,
          latitude: latitude,
          longitude: longitude
        })
      }
    }
    setNFTs(nfts)
  }

  const setPosition = () => {
    const hash = "0x5a10d152072832823c38e964E382CD22C00a8d7E";
    const hashNumber = BigInt(hash);

    // ハッシュ値を範囲 0-1 にマッピング
    const normalizedLat = (Number(hashNumber % BigInt(1000000)) / 1000000);
    const normalizedLon = (Number((hashNumber / BigInt(1000000)) % BigInt(1000000)) / 1000000);

    const mapValue = (value: number, start1: number, stop1: number, start2: number, stop2: number) => {
      return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    };

    const _latitude = mapValue(normalizedLat, 0, 1, 35.525, 35.815);
    const _longitude = mapValue(normalizedLon, 0, 1, 139.595, 139.925);
    setLatitude(_latitude)
    setLongitude(_longitude)
  }
  return (
    <div className="map">
      <button onClick={getNFTInfo}>getNFTInfo</button>
      <button onClick={setPosition}>setPosition</button>
      <MapContainer center={[35.6895, 139.6917]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://basemaps.cartocdn.com/copyright">Basemaps</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png"
        />
        {nfts?.map(nft => {
          const icon = createCustomIcon(nft.image)
          return (
            <Marker position={[nft.latitude, nft.longitude]} icon={icon} key={nft.latitude}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          )
        }
        )}
      </MapContainer>
    </div>
  )
}