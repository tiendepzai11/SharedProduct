import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Item, User, Request, ItemStatus, RequestStatus } from '../types';
import { seedItems, seedUsers } from '../data/seedData';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  currentUser: User | null;
  items: Item[];
  requests: Request[];
  users: User[];
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
}

const AppContext = createContext<AppState | undefined>(undefined);

const STORAGE_KEYS = {
  items: 'sharezone_items',
  users: 'sharezone_users',
  requests: 'sharezone_requests',
  currentUser: 'sharezone_current_user',
  passwords: 'sharezone_passwords',
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

  return (
    <AppContext.Provider value={{
      currentUser, items, requests, users,
      login, register, logout,
      addItem, updateItemStatus,
      createRequest, updateRequestStatus,
      getItemById, getUserById,
      getItemsByOwner, getRequestsByRequester,
      getRequestsForItem, getRequestsForOwnerItems,
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
