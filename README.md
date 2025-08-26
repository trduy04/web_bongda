# ⚽ Web Bóng Đá - React TypeScript

Ứng dụng web xem thông tin bóng đá được xây dựng bằng React và TypeScript, cung cấp giao diện hiện đại và trải nghiệm người dùng tốt.

## 🚀 Tính năng

- **Xem trận đấu**: Hiển thị danh sách các trận đấu với thông tin chi tiết
- **Bảng xếp hạng**: Theo dõi thứ hạng các đội bóng trong giải đấu
- **Tìm kiếm và lọc**: Tìm kiếm trận đấu, đội bóng theo nhiều tiêu chí
- **Đăng nhập**: Hệ thống xác thực người dùng với modal đăng nhập
- **Giao diện responsive**: Tương thích với mọi thiết bị
- **Dark/Light mode**: Hỗ trợ chế độ tối và sáng

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 18 + TypeScript
- **Styling**: SCSS + Tailwind CSS
- **Build Tool**: Vite
- **Package Manager**: npm
- **API**: Football API (tích hợp sẵn)

## 📦 Cài đặt

1. **Clone repository**
```bash
git clone https://github.com/trduy04/web_bongda.git
cd web_bongda
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Chạy dự án**
```bash
npm run dev
```

4. **Mở trình duyệt**
Truy cập [http://localhost:5173](http://localhost:5173)

## 🏗️ Cấu trúc dự án

```
src/
├── components/
│   ├── Auth/           # Components xác thực
│   │   └── LoginModal/ # Modal đăng nhập
│   ├── Header/         # Header trang web
│   ├── Layout/         # Layout chính
│   ├── Match/          # Components hiển thị trận đấu
│   └── Search/         # Components tìm kiếm
├── services/
│   └── footballApi.ts  # API service
└── App.tsx            # Component chính
```

## 🎯 Cách sử dụng

### Xem trận đấu
- Truy cập trang chủ để xem danh sách trận đấu
- Sử dụng bộ lọc để tìm trận đấu theo giải đấu, ngày thi đấu
- Click vào trận đấu để xem chi tiết

### Tìm kiếm
- Sử dụng thanh tìm kiếm để tìm đội bóng, cầu thủ
- Áp dụng các bộ lọc nâng cao

### Đăng nhập
- Click vào nút "Đăng nhập" để mở modal
- Sử dụng tài khoản mạng xã hội hoặc email

## 🔧 Scripts

```bash
npm run dev          # Chạy development server
npm run build        # Build production
npm run preview      # Preview build
npm run lint         # Kiểm tra code style
```

## 📱 Responsive Design

Ứng dụng được thiết kế responsive và tương thích với:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 👨‍💻 Tác giả

**Trần Duy** - [GitHub](https://github.com/trduy04)

## 📞 Liên hệ

- GitHub: [@trduy04](https://github.com/trduy04)
- Email: [your-email@example.com]

---

⭐ Nếu dự án này hữu ích, hãy cho một star nhé!
