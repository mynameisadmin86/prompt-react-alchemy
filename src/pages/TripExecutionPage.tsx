import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
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
import { useTripStore } from '@/datastore/tripStore';
import { toast } from 'sonner';

const TripExecutionPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [searchParams] = useSearchParams();
  const tabFlag = searchParams.get('tabflag') === 'true';
  const { selectedTrip, loading, error, loadTripById, saveTrip, updateField, reset } = useTripStore();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Handle save draft
  const handleSaveDraft = useCallback(async () => {
    if (selectedTrip) {
      await saveTrip(selectedTrip, selectedTrip.id);
      setHasUnsavedChanges(false);
      toast.success('Trip saved as draft');
    }
  }, [selectedTrip, saveTrip]);

  // Handle confirm trip
  const handleConfirmTrip = useCallback(async () => {
    if (selectedTrip) {
      await saveTrip({ ...selectedTrip, status: 'approved' }, selectedTrip.id);
      setHasUnsavedChanges(false);
      toast.success('Trip confirmed successfully');
    }
  }, [selectedTrip, saveTrip]);

  // Track field changes
  const handleFieldChange = useCallback((field: any, value: any) => {
    setHasUnsavedChanges(true);
    updateField(field, value);
  }, [updateField]);
  
  // Left panel content component to avoid stale closures
  const LeftPanelContent = React.useMemo(() => (
    <div className="h-full flex flex-col overflow-hidden">
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading trip details...</div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-auto p-4 space-y-0">
            <TripStatusBadge status={selectedTrip?.status} />
            <TripDetailsForm 
              tripData={selectedTrip} 
              onFieldChange={handleFieldChange}
            />
          </div>
          <ActionIconBar />
        </>
      )}
    </div>
  ), [loading, selectedTrip, handleFieldChange]);

  // Center panel content
  const CenterPanelContent = React.useMemo(() => (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <EnhancedSmartGrid />
        <div>
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <SummaryCardsGrid />
        </div>
      </div>
    </div>
  ), []);

  // Bottom panel content
  const BottomPanelContent = React.useMemo(() => (
    <TripFooterActions 
      onSaveDraft={handleSaveDraft}
      onConfirmTrip={handleConfirmTrip}
      loading={loading}
    />
  ), [handleSaveDraft, handleConfirmTrip, loading]);

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
        title: 'Trip Details',
        content: null
      },
      center: {
        id: 'center',
        visible: true,
        width: 'calc(100% - 380px)',
        collapsible: false,
        title: '',
        content: null
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
        content: null
      }
    }
  });

  // Update layout config content when dependencies change
  React.useEffect(() => {
    setLayoutConfig(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        left: {
          ...prev.sections.left,
          title: selectedTrip?.id || 'Loading...',
          content: LeftPanelContent
        },
        center: {
          ...prev.sections.center,
          content: CenterPanelContent
        },
        bottom: {
          ...prev.sections.bottom,
          content: BottomPanelContent
        }
      }
    }));
  }, [LeftPanelContent, CenterPanelContent, BottomPanelContent, selectedTrip?.id]);

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

  // Load trip data on mount
  useEffect(() => {
    if (tripId) {
      loadTripById(tripId);
    }
    
    return () => {
      reset();
    };
  }, [tripId, loadTripById, reset]);

  // Load layout from localStorage on mount
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

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Add beforeunload (close/refresh) and blur (tab switch) warnings if tabFlag is true
  useEffect(() => {
    if (!tabFlag) return;

    // Handle tab close / refresh - shows browser's blocking dialog
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Data will be lost if you close this tab.';
        return e.returnValue;
      }
    };

    // Handle tab blur / switching away - shows alert
    const handleBlur = () => {
      if (hasUnsavedChanges) {
        alert('Warning: You have unsaved changes. Data may be lost if you leave this tab.');
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('blur', handleBlur);
    };
  }, [tabFlag, hasUnsavedChanges]);

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