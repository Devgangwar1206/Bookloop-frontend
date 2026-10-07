import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Heart, ArrowLeftRight, MessageSquare, MapPin } from 'lucide-react';
import { CITIES } from '../../data/mockData';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-20 md:pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-2xl text-white tracking-tight">
                BookLoop
              </span>
            </Link>
            
            <p className="font-serif italic text-blue-400 text-sm">
              "Buy. Sell. Exchange. Read Again."
            </p>
            
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              India's premier neighborhood book exchange & marketplace. Connecting passionate readers, college students, competitive aspirants, and local bookstores.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Community</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ArrowLeftRight className="w-4 h-4 text-teal-400" />
                <span>Direct Swaps</span>
              </div>
            </div>
          </div>

          {/* Categories Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/books?category=Engineering" className="hover:text-blue-400 transition-colors">Engineering & CS</Link></li>
              <li><Link to="/books?category=Competitive%20Exams" className="hover:text-blue-400 transition-colors">Competitive Exams (UPSC/JEE/NEET)</Link></li>
              <li><Link to="/books?category=Fiction" className="hover:text-blue-400 transition-colors">Fiction & Classic Novels</Link></li>
              <li><Link to="/books?category=Medical" className="hover:text-blue-400 transition-colors">Medical & Healthcare</Link></li>
              <li><Link to="/books?category=School%20Books" className="hover:text-blue-400 transition-colors">NCERT & School Sets</Link></li>
              <li><Link to="/books?category=Comics" className="hover:text-blue-400 transition-colors">Manga & Graphic Novels</Link></li>
            </ul>
          </div>

          {/* Marketplace Locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Active Hubs
            </h4>
            <ul className="space-y-2 text-xs">
              {CITIES.slice(0, 6).map((city) => (
                <li key={city}>
                  <Link to={`/books?city=${encodeURIComponent(city)}`} className="hover:text-blue-400 transition-colors flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-600" />
                    <span>{city}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick & Trust Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Community & Safety
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/sell" className="hover:text-blue-400 transition-colors font-medium text-blue-400">Sell a Book in 2 Mins</Link></li>
              <li><Link to="/business" className="hover:text-blue-400 transition-colors">Professional Seller Portal</Link></li>
              <li><Link to="/admin" className="hover:text-blue-400 transition-colors">Marketplace Admin Console</Link></li>
              <li><Link to="/settings" className="hover:text-blue-400 transition-colors">Safety Guidelines & Privacy</Link></li>
              <li><Link to="/chat" className="hover:text-blue-400 transition-colors">Direct In-App Chat</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BookLoop Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Community Rules</span>
            <span>·</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-slate-300 cursor-pointer">Safe Trading Tips</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
