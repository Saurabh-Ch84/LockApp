<div align="center">
  <h3>🎥 Watch the Demo</h3>
  <a href="https://www.youtube.com/watch?v=_V04zUlaYHU" target="_blank">
    <img src="https://img.youtube.com/vi/_V04zUlaYHU/hqdefault.jpg" alt="Lock App Demo" width="600" style="border-radius: 10px; box-shadow: 0px 4px 10px rgba(0,0,0,0.5);">
  </a>
  <p><i>Click the image above to see how Lock works instantly!</i></p>
</div>

# 🔒 Lock - Desktop Website Blocker


> A high-performance desktop application that enforces productivity by blocking distracting websites at the system level (DNS Sinkhole).

## 🚀 Overview

**Lock** is a cross-platform desktop application designed to eliminate digital distractions. Unlike browser extensions which can be easily bypassed, Lock modifies the operating system's `hosts` file to redirect web traffic to `127.0.0.1` (localhost), effectively cutting off access to specific domains system-wide.

This project was architected to demonstrate **native system integration** using modern web technologies.

## 🛠 Tech Stack
* **Core:** [Electron](https://www.electronjs.org/) (Node.js + Chromium)
* **Frontend:** React 19, Vite
* **State Management:** Redux Toolkit (RTK) with Thunks
* **Routing:** React Router DOM
* **System Integration:** Node.js `fs` (File System), Child Process (`exec`), IPC (Inter-Process Communication)

## ✨ Key Features
* **🛡 System-Wide Blocking:** Uses a DNS Sinkhole approach to block websites across all browsers (Chrome, Edge, Firefox, etc.).
* **⚡ Instant Updates:** Automates DNS flushing (`ipconfig /flushdns`) to ensure blocks take effect immediately without lag.
* **🔐 Admin Authentication:** Secure login system with persistent session management to prevent impulsive unblocking.
* **📡 Secure Architecture:** Migrated from a legacy Python/Flask backend to a native Electron IPC architecture, reducing runtime dependencies and closing exposed HTTP ports.
* **🎨 Responsive UI:** Custom dark-themed UI with glassmorphism effects, built for resizing and varying screen densities.

## 🏗 Architecture
The application follows a **Main vs. Renderer** process architecture:

1.  **Renderer (React):** Handles the UI and State. It never touches the file system directly. Instead, it dispatches **Redux Thunks** which send secure messages via a **Context Bridge**.
2.  **Preload Script:** Acts as a security firewall, exposing only specific, safe functions (`blockSite`, `verifyUser`) to the frontend.
3.  **Main Process (Node.js):**
    * Listens for IPC events.
    * Validates input.
    * Modifies `C:\Windows\System32\drivers\etc\hosts`.
    * Executes shell commands to flush DNS cache.

## 📦 Installation & Setup

### Prerequisites
* Node.js installed.
* **Windows:** Must run terminal/IDE as **Administrator** (required to modify system files).

### Development
```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Run the application (Developer Mode)
# Ensure your terminal is running as Administrator!
npm run start

```

### Build for Production

To generate a standalone `.exe` installer:

```bash
npm run electron:build:win

```

The installer will be located in `frontend/dist-electron/`.

## 👨‍💻 Author

**Saurabh** *Aspiring Full Stack Developer specialized in React & System Utilities.*

---

*Note: This application modifies system files (`hosts`). Please use responsibly.*

```

```
