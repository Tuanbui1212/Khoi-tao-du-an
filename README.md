🚀 MyProject Generator

CLI tool tự động tạo boilerplate cho dự án Fullstack (Express + React + Vite)
Một công cụ dòng lệnh mạnh mẽ giúp bạn khởi tạo dự án fullstack hoàn chỉnh chỉ trong vài giây, bao gồm cả backend (Express + MongoDB) và frontend (React + Vite) với cấu trúc thư mục chuẩn và code mẫu sẵn sàng.

✨ Tính năng

🎯 Khởi tạo nhanh: Tạo dự án fullstack hoàn chỉnh trong 1 lệnh
📁 Cấu trúc chuẩn: Folder structure theo best practices
🔧 Auto-install: Tự động cài đặt tất cả dependencies
📝 Code mẫu: Đi kèm controllers, routes, components mẫu
🎨 Styling sẵn: SASS + Tailwind CSS setup
🔌 API ready: Backend API với MongoDB đã config sẵn
📖 Documentation: README.md chi tiết cho mỗi project
🔐 Environment: File .env và .gitignore tự động

📦 Yêu cầu

Node.js >= 14.x
npm >= 6.x
MongoDB (nếu muốn dùng database)

🚀 Cài đặt
Cách 1: Clone repository

```bash
git clone https://github.com/yourusername/myproject-generator.git
cd myproject-generator
npm install
```

Cách 2: Cài global (khuyên dùng)

```bash
npm install -g myproject-generator
```

Cách 3: Chạy trực tiếp với npx

```bash
npx myproject-generator
```

💻 Cách sử dụng

1. Chạy tool

```bash
node index.js
```

Hoặc nếu đã cài global:

```bash
hmyproject-generator
```

2. Nhập tên dự án

```bash
   🚀 MyProject Project Generator

? Tên dự án: MyAwesomeApp 3. Chờ tool tạo project
```

Tool sẽ tự động:

- ✅ Tạo cấu trúc thư mục
- ✅ Cài đặt dependencies cho backend
- ✅ Cài đặt dependencies cho frontend
- ✅ Tạo file code mẫu
- ✅ Config môi trường

4. Chạy dự án
   Backend:
   bashcd MyAwesomeApp/backend
   npm run dev
   ➡️ Server chạy tại: http://localhost:5000
   Frontend:
   bashcd MyAwesomeApp/frontend
   npm run dev
   ➡️ App chạy tại: http://localhost:5173

📁 Cấu trúc Project được tạo

```bash
MyAwesomeApp/
├── README.md
├── .gitignore
│
├── backend/ # Express API
│ ├── .env # Environment variables
│ ├── .gitignore
│ ├── package.json
│ └── src/
│ ├── index.js # Entry point
│ ├── app/
│ │ ├── controllers/ # Request handlers
│ │ │ └── SiteController.js
│ │ ├── middlewares/ # Custom middlewares
│ │ ├── models/ # Mongoose models
│ │ │ └── Example.js
│ │ └── routes/ # API routes
│ │ ├── index.js
│ │ └── site.js
│ ├── config/
│ │ └── db/
│ │ └── index.js # Database connection
│ └── utils/ # Helper functions
│
└── frontend/ # React + Vite
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── src/
├── main.jsx # Entry point
├── App.jsx # Root component
├── assets/ # Static files
│ ├── images/
│ └── font/
├── components/
│ ├── GlobalStyles/ # Global CSS
│ │ ├── index.js
│ │ ├── GlobalStyles.scss
│ │ └── \_variables.scss
│ └── Layout/
│ ├── DefaultLayout/
│ └── components/
│ ├── Header/
│ └── Footer/
├── pages/
│ ├── Home/
│ │ └── index.js
│ └── About/
│ └── index.js
├── routes/
│ └── index.js # Route config
└── utils/ # Helper functions

```

🔧 Configuration
Available Scripts
Backend

```bash
npm start # Start with debugging (nodemon --inspect)
npm run dev # Start development server
```

Frontend

```bash
npm run dev # Start dev server (port 5173)
npm run build # Build for production
npm run preview # Preview production build
```

🎯 Use Cases
Phù hợp cho:

- ✅ Dự án học tập và thực hành
- ✅ Hackathon và prototype nhanh
- ✅ Starter template cho dự án thật
- ✅ POC (Proof of Concept) projects
- ✅ Learning fullstack development

Không phù hợp cho:

- ❌ Dự án cần microservices phức tạp
- ❌ Ứng dụng cần GraphQL
- ❌ Project cần Next.js SSR

🔄 Workflow đề xuất

Start coding! 🎉

📚 Tài liệu tham khảo

Express.js Documentation
MongoDB Documentation
React Documentation
Vite Documentation
React Router

🐛 Known Issues
Issue 1: MongoDB Connection Error
Triệu chứng: MongoDB connection error: connect ECONNREFUSED
Giải pháp:

```bash
# Kiểm tra MongoDB đã chạy chưa
mongod --version

# Start MongoDB
mongod
```

Issue 2: Port already in use
Triệu chứng: Error: listen EADDRINUSE: address already in use :::5000
Giải pháp:

```bash
# Tìm process đang dùng port
lsof -i :5000

# Kill process
kill -9 <PID>
```

Issue 3: Module not found
Triệu chứng: Cannot find module 'express'
Giải pháp:

```bash
# Xóa node_modules và reinstall
cd backend
rm -rf node_modules package-lock.json
npm install
```

🤝 Contributing
Contributions are welcome!

1. Fork the project
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

📝 Changelog
Version 1.0.0 (2025-01-XX)

- ✨ Initial release
- 🎯 Auto project generation
- 📁 Full folder structure
- 🔧 Environment setup
- 📖 Documentation generation

📄 License
MIT License - see LICENSE file for details

👨‍💻 Author
Bùi Anh Tuấn

GitHub: @Tuanbui1212
Email: Tuanbui.code@gmail.com

🌟 Show your support
Give a ⭐️ if this project helped you!

💡 Tips & Tricks
Custom modifications
Sau khi tạo project, bạn có thể tùy chỉnh:

1. Thêm middleware: Tạo file trong backend/src/app/middlewares/
2. Thêm model: Tạo file trong backend/src/app/models/
3. Thêm page: Tạo folder trong frontend/src/pages/
4. Custom theme: Sửa frontend/src/components/GlobalStyles/\_variables.scss

Best practices

- 🔐 Không commit file .env
- 📝 Cập nhật README.md cho project của bạn
- 🧪 Viết tests cho code của bạn
- 🔄 Dùng Git từ đầu: git init

<div align="center">
  <strong>Happy Coding! 🚀</strong>
  <br />
  <sub>Built with ❤️ using Node.js</sub>
</div>
