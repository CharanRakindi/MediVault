import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import StatCard from '../../components/StatCard';
import { SkeletonCard } from '../../components/SkeletonLoader';
import { Users, UserPlus, Stethoscope, Calendar, ShieldAlert, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, isAfter, startOfDay } from 'date-fns';

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data.data;
    },
  });

  const { data: appointments } = useQuery({
    queryKey: ['adminAppointments'],
    queryFn: async () => {
      const res = await api.get('/appointments');
      return res.data.data;
    },
  });

  const { data: auditLogs } = useQuery({
    queryKey: ['adminDashboardLogs'],
    queryFn: async () => {
      const res = await api.get('/admin/audit-logs', { params: { limit: 5 } });
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  // Last 7 calendar days (not weekday-label collision)
  const getWeeklyTrendData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = startOfDay(subDays(new Date(), i));
      days.push({
        key: format(d, 'yyyy-MM-dd'),
        name: format(d, 'EEE'),
        appointments: 0,
      });
    }
    const map = Object.fromEntries(days.map((d) => [d.key, d]));
    const windowStart = days[0] ? new Date(days[0].key) : new Date();

    appointments?.forEach((apt) => {
      const d = startOfDay(new Date(apt.appointmentDate));
      if (!isAfter(windowStart, d)) {
        const key = format(d, 'yyyy-MM-dd');
        if (map[key]) map[key].appointments += 1;
      }
    });

    return days;
  };

  const chartData = getWeeklyTrendData();

  return (
    <div className="workspace">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin console</h1>
          <p className="page-subtitle">Users, schedule activity, and security audit overview</p>
        </div>
        <Link to="/admin/users" className="btn btn-primary">
          <UserPlus className="h-3.5 w-3.5" />
          Manage staff
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          index={0}
          title="Total users"
          value={stats?.totalUsers || 0}
          icon={Users}
          contextText="All registered accounts"
          actionText="Manage users"
          actionHref="/admin/users"
        />
        <StatCard
          index={1}
          title="Patients"
          value={stats?.totalPatients || 0}
          icon={UserPlus}
          contextText="Active patient accounts"
          actionText="User directory"
          actionHref="/admin/users"
        />
        <StatCard
          index={2}
          title="Practitioners"
          value={stats?.totalDoctors || 0}
          icon={Stethoscope}
          contextText="Credentialed doctors"
          actionText="Staff accounts"
          actionHref="/admin/users"
        />
        <StatCard
          index={3}
          title="Appointments"
          value={stats?.totalAppointments || 0}
          icon={Calendar}
          contextText="All scheduled visits"
          actionText="Audit activity"
          actionHref="/admin/audit-logs"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="panel-title">Weekly consultations</h2>
              <p className="panel-meta">Appointments over the last 7 days</p>
            </div>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  dy={5}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="appointments" fill="#0f172a" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card flex flex-col p-5">
          <h2 className="panel-title mb-1 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
            Recent audit activity
          </h2>
          <p className="panel-meta mb-4">Latest security-relevant events</p>

          <div className="flex-1 space-y-3">
            {!auditLogs?.length ? (
              <div className="empty-state py-8">No audit events yet</div>
            ) : (
              auditLogs.map((log) => (
                <div key={log._id} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-[#F7F6F3] text-slate-400">
                    <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12.5px] leading-snug tracking-[-0.01em] text-slate-700">
                      <span className="font-medium text-slate-900">
                        {log.actor?.name || 'System'}
                      </span>{' '}
                      · {log.action}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-slate-400">
                      {log.resourceType} ·{' '}
                      {format(new Date(log.timestamp), 'MMM dd, h:mm a')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link to="/admin/audit-logs" className="btn btn-secondary mt-5 w-full">
            Open audit console
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
