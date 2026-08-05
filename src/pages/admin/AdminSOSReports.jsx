import React from 'react';
import { FiFileText, FiDownload, FiMapPin } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AdminSOSReports = () => {
  const reports = [
    { id: 'rep_1', user: 'Sarah Connor', address: 'Dhanmondi, Dhaka', status: 'RESOLVED', timestamp: new Date().toISOString() },
    { id: 'rep_2', user: 'Emily Rose', address: 'Gulshan 2, Dhaka', status: 'ACKNOWLEDGED', timestamp: new Date(Date.now() - 86400000).toISOString() }
  ];

  const handleExportCSV = () => {
    toast.success('SOS Incident Report exported to CSV file.');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-purple-400">SOS Incident Reports</h1>
          <p className="text-xs text-slate-400">Log history of distress signals and resolution records.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-600/30"
        >
          <FiDownload /> Export Reports (CSV)
        </button>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-slate-400 font-bold uppercase border-b border-slate-800">
            <tr>
              <th className="p-4">Report ID</th>
              <th className="p-4">User</th>
              <th className="p-4">Location</th>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {reports.map((r) => (
              <tr key={r.id} className="hover:bg-slate-900/40">
                <td className="p-4 font-mono text-purple-400">{r.id}</td>
                <td className="p-4 font-bold text-slate-100">{r.user}</td>
                <td className="p-4 flex items-center gap-1.5"><FiMapPin className="text-pink-500" /> {r.address}</td>
                <td className="p-4">{formatDate(r.timestamp)}</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 uppercase">
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSOSReports;
