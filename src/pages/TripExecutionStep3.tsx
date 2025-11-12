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

export default function TripExecutionStep3() {
  const navigate = useNavigate();
  const { billingDetails, setBillingDetails, markStepAsSaved, savedSteps } = useTripExecutionWizardStore();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  useEffect(() => {
    if (!savedSteps.step2) {
      toast.error('Please complete Step 2 first');
      navigate('/trip-execution-step2');
    }
  }, [savedSteps.step2, navigate]);

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

  const handleFieldChange = (field: string, value: string | number) => {
    setBillingDetails({ [field]: value });
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // Validate required fields
    if (!billingDetails.amount || !billingDetails.currency) {
      toast.error('Please fill in Amount and Currency');
      return;
    }

    markStepAsSaved('step3');
    setHasUnsavedChanges(false);
    toast.success('Step 3 saved successfully!');
    
    // Open step 4 in a new tab
    window.open('/trip-execution-step4', '_blank');
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
          <CardTitle className="text-2xl">Trip Execution Wizard - Step 3/4</CardTitle>
          <CardDescription>Billing Details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                value={billingDetails.amount || ''}
                onChange={(e) => handleFieldChange('amount', parseFloat(e.target.value))}
                placeholder="Enter amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Select
                value={billingDetails.currency || ''}
                onValueChange={(value) => handleFieldChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <Input
                id="cost"
                type="number"
                value={billingDetails.cost || ''}
                onChange={(e) => handleFieldChange('cost', parseFloat(e.target.value))}
                placeholder="Enter cost"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qcUserdefined1">QC User Defined 1</Label>
              <Input
                id="qcUserdefined1"
                value={billingDetails.qcUserdefined1 || ''}
                onChange={(e) => handleFieldChange('qcUserdefined1', e.target.value)}
                placeholder="Enter QC user defined field"
              />
            </div>
          </div>

          <div className="flex gap-4 justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => handleNavigateAway('/trip-execution-step2')}>
              Back to Step 2
            </Button>
            <div className="flex gap-2">
              {savedSteps.step3 && (
                <Button variant="outline" onClick={() => window.open('/trip-execution-step4', '_blank')}>
                  Open Step 4
                </Button>
              )}
              <Button onClick={handleSave}>
                Save & Continue to Step 4
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
