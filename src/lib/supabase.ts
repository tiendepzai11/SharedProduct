import { createClient } from '@supabase/supabase-js';

// ============================================================
// CẤU HÌNH SUPABASE
// ============================================================
// Điền 2 giá trị sau vào file .env (tạo mới nếu chưa có):
//   VITE_SUPABASE_URL=https://your-project.supabase.co
//   VITE_SUPABASE_ANON_KEY=your-anon-key
//
// Lấy tại: Supabase Dashboard → Settings → API
// ============================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Kiểm tra đã cấu hình hay chưa
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Tạo Supabase client
// Nếu chưa cấu hình, client vẫn được tạo nhưng các hàm gọi API sẽ không hoạt động
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// ============================================================
// CÁC HÀM HELPER - SẼ DÙNG KHI CÓ CREDENTIALS
// ============================================================

// Auth
export const signUp = async (email: string, password: string, name: string) => {
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
};

export const signIn = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Items
export const getItems = async () => {
  return supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });
};

export const getItemById = async (id: string) => {
  return supabase
    .from('items')
    .select('*, owner:users(*)')
    .eq('id', id)
    .single();
};

export const createItem = async (item: {
  title: string;
  description: string;
  image_url: string;
  category: string;
  transaction_type: string;
  latitude: number;
  longitude: number;
  location_label: string;
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  return supabase
    .from('items')
    .insert({ ...item, owner_id: user.id })
    .select()
    .single();
};

export const updateItemStatus = async (id: string, status: string) => {
  return supabase
    .from('items')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
};

// Requests
export const createRequest = async (itemId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  return supabase
    .from('requests')
    .insert({ item_id: itemId, requester_id: user.id, status: 'pending' })
    .select()
    .single();
};

export const updateRequestStatus = async (id: string, status: string) => {
  return supabase
    .from('requests')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
};

// Conversations & Messages
export const getConversations = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  return supabase
    .from('conversations')
    .select('*, item:items(*), participants:conversation_participants(user_id, users(*))')
    .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
    .order('last_message_at', { ascending: false });
};

export const getMessages = async (conversationId: string) => {
  return supabase
    .from('messages')
    .select('*, sender:users(*)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
};

export const sendMessage = async (conversationId: string, content: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  return supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: user.id, content })
    .select()
    .single();
};

// Storage - Upload ảnh
export const uploadImage = async (file: File, path: string) => {
  return supabase.storage
    .from('item-images')
    .upload(path, file, { upsert: true });
};

export const getImageUrl = (path: string) => {
  const { data } = supabase.storage
    .from('item-images')
    .getPublicUrl(path);
  return data.publicUrl;
};
