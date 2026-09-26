# Changelog

Tất cả các thay đổi đáng chú ý của dự án này sẽ được ghi lại trong file này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/),
và dự án này tuân theo [Semantic Versioning](https://semver.org/lang/vi/).

## [Unreleased]

### Added
- Chuẩn bị cho Phase 2: Realtime chat với Supabase Realtime
- Kế hoạch upload ảnh thật với Supabase Storage
- Roadmap cho multi-city support

## [1.0.0] - 2024-11-15

### Added
- **Tính năng cốt lõi:**
  - Đăng đồ dùng với form đầy đủ (tên, mô tả, ảnh, danh mục, loại giao dịch, vị trí)
  - Danh sách món đồ dạng "dòng ghi chú trong sổ tay"
  - Tìm kiếm và lọc theo danh mục, loại giao dịch, trạng thái
  - Sắp xếp theo mới nhất hoặc gần nhất
  - Toggle giữa chế độ danh sách và bản đồ
  
- **Bản đồ:**
  - Tích hợp Leaflet + OpenStreetMap
  - Marker hình tròn phân biệt theo trạng thái (xanh rêu / cam đất)
  - Popup dạng "mảnh giấy dán" với thông tin chi tiết
  - Định vị GPS người dùng
  - Fallback tile server khi OSM chính bị lỗi
  - Attribution "© OpenStreetMap contributors"
  
- **Chi tiết món đồ:**
  - Hiển thị đầy đủ thông tin, ảnh, mô tả
  - Dấu mộc trạng thái (có sẵn / có người hỏi / đã trao xong)
  - Nút "Tôi muốn món này" và "Nhắn tin"
  - Thông tin người đăng và vị trí
  
- **Yêu cầu & Trạng thái:**
  - Luồng yêu cầu: gửi → chờ → xác nhận/từ chối
  - Tự động cập nhật trạng thái món đồ
  - Trang "Đồ của tôi" cho chủ đồ
  - Trang "Yêu cầu của tôi" cho người xin
  
- **Chat:**
  - Nhắn tin trực tiếp giữa chủ đồ và người yêu cầu
  - Danh sách cuộc trò chuyện với preview tin nhắn cuối
  - Badge đếm tin nhắn chưa đọc trên navbar
  - Giao diện chat dạng "mảnh giấy" xoay nhẹ
  
- **Xác thực:**
  - Đăng ký / đăng nhập bằng email
  - 5 demo accounts có sẵn để test
  - Sẵn sàng tích hợp Supabase Auth
  
- **Thiết kế:**
  - Phong cách "sổ tay/bảng tin khu phố"
  - Bảng màu tùy chỉnh: giấy ngà, xanh rêu, cam đất, vàng bơ
  - Typography: Fraunces (serif) + Inter (sans-serif)
  - Hiệu ứng dấu mộc cho trạng thái
  - Animation "ghim đồ" khi đăng mới
  - Minh họa nét vẽ tay cho trạng thái rỗng
  
- **Database:**
  - Supabase schema đầy đủ (users, items, requests, conversations, messages)
  - Row Level Security (RLS) cho tất cả bảng
  - Indexes cho performance
  - Trigger tự tạo user profile khi đăng ký
  - Helper function `get_unread_count()`
  
- **Dữ liệu mẫu:**
  - 15 món đồ thực tế (giáo trình, nồi cơm điện, quạt bàn, tai nghe, etc.)
  - 24 địa điểm khắp TP.HCM
  - 5 users demo
  - 2 cuộc trò chuyện mẫu với 6 tin nhắn
  
- **Tài liệu:**
  - README.md chi tiết với badges, screenshots, tech stack
  - SUPABASE_SETUP.md hướng dẫn cấu hình Supabase
  - CONTRIBUTING.md hướng dẫn đóng góp
  - CODE_OF_CONDUCT.md quy tắc ứng xử
  - CHANGELOG.md (file này)
  - LICENSE MIT

### Technical Details
- React 18 + TypeScript 5.7
- Vite 6 cho build tool
- Tailwind CSS 4 cho styling
- React Router 6 cho routing
- Leaflet + react-leaflet cho bản đồ
- Lucide React cho icons
- date-fns cho date formatting
- localStorage cho demo mode
- Supabase client sẵn sàng cho production

---

## Versioning

- **Major** (X.0.0): Thay đổi không tương thích ngược
- **Minor** (0.X.0): Thêm tính năng mới, tương thích ngược
- **Patch** (0.0.X): Sửa lỗi, tương thích ngược

[Unreleased]: https://github.com/yourusername/sharezone/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourusername/sharezone/releases/tag/v1.0.0
