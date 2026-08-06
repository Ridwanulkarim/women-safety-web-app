import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiPhoneCall, FiMapPin, FiCheckCircle, FiShield, FiUser, FiActivity, FiVolume2 } from 'react-icons/fi';
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
  const { sosHistory, openSOSModal } = useSOS();
  const [fakeCallOpen, setFakeCallOpen] = useState(false);
  const [medicalIdOpen, setMedicalIdOpen] = useState(false);

  const mockContacts = user?.emergencyContacts && user.emergencyContacts.length > 0 ? user.emergencyContacts : [
    { id: '1', name: 'Primary Guardian', phone: '+8801700000000', relationship: 'Mother', isPrimary: true },
    { id: '2', name: 'Secondary Contact', phone: '+8801800000000', relationship: 'Sister', isPrimary: false }
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome & Safety Telemetry Banner */}
      <div className="product-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="mono-tag mono-tag-emerald">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 telemetry-dot"></span> Active Protection
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-zinc-900 dark:text-white">
            Welcome, {user?.fullName || 'User'} 👋
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Emergency telemetry active. {mockContacts.length} priority emergency contact(s) linked to your SOS beacon.
          </p>
        </div>

        {/* Quick Safety Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <SirenAlarmButton />

          <button
            onClick={() => setFakeCallOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs font-bold flex items-center gap-2 transition active:scale-95 shadow-sm"
          >
            <FiPhoneCall /> FAKE CALL
          </button>

          <button
            onClick={() => setMedicalIdOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-mono text-xs font-bold flex items-center gap-2 transition active:scale-95"
          >
            <FiActivity /> MEDICAL ID
          </button>
        </div>
      </div>

      {/* Main Grid: SOS Button & Quick Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Panic Trigger Card */}
        <div className="product-card p-6 sm:p-8 text-center space-y-6 flex flex-col items-center justify-center">
          <span className="mono-tag mono-tag-rose">
            DISTRESS BEACON
          </span>
          <SOSButton size="large" />
          <p className="text-xs text-zinc-500">
            Tap button to trigger immediate SOS signal dispatch.
          </p>
        </div>

        {/* Priority Emergency Contacts Preview */}
        <div className="lg:col-span-2 product-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <FiPhoneCall className="text-rose-600 text-base" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white font-heading">
                Priority Emergency Contacts
              </h3>
            </div>
            <Link to="/dashboard/contacts" className="text-xs font-mono font-semibold text-rose-600 dark:text-rose-400 hover:underline">
              Manage ({mockContacts.length}/5)
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
      <div className="product-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white font-heading">
            Recent SOS Telemetry Logs
          </h3>
          <Link to="/dashboard/sos-history" className="text-xs font-mono font-semibold text-rose-600 dark:text-rose-400 hover:underline">
            Full History Log
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
