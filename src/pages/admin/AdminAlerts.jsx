import React, { useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiMapPin, FiClock } from 'react-icons/fi';
import LiveMap from '../../components/map/LiveMap';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AdminAlerts = () => {
  const [alerts, setAlerts] = useState([
    { id: 'sos_101', userName: 'Sarah Connor', userPhone: '+8801711111111', latitude: 23.8103, longitude: 90.4125, address: 'Dhanmondi, Dhaka', status: 'ACTIVE', timestamp: new Date().toISOString() },
    { id: 'sos_102', userName: 'Emily Rose', userPhone: '+8801822222222', latitude: 23.7940, longitude: 90.4043, address: 'Gulshan 2, Dhaka', status: 'ACKNOWLEDGED', timestamp: new Date(Date.now() - 3600000).toISOString() }
  ]);

  const handleUpdateStatus = (id, nextStatus) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: nextStatus } : a));
    toast.success(`SOS status updated to ${nextStatus}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-purple-400">Emergency SOS Distress Monitor</h1>
        <p className="text-xs text-slate-400">Live dispatch response unit monitoring active SOS distress calls.</p>
      </div>

      <div className="space-y-6">
        {alerts.map((alert) => (
          <div key={alert.id} className="glass-card p-6 rounded-3xl space-y-6 border border-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl text-2xl ${
                  alert.status === 'ACTIVE' ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  <FiAlertTriangle />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{alert.userName}</h3>
                  <p className="text-xs text-slate-400">Phone: {alert.userPhone} | {formatDate(alert.timestamp)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                  alert.status === 'ACTIVE' ? 'bg-red-500/20 text-red-400' : alert.status === 'ACKNOWLEDGED' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {alert.status}
                </span>

                {alert.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleUpdateStatus(alert.id, 'ACKNOWLEDGED')}
                    className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-xs uppercase"
                  >
                    Acknowledge Dispatch
                  </button>
                )}

                {alert.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleUpdateStatus(alert.id, 'RESOLVED')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase"
                  >
                    Resolve Alert
                  </button>
                )}
              </div>
            </div>

            <LiveMap latitude={alert.latitude} longitude={alert.longitude} title={`Distress Alert: ${alert.userName}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAlerts;
