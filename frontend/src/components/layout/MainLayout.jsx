import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../../features/chat/components/Sidebar';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden">
      {/* Sidebar Area - 완전히 사라지지 않고 좁은 버전 유지 */}
      <aside
        className={`
          relative flex-shrink-0 bg-[var(--bg-secondary)] border-r border-[var(--border-color)]
          transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
          ${isSidebarOpen ? 'w-[280px]' : 'w-[56px]'}
        `}
      >
        {isSidebarOpen ? (
          // Full Sidebar
          <div className="w-[280px] h-full flex flex-col">
            <Sidebar onToggleSidebar={() => setIsSidebarOpen(false)} />
          </div>
        ) : (
          // Collapsed Sidebar - Only Menu Icon
          <div className="w-[56px] h-full flex flex-col">
            <div className="flex-shrink-0 h-14 flex items-center justify-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-all duration-200"
                title="Open Sidebar"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[var(--bg-primary)]">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;