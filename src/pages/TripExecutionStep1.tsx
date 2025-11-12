import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTripExecutionWizardStore } from '@/stores/tripExecutionWizardStore';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function TripExecutionStep1() {
  const navigate = useNavigate();
  const { basicDetails, setBasicDetails, markStepAsSaved, savedSteps } = useTripExecutionWizardStore();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleFieldChange = (field: string, value: string) => {
    setBasicDetails({ [field]: value });
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // Validate required fields
    if (!basicDetails.tripId || !basicDetails.customerId) {
      toast.error('Please fill in Trip ID and Customer ID');
      return;
    }

    markStepAsSaved('step1');
    setHasUnsavedChanges(false);
    toast.success('Step 1 saved successfully!');
    
    // Open step 2 in a new tab
    window.open('/trip-execution-step2', '_blank');
  };

  const handleNavigateAway = (path: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(path);
      setShowExitDialog(true);
    } else {
      navigate(path);
    }
  };

  const confirmNavigation = () => {
    if (pendingNavigation) {
      setHasUnsavedChanges(false);
      navigate(pendingNavigation);
    }
    setShowExitDialog(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Trip Execution Wizard - Step 1/4</CardTitle>
          <CardDescription>Basic Details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tripId">Trip ID *</Label>
              <Input
                id="tripId"
                value={basicDetails.tripId || ''}
                onChange={(e) => handleFieldChange('tripId', e.target.value)}
                placeholder="Enter trip ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerId">Customer ID *</Label>
              <Input
                id="customerId"
                value={basicDetails.customerId || ''}
                onChange={(e) => handleFieldChange('customerId', e.target.value)}
                placeholder="Enter customer ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tripType">Trip Type</Label>
              <Select
                value={basicDetails.tripType || ''}
                onValueChange={(value) => handleFieldChange('tripType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trip type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-way">One Way</SelectItem>
                  <SelectItem value="round-trip">Round Trip</SelectItem>
                  <SelectItem value="multi-stop">Multi Stop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="railInfo">Rail Info</Label>
              <Input
                id="railInfo"
                value={basicDetails.railInfo || ''}
                onChange={(e) => handleFieldChange('railInfo', e.target.value)}
                placeholder="Enter rail info"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromLocation">From Location</Label>
              <Input
                id="fromLocation"
                value={basicDetails.fromLocation || ''}
                onChange={(e) => handleFieldChange('fromLocation', e.target.value)}
                placeholder="Enter from location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="toLocation">To Location</Label>
              <Input
                id="toLocation"
                value={basicDetails.toLocation || ''}
                onChange={(e) => handleFieldChange('toLocation', e.target.value)}
                placeholder="Enter to location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trainNo">Train Number</Label>
              <Input
                id="trainNo"
                value={basicDetails.trainNo || ''}
                onChange={(e) => handleFieldChange('trainNo', e.target.value)}
                placeholder="Enter train number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cluster">Cluster</Label>
              <Input
                id="cluster"
                value={basicDetails.cluster || ''}
                onChange={(e) => handleFieldChange('cluster', e.target.value)}
                placeholder="Enter cluster"
              />
            </div>
          </div>

          <div className="flex gap-4 justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => handleNavigateAway('/')}>
              Back to Home
            </Button>
            <div className="flex gap-2">
              {savedSteps.step1 && (
                <Button variant="outline" onClick={() => window.open('/trip-execution-step2', '_blank')}>
                  Open Step 2
                </Button>
              )}
              <Button onClick={handleSave}>
                Save & Continue to Step 2
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave without saving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmNavigation}>Leave Without Saving</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
