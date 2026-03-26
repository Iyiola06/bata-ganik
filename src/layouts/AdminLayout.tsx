import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display antialiased min-h-screen flex overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white dark:bg-[#161513] border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0 z-20 print:hidden">
        <div className="p-6 flex flex-col gap-6 flex-1">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
              B
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Bata Ganik</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive('/admin') && location.pathname === '/admin' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <span className={`material-symbols-outlined ${isActive('/admin') && location.pathname === '/admin' ? 'text-primary' : 'text-slate-400 group-hover:text-primary'} transition-colors`}>grid_view</span>
              <span className={`text-sm ${isActive('/admin') && location.pathname === '/admin' ? 'font-bold' : 'font-medium'}`}>Dashboard</span>
            </Link>
            <Link
              to="/admin/products"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive('/admin/products') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <span className={`material-symbols-outlined ${isActive('/admin/products') ? 'text-primary' : 'text-slate-400 group-hover:text-primary'} transition-colors`} style={isActive('/admin/products') ? { fontVariationSettings: "'FILL' 1" } : {}}>shopping_bag</span>
              <span className={`text-sm ${isActive('/admin/products') ? 'font-bold' : 'font-medium'}`}>Products</span>
            </Link>
            <Link
              to="/admin/categories"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive('/admin/categories') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <span className={`material-symbols-outlined ${isActive('/admin/categories') ? 'text-primary' : 'text-slate-400 group-hover:text-primary'} transition-colors`}>account_tree</span>
              <span className={`text-sm ${isActive('/admin/categories') ? 'font-bold' : 'font-medium'}`}>Categories</span>
            </Link>
            <Link
              to="/admin/collections"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive('/admin/collections') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <span className={`material-symbols-outlined ${isActive('/admin/collections') ? 'text-primary' : 'text-slate-400 group-hover:text-primary'} transition-colors`}>category</span>
              <span className={`text-sm ${isActive('/admin/collections') ? 'font-bold' : 'font-medium'}`}>Collections</span>
            </Link>
            <Link
              to="/admin/merchandising"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive('/admin/merchandising') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <span className={`material-symbols-outlined ${isActive('/admin/merchandising') ? 'text-primary' : 'text-slate-400 group-hover:text-primary'} transition-colors`}>drag_indicator</span>
              <span className={`text-sm ${isActive('/admin/merchandising') ? 'font-bold' : 'font-medium'}`}>Merchandising</span>
            </Link>
            <Link
              to="/admin/export"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive('/admin/export') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <span className={`material-symbols-outlined ${isActive('/admin/export') ? 'text-primary' : 'text-slate-400 group-hover:text-primary'} transition-colors`}>menu_book</span>
              <span className={`text-sm ${isActive('/admin/export') ? 'font-bold' : 'font-medium'}`}>Catalogue Print</span>
            </Link>
            <Link
              to="/admin/orders"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive('/admin/orders') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <span className={`material-symbols-outlined ${isActive('/admin/orders') ? 'text-primary' : 'text-slate-400 group-hover:text-primary'} transition-colors`}>package_2</span>
              <span className={`text-sm ${isActive('/admin/orders') ? 'font-bold' : 'font-medium'}`}>Orders</span>
            </Link>
            <Link
              to="/admin/discount-codes"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive('/admin/discount-codes') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <span className={`material-symbols-outlined text-[1.25rem] leading-none ${isActive('/admin/discount-codes') ? 'text-primary' : 'text-slate-400 group-hover:text-primary'} transition-colors`}>sell</span>
              <span className={`text-sm ${isActive('/admin/discount-codes') ? 'font-bold' : 'font-medium'}`}>Discounts</span>
            </Link>
            <Link
              to="/admin/customers"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive('/admin/customers') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <span className={`material-symbols-outlined ${isActive('/admin/customers') ? 'text-primary' : 'text-slate-400 group-hover:text-primary'} transition-colors`}>group</span>
              <span className={`text-sm ${isActive('/admin/customers') ? 'font-bold' : 'font-medium'}`}>Customers</span>
            </Link>
            <Link
              to="/admin/analytics"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive('/admin/analytics') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <span className={`material-symbols-outlined ${isActive('/admin/analytics') ? 'text-primary' : 'text-slate-400 group-hover:text-primary'} transition-colors`}>bar_chart</span>
              <span className={`text-sm ${isActive('/admin/analytics') ? 'font-bold' : 'font-medium'}`}>Analytics</span>
            </Link>
            <Link
              to="/admin/newsletter"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive('/admin/newsletter') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <span className={`material-symbols-outlined ${isActive('/admin/newsletter') ? 'text-primary' : 'text-slate-400 group-hover:text-primary'} transition-colors`}>mail</span>
              <span className={`text-sm ${isActive('/admin/newsletter') ? 'font-bold' : 'font-medium'}`}>Newsletter</span>
            </Link>
            <Link
              to="/admin/settings"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive('/admin/settings') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <span className={`material-symbols-outlined ${isActive('/admin/settings') ? 'text-primary' : 'text-slate-400 group-hover:text-primary'} transition-colors`}>settings</span>
              <span className={`text-sm ${isActive('/admin/settings') ? 'font-bold' : 'font-medium'}`}>Settings</span>
            </Link>
          </nav>
        </div>
        {/* User Profile */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs">A</div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-900 dark:text-white">Admin User</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">View Profile</span>
            </div>
          </div>
          <a 
            href="https://sulvatech.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-primary/30 transition-all group"
          >
            <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-white/30">System by</span>
            <span className="text-primary font-bold text-[11px]">Sulva Tech</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Outlet />
      </main>
    </div>
  );
}
