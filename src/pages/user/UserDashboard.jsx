import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiPhoneCall, FiMapPin, FiCheckCircle, FiShield, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useSOS } from '../../context/SOSContext';
import SOSButton from '../../components/sos/SOSButton';
import SOSHistoryList from '../../components/sos/SOSHistoryList';
import ContactCard from '../../components/contacts/ContactCard';

const UserDashboard = () => {
  const { user } = useAuth();
  const { sosHistory, openSOSModal } = useSOS();

  const mockContacts = user?.emergencyContacts && user.emergencyContacts.length > 0 ? user.emergencyContacts : [
    { id: '1', name: 'Primary Guardian', phone: '+8801700000000', relationship: 'Mother', isPrimary: true },
    { id: '2', name: 'Secondary Contact', phone: '+8801800000000', relationship: 'Sister', isPrimary: false }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-900/30 via-slate-900 to-purple-900/30 border border-pink-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-pink-400 font-bold text-xs uppercase tracking-wider">
            <FiShield /> Active Safety Shield
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-100">
            Welcome, {user?.fullName || 'User'} 👋
          </h1>
          <p className="text-xs text-slate-300">
            Your emergency protection network is active. {mockContacts.length} emergency contact(s) linked.
          </p>
        </div>

        <button
          onClick={openSOSModal}
          className="px-6 py-3.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-pink-600/40 animate-pulse"
        >
          <FiAlertCircle className="w-5 h-5" /> SOS Distress Alert
        </button>
      </div>

      {/* Main Grid: SOS Button & Quick Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Panic Trigger Card */}
        <div className="glass-card p-8 rounded-3xl text-center space-y-6 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-pink-400 uppercase tracking-widest bg-pink-500/10 px-3 py-1 rounded-full">
            Immediate Distress Launch
          </span>
          <SOSButton size="large" />
          <p className="text-xs text-slate-400">
            Tap button to open distress transmission sequence.
          </p>
        </div>

        {/* Priority Emergency Contacts Preview */}
        <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiPhoneCall className="text-pink-500 text-xl" />
              <h3 className="text-lg font-bold font-heading">Priority Emergency Contacts</h3>
            </div>
            <Link to="/dashboard/contacts" className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline">
              Manage Contacts ({mockContacts.length}/5)
            </Link>
          </div>

          <div className="space-y-3">
            {mockContacts.slice(0, 2).map((c) => (
              <ContactCard key={c.id} contact={c} />
            ))}
          </div>
        </div>

      </div>

      {/* Recent SOS History Log */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-heading">Recent SOS Activity Log</h3>
          <Link to="/dashboard/sos-history" className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline">
            Full History
          </Link>
        </div>

        <SOSHistoryList history={sosHistory} />
      </div>
    </div>
  );
};

export default UserDashboard;
