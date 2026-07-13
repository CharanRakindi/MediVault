import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import FileUpload from '../../components/FileUpload';
import { FlaskConical, CheckCircle, ArrowRight, X, Paperclip, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { SkeletonTable } from '../../components/SkeletonLoader';

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

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await api.patch(`/lab-reports/${id}/status`, { status });
      return res.data.data;
    },
    onSuccess: () => {
      toast.success('Status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['labReports'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update status');
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

  const advanceStatus = (report) => {
    const sequence = ['ordered', 'sample_collected', 'processing'];
    const idx = sequence.indexOf(report.status);
    if (idx >= 0 && idx < sequence.length - 1) {
      updateStatus.mutate({ id: report._id, status: sequence[idx + 1] });
    } else if (report.status === 'processing') {
      setSelectedReport(report);
      setResultSummary(report.resultSummary || '');
      setReferenceRange(report.referenceRange || '');
      setAttachments(report.attachments || []);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ordered': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'sample_collected': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'processing': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const columns = [
    { id: 'ordered', title: 'Ordered' },
    { id: 'sample_collected', title: 'Sample Collected' },
    { id: 'processing', title: 'Processing' }
  ];

  if (isLoading) return <div className="card p-8"><SkeletonTable rows={5} /></div>;

  return (
    <div className="space-y-6 pb-8 animate-fade-in h-[calc(100vh-6rem)] flex flex-col">
      <div className="page-header shrink-0">
        <div>
          <h1 className="page-title">Laboratory workspace</h1>
          <p className="page-subtitle">
            Pipeline workflow for clinical tests
          </p>
        </div>
      </div>

      <div id="lab-kanban-board" className="flex-1 overflow-x-auto">
        <div className="flex gap-6 h-full min-w-max pb-4">
          {columns.map(col => {
            const colReports = (reports || []).filter(r => r.status === col.id);
            return (
              <div key={col.id} className="flex w-80 shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50/40">
                <div className="flex items-center justify-between border-b border-slate-200/70 bg-white/60 px-4 py-3.5">
                  <h3 className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{col.title}</h3>
                  <span className="badge badge-neutral">{colReports.length}</span>
                </div>
                
                <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-3">
                  {colReports.map(report => (
                    <div key={report._id} className="group rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow-premium">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-[13.5px] text-slate-900">{report.testName}</h4>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider border ${getStatusColor(report.status)}`}>
                          {report.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11.5px] font-medium text-slate-400 mb-4 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-300" /> Ordered: {format(new Date(report.orderedDate), 'MMM dd, HH:mm')}
                      </p>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                        <div className="text-[12px] font-medium text-slate-600">
                          <span className="text-slate-400">Patient:</span> <span className="font-semibold text-slate-800">{report.patient?.name}</span>
                        </div>
                        <button
                          onClick={() => advanceStatus(report)}
                          className="flex items-center justify-center p-1.5 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                          title={col.id === 'processing' ? 'Complete Result' : 'Advance Stage'}
                        >
                          {col.id === 'processing' ? <CheckCircle className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Completed Column */}
          <div className="w-80 flex flex-col bg-slate-50/50 rounded-xl border border-slate-200/60 overflow-hidden shrink-0">
            <div className="p-4 border-b border-slate-200 bg-slate-100/40 flex justify-between items-center">
              <h3 className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">Completed / Reviewed</h3>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
              {(reports || []).filter(r => r.status === 'completed' || r.status === 'reviewed').map(report => (
                <div key={report._id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-[13.5px] text-slate-900">{report.testName}</h4>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider border ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-[12px] font-medium text-slate-500 mb-2">
                    Patient: <span className="font-semibold text-slate-700">{report.patient?.name}</span>
                  </p>
                  <p className="text-[11.5px] text-slate-400 truncate">{report.resultSummary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {selectedReport && (
        <div className="modal-backdrop">
          <div className="modal-panel max-w-lg">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="flex items-center gap-2 text-[14px] font-medium text-slate-900">
                <CheckCircle className="h-4 w-4 text-slate-400" /> Finalize lab results
              </h2>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCompleteSubmit} className="space-y-4 p-6">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Test details</p>
                <p className="mt-0.5 text-[13.5px] font-medium text-slate-800">
                  {selectedReport.testName} for {selectedReport.patient?.name}
                </p>
              </div>

              <div>
                <label className="label">
                  Result summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={resultSummary}
                  onChange={(e) => setResultSummary(e.target.value)}
                  className="input min-h-[100px] resize-none py-2.5"
                  placeholder="Enter comprehensive findings…"
                />
              </div>

              <div>
                <label className="label">Reference range</label>
                <input
                  type="text"
                  value={referenceRange}
                  onChange={(e) => setReferenceRange(e.target.value)}
                  className="input"
                  placeholder="e.g. LDL < 100 mg/dL"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                <FileUpload onUploadSuccess={handleUploadSuccess} label="Attach outcome PDF or image report" />

                {attachments.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                      Uploaded files
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="badge badge-neutral gap-1.5"
                        >
                          <Paperclip className="h-3.5 w-3.5" />
                          {att.filename}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={completeTest.isPending}
                  className="btn btn-primary"
                >
                  {completeTest.isPending ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <CheckCircle className="h-3.5 w-3.5" />
                  )}
                  {completeTest.isPending ? 'Finalizing…' : 'Finalize result'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

