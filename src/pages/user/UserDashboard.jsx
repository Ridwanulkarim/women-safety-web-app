import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiPhoneCall, FiMapPin, FiCheckCircle, FiShield, FiUser, FiActivity, FiVolume2, FiPlusCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useSOS } from '../../context/SOSContext';
import SOSButton from '../../components/sos/SOSButton';
import SOSHistoryList from '../../components/sos/SOSHistoryList';
import ContactCard from '../../components/contacts/ContactCard';
import FakeCallModal from '../../components/safety/FakeCallModal';
import SirenAlarmButton from '../../components/safety/SirenAlarmButton';
import MedicalIDModal from '../../components/safety/MedicalIDModal';

const UserDashboard = () => {
  const { user } = useAuth();
  const { sosHistory, openSOSModal, savedContacts = [] } = useSOS();
  const [fakeCallOpen, setFakeCallOpen] = useState(false);
  const [medicalIdOpen, setMedicalIdOpen] = useState(false);

  return (
    <div className="space-y-6 relative overflow-hidden">
      
      {/* Welcome & Safety Telemetry Banner */}
      <div className="glass-card-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Ambient corner glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mono-tag mono-tag-emerald">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 telemetry-dot"></span> Active Protection Shield
            </span>
            <span className="mono-tag mono-tag-zinc">
              Telemetry: ONLINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
            Welcome, <span className="gradient-text-rose">{user?.fullName || 'User'}</span> 👋
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Emergency telemetry online. <span className="font-bold text-zinc-900 dark:text-white">{savedContacts.length} of 5</span> priority emergency contact(s) linked to your SOS beacon.
          </p>
        </div>

        {/* Quick Safety Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <Link
            to="/admin"
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-bold flex items-center gap-2 transition active:scale-95 shadow-md shadow-purple-600/25"
          >
            <FiShield /> ADMIN COMMAND
          </Link>

          <SirenAlarmButton />

          <button
            onClick={() => setFakeCallOpen(true)}
            className="btn-solid text-xs !py-2.5 !px-4 font-mono font-bold shadow-sm"
          >
            <FiPhoneCall /> FAKE CALL
          </button>

          <button
            onClick={() => setMedicalIdOpen(true)}
            className="btn-outline text-xs !py-2.5 !px-4 font-mono font-bold"
          >
            <FiActivity /> MEDICAL ID
          </button>
        </div>
      </div>

      {/* Main Grid: SOS Button & Quick Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Panic Trigger Card */}
        <div className="glass-card-xl p-6 sm:p-8 text-center space-y-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="space-y-1">
            <span className="mono-tag mono-tag-rose text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> DISTRESS BEACON
            </span>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono">1-Tap Emergency Trigger</h3>
          </div>

          <div className="relative flex items-center justify-center py-2">
            <div className="absolute w-44 h-44 rounded-full bg-rose-600/15 blur-xl pulse-radar-ring pointer-events-none"></div>
            <SOSButton size="large" />
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
            Press and hold for 3 seconds to broadcast live GPS telemetry to linked contacts.
          </p>
        </div>

        {/* Priority Emergency Contacts Preview */}
        <div className="lg:col-span-2 glass-card-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-sm font-bold">
                <FiPhoneCall />
              </div>
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-zinc-900 dark:text-white font-heading">
                  Priority Emergency Contacts
                </h3>
                <p className="text-[11px] text-zinc-500">Speed-dial contacts receiving your SOS SMS alert</p>
              </div>
            </div>
            <Link to="/dashboard/contacts" className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 hover:underline">
              Manage ({savedContacts.length}/5) →
            </Link>
          </div>

          {savedContacts.length === 0 ? (
            <div className="p-8 text-center space-y-3 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-dashed border-zinc-300 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                No priority emergency contacts saved yet. Add at least 1 contact to enable automated dispatch alerts.
              </p>
              <Link
                to="/dashboard/contacts"
                className="btn-danger text-xs !py-2 !px-4 font-mono inline-flex items-center gap-1.5 shadow-md shadow-rose-600/25"
              >
                <FiPlusCircle /> Add Emergency Contacts
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {savedContacts.slice(0, 2).map((c) => (
                <ContactCard key={c.id || c._id} contact={c} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Recent SOS History Log */}
      <div className="glass-card-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 pb-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-zinc-900 dark:text-white font-heading">
              Recent SOS Telemetry Logs
            </h3>
            <p className="text-[11px] text-zinc-500">Immutable audit log of historical emergency activations</p>
          </div>
          <Link to="/dashboard/sos-history" className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 hover:underline">
            Full History Log →
          </Link>
        </div>

        <SOSHistoryList history={sosHistory} />
      </div>

      {/* Safety Modals */}
      <FakeCallModal isOpen={fakeCallOpen} onClose={() => setFakeCallOpen(false)} />
      <MedicalIDModal isOpen={medicalIdOpen} onClose={() => setMedicalIdOpen(false)} />
    </div>
  );
};

export default UserDashboard;
