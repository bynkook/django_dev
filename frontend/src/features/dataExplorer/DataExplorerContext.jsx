import React, { createContext, useState, useContext } from 'react';
import { dataExplorerApi } from '../../api/djangoApi';

const DataExplorerContext = createContext();

export const DataExplorerProvider = ({ children }) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filename, setFilename] = useState('');

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await dataExplorerApi.uploadCsv(file);
      setHtmlContent(data.html);
      setFilename(file.name);
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
      const data = await dataExplorerApi.getSampleHtml();
      setHtmlContent(data.html);
      setFilename("Sample Data");
    } catch (err) {
      setError("샘플 데이터 로드 실패");
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setHtmlContent('');
    setFilename('');
    setError(null);
  };

  return (
    <DataExplorerContext.Provider value={{
      htmlContent,
      isLoading,
      error,
      filename,
      handleFileUpload,
      handleLoadSample,
      resetAnalysis
    }}>
      {children}
    </DataExplorerContext.Provider>
  );
};

export const useDataExplorer = () => useContext(DataExplorerContext);
