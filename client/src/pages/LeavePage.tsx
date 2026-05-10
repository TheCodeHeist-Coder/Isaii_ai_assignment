import React, { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import type { Leave } from '../types';
import { 
  FilePlus,  
  X, 
  Clock, 
  Calendar, 
  Timer, 
  Plane, 
  AlertCircle,
  Filter,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const LeavePage: React.FC = () => {
  const { user } = useAuthStore();
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    leaveType: 'casual'
  });

  useEffect(() => {
    fetchLeaves();
  }, [user]);

  const fetchLeaves = async () => {
    try {
      const endpoint = user?.role === 'admin' ? '/leaves/all' : '/leaves/my';
      const response = await api.get(endpoint);
      setLeaves(response.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const analytics = useMemo(() => {
    const pending = leaves.filter(l => l.status === 'pending').length;
    
    // Avg Approval Time
    const nonPending = leaves.filter(l => l.status !== 'pending');
    let avgApprovalTime = "0d";
    if (nonPending.length > 0) {
      const totalTime = nonPending.reduce((acc, l) => {
        const applied = new Date(l.appliedAt).getTime();
        const updated = new Date((l as any).updatedAt).getTime();
        return acc + (updated - applied);
      }, 0);
      const avgMs = totalTime / nonPending.length;
      const avgDays = (avgMs / (1000 * 60 * 60 * 24)).toFixed(1);
      avgApprovalTime = `${avgDays}d`;
    }

    // Employees On Leave
    const now = new Date();
    const onLeave = leaves.filter(l => {
      if (l.status !== 'approved') return false;
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      // Set hours to 0 to compare dates only
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      return today >= startDate && today <= endDate;
    }).length;

    // Declined This Month
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const declinedThisMonth = leaves.filter(l => {
      if (l.status !== 'rejected') return false;
      const updated = new Date((l as any).updatedAt);
      return updated.getMonth() === thisMonth && updated.getFullYear() === thisYear;
    }).length;

    return {
      pending,
      avgApprovalTime,
      onLeave,
      declinedThisMonth
    };
  }, [leaves]);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/leaves/apply', formData);
      setIsModalOpen(false);
      fetchLeaves();
      setFormData({ startDate: '', endDate: '', reason: '', leaveType: 'casual' });
    } catch (error) {
      console.error('Error applying leave:', error);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.patch(`/leaves/${id}/status`, { status });
      fetchLeaves();
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  const calculateDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.abs(e.getTime() - s.getTime());
    return Math.ceil(diff / (1000 * 3600 * 24)) + 1;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2B8C]"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-500 font-medium mt-1">Review and manage organization-wide leave applications.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-6 py-3 bg-[#0F2B8C] text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 hover:bg-[#0A1D5E] hover:shadow-blue-900/30 active:scale-[0.98] transition-all duration-200 gap-2"
        >
          <FilePlus size={20} />
          {user?.role === 'admin' ? 'Add Leave Entry' : 'Request Leave'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
          <div className="p-3 bg-blue-50 text-[#0F2B8C] rounded-2xl w-fit mb-4 group-hover:bg-[#0F2B8C] group-hover:text-white transition-colors">
            <Calendar size={24} />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{analytics.pending}</h3>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Pending Requests</p>
          <span className="text-xs font-bold text-green-600 mt-2 block">+12% vs last month</span>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl w-fit mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <Timer size={24} />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{analytics.avgApprovalTime}</h3>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Avg Approval Time</p>
          <span className="text-xs font-bold text-green-600 mt-2 block">-4h improve</span>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
          <div className="p-3 bg-green-50 text-green-600 rounded-2xl w-fit mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <Plane size={24} />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{analytics.onLeave.toString().padStart(2, '0')}</h3>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Employees On Leave</p>
          <span className="text-xs font-bold text-gray-400 mt-2 block">Currently away</span>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl w-fit mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{analytics.declinedThisMonth.toString().padStart(2, '0')}</h3>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Declined This Month</p>
          <span className="text-xs font-bold text-red-600 mt-2 block">Rejected</span>
        </div>
      </div>

      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-50">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold text-gray-900">Recent Applications</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full uppercase tracking-wider">ALL {leaves.length}</span>
              <span className="px-3 py-1 bg-blue-50 text-[#0F2B8C] text-[10px] font-bold rounded-full uppercase tracking-wider">PENDING {analytics.pending}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-xl transition-all border border-gray-100">
              <Filter size={18} />
            </button>
            <select className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-600 outline-none cursor-pointer">
              <option>All Types</option>
              <option>Annual Leave</option>
              <option>Sick Leave</option>
              <option>Casual Leave</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0F2B8C] text-white font-bold text-sm rounded-xl hover:bg-[#0A1D5E] transition-colors">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leaves.map((leave) => (
                <tr key={leave._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0F2B8C] to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {((leave.user as any).name || 'U').split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{(leave.user as any).name}</p>
                        <p className="text-[11px] font-semibold text-gray-400">{(leave.user as any).role || 'Employee'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-semibold text-gray-600 capitalize">{leave.leaveType} Leave</span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(leave.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(leave.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-[11px] font-semibold text-gray-400">{calculateDays(leave.startDate, leave.endDate)} Days</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      leave.status === 'approved' ? 'bg-green-50 text-green-600' :
                      leave.status === 'rejected' ? 'bg-red-50 text-red-600' :
                      'bg-blue-50 text-[#0F2B8C]'
                    }`}>
                      {leave.status === 'approved' ? <CheckCircle2 size={10} /> : 
                       leave.status === 'rejected' ? <XCircle size={10} /> : 
                       <Clock size={10} />}
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      {leave.status === 'pending' && user?.role === 'admin' ? (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(leave._id, 'approved')}
                            className="px-4 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-all shadow-md shadow-green-900/10"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(leave._id, 'rejected')}
                            className="px-4 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-all"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                          <MoreVertical size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-50">
          <p className="text-sm font-semibold text-gray-400">
            Showing <span className="text-gray-900">{leaves.length > 0 ? 1 : 0} to {leaves.length}</span> of <span className="text-gray-900">{leaves.length}</span> requests
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all disabled:opacity-30" disabled>
              <ChevronLeft size={20} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-[#0F2B8C] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-900/20">
              1
            </button>
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
          <div className="bg-white rounded-4xl shadow-2xl w-full max-w-lg overflow-hidden border border-white animate-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Apply for Leave</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">Submit your request for time off here.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleApplyLeave} className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Start Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#0F2B8C]/10 focus:border-[#0F2B8C] transition-all outline-none"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">End Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#0F2B8C]/10 focus:border-[#0F2B8C] transition-all outline-none"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Leave Type</label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#0F2B8C]/10 focus:border-[#0F2B8C] transition-all outline-none cursor-pointer"
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                >
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="vacation">Vacation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Reason</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us why you need this time off..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#0F2B8C]/10 focus:border-[#0F2B8C] transition-all outline-none"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                ></textarea>
              </div>

              <div className="flex justify-end gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-gray-500 font-bold hover:text-gray-900 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#0F2B8C] text-white rounded-2xl font-bold shadow-lg shadow-blue-900/20 hover:bg-[#0A1D5E] transition-all active:scale-95"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavePage;
