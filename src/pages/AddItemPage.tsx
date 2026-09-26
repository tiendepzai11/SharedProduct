import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';
import { Category, TransactionType } from '../types';
import { ArrowLeft } from 'lucide-react';

// Danh sách địa điểm rải khắp TP.HCM
const locations = [
  'Quận 1 - Chợ Bến Thành',
  'Quận 1 - Nhà văn hóa Thanh Niên',
  'Quận 1 - Phường Đa Kao',
  'Quận 2 - Thảo Điền',
  'Quận 2 - Khu đô thị Thủ Thiêm',
  'Quận 7 - Phú Mỹ Hưng',
  'Quận 7 - Khu chế xuất Tân Thuận',
  'Quận 10 - Đại học Bách Khoa',
  'Quận 10 - Công viên Lê Thị Riêng',
  'Bình Thạnh - Vinhomes Central Park',
  'Bình Thạnh - Chợ Bà Chiểu',
  'Bình Thạnh - Landmark 81',
  'Gò Vấp - Công viên Gia Định',
  'Gò Vấp - Chợ Hạnh Thông Tây',
  'Tân Bình - Công viên Hoàng Văn Thụ',
  'Tân Bình - AEON Mall Tân Phú',
  'Bình Tân - AEON Mall Bình Tân',
  'Thủ Đức - Khu đô thị Sala',
  'Thủ Đức - Đại học Quốc Gia',
  'Bình Chánh - Khu dân cư Trung Sơn',
  'Bình Chánh - Khu đô thị Nam Sài Gòn',
  'Quận 3 - Hồ Con Rùa',
  'Quận 5 - Chợ Lớn',
  'Quận Phú Nhuận - Chợ Phú Nhuận',
];

// Tọa độ tương ứng với từng địa điểm
const locationCoords: Record<string, [number, number]> = {
  'Quận 1 - Chợ Bến Thành': [10.7734, 106.6969],
  'Quận 1 - Nhà văn hóa Thanh Niên': [10.7716, 106.6997],
  'Quận 1 - Phường Đa Kao': [10.7766, 106.7049],
  'Quận 2 - Thảo Điền': [10.7786, 106.7169],
  'Quận 2 - Khu đô thị Thủ Thiêm': [10.7876, 106.7199],
  'Quận 7 - Phú Mỹ Hưng': [10.7506, 106.7099],
  'Quận 7 - Khu chế xuất Tân Thuận': [10.7436, 106.7269],
  'Quận 10 - Đại học Bách Khoa': [10.7776, 106.6869],
  'Quận 10 - Công viên Lê Thị Riêng': [10.7826, 106.6769],
  'Bình Thạnh - Vinhomes Central Park': [10.7836, 106.7069],
  'Bình Thạnh - Chợ Bà Chiểu': [10.7906, 106.7039],
  'Bình Thạnh - Landmark 81': [10.7846, 106.7079],
  'Gò Vấp - Công viên Gia Định': [10.8036, 106.6939],
  'Gò Vấp - Chợ Hạnh Thông Tây': [10.8126, 106.6829],
  'Tân Bình - Công viên Hoàng Văn Thụ': [10.7936, 106.6839],
  'Tân Bình - AEON Mall Tân Phú': [10.7986, 106.6289],
  'Bình Tân - AEON Mall Bình Tân': [10.7576, 106.6669],
  'Thủ Đức - Khu đô thị Sala': [10.7876, 106.7199],
  'Thủ Đức - Đại học Quốc Gia': [10.8006, 106.7059],
  'Bình Chánh - Khu dân cư Trung Sơn': [10.7436, 106.6899],
  'Bình Chánh - Khu đô thị Nam Sài Gòn': [10.7386, 106.6989],
  'Quận 3 - Hồ Con Rùa': [10.7816, 106.6919],
  'Quận 5 - Chợ Lớn': [10.7556, 106.6649],
  'Quận Phú Nhuận - Chợ Phú Nhuận': [10.7946, 106.6819],
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
  const [locationLabel, setLocationLabel] = useState(locations[0]);
  const [selectedSampleImage, setSelectedSampleImage] = useState(0);

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const coords = locationCoords[locationLabel] || [10.7756, 106.7019];

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
        <h1 className="font-serif text-2xl font-bold text-ink mb-1">ghim món đồ lên bảng tin thành phố</h1>
        <p className="text-lead text-sm mb-6">viết vài dòng để mọi người trong thành phố biết bạn có gì nhé.</p>

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
            <label className={labelClass}>vị trí của bạn (chọn gần nơi bạn ở nhất)</label>
            <select
              value={locationLabel}
              onChange={e => setLocationLabel(e.target.value)}
              className={`${inputClass} bg-paper cursor-pointer`}
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
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
            ghim lên bảng tin thành phố
          </button>
        </form>
      </div>
    </div>
  );
}
