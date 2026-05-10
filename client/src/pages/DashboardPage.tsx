import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import type { DashboardStats } from '../types';
import { 
  Users, 
  CalendarCheck, 
  FileText,
  User
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
          <p className="text-gray-500 font-medium mt-1">
            {user?.role === 'admin' 
              ? "Overview of your organization's HR metrics." 
              : "Welcome to your personal employee portal."}
          </p>
        </div>
      </div>

      {user?.role === 'admin' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg">
            <div className="p-3 bg-blue-50 text-[#0F2B8C] rounded-2xl w-fit mb-6">
              <Users size={24} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Employees</p>
            <h3 className="text-4xl font-bold text-gray-900 tracking-tight">{stats?.employeeCount || '0'}</h3>
          </div>

          <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl w-fit mb-6">
              <CalendarCheck size={24} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Attendance Today</p>
            <h3 className="text-4xl font-bold text-gray-900 tracking-tight">{stats?.todayAttendance || '0'}</h3>
          </div>

          <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl w-fit mb-6">
              <FileText size={24} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Pending Leaves</p>
            <h3 className="text-4xl font-bold text-gray-900 tracking-tight">{stats?.pendingLeaves || '0'}</h3>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="p-4 bg-blue-50 text-[#0F2B8C] rounded-2xl">
            <User size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Hello, {user?.name}</h3>
            <p className="text-gray-500 font-medium">Use the sidebar to manage your attendance or request leave.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
