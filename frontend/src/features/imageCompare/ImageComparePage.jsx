import React, { useState } from 'react';
import { Image as ImageIcon, Play, AlertCircle } from 'lucide-react';
import FileUploader from './components/FileUploader';
import SettingsPanel from './components/SettingsPanel';
import ResultViewer from './components/ResultViewer';
import LoadingOverlay from './components/LoadingOverlay';
import { fastApi } from '../../api/fastapiApi';

const ImageComparePage = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [page1, setPage1] = useState(0);
  const [page2, setPage2] = useState(0);
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
    setResultData(null); // 파일 변경 시 결과 초기화
  };

  const handleFile2Select = (file, page) => {
    setFile2(file);
    setPage2(page);
    setResultData(null);
  };

  const handleCompare = async () => {
    if (!file1 || !file2) {
      setError('두 개의 파일을 모두 업로드해주세요.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setResultData(null);

    try {
      const result = await fastApi.compareImages({
        file1,
        file2,
        mode: settings.mode,
        diffThreshold: settings.diffThreshold,
        featureCount: settings.featureCount,
        page1,
        page2
      });

      setResultData(result);
    } catch (err) {
      console.error('Image comparison failed:', err);
      
      // 에러 메시지 처리
      if (err.response?.status === 413) {
        setError('파일 크기가 너무 큽니다. 100MB 이하의 파일을 사용해주세요.');
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

  const handleDownload = (base64Data, metadata) => {
    // base64 데이터를 blob으로 변환
    const byteString = atob(base64Data.split(',')[1]);
    const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    const blob = new Blob([ab], { type: mimeString });
    const url = URL.createObjectURL(blob);
    
    // 다운로드 링크 생성
    const link = document.createElement('a');
    link.href = url;
    link.download = `comparison_${metadata.mode}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // URL 해제
    URL.revokeObjectURL(url);
  };

  const canCompare = file1 && file2 && !isLoading;

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
      {/* 헤더 */}
      <header className="flex-shrink-0 h-16 flex items-center justify-between px-6 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <ImageIcon className="text-purple-600" size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[var(--text-primary)]">
              Image Inspector
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              이미지/도면 비교 도구
            </p>
          </div>
        </div>
        
        {error && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 좌측: 파일 업로드 & 설정 */}
            <div className="lg:col-span-1 space-y-6">
              <FileUploader
                label="이미지/도면 1"
                onFileSelect={handleFile1Select}
              />
              
              <FileUploader
                label="이미지/도면 2"
                onFileSelect={handleFile2Select}
              />
              
              <SettingsPanel
                settings={settings}
                onSettingsChange={setSettings}
              />
              
              <button
                onClick={handleCompare}
                disabled={!canCompare}
                className={`
                  w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                  text-sm font-semibold transition-all
                  ${canCompare
                    ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <Play size={18} />
                비교 시작
              </button>
              
              {canCompare && (
                <p className="text-xs text-gray-500 text-center">
                  처리 시간: 소형 파일 3-6초, 대형 파일 최대 30-48초
                </p>
              )}
            </div>

            {/* 우측: 결과 뷰어 */}
            <div className="lg:col-span-2 relative">
              {isLoading && <LoadingOverlay />}
              <ResultViewer
                resultData={resultData}
                onDownload={handleDownload}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageComparePage;
