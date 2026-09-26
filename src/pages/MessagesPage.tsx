import React from 'react';
import { useApp } from '../store/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function MessagesPage() {
  const { currentUser, getUserConversations, getItemById, getUserById } = useApp();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  const userConversations = getUserConversations(currentUser.id);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6 pb-4 border-b border-lead/20">
        <h1 className="font-serif text-2xl font-bold text-ink">tin nhắn</h1>
        <p className="text-lead text-sm mt-1">{userConversations.length} cuộc trò chuyện</p>
      </div>

      {userConversations.length === 0 ? (
        <div className="text-center py-16 border border-lead/15 rounded-sm bg-paper">
          <MessageCircle className="w-12 h-12 text-lead/40 mx-auto mb-4" />
          <h3 className="font-serif text-lg text-ink mb-2">chưa có tin nhắn nào</h3>
          <p className="text-lead text-sm">
            khi bạn nhắn tin với ai đó về món đồ, cuộc trò chuyện sẽ hiện ở đây.
          </p>
        </div>
      ) : (
        <div className="border-t border-lead/20">
          {userConversations.map(conv => {
            const item = getItemById(conv.item_id);
            if (!item) return null;

            const otherUserId = conv.participant_ids.find(id => id !== currentUser.id);
            const otherUser = otherUserId ? getUserById(otherUserId) : null;

            return (
              <Link
                key={conv.id}
                to={`/messages/${conv.id}`}
                className="flex gap-4 py-4 border-b border-lead/20 hover:bg-paper-dark/50 transition-colors -mx-4 px-4 rounded-sm"
              >
                {/* Item image */}
                <div className="flex-shrink-0 w-16 h-16 rounded-sm overflow-hidden bg-paper-dark">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                </div>

                {/* Conversation info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-serif text-base font-semibold text-ink leading-tight truncate">
                        {otherUser?.name || 'ẩn danh'}
                      </h3>
                      <p className="text-xs text-lead mt-0.5 truncate">
                        về: {item.title}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-xs text-lead">
                        {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true, locale: vi })}
                      </span>
                      {conv.unread_count > 0 && (
                        <span className="bg-terracotta text-paper text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                          {conv.unread_count > 9 ? '9+' : conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-lead mt-1 truncate">
                    {conv.last_message_preview || 'chưa có tin nhắn'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
