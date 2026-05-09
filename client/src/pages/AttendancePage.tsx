import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import type { Attendance } from '../types';
import { CheckCircle } from 'lucide-react';

const AttendancePage: React.FC = () => {
  const { user } = useAuthStore();
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [status, setStatus] = useState<'present' | 'absent' | 'late' | 'half-day'>('present');
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, [user]);

  const fetchAttendance = async () => {
    try {
      const endpoint = user?.role === 'admin' ? '/attendance/all' : '/attendance/my';
      const response = await api.get(endpoint);
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setMarking(true);
    try {
      await api.post('/attendance/mark', { status, note });
      fetchAttendance();
      setNote('');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error marking attendance');
    } finally {
      setMarking(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const hasMarkedToday = records.some(r => {
    const recordDate = new Date(r.date).setHours(0,0,0,0);
    const today = new Date().setHours(0,0,0,0);
    return recordDate === today;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Attendance Management</h1>

      {user?.role === 'employee' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Mark Today's Attendance</h2>
          {hasMarkedToday ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
              <CheckCircle size={20} className="mr-2" />
              You have already marked your attendance for today.
            </div>
          ) : (
            <form onSubmit={handleMarkAttendance} className="flex flex-col md:flex-row items-end gap-4">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="half-day">Half Day</option>
                </select>
              </div>
              <div className="flex-[2] w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
                <input
                  type="text"
                  placeholder="Anything to add?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={marking}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {marking ? 'Marking...' : 'Mark Attendance'}
              </button>
            </form>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Attendance Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold">
              <tr>
                {user?.role === 'admin' && <th className="px-6 py-4">Employee</th>}
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {records.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                  {user?.role === 'admin' && (
                    <td className="px-6 py-4">
                      {(record.user as any).name}
                    </td>
                  )}
                  <td className="px-6 py-4">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      record.status === 'present' ? 'bg-green-100 text-green-700' :
                      record.status === 'late' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 italic">
                    {record.note || '-'}
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

export default AttendancePage;
