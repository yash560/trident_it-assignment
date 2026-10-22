'use client';

import React from 'react';
import { Store, Code, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                Trident IT — Promotional Offers & Supermarket REST Platform
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Architected with Next.js 15, React 19, TypeScript, Tailwind CSS v4 & Relational SQLite
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-500 dark:text-slate-400">
            <a
              href="/api/v1/health"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 dark:hover:text-sky-400 flex items-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>API Health Check</span>
            </a>
            <a
              href="/api/v1/docs"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 dark:hover:text-sky-400 flex items-center space-x-1"
            >
              <Code className="w-3.5 h-3.5" />
              <span>OpenAPI 3.1 Spec</span>
            </a>
            <span className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-sky-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20 text-xs">
              Powered by TheWebVale
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <p>© 2026 Trident IT Assessment Submission. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono">
            Compliant with ANSI SQL, PostgreSQL & SQLite Relational Standards
          </p>
        </div>
      </div>
    </footer>
  );
};
