import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Item } from '../types';
import 'leaflet/dist/leaflet.css';

function getDistanceFromLatLon(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Custom marker icon - xanh rêu cho "có sẵn"
const availableIcon = new L.DivIcon({
  html: `<div class="map-marker map-marker-available"></div>`,
  className: 'custom-marker',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -12],
});

// Custom marker icon - cam đất cho "có người hỏi"
const requestedIcon = new L.DivIcon({
  html: `<div class="map-marker map-marker-requested"></div>`,
  className: 'custom-marker',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -12],
});

interface MapViewProps {
  items: Item[];
}

export default function MapView({ items }: MapViewProps) {
  const center: [number, number] = [10.7769, 106.7009];

  // Chỉ hiển thị món "có sẵn" hoặc "có người hỏi"
  const visibleItems = items.filter(item => item.status === 'available' || item.status === 'requested');

  if (visibleItems.length === 0) {
    return (
      <div className="border border-lead/15 rounded-sm bg-paper p-8 text-center">
        <p className="text-lead text-sm">không có món đồ nào để hiển thị trên bản đồ</p>
      </div>
    );
  }

  return (
    <div>
      {/* Legend */}
      <div className="flex gap-6 mb-3 text-sm text-lead">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-moss" />
          <span>có sẵn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-terracotta" />
          <span>có người hỏi</span>
        </div>
      </div>

      <div className="rounded-sm border border-lead/20 overflow-hidden" style={{ height: '500px' }}>
        <MapContainer
          center={center}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          {/* Primary tile layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            errorTileUrl="https://a.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
          />
          {/* Fallback tile layer */}
          <TileLayer
            url="https://a.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {visibleItems.map(item => {
            const icon = item.status === 'available' ? availableIcon : requestedIcon;
            const distance = getDistanceFromLatLon(center[0], center[1], item.latitude, item.longitude);

            return (
              <Marker
                key={item.id}
                position={[item.latitude, item.longitude]}
                icon={icon}
              >
                <Popup>
                  <div className="min-w-[180px]">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-20 object-cover rounded-sm mb-2"
                    />
                    <h3 className="font-serif font-semibold text-sm text-ink leading-tight">{item.title}</h3>
                    <p className="text-xs text-lead mt-1">{distance.toFixed(1)} km · {item.location_label}</p>
                    <Link
                      to={`/item/${item.id}`}
                      className="mt-2 block text-center px-3 py-1.5 bg-moss text-paper text-xs font-medium rounded-sm hover:bg-moss-dark transition-colors"
                    >
                      xem chi tiết →
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Attribution */}
      <div className="mt-2 text-xs text-lead text-center">
        © OpenStreetMap contributors
      </div>
    </div>
  );
}
