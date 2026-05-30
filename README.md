# Vicharanashala Internship FAQ - Full Stack App

This project is a modern, full-stack FAQ web application. It features a React JS frontend with a premium dark mode UI, and a Python FastAPI backend for serving data and handling API requests.

## Folder Structure

- `/frontend/` - Contains the React JS frontend (Vite).
- `/backend/` - Contains the Python FastAPI server and the JSON databases (`faqs.json`, `votes.json`).

---

## 🚀 Quick Start Guide

You need to run **both** servers to see the full website in action.

### 1. Start the Backend (FastAPI)
1. Open a terminal and navigate to the `/backend` folder:
   ```bash
   cd backend
   ```
2. (Optional but recommended) Create a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   uvicorn main:app --reload
   ```
   *The backend will run on `http://localhost:8000`.*

### 2. Start the Frontend (React)
1. Open a **new, separate terminal** and navigate to the `/frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the node modules (if you haven't already):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

4. **Open `http://localhost:5173` in your browser!**

---

## 🛠️ Modifying the Chatbot
The Chatbot UI makes a `POST` request to the backend at `/api/chat`.
To connect your own LLM API:
1. Open `backend/main.py`
2. Scroll down to the `@app.post("/api/chat")` function.
3. Replace the placeholder asyncio sleep logic with your custom LLM API call in Python and return the text in the `{"answer": ...}` JSON format.
