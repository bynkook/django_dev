import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Play, AlertCircle, LogOut, ChevronLeft, ChevronRight, RotateCcw, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUploader from './components/FileUploader';
import SettingsPanel from './components/SettingsPanel';
import ResultViewer from './components/ResultViewer';
import LoadingOverlay from './components/LoadingOverlay';
import { fastApi } from '../../api/fastapiApi';
import { authApi } from '../../api/djangoApi';

const ImageComparePage = () => {
  const navigate = useNavigate();
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [page1, setPage1] = useState(0);
  const [page2, setPage2] = useState(0);
  const [file1Pages, setFile1Pages] = useState(1);
  const [file2Pages, setFile2Pages] = useState(1);
  const [resetKey, setResetKey] = useState(0);
  const [isResetHovered, setIsResetHovered] = useState(false);
  const [isSyncNav, setIsSyncNav] = useState(true);
  
  // Cache for storing comparison results to avoid re-fetching
  const resultCache = useRef(new Map());
  
  const [settings, setSettings] = useState({
    mode: 'difference',
    diffThreshold: 30,
    featureCount: 4000
  });
  const [resultData, setResultData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile1Select = (file, page) => {
    setFile1(file);
    setPage1(page);
    setFile1Pages(1); // Reset page count on new file
    setResultData(null);
    resultCache.current.clear(); // Clear cache when file changes
  };

  const handleFile2Select = (file, page) => {
    setFile2(file);
    setPage2(page);
    setFile2Pages(1); // Reset page count on new file
    setResultData(null);
    resultCache.current.clear(); // Clear cache when file changes
  };

  const handleCompare = async (overridePage1, overridePage2) => {
    if (!file1 || !file2) {
      setError('두 개의 파일을 모두 업로드해주세요.');
      return;
    }

    const p1 = typeof overridePage1 === 'number' ? overridePage1 : page1;
    const p2 = typeof overridePage2 === 'number' ? overridePage2 : page2;
    
    // Generate a unique cache key based on inputs and settings
    const cacheKey = `${p1}-${p2}-${settings.mode}-${settings.diffThreshold}-${settings.featureCount}`;

    // Check cache first - return immediately without triggering loading state
    if (resultCache.current.has(cacheKey)) {
      const cachedResult = resultCache.current.get(cacheKey);
      setResultData(cachedResult);
      // Ensure page counts are consistent (though they shouldn't change for same file)
      if (cachedResult.metadata) {
        if (cachedResult.metadata.file1_pages) setFile1Pages(cachedResult.metadata.file1_pages);
        if (cachedResult.metadata.file2_pages) setFile2Pages(cachedResult.metadata.file2_pages);
      }
      return;
    }

    // Save current scroll position before loading
    const mainContent = document.querySelector('.flex-1.overflow-auto');
    const scrollTop = mainContent?.scrollTop || 0;

    setError(null);
    setIsLoading(true);
    // setResultData(null); // Keep previous result for better UX, overlay covers it

    try {
      const result = await fastApi.compareImages({
        file1,
        file2,
        mode: settings.mode,
        diffThreshold: settings.diffThreshold,
        featureCount: settings.featureCount,
        page1: p1,
        page2: p2
      });
      
      // Store result in cache
      resultCache.current.set(cacheKey, result);

      setResultData(result);
      
      // Update total pages from metadata
      if (result.metadata) {
        if (result.metadata.file1_pages) setFile1Pages(result.metadata.file1_pages);
        if (result.metadata.file2_pages) setFile2Pages(result.metadata.file2_pages);
      }

      // Restore scroll position after a short delay
      setTimeout(() => {
        if (mainContent) {
          mainContent.scrollTop = scrollTop;
        }
      }, 50);

    } catch (err) {
      console.error('Image comparison failed:', err);
      
      if (err.response?.status === 413) {
        setError('파일 크기가 너무 큽니다. 30MB 이하의 파일을 사용해주세요.');
      } else if (err.response?.status === 429) {
        setError('동시 처리 제한에 도달했습니다. 잠시 후 다시 시도해주세요.');
      } else if (err.response?.status === 504) {
        setError('처리 시간이 초과되었습니다. 파일 크기를 줄이거나 잠시 후 다시 시도해주세요.');
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('이미지 비교 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Reset all states
    setFile1(null);
    setFile2(null);
    setPage1(0);
    setPage2(0);
    setFile1Pages(1);
    setFile2Pages(1);
    setResultData(null);
    setError(null);
    setResetKey(prev => prev + 1); // Force re-render of components with this key
    resultCache.current.clear(); // Clear cache on reset
  };

  const changePage = (fileNum, delta) => {
    if (isSyncNav) {
      // Synchronized navigation
      // Calculate target page based on the file that triggered the change
      const currentBasePage = fileNum === 1 ? page1 : page2;
      const targetPage = currentBasePage + delta;

      // Determine new pages for both files, clamping to their respective limits
      const newPage1 = Math.min(Math.max(0, targetPage), file1Pages - 1);
      const newPage2 = Math.min(Math.max(0, targetPage), file2Pages - 1);

      // If neither changed (e.g. both at start/end), do nothing
      if (newPage1 === page1 && newPage2 === page2) return;

      setPage1(newPage1);
      setPage2(newPage2);
      handleCompare(newPage1, newPage2);
    } else {
      // Independent navigation
      let newPage, otherPage;
      
      if (fileNum === 1) {
        newPage = Math.max(0, Math.min(page1 + delta, file1Pages - 1));
        if (newPage === page1) return;
        setPage1(newPage);
        otherPage = page2;
        handleCompare(newPage, otherPage);
      } else {
        newPage = Math.max(0, Math.min(page2 + delta, file2Pages - 1));
        if (newPage === page2) return;
        setPage2(newPage);
        otherPage = page1;
        handleCompare(otherPage, newPage);
      }
    }
  };

  const handleDownload = (base64Data, metadata) => {
    const byteString = atob(base64Data.split(',')[1]);
    const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    const blob = new Blob([ab], { type: mimeString });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `comparison_${metadata.mode}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    try {
      sessionStorage.setItem('returnTo', '/image-compare');
      await authApi.logout();
    } catch (error) {
      console.error('[Logout] Backend logout failed:', error);
    } finally {
      const returnTo = sessionStorage.getItem('returnTo');
      sessionStorage.clear();
      if (returnTo) sessionStorage.setItem('returnTo', returnTo);
      navigate('/login');
    }
  };

  const canCompare = file1 && file2 && !isLoading;
  const username = sessionStorage.getItem('username') || 'User';
  const userEmail = sessionStorage.getItem('email') || '';

  const PageControl = ({ label, currentPage, totalPages, onPrev, onNext, disabled }) => (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
        <button
          onClick={onPrev}
          disabled={disabled || currentPage <= 0}
          className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-mono w-16 text-center">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={disabled || currentPage >= totalPages - 1}
          className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden">
      {/* Sidesbar */}
      <aside className="w-full max-w-[320px] bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col z-20">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <ImageIcon className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Image Inspector</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
          
          <button
            onClick={handleReset}
            onMouseEnter={() => setIsResetHovered(true)}
            onMouseLeave={() => setIsResetHovered(false)}
            className={`
              w-full flex items-center justify-center gap-2 px-3 py-2 mb-4 rounded-lg text-sm border transition-all
              ${isResetHovered 
                ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium' 
                : 'bg-white border-gray-300 text-gray-700'
              }
            `}
          >
            <RotateCcw size={16} />
            새로운 비교 초기화
          </button>

          <div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
              File Upload
            </div>
            <div className="space-y-3">
              <FileUploader
                key={`uploader-1-${resetKey}`}
                label="이미지/도면 1"
                onFileSelect={handleFile1Select}
              />
              <FileUploader
                key={`uploader-2-${resetKey}`}
                label="이미지/도면 2"
                onFileSelect={handleFile2Select}
              />
            </div>
          </div>
          
          <div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
              Settings
            </div>
            <SettingsPanel
              settings={settings}
              onSettingsChange={setSettings}
            />
          </div>
          
          <button
            onClick={() => handleCompare()}
            disabled={!canCompare}
            className={`
              w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
              text-sm font-semibold transition-all shadow-md
              ${canCompare || isLoading
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
              ${isLoading ? 'opacity-70 cursor-wait' : ''}
            `}
          >
            {isLoading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Play size={18} />}
            {isLoading ? '처리 중...' : '비교 시작'}
          </button>
          
          <div className="h-6 flex items-center justify-center">
            {(canCompare || isLoading) && (
              <p className="text-xs text-gray-500 text-center px-2">
                처리 시간: 1분 이내에 완료됩니다.
              </p>
            )}
          </div>
        </div>

        <div className="p-4 bg-[var(--bg-secondary)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-[var(--text-primary)]">{username}</p>
                <p className="text-xs text-[var(--text-secondary)] truncate" title={userEmail}>
                  {userEmail}
                </p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2.5 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="flex-shrink-0 h-16 flex items-center justify-between px-6 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              이미지/도면 비교 분석
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              두 이미지의 차이점을 정밀하게 비교합니다
            </p>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs max-w-md">
              <AlertCircle size={14} className="shrink-0" />
              <span className="truncate">{error}</span>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-auto p-6 relative flex flex-col">
          {isLoading && <LoadingOverlay />}
          
          <ResultViewer
            resultData={resultData}
            onDownload={handleDownload}
          />
        </div>

        {/* Page Selector Footer */}
        {(file1Pages > 1 || file2Pages > 1) && (
          <div className="flex-shrink-0 h-20 bg-[var(--bg-primary)] flex items-center justify-center gap-10 px-6 z-10 relative">
            
            {/* Sync Toggle */}
            <div className="absolute left-6 flex items-center gap-2">
              <button
                onClick={() => setIsSyncNav(!isSyncNav)}
                className={`
                  flex items-center gap-2 px-3 py-2 text-sm transition-all
                  ${isSyncNav 
                    ? 'text-blue-700 font-medium' 
                    : 'text-gray-600'
                  }
                `}
              >
                <Link size={16} className={isSyncNav ? 'text-blue-500' : 'text-gray-400'} />
                1,2 동시 이동
                <div className={`
                  w-4 h-4 rounded border flex items-center justify-center ml-1 transition-colors
                  ${isSyncNav ? 'bg-blue-500 border-blue-500' : 'border-gray-400 bg-white'}
                `}>
                  {isSyncNav && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
              </button>
            </div>

            {file1Pages > 1 && (
              <PageControl
                label=""
                currentPage={page1}
                totalPages={file1Pages}
                onPrev={() => changePage(1, -1)}
                onNext={() => changePage(1, 1)}
                disabled={isLoading}
              />
            )}
            
            {/* Divider if both exist */}
            {file1Pages > 1 && file2Pages > 1 && (
              <div className="w-px h-10 bg-gray-300"></div>
            )}

            {file2Pages > 1 && (
              <PageControl
                label=""
                currentPage={page2}
                totalPages={file2Pages}
                onPrev={() => changePage(2, -1)}
                onNext={() => changePage(2, 1)}
                disabled={isLoading}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ImageComparePage;
