import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';
import { Category, TransactionType } from '../types';
import { ArrowLeft } from 'lucide-react';

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
  const [selectedSampleImage, setSelectedSampleImage] = useState(0);

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const coords = buildingCoords[locationLabel] || [10.7769, 106.7009];

    addItem({
      title: title.trim(),
      description: description.trim(),
      image_url: sampleImages[selectedSampleImage],
      category,
      transaction_type: transactionType,
      latitude: coords[0],
      longitude: coords[1],
      location_label: locationLabel,
    });

    navigate('/');
  };

  const inputClass = "w-full px-4 py-2.5 bg-paper-dark/40 border border-lead/20 rounded-sm text-sm text-ink placeholder:text-lead-light focus:outline-none focus:border-moss/50 focus:bg-paper transition-colors";
  const labelClass = "block text-sm text-ink mb-1.5";

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-lead hover:text-ink mb-6 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        quay lại
      </button>

      <div className="border border-lead/15 rounded-sm bg-paper p-6 sm:p-8">
        <h1 className="font-serif text-2xl font-bold text-ink mb-1">ghim món đồ lên bảng tin</h1>
        <p className="text-lead text-sm mb-6">viết vài dòng để hàng xóm biết bạn có gì nhé.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>tên món đồ</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="VD: Giáo trình Giải tích 1"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>mô tả</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="tình trạng, lý do cho/mượn, ai cần thì nhắn..."
              rows={4}
              className={`${inputClass} resize-none`}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>danh mục</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className={`${inputClass} bg-paper cursor-pointer`}
              >
                <option value="sách">sách</option>
                <option value="điện tử">điện tử</option>
                <option value="đồ gia dụng">đồ gia dụng</option>
                <option value="quần áo">quần áo</option>
                <option value="khác">khác</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>loại giao dịch</label>
              <select
                value={transactionType}
                onChange={e => setTransactionType(e.target.value as TransactionType)}
                className={`${inputClass} bg-paper cursor-pointer`}
              >
                <option value="cho tặng">cho tặng</option>
                <option value="cho mượn">cho mượn</option>
                <option value="trao đổi">trao đổi</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>vị trí (tòa nhà)</label>
            <select
              value={locationLabel}
              onChange={e => setLocationLabel(e.target.value)}
              className={`${inputClass} bg-paper cursor-pointer`}
            >
              {buildings.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>chọn ảnh minh họa</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {sampleImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedSampleImage(idx)}
                  className={`aspect-square rounded-sm overflow-hidden border-2 transition-all ${
                    selectedSampleImage === idx
                      ? 'border-moss ring-1 ring-moss/30'
                      : 'border-lead/20 hover:border-lead/40'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-moss text-paper font-medium rounded-sm hover:bg-moss-dark transition-colors"
          >
            ghim lên bảng tin
          </button>
        </form>
      </div>
    </div>
  );
}
