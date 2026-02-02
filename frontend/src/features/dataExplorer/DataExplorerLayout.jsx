import React from 'react';
import SidebarLayout from '../../components/layout/SidebarLayout';
import DataExplorerSidebar from './components/DataExplorerSidebar';
import { DataExplorerProvider } from './DataExplorerContext';

const DataExplorerLayout = () => {
  return (
    <DataExplorerProvider>
      <SidebarLayout sidebar={DataExplorerSidebar} />
    </DataExplorerProvider>
  );
};

export default DataExplorerLayout;
