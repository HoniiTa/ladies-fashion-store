import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Users,
  MessageSquare,
  ArrowLeft,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminSidebar = () => {
  const { user, logout } = useAuth();

  const links = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Products', path: '/admin/products', icon: Package },
    { name: 'Manage Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Customers', path: '/admin/users', icon: Users },
    { name: 'Customer Reviews', path: '/admin/reviews', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-navy-950 text-white min-h-screen border-r border-gold-500/20 flex flex-col justify-between flex-shrink-0">
      <div>
        {/* Brand header */}
        <div className="p-6 border-b border-gold-500/20">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <div>
              <span className="font-serif text-lg font-bold tracking-widest text-gold-300 block">
                LUXE LADIES
              </span>
              <span className="text-[10px] uppercase tracking-widest text-gold-400/70 font-mono">
                Admin Control Room
              </span>
            </div>
          </Link>
        </div>

        {/* Current user card */}
        <div className="px-6 py-4 bg-navy-900/60 border-b border-gold-500/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-500/40 overflow-hidden flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-serif text-gold-400 font-bold">L</span>
            )}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <span className="text-[10px] text-gold-400 font-mono uppercase">Master Admin</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-xs uppercase tracking-wider rounded-none transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold shadow-md'
                      : 'text-gray-300 hover:bg-navy-900 hover:text-gold-300'
                  }`
                }
              >
                <Icon className="w-4 h-4 mr-3" />
                {link.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-gold-500/10 space-y-2">
        <Link
          to="/"
          className="flex items-center w-full px-4 py-2.5 text-xs text-gold-300 hover:text-white hover:bg-navy-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          View Live Storefront
        </Link>
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-navy-900 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
