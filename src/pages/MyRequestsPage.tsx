import React from 'react';
import { useApp } from '../store/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { ClipboardList, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const requestStatusConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  'pending': { label: 'Đang chờ', icon: <Clock className="w-4 h-4" />, color: 'text-yellow-600 bg-yellow-50' },
  'approved': { label: 'Đã chấp nhận', icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600 bg-green-50' },
  'rejected': { label: 'Đã từ chối', icon: <XCircle className="w-4 h-4" />, color: 'text-red-600 bg-red-50' },
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Yêu cầu của tôi</h1>

      {/* Requests I made */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-emerald-500" />
          Yêu cầu tôi đã gửi ({myRequests.length})
        </h2>

        {myRequests.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
            <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Bạn chưa gửi yêu cầu nào</p>
            <Link to="/" className="text-emerald-600 text-sm hover:underline mt-2 inline-block">
              Khám phá đồ dùng →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myRequests.map(req => {
              const item = getItemById(req.item_id);
              const statusInfo = requestStatusConfig[req.status];
              if (!item) return null;

              return (
                <div key={req.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                  <img src={item.image_url} alt={item.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/item/${item.id}`} className="font-medium text-gray-900 hover:text-emerald-600 transition-colors truncate block">
                      {item.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Gửi {formatDistanceToNow(new Date(req.created_at), { addSuffix: true, locale: vi })}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.icon}
                    {statusInfo.label}
                  </span>
                  <Link
                    to={`/item/${item.id}`}
                    className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Requests for my items */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          Yêu cầu cho đồ của tôi ({ownerRequests.length})
        </h2>

        {ownerRequests.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
            <CheckCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Chưa có ai yêu cầu đồ của bạn</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ownerRequests.map(req => {
              const requester = getUserById(req.requester_id);
              const statusInfo = requestStatusConfig[req.status];

              return (
                <div key={req.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center gap-4">
                    <img src={req.item.image_url} alt={req.item.title} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Link to={`/item/${req.item.id}`} className="font-medium text-gray-900 hover:text-emerald-600 transition-colors truncate block text-sm">
                        {req.item.title}
                      </Link>
                      <p className="text-sm text-gray-600 mt-0.5">
                        Từ: <span className="font-medium">{requester?.name || 'Ẩn danh'}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDistanceToNow(new Date(req.created_at), { addSuffix: true, locale: vi })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                      {req.status === 'pending' && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateRequestStatus(req.id, 'approved')}
                            className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                            title="Chấp nhận"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateRequestStatus(req.id, 'rejected')}
                            className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                            title="Từ chối"
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
