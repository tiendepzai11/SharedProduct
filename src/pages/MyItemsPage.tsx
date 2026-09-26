import React from 'react';
import { useApp } from '../store/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  'available': { label: 'Có sẵn', icon: <Clock className="w-4 h-4" />, color: 'text-green-600 bg-green-50' },
  'requested': { label: 'Đã có người hỏi', icon: <AlertCircle className="w-4 h-4" />, color: 'text-yellow-600 bg-yellow-50' },
  'completed': { label: 'Đã trao xong', icon: <CheckCircle className="w-4 h-4" />, color: 'text-gray-500 bg-gray-50' },
};

export default function MyItemsPage() {
  const { currentUser, getItemsByOwner, getRequestsForItem, getUserById, updateRequestStatus } = useApp();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  const myItems = getItemsByOwner(currentUser.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Đồ tôi đăng</h1>
          <p className="text-gray-500 text-sm mt-1">{myItems.length} món đồ</p>
        </div>
        <Link
          to="/add"
          className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-xl hover:bg-emerald-600 transition-colors"
        >
          + Đăng mới
        </Link>
      </div>

      {myItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Chưa đăng món đồ nào</h3>
          <p className="text-gray-500 mt-1">Bắt đầu chia sẻ đồ dùng với hàng xóm!</p>
          <Link
            to="/add"
            className="mt-4 inline-block px-6 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Đăng món đầu tiên
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myItems.map(item => {
            const status = statusConfig[item.status];
            const requests = getRequestsForItem(item.id);
            const pendingRequests = requests.filter(r => r.status === 'pending');

            return (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <Link to={`/item/${item.id}`} className="sm:w-40 h-32 sm:h-auto flex-shrink-0">
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link to={`/item/${item.id}`} className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                          {item.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            {status.icon}
                            {status.label}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: vi })}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/item/${item.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Xem
                      </Link>
                    </div>

                    {pendingRequests.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs font-medium text-gray-500 mb-2">
                          {pendingRequests.length} yêu cầu đang chờ:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {pendingRequests.map(req => {
                            const requester = getUserById(req.requester_id);
                            return (
                              <div key={req.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                                <span className="text-sm text-gray-700">{requester?.name || 'Ẩn danh'}</span>
                                <button
                                  onClick={() => updateRequestStatus(req.id, 'approved')}
                                  className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                                  title="Xác nhận"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
