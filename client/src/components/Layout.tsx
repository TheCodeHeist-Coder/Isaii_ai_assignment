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
  Settings,
  Search,
  Bell,
  HelpCircle,
  Briefcase,
  Activity
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
    { name: 'Settings', icon: Settings, path: '/settings', roles: ['admin', 'employee'] },
  ];

  const filteredMenuItems = menuItems.filter(item => user && item.roles.includes(user.role));

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex h-screen bg-[#F5F7FB] font-sans">
      <aside 
        className={`bg-[#0A0D14] text-white fixed lg:static z-50 h-full flex flex-col transition-all duration-300 shadow-2xl ${
          isSidebarOpen ? 'w-64' : 'w-0 lg:w-20 overflow-hidden'
        }`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="bg-[#0F2B8C] p-2 rounded-xl">
            <Briefcase className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && (
            <div>
              <h1 className="text-lg font-bold tracking-tight">CorporateHR</h1>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Admin Console</p>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="ml-auto lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 flex-1 px-4 space-y-1">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive(item.path)
                ? 'bg-[#0F2B8C] text-white shadow-lg shadow-blue-900/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} className={isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
              {isSidebarOpen && (
                <span className="ml-3 font-medium text-sm">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>

        {isSidebarOpen && (
          <div className="px-6 py-6 border-t border-white/5">
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-green-500" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">System Health</span>
                </div>
                <span className="text-[10px] font-bold text-green-500">98%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1">
                <div className="bg-green-500 h-1 rounded-full w-[98%] shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-red-500/10 rounded-xl transition-all duration-200 group"
          >
            <LogOut size={20} className="group-hover:text-red-500 transition-colors" />
            {isSidebarOpen && <span className="ml-3 font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white h-20 flex items-center justify-between px-8 border-b border-gray-100 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className={`${isSidebarOpen ? 'hidden' : 'block'} text-gray-400 hover:text-gray-600 transition-colors`}
            >
              <Menu size={24} />
            </button>
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0F2B8C]">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search employees, documents..."
                className="block w-full pl-11 pr-4 py-2.5 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-[#0F2B8C]/10 focus:border-[#0F2B8C] transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-xl transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-xl transition-all">
                <HelpCircle size={20} />
              </button>
            </div>
            
            <div className="h-8 w-px bg-gray-100 mx-1"></div>

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-tight">{user?.role}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-[#0F2B8C] to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20 border-2 border-white">
                {user?.name?.charAt(0)}
              </div>
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
