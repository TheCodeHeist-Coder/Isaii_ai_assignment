import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import type { Attendance, Employee } from '../types';
import { 
  Calendar, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MoreVertical
} from 'lucide-react';

const AttendancePage: React.FC = () => {
  const { user } = useAuthStore();
  const [records, setRecords] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [attendanceRes, employeeRes] = await Promise.all([
        api.get(user?.role === 'admin' ? '/attendance/all' : '/attendance/my'),
        user?.role === 'admin' ? api.get('/employees') : Promise.resolve({ data: [] })
      ]);
      setRecords(attendanceRes.data);
      setEmployees(employeeRes.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (empId: string, status: string) => {
    try {
      await api.post('/attendance/mark', { employeeId: empId, status });
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error marking attendance');
    }
  };

  const filteredEmployees = employees.filter(e => 
    e.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2B8C]"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500 font-medium mt-1">Track and manage employee attendance records.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <Calendar size={18} className="text-[#0F2B8C]" />
          <span className="text-sm font-bold text-gray-700">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {user?.role === 'admin' && (
        <div className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Mark Attendance</h3>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0F2B8C]" size={18} />
              <input
                type="text"
                placeholder="Search employees..."
                className="pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm w-64 focus:ring-2 focus:ring-[#0F2B8C]/10 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEmployees.map(emp => (
              <div key={emp._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#0F2B8C]/20 transition-all">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0F2B8C] to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                   </div>
                   <p className="text-sm font-bold text-gray-900">{emp.name}</p>
                </div>
                <div className="flex gap-2">
                   {['present', 'late', 'half-day', 'absent'].map(status => (
                     <button
                        key={status}
                        onClick={() => markAttendance(emp._id, status)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                          status === 'present' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                          status === 'late' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                          status === 'absent' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                          'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                     >
                       {status}
                     </button>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 flex justify-between items-center border-b border-gray-50">
          <h3 className="text-xl font-bold text-gray-900">Recent Records</h3>
          <button className="text-sm font-bold text-[#0F2B8C] hover:underline transition-all">Export Report</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Check In</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {records.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5 text-sm font-bold text-gray-900">{(record.user as any).name}</td>
                  <td className="px-6 py-5 text-sm font-semibold text-gray-600">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      record.status === 'present' ? 'bg-green-50 text-green-600' :
                      record.status === 'late' ? 'bg-yellow-50 text-yellow-600' :
                      record.status === 'half-day' ? 'bg-blue-50 text-blue-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {record.status === 'present' && <CheckCircle2 size={10} />}
                      {record.status === 'late' && <Clock size={10} />}
                      {record.status === 'absent' && <XCircle size={10} />}
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-gray-600">{record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                  <td className="px-8 py-5 text-right text-gray-400 hover:text-gray-600"><MoreVertical size={18} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
