import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Item, User, Request, Message, Conversation, ItemStatus, RequestStatus } from '../types';
import { seedItems, seedUsers } from '../data/seedData';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  currentUser: User | null;
  items: Item[];
  requests: Request[];
  users: User[];
  messages: Message[];
  conversations: Conversation[];
  login: (email: string, password: string) => boolean;
  register: (email: string, name: string, password: string) => boolean;
  logout: () => void;
  addItem: (item: Omit<Item, 'id' | 'owner_id' | 'created_at' | 'status'>) => void;
  updateItemStatus: (itemId: string, status: ItemStatus) => void;
  createRequest: (itemId: string) => void;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
  getItemById: (id: string) => Item | undefined;
  getUserById: (id: string) => User | undefined;
  getItemsByOwner: (ownerId: string) => Item[];
  getRequestsByRequester: (requesterId: string) => Request[];
  getRequestsForItem: (itemId: string) => Request[];
  getRequestsForOwnerItems: (ownerId: string) => (Request & { item: Item })[];
  sendMessage: (conversationId: string, content: string) => void;
  getConversation: (conversationId: string) => Conversation | undefined;
  getMessagesForConversation: (conversationId: string) => Message[];
  getUserConversations: (userId: string) => Conversation[];
  markConversationAsRead: (conversationId: string) => void;
  getTotalUnreadCount: (userId: string) => number;
  getOrCreateConversation: (itemId: string, owner_id: string, requester_id: string) => Conversation;
}

const AppContext = createContext<AppState | undefined>(undefined);

const STORAGE_KEYS = {
  items: 'sharezone_items',
  users: 'sharezone_users',
  requests: 'sharezone_requests',
  currentUser: 'sharezone_current_user',
  passwords: 'sharezone_passwords',
  messages: 'sharezone_messages',
  conversations: 'sharezone_conversations',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, data: unknown): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Seed messages mẫu
const seedConversations: Conversation[] = [
  {
    id: 'item-1',
    item_id: 'item-1',
    participant_ids: ['user-1', 'user-2'],
    last_message_at: '2024-11-15T10:30:00Z',
    last_message_preview: 'mình còn sách không bạn?',
    unread_count: 1,
  },
  {
    id: 'item-3',
    item_id: 'item-3',
    participant_ids: ['user-3', 'user-4'],
    last_message_at: '2024-11-14T15:20:00Z',
    last_message_preview: 'ok mình qua lấy nhé',
    unread_count: 0,
  },
];

const seedMessages: Message[] = [
  {
    id: 'msg-1',
    conversation_id: 'item-1',
    sender_id: 'user-2',
    content: 'chào bạn, mình thấy bạn đăng giáo trình giải tích 1',
    created_at: '2024-11-15T09:00:00Z',
    read: true,
  },
  {
    id: 'msg-2',
    conversation_id: 'item-1',
    sender_id: 'user-1',
    content: 'chào bạn, sách vẫn còn nhé',
    created_at: '2024-11-15T09:30:00Z',
    read: true,
  },
  {
    id: 'msg-3',
    conversation_id: 'item-1',
    sender_id: 'user-2',
    content: 'mình còn sách không bạn?',
    created_at: '2024-11-15T10:30:00Z',
    read: false,
  },
  {
    id: 'msg-4',
    conversation_id: 'item-3',
    sender_id: 'user-4',
    content: 'chào bạn, mình muốn mượn quạt bàn được không?',
    created_at: '2024-11-14T14:00:00Z',
    read: true,
  },
  {
    id: 'msg-5',
    conversation_id: 'item-3',
    sender_id: 'user-3',
    content: 'được bạn, bạn qua lấy lúc nào cũng được',
    created_at: '2024-11-14T14:30:00Z',
    read: true,
  },
  {
    id: 'msg-6',
    conversation_id: 'item-3',
    sender_id: 'user-4',
    content: 'ok mình qua lấy nhé',
    created_at: '2024-11-14T15:20:00Z',
    read: true,
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    const stored = loadFromStorage<User[]>(STORAGE_KEYS.users, []);
    if (stored.length === 0) {
      saveToStorage(STORAGE_KEYS.users, seedUsers);
      return seedUsers;
    }
    return stored;
  });

  const [items, setItems] = useState<Item[]>(() => {
    const stored = loadFromStorage<Item[]>(STORAGE_KEYS.items, []);
    if (stored.length === 0) {
      saveToStorage(STORAGE_KEYS.items, seedItems);
      return seedItems;
    }
    return stored;
  });

  const [requests, setRequests] = useState<Request[]>(() => {
    return loadFromStorage<Request[]>(STORAGE_KEYS.requests, []);
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = loadFromStorage<Message[]>(STORAGE_KEYS.messages, []);
    if (stored.length === 0) {
      saveToStorage(STORAGE_KEYS.messages, seedMessages);
      return seedMessages;
    }
    return stored;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const stored = loadFromStorage<Conversation[]>(STORAGE_KEYS.conversations, []);
    if (stored.length === 0) {
      saveToStorage(STORAGE_KEYS.conversations, seedConversations);
      return seedConversations;
    }
    return stored;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return loadFromStorage<User | null>(STORAGE_KEYS.currentUser, null);
  });

  const [passwords, setPasswords] = useState<Record<string, string>>(() => {
    const stored = loadFromStorage<Record<string, string>>(STORAGE_KEYS.passwords, {});
    if (Object.keys(stored).length === 0) {
      const defaultPasswords: Record<string, string> = {};
      seedUsers.forEach(u => { defaultPasswords[u.email] = '123456'; });
      saveToStorage(STORAGE_KEYS.passwords, defaultPasswords);
      return defaultPasswords;
    }
    return stored;
  });

  useEffect(() => { saveToStorage(STORAGE_KEYS.items, items); }, [items]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.users, users); }, [users]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.requests, requests); }, [requests]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.currentUser, currentUser); }, [currentUser]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.passwords, passwords); }, [passwords]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.messages, messages); }, [messages]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.conversations, conversations); }, [conversations]);

  const login = (email: string, _password: string): boolean => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (email: string, name: string, _password: string): boolean => {
    if (users.find(u => u.email === email)) return false;
    const newUser: User = {
      id: uuidv4(),
      email,
      name,
      created_at: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setPasswords(prev => ({ ...prev, [email]: _password }));
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addItem = (itemData: Omit<Item, 'id' | 'owner_id' | 'created_at' | 'status'>) => {
    if (!currentUser) return;
    const newItem: Item = {
      ...itemData,
      id: uuidv4(),
      owner_id: currentUser.id,
      status: 'available',
      created_at: new Date().toISOString(),
    };
    setItems(prev => [newItem, ...prev]);
  };

  const updateItemStatus = (itemId: string, status: ItemStatus) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, status } : item
    ));
  };

  const createRequest = (itemId: string) => {
    if (!currentUser) return;
    const newRequest: Request = {
      id: uuidv4(),
      item_id: itemId,
      requester_id: currentUser.id,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    setRequests(prev => [...prev, newRequest]);
    updateItemStatus(itemId, 'requested');
  };

  const updateRequestStatus = (requestId: string, status: RequestStatus) => {
    setRequests(prev => prev.map(req =>
      req.id === requestId ? { ...req, status } : req
    ));
    if (status === 'approved') {
      const req = requests.find(r => r.id === requestId);
      if (req) updateItemStatus(req.item_id, 'completed');
    }
  };

  const getItemById = (id: string) => items.find(item => item.id === id);
  const getUserById = (id: string) => users.find(user => user.id === id);
  const getItemsByOwner = (ownerId: string) => items.filter(item => item.owner_id === ownerId);
  const getRequestsByRequester = (requesterId: string) => requests.filter(req => req.requester_id === requesterId);
  const getRequestsForItem = (itemId: string) => requests.filter(req => req.item_id === itemId);
  const getRequestsForOwnerItems = (ownerId: string) => {
    const ownerItems = items.filter(i => i.owner_id === ownerId).map(i => i.id);
    return requests
      .filter(req => ownerItems.includes(req.item_id))
      .map(req => ({ ...req, item: items.find(i => i.id === req.item_id)! }));
  };

  const getOrCreateConversation = (itemId: string, owner_id: string, requester_id: string): Conversation => {
    const existing = conversations.find(c => c.item_id === itemId);
    if (existing) return existing;

    const newConv: Conversation = {
      id: itemId,
      item_id: itemId,
      participant_ids: [owner_id, requester_id],
      last_message_at: new Date().toISOString(),
      last_message_preview: '',
      unread_count: 0,
    };
    setConversations(prev => [...prev, newConv]);
    return newConv;
  };

  const sendMessage = (conversationId: string, content: string) => {
    if (!currentUser) return;

    const newMessage: Message = {
      id: uuidv4(),
      conversation_id: conversationId,
      sender_id: currentUser.id,
      content: content.trim(),
      created_at: new Date().toISOString(),
      read: true,
    };

    setMessages(prev => [...prev, newMessage]);

    // Update conversation
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const otherUserId = conv.participant_ids.find(id => id !== currentUser.id);
        return {
          ...conv,
          last_message_at: newMessage.created_at,
          last_message_preview: content.trim().slice(0, 50),
          unread_count: otherUserId ? conv.unread_count + 1 : conv.unread_count,
        };
      }
      return conv;
    }));
  };

  const getConversation = (conversationId: string) => conversations.find(c => c.id === conversationId);

  const getMessagesForConversation = (conversationId: string) => {
    return messages
      .filter(m => m.conversation_id === conversationId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  };

  const getUserConversations = (userId: string) => {
    return conversations
      .filter(c => c.participant_ids.includes(userId))
      .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());
  };

  const markConversationAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
    ));
  };

  const getTotalUnreadCount = (userId: string) => {
    return conversations
      .filter(c => c.participant_ids.includes(userId))
      .reduce((sum, c) => sum + c.unread_count, 0);
  };

  return (
    <AppContext.Provider value={{
      currentUser, items, requests, users, messages, conversations,
      login, register, logout,
      addItem, updateItemStatus,
      createRequest, updateRequestStatus,
      getItemById, getUserById,
      getItemsByOwner, getRequestsByRequester,
      getRequestsForItem, getRequestsForOwnerItems,
      sendMessage, getConversation, getMessagesForConversation,
      getUserConversations, markConversationAsRead, getTotalUnreadCount,
      getOrCreateConversation,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
