"use client"
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import "./map.css"
import 'leaflet/dist/leaflet.css';

export default function Map() {
  return (
    <div className="map">
      <MapContainer center={[35.6895, 139.6917]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://basemaps.cartocdn.com/copyright">Basemaps</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  )
}