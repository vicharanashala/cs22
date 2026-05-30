import React, { useState, useEffect } from 'react';
import FAQItem from '../components/FAQItem';
import Chatbot from '../components/Chatbot';

const API_BASE = 'http://localhost:8000/api';
const USER_VOTES_KEY = 'faq_user_votes';
const TOP_FAQ_IDS = ['q-1-1', 'q-2-1', 'q-3-3', 'q-4-1'];

function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [votes, setVotes] = useState({});        // aggregate counts from server
  const [userVotes, setUserVotes] = useState({}); // this user's choices, from localStorage
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchData();
    // Restore this user's votes from localStorage
    const saved = localStorage.getItem(USER_VOTES_KEY);
    if (saved) setUserVotes(JSON.parse(saved));
  }, []);

  const fetchData = async () => {
    try {
      const [faqsRes, votesRes] = await Promise.all([
        fetch(`${API_BASE}/faqs`),
        fetch(`${API_BASE}/votes`)
      ]);
      setFaqs(await faqsRes.json());
      setVotes(await votesRes.json());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  const handleVote = async (faqId, clickedType) => {
    const previousVote = userVotes[faqId] || null;   // what user had before
    // Clicking the same button removes the vote; clicking different switches it
    const newVote = previousVote === clickedType ? null : clickedType;

    // 1. Update localStorage immediately
    const updatedUserVotes = { ...userVotes, [faqId]: newVote };
    setUserVotes(updatedUserVotes);
    localStorage.setItem(USER_VOTES_KEY, JSON.stringify(updatedUserVotes));

    // 2. Optimistic aggregate update
    setVotes(prev => {
      const cur = { up: 0, down: 0, ...(prev[faqId] || {}) };
      if (previousVote) cur[previousVote] = Math.max(0, cur[previousVote] - 1);
      if (newVote)       cur[newVote]      = cur[newVote] + 1;
      return { ...prev, [faqId]: cur };
    });

    // 3. Sync with backend
    try {
      await fetch(`${API_BASE}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          faq_id: faqId,
          vote_type: newVote,       // null = remove
          previous_vote: previousVote
        })
      });
    } catch (err) {
      console.error('Error casting vote:', err);
    }
  };

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  const expandAll = () => {
    const newExpanded = {};
    faqs.forEach(sec => sec.questions.forEach(q => { newExpanded[q.id] = true; }));
    setExpanded(newExpanded);
  };
  const collapseAll = () => setExpanded({});

  if (loading) return <div style={{ color: 'white', padding: '4rem 2rem', textAlign: 'center' }}>Loading FAQs…</div>;

  const allQs = faqs.flatMap(sec => sec.questions);
  const topFaqs = allQs.filter(q => TOP_FAQ_IDS.includes(q.id));
  const query = searchQuery.toLowerCase();
  const filteredFaqs = faqs
    .map(sec => ({
      ...sec,
      questions: sec.questions.filter(q =>
        q.question.toLowerCase().includes(query) || q.answer.toLowerCase().includes(query)
      )
    }))
    .filter(sec => sec.questions.length > 0);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>How can we help you?</h1>
          <p>Everything you need to know about the Vicharanashala Internship, dates, selection, and the VINS online programme.</p>
          <div className="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search the FAQ (e.g. NOC, stipend, dates)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <main className="container">
        {query.length === 0 && (
          <section className="top-faqs-section">
            <h2 className="section-heading"><span className="highlight">Frequently</span> Asked</h2>
            <div className="faq-list">
              {topFaqs.map(faq => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isExpanded={!!expanded[faq.id]}
                  onToggle={() => toggleExpand(faq.id)}
                  votes={votes[faq.id]}
                  userVote={userVotes[faq.id] || null}
                  onVote={handleVote}
                />
              ))}
            </div>
          </section>
        )}

        <section className="all-faqs-section">
          <h2 className="section-heading">All Questions</h2>
          <div className="controls">
            <button onClick={expandAll} className="btn-ghost">Expand All</button>
            <button onClick={collapseAll} className="btn-ghost">Collapse All</button>
          </div>
          <div>
            {filteredFaqs.map(section => (
              <div key={section.id} className="faq-category">
                <h3>{section.title}</h3>
                <div className="faq-list">
                  {section.questions.map(faq => (
                    <FAQItem
                      key={faq.id}
                      faq={faq}
                      isExpanded={!!expanded[faq.id]}
                      onToggle={() => toggleExpand(faq.id)}
                      votes={votes[faq.id]}
                      userVote={userVotes[faq.id] || null}
                      onVote={handleVote}
                    />
                  ))}
                </div>
              </div>
            ))}
            {filteredFaqs.length === 0 && (
              <p style={{ color: 'var(--text-muted)' }}>No questions found for "{searchQuery}".</p>
            )}
          </div>
        </section>
      </main>

      <Chatbot apiUrl={API_BASE} />
    </>
  );
}

export default FAQPage;
