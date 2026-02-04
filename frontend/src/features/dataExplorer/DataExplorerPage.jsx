import React, { useState } from 'react';
import { Menu, AlertCircle } from 'lucide-react';
import { GraphicWalker } from '@kanaries/graphic-walker';
import DataExplorerSidebar from './components/DataExplorerSidebar';
import { dataExplorerApi } from '../../api/djangoApi';

const DataExplorerPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [fields, setFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filename, setFilename] = useState(null);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await dataExplorerApi.uploadCsv(file);
      setDataSource(response.data);
      setFields(response.fields);
      setFilename(response.filename);
    } catch (err) {
      console.error(err);
      setError("파일 업로드 및 분석에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await dataExplorerApi.getSampleData();
      setDataSource(response.data);
      setFields(response.fields);
      setFilename(response.filename);
    } catch (err) {
      console.error(err);
      setError("샘플 데이터 로드에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
        {/* Sidebar */}
        <div className={`${
            isSidebarOpen ? 'w-80' : 'w-0'
        } flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden bg-[var(--bg-secondary)]`}>
             <DataExplorerSidebar 
                onClose={() => setIsSidebarOpen(false)}
                onFileUpload={handleFileUpload}
                onLoadSample={handleLoadSample}
                isLoading={isLoading}
             />
        </div>

        {/* Main Content */}
        <div className={`flex-1 flex flex-col min-w-0 relative bg-white ${!isSidebarOpen ? 'pl-16' : ''}`}>
            {/* Toggle Button */}
            {!isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="absolute top-4 left-4 z-50 p-2 bg-white shadow-md border rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                >
                    <Menu size={20} />
                </button>
            )}

            {/* Error Banner */}
            {error && (
                <div className="flex-shrink-0 bg-red-50 text-red-600 px-4 py-3 text-sm flex items-center gap-2 border-b border-red-100 z-40">
                    <AlertCircle size={16} />
                    {error}
                    <button 
                        onClick={() => setError(null)} 
                        className="ml-auto text-xs hover:underline"
                    >
                        닫기
                    </button>
                </div>
            )}

            {/* Graphic Walker Area */}
            <div className="flex-1 w-full h-full relative overflow-auto">
                {dataSource.length > 0 && fields.length > 0 ? (
                    <div className="w-full h-full p-4">
                        <div className="mb-2 text-sm text-gray-600">
                            <span className="font-semibold">{filename}</span> - {dataSource.length} rows
                        </div>
                        <GraphicWalker
                            data={dataSource}
                            fields={fields}
                            appearance="light"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <p>왼쪽 사이드바에서 CSV 파일을 업로드하거나 샘플 데이터를 로드하세요.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default DataExplorerPage;
