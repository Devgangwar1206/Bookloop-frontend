import React, { useState } from 'react';
import { 
  Bell, 
  Shield, 
  Lock, 
  MessageSquare, 
  MapPin, 
  UserX, 
  Check, 
  Save 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export function SettingsPage() {
  const { addToast } = useToast();

  const [settings, setSettings] = useState({
    emailAlerts: true,
    pushAlerts: true,
    chatSound: true,
    showOnlineStatus: true,
    requireOtpForTrades: false,
    shareLocationExact: false,
    autoDeclineLowball: true
  });

  const toggleSetting = (key) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      addToast('Setting preference saved', 'info', 1800);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Account & Security Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure privacy boundaries, notifications, and marketplace safety preferences
          </p>
        </div>

        <div className="space-y-6">
          
          {/* Notifications */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <Bell className="w-5 h-5 text-blue-600" />
              <h2 className="font-serif text-lg font-bold text-slate-900">
                Notification Preferences
              </h2>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Email Notifications for Offers & Messages</div>
                  <div className="text-xs text-slate-500">Receive an email when someone places an offer or replies to a chat</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailAlerts}
                  onChange={() => toggleSetting('emailAlerts')}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Push Notifications on Mobile Browser</div>
                  <div className="text-xs text-slate-500">Instant alerts for exchange proposals and message replies</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.pushAlerts}
                  onChange={() => toggleSetting('pushAlerts')}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Privacy & Safety */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <Shield className="w-5 h-5 text-emerald-600" />
              <h2 className="font-serif text-lg font-bold text-slate-900">
                Privacy & Safety Controls
              </h2>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Show Online Status in Chat</div>
                  <div className="text-xs text-slate-500">Let buyers and sellers see when you are actively browsing BookLoop</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showOnlineStatus}
                  onChange={() => toggleSetting('showOnlineStatus')}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Mask Exact Location on Listings</div>
                  <div className="text-xs text-slate-500">Show only the city/area radius (e.g. "Noida Sector 62") rather than exact street</div>
                </div>
                <input
                  type="checkbox"
                  checked={!settings.shareLocationExact}
                  onChange={() => toggleSetting('shareLocationExact')}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Auto-filter extreme low-ball offers below 50%</div>
                  <div className="text-xs text-slate-500">Prevent spam bids that are less than half of your listed price</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoDeclineLowball}
                  onChange={() => toggleSetting('autoDeclineLowball')}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Blocked Users Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <UserX className="w-5 h-5 text-rose-600" />
              <h2 className="font-serif text-lg font-bold text-slate-900">
                Blocked Users
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Users you have blocked cannot message you, see your listings, or send offers.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
              You haven't blocked any readers yet.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default SettingsPage;
