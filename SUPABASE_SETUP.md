# ShareZone - Hướng dẫn Setup Supabase

## 📋 Tổng quan

Ứng dụng hiện đang dùng **localStorage** để demo. Để chuyển sang database thật với Supabase, làm theo các bước sau.

## 🚀 Các bước setup

### 1. Tạo Supabase Project

1. Truy cập [https://supabase.com](https://supabase.com)
2. Đăng nhập/đăng ký tài khoản
3. Click **"New Project"**
4. Điền thông tin:
   - **Name**: ShareZone (hoặc tên bất kỳ)
   - **Database Password**: Tạo password mạnh (lưu lại để dùng sau)
   - **Region**: Chọn region gần nhất (Singapore)
5. Click **"Create new project"** và đợi ~2 phút

### 2. Lấy API Credentials

1. Vào **Dashboard** → **Settings** → **API**
2. Copy 2 giá trị:
   - **Project URL** (dạng `https://xxxxx.supabase.co`)
   - **Project API keys** → **anon** `public` key

### 3. Cấu hình Environment Variables

Tạo file `.env` trong thư mục gốc (copy từ `.env.example`):

```bash
cp .env.example .env
```

Mở file `.env` và điền:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Chạy SQL Migration

1. Vào **Dashboard** → **SQL Editor**
2. Click **"New Query"**
3. Copy toàn bộ nội dung file `supabase/migrations/001_initial_schema.sql`
4. Paste vào SQL Editor
5. Click **"Run"** (hoặc Ctrl+Enter)

SQL sẽ tạo:
- ✅ Bảng `users` (profile)
- ✅ Bảng `items` (đồ dùng)
- ✅ Bảng `requests` (yêu cầu)
- ✅ Bảng `conversations` (cuộc trò chuyện)
- ✅ Bảng `messages` (tin nhắn)
- ✅ Row Level Security (RLS) policies
- ✅ Helper functions

### 5. Tạo Storage Bucket

1. Vào **Dashboard** → **Storage**
2. Click **"New bucket"**
3. Điền:
   - **Name**: `item-images`
   - **Public bucket**: ✅ Check
4. Click **"Create bucket"**

### 6. Kiểm tra

Khởi động lại dev server:

```bash
npm run dev
```

Ứng dụng sẽ tự động chuyển sang dùng Supabase nếu đã cấu hình đúng.

## 🔐 Row Level Security (RLS)

Schema đã bật RLS với các policy:

- **Users**: Ai cũng xem được, chỉ sửa được profile của mình
- **Items**: Ai cũng xem được, chỉ chủ sở hữu mới sửa/xóa
- **Requests**: Ai cũng xem được, chỉ người tạo mới sửa
- **Conversations**: Chỉ người tham gia mới xem được
- **Messages**: Chỉ người tham gia conversation mới xem/gửi được

## 📊 Cấu trúc Database

```
users
├── id (UUID, FK → auth.users)
├── email
├── name
├── avatar_url
└── created_at

items
├── id (UUID)
├── owner_id (FK → users)
├── title
├── description
├── image_url
├── category (sách/điện tử/đồ gia dụng/quần áo/khác)
├── transaction_type (cho tặng/cho mượn/trao đổi)
├── status (available/requested/completed)
├── latitude
├── longitude
├── location_label
└── created_at

requests
├── id (UUID)
├── item_id (FK → items)
├── requester_id (FK → users)
├── status (pending/approved/rejected)
└── created_at

conversations
├── id (UUID)
├── item_id (FK → items)
├── participant_1 (FK → users)
├── participant_2 (FK → users)
├── last_message_at
├── last_message_preview
└── created_at

messages
├── id (UUID)
├── conversation_id (FK → conversations)
├── sender_id (FK → users)
├── content
├── read (boolean)
└── created_at
```

## 🔄 Chuyển đổi giữa localStorage và Supabase

Hiện tại app dùng **localStorage** làm fallback. Khi đã cấu hình Supabase:

1. Mở `src/store/AppContext.tsx`
2. Thay thế các hàm gọi localStorage bằng các hàm từ `src/lib/supabase.ts`
3. Ví dụ:
   ```typescript
   // Thay vì:
   const items = loadFromStorage('items', []);
   
   // Dùng:
   const { data: items } = await getItems();
   ```

## 🧪 Testing

### Test Auth
```typescript
import { signUp, signIn, signOut } from './lib/supabase';

// Đăng ký
await signUp('test@example.com', 'password123', 'Test User');

// Đăng nhập
await signIn('test@example.com', 'password123');

// Đăng xuất
await signOut();
```

### Test Items
```typescript
import { getItems, createItem } from './lib/supabase';

// Lấy tất cả items
const { data: items } = await getItems();

// Tạo item mới
await createItem({
  title: 'Giáo trình Giải tích 1',
  description: 'Sách còn mới 90%',
  image_url: 'https://...',
  category: 'sách',
  transaction_type: 'cho tặng',
  latitude: 10.7756,
  longitude: 106.7019,
  location_label: 'Quận 1 - Chợ Bến Thành'
});
```

### Test Chat
```typescript
import { sendMessage, getMessages } from './lib/supabase';

// Gửi tin nhắn
await sendMessage(conversationId, 'Chào bạn!');

// Lấy tin nhắn
const { data: messages } = await getMessages(conversationId);
```

## 🐛 Troubleshooting

### Lỗi "Failed to fetch"
- Kiểm tra `VITE_SUPABASE_URL` có đúng không
- Đảm bảo không có khoảng trắng thừa

### Lỗi "Invalid API key"
- Kiểm tra `VITE_SUPABASE_ANON_KEY` có đúng không
- Copy lại từ Dashboard → Settings → API

### Lỗi "relation does not exist"
- Chưa chạy SQL migration
- Vào SQL Editor và chạy lại file `001_initial_schema.sql`

### Lỗi "new row violates row-level security policy"
- Chưa đăng nhập (auth.uid() = null)
- Thử đăng nhập lại

## 📚 Tài liệu tham khảo

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)

## ✅ Checklist

- [ ] Tạo Supabase project
- [ ] Copy URL và Anon Key vào `.env`
- [ ] Chạy SQL migration
- [ ] Tạo Storage bucket `item-images`
- [ ] Test đăng ký/đăng nhập
- [ ] Test tạo item
- [ ] Test chat

---

**Lưu ý**: App vẫn chạy được với localStorage khi chưa cấu hình Supabase. Chỉ cần điền credentials là sẽ chuyển sang database thật.
