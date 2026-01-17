import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Sidebar from '../../features/chat/components/Sidebar';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden">
      {/* Sidebar Area */}
      <aside
        className={`
          relative flex-shrink-0 bg-[var(--bg-secondary)] border-r border-[var(--border-color)]
          transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
          ${isSidebarOpen ? 'w-[280px] translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden'}
        `}
      >
        <div className="w-[280px] h-full flex flex-col">
          {/* Sidebar Content with toggle handler */}
          <Sidebar onToggleSidebar={() => setIsSidebarOpen(false)} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[var(--bg-primary)]">
        {/* Sidebar Open Button - Only show when sidebar is closed */}
        {!isSidebarOpen && (
          <div className="flex-shrink-0 h-14 flex items-center px-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-all duration-200 shadow-sm"
              title="Open Sidebar"
            >
              <PanelLeftOpen size={20} />
            </button>
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

