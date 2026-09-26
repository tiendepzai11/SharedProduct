import React from 'react';
import { useApp } from '../store/AppContext';
import MapView from '../components/MapView';

export default function MapPage() {
  const { items } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6 pb-4 border-b border-lead/20">
        <h1 className="font-serif text-2xl font-bold text-ink mb-1">bản đồ khu vực</h1>
        <p className="text-lead text-sm">
          mỗi chấm là một món đồ — click để xem ai đang để lại gì gần bạn.
        </p>
      </div>

      <MapView items={items} />
    </div>
  );
}
