import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { 
  Users, 
  TrendingUp, 
  Search, 
  DollarSign, 
  BarChart3,
  FileText, 
  Target, 
  MessageSquare, 
  HelpCircle, 
  LogOut,
  BookOpen, 
  Settings,
  BarChart2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { AscendLogo } from '@/components/dashboard/AscendLogo';
import { currentUser } from '@/lib/mock-data';

const iconComponents = {
  BarChart3,
  BarChart2,
  FileText,
  Users,
  Target,
  TrendingUp,
  MessageSquare,
  BookOpen,
  HelpCircle,
  Settings,
  LogOut
};

const navItems = [
  { icon: 'BarChart3', label: 'Dashboard', path: '/' },
  { icon: 'BarChart2', label: 'Team Performance', path: '/team-performance' },
  { icon: 'Users', label: 'Associates', path: '/associates' },
  { icon: 'FileText', label: 'Business' },
  { icon: 'Target', label: 'HGI Direct' },
  { icon: 'TrendingUp', label: 'Reports' },
  { icon: 'MessageSquare', label: 'Marketing' },
  { icon: 'BookOpen', label: 'Resources' },
  { icon: 'HelpCircle', label: 'Help Center' }
];

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-screen bg-white border-r shadow-sm transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="p-4 flex justify-between items-center">
          {!isCollapsed && <AscendLogo width={160} height={80} />}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        <nav className="mt-6 flex flex-col h-[calc(100vh-120px)]">
          {navItems.map((item, index) => {
            const IconComponent = iconComponents[item.icon as keyof typeof iconComponents];
            const isActive = item.path ? location === item.path : false;
            return (
              <Link
                key={index}
                href={item.path || '#'}
                className={`flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 ${
                  isActive ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                <IconComponent size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
          <div className="mt-auto border-t">
            <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 w-full">
              <Settings size={20} />
              {!isCollapsed && <span>Settings</span>}
            </button>
            <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 w-full">
              <LogOut size={20} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${isCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        {children}
      </div>
    </div>
  );
};
