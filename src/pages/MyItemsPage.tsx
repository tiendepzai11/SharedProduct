import React from 'react';
import { useApp } from '../store/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  'available': { label: 'có sẵn', icon: <Clock className="w-3.5 h-3.5" />, color: 'text-moss bg-moss/10' },
  'requested': { label: 'có người hỏi', icon: <AlertCircle className="w-3.5 h-3.5" />, color: 'text-terracotta bg-terracotta/10' },
  'completed': { label: 'đã trao xong', icon: <CheckCircle className="w-3.5 h-3.5" />, color: 'text-lead bg-lead/10' },
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
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-lead/20">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink">đồ tôi đăng</h1>
          <p className="text-lead text-sm mt-0.5">{myItems.length} món đồ</p>
        </div>
        <Link
          to="/add"
          className="px-4 py-2 bg-moss text-paper text-sm font-medium rounded-sm hover:bg-moss-dark transition-colors"
        >
          + đăng mới
        </Link>
      </div>

      {myItems.length === 0 ? (
        <div className="text-center py-16 border border-lead/15 rounded-sm bg-paper">
          <p className="text-lead text-sm mb-4">chưa đăng món đồ nào</p>
          <Link
            to="/add"
            className="inline-block px-6 py-2.5 bg-moss text-paper text-sm font-medium rounded-sm hover:bg-moss-dark transition-colors"
          >
            đăng món đầu tiên
          </Link>
        </div>
      ) : (
        <div className="border-t border-lead/20">
          {myItems.map(item => {
            const status = statusConfig[item.status];
            const requests = getRequestsForItem(item.id);
            const pendingRequests = requests.filter(r => r.status === 'pending');

            return (
              <div key={item.id} className="py-5 border-b border-lead/20">
                <div className="flex gap-4">
                  <Link to={`/item/${item.id}`} className="flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden bg-paper-dark">
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link to={`/item/${item.id}`} className="font-serif text-lg font-semibold text-ink hover:text-moss-dark transition-colors">
                          {item.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium ${status.color}`}>
                            {status.icon}
                            {status.label}
                          </span>
                          <span className="text-xs text-lead">
                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: vi })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {pendingRequests.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-lead/15">
                        <p className="text-xs text-lead mb-2">
                          {pendingRequests.length} yêu cầu đang chờ:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {pendingRequests.map(req => {
                            const requester = getUserById(req.requester_id);
                            return (
                              <div key={req.id} className="flex items-center gap-2 bg-paper-dark/40 rounded-sm px-3 py-2">
                                <span className="text-sm text-ink">{requester?.name || 'ẩn danh'}</span>
                                <button
                                  onClick={() => updateRequestStatus(req.id, 'approved')}
                                  className="p-1 text-moss hover:bg-moss/10 rounded-sm transition-colors"
                                  title="xác nhận"
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
