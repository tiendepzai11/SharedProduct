import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../store/AppContext';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

// Use custom div icon instead of default marker images

const customIcon = new L.DivIcon({
  html: `<div style="background: linear-gradient(135deg, #10b981, #0d9488); width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
  className: 'custom-marker',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

const statusColors: Record<string, string> = {
  'available': 'bg-green-500',
  'requested': 'bg-yellow-500',
  'completed': 'bg-gray-400',
};

const statusLabels: Record<string, string> = {
  'available': 'Có sẵn',
  'requested': 'Đã có người hỏi',
  'completed': 'Đã trao xong',
};

export default function MapPage() {
  const { items } = useApp();

  const center: [number, number] = [10.7769, 106.7009];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bản đồ khu vực</h1>
        <p className="text-gray-500 mt-1">Xem vị trí các món đồ trên bản đồ. Click vào marker để xem chi tiết.</p>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4">
        {Object.entries(statusLabels).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${statusColors[key]}`} />
            <span className="text-sm text-gray-600">{label}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg" style={{ height: '600px' }}>
        <MapContainer
          center={center}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {items.map(item => (
            <Marker
              key={item.id}
              position={[item.latitude, item.longitude]}
              icon={customIcon}
            >
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-semibold text-sm text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{item.location_label}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`w-2 h-2 rounded-full ${statusColors[item.status]}`} />
                    <span className="text-xs text-gray-500">{statusLabels[item.status]}</span>
                  </div>
                  <Link
                    to={`/item/${item.id}`}
                    className="mt-2 block text-center px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Xem chi tiết →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
