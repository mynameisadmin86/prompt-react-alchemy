
import React from 'react';
import { FlexGridLayout } from '@/components/FlexGridLayout';
import { TripDetailsForm, TripGridDashboard } from '@/components/FlexGridLayout/SampleComponents';
import { LayoutConfig } from '@/components/FlexGridLayout/types';

const FlexGridDemo: React.FC = () => {
  const layoutConfig: LayoutConfig = {
    layoutDirection: 'row',
    panels: [
      {
        id: 'leftPanel',
        title: 'Trip Details',
        collapsible: true,
        defaultCollapsed: false,
        width: '300px',
        minWidth: '0',
        hasPullHandle: true,
        hasConfigGear: true,
        content: TripDetailsForm
      },
      {
        id: 'rightPanel',
        title: 'Main Grid',
        collapsible: true,
        defaultCollapsed: false,
        hasPullHandle: true,
        fillOnCollapseOf: 'leftPanel',
        hasConfigGear: true,
        content: TripGridDashboard
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Flex Grid Layout Demo</h1>
        <p className="text-gray-600 mt-1">
          Dynamic layout with collapsible panels, pull handles, and configurable settings - Every panel can expand/collapse
        </p>
      </div>
      
      <div style={{ height: 'calc(100vh - 80px)' }}>
        <FlexGridLayout config={layoutConfig} />
      </div>
    </div>
  );
};

export default FlexGridDemo;
