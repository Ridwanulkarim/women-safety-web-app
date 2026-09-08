import React, { useState, useEffect } from 'react';
import { FiFileText, FiDownload, FiMapPin, FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { getGlobalSOSAlerts } from '../../utils/adminDataRegistry';

const AdminSOSReports = () => {
  const [reports, setReports] = useState(() => getGlobalSOSAlerts());

  useEffect(() => {
    const handleUpdate = () => {
      setReports(getGlobalSOSAlerts());
    };

    window.addEventListener('safehaven_sos_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('safehaven_sos_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleExportCSV = () => {
    if (reports.length === 0) {
      toast.error('No incident reports available to export.');
      return;
    }

    const headers = ['Report ID', 'User Name', 'Phone', 'Address', 'Latitude', 'Longitude', 'Status', 'Timestamp'];
    const rows = reports.map((r) => [
      `"${r.id}"`,
      `"${r.userName || 'Anonymous'}"`,
      `"${r.userPhone || 'N/A'}"`,
      `"${(r.address || '').replace(/"/g, '""')}"`,
      r.latitude || '',
      r.longitude || '',
      `"${r.status}"`,
      `"${r.timestamp}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SafeHaven_SOS_Incident_Reports_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('SOS Incident Report exported to CSV file.');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="mono-tag mono-tag-rose text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 telemetry-dot"></span> AUDIT ARCHIVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            SOS Incident <span className="gradient-text-rose">Reports</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Official archival record of emergency distress signals, dispatch coordination, and resolution logs.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={reports.length === 0}
          className={`px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 font-mono transition shadow-lg ${
            reports.length === 0
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
              : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-rose-600/30'
          }`}
        >
          <FiDownload /> Export Reports (CSV)
        </button>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-zinc-800/80 shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center gap-2">
            <FiFileText className="text-rose-500" />
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
              Distress Incident Log ({reports.length})
            </h3>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 text-2xl">
              <FiFileText />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-200">No Incident Reports</h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                No emergency distress beacons or incidents have been logged yet. When an emergency SOS signal is sent, an immutable dispatch record will be generated here.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900/80 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800 text-[10px] font-mono">
                <tr>
                  <th className="p-4 sm:px-6">Report ID</th>
                  <th className="p-4">User / Citizen</th>
                  <th className="p-4">Location Telemetry</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4 sm:px-6 text-right">Dispatch Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-900/40 transition">
                    <td className="p-4 sm:px-6 font-mono text-rose-400 font-bold">
                      {r.id}
                    </td>
                    <td className="p-4 font-semibold text-zinc-100">
                      <div>
                        <p className="font-bold text-zinc-100">{r.userName}</p>
                        <p className="text-[11px] text-zinc-400 font-normal font-mono">{r.userPhone}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <FiMapPin className="text-rose-500 flex-shrink-0" />
                        <span className="truncate max-w-xs">{r.address}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-zinc-400 text-[11px]">
                      {formatDate(r.timestamp)}
                    </td>
                    <td className="p-4 sm:px-6 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-mono ${
                          r.status === 'ACTIVE'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : r.status === 'ACKNOWLEDGED'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSOSReports;
