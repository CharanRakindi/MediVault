import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import StatCard from '../../components/StatCard';
import SkeletonLoader, { SkeletonCard } from '../../components/SkeletonLoader';
import { Users, UserPlus, Stethoscope, Calendar, TrendingUp, ShieldAlert, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { format, subDays } from 'date-fns';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data.data;
    }
  });

  const { data: appointments } = useQuery({
    queryKey: ['adminAppointments'],
    queryFn: async () => {
      const res = await api.get('/appointments');
      return res.data.data;
    }
  });

  const { data: auditLogs } = useQuery({
    queryKey: ['adminDashboardLogs'],
    queryFn: async () => {
      const res = await api.get('/admin/audit-logs', { params: { limit: 5 } });
      return res.data.data;
    }
  });

  if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>;

  // Process appointment chart data dynamically (past 7 days)
  const getWeeklyTrendData = () => {
    const trendMap = {};
    for (let i = 6; i >= 0; i--) {
      const dateStr = format(subDays(new Date(), i), 'EEE');
      trendMap[dateStr] = 0;
    }

    appointments?.forEach(apt => {
      const dayName = format(new Date(apt.appointmentDate), 'EEE');
      if (trendMap[dayName] !== undefined) {
        trendMap[dayName] += 1;
      }
    });

    return Object.keys(trendMap).map(day => ({
      name: day,
      appointments: trendMap[day]
    }));
  };

  const chartData = getWeeklyTrendData();

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin console</h1>
          <p className="page-subtitle">
            System healthy · Database connected · 0 critical alerts
          </p>
        </div>
      </div>
      
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          index={0}
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          icon={Users} 
          contextText="System-wide registered accounts"
          actionText="Manage user directory"
          actionHref="/admin/users"
        />
        <StatCard 
          index={1}
          title="Total Patients" 
          value={stats?.totalPatients || 0} 
          icon={UserPlus} 
          contextText="Active clinical EHR files"
          actionText="Open patient directory"
          actionHref="/doctor/patients"
        />
        <StatCard 
          index={2}
          title="Practitioners" 
          value={stats?.totalDoctors || 0} 
          icon={Stethoscope} 
          contextText="Credentialed medical doctors"
          actionText="Update staff status"
          actionHref="/admin/users"
        />
        <StatCard 
          index={3}
          title="Total Schedule" 
          value={stats?.totalAppointments || 0} 
          icon={Calendar} 
          contextText="Total active clinical records"
          actionText="Open receptionist queue"
          actionHref="/receptionist/dashboard"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend Bar Chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[14.5px] font-semibold text-slate-800">Weekly Consultation Trends</h2>
              <p className="text-[11.5px] font-medium text-slate-400 mt-0.5">Total processed events over the last 7 days</p>
            </div>
            <div className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12.5%
            </div>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={5} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px'}} 
                />
                <Bar dataKey="appointments" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audit Log Overview Widget */}
        <div className="card p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-[14.5px] font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-slate-500" />
              Security Audit Activity
            </h2>
            <div className="space-y-4">
              {auditLogs?.map((log) => (
                <div key={log._id} className="flex gap-3">
                  <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 self-start shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[12.5px] font-medium text-slate-700">
                      {log.actor?.name || 'System'} performed <span className="font-semibold text-slate-900">{log.action}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {log.resourceType} • {format(new Date(log.timestamp), 'MMM dd, hh:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <button 
              onClick={() => window.location.href = '/admin/audit-logs'}
              className="btn btn-outline w-full py-2 text-[12.5px]"
            >
              Open Audit Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
