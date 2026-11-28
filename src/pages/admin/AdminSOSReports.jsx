import React, { useState, useEffect } from 'react';
import { FiFileText, FiDownload, FiMapPin, FiCpu } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { getGlobalSOSAlerts } from '../../utils/adminDataRegistry';
import AdminAIAgentDrawer from '../../components/admin/AdminAIAgentDrawer';

const AdminSOSReports = () => {
  const [reports, setReports] = useState(() => getGlobalSOSAlerts());
  const [isAIAgentOpen, setIsAIAgentOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setReports(getGlobalSOSAlerts());
    window.addEventListener('safehaven_sos_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('safehaven_sos_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleExportCSV = () => {
    if (reports.length === 0) {
      toast.error('No incident reports to export');
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

    toast.success('Incident report exported to CSV');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono text-[#737373] dark:text-[#85858b]">Audit archive</span>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-[#171717] dark:text-[#ededed]">
            SOS incident reports
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
            Archival record of distress broadcasts, dispatch coordination, and resolutions
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button onClick={() => setIsAIAgentOpen(true)} className="flex-1 sm:flex-initial btn-solid h-10 px-4 text-xs">
            <FiCpu className="w-4 h-4 dispatch-icon" /> AI incident copilot
          </button>

          <button
            onClick={handleExportCSV}
            disabled={reports.length === 0}
            className="flex-1 sm:flex-initial btn-outline h-10 px-4 text-xs"
          >
            <FiDownload className="w-4 h-4 dispatch-icon" /> Export CSV
          </button>
        </div>
      </div>

      <AdminAIAgentDrawer
        defaultMode="SOS_REPORTS"
        isOpen={isAIAgentOpen}
        onClose={() => setIsAIAgentOpen(false)}
      />

      <div className="surface-panel overflow-hidden">
        <div className="px-5 py-3.5 border-b border-zinc-900/[0.08] dark:border-white/[0.08] flex items-center justify-between bg-[#fafafa] dark:bg-[#141415]">
          <div className="flex items-center gap-2">
            <FiFileText className="w-4 h-4 text-[#e11d48] dispatch-icon" />
            <h2 className="text-xs font-medium text-[#171717] dark:text-[#ededed]">
              Distress incident log ({reports.length})
            </h2>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-3">
            <FiFileText className="w-6 h-6 mx-auto text-[#737373] dark:text-[#85858b] dispatch-icon" />
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-[#171717] dark:text-[#ededed]">No incident reports</h3>
              <p className="text-xs text-[#737373] dark:text-[#85858b] max-w-md mx-auto">
                No emergency distress signals have been logged yet. Incoming broadcasts appear here automatically.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafa] dark:bg-[#141415] text-[#737373] dark:text-[#85858b] font-medium border-b border-zinc-900/[0.08] dark:border-white/[0.08]">
                <tr>
                  <th className="py-3 px-5">Report ID</th>
                  <th className="py-3 px-4">Reporter</th>
                  <th className="py-3 px-4">Location telemetry</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/[0.08] dark:divide-white/[0.08]">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-[#fafafa] dark:hover:bg-[#141415] transition-colors">
                    <td className="py-3.5 px-5 font-mono tabular-nums text-[#e11d48] font-medium">{r.id}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-[#171717] dark:text-[#ededed]">{r.userName || 'Anonymous'}</p>
                      <p className="text-[#737373] dark:text-[#85858b] font-mono tabular-nums">{r.userPhone || '—'}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-[#525252] dark:text-[#a1a1a6]">
                        <FiMapPin className="w-3.5 h-3.5 text-[#e11d48] shrink-0 dispatch-icon" />
                        <span className="truncate max-w-xs">{r.address}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-[#737373] dark:text-[#85858b]">
                      {formatDate(r.timestamp)}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span
                        className={`status-tag ${
                          r.status === 'ACTIVE' ? 'mono-tag-rose' : r.status === 'RESOLVED' ? 'mono-tag-emerald' : ''
                        }`}
                      >
                        {r.status === 'ACTIVE' ? 'Active' : r.status === 'ACKNOWLEDGED' ? 'Acknowledged' : 'Resolved'}
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
