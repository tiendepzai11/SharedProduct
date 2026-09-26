import React from 'react';
import { useApp } from '../store/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const requestStatusConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  'pending': { label: 'đang chờ', icon: <Clock className="w-3.5 h-3.5" />, color: 'text-butter bg-butter/15' },
  'approved': { label: 'đã chấp nhận', icon: <CheckCircle className="w-3.5 h-3.5" />, color: 'text-moss bg-moss/10' },
  'rejected': { label: 'đã từ chối', icon: <XCircle className="w-3.5 h-3.5" />, color: 'text-terracotta bg-terracotta/10' },
};

export default function MyRequestsPage() {
  const { currentUser, getRequestsByRequester, getItemById, getRequestsForOwnerItems, getUserById, updateRequestStatus } = useApp();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  const myRequests = getRequestsByRequester(currentUser.id);
  const ownerRequests = getRequestsForOwnerItems(currentUser.id);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6 pb-4 border-b border-lead/20">
        <h1 className="font-serif text-2xl font-bold text-ink">yêu cầu của tôi</h1>
      </div>

      {/* Requests I made */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-ink mb-3">
          yêu cầu tôi đã gửi ({myRequests.length})
        </h2>

        {myRequests.length === 0 ? (
          <div className="text-center py-10 border border-lead/15 rounded-sm bg-paper">
            <p className="text-lead text-sm mb-3">bạn chưa gửi yêu cầu nào</p>
            <Link to="/" className="text-moss text-sm hover:underline">
              khám phá đồ dùng →
            </Link>
          </div>
        ) : (
          <div className="border-t border-lead/20">
            {myRequests.map(req => {
              const item = getItemById(req.item_id);
              const statusInfo = requestStatusConfig[req.status];
              if (!item) return null;

              return (
                <div key={req.id} className="flex items-center gap-4 py-4 border-b border-lead/20">
                  <img src={item.image_url} alt={item.title} className="w-16 h-16 rounded-sm object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/item/${item.id}`} className="font-serif font-semibold text-ink hover:text-moss-dark transition-colors block truncate">
                      {item.title}
                    </Link>
                    <p className="text-xs text-lead mt-0.5">
                      gửi {formatDistanceToNow(new Date(req.created_at), { addSuffix: true, locale: vi })}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.icon}
                    {statusInfo.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Requests for my items */}
      <div>
        <h2 className="text-sm font-medium text-ink mb-3">
          yêu cầu cho đồ của tôi ({ownerRequests.length})
        </h2>

        {ownerRequests.length === 0 ? (
          <div className="text-center py-10 border border-lead/15 rounded-sm bg-paper">
            <p className="text-lead text-sm">chưa có ai yêu cầu đồ của bạn</p>
          </div>
        ) : (
          <div className="border-t border-lead/20">
            {ownerRequests.map(req => {
              const requester = getUserById(req.requester_id);
              const statusInfo = requestStatusConfig[req.status];

              return (
                <div key={req.id} className="py-4 border-b border-lead/20">
                  <div className="flex items-center gap-4">
                    <img src={req.item.image_url} alt={req.item.title} className="w-14 h-14 rounded-sm object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Link to={`/item/${req.item.id}`} className="font-serif font-semibold text-ink hover:text-moss-dark transition-colors block truncate text-sm">
                        {req.item.title}
                      </Link>
                      <p className="text-sm text-lead mt-0.5">
                        từ: <span className="text-ink">{requester?.name || 'ẩn danh'}</span>
                      </p>
                      <p className="text-xs text-lead mt-0.5">
                        {formatDistanceToNow(new Date(req.created_at), { addSuffix: true, locale: vi })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                      {req.status === 'pending' && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateRequestStatus(req.id, 'approved')}
                            className="p-1.5 bg-moss/10 text-moss rounded-sm hover:bg-moss/20 transition-colors"
                            title="chấp nhận"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateRequestStatus(req.id, 'rejected')}
                            className="p-1.5 bg-terracotta/10 text-terracotta rounded-sm hover:bg-terracotta/20 transition-colors"
                            title="từ chối"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
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
    </div>
  );
}
