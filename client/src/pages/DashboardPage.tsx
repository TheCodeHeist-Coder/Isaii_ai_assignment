import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import type { DashboardStats } from '../types';
import { 
  Users, 
  CalendarCheck, 
  FileText, 
  TrendingUp, 
  MoreVertical,
  ChevronRight,
  UserPlus,
  Download,
  ShieldCheck,
  Filter
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentLeaves = [
    { name: 'Sarah Jenkins', role: 'UI Designer', type: 'Annual Leave', duration: '3 Days', status: 'Approved', dates: 'May 12 - May 15' },
    { name: 'Michael Chen', role: 'Backend Dev', type: 'Sick Leave', duration: '1 Day', status: 'Pending', dates: 'May 10 - May 11' },
    { name: 'Emma Wilson', role: 'HR Manager', type: 'Maternity', duration: '3 Months', status: 'Approved', dates: 'Jun 01 - Aug 30' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2B8C]"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1">Welcome back, {user?.name}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <CalendarCheck size={18} className="text-[#0F2B8C]" />
          <span className="text-sm font-bold text-gray-700">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-[#0F2B8C] rounded-2xl group-hover:bg-[#0F2B8C] group-hover:text-white transition-colors">
              <Users size={24} />
            </div>
            <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2.5 py-1 rounded-lg">
              <TrendingUp size={14} />
              <span className="text-xs font-bold">+4%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Employees</p>
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stats?.employeeCount || '1,248'}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-colors">
              <CalendarCheck size={24} />
            </div>
            <div className="bg-blue-50 text-[#0F2B8C] px-2.5 py-1 rounded-lg">
              <span className="text-xs font-bold">92% rate</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Present Today</p>
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stats?.todayAttendance || '1,152'}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-colors">
              <FileText size={24} />
            </div>
            <div className="bg-red-50 text-red-600 px-2.5 py-1 rounded-lg">
              <span className="text-xs font-bold">Urgent</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Pending Leaves</p>
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stats?.pendingLeaves || '12'}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-4xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Attendance Overview</h3>
              <p className="text-sm font-medium text-gray-400 mt-0.5">Weekly trends for current month</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-100 transition-colors">
              Last 7 Days
              <Filter size={14} />
            </button>
          </div>
          
          <div className="h-64 flex items-end gap-3 px-4 relative">
             <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                {[1,2,3,4].map(i => <div key={i} className="w-full border-t border-gray-50"></div>)}
             </div>
             {[40, 70, 55, 90, 65, 80, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-linear-to-t from-[#0F2B8C] to-blue-500 rounded-t-xl relative group" style={{ height: `${h}%` }}>
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0F2B8C] text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {h}%
                   </div>
                </div>
             ))}
          </div>
          <div className="flex justify-between mt-6 px-4">
             {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <span key={d} className="text-xs font-bold text-gray-400">{d}</span>
             ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="bg-[#0A0D14] p-8 rounded-4xl shadow-2xl shadow-blue-900/10 text-white flex-1">
            <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-[#0F2B8C] rounded-2xl transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white/10 rounded-xl group-hover:bg-white/20">
                    <UserPlus size={20} />
                  </div>
                  <span className="font-bold text-sm">Add New Employee</span>
                </div>
                <ChevronRight size={18} className="text-gray-500 group-hover:text-white" />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-[#0F2B8C] rounded-2xl transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white/10 rounded-xl group-hover:bg-white/20">
                    <Download size={20} />
                  </div>
                  <span className="font-bold text-sm">Export Payroll Report</span>
                </div>
                <ChevronRight size={18} className="text-gray-500 group-hover:text-white" />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-[#0F2B8C] rounded-2xl transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white/10 rounded-xl group-hover:bg-white/20">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="font-bold text-sm">Compliance Audit</span>
                </div>
                <ChevronRight size={18} className="text-gray-500 group-hover:text-white" />
              </button>
            </div>
            
            <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/5">
               <p className="text-xs font-bold text-gray-400 mb-1">Need assistance?</p>
               <button className="text-sm font-bold text-[#0F2B8C] hover:text-blue-400 transition-colors">Contact System Admin</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 flex justify-between items-center border-b border-gray-50">
          <h3 className="text-xl font-bold text-gray-900">Recent Leave Requests</h3>
          <button className="text-sm font-bold text-[#0F2B8C] hover:underline transition-all">View All Requests</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Employee Name</th>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentLeaves.map((leave, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0F2B8C]/10 flex items-center justify-center text-[#0F2B8C] font-bold text-sm">
                        {leave.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{leave.name}</p>
                        <p className="text-[11px] font-semibold text-gray-400">{leave.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-gray-600">{leave.type}</td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-gray-900">{leave.duration}</p>
                    <p className="text-[11px] font-semibold text-gray-400">{leave.dates}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      leave.status === 'Approved' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
