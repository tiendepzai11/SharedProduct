import React, { useState, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import ItemRow from '../components/ItemRow';
import EmptyIllustration from '../components/EmptyIllustration';
import MapView from '../components/MapView';
import { Category, TransactionType } from '../types';
import { Search, SlidersHorizontal, MapPin, List } from 'lucide-react';

type SortOption = 'newest' | 'nearest';
type ViewMode = 'list' | 'map';

export default function HomePage() {
  const { items } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [transactionType, setTransactionType] = useState<TransactionType | 'all'>('all');
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
  }, [items, search, category, transactionType, sort]);

  const categories: { value: Category | 'all'; label: string }[] = [
    { value: 'all', label: 'tất cả' },
    { value: 'sách', label: 'sách' },
    { value: 'điện tử', label: 'điện tử' },
    { value: 'đồ gia dụng', label: 'gia dụng' },
    { value: 'quần áo', label: 'quần áo' },
    { value: 'khác', label: 'khác' },
  ];

  const transactionTypes: { value: TransactionType | 'all'; label: string }[] = [
    { value: 'all', label: 'tất cả' },
    { value: 'cho tặng', label: 'cho tặng' },
    { value: 'cho mượn', label: 'cho mượn' },
    { value: 'trao đổi', label: 'trao đổi' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Page header */}
      <div className="mb-6 pb-4 border-b border-lead/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink mb-2">
              những món đồ đang chờ chủ mới
            </h2>
            <p className="text-lead text-sm leading-relaxed max-w-xl">
              mọi người trong thành phố để lại đồ không dùng nữa — bạn ghé xem, lấy về dùng, hoặc đổi lấy thứ khác.
            </p>
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-paper-dark/50 border border-lead/20 rounded-sm overflow-hidden flex-shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                viewMode === 'list'
                  ? 'bg-moss text-paper'
                  : 'text-lead hover:text-ink'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">danh sách</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                viewMode === 'map'
                  ? 'bg-moss text-paper'
                  : 'text-lead hover:text-ink'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">bản đồ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & filter bar */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lead" />
            <input
              type="text"
              placeholder="tìm món đồ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-paper-dark/50 border border-lead/20 rounded-sm text-sm text-ink placeholder:text-lead-light focus:outline-none focus:border-moss/50 focus:bg-paper transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm border text-sm transition-colors ${
              showFilters
                ? 'bg-butter/20 border-butter/40 text-ink'
                : 'bg-paper-dark/50 border-lead/20 text-lead hover:text-ink hover:border-lead/40'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">lọc</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-paper-dark/30 border border-lead/15 rounded-sm p-4 space-y-4">
            <div>
              <label className="text-xs text-lead mb-2 block">danh mục</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`px-3 py-1 rounded-sm text-sm transition-colors ${
                      category === cat.value
                        ? 'bg-butter/30 text-ink font-medium'
                        : 'bg-paper text-lead hover:text-ink hover:bg-paper-dark/50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-lead mb-2 block">loại giao dịch</label>
              <div className="flex flex-wrap gap-2">
                {transactionTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setTransactionType(type.value)}
                    className={`px-3 py-1 rounded-sm text-sm transition-colors ${
                      transactionType === type.value
                        ? 'bg-butter/30 text-ink font-medium'
                        : 'bg-paper text-lead hover:text-ink hover:bg-paper-dark/50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sort & count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-lead">
            <span className="font-medium text-ink">{filteredItems.length}</span> món đồ
          </span>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            className="text-sm text-lead bg-transparent border-none focus:outline-none cursor-pointer hover:text-ink transition-colors"
          >
            <option value="newest">mới đăng trước</option>
            <option value="nearest">gần trước</option>
          </select>
        </div>
      </div>

      {/* Content: List or Map */}
      {viewMode === 'list' ? (
        <>
          {filteredItems.length > 0 ? (
            <div className="border-t border-lead/20">
              {filteredItems.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <EmptyIllustration />
              <h3 className="font-serif text-lg text-ink mb-2">
                chưa có ai để lại gì ở đây
              </h3>
              <p className="text-lead text-sm">
                bạn đăng món đầu tiên nhé — biết đâu ai đó trong thành phố đang cần.
              </p>
            </div>
          )}
        </>
      ) : (
        <MapView items={filteredItems} />
      )}
    </div>
  );
}
