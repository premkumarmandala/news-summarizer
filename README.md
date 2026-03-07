# 📰 News Summarizer AI

A modern, AI-powered web application built with **React 19** and **TypeScript** that transforms long news articles into concise, categorized summaries. Leverage the power of **Google Gemini** or local **Ollama** models to digest information faster.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Material UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white)

## ✨ Features

- **🤖 Dual AI Support**: Seamlessly switch between cloud-based **Google Gemini Pro** and local **Ollama** models.
- **📝 Smart Summarization**: Condense long-form news into clear 2-3 sentence summaries.
- **🏷️ Auto-Categorization**: Automatically classifies news into Technology, Business, Health, Science, Entertainment, Sports, or Politics.
- **⚡ Professional Formatting**: Rewrites content for clarity and adds structural headings for better readability.
- **🎨 Premium UI/UX**: Built with **Material UI (MUI)** featuring a responsive deep-purple theme and smooth transitions.
- **⚙️ Advanced Configuration**: Fine-tune AI responses by adjusting temperature and token limits.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Google Gemini API Key (Optional, for cloud processing)
- Ollama installed (Optional, for local processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/news-summarizer.git
   cd news-summarizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## 🛠️ Tech Stack

- **Framework**: React 19 (Hooks, Context API)
- **Language**: TypeScript
- **Styling**: Material UI (MUI), Emotion
- **AI Integration**:
  - `@google/generative-ai` (Gemini API)
  - `Axios` (Ollama API)
- **Routing**: React Router 6
- **Formatting**: `react-markdown`

## 📁 Project Structure

```text
src/
├── components/      # UI components (Form, List, Navigation)
├── services/        # AI logic (Gemini & Ollama integration)
├── types/           # TypeScript interfaces
├── App.tsx          # Main application logic & routing
└── index.tsx        # Entry point
```

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ for better information consumption.
