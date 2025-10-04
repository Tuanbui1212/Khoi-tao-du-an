#!/usr/bin/env node
import { execSync } from "child_process";
import { createRequire } from "module";
import path from "path";
const require = createRequire(import.meta.url);

function safeImport(pkg) {
  try {
    return require(pkg);
  } catch {
    console.log(`⚙️  Chưa có ${pkg} → đang cài đặt...`);
    execSync(`npm install ${pkg}`, { stdio: "inherit" });
    return require(pkg);
  }
}

const fs = safeImport("fs-extra");
import chalk from "chalk";
import inquirer from "inquirer";

const __dirname = process.cwd();

async function main() {
  console.log(chalk.green("🚀 MyProject Project Generator\n"));

  const { projectName } = await inquirer.prompt([
    {
      name: "projectName",
      message: "Tên dự án:",
      default: "MyProject",
    },
  ]);

  const projectPath = path.join(__dirname, projectName);
  await fs.ensureDir(projectPath);

  console.log(chalk.cyan("📁 Đang tạo cấu trúc thư mục..."));

  // Danh sách thư mục
  const folders = [
    "backend/src/app/controllers",
    "backend/src/app/middlewares",
    "backend/src/app/models",
    "backend/src/app/routes",
    "backend/src/config/db",
    "backend/src/utils",

    "frontend/src/assets/font",
    "frontend/src/assets/images",
    "frontend/src/components/GlobalStyles",
    "frontend/src/components/Layout",
    "frontend/src/components/Layout/DefaultLayout",
    "frontend/src/components/Layout/components/Footer",
    "frontend/src/components/Layout/components/Header",
    "frontend/src/pages",
    "frontend/src/pages/Home",
    "frontend/src/routes",
    "frontend/src/utils",
  ];

  for (const folder of folders) {
    await fs.ensureDir(path.join(projectPath, folder));
  }

  console.log(chalk.green("✅ Thư mục đã tạo xong."));

  // Tạo file code mẫu
  await createSampleFiles(projectPath, projectName);

  console.log(chalk.cyan("\n📦 Đang khởi tạo môi trường Node.js..."));

  // Cài đặt môi trường
  await setupEnvironment(projectPath);

  console.log(chalk.yellow("\n🎉 Hoàn tất khởi tạo dự án MyProject!"));
  console.log(chalk.cyan("\n📖 Hướng dẫn sử dụng:"));
  console.log(
    chalk.white(`
  Backend:
    cd ${projectName}/backend
    npm run dev
    
  Frontend:
    cd ${projectName}/frontend
    npm run dev
  `)
  );
}

async function setupEnvironment(projectPath) {
  console.log(chalk.cyan("\n📦 Đang khởi tạo môi trường Node.js..."));

  try {
    // 🟦 Backend
    execSync(`cd ${projectPath}/backend && npm init -y`, { stdio: "inherit" });

    // Cài dependencies chính (đã thêm cors)
    execSync(
      `cd ${projectPath}/backend && npm install express mongoose dotenv cors mongoose-slug-updater`,
      { stdio: "inherit" }
    );

    // Cài các dev dependencies
    execSync(
      `cd ${projectPath}/backend && npm install nodemon morgan mongoose-delete --save-dev`,
      { stdio: "inherit" }
    );

    // 🧠 Thêm script "start" và "dev" tự động
    const backendPkgPath = path.join(projectPath, "backend", "package.json");
    const backendPkg = fs.readJsonSync(backendPkgPath);

    backendPkg.scripts = backendPkg.scripts || {};
    backendPkg.scripts.start = "nodemon --inspect ./src/index.js";
    backendPkg.scripts.dev = "nodemon ./src/index.js";

    fs.writeJsonSync(backendPkgPath, backendPkg, { spaces: 2 });

    console.log(
      chalk.green("✅ Đã thêm script start & dev vào backend/package.json")
    );

    // 🟩 Frontend setup
    console.log(chalk.cyan("\n🟩 Đang khởi tạo frontend với Vite + React..."));

    // Tạo project Vite React
    execSync(
      `cd ${projectPath} && npm create vite@latest frontend -- --template react`,
      { stdio: "inherit" }
    );

    // Cài dependencies
    execSync(`cd ${projectPath}/frontend && npm install`, { stdio: "inherit" });

    // Cài thêm các thư viện phổ biến
    execSync(`cd ${projectPath}/frontend && npm install react-router-dom`, {
      stdio: "inherit",
    });

    // Cài dev dependencies
    execSync(`cd ${projectPath}/frontend && npm install sass clsx --save-dev`, {
      stdio: "inherit",
    });

    console.log(chalk.green("✅ Frontend setup hoàn tất!"));
    console.log(chalk.green("\n✅ Đã cài đặt môi trường hoàn tất!"));
  } catch (err) {
    console.error(chalk.red("❌ Lỗi khi cài đặt môi trường:"), err);
  }
}

async function createSampleFiles(base, projectName) {
  // ============ BACKEND FILES ============

  // 1. Database config
  const dbCode = `const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

module.exports = { connect };
`;

  // 2. Model example
  const modelCode = `const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const ExampleSchema = new Schema(
  {
    name: { type: String, maxLength: 255, required: true },
    slug: { type: String, slug: "name", unique: true },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Example", ExampleSchema);
`;

  // 3. Controller
  const controllerCode = `class SiteController {
  // [GET] /
  index(req, res, next) {
    res.json({ 
      message: "🚀 Backend API is running!",
      timestamp: new Date().toISOString()
    });
  }

  // [GET] /about
  about(req, res, next) {
    res.json({ 
      message: "About page",
      version: "1.0.0"
    });
  }
}

module.exports = new SiteController();
`;

  // 4. Routes - site.js
  const siteRoutes = `const express = require("express");
const router = express.Router();
const siteController = require("../app/controllers/SiteController");

router.get("/", siteController.index);
router.get("/about", siteController.about);

module.exports = router;
`;

  // 5. Routes - index.js (main router)
  const routesIndex = `const siteRouter = require("./site");

function route(app) {
  app.use("/api", siteRouter);
  
  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
  });
}

module.exports = route;
`;

  // 6. Main index.js
  const indexJS = `const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const route = require("./routes");
const db = require("./config/db");

const app = express();
const port = process.env.PORT || 5000;

// Connect to database
db.connect();

// Middleware
app.use(morgan("combined"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
route(app);

app.listen(port, () => {
  console.log(\`🚀 Server is running on http://localhost:\${port}\`);
});
`;

  // 7. .env file
  const envContent = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/${projectName.toLowerCase()}
NODE_ENV=development
`;

  // 8. Backend .gitignore
  const backendGitignore = `node_modules/
.env
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
`;

  // ============ FRONTEND FILES ============

  // 1. Header component
  const headerJS = `function Header() {
  return (
    <header style={{ padding: "20px", background: "#0ea5e9", color: "white" }}>
      <h1>My Project Header</h1>
      <nav>
        <a href="/" style={{ color: "white", marginRight: "15px" }}>Home</a>
        <a href="/about" style={{ color: "white" }}>About</a>
      </nav>
    </header>
  );
}

export default Header;
`;

  // 2. Footer component
  const footerJS = `function Footer() {
  return (
    <footer style={{ padding: "20px", background: "#333", color: "white", textAlign: "center", marginTop: "auto" }}>
      <p>&copy; 2025 MyProject. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
`;

  // 3. DefaultLayout
  const defaultLayoutJS = `import Header from "../components/Header";
import Footer from "../components/Footer";

function DefaultLayout({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <main style={{ flex: 1, padding: "20px" }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default DefaultLayout;
`;

  // 4. Home page
  const homePageJS = `import { useState, useEffect } from "react";

function Home() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api")
      .then((res) => res.json())
      .then((data) => {
        setApiData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Welcome to MyProject! 🚀</h1>
      <p>Start building your awesome application.</p>
      
      <div style={{ marginTop: "20px", padding: "15px", background: "#f0f0f0", borderRadius: "8px" }}>
        <h3>Backend API Status:</h3>
        {loading ? (
          <p>Loading...</p>
        ) : apiData ? (
          <pre>{JSON.stringify(apiData, null, 2)}</pre>
        ) : (
          <p style={{ color: "red" }}>❌ Cannot connect to backend. Make sure it's running on port 5000.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
`;

  // 5. About page
  const aboutPageJS = `function About() {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is a sample about page.</p>
    </div>
  );
}

export default About;
`;

  // 6. Routes config
  const routesJS = `import Home from "../pages/Home";
import About from "../pages/About";

const publicRoutes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
`;

  // 7. App.js
  const appJS = `import { BrowserRouter, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";
import DefaultLayout from "./components/Layout/DefaultLayout";
import { Fragment } from "react";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;

            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
`;

  // 8. main.jsx (Vite uses main.jsx instead of index.js)
  const mainJS = `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GlobalStyles from "./components/GlobalStyles";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalStyles>
      <App />
    </GlobalStyles>
  </React.StrictMode>
);
`;

  // 9. GlobalStyles
  const globalStylesJS = `import "./GlobalStyles.scss";

function GlobalStyles({ children }) {
  return children;
}

export default GlobalStyles;
`;

  const globalStylesScss = `/* Tailwind core */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Google Font */
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap");

/* Variables */
@import "./variables";

/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-family: "Montserrat", sans-serif;
  font-size: 62.5%;
}

body {
  font-size: 1.6rem;
  line-height: 1.6;
  color: var(--text-color);
}
`;

  const variablesScss = `:root {
  --primary-color: #0ea5e9;
  --text-color: #333;
  --white-color: #fff;
  --bg-color: #f5f5f5;
}
`;

  // 10. Frontend .gitignore
  const frontendGitignore = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`;

  // 11. README.md
  const readme = `# ${projectName}

Fullstack boilerplate project with Express (Backend) and React + Vite (Frontend).

## 📁 Structure

\`\`\`
${projectName}/
├── backend/          # Express + MongoDB API
│   ├── src/
│   │   ├── app/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   └── routes/
│   │   ├── config/
│   │   └── index.js
│   └── package.json
│
└── frontend/         # React + Vite
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── routes/
    │   └── App.js
    └── package.json
\`\`\`

## 🚀 Quick Start

### Backend Setup
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`
Backend will run on: http://localhost:5000

### Frontend Setup
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
Frontend will run on: http://localhost:5173

## 📝 Environment Variables

Create \`.env\` file in backend folder:
\`\`\`
PORT=5000
MONGODB_URI=mongodb://localhost:27017/${projectName.toLowerCase()}
NODE_ENV=development
\`\`\`

## 🛠 Tech Stack

**Backend:**
- Express.js
- MongoDB + Mongoose
- CORS
- Morgan (logging)

**Frontend:**
- React 18
- Vite
- React Router DOM
- SASS

## 📦 Available Scripts

### Backend
- \`npm run dev\` - Start development server with nodemon
- \`npm start\` - Start with debugging

### Frontend
- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build

## 🎯 Features

- ✅ Modern fullstack setup
- ✅ MongoDB integration
- ✅ React Router for navigation
- ✅ SASS support
- ✅ Hot reload for both frontend and backend
- ✅ Environment variables configuration
- ✅ CORS enabled

## 📖 Documentation

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [MongoDB Docs](https://www.mongodb.com/docs/)

---
Created with ❤️ using MyProject Generator
`;

  // 12. Root .gitignore
  const rootGitignore = `node_modules/
.DS_Store
*.log
.env
.env.local
`;

  // ============ WRITE ALL FILES ============

  // Backend files
  await fs.writeFile(path.join(base, "backend/src/config/db/index.js"), dbCode);
  await fs.writeFile(
    path.join(base, "backend/src/app/models/Example.js"),
    modelCode
  );
  await fs.writeFile(
    path.join(base, "backend/src/app/controllers/SiteController.js"),
    controllerCode
  );
  await fs.writeFile(path.join(base, "backend/src/routes/site.js"), siteRoutes);
  await fs.writeFile(
    path.join(base, "backend/src/routes/index.js"),
    routesIndex
  );
  await fs.writeFile(path.join(base, "backend/src/index.js"), indexJS);
  await fs.writeFile(path.join(base, "backend/.env"), envContent);
  await fs.writeFile(path.join(base, "backend/.gitignore"), backendGitignore);

  // Frontend files
  await fs.writeFile(
    path.join(
      base,
      "frontend/src/components/Layout/components/Header/index.js"
    ),
    headerJS
  );
  await fs.writeFile(
    path.join(
      base,
      "frontend/src/components/Layout/components/Footer/index.js"
    ),
    footerJS
  );
  await fs.writeFile(
    path.join(base, "frontend/src/components/Layout/DefaultLayout/index.js"),
    defaultLayoutJS
  );
  await fs.writeFile(
    path.join(base, "frontend/src/components/GlobalStyles/index.js"),
    globalStylesJS
  );
  await fs.writeFile(
    path.join(base, "frontend/src/components/GlobalStyles/GlobalStyles.scss"),
    globalStylesScss
  );
  await fs.writeFile(
    path.join(base, "frontend/src/components/GlobalStyles/_variables.scss"),
    variablesScss
  );
  await fs.writeFile(
    path.join(base, "frontend/src/pages/Home/index.js"),
    homePageJS
  );
  await fs.writeFile(
    path.join(base, "frontend/src/pages/About/index.js"),
    aboutPageJS
  );
  await fs.writeFile(path.join(base, "frontend/src/routes/index.js"), routesJS);
  await fs.writeFile(path.join(base, "frontend/src/App.jsx"), appJS);
  await fs.writeFile(path.join(base, "frontend/src/main.jsx"), mainJS);
  await fs.writeFile(path.join(base, "frontend/.gitignore"), frontendGitignore);

  // Root files
  await fs.writeFile(path.join(base, "README.md"), readme);
  await fs.writeFile(path.join(base, ".gitignore"), rootGitignore);

  console.log(chalk.green("✅ Đã tạo tất cả file mẫu!"));
}

main().catch((err) => console.error(chalk.red(err)));
