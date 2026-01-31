import React, { useRef, useEffect } from 'react';
import { Download, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const ResultViewer = ({ resultData, onDownload }) => {
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  if (!resultData) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
        <Maximize2 className="mx-auto mb-3 text-gray-400" size={48} />
        <p className="text-gray-600 font-medium mb-1">비교 결과가 여기에 표시됩니다</p>
        <p className="text-sm text-gray-500">두 파일을 업로드하고 "비교 시작" 버튼을 클릭하세요</p>
      </div>
    );
  }

  const { result_base64, download_base64, metadata } = resultData;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* 헤더 */}
      <div className="border-b border-gray-200 px-4 py-3 bg-gray-50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">비교 결과</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {metadata.mode === 'difference' ? '차이점 강조 모드' : '오버레이 모드'} • 
            {metadata.result_size} • 
            매칭 품질: {(metadata.match_quality * 100).toFixed(0)}%
          </p>
        </div>
        
        <button
          onClick={() => onDownload(download_base64, metadata)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Download size={16} />
          PNG 다운로드
        </button>
      </div>
      
      {/* 이미지 뷰어 */}
      <div 
        ref={containerRef}
        className="relative overflow-auto bg-gray-100"
        style={{ height: '600px' }}
      >
        <div className="flex items-center justify-center min-h-full p-4">
          <img
            ref={imgRef}
            src={result_base64}
            alt="Comparison Result"
            className="max-w-full h-auto shadow-lg"
            style={{ imageRendering: 'high-quality' }}
          />
        </div>
      </div>
      
      {/* 범례 */}
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
        {metadata.mode === 'difference' ? (
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 border border-gray-300"></div>
              <span className="text-gray-700">이미지 1만 있음</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 border border-gray-300"></div>
              <span className="text-gray-700">이미지 2만 있음</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-black border border-gray-300"></div>
              <span className="text-gray-700">공통 영역</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 border border-gray-300"></div>
              <span className="text-gray-700">이미지 1</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 border border-gray-300"></div>
              <span className="text-gray-700">이미지 2</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-600 border border-gray-300"></div>
              <span className="text-gray-700">겹침 영역</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultViewer;
