#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Checking dependencies...");

// ============ AUTO SETUP PACKAGE.JSON ============
const packageJsonPath = path.join(__dirname, "package.json");
const packageJsonContent = {
  name: "myproject-generator",
  version: "1.0.0",
  type: "module",
  description: "Fullstack project generator",
  main: "setup.js",
  dependencies: {
    chalk: "4.1.2",
    inquirer: "8.2.5",
    "fs-extra": "11.2.0",
    ora: "5.4.1",
  },
};

if (!fs.existsSync(packageJsonPath)) {
  console.log("📦 Tạo package.json...");
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJsonContent, null, 2)
  );
}

// Kiểm tra dependencies
const nodeModulesPath = path.join(__dirname, "node_modules");
const needsInstall =
  !fs.existsSync(nodeModulesPath) ||
  !fs.existsSync(path.join(nodeModulesPath, "chalk")) ||
  !fs.existsSync(path.join(nodeModulesPath, "inquirer")) ||
  !fs.existsSync(path.join(nodeModulesPath, "fs-extra")) ||
  !fs.existsSync(path.join(nodeModulesPath, "ora"));

// ✅ FIX: Chỉ cài đặt 1 lần duy nhất, không restart
if (needsInstall) {
  console.log("📦 Cài đặt dependencies...");
  try {
    execSync("npm install", { stdio: "inherit", cwd: __dirname });
    console.log("✅ Đã cài xong dependencies!");
    console.log("⚠️  Vui lòng chạy lại script: node setup.js\n");
    process.exit(0); // Thoát ra, để user tự chạy lại
  } catch (err) {
    console.error("❌ Lỗi khi cài dependencies:", err.message);
    process.exit(1);
  }
}

// ✅ Import sau khi đã có dependencies
const fsExtra = (await import("fs-extra")).default;
const chalk = (await import("chalk")).default;
const inquirer = (await import("inquirer")).default;
const ora = (await import("ora")).default;

const projectCwd = process.cwd();

async function main() {
  console.log(chalk.green("🚀 MyProject Project Generator\n"));

  const { projectName } = await inquirer.prompt([
    {
      name: "projectName",
      message: "Tên dự án:",
      default: "MyProject",
    },
  ]);

  const projectPath = path.join(projectCwd, projectName);
  await fsExtra.ensureDir(projectPath);

  const spinner = ora("Đang tạo cấu trúc thư mục...").start();

  // Danh sách thư mục
  const folders = [
    // Backend folders
    "backend/src/app/controllers",
    "backend/src/app/middlewares",
    "backend/src/app/models",
    "backend/src/app/routes",
    "backend/src/config/db",
    "backend/src/utils",

    // Frontend folders
    "frontend/src/assets/font",
    "frontend/src/assets/images",
    "frontend/src/components/GlobalStyles",
    "frontend/src/components/Layout",
    "frontend/src/components/Layout/DefaultLayout",
    "frontend/src/components/Layout/components/Footer",
    "frontend/src/components/Layout/components/Header",
    "frontend/src/pages",
    "frontend/src/pages/Home",
    "frontend/src/pages/About",
    "frontend/src/routes",
    "frontend/src/utils",
  ];

  for (const folder of folders) {
    await fsExtra.ensureDir(path.join(projectPath, folder));
  }

  spinner.succeed("Thư mục đã tạo xong");

  // Tạo file code mẫu
  spinner.start("Đang tạo file mẫu...");
  await createSampleFiles(projectPath, projectName);
  spinner.succeed("File mẫu đã tạo xong");

  // Cài đặt môi trường
  await setupEnvironment(projectPath);

  console.log(chalk.yellow("\n🎉 Hoàn tất khởi tạo dự án MyProject!"));
  console.log(chalk.cyan("\n📖 Hướng dẫn sử dụng:"));
  console.log(
    chalk.white(`
  Backend:
    cd ${projectName}/backend
    npm start
    
  Frontend:
    cd ${projectName}/frontend
    npm start
  `)
  );
}

async function setupEnvironment(projectPath) {
  console.log(chalk.cyan("\n📦 Đang khởi tạo môi trường Node.js..."));

  try {
    // 🟦 Backend
    execSync(`cd ${projectPath}/backend && npm init -y`, { stdio: "inherit" });

    execSync(
      `cd ${projectPath}/backend && npm install express mongoose dotenv cors mongoose-slug-updater`,
      { stdio: "inherit" }
    );

    execSync(
      `cd ${projectPath}/backend && npm install nodemon morgan mongoose-delete --save-dev`,
      { stdio: "inherit" }
    );

    // Thêm scripts
    const backendPkgPath = path.join(projectPath, "backend", "package.json");
    const backendPkg = fsExtra.readJsonSync(backendPkgPath);

    backendPkg.scripts = backendPkg.scripts || {};
    backendPkg.scripts.start = "nodemon --inspect ./src/index.js";
    backendPkg.scripts.dev = "nodemon ./src/index.js";

    fsExtra.writeJsonSync(backendPkgPath, backendPkg, { spaces: 2 });

    console.log(chalk.green("✅ Backend setup hoàn tất!"));

    // 🟩 Frontend
    console.log(chalk.cyan("\n🟩 Đang khởi tạo frontend..."));

    // Tạo package.json cho frontend
    const frontendPkgPath = path.join(projectPath, "frontend", "package.json");
    const frontendPkg = {
      name: "frontend",
      private: true,
      version: "0.0.0",
      type: "module",
      scripts: {
        start: "vite",
        dev: "vite",
        build: "vite build",
        preview: "vite preview",
      },
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.20.0",
      },
      devDependencies: {
        "@types/react": "^18.2.43",
        "@types/react-dom": "^18.2.17",
        "@vitejs/plugin-react": "^4.2.1",
        vite: "^5.0.8",
        sass: "^1.69.5",
        clsx: "^2.0.0",
        tailwindcss: "^3.4.0",
        postcss: "^8.4.32",
        autoprefixer: "^10.4.16",
      },
    };

    await fsExtra.writeJson(frontendPkgPath, frontendPkg, { spaces: 2 });

    // Tạo vite.config.js
    const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
`;
    await fsExtra.writeFile(
      path.join(projectPath, "frontend", "vite.config.js"),
      viteConfig
    );

    // Tạo index.html
    const indexHtml = `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MyProject</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;
    await fsExtra.writeFile(
      path.join(projectPath, "frontend", "index.html"),
      indexHtml
    );

    // Tạo tailwind.config.js
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
    await fsExtra.writeFile(
      path.join(projectPath, "frontend", "tailwind.config.js"),
      tailwindConfig
    );

    // Tạo postcss.config.js
    const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
    await fsExtra.writeFile(
      path.join(projectPath, "frontend", "postcss.config.js"),
      postcssConfig
    );

    // Cài dependencies
    console.log(chalk.cyan("📦 Đang cài đặt dependencies cho frontend..."));
    execSync(`cd ${projectPath}/frontend && npm install`, {
      stdio: "inherit",
    });

    console.log(chalk.green("✅ Frontend setup hoàn tất!"));
  } catch (err) {
    console.error(chalk.red("❌ Lỗi khi cài đặt môi trường:"), err);
  }
}

async function createSampleFiles(base, projectName) {
  // ============ BACKEND FILES ============

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

  const siteRoutes = `const express = require("express");
const router = express.Router();
const siteController = require("../controllers/SiteController");

router.get("/", siteController.index);
router.get("/about", siteController.about);

module.exports = router;
`;

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

  const indexJS = `const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const route = require("./app/routes");
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

  const envContent = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/${projectName.toLowerCase()}
NODE_ENV=development
`;

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

  const footerJS = `function Footer() {
  return (
    <footer style={{ padding: "20px", background: "#333", color: "white", textAlign: "center", marginTop: "auto" }}>
      <p>&copy; 2025 MyProject. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
`;

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

  const routesJS = `import Home from "../pages/Home";
import About from "../pages/About";

const publicRoutes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
`;

  const appJS = `import { BrowserRouter, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";
import DefaultLayout from "./components/Layout/DefaultLayout";
import { Fragment } from "react";

function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
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

  const globalStylesJS = `import "./GlobalStyles.scss";

function GlobalStyles({ children }) {
  return children;
}

export default GlobalStyles;
`;

  const globalStylesScss = `/* Google Font */
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap");

/* Tailwind base styles */
@tailwind base;
@tailwind components;
@tailwind utilities;

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
- \`npm start\` - Start development server with nodemon & debugging
- \`npm run dev\` - Start development server with nodemon

### Frontend
- \`npm start\` - Start development server
- \`npm run dev\` - Start development server (same as start)
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

---
Created with ❤️ using MyProject Generator
`;

  const rootGitignore = `node_modules/
.DS_Store
*.log
.env
.env.local
`;

  // ============ WRITE ALL FILES ============

  await fsExtra.writeFile(
    path.join(base, "backend/src/config/db/index.js"),
    dbCode
  );
  await fsExtra.writeFile(
    path.join(base, "backend/src/app/models/Example.js"),
    modelCode
  );
  await fsExtra.writeFile(
    path.join(base, "backend/src/app/controllers/SiteController.js"),
    controllerCode
  );
  await fsExtra.writeFile(
    path.join(base, "backend/src/app/routes/site.js"),
    siteRoutes
  );
  await fsExtra.writeFile(
    path.join(base, "backend/src/app/routes/index.js"),
    routesIndex
  );
  await fsExtra.writeFile(path.join(base, "backend/src/index.js"), indexJS);
  await fsExtra.writeFile(path.join(base, "backend/.env"), envContent);
  await fsExtra.writeFile(
    path.join(base, "backend/.gitignore"),
    backendGitignore
  );

  await fsExtra.writeFile(
    path.join(
      base,
      "frontend/src/components/Layout/components/Header/index.jsx"
    ),
    headerJS
  );
  await fsExtra.writeFile(
    path.join(
      base,
      "frontend/src/components/Layout/components/Footer/index.jsx"
    ),
    footerJS
  );
  await fsExtra.writeFile(
    path.join(base, "frontend/src/components/Layout/DefaultLayout/index.jsx"),
    defaultLayoutJS
  );
  await fsExtra.writeFile(
    path.join(base, "frontend/src/components/GlobalStyles/index.jsx"),
    globalStylesJS
  );
  await fsExtra.writeFile(
    path.join(base, "frontend/src/components/GlobalStyles/GlobalStyles.scss"),
    globalStylesScss
  );
  await fsExtra.writeFile(
    path.join(base, "frontend/src/components/GlobalStyles/_variables.scss"),
    variablesScss
  );
  await fsExtra.writeFile(
    path.join(base, "frontend/src/pages/Home/index.jsx"),
    homePageJS
  );
  await fsExtra.writeFile(
    path.join(base, "frontend/src/pages/About/index.jsx"),
    aboutPageJS
  );
  await fsExtra.writeFile(
    path.join(base, "frontend/src/routes/index.jsx"),
    routesJS
  );
  await fsExtra.writeFile(path.join(base, "frontend/src/App.jsx"), appJS);
  await fsExtra.writeFile(path.join(base, "frontend/src/main.jsx"), mainJS);
  await fsExtra.writeFile(
    path.join(base, "frontend/.gitignore"),
    frontendGitignore
  );

  await fsExtra.writeFile(path.join(base, "README.md"), readme);
  await fsExtra.writeFile(path.join(base, ".gitignore"), rootGitignore);
}

main().catch((err) => console.error(chalk.red("❌ Error:", err.message)));
