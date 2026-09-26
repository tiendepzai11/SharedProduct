import React, { useState, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import ItemCard from '../components/ItemCard';
import { Category, TransactionType, ItemStatus } from '../types';
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

type SortOption = 'newest' | 'nearest';

export default function HomePage() {
  const { items } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [transactionType, setTransactionType] = useState<TransactionType | 'all'>('all');
  const [status, setStatus] = useState<ItemStatus | 'all'>('all');
  const [sort, setSort] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(item =>
        item.title.toLowerCase().includes(s) ||
        item.description.toLowerCase().includes(s)
      );
    }
    if (category !== 'all') result = result.filter(item => item.category === category);
    if (transactionType !== 'all') result = result.filter(item => item.transaction_type === transactionType);
    if (status !== 'all') result = result.filter(item => item.status === status);

    if (sort === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      const centerLat = 10.7769, centerLng = 106.7009;
      result.sort((a, b) => {
        const distA = Math.sqrt(Math.pow(a.latitude - centerLat, 2) + Math.pow(a.longitude - centerLng, 2));
        const distB = Math.sqrt(Math.pow(b.latitude - centerLat, 2) + Math.pow(b.longitude - centerLng, 2));
        return distA - distB;
      });
    }

    return result;
  }, [items, search, category, transactionType, status, sort]);

  const categories: (Category | 'all')[] = ['all', 'sách', 'điện tử', 'đồ gia dụng', 'quần áo', 'khác'];
  const transactionTypes: (TransactionType | 'all')[] = ['all', 'cho tặng', 'cho mượn', 'trao đổi'];
  const statuses: (ItemStatus | 'all')[] = ['all', 'available', 'requested', 'completed'];

  const statusLabels: Record<string, string> = {
    'all': 'Tất cả',
    'available': 'Có sẵn',
    'requested': 'Đã có người hỏi',
    'completed': 'Đã trao xong',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Chia sẻ đồ dùng trong{' '}
          <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            khu dân cư
          </span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Kết nối sinh viên trong ký túc xá. Cho tặng, cho mượn hoặc trao đổi đồ dùng với người ở gần bạn.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm đồ dùng..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
              showFilters ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Bộ lọc</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4 shadow-sm animate-in fade-in">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Danh mục</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      category === cat
                        ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {cat === 'all' ? 'Tất cả' : cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Loại giao dịch</label>
              <div className="flex flex-wrap gap-2">
                {transactionTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setTransactionType(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      transactionType === type
                        ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {type === 'all' ? 'Tất cả' : type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Trạng thái</label>
              <div className="flex flex-wrap gap-2">
                {statuses.map(s => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      status === s
                        ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {statusLabels[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sort */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{filteredItems.length}</span> món đồ
          </p>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="newest">Mới đăng nhất</option>
              <option value="nearest">Gần nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Không tìm thấy món đồ nào</h3>
          <p className="text-gray-500 mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}
    </div>
  );
}
