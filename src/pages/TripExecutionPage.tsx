import React, { useState, useEffect } from 'react';
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
  const handleSaveDraft = async () => {
    if (selectedTrip) {
      await saveTrip(selectedTrip, selectedTrip.id);
      setHasUnsavedChanges(false);
      toast.success('Trip saved as draft');
    }
  };

  // Handle confirm trip
  const handleConfirmTrip = async () => {
    if (selectedTrip) {
      await saveTrip({ ...selectedTrip, status: 'approved' }, selectedTrip.id);
      setHasUnsavedChanges(false);
      toast.success('Trip confirmed successfully');
    }
  };

  // Track field changes
  const handleFieldChange = (field: any, value: any) => {
    setHasUnsavedChanges(true);
    updateField(field, value);
  };
  
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
        title: selectedTrip?.id || 'Loading...',
        content: (
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
        content: (
          <TripFooterActions 
            onSaveDraft={handleSaveDraft}
            onConfirmTrip={handleConfirmTrip}
            loading={loading}
          />
        )
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

  // Add beforeunload and visibilitychange warnings if tabFlag is true
  useEffect(() => {
    if (!tabFlag) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        // Browser's native blocking dialog (most reliable)
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Data will be lost if you close this tab.';
        return e.returnValue;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && hasUnsavedChanges) {
        // Show blocking alert when switching tabs
        setTimeout(() => {
          alert('Warning: You have unsaved changes. Data may be lost if you leave this tab.');
        }, 100);
      }
    };

    // Add both event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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