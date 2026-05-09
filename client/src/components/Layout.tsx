import React from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  FileText, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Layout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['admin', 'employee'] },
    { name: 'Employees', icon: Users, path: '/employees', roles: ['admin'] },
    { name: 'Attendance', icon: CalendarCheck, path: '/attendance', roles: ['admin', 'employee'] },
    { name: 'Leaves', icon: FileText, path: '/leaves', roles: ['admin', 'employee'] },
  ];

  const filteredMenuItems = menuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-indigo-700 text-white w-64 flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? 'ml-0' : '-ml-64'}`}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">HRMS</h1>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <X size={24} />
          </button>
        </div>
        <nav className="mt-6">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center px-6 py-3 text-indigo-100 hover:bg-indigo-600 hover:text-white transition-colors"
            >
              <item.icon size={20} className="mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-6 border-t border-indigo-600">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-500 p-2 rounded-full mr-3">
              <Users size={20} />
            </div>
            <div>
              <p className="font-medium truncate w-32">{user?.name}</p>
              <p className="text-xs text-indigo-300 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-indigo-100 hover:text-white transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <button onClick={() => setIsSidebarOpen(true)} className={`${isSidebarOpen ? 'hidden' : 'block'} text-gray-500 mr-4`}>
            <Menu size={24} />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">HRMS Portal</h2>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
