
import React, { useState, useEffect } from 'react';

interface AdminDashboardProps {
  onClose: () => void;
}

interface FeedbackLog {
  id: string;
  query: string;
  category: string;
  helpful: boolean;
  timestamp: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [visitorCount, setVisitorCount] = useState(124);
  const [feedbackLogs, setFeedbackLogs] = useState<FeedbackLog[]>([]);
  const [securityEvents, setSecurityEvents] = useState([
    { id: 1, type: 'Bot Detected', time: '2 mins ago', severity: 'low' },
    { id: 2, type: 'IP Blocked', time: '1 hour ago', severity: 'high' },
    { id: 3, type: 'Form Submission', time: '3 hours ago', severity: 'info' }
  ]);

  useEffect(() => {
    // Load feedback from localStorage
    const savedFeedback = JSON.parse(localStorage.getItem('pls_legal_feedback') || '[]');
    setFeedbackLogs(savedFeedback.reverse());

    const interval = setInterval(() => {
      setVisitorCount(v => v + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const clearLogs = () => {
    localStorage.removeItem('pls_legal_feedback');
    setFeedbackLogs([]);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
      <div className="bg-slate-900 w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl border border-slate-800 animate-in zoom-in-95">
        <div className="flex h-[80vh]">
          {/* Sidebar */}
          <div className="w-64 bg-slate-950 p-8 border-r border-slate-800 flex flex-col">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">P</div>
              <span className="text-white font-bold tracking-tight">Admin Console</span>
            </div>
            
            <nav className="space-y-4 flex-grow">
              <button className="w-full text-left px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-lg border border-indigo-500/30 text-sm font-bold flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Dashboard
              </button>
              <button className="w-full text-left px-4 py-2 text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                Security Log
              </button>
              <button className="w-full text-left px-4 py-2 text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                Settings
              </button>
            </nav>

            <div className="mt-auto">
               <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 text-sm">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                 </svg>
                 Exit Secure Session
               </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow p-10 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">System Analytics</h2>
                <p className="text-slate-500 text-sm">Real-time infrastructure monitoring</p>
              </div>
              <div className="flex gap-4">
                 <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                   System Status: Optimal
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <div className="text-slate-400 text-xs font-bold uppercase mb-4">Live Visitors</div>
                <div className="text-4xl font-bold text-white">{visitorCount}</div>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <div className="text-slate-400 text-xs font-bold uppercase mb-4">AI Feedback (Helpful)</div>
                <div className="text-4xl font-bold text-green-400">
                  {feedbackLogs.filter(l => l.helpful).length}
                </div>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <div className="text-slate-400 text-xs font-bold uppercase mb-4">AI Feedback (Total)</div>
                <div className="text-4xl font-bold text-indigo-400">{feedbackLogs.length}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Security Events */}
              <div>
                <h3 className="text-lg font-bold text-white mb-6">Security Events</h3>
                <div className="space-y-4">
                  {securityEvents.map(event => (
                    <div key={event.id} className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            event.severity === 'high' ? 'bg-red-500/10 text-red-500' :
                            event.severity === 'info' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-amber-500/10 text-amber-500'
                          }`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-slate-200 font-bold text-sm">{event.type}</div>
                            <div className="text-slate-500 text-xs">{event.time}</div>
                          </div>
                      </div>
                      <button className="text-slate-600 hover:text-slate-400 text-xs uppercase font-bold tracking-widest transition-colors">Details</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Feedback Review */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">AI Advice Feedback</h3>
                  {feedbackLogs.length > 0 && (
                    <button onClick={clearLogs} className="text-[10px] text-slate-500 hover:text-red-400 uppercase font-bold tracking-widest transition-colors">Clear All</button>
                  )}
                </div>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                  {feedbackLogs.length === 0 ? (
                    <div className="text-slate-600 text-sm italic">No feedback entries yet.</div>
                  ) : (
                    feedbackLogs.map(log => (
                      <div key={log.id} className="bg-slate-800/20 p-4 rounded-xl border border-slate-800/50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase font-bold">{log.category}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${log.helpful ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {log.helpful ? 'Helpful' : 'Not Helpful'}
                          </span>
                        </div>
                        <p className="text-slate-300 text-xs line-clamp-2 italic mb-2">"{log.query}"</p>
                        <div className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
