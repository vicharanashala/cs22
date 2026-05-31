import React, { useState, useEffect } from 'react';
import FAQItem from '../components/FAQItem';
import Chatbot from '../components/Chatbot';

const API_BASE = 'http://localhost:8000/api';
const USER_VOTES_KEY = 'faq_user_votes';
const TOP_FAQ_IDS = ['q-1-1', 'q-2-1', 'q-3-3', 'q-4-1'];

function FAQPage({ lang = 'en' }) {
  const [faqs, setFaqs] = useState([]);
  const [votes, setVotes] = useState({});        // aggregate counts from server
  const [userVotes, setUserVotes] = useState({}); // this user's choices, from localStorage
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    fetchData();
    // Restore this user's votes from localStorage
    const saved = localStorage.getItem(USER_VOTES_KEY);
    if (saved) setUserVotes(JSON.parse(saved));
  }, [lang]);

  // Monitor which category is currently in view to highlight in sidebar
  useEffect(() => {
    if (faqs.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-110px 0px -65% 0px', // trigger highlight when category header enters top-middle of viewport
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const secId = entry.target.id.replace('sec-', '');
          setActiveSection(secId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const targets = document.querySelectorAll('.faq-category');
    targets.forEach((target) => observer.observe(target));

    return () => {
      targets.forEach((target) => observer.unobserve(target));
    };
  }, [faqs, searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [faqsRes, votesRes] = await Promise.all([
        fetch(`${API_BASE}/faqs?lang=${lang}`),
        fetch(`${API_BASE}/votes`)
      ]);
      const faqsData = await faqsRes.json();
      setFaqs(faqsData);
      
      // Default active section to the first section loaded
      if (faqsData.length > 0) {
        setActiveSection(faqsData[0].id);
      }
      
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

  const handleScrollToSection = (id) => {
    const el = document.getElementById(`sec-${id}`);
    if (el) {
      const yOffset = -100; // Account for the sticky header
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

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

          <div className="faq-layout">
            {/* ── Left Sidebar (Desktop Only) ── */}
            <aside className="faq-sidebar-container">
              <div className="faq-sidebar-title">Categories</div>
              <div className="faq-sidebar-list">
                {filteredFaqs.map(sec => (
                  <button
                    key={sec.id}
                    className={`faq-sidebar-link ${activeSection === sec.id ? 'active' : ''}`}
                    onClick={() => handleScrollToSection(sec.id)}
                    title={sec.title}
                  >
                    {sec.title.split('. ')[1] || sec.title}
                  </button>
                ))}
              </div>
            </aside>

            {/* ── Right Content Container ── */}
            <div className="faq-content-main">
              {/* Sticky Horizontally Scrollable Chips (Mobile Only) */}
              <nav className="faq-mobile-chips">
                {filteredFaqs.map(sec => (
                  <button
                    key={sec.id}
                    className={`faq-mobile-chip ${activeSection === sec.id ? 'active' : ''}`}
                    onClick={() => handleScrollToSection(sec.id)}
                  >
                    {sec.title.split('. ')[1] || sec.title}
                  </button>
                ))}
              </nav>

              <div>
                {filteredFaqs.map(section => (
                  <div key={section.id} id={`sec-${section.id}`} className="faq-category">
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
            </div>
          </div>
        </section>
      </main>

      <Chatbot apiUrl={API_BASE} />
    </>
  );
}

export default FAQPage;
