from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json
import os
import asyncio

app = FastAPI(title="Vicharanashala FAQ API")

# Setup CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FAQS_PATH = os.path.join(BASE_DIR, "faqs.json")
VOTES_PATH = os.path.join(BASE_DIR, "votes.json")

# Initialize votes file if it doesn't exist
if not os.path.exists(VOTES_PATH):
    with open(VOTES_PATH, "w") as f:
        json.dump({}, f)

class VoteRequest(BaseModel):
    faq_id: str
    vote_type: Optional[str] = None      # "up", "down", or None (= remove vote)
    previous_vote: Optional[str] = None  # what the user voted before, if anything

class ChatRequest(BaseModel):
    query: str

@app.get("/api/faqs")
def get_faqs():
    if not os.path.exists(FAQS_PATH):
        raise HTTPException(status_code=404, detail="FAQ data not found")
    with open(FAQS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

@app.get("/api/votes")
def get_votes():
    with open(VOTES_PATH, "r", encoding="utf-8") as f:
        votes = json.load(f)
    return votes

@app.post("/api/vote")
def post_vote(req: VoteRequest):
    with open(VOTES_PATH, "r", encoding="utf-8") as f:
        votes = json.load(f)

    # Ensure the entry exists
    if req.faq_id not in votes:
        votes[req.faq_id] = {"up": 0, "down": 0}

    entry = votes[req.faq_id]

    # Undo the previous vote (if the user is switching or removing)
    if req.previous_vote in ("up", "down"):
        entry[req.previous_vote] = max(0, entry.get(req.previous_vote, 0) - 1)

    # Apply the new vote (None means the user just removed their vote)
    if req.vote_type in ("up", "down"):
        entry[req.vote_type] = entry.get(req.vote_type, 0) + 1

    with open(VOTES_PATH, "w", encoding="utf-8") as f:
        json.dump(votes, f, indent=2)

    return {"status": "success", "votes": entry}

@app.post("/api/chat")
async def chat(req: ChatRequest):
    # Placeholder for LLM logic
    # Wait to simulate processing
    await asyncio.sleep(1.5)
    return {"answer": f"I am a placeholder response from the FastAPI backend! You said: '{req.query}'. Plug your LLM API logic in backend/main.py."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
