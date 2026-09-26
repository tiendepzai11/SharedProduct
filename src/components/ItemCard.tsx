import React from 'react';
import { Link } from 'react-router-dom';
import { Item } from '../types';
import { MapPin, Clock, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ItemCardProps {
  item: Item;
}

const categoryColors: Record<string, string> = {
  'sách': 'bg-blue-100 text-blue-700',
  'điện tử': 'bg-purple-100 text-purple-700',
  'đồ gia dụng': 'bg-orange-100 text-orange-700',
  'quần áo': 'bg-pink-100 text-pink-700',
  'khác': 'bg-gray-100 text-gray-700',
};

const transactionLabels: Record<string, string> = {
  'cho tặng': 'Cho tặng',
  'cho mượn': 'Cho mượn',
  'trao đổi': 'Trao đổi',
};

const statusLabels: Record<string, { text: string; color: string }> = {
  'available': { text: 'Có sẵn', color: 'bg-green-100 text-green-700 border-green-200' },
  'requested': { text: 'Đã có người hỏi', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  'completed': { text: 'Đã trao xong', color: 'bg-gray-100 text-gray-500 border-gray-200' },
};

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

export default function ItemCard({ item }: ItemCardProps) {
  const distance = getDistanceFromLatLon(10.7769, 106.7009, item.latitude, item.longitude);
  const statusInfo = statusLabels[item.status];

  return (
    <Link to={`/item/${item.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColors[item.category]}`}>
              {item.category}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-2 left-3 flex items-center gap-1 text-white/90 text-xs">
            <MapPin className="w-3 h-3" />
            <span>{distance.toFixed(1)} km</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
            {item.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Tag className="w-3 h-3" />
              <span>{transactionLabels[item.transaction_type]}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: vi })}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
