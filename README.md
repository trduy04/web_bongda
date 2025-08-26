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

### Frontend
- **React 18** + **TypeScript**
- **SCSS** + **Tailwind CSS**
- **Vite** (Build Tool)
- **npm** (Package Manager)

### Backend
- **Node.js** + **Express.js**
- **JWT** (Authentication)
- **bcryptjs** (Password Hashing)
- **express-validator** (Input Validation)
- **helmet** (Security)
- **morgan** (Logging)
- **CORS** (Cross-Origin Resource Sharing)

## 📦 Cài đặt

### 1. Clone repository
```bash
git clone https://github.com/trduy04/web_bongda.git
cd web_bongda
```

### 2. Cài đặt Frontend
```bash
npm install
```

### 3. Cài đặt Backend
```bash
cd server
npm install
```

### 4. Cấu hình Environment Variables
```bash
# Copy file env.example
cp server/env.example server/.env

# Chỉnh sửa file .env theo nhu cầu
```

### 5. Chạy Backend
```bash
cd server
npm run dev
```

### 6. Chạy Frontend (terminal mới)
```bash
npm run dev
```

### 7. Truy cập ứng dụng
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

## 🏗️ Cấu trúc dự án

```
├── src/                    # Frontend React
│   ├── components/
│   │   ├── Auth/           # Components xác thực
│   │   │   └── LoginModal/ # Modal đăng nhập
│   │   ├── Header/         # Header trang web
│   │   ├── Layout/         # Layout chính
│   │   ├── Match/          # Components hiển thị trận đấu
│   │   └── Search/         # Components tìm kiếm
│   ├── services/
│   │   └── footballApi.ts  # API service
│   └── App.tsx            # Component chính
│
├── server/                 # Backend Node.js
│   ├── routes/
│   │   ├── auth.js        # Authentication routes
│   │   ├── matches.js     # Match management routes
│   │   ├── teams.js       # Team management routes
│   │   └── leagues.js     # League management routes
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── env.example        # Environment variables template
│
├── package.json           # Frontend dependencies
└── README.md             # Project documentation
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

### Frontend Scripts
```bash
npm run dev          # Chạy development server
npm run build        # Build production
npm run preview      # Preview build
npm run lint         # Kiểm tra code style
```

### Backend Scripts
```bash
cd server
npm run dev          # Chạy development server với nodemon
npm start            # Chạy production server
npm test             # Chạy tests
```

## 📱 Responsive Design

Ứng dụng được thiết kế responsive và tương thích với:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Matches
- `GET /api/matches` - Lấy danh sách trận đấu
- `GET /api/matches/:id` - Lấy thông tin trận đấu
- `POST /api/matches` - Tạo trận đấu mới
- `PUT /api/matches/:id` - Cập nhật trận đấu
- `DELETE /api/matches/:id` - Xóa trận đấu

### Teams
- `GET /api/teams` - Lấy danh sách đội bóng
- `GET /api/teams/:id` - Lấy thông tin đội bóng
- `GET /api/teams/league/:league/standings` - Bảng xếp hạng
- `POST /api/teams` - Tạo đội bóng mới
- `PUT /api/teams/:id` - Cập nhật đội bóng

### Leagues
- `GET /api/leagues` - Lấy danh sách giải đấu
- `GET /api/leagues/:id` - Lấy thông tin giải đấu
- `GET /api/leagues/:id/stats` - Thống kê giải đấu
- `POST /api/leagues` - Tạo giải đấu mới
- `PUT /api/leagues/:id` - Cập nhật giải đấu
- `DELETE /api/leagues/:id` - Xóa giải đấu

### Health Check
- `GET /api/health` - Kiểm tra trạng thái server

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
