import React, { useMemo, useState } from 'react';

type Resource = {
  rank: number;
  name: string;
  url: string;
  categories: string[];
  summary: string;
  bestFor: string;
  highlight: string;
};

const resources: Resource[] = [
  {
    rank: 1,
    name: 'GOV.UK — HMRC',
    url: 'https://www.gov.uk/government/organisations/hm-revenue-customs',
    categories: ['Tax', 'Accountancy'],
    summary:
      'The single authoritative source for all UK tax guidance. Covers Self Assessment, Corporation Tax, VAT, Making Tax Digital, PAYE, and every piece of official HMRC guidance ever published.',
    bestFor: 'Daily tax research, client queries, compliance checks, MTD preparation',
    highlight: 'Over 700,000 pages of official guidance — nothing else comes close for tax accuracy.',
  },
  {
    rank: 2,
    name: 'legislation.gov.uk',
    url: 'https://www.legislation.gov.uk',
    categories: ['Legal', 'Corporate'],
    summary:
      'The official, freely searchable database of all UK legislation. Includes the Companies Act 2006, Income Tax Act 2007, Corporation Tax Act 2009, Finance Acts, and every statutory instrument. Shows both original and current amended versions.',
    bestFor: 'Interpreting statutes, checking current law, research on corporate obligations and tax codes',
    highlight: 'The only place to see the current consolidated text of UK law — essential for anything beyond surface-level research.',
  },
  {
    rank: 3,
    name: 'BAILII',
    url: 'https://www.bailii.org',
    categories: ['Legal'],
    summary:
      'The British and Irish Legal Information Institute. Over 240,000 free cases covering all UK courts and tribunals from 1996 onwards. Includes Supreme Court, Court of Appeal, High Court, and tribunal decisions. No login or paywall.',
    bestFor: 'Case law research, finding precedent on tax disputes, corporate law judgments, tribunal decisions',
    highlight: "The largest free case law database in the UK. If a judgment exists, it's almost certainly here.",
  },
  {
    rank: 4,
    name: 'Companies House',
    url: 'https://find-and-update.company-information.service.gov.uk',
    categories: ['Corporate', 'Accountancy'],
    summary:
      'Free company search across the entire UK register of 7+ million companies. Free REST API for programmatic access to live company data. Free bulk data downloads (CSV snapshots of the entire register). Includes filed accounts, officer details, and PSC information.',
    bestFor: 'Due diligence, client onboarding, competitor research, building tools that pull company data',
    highlight: 'The API is completely free and returns real-time data. Worth £1–3 billion/year to UK businesses according to government research.',
  },
  {
    rank: 5,
    name: 'Changes to UK Company Law',
    url: 'https://changestoukcompanylaw.campaign.gov.uk',
    categories: ['Corporate', 'Legal'],
    summary:
      "Companies House's dedicated tracker for all changes under the Economic Crime and Corporate Transparency Act 2023. Covers identity verification requirements, new filing rules, statutory register changes, and the full ECCTA transition timeline.",
    bestFor: 'Staying ahead of corporate law changes, advising clients on new compliance obligations, understanding ID verification deadlines',
    highlight: "Identity verification for directors and PSCs became mandatory from November 2025. This is the only place to track what's coming next.",
  },
  {
    rank: 6,
    name: 'ICAEW — Public Resources',
    url: 'https://www.icaew.com/technical',
    categories: ['Accountancy', 'Corporate'],
    summary:
      "The Institute of Chartered Accountants of England and Wales publishes a significant amount of free guidance covering company law, FRS 102, corporate reporting, directors' duties, dividend rules, and small company exemptions. Some content is member-only, but the public-facing material is substantial.",
    bestFor: "FRS 102 implementation, understanding directors' responsibilities, small company reporting, corporate governance",
    highlight: "Their guide to directors' responsibilities and the dividend payment guide are essential free reading for any accountant advising limited companies.",
  },
  {
    rank: 7,
    name: 'National Archives — Find Case Law',
    url: 'https://caselaw.nationalarchives.gov.uk',
    categories: ['Legal'],
    summary:
      "The UK Government's official searchable database of court judgments, managed by The National Archives on behalf of the Ministry of Justice. Covers Supreme Court, Court of Appeal, High Court, and Upper Tribunal decisions from 2001 onwards. Fully searchable by keyword.",
    bestFor: 'Finding authoritative judgments, researching tax tribunal decisions, verifying case citations',
    highlight:
      "This is the government's own judgment database — everything here carries official status, which matters if you're ever citing cases formally.",
  },
  {
    rank: 8,
    name: 'QuickFile',
    url: 'https://www.quickfile.co.uk',
    categories: ['Accountancy', 'Software'],
    summary:
      'Permanently free MTD-compliant accounting software built for the UK market. Handles invoicing, expenses, bank feeds, VAT returns, and Self Assessment. The free tier stays active as long as you have fewer than 1,000 ledger entries in a rolling 12 months — no time limits, no stripped-down features.',
    bestFor: 'Small firms needing MTD compliance on a budget, freelancers and sole traders, testing accounting workflows',
    highlight: 'One of the few genuinely free, fully-featured UK accounting tools with no expiry date on the free plan.',
  },
  {
    rank: 9,
    name: 'GOV.UK Chat',
    url: 'https://www.gov.uk',
    categories: ['AI', 'Tax'],
    summary:
      "The UK Government's AI-powered chatbot, built on approximately 700,000 pages of GOV.UK content. Designed to give quick, personalised answers to questions about tax, business setup, benefits, and government services. Currently in staged testing and scaling.",
    bestFor: 'Quick answers on tax rules, business registration questions, understanding government guidance in plain English',
    highlight: "Built and maintained by the government itself — and it's improving rapidly. Worth checking as a first-pass answer tool before diving into the full guidance.",
  },
  {
    rank: 10,
    name: 'Earnr AI',
    url: 'https://www.earnr.co.uk',
    categories: ['AI', 'Tax'],
    summary:
      'A free AI chatbot specifically trained on UK tax law and HMRC guidance. Handles tax calculations, explains allowances and brackets, and walks you through Self Assessment in plain language. Available 24/7 with no subscription.',
    bestFor: 'Quick client-facing tax questions, understanding allowances and thresholds, tax calculation checks',
    highlight: "Purpose-built for UK tax — not a general chatbot with tax knowledge bolted on. Genuinely useful for the kind of questions clients ask at all hours.",
  },
];

const allCategories = ['All', 'Tax', 'Legal', 'Corporate', 'Accountancy', 'AI', 'Software'];

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Tax: { bg: 'rgba(197, 160, 89, 0.12)', text: '#0f172a', border: 'rgba(197, 160, 89, 0.35)' },
  Legal: { bg: 'rgba(15, 23, 42, 0.08)', text: '#0f172a', border: 'rgba(15, 23, 42, 0.18)' },
  Corporate: { bg: 'rgba(15, 23, 42, 0.08)', text: '#0f172a', border: 'rgba(15, 23, 42, 0.18)' },
  Accountancy: { bg: 'rgba(197, 160, 89, 0.12)', text: '#0f172a', border: 'rgba(197, 160, 89, 0.35)' },
  AI: { bg: 'rgba(197, 160, 89, 0.12)', text: '#0f172a', border: 'rgba(197, 160, 89, 0.35)' },
  Software: { bg: 'rgba(15, 23, 42, 0.08)', text: '#0f172a', border: 'rgba(15, 23, 42, 0.18)' },
};

const ResourcesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return resources;
    return resources.filter((r) => r.categories.includes(activeFilter));
  }, [activeFilter]);

  return (
    <div style={{ minHeight: '100vh', background: '#fdfcfb', color: '#0f172a', fontFamily: 'Arial, sans-serif', padding: 0 }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #111c33 50%, #0f172a 100%)',
          borderBottom: '1px solid rgba(197, 160, 89, 0.25)',
          padding: '48px 24px 36px',
          position: 'relative',
          overflow: 'hidden',
          marginTop: 72, // account for fixed header
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.06,
            backgroundImage:
              'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #c5a059, #a88650)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 22px rgba(197,160,89,0.25)',
              }}
            >
              <span style={{ fontSize: 20 }}>⚖</span>
            </div>
            <div>
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  color: '#c5a059',
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: 900,
                }}
              >
                Free Resource Guide
              </span>
            </div>
          </div>
          <h1
            style={{
              fontSize: 'clamp(24px, 4vw, 34px)',
              fontWeight: 900,
              lineHeight: 1.2,
              color: '#ffffff',
              margin: '0 0 10px',
              letterSpacing: -0.5,
            }}
          >
            Top 10 Free UK Accountancy
            <br />& Legal Resources
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, margin: 0, fontFamily: 'Arial, sans-serif', lineHeight: 1.5, fontWeight: 700 }}>
            Curated and verified — genuinely free, current, and useful for practising accountants and anyone advising on UK corporate or tax matters.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px 24px',
          position: 'sticky',
          top: 72,
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {allCategories.map((cat) => {
            const isActive = activeFilter === cat;
            const colors =
              cat === 'All'
                ? { bg: 'rgba(197,160,89,0.12)', text: '#0f172a', border: 'rgba(197,160,89,0.45)' }
                : categoryColors[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  background: isActive ? colors.bg : 'transparent',
                  border: `1px solid ${isActive ? colors.border : '#e2e8f0'}`,
                  color: isActive ? colors.text : '#64748b',
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: 'sans-serif',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.2s ease',
                  letterSpacing: 0.3,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resource Cards */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '28px 24px 60px' }}>
        {filtered.map((r) => {
          const isExpanded = expandedCard === r.rank;
          return (
            <div
              key={r.rank}
              style={{
                marginBottom: 12,
                borderRadius: 12,
                overflow: 'hidden',
                border: `1px solid ${isExpanded ? 'rgba(197,160,89,0.45)' : '#e2e8f0'}`,
                background: isExpanded ? 'rgba(197,160,89,0.06)' : '#ffffff',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
              }}
              onClick={() => setExpandedCard(isExpanded ? null : r.rank)}
            >
              {/* Card Header */}
              <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                {/* Rank Badge */}
                <div
                  style={{
                    minWidth: 36,
                    height: 36,
                    borderRadius: 8,
                    background: isExpanded ? 'linear-gradient(135deg, #c5a059, #a88650)' : '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 900,
                    color: isExpanded ? '#ffffff' : '#0f172a',
                    fontFamily: 'sans-serif',
                    transition: 'all 0.25s ease',
                    boxShadow: isExpanded ? '0 6px 18px rgba(197,160,89,0.18)' : 'none',
                  }}
                >
                  {r.rank}
                </div>

                {/* Name & Tags */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: -0.2 }}>{r.name}</h3>
                    <span style={{ fontSize: 16, color: '#c5a059', opacity: 0.9 }}>↗</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    {r.categories.map((cat) => {
                      const c = categoryColors[cat];
                      return (
                        <span
                          key={cat}
                          style={{
                            fontSize: 10,
                            fontFamily: 'sans-serif',
                            fontWeight: 600,
                            letterSpacing: 0.8,
                            textTransform: 'uppercase',
                            padding: '3px 8px',
                            borderRadius: 12,
                            background: c.bg,
                            color: c.text,
                            border: `1px solid ${c.border}`,
                          }}
                        >
                          {cat}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Chevron */}
                <div
                  style={{
                    color: '#94a3b8',
                    fontSize: 14,
                    transition: 'transform 0.25s ease',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    paddingTop: 2,
                  }}
                >
                  ▼
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid #f1f5f9', padding: '20px 20px 22px', animation: 'fadeSlideDown 0.2s ease' }}>
                  <p style={{ fontSize: 13.5, lineHeight: 1.7, color: '#475569', margin: '0 0 18px', fontFamily: 'Arial, sans-serif', fontWeight: 700 }}>{r.summary}</p>

                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {/* Best For */}
                    <div
                      style={{
                        flex: 1,
                        minWidth: 200,
                        background: '#f8fafc',
                        borderRadius: 12,
                        padding: '14px 16px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <div style={{ fontSize: 9, fontFamily: 'Arial, sans-serif', fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase', color: '#c5a059', marginBottom: 6 }}>
                        Best For
                      </div>
                      <p style={{ fontSize: 12.5, color: '#475569', margin: 0, fontFamily: 'Arial, sans-serif', lineHeight: 1.6, fontWeight: 700 }}>{r.bestFor}</p>
                    </div>

                    {/* Highlight */}
                    <div
                      style={{
                        flex: 1,
                        minWidth: 200,
                        background: 'rgba(197,160,89,0.08)',
                        borderRadius: 12,
                        padding: '14px 16px',
                        border: '1px solid rgba(197,160,89,0.22)',
                      }}
                    >
                      <div style={{ fontSize: 9, fontFamily: 'Arial, sans-serif', fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase', color: '#0f172a', marginBottom: 6 }}>
                        Why It Matters
                      </div>
                      <p style={{ fontSize: 12.5, color: '#0f172a', margin: 0, fontFamily: 'Arial, sans-serif', lineHeight: 1.6, fontWeight: 800 }}>{r.highlight}</p>
                    </div>
                  </div>

                  {/* Visit Link */}
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 18,
                      fontSize: 12.5,
                      fontFamily: 'sans-serif',
                      color: '#6366f1',
                      textDecoration: 'none',
                      fontWeight: 600,
                      padding: '8px 16px',
                      borderRadius: 6,
                      background: 'rgba(99,102,241,0.1)',
                      border: '1px solid rgba(99,102,241,0.25)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(99,102,241,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit Resource <span style={{ fontSize: 14 }}>→</span>
                  </a>
                </div>
              )}
            </div>
          );
        })}

        {/* Footer Note */}
        <div style={{ marginTop: 36, padding: '20px 24px', borderRadius: 10, background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.2)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18, marginTop: 1 }}>⚠</span>
            <div>
              <p style={{ fontSize: 12.5, fontFamily: 'sans-serif', color: '#ca8a04', margin: 0, lineHeight: 1.6, fontWeight: 600 }}>Always verify with primary sources</p>
              <p style={{ fontSize: 12, fontFamily: 'sans-serif', color: '#a16207', margin: '4px 0 0', lineHeight: 1.5 }}>
                AI tools (GOV.UK Chat, Earnr AI) can hallucinate on edge cases. Use them for orientation, then cross-reference with legislation.gov.uk or HMRC guidance before advising clients.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>
    </div>
  );
};

export default ResourcesPage;
