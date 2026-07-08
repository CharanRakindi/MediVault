import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import FileUpload from '../../components/FileUpload';
import { FileText, FlaskConical, Search, PlusCircle, Paperclip, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function LabTechDashboard() {
  const queryClient = useQueryClient();
  const [selectedReport, setSelectedReport] = useState(null);
  const [resultSummary, setResultSummary] = useState('');
  const [referenceRange, setReferenceRange] = useState('');
  const [attachments, setAttachments] = useState([]);

  // Load all reports
  const { data: reports, isLoading } = useQuery({
    queryKey: ['labReports'],
    queryFn: async () => {
      const res = await api.get('/lab-reports');
      return res.data.data;
    }
  });

  // Mutate: complete lab test
  const completeTest = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.patch(`/lab-reports/${id}/results`, data);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success('Lab report updated and finalized successfully');
      setSelectedReport(null);
      setResultSummary('');
      setReferenceRange('');
      setAttachments([]);
      queryClient.invalidateQueries({ queryKey: ['labReports'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update lab report');
    }
  });

  const handleUploadSuccess = (url, fileInfo) => {
    setAttachments(prev => [...prev, {
      filename: fileInfo.filename,
      url: url,
      mimetype: fileInfo.mimetype
    }]);
  };

  const handleCompleteSubmit = (e) => {
    e.preventDefault();
    if (!resultSummary) {
      toast.error('Result summary is required');
      return;
    }
    completeTest.mutate({
      id: selectedReport._id,
      data: { resultSummary, referenceRange, attachments }
    });
  };

  const pendingReports = reports?.filter(r => r.status === 'pending') || [];
  const completedReports = reports?.filter(r => r.status === 'completed') || [];

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-primary-500" />
          Laboratory Technician Portal
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Review active test orders, fill result outcomes, and securely attach document reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Middle: Test Orders Queue */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Orders */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pending Test Orders ({pendingReports.length})</h3>
            
            {pendingReports.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-semibold bg-slate-50 dark:bg-slate-800/20 rounded-xl">
                No pending test orders currently queued
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingReports.map(report => (
                  <div 
                    key={report._id} 
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedReport?._id === report._id 
                        ? 'border-primary-500 bg-primary-50/30 dark:bg-primary-950/20' 
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => {
                      setSelectedReport(report);
                      setResultSummary(report.resultSummary || '');
                      setReferenceRange(report.referenceRange || '');
                      setAttachments(report.attachments || []);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-slate-900 dark:text-white">{report.testName}</h4>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">Type: {report.testType || 'General'}</p>
                        <p className="text-xs font-medium text-slate-500 mt-2">
                          Ordered for: <span className="font-bold">{report.patient?.name}</span>
                        </p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
                        {report.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Orders */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Completed Tests History</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-850 text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800/30">
                    <th className="px-3 py-2">Test Name</th>
                    <th className="px-3 py-2">Patient</th>
                    <th className="px-3 py-2">Completed Date</th>
                    <th className="px-3 py-2">Outcome Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-xs font-semibold">
                  {completedReports.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-6 text-center text-slate-400">
                        No completed reports logged
                      </td>
                    </tr>
                  ) : (
                    completedReports.map(report => (
                      <tr key={report._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-3 py-3 font-bold text-slate-850 dark:text-slate-200">{report.testName}</td>
                        <td className="px-3 py-3">{report.patient?.name}</td>
                        <td className="px-3 py-3 text-slate-400">{report.resultDate ? format(new Date(report.resultDate), 'MMM dd, yyyy') : 'N/A'}</td>
                        <td className="px-3 py-3 text-slate-500 truncate max-w-xs">{report.resultSummary}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Complete Report Outcome form */}
        <div className="lg:col-span-1">
          {selectedReport ? (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-5 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-none">Fill Test Outcomes</h3>
                <p className="text-xs font-medium text-slate-400 mt-1">{selectedReport.testName} for {selectedReport.patient?.name}</p>
              </div>

              <form onSubmit={handleCompleteSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Result Summary</label>
                  <textarea
                    rows={4}
                    value={resultSummary}
                    onChange={(e) => setResultSummary(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-800 dark:text-slate-100"
                    placeholder="Enter comprehensive findings, diagnostic details..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Reference Range</label>
                  <input
                    type="text"
                    value={referenceRange}
                    onChange={(e) => setReferenceRange(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-800 dark:text-slate-100"
                    placeholder="e.g. LDL < 100 mg/dL is optimal"
                  />
                </div>

                <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <FileUpload onUploadSuccess={handleUploadSuccess} label="Attach outcome PDF or Image report" />
                  
                  {attachments.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Uploaded documents</p>
                      {attachments.map((att, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-primary-600 font-medium">
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>{att.filename}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReport(null)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={completeTest.isPending}
                    className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Commit Outcomes
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl p-8 text-center text-slate-400">
              Select a pending test order to record results and complete the report
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
