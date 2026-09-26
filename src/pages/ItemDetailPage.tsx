import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { ArrowLeft, MapPin, Clock, User, Tag, MessageCircle, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const categoryEmoji: Record<string, string> = {
  'sách': '📚',
  'điện tử': '📱',
  'đồ gia dụng': '🏠',
  'quần áo': '👕',
  'khác': '📦',
};

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  'available': { label: 'Đang có sẵn', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200' },
  'requested': { label: 'Đã có người hỏi', color: 'text-yellow-700', bgColor: 'bg-yellow-50 border-yellow-200' },
  'completed': { label: 'Đã trao đổi xong', color: 'text-gray-500', bgColor: 'bg-gray-50 border-gray-200' },
};

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItemById, getUserById, currentUser, createRequest, getRequestsForItem, updateRequestStatus } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);

  const item = getItemById(id || '');
  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Không tìm thấy món đồ</h2>
        <Link to="/" className="text-emerald-600 hover:underline mt-4 inline-block">← Về trang chủ</Link>
      </div>
    );
  }

  const owner = getUserById(item.owner_id);
  const statusInfo = statusConfig[item.status];
  const isOwner = currentUser?.id === item.owner_id;
  const itemRequests = getRequestsForItem(item.id);
  const hasRequested = currentUser ? itemRequests.some(r => r.requester_id === currentUser.id) : false;

  const handleRequest = () => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    if (isOwner) return;
    setShowConfirm(true);
  };

  const confirmRequest = () => {
    createRequest(item.id);
    setShowConfirm(false);
  };

  const handleApprove = (requestId: string) => {
    updateRequestStatus(requestId, 'approved');
  };

  const handleReject = (requestId: string) => {
    updateRequestStatus(requestId, 'rejected');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Quay lại</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.bgColor} ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {categoryEmoji[item.category]} {item.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Tag className="w-4 h-4" />
            <span className="font-medium capitalize">{item.transaction_type}</span>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Mô tả</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span className="text-gray-600">{item.location_label}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span className="text-gray-600">
                Đăng {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: vi })}
              </span>
            </div>
            {owner && (
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-emerald-500" />
                <span className="text-gray-600">{owner.name}</span>
              </div>
            )}
          </div>

          {/* Action button */}
          {!isOwner && item.status === 'available' && (
            <button
              onClick={handleRequest}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Tôi muốn món này
            </button>
          )}

          {isOwner && item.status === 'requested' && (
            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-gray-700">Yêu cầu nhận đồ</h3>
              {itemRequests.filter(r => r.status === 'pending').map(req => {
                const requester = getUserById(req.requester_id);
                return (
                  <div key={req.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div>
                      <p className="font-medium text-sm text-gray-800">{requester?.name || 'Ẩn danh'}</p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(req.created_at), { addSuffix: true, locale: vi })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        title="Xác nhận"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        title="Từ chối"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {isOwner && item.status === 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-green-700 font-medium">Đã trao đổi thành công!</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận yêu cầu</h3>
            <p className="text-gray-600 text-sm mb-6">
              Bạn muốn nhận món "<span className="font-semibold">{item.title}</span>"? Chủ đồ sẽ nhận được thông báo.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmRequest}
                className="flex-1 py-2.5 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
