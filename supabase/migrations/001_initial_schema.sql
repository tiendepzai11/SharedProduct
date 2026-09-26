-- ============================================================
-- SHAREZONE DATABASE SCHEMA
-- ============================================================
-- Chạy file này trong Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste nội dung này
-- ============================================================

-- ============================================================
-- 1. BẢNG USERS (mở rộng từ auth.users của Supabase)
-- ============================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger tự tạo user profile khi đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. BẢNG ITEMS (đồ dùng)
-- ============================================================
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('sách', 'điện tử', 'đồ gia dụng', 'quần áo', 'khác')),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('cho tặng', 'cho mượn', 'trao đổi')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'requested', 'completed')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location_label TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_items_owner ON public.items(owner_id);
CREATE INDEX idx_items_status ON public.items(status);
CREATE INDEX idx_items_category ON public.items(category);
CREATE INDEX idx_items_location ON public.items(latitude, longitude);

-- ============================================================
-- 3. BẢNG REQUESTS (yêu cầu nhận đồ)
-- ============================================================
CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(item_id, requester_id)
);

CREATE INDEX idx_requests_item ON public.requests(item_id);
CREATE INDEX idx_requests_requester ON public.requests(requester_id);
CREATE INDEX idx_requests_status ON public.requests(status);

-- ============================================================
-- 4. BẢNG CONVERSATIONS (cuộc trò chuyện)
-- ============================================================
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  participant_1 UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  participant_2 UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_preview TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(item_id, participant_1, participant_2)
);

CREATE INDEX idx_conversations_item ON public.conversations(item_id);
CREATE INDEX idx_conversations_participant_1 ON public.conversations(participant_1);
CREATE INDEX idx_conversations_participant_2 ON public.conversations(participant_2);

-- ============================================================
-- 5. BẢNG MESSAGES (tin nhắn)
-- ============================================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

-- ============================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS cho tất cả bảng
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- USERS: Ai cũng xem được, chỉ sửa được profile của mình
CREATE POLICY "Users are viewable by everyone" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- ITEMS: Ai cũng xem được, chỉ chủ sở hữu mới sửa/xóa được
CREATE POLICY "Items are viewable by everyone" ON public.items
  FOR SELECT USING (true);

CREATE POLICY "Users can create items" ON public.items
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own items" ON public.items
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own items" ON public.items
  FOR DELETE USING (auth.uid() = owner_id);

-- REQUESTS: Ai cũng xem được, chỉ người tạo mới sửa được
CREATE POLICY "Requests are viewable by everyone" ON public.requests
  FOR SELECT USING (true);

CREATE POLICY "Users can create requests" ON public.requests
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update own requests" ON public.requests
  FOR UPDATE USING (auth.uid() = requester_id);

-- CONVERSATIONS: Chỉ người tham gia mới xem được
CREATE POLICY "Participants can view conversations" ON public.conversations
  FOR SELECT USING (
    auth.uid() = participant_1 OR auth.uid() = participant_2
  );

CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (
    auth.uid() = participant_1 OR auth.uid() = participant_2
  );

-- MESSAGES: Chỉ người tham gia conversation mới xem được
CREATE POLICY "Participants can view messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id
      AND (auth.uid() = participant_1 OR auth.uid() = participant_2)
    )
  );

CREATE POLICY "Participants can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id
      AND (auth.uid() = participant_1 OR auth.uid() = participant_2)
    )
  );

-- ============================================================
-- 7. STORAGE BUCKET (cho ảnh)
-- ============================================================
-- Tạo bucket 'item-images' trong Supabase Dashboard:
-- Storage → New Bucket → Name: item-images → Public bucket: true

-- Policy cho storage (chạy trong SQL Editor)
/*
CREATE POLICY "Images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'item-images');

CREATE POLICY "Users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'item-images'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can update own images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'item-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'item-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
*/

-- ============================================================
-- 8. FUNCTIONS HELPER
-- ============================================================

-- Hàm lấy số tin nhắn chưa đọc
CREATE OR REPLACE FUNCTION public.get_unread_count(user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.messages
    WHERE conversation_id IN (
      SELECT id FROM public.conversations
      WHERE participant_1 = user_id OR participant_2 = user_id
    )
    AND sender_id != user_id
    AND read = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- HOÀN TẤT!
-- ============================================================
-- Schema đã sẵn sàng. Bây giờ:
-- 1. Copy URL và Anon Key vào file .env
-- 2. Tạo Storage bucket 'item-images' (public)
-- 3. Chạy app và test!
-- ============================================================
