'use client';

import React from 'react';
import { Store, Terminal, Code2, Sun, Moon, Database } from 'lucide-react';

interface NavbarProps {
  activeTab: 'browse' | 'merchant' | 'api' | 'architecture';
  setActiveTab: (tab: 'browse' | 'merchant' | 'api' | 'architecture') => void;
  isDark: boolean;
  toggleTheme: () => void;
  supermarketCount: number;
  offersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  supermarketCount,
  offersCount,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#090d16]/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('browse')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  Trident<span className="text-blue-600 dark:text-sky-400">Offers</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  REST API v1
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Promotional Offers & Supermarket Network
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              id="tab-browse"
              onClick={() => setActiveTab('browse')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'browse'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 shadow-sm border border-blue-200 dark:border-blue-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Browse Offers</span>
              <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                {offersCount}
              </span>
            </button>

            <button
              id="tab-merchant"
              onClick={() => setActiveTab('merchant')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'merchant'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 shadow-sm border border-blue-200 dark:border-blue-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Merchant Portal</span>
              <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold">
                {supermarketCount} Stores
              </span>
            </button>

            <button
              id="tab-api"
              onClick={() => setActiveTab('api')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'api'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 shadow-sm border border-blue-200 dark:border-blue-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Interactive API</span>
            </button>

            <button
              id="tab-architecture"
              onClick={() => setActiveTab('architecture')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'architecture'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 shadow-sm border border-blue-200 dark:border-blue-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Architecture & Schema</span>
            </button>
          </nav>

          {/* Right Actions: System Health & Theme Toggle */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>SQLite Relational Engine Active</span>
            </div>

            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-between pb-3 overflow-x-auto space-x-2">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'browse'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Browse ({offersCount})
          </button>
          <button
            onClick={() => setActiveTab('merchant')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'merchant'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Merchant Portal
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'api'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            API Console
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Architecture
          </button>
        </div>
      </div>
    </header>
  );
};
