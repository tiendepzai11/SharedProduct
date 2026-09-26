import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';
import { Category, TransactionType } from '../types';
import { MapPin, Upload, ArrowLeft } from 'lucide-react';

const buildings = [
  'Tòa A1 - KTX Khu A',
  'Tòa A2 - KTX Khu A',
  'Tòa B1 - KTX Khu B',
  'Tòa B3 - KTX Khu B',
  'Tòa C2 - KTX Khu C',
  'Nhà trọ 123 Nguyễn Văn Bá',
  'Chung cư 4S Linh Đông',
  'Tòa D1 - KTX ĐHQG',
];

const buildingCoords: Record<string, [number, number]> = {
  'Tòa A1 - KTX Khu A': [10.7779, 106.7029],
  'Tòa A2 - KTX Khu A': [10.7749, 106.7039],
  'Tòa B1 - KTX Khu B': [10.7799, 106.6999],
  'Tòa B3 - KTX Khu B': [10.7759, 106.6979],
  'Tòa C2 - KTX Khu C': [10.7809, 106.7049],
  'Nhà trọ 123 Nguyễn Văn Bá': [10.7739, 106.7019],
  'Chung cư 4S Linh Đông': [10.7789, 106.6969],
  'Tòa D1 - KTX ĐHQG': [10.7734, 106.6985],
};

const sampleImages = [
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=300&fit=crop',
];

export default function AddItemPage() {
  const { currentUser, addItem } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('sách');
  const [transactionType, setTransactionType] = useState<TransactionType>('cho tặng');
  const [locationLabel, setLocationLabel] = useState(buildings[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [useSampleImage, setUseSampleImage] = useState(true);
  const [selectedSampleImage, setSelectedSampleImage] = useState(0);

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const coords = buildingCoords[locationLabel] || [10.7769, 106.7009];
    const finalImageUrl = useSampleImage
      ? sampleImages[selectedSampleImage]
      : imageUrl || sampleImages[0];

    addItem({
      title: title.trim(),
      description: description.trim(),
      image_url: finalImageUrl,
      category,
      transaction_type: transactionType,
      latitude: coords[0],
      longitude: coords[1],
      location_label: locationLabel,
    });

    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Quay lại</span>
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng đồ dùng</h1>
        <p className="text-gray-500 mb-6">Chia sẻ món đồ bạn không cần nữa với hàng xóm</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên món đồ *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="VD: Giáo trình Giải tích 1"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả *</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Mô tả tình trạng, lý do cho/mượn..."
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              >
                <option value="sách">📚 Sách</option>
                <option value="điện tử">📱 Điện tử</option>
                <option value="đồ gia dụng">🏠 Đồ gia dụng</option>
                <option value="quần áo">👕 Quần áo</option>
                <option value="khác">📦 Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại giao dịch</label>
              <select
                value={transactionType}
                onChange={e => setTransactionType(e.target.value as TransactionType)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              >
                <option value="cho tặng">🎁 Cho tặng</option>
                <option value="cho mượn">🤝 Cho mượn</option>
                <option value="trao đổi">🔄 Trao đổi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <MapPin className="w-4 h-4 inline mr-1" />
              Vị trí
            </label>
            <select
              value={locationLabel}
              onChange={e => setLocationLabel(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
            >
              {buildings.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Upload className="w-4 h-4 inline mr-1" />
              Hình ảnh
            </label>
            <div className="flex items-center gap-4 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={useSampleImage}
                  onChange={() => setUseSampleImage(true)}
                  className="text-emerald-500"
                />
                <span className="text-sm text-gray-600">Chọn ảnh mẫu</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!useSampleImage}
                  onChange={() => setUseSampleImage(false)}
                  className="text-emerald-500"
                />
                <span className="text-sm text-gray-600">Nhập URL ảnh</span>
              </label>
            </div>

            {useSampleImage ? (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {sampleImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSampleImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedSampleImage === idx ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all duration-200"
          >
            Đăng món đồ
          </button>
        </form>
      </div>
    </div>
  );
}
