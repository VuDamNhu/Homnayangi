"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";

// Fix Leaflet marker icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function LeafletMap({ 
  userLocation, 
  setUserLocation,
  places, 
  selectedPlace, 
  setSelectedPlace 
}: { 
  userLocation: { lat: number; lng: number }; 
  setUserLocation: (loc: { lat: number; lng: number }) => void;
  places: any[]; 
  selectedPlace: any; 
  setSelectedPlace: (place: any) => void;
}) {
  const mapCenter: [number, number] = selectedPlace 
    ? [selectedPlace.lat, selectedPlace.lng]
    : [userLocation.lat, userLocation.lng];

  return (
    <MapContainer center={mapCenter} zoom={15} style={{ width: "100%", height: "100%", zIndex: 10 }}>
      <ChangeView center={mapCenter} zoom={selectedPlace ? 17 : 15} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* User Marker */}
      <Marker 
        position={[userLocation.lat, userLocation.lng]} 
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const position = marker.getLatLng();
            setUserLocation({ lat: position.lat, lng: position.lng });
          }
        }}
        icon={new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })}>
        <Popup>Kéo thả tôi để chọn vị trí chính xác!</Popup>
      </Marker>

      {/* Places Markers */}
      {places.map((place) => (
        <Marker 
          key={place.id} 
          position={[place.lat, place.lng]}
          eventHandlers={{ click: () => setSelectedPlace(place) }}
        />
      ))}

      {/* Auto-open Popup for selected place */}
      {selectedPlace && (
        <Popup 
          position={[selectedPlace.lat, selectedPlace.lng]} 
          eventHandlers={{ remove: () => setSelectedPlace(null) }}
          className="custom-popup"
        >
          <div className="font-bold text-base mb-1 text-zen-gold">{selectedPlace.name}</div>
          <div className="text-xs text-on-surface-variant mb-1">{selectedPlace.address}</div>
          <div className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full inline-block font-bold">
            Cách bạn {selectedPlace.distance} km
          </div>
        </Popup>
      )}
    </MapContainer>
  );
}
