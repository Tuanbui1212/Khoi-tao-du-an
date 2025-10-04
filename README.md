# 🚀 MyProject Generator

CLI tool tự động tạo boilerplate cho dự án Fullstack (Express + React + Vite)

## ✨ Tính năng

- 🎯 Khởi tạo dự án fullstack hoàn chỉnh trong 1 lệnh
- 📁 Cấu trúc thư mục theo best practices
- 🔧 Tự động cài đặt tất cả dependencies
- 📝 Code mẫu với controllers, routes, components
- 🎨 SASS + Tailwind CSS đã setup sẵn
- 🔌 Backend API với MongoDB config sẵn

## 📦 Yêu cầu

- Node.js >= 14.x
- npm >= 6.x
- MongoDB (optional)

## 🚀 Cài đặt & Sử dụng

```bash
# Clone repository
git clone https://github.com/yourusername/myproject-generator.git
cd myproject-generator

# Chạy tool
node setup.js

# Nhập tên dự án khi được hỏi
? Tên dự án: MyAwesomeApp
```

**Lưu ý:** Lần chạy đầu tiên sẽ tự động cài dependencies và yêu cầu chạy lại lần 2.

## 💻 Khởi động dự án

**Backend:**

```bash
cd MyAwesomeApp/backend
npm run dev
# ➡️ http://localhost:5000
```

**Frontend:**

```bash
cd MyAwesomeApp/frontend
npm run dev
# ➡️ http://localhost:5173
```

## 📁 Cấu trúc dự án

```
MyAwesomeApp/
├── backend/              # Express + MongoDB
│   ├── src/
│   │   ├── app/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   └── routes/
│   │   ├── config/db/
│   │   └── index.js
│   └── .env
│
└── frontend/             # React + Vite
    ├── src/
    │   ├── components/
    │   │   ├── GlobalStyles/
    │   │   └── Layout/
    │   ├── pages/
    │   ├── routes/
    │   └── App.jsx
    └── vite.config.js
```

## 🛠 Tech Stack

**Backend:** Express, MongoDB, Mongoose, CORS, Morgan, Nodemon  
**Frontend:** React 18, Vite, React Router, SASS, Tailwind CSS

## ⚙️ Configuration

File `.env` trong `backend/`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/myproject
NODE_ENV=development
```

## 🐛 Xử lý lỗi thường gặp

**MongoDB connection error:**

```bash
# Kiểm tra và khởi động MongoDB
mongod
```

**Port đã được sử dụng:**

```bash
# Tìm và kill process
lsof -i :5000
kill -9 <PID>
```

**Module not found:**

```bash
# Cài lại dependencies
cd backend && npm install
cd frontend && npm install
```

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License

## 👨‍💻 Author

**Bùi Anh Tuấn**  
GitHub: [@Tuanbui1212](https://github.com/Tuanbui1212)  
Email: Tuanbui.code@gmail.com

---

<div align="center">
  <strong>Happy Coding! 🚀</strong>
  <br />
  <sub>Built with ❤️ using Node.js</sub>
</div>
