import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import type { DashboardStats } from '../types';
import { Users, CalendarCheck, FileText, Clock } from 'lucide-react';

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
        <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {user?.role === 'admin' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg mr-4">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Employees</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.employeeCount}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg mr-4">
              <CalendarCheck size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Present Today</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.todayAttendance}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg mr-4">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Leaves</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.pendingLeaves}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Clock size={20} className="mr-2 text-indigo-600" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">No recent activity to show.</p>
          </div>
        </div>
        
        <div className="bg-indigo-600 p-6 rounded-xl shadow-sm text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Employee Handbook</h3>
            <p className="text-indigo-100 mb-4">Check out the latest updates to our company policies and benefits.</p>
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
              View Policies
            </button>
          </div>
          <FileText className="absolute -right-4 -bottom-4 text-indigo-500 opacity-20" size={150} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
