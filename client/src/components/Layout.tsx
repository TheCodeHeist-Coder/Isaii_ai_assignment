import React, { useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  FileText, 
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  HelpCircle,
  Briefcase
} from 'lucide-react';

const Layout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['admin', 'employee'] },
    { name: 'Employees', icon: Users, path: '/employees', roles: ['admin'] },
    { name: 'Attendance', icon: CalendarCheck, path: '/attendance', roles: ['admin', 'employee'] },
    { name: 'Leave', icon: FileText, path: '/leaves', roles: ['admin', 'employee'] },
  ];

  const filteredMenuItems = menuItems.filter(item => user && item.roles.includes(user.role));

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex h-screen bg-[#F5F7FB] font-sans">
      {/* Sidebar */}
      <aside 
        className={`bg-[#1A1D29] text-white fixed lg:static z-50 h-full flex flex-col transition-all duration-300 shadow-2xl ${
          isSidebarOpen ? 'w-72' : 'w-0 lg:w-20 overflow-hidden'
        }`}
      >
        <div className="p-8 flex items-center gap-3">
          <div className="bg-[#0F2B8C] p-2 rounded-xl shadow-lg shadow-blue-900/20">
            <Briefcase className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && (
            <div>
              <h1 className="text-lg font-bold tracking-tight">CorporateHR</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Admin Console</p>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="ml-auto lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-4 flex-1 px-6 space-y-1">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive(item.path)
                ? 'bg-[#0F2B8C] text-white shadow-xl shadow-blue-900/30 translate-x-1'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} className={isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-white transition-colors'} />
              {isSidebarOpen && (
                <span className="ml-3 font-bold text-sm tracking-tight">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile Card at Bottom */}
        <div className="p-6 border-t border-white/5">
          <div className={`flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 transition-all ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-[#0F2B8C] flex items-center justify-center text-white font-bold shadow-lg">
              {user?.name?.charAt(0)}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{user?.role === 'admin' ? 'Super Admin' : 'Employee'}</p>
              </div>
            )}
            {isSidebarOpen && (
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white h-20 flex items-center justify-between px-8 border-b border-gray-100 sticky top-0 z-40">
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className={`${isSidebarOpen ? 'hidden' : 'block'} text-gray-400 hover:text-gray-600 transition-colors`}
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-bold text-gray-900 whitespace-nowrap hidden md:block">HRMS Portal</h2>
            </div>
            
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0F2B8C]">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-[#0F2B8C]/10 focus:border-[#0F2B8C] transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-4">
            <div className="flex items-center gap-1">
              <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-2xl transition-all relative group">
                <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-2xl transition-all">
                <HelpCircle size={20} />
              </button>
            </div>
            
            <div className="h-8 w-px bg-gray-100 mx-2"></div>

            <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center text-[#0F2B8C] font-bold border-2 border-white shadow-sm overflow-hidden cursor-pointer hover:border-[#0F2B8C]/20 transition-all">
               {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F5F7FB] p-8">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
