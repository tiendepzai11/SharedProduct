import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

// Tạo Supabase client - chỉ khi đã cấu hình
let supabaseClient: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    supabaseClient = null;
  }
}

// Export supabase client (có thể là null)
export const supabase = supabaseClient;

// Helper function để kiểm tra và throw error nếu chưa cấu hình
function getClient(): SupabaseClient {
  if (!supabaseClient) {
    throw new Error(
      'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file. ' +
      'See SUPABASE_SETUP.md for instructions.'
    );
  }
  return supabaseClient;
}

// ============================================================
// CÁC HÀM HELPER - SẼ DÙNG KHI CÓ CREDENTIALS
// ============================================================

// Auth
export const signUp = async (email: string, password: string, name: string) => {
  const client = getClient();
  return client.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });
};

export const signIn = async (email: string, password: string) => {
  const client = getClient();
  return client.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  const client = getClient();
  return client.auth.signOut();
};

export const getCurrentUser = async () => {
  const client = getClient();
  const result = await client.auth.getUser();
  return result.data.user;
};

// Items
export const getItems = async () => {
  const client = getClient();
  return client
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });
};

export const getItemById = async (id: string) => {
  const client = getClient();
  return client
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
  const client = getClient();
  const authResult = await client.auth.getUser();
  const user = authResult.data.user;
  if (!user) throw new Error('Not authenticated');

  return client
    .from('items')
    .insert({ ...item, owner_id: user.id })
    .select()
    .single();
};

export const updateItemStatus = async (id: string, status: string) => {
  const client = getClient();
  return client
    .from('items')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
};

// Requests
export const createRequest = async (itemId: string) => {
  const client = getClient();
  const authResult = await client.auth.getUser();
  const user = authResult.data.user;
  if (!user) throw new Error('Not authenticated');

  return client
    .from('requests')
    .insert({ item_id: itemId, requester_id: user.id, status: 'pending' })
    .select()
    .single();
};

export const updateRequestStatus = async (id: string, status: string) => {
  const client = getClient();
  return client
    .from('requests')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
};

// Conversations & Messages
export const getConversations = async () => {
  const client = getClient();
  const authResult = await client.auth.getUser();
  const user = authResult.data.user;
  if (!user) throw new Error('Not authenticated');

  return client
    .from('conversations')
    .select('*, item:items(*), participants:conversation_participants(user_id, users(*))')
    .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
    .order('last_message_at', { ascending: false });
};

export const getMessages = async (conversationId: string) => {
  const client = getClient();
  return client
    .from('messages')
    .select('*, sender:users(*)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
};

export const sendMessage = async (conversationId: string, content: string) => {
  const client = getClient();
  const authResult = await client.auth.getUser();
  const user = authResult.data.user;
  if (!user) throw new Error('Not authenticated');

  return client
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: user.id, content })
    .select()
    .single();
};

// Storage - Upload ảnh
export const uploadImage = async (file: File, path: string) => {
  const client = getClient();
  return client.storage
    .from('item-images')
    .upload(path, file, { upsert: true });
};

export const getImageUrl = (path: string) => {
  const client = getClient();
  const result = client.storage
    .from('item-images')
    .getPublicUrl(path);
  return result.data.publicUrl;
};
