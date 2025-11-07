import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StarRating } from '@/components/ui/star-rating';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface VendorPerformanceFeedbackDrawerProps {
  onClose: () => void;
  tripId?: string;
}

const ratingLabels = ['Poor', 'Below Average', 'Ok', 'Good', 'Excellent'];

export const VendorPerformanceFeedbackDrawer: React.FC<VendorPerformanceFeedbackDrawerProps> = ({
  onClose,
  tripId = 'TRIP00000001',
}) => {
  const { toast } = useToast();
  const [rating, setRating] = useState<number>(3);
  const [reasonCode, setReasonCode] = useState<string>('CM');
  const [remarks, setRemarks] = useState<string>('Delivery was handled well');

  const handleSave = () => {
    // Here you would typically send the data to your API
    console.log('Saving feedback:', {
      tripId,
      rating,
      reasonCode,
      remarks,
    });

    toast({
      title: 'Feedback saved',
      description: 'Vendor performance feedback has been saved successfully.',
    });

    onClose();
  };

  const getRatingLabel = (ratingValue: number) => {
    return ratingLabels[ratingValue - 1] || '';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Vendor Performance Feedback</h2>
          <Badge variant="secondary" className="text-xs">
            {tripId}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Vendor */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Vendor</Label>
          <div className="text-sm text-foreground bg-muted px-3 py-2 rounded-md">
            10020296 - Zimmermann Spedition GMBH
          </div>
        </div>

        {/* Feedback */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Feedback</Label>
          <div className="flex items-center gap-4">
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size="lg"
              className="flex-shrink-0"
            />
            <span className="text-sm font-medium text-foreground">
              {getRatingLabel(rating)}
            </span>
          </div>
        </div>

        {/* Reason Code */}
        <div className="space-y-2">
          <Label htmlFor="reasonCode" className="text-sm font-medium">
            Reason Code
          </Label>
          <Select value={reasonCode} onValueChange={setReasonCode}>
            <SelectTrigger id="reasonCode" className="w-full">
              <SelectValue placeholder="Select reason code" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CM">CM - Consignment Missing</SelectItem>
              <SelectItem value="DL">DL - Delay in Delivery</SelectItem>
              <SelectItem value="DM">DM - Damaged Goods</SelectItem>
              <SelectItem value="IC">IC - Incomplete Documentation</SelectItem>
              <SelectItem value="PS">PS - Poor Service</SelectItem>
              <SelectItem value="ES">ES - Excellent Service</SelectItem>
              <SelectItem value="OT">OT - On Time Delivery</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Remarks */}
        <div className="space-y-2">
          <Label htmlFor="remarks" className="text-sm font-medium">
            Remarks
          </Label>
          <Textarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter your remarks..."
            className="min-h-[100px] resize-none"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 px-6 py-4 border-t bg-card">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Details
        </Button>
      </div>
    </div>
  );
};
