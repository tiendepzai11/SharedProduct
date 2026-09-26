import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { currentUser, getConversation, getMessagesForConversation, getItemById, getUserById, sendMessage, markConversationAsRead } = useApp();
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      markConversationAsRead(conversationId);
    }
  }, [conversationId, markConversationAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [getMessagesForConversation(conversationId || '')]);

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  if (!conversationId) {
    navigate('/messages');
    return null;
  }

  const conversation = getConversation(conversationId);
  if (!conversation) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="font-serif text-xl text-ink">không tìm thấy cuộc trò chuyện</h2>
        <Link to="/messages" className="text-moss text-sm hover:underline mt-4 inline-block">← quay lại tin nhắn</Link>
      </div>
    );
  }

  const item = getItemById(conversation.item_id);
  const otherUserId = conversation.participant_ids.find(id => id !== currentUser.id);
  const otherUser = otherUserId ? getUserById(otherUserId) : null;
  const messages = getMessagesForConversation(conversationId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendMessage(conversationId, messageText);
    setMessageText('');
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/messages')}
          className="flex items-center gap-2 text-lead hover:text-ink mb-4 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          quay lại tin nhắn
        </button>

        <div className="flex items-center gap-4 pb-4 border-b border-lead/20">
          {item && (
            <Link to={`/item/${item.id}`} className="flex-shrink-0 w-16 h-16 rounded-sm overflow-hidden bg-paper-dark hover:opacity-80 transition-opacity">
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
            </Link>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-xl font-bold text-ink">
              {otherUser?.name || 'ẩn danh'}
            </h1>
            {item && (
              <Link to={`/item/${item.id}`} className="text-sm text-lead hover:text-moss transition-colors">
                về: {item.title}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-paper-dark/30 border border-lead/15 rounded-sm p-4 min-h-[400px] max-h-[500px] overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lead text-sm">chưa có tin nhắn nào</p>
            <p className="text-lead-light text-xs mt-1">hãy bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender_id === currentUser.id;
            const showTimestamp = index === 0 || 
              new Date(msg.created_at).getTime() - new Date(messages[index - 1].created_at).getTime() > 300000; // 5 phút

            return (
              <div key={msg.id}>
                {showTimestamp && (
                  <div className="text-center my-3">
                    <span className="text-xs text-lead bg-paper px-3 py-1 rounded-sm">
                      {format(new Date(msg.created_at), 'HH:mm - dd/MM/yyyy', { locale: vi })}
                    </span>
                  </div>
                )}
                <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[70%] px-4 py-2.5 rounded-sm ${
                      isMe
                        ? 'bg-moss text-paper'
                        : 'bg-paper border border-lead/20 text-ink'
                    }`}
                    style={{ transform: `rotate(${isMe ? '0.5' : '-0.5'}deg)` }}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className={`text-xs mt-1 ${isMe ? 'text-paper/70' : 'text-lead'}`}>
                      {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: vi })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="mt-4 flex gap-3">
        <input
          type="text"
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          placeholder="nhắn tin..."
          className="flex-1 px-4 py-3 bg-paper-dark/40 border border-lead/20 rounded-sm text-sm text-ink placeholder:text-lead-light focus:outline-none focus:border-moss/50 focus:bg-paper transition-colors"
        />
        <button
          type="submit"
          disabled={!messageText.trim()}
          className="px-4 py-3 bg-moss text-paper rounded-sm hover:bg-moss-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
