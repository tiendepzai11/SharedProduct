# ShareZone - Nền tảng chia sẻ đồ dùng thành phố

> Ứng dụng web kết nối người dân thành phố qua việc chia sẻ, cho mượn và trao đổi đồ dùng không còn sử dụng.

## 🎨 Thiết kế

Giao diện theo phong cách **"sổ tay/bảng tin khu phố"** - thân quen, thủ công, đáng tin:
- Bảng màu: giấy ngà (#FAF6EE), xanh rêu (#566B4F), cam đất (#B5622C), vàng bơ (#D9A441)
- Typography: Fraunces (serif) cho tiêu đề, Inter (sans-serif) cho nội dung
- Hiệu ứng "dấu mộc" cho trạng thái món đồ
- Marker bản đồ hình tròn, popup dạng "mảnh giấy dán"

## ✨ Tính năng

### Core Features
- ✅ **Đăng đồ**: Form đầy đủ với danh mục, loại giao dịch, vị trí
- ✅ **Danh sách & Lọc**: Grid view với filter theo danh mục, loại giao dịch, trạng thái
- ✅ **Bản đồ**: Leaflet + OpenStreetMap, marker phân biệt theo trạng thái
- ✅ **Chi tiết món đồ**: Hiển thị đầy đủ thông tin, nút "Tôi muốn món này"
- ✅ **Yêu cầu & Trạng thái**: Luồng yêu cầu → xác nhận → hoàn thành
- ✅ **Chat**: Nhắn tin giữa chủ đồ và người yêu cầu
- ✅ **Định vị**: Tìm vị trí hiện tại, tính khoảng cách thực
- ✅ **Auth**: Đăng ký/đăng nhập (demo với localStorage)

### Database
- ✅ **Supabase Ready**: Schema SQL đầy đủ, RLS policies, helper functions
- ⚠️ **Demo Mode**: Đang dùng localStorage (chưa cấu hình Supabase)

## 🚀 Quick Start

### 1. Clone và cài đặt

```bash
git clone <your-repo>
cd sharezone
npm install
```

### 2. Chạy demo (không cần Supabase)

```bash
npm run dev
```

App sẽ chạy với localStorage, dữ liệu mẫu 15 món đồ khắp TP.HCM.

### 3. Cấu hình Supabase (optional)

Xem chi tiết tại [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

Tóm tắt:
```bash
# 1. Copy file .env.example thành .env
cp .env.example .env

# 2. Điền thông tin Supabase vào .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# 3. Chạy SQL migration trong Supabase SQL Editor
# File: supabase/migrations/001_initial_schema.sql

# 4. Tạo Storage bucket 'item-images' (public)

# 5. Restart dev server
npm run dev
```

## 📁 Cấu trúc Project

```
sharezone/
├── src/
│   ├── components/          # UI components
│   │   ├── Navbar.tsx
│   │   ├── ItemRow.tsx
│   │   ├── MapView.tsx
│   │   └── EmptyIllustration.tsx
│   ├── pages/               # Route pages
│   │   ├── HomePage.tsx
│   │   ├── MapPage.tsx
│   │   ├── AddItemPage.tsx
│   │   ├── ItemDetailPage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── MyItemsPage.tsx
│   │   ├── MyRequestsPage.tsx
│   │   ├── MessagesPage.tsx
│   │   └── ConversationPage.tsx
│   ├── store/
│   │   └── AppContext.tsx   # State management (localStorage)
│   ├── lib/
│   │   └── supabase.ts    # Supabase client & helpers
│   ├── data/
│   │   └── seedData.ts    # Dữ liệu mẫu
│   ├── types.ts           # TypeScript types
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Tailwind + custom styles
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Database schema
├── .env                     # Environment variables (tạo mới)
├── .env.example            # Template
├── SUPABASE_SETUP.md       # Hướng dẫn chi tiết
└── README.md              # File này
```

## 🗄️ Database Schema

### Tables
- **users**: Profile người dùng
- **items**: Đồ dùng (title, description, category, location, status...)
- **requests**: Yêu cầu nhận đồ
- **conversations**: Cuộc trò chuyện
- **messages**: Tin nhắn

### Row Level Security
Tất cả bảng đều bật RLS:
- Items: Ai cũng xem, chỉ chủ sở hữu sửa/xóa
- Conversations: Chỉ người tham gia mới xem được
- Messages: Chỉ người tham gia conversation mới xem/gửi

## 🎨 Design System

### Màu sắc
```css
--color-paper: #FAF6EE        /* Nền giấy ngà */
--color-ink: #262019          /* Mực chữ chính */
--color-moss: #566B4F         /* Xanh rêu (chủ đạo) */
--color-terracotta: #B5622C   /* Cam đất (cảnh báo) */
--color-butter: #D9A441       /* Vàng bơ (tag) */
--color-lead: #8C8577         /* Xám chì (text phụ) */
```

### Typography
- **Tiêu đề**: Fraunces (serif), weight 600-700
- **Nội dung**: Inter (sans-serif), line-height 1.6
- **Italic**: Dùng cho lời dẫn, subtitle

### Components
- **Stamp**: Dấu mộc cho trạng thái (có sẵn/có người hỏi/đã trao xong)
- **Marker**: Hình tròn 18px, hover scale 1.1
- **Popup**: Rotate -1deg, nền giấy ngà
- **Bubble chat**: Rotate ±0.5deg, phong cách giấy dán

## 📱 Routes

| Route | Component | Mô tả |
|-------|-----------|-------|
| `/` | HomePage | Danh sách món đồ + toggle bản đồ |
| `/map` | MapPage | Bản đồ toàn màn hình |
| `/add` | AddItemPage | Form đăng đồ mới |
| `/item/:id` | ItemDetailPage | Chi tiết món đồ |
| `/auth` | AuthPage | Đăng nhập/đăng ký |
| `/my-items` | MyItemsPage | Đồ tôi đã đăng |
| `/my-requests` | MyRequestsPage | Yêu cầu của tôi |
| `/messages` | MessagesPage | Danh sách cuộc trò chuyện |
| `/messages/:id` | ConversationPage | Chi tiết cuộc trò chuyện |

## 🧪 Demo Accounts

Khi dùng localStorage, có sẵn 5 tài khoản demo:
- `minh@demo.com`
- `lan@demo.com`
- `hung@demo.com`
- `hoa@demo.com`
- `tung@demo.com`

Mật khẩu: bất kỳ (không kiểm tra)

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v6
- **Maps**: Leaflet + react-leaflet
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **State**: React Context + localStorage (demo)

## 📝 Scripts

```bash
npm run dev          # Khởi động dev server
npm run build        # Build production
npm run preview      # Preview build
npm run typecheck    # Kiểm tra TypeScript
```

## 🔐 Security

- Row Level Security (RLS) cho tất cả bảng
- Anon key chỉ dùng cho client-side
- Service role key chỉ dùng cho server-side (nếu cần)
- Không commit `.env` lên git

## 📄 License

MIT

## 🤝 Contributing

1. Fork repo
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📧 Contact

Được xây dựng cho hackathon - Nền tảng chia sẻ đồ dùng thành phố.

---

**Lưu ý**: App đang ở chế độ demo với localStorage. Để sử dụng database thật, xem [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).
