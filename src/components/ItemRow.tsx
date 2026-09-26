import React from 'react';
import { Link } from 'react-router-dom';
import { Item } from '../types';
import { MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ItemRowProps {
  item: Item;
  isNew?: boolean;
}

const transactionLabels: Record<string, string> = {
  'cho tặng': 'cho tặng',
  'cho mượn': 'cho mượn',
  'trao đổi': 'trao đổi',
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

export default function ItemRow({ item, isNew }: ItemRowProps) {
  const distance = getDistanceFromLatLon(10.7769, 106.7009, item.latitude, item.longitude);

  const stampClass = item.status === 'completed'
    ? 'stamp stamp-completed'
    : item.status === 'requested'
    ? 'stamp stamp-requested'
    : 'stamp stamp-available';

  const stampText = item.status === 'completed'
    ? 'đã trao xong'
    : item.status === 'requested'
    ? 'có người hỏi'
    : 'có sẵn';

  return (
    <div className={`group ${isNew ? 'item-pinned' : ''}`}>
      <Link
        to={`/item/${item.id}`}
        className="flex gap-4 py-5 border-b border-lead/20 hover:bg-paper-dark/50 transition-colors -mx-4 px-4 rounded-sm"
      >
        {/* Small image on left */}
        <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-sm overflow-hidden bg-paper-dark">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info on right */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-serif text-lg font-semibold text-ink leading-tight group-hover:text-moss-dark transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-lead mt-1 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Stamp on right */}
            <div className={`flex-shrink-0 ${stampClass}`}>
              {stampText}
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-4 mt-2 text-xs text-lead">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-butter/20 text-ink-light rounded-sm">
              {item.category}
            </span>
            <span className="text-lead-light">·</span>
            <span>{transactionLabels[item.transaction_type]}</span>
            <span className="text-lead-light">·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {distance.toFixed(1)} km
            </span>
            <span className="text-lead-light hidden sm:inline">·</span>
            <span className="hidden sm:inline">
              {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: vi })}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
