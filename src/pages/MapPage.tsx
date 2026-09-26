import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../store/AppContext';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.DivIcon({
  html: `<div style="
    width: 18px;
    height: 18px;
    background: #566B4F;
    border-radius: 50%;
    border: 2px solid #FAF6EE;
    box-shadow: 0 2px 6px rgba(38,32,25,0.25);
    transition: transform 0.2s ease;
  "></div>`,
  className: 'custom-marker',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -12],
});

const statusText: Record<string, string> = {
  'available': 'có sẵn',
  'requested': 'có người hỏi',
  'completed': 'đã trao xong',
};

export default function MapPage() {
  const { items } = useApp();
  const center: [number, number] = [10.7769, 106.7009];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6 pb-4 border-b border-lead/20">
        <h1 className="font-serif text-2xl font-bold text-ink mb-1">bản đồ khu vực</h1>
        <p className="text-lead text-sm">
          mỗi chấm là một món đồ — click để xem ai đang để lại gì gần bạn.
        </p>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-4 text-sm text-lead">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-moss" />
          <span>món đồ</span>
        </div>
      </div>

      <div className="rounded-sm border border-lead/20 overflow-hidden" style={{ height: '550px' }}>
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
                <div className="min-w-[180px]">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-20 object-cover rounded-sm mb-2"
                  />
                  <h3 className="font-serif font-semibold text-sm text-ink leading-tight">{item.title}</h3>
                  <p className="text-xs text-lead mt-0.5">{item.location_label}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-lead">{statusText[item.status]}</span>
                  </div>
                  <Link
                    to={`/item/${item.id}`}
                    className="mt-2 block text-center px-3 py-1.5 bg-moss text-paper text-xs font-medium rounded-sm hover:bg-moss-dark transition-colors"
                  >
                    xem chi tiết →
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
