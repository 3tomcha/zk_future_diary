"use client"
import { MapContainer, TileLayer, useMap, Marker, Popup, Circle } from 'react-leaflet'
import "./map.css"
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import useClient from "../hooks/useClient";
import { SBTAbi } from "../abi/SBT.abi";
import { SBTContractAddress } from "../const/contract";
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import useLocation from '../hooks/useLocation';

type NFTs = {
  image: string,
  latitude: number,
  longitude: number,
  tokenId: number,
  isOwner?: boolean
}[]

const createCustomIcon = (hash: string, isOwner: boolean) => {
  return new L.Icon({
    iconUrl: `https://gateway.pinata.cloud/ipfs/${hash}`,
    iconSize: isOwner ? [120, 120] : [100, 100],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    className: isOwner ? 'owner-icon' : 'icon'
  });
}

const userIcon = new L.Icon({
  iconUrl: '/person-icon.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

export default function Map() {
  const { publicClient } = useClient();
  const [nfts, setNFTs] = useState<NFTs>();
  const { address } = useAccount();
  const { getLocation, userLatitude, userLongitude } = useLocation();

  const { connect } = useConnect({
    connector: new InjectedConnector
  });

  const handleConnect = async () => {
    await connect();
  }

  useEffect(() => {
    const fetchNFTData = async () => {
      await handleConnect();
      await getNFTInfo();
      await setTokenOwner();
    };

    fetchNFTData();
  }, []);


  const setTokenOwner = async () => {
    console.log("setTokenOwner")
    console.log(nfts)
    console.log(address)
    if (!nfts) return;

    const promises = nfts.map(async (nft) => {
      const owner = await publicClient.readContract({
        address: SBTContractAddress,
        abi: SBTAbi,
        functionName: "ownerOf",
        args: [BigInt(nft.tokenId)],
      });
      console.log(owner)
      return { ...nft, isOwner: owner === address };
    });

    const newNFTs = await Promise.all(promises);
    setNFTs(newNFTs);
    console.log(newNFTs)
    console.log(nfts)
  }

  const getNFTInfo = async () => {
    const currentTokenId = await publicClient.readContract({
      address: SBTContractAddress,
      abi: SBTAbi,
      functionName: "currentTokenId",
    })
    const nfts = [];
    for (let index = 3; index <= Number(currentTokenId); index++) {
      const res = await publicClient.readContract({
        address: SBTContractAddress,
        abi: SBTAbi,
        functionName: "tokenURI",
        args: [BigInt(index)],
      })
      console.log(index)
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
          longitude: longitude,
          tokenId: index
        })
      }
    }
    setNFTs(nfts)
  }

  return (
    <div className="map">
      <button onClick={getLocation}>getLocation</button>
      <MapContainer center={[35.6895, 139.6917]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://basemaps.cartocdn.com/copyright">Basemaps</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png"
        />
        {nfts?.map(nft => {
          const icon = createCustomIcon(nft.image, Boolean(nft.isOwner))
          return (
            <>
              <Marker position={[nft.latitude, nft.longitude]} icon={icon} key={nft.latitude}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
              <Circle
                center={[nft.latitude, nft.longitude]}
                radius={10000} // 半径を10km（10000m）として設定
                fillOpacity={0.5}
                color="gold"
                fillColor="gold"
              />
            </>
          )
        }
        )}
        {
          userLatitude &&
          <Marker position={[userLatitude, userLongitude]} icon={userIcon} />
        }
      </MapContainer>
    </div>
  )
}