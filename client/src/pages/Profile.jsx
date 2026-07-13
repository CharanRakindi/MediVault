import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, Phone, Calendar, MapPin, Activity } from 'lucide-react';
import { format } from 'date-fns';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  const fields = [
    { icon: User, label: 'Full name', value: user.name },
    { icon: Mail, label: 'Email address', value: user.email },
    {
      icon: Shield,
      label: 'Authorized role',
      value: (
        <span className="badge badge-neutral mt-0.5 uppercase tracking-wider">
          {user.role.replace('_', ' ')}
        </span>
      ),
    },
    { icon: Phone, label: 'Phone', value: user.phone || 'Not configured' },
    {
      icon: Calendar,
      label: 'Date of birth',
      value: user.dateOfBirth
        ? format(new Date(user.dateOfBirth), 'MMMM dd, yyyy')
        : 'Not configured',
    },
    {
      icon: Activity,
      label: 'Account status',
      value: user.isActive === false ? 'Inactive' : 'Active',
    },
    {
      icon: MapPin,
      label: 'Address',
      value: user.address || 'Not configured',
    },
  ];

  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">Account profile</h1>
          <p className="page-subtitle">
            Your personal information and access role settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card space-y-6 p-6">
            <h3 className="section-title border-b border-slate-100 pb-3">
              Personal details
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {fields.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-slate-400">
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      {label}
                    </p>
                    {typeof value === 'string' ? (
                      <p className="mt-0.5 text-[13.5px] font-medium text-slate-800">
                        {value}
                      </p>
                    ) : (
                      value
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card flex flex-col items-center p-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-[22px] font-medium text-white shadow-premium">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-[16px] font-medium text-slate-900">{user.name}</h3>
          <p className="mt-1 text-[13px] font-normal text-slate-500">{user.email}</p>
          <span className="badge badge-neutral mt-3 uppercase tracking-wider">
            {user.role.replace('_', ' ')}
          </span>
          <p className="mt-6 text-[12px] font-normal leading-relaxed text-slate-400">
            Member since{' '}
            {user.createdAt
              ? format(new Date(user.createdAt), 'MMM yyyy')
              : '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
