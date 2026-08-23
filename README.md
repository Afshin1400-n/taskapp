# 🚀 TaskFlow - Project Management Platform

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8)
![Zustand](https://img.shields.io/badge/Zustand-4.0-brown)
![License](https://img.shields.io/badge/License-MIT-green)

A modern project management platform built with **Next.js 14**, **TypeScript**, and **Zustand** for state management.

## ✨ Features

- 🔐 **Authentication** - Login & Register with validation
- 📁 **Project Management** - Create, update, and delete projects
- ✅ **Task Management** - Create, assign, and track tasks
- 🎯 **Drag & Drop** - Intuitive task board with drag-and-drop
- 🎨 **Modern UI** - Built with Shadcn/ui and Tailwind CSS
- 🌓 **Dark/Light Mode** - Seamless theme switching
- 📱 **Responsive** - Works on all devices
- 🗄️ **Mock API** - JSON Server for development

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 14](https://nextjs.org/) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Zustand](https://zustand-demo.pmnd.rs/) | State management |
| [Shadcn/ui](https://ui.shadcn.com/) | UI component library |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS |
| [Axios](https://axios-http.com/) | HTTP client |
| [JSON Server](https://github.com/typicode/json-server) | Mock REST API |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/taskflow.git

# Navigate to the project
cd taskflow

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start JSON Server (mock API)
npm run json-server

# In another terminal, start the development server
npm run dev