# ✅ TaskApp

A modern project & task management app built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **Zustand**.  
Manage projects, assign tasks to team members, and track progress — all with a clean, dark-mode-ready UI.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-State-orange)
![json-server](https://img.shields.io/badge/json--server-Mock%20API-purple)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- 🔐 **Authentication** — Register & login with persistent sessions (Zustand + localStorage)
- 📁 **Projects** — Create, edit, and delete projects with color tags
- 👥 **Team Members** — Add multiple members to each project
- ✅ **Tasks** — Full CRUD for tasks with:
  - Title & description
  - Status (`TODO`, `IN_PROGRESS`, `DONE`)
  - Priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`)
  - Due date
  - Assignee
- 🎨 **Modern UI** — Clean design with Tailwind CSS v4
- 🌗 **Dark Mode Ready** — All components support `dark:` classes
- ⚡ **Fast State Management** — Zustand for global state
- 🗂️ **Mock Backend** — Powered by `json-server` with `db.json`

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework (App Router) |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Styling |
| **Zustand** | Global state (auth, theme) |
| **axios** | HTTP requests |
| **react-hook-form + zod** | Form handling & validation |
| **react-hot-toast** | Toast notifications |
| **json-server** | Mock REST API |

---

## 📦 Installation

### Prerequisites

- Node.js **18+**
- npm / yarn / pnpm

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/taskapp.git

# 2. Navigate into the project
cd taskapp

# 3. Install dependencies
npm install

# 4. Run the mock server (terminal 1)
npm run server

# 5. Run the dev server (terminal 2)
npm run dev