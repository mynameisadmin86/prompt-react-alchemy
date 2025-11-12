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

export default function TripExecutionStep2() {
  const navigate = useNavigate();
  const { operationalDetails, setOperationalDetails, markStepAsSaved, savedSteps } = useTripExecutionWizardStore();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  useEffect(() => {
    if (!savedSteps.step1) {
      toast.error('Please complete Step 1 first');
      navigate('/trip-execution-step1');
    }
  }, [savedSteps.step1, navigate]);

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
    setOperationalDetails({ [field]: value });
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // Validate required fields
    if (!operationalDetails.startDate || !operationalDetails.endDate) {
      toast.error('Please fill in Start Date and End Date');
      return;
    }

    markStepAsSaved('step2');
    setHasUnsavedChanges(false);
    toast.success('Step 2 saved successfully!');
    
    // Open step 3 in a new tab
    window.open('/trip-execution-step3', '_blank');
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
          <CardTitle className="text-2xl">Trip Execution Wizard - Step 2/4</CardTitle>
          <CardDescription>Operational Details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={operationalDetails.startDate || ''}
                onChange={(e) => handleFieldChange('startDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={operationalDetails.endDate || ''}
                onChange={(e) => handleFieldChange('endDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mode">Mode</Label>
              <Select
                value={operationalDetails.mode || ''}
                onValueChange={(value) => handleFieldChange('mode', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rail">Rail</SelectItem>
                  <SelectItem value="road">Road</SelectItem>
                  <SelectItem value="air">Air</SelectItem>
                  <SelectItem value="sea">Sea</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierRefNo">Supplier Reference Number</Label>
              <Input
                id="supplierRefNo"
                value={operationalDetails.supplierRefNo || ''}
                onChange={(e) => handleFieldChange('supplierRefNo', e.target.value)}
                placeholder="Enter supplier reference number"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="remarks1">Remarks</Label>
              <Textarea
                id="remarks1"
                value={operationalDetails.remarks1 || ''}
                onChange={(e) => handleFieldChange('remarks1', e.target.value)}
                placeholder="Enter remarks"
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-4 justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => handleNavigateAway('/trip-execution-step1')}>
              Back to Step 1
            </Button>
            <div className="flex gap-2">
              {savedSteps.step2 && (
                <Button variant="outline" onClick={() => window.open('/trip-execution-step3', '_blank')}>
                  Open Step 3
                </Button>
              )}
              <Button onClick={handleSave}>
                Save & Continue to Step 3
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
