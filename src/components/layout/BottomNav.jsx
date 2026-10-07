import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, PlusCircle, MessageSquare, User } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export function BottomNav() {
  const { unreadMessages } = useMarketplace();

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/books', label: 'Explore', icon: Search },
    { to: '/sell', label: 'Sell', icon: PlusCircle, isSpecial: true },
    { to: '/chat', label: 'Chat', icon: MessageSquare, badge: unreadMessages },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200 shadow-lg px-2 py-1.5 backdrop-blur-md">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.isSpecial) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-blue-600 mt-1">
                  {item.label}
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative flex flex-col items-center py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
