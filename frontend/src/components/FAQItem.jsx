import React, { useRef } from 'react';

function FAQItem({ faq, isExpanded, onToggle, votes, userVote, onVote }) {
  const answerRef = useRef(null);
  const upVotes   = votes?.up   || 0;
  const downVotes = votes?.down || 0;

  return (
    <div className={`faq-item ${isExpanded ? 'active' : ''}`}>
      <div className="faq-question" onClick={onToggle}>
        <h4>{faq.question}</h4>
        <svg
          className="chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      <div
        className="faq-answer-wrapper"
        style={{ maxHeight: isExpanded ? `${(answerRef.current?.scrollHeight ?? 0) + 120}px` : '0px' }}
      >
        <div className="faq-answer" ref={answerRef}>
          <div dangerouslySetInnerHTML={{ __html: faq.answer }} />

          <div className="vote-container">
            <span className="vote-text">Was this helpful?</span>

            {/* ── Upvote ── */}
            <button
              className={`vote-btn upvote ${userVote === 'up' ? 'active' : ''}`}
              onClick={() => onVote(faq.id, 'up')}
              aria-label={userVote === 'up' ? 'Remove upvote' : 'Upvote'}
              title={userVote === 'up' ? 'Click to remove your vote' : 'Mark as helpful'}
            >
              <svg viewBox="0 0 24 24" fill={userVote === 'up' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              <span>Yes ({upVotes})</span>
            </button>

            {/* ── Downvote ── */}
            <button
              className={`vote-btn downvote ${userVote === 'down' ? 'active' : ''}`}
              onClick={() => onVote(faq.id, 'down')}
              aria-label={userVote === 'down' ? 'Remove downvote' : 'Downvote'}
              title={userVote === 'down' ? 'Click to remove your vote' : 'Mark as not helpful'}
            >
              <svg viewBox="0 0 24 24" fill={userVote === 'down' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2"></path>
              </svg>
              <span>No ({downVotes})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQItem;
