import React from 'react';
import Chatbot from '../components/Chatbot';

const API_BASE = 'http://localhost:8000/api';

const badgeData = [
  {
    badge: '🥉',
    phase: 'Bronze',
    num: '1',
    what: 'Training — a course or a direct assignment, decided per candidate by the mentor based on what you already know',
    required: 'Usually — entry',
    color: '#cd7f32',
  },
  {
    badge: '🥈',
    phase: 'Silver',
    num: '2',
    what: 'An open-source project with a Vicharanashala mentor',
    required: 'Yes — the actual work',
    color: '#94a3b8',
  },
  {
    badge: '🥇',
    phase: 'Gold',
    num: '3',
    what: "A genuinely significant Silver contribution — a feature in itself",
    required: 'No — a quality mark on Silver',
    color: '#fbbf24',
  },
  {
    badge: '🏆',
    phase: 'Platinum',
    num: '4',
    what: 'Open invitation to return to the lab in the next twelve months; nominal stipend on visit; the fourth star is earned during that visit',
    required: 'No — post-internship pathway',
    color: '#818cf8',
  },
];

const steps = [
  { num: '01', text: 'Go to samagama.in and sign in.' },
  { num: '02', text: 'Read your result panel carefully. It tells you the track and the next step.' },
  { num: '03', text: 'Tell Yaksha you want to opt in to VINS, in the exact phrase shown on the panel.' },
  { num: '04', text: 'Download the NOC, get it signed and stamped, and upload it back via the Upload NOC button on the panel.' },
  { num: '05', text: 'Wait for your offer letter; show up on your start date with your full attention.' },
];

function SectionCard({ icon, title, children }) {
  return (
    <div className="ov-card">
      <div className="ov-card-header">
        <span className="ov-card-icon">{icon}</span>
        <h2 className="ov-card-title">{title}</h2>
      </div>
      <div className="ov-card-body">{children}</div>
    </div>
  );
}

function Overview() {
  return (
    <>
      {/* Hero */}
      <section className="ov-hero">
        <div className="ov-hero-glow ov-hero-glow-1" />
        <div className="ov-hero-glow ov-hero-glow-2" />
        <div className="ov-hero-content">
          <div className="ov-hero-tag">2026 Cycle · IIT Ropar</div>
          <h1 className="ov-hero-title">
            Vicharanashala<br />
            <span className="ov-gradient-text">Internship</span>
          </h1>
          <p className="ov-hero-desc">
            A two-month, full-attention engagement at the lab of Prof. Sudarshan Iyengar at IIT Ropar.
            We work on real, open-source software for India-centric problems — agriculture (Annam.AI),
            education (ViBe), and a steady stream of other research-driven projects.
          </p>
          <div className="ov-hero-cta">
            <a href="https://samagama.in" target="_blank" rel="noreferrer" className="ov-btn-primary">
              Go to samagama.in →
            </a>
            <a href="/faq" className="ov-btn-ghost">Read the FAQ</a>
          </div>
          <div className="ov-hero-stats">
            <div className="ov-stat">
              <span className="ov-stat-value">2 months</span>
              <span className="ov-stat-label">Duration</span>
            </div>
            <div className="ov-stat-divider" />
            <div className="ov-stat">
              <span className="ov-stat-value">Free</span>
              <span className="ov-stat-label">No cost, ever</span>
            </div>
            <div className="ov-stat-divider" />
            <div className="ov-stat">
              <span className="ov-stat-value">Online</span>
              <span className="ov-stat-label">Work from anywhere</span>
            </div>
            <div className="ov-stat-divider" />
            <div className="ov-stat">
              <span className="ov-stat-value">Dec 31</span>
              <span className="ov-stat-label">2026 deadline</span>
            </div>
          </div>
        </div>
      </section>

      <main className="ov-main">

        {/* The Programme */}
        <SectionCard icon="🎯" title="The Programme">
          <p>
            Every selected candidate sees a <strong>yellow VINS result panel</strong> when they log in to samagama.in.
            That panel contains the next steps.
          </p>
          <div className="ov-highlight-box">
            <div className="ov-highlight-box-label">VINS — Online</div>
            <p className="ov-highlight-box-title">Vicharanashala Internship</p>
            <p>Open to every candidate who performed well in the AI interview. Conducted entirely online; you work from your own location.</p>
            <ul className="ov-check-list">
              <li>Start anytime in 2026</li>
              <li>Two-month duration with a one-month grace period</li>
              <li>Everything must finish by 31 December 2026</li>
              <li>No stipend. The programme is free — we charge nothing</li>
            </ul>
          </div>
        </SectionCard>

        {/* Four-Badge Journey */}
        <SectionCard icon="🏅" title="The Four-Badge Journey">
          <p className="ov-section-sub">
            This is the progression every intern follows. The first two badges are the internship proper; the last two are upside.
          </p>
          <div className="ov-badge-grid">
            {badgeData.map((b) => (
              <div key={b.phase} className="ov-badge-card" style={{ '--badge-color': b.color }}>
                <div className="ov-badge-emoji">{b.badge}</div>
                <div className="ov-badge-phase">Phase {b.num}</div>
                <div className="ov-badge-name">{b.phase}</div>
                <p className="ov-badge-desc">{b.what}</p>
                <div className="ov-badge-req">{b.required}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* What We Expect */}
        <SectionCard icon="⚡" title="What We Expect">
          <p>
            This is a serious internship, not a summer job. Plan for <strong>6 to 10 hours of focused work a day</strong>,
            sometimes more during the build phase. The most common reason interns drop out mid-way is competing commitments
            — exams, other internships, job hunts, travel. If your time is fragmented, please don't take this up.
          </p>

          <div className="ov-metrics">
            <div className="ov-metric">
              <div className="ov-metric-value">85%</div>
              <div className="ov-metric-label">Live Zoom session attendance (rolling 5 days)</div>
            </div>
            <div className="ov-metric">
              <div className="ov-metric-value">85%</div>
              <div className="ov-metric-label">In-session polls &amp; quizzes responded</div>
            </div>
            <div className="ov-metric">
              <div className="ov-metric-value">50%</div>
              <div className="ov-metric-label">Minimum quiz pass mark</div>
            </div>
          </div>

          <div className="ov-warning-box">
            <span className="ov-warning-icon">⚠️</span>
            <p>
              If any one threshold falls below the bar, you are excused from the current batch and moved to the next one —
              so you can rejoin when you're able to give it full attention.
            </p>
          </div>

          <p style={{ marginTop: '1rem' }}>
            If you complete both Bronze and Silver, you earn a <strong>certificate from Vicharanashala at IIT Ropar</strong>.
            If you drop out, you don't. The bar is high deliberately — the certificate means something because it's earned, not distributed.
          </p>
        </SectionCard>

        {/* Project, Technology, Domain */}
        <SectionCard icon="💻" title="Project, Technology, Domain">
          <p>
            We do not pre-declare the problem you'll work on. The approach is <strong>problem-centred</strong>: based on
            your inclination and background, your mentor assigns a real lab problem, and you work backwards — learn the
            technology you need, then solve the problem.
          </p>
          <div className="ov-domain-grid">
            {['AI / ML', 'NLP & LLMs', 'Web Development', 'Systems', 'Agriculture-tech (Annam.AI)', 'Education-tech (ViBe)', 'Open-source Infrastructure', 'Computer Vision'].map(d => (
              <div key={d} className="ov-domain-chip">{d}</div>
            ))}
          </div>
          <div className="ov-info-box">
            <strong>Note:</strong> Insisting on a specific stack or domain after joining is not viewed favourably — students
            are expected to do the research required to work at a particular lab before applying.
          </div>
        </SectionCard>

        {/* Why samagama.in */}
        <SectionCard icon="🤖" title="Why the Interview is on samagama.in">
          <p>
            Every candidate goes through a structured AI-led interview at samagama.in with our interviewer agent, <strong>Yaksha</strong>.
            This is not a gimmick. The interview gives every applicant — irrespective of college brand, network, or geography —
            the same calibrated conversation about their work. <strong>Prof. Iyengar reads every transcript personally</strong> and
            forms his own view.
          </p>
          <div className="ov-interview-steps">
            <div className="ov-istep">
              <div className="ov-istep-dot" />
              <p>Go to samagama.in, sign up, and engage in the chat seriously</p>
            </div>
            <div className="ov-istep">
              <div className="ov-istep-dot" />
              <p>The interview is the <strong>only formal assessment</strong> in this cycle — no separate test, coding round, or shortlist call</p>
            </div>
            <div className="ov-istep">
              <div className="ov-istep-dot" />
              <p>The yellow VINS result panel confirms selection and contains the canonical next steps</p>
            </div>
          </div>
        </SectionCard>

        {/* Logistics */}
        <SectionCard icon="📋" title="Logistics in Brief">
          <div className="ov-logistics">
            <div className="ov-log-item">
              <div className="ov-log-icon">📊</div>
              <div>
                <div className="ov-log-title">Result Panel</div>
                <p>Visible on samagama.in for one week after the result is declared. View it; opt in to VINS; complete the NOC step within this window.</p>
              </div>
            </div>
            <div className="ov-log-item">
              <div className="ov-log-icon">📄</div>
              <div>
                <div className="ov-log-title">NOC</div>
                <p>A No-Objection Certificate from your institution, signed and stamped by an authorised signatory (HOD, Principal, Dean, or equivalent).
                We provide a printable format — download it from the dashboard. Digital signatures are not accepted.</p>
              </div>
            </div>
            <div className="ov-log-item">
              <div className="ov-log-icon">📨</div>
              <div>
                <div className="ov-log-title">Offer Letter</div>
                <p>Issued automatically on NOC validation. You may formally begin the internship only after your official NOC is uploaded and validated.</p>
              </div>
            </div>
            <div className="ov-log-item">
              <div className="ov-log-icon">🛠️</div>
              <div>
                <div className="ov-log-title">During the Internship</div>
                <p>Discord for community · Zoom for meetings · GitHub for code · Yaksha chat for one-on-one queries.</p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Cost */}
        <SectionCard icon="💰" title="Cost">
          <div className="ov-cost-banner">
            <span className="ov-cost-label">Total cost to you</span>
            <span className="ov-cost-value">₹ 0</span>
          </div>
          <p>
            The internship is free. We charge nothing — for the course, for mentorship, for any part of the programme.
            Vicharanashala is funded by initiatives, schemes, and funding agencies that cover the cost involved.
            Because someone else is paying for your participation, we keep the rigour high.
          </p>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            It is the duty of the lab to upskill and give every student in the country an opportunity that the student deserves.
            Stellar performers may receive a selected stipend; we hope you reach that stage.
          </p>
        </SectionCard>

        {/* What to do next */}
        <SectionCard icon="🚀" title="What to Do Next">
          <div className="ov-steps">
            {steps.map((s) => (
              <div key={s.num} className="ov-step">
                <div className="ov-step-num">{s.num}</div>
                <p className="ov-step-text">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="ov-info-box" style={{ marginTop: '1.5rem' }}>
            If you have a question this page doesn't answer, the <a href="/faq">FAQ</a> covers most of it.
            If neither covers your case, log in at samagama.in and ask Yaksha — that is the only support channel we operate.
          </div>
        </SectionCard>

      </main>

      {/* Footer */}
      <footer className="ov-footer">
        <p>Vicharanashala Lab · Indian Institute of Technology Ropar · 2026 cycle</p>
      </footer>

      <Chatbot apiUrl={API_BASE} />
    </>
  );
}

export default Overview;
