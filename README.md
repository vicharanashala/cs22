<<<<<<< HEAD
<div align="center">

# 🏛️ Vicharanashala Internship Portal
### Official FAQ & Information Hub — IIT Ropar

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Vercel-black?style=for-the-badge)](https://iit-ropar-seven.vercel.app)
[![Backend](https://img.shields.io/badge/⚙️_API-Render-46E3B7?style=for-the-badge)](https://vicharanashala-internship.onrender.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Gemini](https://img.shields.io/badge/Gemini_2.0_Flash-AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev)

</div>

---

## 🌐 Live Website

**Frontend:** https://iit-ropar-seven.vercel.app

**Backend API:** https://vicharanashala-internship.onrender.com

---

## 📌 About the Project

A full-stack web application built for the **Vicharanashala Internship Programme at IIT Ropar** — a two-month, fully-online open-source internship run by Prof. Sudarshan Iyengar's lab.

The portal provides:

- 📚 A comprehensive, searchable **FAQ system** with bilingual support (English / Hindi)
- 🤖 **Yaksha** — an AI assistant powered by Gemini 2.0 Flash, trained on the full internship knowledge base
- 👍 A **voting system** so interns can upvote/downvote FAQ helpfulness
- 📊 A live **server status** indicator and real-time clock
- 🌙 **Dark / Light mode** toggle with persistent preference

---

## 🖥️ Tech Stack

| Layer | Technology |
|---------|---------|
| **Frontend** | React 19 + Vite 8 + React Router v7 |
| **Backend** | Python 3 + FastAPI + Uvicorn |
| **AI / Chat** | Google Gemini 2.0 Flash (`google-genai`) |
| **Styling** | Vanilla CSS |
| **Deployment** | Vercel + Render |
| **Data Storage** | JSON Flat Files |

---

## 🗂️ Project Structure

```text
IIT-Ropar/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chatbot.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── FAQItem.jsx
│   │   │   ├── ServerStatus.jsx
│   │   │   └── VoiceAssistant.jsx
│   │   ├── pages/
│   │   │   ├── Overview.jsx
│   │   │   └── FAQPage.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   ├── .env
│   ├── .env.production
│   └── vercel.json
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── faqs.json
│   ├── faqs_hi.json
│   ├── votes.json
│   └── .env
│
└── README.md
```

---

## ✨ Features

### 🔍 Searchable FAQ
- Instant search across all FAQs
- English ↔ Hindi language switch
- Category filtering
- Expand / Collapse controls

### 🤖 Yaksha AI Assistant
- Powered by Gemini 2.0 Flash
- Context-aware responses
- Internship knowledge-base integration
- Suggested questions
- Conversation history support

### 👍 Voting System
- Upvote / Downvote FAQ responses
- Optimistic UI updates
- Persistent local storage
- Backend synchronization

### 🎨 Modern UI/UX
- Glassmorphism design
- Dark / Light theme
- Responsive layout
- Smooth animations
- Live backend status indicator

---

## 🚀 Running Locally

### Prerequisites

- Node.js 18+
- Python 3.10+
- Google AI Studio API Key

### Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt

echo GEMINI_API_KEY=your_key_here > .env

uvicorn main:app --reload
```

Backend runs on:

```text
http://localhost:8000
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 🌐 Deployment

| Service | Purpose |
|----------|----------|
| Vercel | React Frontend Hosting |
| Render | FastAPI Backend Hosting |

### Render Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key
```

### Vercel Environment Variables

```env
VITE_API_BASE=https://vicharanashala-internship.onrender.com/api
```

### Production URLs

```text
Frontend:
https://iit-ropar-seven.vercel.app

Backend:
https://vicharanashala-internship.onrender.com
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|----------|----------|----------|
| GET | /api/health | Health check |
| GET | /api/faqs?lang=en | English FAQs |
| GET | /api/faqs?lang=hi | Hindi FAQs |
| GET | /api/votes | Fetch votes |
| POST | /api/vote | Submit vote |
| POST | /api/chat | Chat with Yaksha AI |

---

## 👨‍💻 Author

Built with ❤️ for the **Vicharanashala Internship Programme 2026**

**IIT Ropar**  
Lab of Prof. Sudarshan Iyengar  
https://samagama.in

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
=======
# cs22
>>>>>>> f81e5ad5e53caf66ab093ddd5feb6d0b20a93396
