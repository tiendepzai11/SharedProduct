# Hướng dẫn đóng góp

Cảm ơn bạn đã quan tâm đến ShareZone! 🎉

Mọi đóng góp đều được chào đón, từ báo lỗi, đề xuất tính năng mới, cho đến gửi pull request.

## 🐛 Báo lỗi

Trước khi tạo issue mới, vui lòng kiểm tra xem lỗi đã được báo cáo chưa trong [Issues](https://github.com/yourusername/sharezone/issues).

Khi tạo issue mới, hãy cung cấp:
- Mô tả rõ ràng về lỗi
- Các bước tái hiện
- Hành vi mong đợi vs thực tế
- Ảnh chụp màn hình (nếu có)
- Thông tin môi trường (OS, browser, Node version)

## 💡 Đề xuất tính năng

Chúng tôi luôn muốn nghe ý tưởng của bạn! Hãy tạo issue với label `enhancement` và mô tả:
- Tính năng bạn muốn
- Vấn đề nó giải quyết
- Cách bạn hình dung nó hoạt động

## 🔧 Gửi Pull Request

### Quy trình

1. **Fork** repository
2. **Clone** fork của bạn:
   ```bash
   git clone https://github.com/yourusername/sharezone.git
   cd sharezone
   ```
3. **Tạo branch** mới:
   ```bash
   git checkout -b feature/ten-tinh-nang
   # hoặc
   git checkout -b fix/ten-loi
   ```
4. **Thực hiện thay đổi** và commit:
   ```bash
   git add .
   git commit -m "feat: thêm tính năng chat realtime"
   ```
5. **Push** lên fork:
   ```bash
   git push origin feature/ten-tinh-nang
   ```
6. **Tạo Pull Request** từ fork của bạn

### Convention cho commit messages

Chúng tôi sử dụng [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: thêm tính năng mới
fix: sửa lỗi
docs: cập nhật tài liệu
style: định dạng code, không thay đổi logic
refactor: refactor code
test: thêm test
chore: cập nhật dependencies, config
```

**Ví dụ:**
```
feat: thêm định vị GPS trên bản đồ
fix: sửa lỗi marker không hiện khi zoom xa
docs: cập nhật hướng dẫn cài đặt Supabase
refactor: tách component MapView từ MapPage
```

### Quy tắc đặt tên branch

- `feature/ten-tinh-nang` — Tính năng mới
- `fix/ten-loi` — Sửa lỗi
- `docs/ten-tai-lieu` — Tài liệu
- `refactor/ten-refactor` — Refactor
- `test/ten-test` — Thêm test

### Code style

- Sử dụng **TypeScript** cho tất cả code mới
- Tuân thủ **ESLint** config hiện có
- Format code với **Prettier**
- Viết comment rõ ràng cho các hàm phức tạp
- Đặt tên biến/hàm có ý nghĩa, dễ hiểu

### Kiểm tra trước khi PR

```bash
# Kiểm tra TypeScript
npm run typecheck

# Build production
npm run build

# Chạy thử locally
npm run dev
```

## 🎨 Guidelines cho thiết kế

Nếu bạn đóng góp về UI/UX:
- Tuân thủ **bảng màu** đã định (xem README.md)
- Sử dụng **Fraunces** cho tiêu đề, **Inter** cho nội dung
- Giữ phong cách "sổ tay/bảng tin" — thủ công, thân quen
- Không dùng ALL CAPS cho labels
- Không thêm animation không cần thiết

## 📚 Tài liệu

Khi thêm tính năng mới, nhớ cập nhật:
- README.md (nếu là tính năng lớn)
- SUPABASE_SETUP.md (nếu liên quan database)
- Comment trong code (cho logic phức tạp)

## ❓ Cần giúp đỡ?

- Tạo issue với label `question`
- Hoặc liên hệ qua [Discussions](https://github.com/yourusername/sharezone/discussions)

## 🙏 Cảm ơn

Mọi đóng góp, dù nhỏ, đều được trân trọng. Cảm ơn bạn đã giúp ShareZone tốt hơn! ❤️
