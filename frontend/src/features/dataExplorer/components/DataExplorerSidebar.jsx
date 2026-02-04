import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, BarChart3, LayoutGrid, Menu, ChevronLeft, Home, Database } from 'lucide-react';

const DataExplorerSidebar = ({ onClose, onFileUpload, onLoadSample, isLoading }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const onFileChange = (e) => {
    if (e.target.files?.[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full h-full bg-[var(--bg-secondary)] flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
            <BarChart3 className="text-blue-600" size={20} />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] truncate">
            Data Explorer
          </h1>
        </div>
        
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
            title="Go to App Selector"
          >
            <Home size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
            title="Shrink Sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
          Data Source
        </div>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="flex items-center gap-3 w-full p-3 bg-white rounded-xl hover:shadow-md transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="p-2 bg-green-50 text-green-600 rounded-lg shrink-0 group-hover:bg-green-100">
            <Upload size={20} />
          </div>
          <div>
            <p className="font-semibold text-sm text-[var(--text-primary)]">Upload CSV</p>
            <p className="text-xs text-[var(--text-secondary)]">Local file (max 500MB)</p>
          </div>
        </button>
        <input 
          type="file" 
          accept=".csv,.xlsx,.xls,.json" 
          ref={fileInputRef} 
          onChange={onFileChange} 
          className="hidden" 
        />
        
        <button
          onClick={onLoadSample}
          disabled={isLoading}
          className="flex items-center gap-3 w-full p-3 bg-white rounded-xl hover:shadow-md transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 group-hover:bg-blue-100">
            <Database size={20} />
          </div>
          <div>
            <p className="font-semibold text-sm text-[var(--text-primary)]">Sample Data</p>
            <p className="text-xs text-[var(--text-secondary)]">Load example dataset</p>
          </div>
        </button>
        
        <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-600 space-y-2 border border-gray-100">
             <p className="font-semibold text-gray-800">💡 About</p>
             <p>Powered by Graphic Walker - DuckDB based data visualization.</p>
             <p>Drag and drop fields to create charts and explore your data.</p>
        </div>
      </div>
    </div>
  );
};

export default DataExplorerSidebar;
