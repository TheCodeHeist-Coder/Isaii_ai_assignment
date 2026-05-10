import React, { useEffect, useState } from 'react';
import api from '../services/api';
import type { Employee } from '../types';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Filter, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical,
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';

const EmployeePage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Partial<Employee> | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employeeId: '',
    department: '',
    designation: '',
    joiningDate: ''
  });

  const [filters, setFilters] = useState({
    department: 'All Departments',
    role: 'All Roles',
    status: 'All Statuses'
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (employee?: Employee) => {
    if (employee) {
      setCurrentEmployee(employee);
      setFormData({
        name: employee.name,
        email: employee.email,
        password: '',
        employeeId: employee.employeeId,
        department: employee.department,
        designation: employee.designation,
        joiningDate: employee.joiningDate.split('T')[0]
      });
    } else {
      setCurrentEmployee(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        employeeId: '',
        department: '',
        designation: '',
        joiningDate: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentEmployee) {
        await api.put(`/employees/${currentEmployee._id}`, formData);
      } else {
        await api.post('/employees', formData);
      }
      setIsModalOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = filters.department === 'All Departments' || emp.department === filters.department;
    
    return matchesSearch && matchesDept;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2B8C]"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Directory</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your workforce, update profiles, and monitor employee status.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center px-6 py-3 bg-[#0F2B8C] text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 hover:bg-[#0A1D5E] hover:shadow-blue-900/30 active:scale-[0.98] transition-all duration-200 gap-2"
        >
          <Plus size={20} />
          Add New Employee
        </button>
      </div>

      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0F2B8C]" size={18} />
            <input
              type="text"
              placeholder="Search for employees..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-[#0F2B8C]/10 focus:border-[#0F2B8C] transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0F2B8C]/10 transition-all cursor-pointer"
            value={filters.department}
            onChange={(e) => setFilters({...filters, department: e.target.value})}
          >
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Marketing</option>
            <option>Operations</option>
            <option>Human Resources</option>
          </select>

          <select className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0F2B8C]/10 transition-all cursor-pointer">
            <option>All Roles</option>
            <option>Admin</option>
            <option>Employee</option>
          </select>

          <select className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0F2B8C]/10 transition-all cursor-pointer">
            <option>All Statuses</option>
            <option>Active</option>
            <option>On Leave</option>
          </select>

          <button 
            onClick={() => {
              setSearchTerm('');
              setFilters({department: 'All Departments', role: 'All Roles', status: 'All Statuses'});
            }}
            className="p-3 text-gray-400 hover:text-[#0F2B8C] hover:bg-gray-100 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Employee Name</th>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Department</th>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Joining Date</th>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEmployees.map((emp) => (
                <tr key={emp._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F2B8C] to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-900/10">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{emp.name}</p>
                        <p className="text-[11px] font-semibold text-gray-400">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-700">#{emp.employeeId}</td>
                  <td className="px-6 py-5 text-sm font-semibold text-gray-600">{emp.department}</td>
                  <td className="px-6 py-5 text-sm font-semibold text-gray-600">{emp.designation}</td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-700">
                    {new Date(emp.joiningDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-green-50 text-green-600">
                      <CheckCircle2 size={10} />
                      Active
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(emp)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(emp._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-50">
          <p className="text-sm font-semibold text-gray-400">
            Showing <span className="text-gray-900">1</span> to <span className="text-gray-900">{filteredEmployees.length}</span> of <span className="text-gray-900">{employees.length}</span> employees
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Staffing Breakdown</h3>
              <p className="text-sm font-medium text-gray-400 mt-1">Engineering continues to be the largest department, growing by 12% this quarter.</p>
            </div>
            <div className="p-3 bg-blue-50 text-[#0F2B8C] rounded-2xl">
              <Users size={24} />
            </div>
          </div>
          <div className="space-y-4 mt-8">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                <span>Product Team</span>
                <span>64%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#0F2B8C] h-full rounded-full transition-all duration-1000" style={{ width: '64%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                <span>Marketing</span>
                <span>22%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full rounded-full transition-all duration-1000" style={{ width: '22%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                <span>Operations</span>
                <span>14%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-gray-300 h-full rounded-full transition-all duration-1000" style={{ width: '14%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0A0D14] p-8 rounded-[32px] shadow-2xl shadow-blue-900/10 text-white flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold">New Hire Welcome</h3>
                <p className="text-gray-400 font-medium mt-2 max-w-[280px]">3 new employees are starting next Monday. Ensure onboarding kits are ready.</p>
              </div>
              <div className="p-3 bg-white/10 rounded-2xl">
                <Clock size={24} className="text-blue-400" />
              </div>
            </div>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F2B8C] hover:bg-blue-700 text-white font-bold rounded-2xl transition-all duration-300 mt-4 group">
              View Onboarding List
              <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
          
          <div className="absolute -right-10 -bottom-10 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform duration-700">
             <Briefcase size={240} />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden border border-white animate-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{currentEmployee ? 'Edit Profile' : 'Add New Employee'}</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">Fill in the details below to {currentEmployee ? 'update' : 'create'} the employee profile.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#0F2B8C]/10 focus:border-[#0F2B8C] transition-all outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Business Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@corporate.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#0F2B8C]/10 focus:border-[#0F2B8C] transition-all outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                {!currentEmployee && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                    <input
                      type="password"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#0F2B8C]/10 focus:border-[#0F2B8C] transition-all outline-none"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Employee ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EMP001"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#0F2B8C]/10 focus:border-[#0F2B8C] transition-all outline-none"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Department</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engineering"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#0F2B8C]/10 focus:border-[#0F2B8C] transition-all outline-none"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#0F2B8C]/10 focus:border-[#0F2B8C] transition-all outline-none"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Joining Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#0F2B8C]/10 focus:border-[#0F2B8C] transition-all outline-none cursor-pointer"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
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
                  {currentEmployee ? 'Save Changes' : 'Create Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePage;
