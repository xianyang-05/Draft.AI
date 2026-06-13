import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function SideNavBar() {
  const location = useLocation();

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    const baseClass = "flex items-center gap-3 px-6 py-3 transition-colors duration-200 font-label-mono text-label-mono active:scale-95";
    if (isActive) {
      return `${baseClass} text-electric-green bg-electric-green/10 border-l-2 border-electric-green`;
    }
    return `${baseClass} text-on-surface-variant hover:text-electric-green hover:bg-white/5 border-l-2 border-transparent`;
  };

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-surface-container/80 backdrop-blur-xl border-r border-white/15 py-margin-md z-40 shadow-[0_0_40px_rgba(210,255,100,0.05)]">
      <div className="px-6 mb-8 flex flex-col gap-1">
        <span className="font-headline-md text-headline-md text-electric-green tracking-tighter">AEGIS</span>
        <span className="font-label-mono text-label-mono text-on-surface-variant tracking-[0.2em]">INTELLIGENCE</span>
      </div>
      <nav className="flex-1 space-y-1">
        <Link className={getLinkClass('/dashboard')} to="/dashboard">
          <span className="material-symbols-outlined">radar</span>
          <span>Intelligence</span>
        </Link>
        <Link className={getLinkClass('/meta')} to="/meta">
          <span className="material-symbols-outlined">insights</span>
          <span>Meta Insights</span>
        </Link>
        <Link className={getLinkClass('/draft')} to="/draft">
          <span className="material-symbols-outlined">precision_manufacturing</span>
          <span>Draft Simulator</span>
        </Link>
        <Link className={getLinkClass('/match')} to="/match">
          <span className="material-symbols-outlined">analytics</span>
          <span>Match Analysis</span>
        </Link>
      </nav>
    </aside>
  );
}
