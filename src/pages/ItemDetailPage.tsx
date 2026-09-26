import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { ArrowLeft, MapPin, Clock, User, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItemById, getUserById, currentUser, createRequest, getRequestsForItem, updateRequestStatus, getOrCreateConversation } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);

  const item = getItemById(id || '');
  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="font-serif text-xl text-ink">không tìm thấy món đồ này</h2>
        <Link to="/" className="text-moss text-sm hover:underline mt-4 inline-block">← về trang chủ</Link>
      </div>
    );
  }

  const owner = getUserById(item.owner_id);
  const isOwner = currentUser?.id === item.owner_id;
  const itemRequests = getRequestsForItem(item.id);
  const hasRequested = currentUser ? itemRequests.some(r => r.requester_id === currentUser.id) : false;

  const stampClass = item.status === 'completed'
    ? 'stamp stamp-completed'
    : item.status === 'requested'
    ? 'stamp stamp-requested'
    : 'stamp stamp-available';

  const stampText = item.status === 'completed'
    ? 'đã trao xong'
    : item.status === 'requested'
    ? 'có người hỏi'
    : 'có sẵn';

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

  const handleMessage = () => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    if (isOwner) return;
    
    // Tạo hoặc lấy conversation
    const conversation = getOrCreateConversation(item.id, item.owner_id, currentUser.id);
    navigate(`/messages/${conversation.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-lead hover:text-ink mb-6 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        quay lại
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square rounded-sm overflow-hidden bg-paper-dark border border-lead/15">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <div className={`mb-3 ${stampClass}`}>
              {stampText}
            </div>
            <h1 className="font-serif text-3xl font-bold text-ink leading-tight">{item.title}</h1>
          </div>

          <div className="text-sm text-lead">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-butter/20 rounded-sm text-ink-light">
              {item.category}
            </span>
            <span className="mx-2">·</span>
            <span className="capitalize">{item.transaction_type}</span>
          </div>

          <div className="border-t border-lead/20 pt-4">
            <h3 className="text-sm text-lead mb-2">mô tả</h3>
            <p className="text-ink leading-relaxed">{item.description}</p>
          </div>

          <div className="space-y-2 text-sm text-lead border-t border-lead/20 pt-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-moss" />
              <span>{item.location_label}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-moss" />
              <span>
                đăng {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: vi })}
              </span>
            </div>
            {owner && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-moss" />
                <span>{owner.name}</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {!isOwner && item.status === 'available' && (
            <div className="flex gap-3">
              <button
                onClick={handleRequest}
                className="flex-1 py-3 bg-moss text-paper font-medium rounded-sm hover:bg-moss-dark transition-colors"
              >
                tôi muốn món này
              </button>
              <button
                onClick={handleMessage}
                className="px-4 py-3 border border-moss text-moss font-medium rounded-sm hover:bg-moss/5 transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                nhắn tin
              </button>
            </div>
          )}

          {!isOwner && item.status !== 'available' && (
            <button
              onClick={handleMessage}
              className="w-full py-3 border border-moss text-moss font-medium rounded-sm hover:bg-moss/5 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              nhắn tin với người đăng
            </button>
          )}

          {isOwner && item.status === 'requested' && (
            <div className="border border-lead/20 rounded-sm p-4 space-y-3">
              <h3 className="text-sm font-medium text-ink">yêu cầu nhận đồ</h3>
              {itemRequests.filter(r => r.status === 'pending').map(req => {
                const requester = getUserById(req.requester_id);
                return (
                  <div key={req.id} className="flex items-center justify-between bg-paper-dark/40 rounded-sm p-3">
                    <div>
                      <p className="text-sm text-ink">{requester?.name || 'ẩn danh'}</p>
                      <p className="text-xs text-lead">
                        {formatDistanceToNow(new Date(req.created_at), { addSuffix: true, locale: vi })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateRequestStatus(req.id, 'approved')}
                        className="p-2 bg-moss/10 text-moss rounded-sm hover:bg-moss/20 transition-colors"
                        title="xác nhận"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateRequestStatus(req.id, 'rejected')}
                        className="p-2 bg-terracotta/10 text-terracotta rounded-sm hover:bg-terracotta/20 transition-colors"
                        title="từ chối"
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
            <div className="bg-moss/5 border border-moss/20 rounded-sm p-4 text-center">
              <CheckCircle className="w-8 h-8 text-moss mx-auto mb-2" />
              <p className="text-moss font-medium text-sm">đã trao đổi thành công</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50 p-4">
          <div className="bg-paper rounded-sm border border-lead/20 p-6 max-w-sm w-full shadow-lg">
            <h3 className="font-serif text-lg text-ink mb-2">xác nhận yêu cầu</h3>
            <p className="text-lead text-sm mb-6">
              bạn muốn nhận "<span className="text-ink font-medium">{item.title}</span>"?
              người đăng sẽ thấy yêu cầu của bạn.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 border border-lead/20 text-ink font-medium rounded-sm hover:bg-paper-dark/50 transition-colors"
              >
                hủy
              </button>
              <button
                onClick={confirmRequest}
                className="flex-1 py-2.5 bg-moss text-paper font-medium rounded-sm hover:bg-moss-dark transition-colors"
              >
                xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
