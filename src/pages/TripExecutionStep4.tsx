import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTripExecutionWizardStore } from '@/stores/tripExecutionWizardStore';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function TripExecutionStep4() {
  const navigate = useNavigate();
  const { 
    additionalDetails, 
    setAdditionalDetails, 
    markStepAsSaved, 
    savedSteps,
    basicDetails,
    operationalDetails,
    billingDetails,
    resetWizard
  } = useTripExecutionWizardStore();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  useEffect(() => {
    if (!savedSteps.step3) {
      toast.error('Please complete Step 3 first');
      navigate('/trip-execution-step3');
    }
  }, [savedSteps.step3, navigate]);

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
    setAdditionalDetails({ [field]: value });
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    markStepAsSaved('step4');
    setHasUnsavedChanges(false);
    toast.success('Step 4 saved successfully!');
  };

  const handleSubmit = () => {
    if (hasUnsavedChanges) {
      toast.error('Please save your changes before submitting');
      return;
    }

    // Here you would typically send all the data to your backend
    const allData = {
      basicDetails,
      operationalDetails,
      billingDetails,
      additionalDetails
    };

    console.log('Submitting trip execution data:', allData);
    toast.success('Trip execution completed successfully!');
    
    // Reset wizard and navigate to home
    resetWizard();
    navigate('/');
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
          <CardTitle className="text-2xl">Trip Execution Wizard - Step 4/4</CardTitle>
          <CardDescription>Additional Details & Review</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={additionalDetails.status || ''}
                onValueChange={(value) => handleFieldChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={additionalDetails.notes || ''}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                placeholder="Enter any additional notes"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachments">Attachments</Label>
              <Input
                id="attachments"
                type="file"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []).map(f => f.name);
                  setAdditionalDetails({ attachments: files });
                  setHasUnsavedChanges(true);
                }}
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-muted-foreground mb-2">Basic Details</h4>
                <div className="grid grid-cols-2 gap-2 pl-4">
                  <p>Trip ID: {basicDetails.tripId || 'N/A'}</p>
                  <p>Customer: {basicDetails.customerId || 'N/A'}</p>
                  <p>From: {basicDetails.fromLocation || 'N/A'}</p>
                  <p>To: {basicDetails.toLocation || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-muted-foreground mb-2">Operational Details</h4>
                <div className="grid grid-cols-2 gap-2 pl-4">
                  <p>Start: {operationalDetails.startDate || 'N/A'}</p>
                  <p>End: {operationalDetails.endDate || 'N/A'}</p>
                  <p>Mode: {operationalDetails.mode || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-muted-foreground mb-2">Billing Details</h4>
                <div className="grid grid-cols-2 gap-2 pl-4">
                  <p>Amount: {billingDetails.amount || 'N/A'} {billingDetails.currency || ''}</p>
                  <p>Cost: {billingDetails.cost || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => handleNavigateAway('/trip-execution-step3')}>
              Back to Step 3
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSave} disabled={!hasUnsavedChanges}>
                Save Changes
              </Button>
              <Button onClick={handleSubmit} disabled={hasUnsavedChanges}>
                Submit Trip Execution
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
