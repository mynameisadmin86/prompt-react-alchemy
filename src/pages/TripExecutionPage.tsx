import React, { useState, useEffect } from 'react';
import { FlexGridLayout } from '@/components/FlexGridLayout';
import { LayoutConfig } from '@/components/FlexGridLayout/types';
import { 
  TripStatusBadge, 
  TripDetailsForm, 
  ActionIconBar, 
  SummaryCardsGrid, 
  EnhancedSmartGrid, 
  TripFooterActions 
} from '@/components/TripExecution';


const TripExecutionPage = () => {
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
    sections: {
      top: {
        id: 'top',
        visible: false,
        height: '0px',
        collapsible: false,
        collapsed: true
      },
      left: {
        id: 'left',
        visible: true,
        width: '380px',
        collapsible: true,
        collapsed: false,
        minWidth: '0',
        title: 'TRIP00000001',
        content: (
          <div className="h-full flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto p-4 space-y-0">
              <TripStatusBadge />
              <TripDetailsForm />
            </div>
            <ActionIconBar />
          </div>
        )
      },
      center: {
        id: 'center',
        visible: true,
        width: 'calc(100% - 380px)',
        collapsible: false,
        title: '',
        content: (
          <div className="h-full flex flex-col">
            <div className="flex-1 p-6 space-y-6 overflow-auto">
              <EnhancedSmartGrid />
              <div>
                <h3 className="text-lg font-semibold mb-4">Summary</h3>
                <SummaryCardsGrid />
              </div>
            </div>
          </div>
        )
      },
      right: {
        id: 'right',
        visible: false,
        width: '0px',
        collapsible: true,
        collapsed: true,
        minWidth: '0'
      },
      bottom: {
        id: 'bottom',
        visible: true,
        height: 'auto',
        collapsible: false,
        title: '',
        content: <TripFooterActions />
      }
    }
  });

  const handleConfigChange = (newConfig: LayoutConfig) => {
    // Auto-adjust center width when left panel collapses/expands
    if (newConfig.sections.left.collapsed) {
      newConfig.sections.center.width = '100%';
    } else {
      newConfig.sections.center.width = 'calc(100% - 380px)';
    }
    
    setLayoutConfig(newConfig);
    // Save to localStorage
    localStorage.setItem('tripExecutionPage', JSON.stringify(newConfig));
  };

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tripExecutionPage');
    if (saved) {
      try {
        const parsedConfig = JSON.parse(saved);
        setLayoutConfig(parsedConfig);
      } catch (error) {
        console.warn('Error loading layout config from localStorage:', error);
      }
    }
  }, []);

  return (
    <div className="h-screen bg-muted/10">
      <FlexGridLayout
        config={layoutConfig}
        onConfigChange={handleConfigChange}
        className="h-full"
      />
    </div>
  );
};

export default TripExecutionPage;