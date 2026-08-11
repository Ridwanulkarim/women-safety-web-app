import React, { useState, useEffect } from 'react';
import { FiSearch, FiBookOpen, FiTag, FiShield } from 'react-icons/fi';
import api from '../../services/api';
import { TIP_CATEGORIES } from '../../utils/constants';

const DEFAULT_SAFETY_TIPS = [
  // Self Defense
  {
    id: 'tip-sd-1',
    title: 'Physical Self-Defense Stance & Vulnerable Targets',
    category: 'Self Defense',
    content: 'Maintain a balanced wide stance with hands up at chest level. Target vulnerable areas like eyes, nose, throat, groin, and shins using palm strikes or elbows.'
  },
  {
    id: 'tip-sd-2',
    title: 'De-escalation & Spatial Boundary Defense',
    category: 'Self Defense',
    content: 'Maintain at least a 6-foot buffer zone from strangers. Use a loud, clear, assertive voice to command "STEP BACK" to draw public attention.'
  },
  {
    id: 'tip-sd-3',
    title: 'Utilizing Improvised Defense Items',
    category: 'Self Defense',
    content: 'Everyday items like keys held securely between fingers, a high-decibel alarm, or a heavy bag can serve as defensive tools in critical situations.'
  },

  // Digital Safety
  {
    id: 'tip-ds-1',
    title: 'App Location Privacy & Geolocation Audit',
    category: 'Digital Safety',
    content: 'Audit app permissions regularly. Disable background location tracking for social media and non-essential applications to prevent stalker tracking.'
  },
  {
    id: 'tip-ds-2',
    title: 'Two-Factor Authentication (2FA) Security',
    category: 'Digital Safety',
    content: 'Enable 2FA via authenticator apps across all email, social media, and banking accounts to block unauthorized login attempts and account hijacking.'
  },
  {
    id: 'tip-ds-3',
    title: 'Real-Time Posting & Check-In Safety',
    category: 'Digital Safety',
    content: 'Avoid posting real-time location check-ins or event stories on public social channels. Share photos or check-ins after leaving the venue.'
  },

  // Travel Safety
  {
    id: 'tip-ts-1',
    title: 'Night Travel & Rideshare Security Checklist',
    category: 'Travel Safety',
    content: 'Always match driver photo, name, and vehicle license plate before entering a rideshare. Sit in the rear passenger seat and share live trip tracking with family.'
  },
  {
    id: 'tip-ts-2',
    title: 'Public Transit & Commute Awareness',
    category: 'Travel Safety',
    content: 'Stay in well-lit designated waiting zones or near transit conductors. Avoid wearing dual noise-canceling headphones while walking alone.'
  },
  {
    id: 'tip-ts-3',
    title: 'Hotel & Temporary Lodging Security',
    category: 'Travel Safety',
    content: 'Use secondary door stoppers or portable deadbolts in hotel rooms. Verify hotel maintenance staff credentials before opening your door.'
  },

  // Workplace Safety
  {
    id: 'tip-ws-1',
    title: 'Late-Night Overtime Safety Protocol',
    category: 'Workplace Safety',
    content: 'Inform building security when working late. Request security guards to escort you to your vehicle or taxi pickup location.'
  },
  {
    id: 'tip-ws-2',
    title: 'Documenting Workplace Harassment',
    category: 'Workplace Safety',
    content: 'Keep an independent paper or digital log of any inappropriate incidents, including exact dates, times, messages, and witnesses for internal complaints.'
  },
  {
    id: 'tip-ws-3',
    title: 'Emergency Building Evacuation Routes',
    category: 'Workplace Safety',
    content: 'Familiarize yourself with office emergency stairwells, fire exits, emergency alarms, and secondary escape routes on your floor.'
  },

  // Home Safety
  {
    id: 'tip-hs-1',
    title: 'Home Entrance & Doorway Vigilance',
    category: 'Home Safety',
    content: 'Have house keys ready in hand before reaching your front door. Scan your surroundings before unlocking and stepping inside.'
  },
  {
    id: 'tip-hs-2',
    title: 'Deadbolts & Secondary Window Locks',
    category: 'Home Safety',
    content: 'Ensure all exterior doors have solid deadbolt locks and door peepholes. Install window locks or security bars on ground-floor windows.'
  },
  {
    id: 'tip-hs-3',
    title: 'Trusted Neighbor Emergency Network',
    category: 'Home Safety',
    content: 'Establish a code word with trusted neighbors. Keep emergency helpline numbers (999, 109, 1098) printed near your main entrance.'
  },

  // Legal Rights
  {
    id: 'tip-lr-1',
    title: 'Legal Protection Under Nari O Shishu Nirjatan Daman Ain',
    category: 'Legal Rights',
    content: 'Under Bangladesh law, sexual harassment, stalking, and domestic abuse are strictly punishable offences. Victims have the right to immediate police action.'
  },
  {
    id: 'tip-lr-2',
    title: 'Filing a General Diary (GD) or FIR at Police Stations',
    category: 'Legal Rights',
    content: 'Police stations are legally obligated to record a General Diary (GD) or First Information Report (FIR). Request an official receipt copy with police seal.'
  },
  {
    id: 'tip-lr-3',
    title: 'Access to Government Free Legal Aid (16430)',
    category: 'Legal Rights',
    content: 'Call the National Legal Aid Services Organization toll-free helpline at 16430 for 24/7 free legal representation and advice across Bangladesh.'
  }
];

const SafetyTips = () => {
  const [tips, setTips] = useState(DEFAULT_SAFETY_TIPS);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await api.get('/safety-tips');
        if (Array.isArray(res.data?.data) && res.data.data.length > 0) {
          // Merge API tips with default tips so no category is ever empty
          const apiTips = res.data.data;
          const merged = [...apiTips];
          DEFAULT_SAFETY_TIPS.forEach(dt => {
            if (!merged.some(m => m.category === dt.category && m.title === dt.title)) {
              merged.push(dt);
            }
          });
          setTips(merged);
        } else {
          setTips(DEFAULT_SAFETY_TIPS);
        }
      } catch (e) {
        setTips(DEFAULT_SAFETY_TIPS);
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, []);

  const filteredTips = tips.filter(t => {
    const matchesCat = category === 'All' || t.category === category;
    const matchesSearch =
      (t.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.content || '').toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 font-sans">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-mono font-bold uppercase tracking-wider">
          <FiShield /> Safety Manual & Legal Guide
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-zinc-900 dark:text-white">
          Personal Safety Manual
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          Tactical strategies, digital defense guidelines, and legal rights for emergency preparedness.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="product-card p-4 sm:p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {TIP_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                category === cat
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-rose-500/10 hover:text-rose-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <FiSearch className="absolute left-3.5 top-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search safety tips or rights..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="human-input pl-10"
          />
        </div>
      </div>

      {/* Tips Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-zinc-400 font-mono">
          Loading safety guidelines...
        </div>
      ) : filteredTips.length === 0 ? (
        <div className="product-card p-12 text-center space-y-3">
          <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">No safety tips found matching "{search}"</p>
          <button onClick={() => { setSearch(''); setCategory('All'); }} className="btn-outline text-xs">
            Reset Category Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map(tip => (
            <div key={tip.id} className="product-card p-6 space-y-3 product-card-hover flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="mono-tag mono-tag-rose">
                    <FiTag /> {tip.category}
                  </span>
                  <FiBookOpen className="text-zinc-400" />
                </div>
                <h3 className="text-base font-bold font-heading text-zinc-900 dark:text-white leading-snug">
                  {tip.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {tip.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SafetyTips;
