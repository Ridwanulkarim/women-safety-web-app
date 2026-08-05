import React, { useState, useEffect } from 'react';
import { FiSearch, FiBookOpen, FiTag } from 'react-icons/fi';
import api from '../../services/api';
import { TIP_CATEGORIES } from '../../utils/constants';

const SafetyTips = () => {
  const [tips, setTips] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await api.get('/safety-tips');
        if (res.data?.data) {
          setTips(res.data.data);
        }
      } catch (e) {
        setTips([
          { id: '1', title: 'Night Travel Precautions', category: 'Travel Safety', content: 'Always share live trip status, stay in illuminated zones, and keep noise levels low.' },
          { id: '2', title: 'Digital Privacy Settings', category: 'Digital Safety', content: 'Turn off background location tracking for non-essential applications.' },
          { id: '3', title: 'Physical Self Defense Stance', category: 'Self Defense', content: 'Maintain balanced footing, protect vital points, and emit loud vocal calls.' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, []);

  const filteredTips = tips.filter(t => {
    const matchesCat = category === 'All' || t.category === category;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.content.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold font-heading">Personal Safety Manual</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Tactical strategies and guidelines for daily awareness and emergency preparedness.</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-6 rounded-3xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {TIP_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                category === cat
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-pink-500/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <FiSearch className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search safety tips..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs focus:outline-none focus:border-pink-500"
          />
        </div>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTips.map(tip => (
          <div key={tip.id} className="glass-card p-6 rounded-3xl space-y-3 hover:border-pink-500/30 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center gap-1">
                <FiTag /> {tip.category}
              </span>
              <FiBookOpen className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-slate-100">{tip.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{tip.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SafetyTips;
