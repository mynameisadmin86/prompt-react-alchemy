import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export const TripDetailsForm = () => {
  return (
    <div className="space-y-6">
      {/* Trip Information Grid */}
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Customer ID</span>
            <div className="font-medium">CUS0009173</div>
          </div>
          <div>
            <span className="text-muted-foreground">Rail Info</span>
            <div className="font-medium">Railtrax NV - 46798333</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Amount</span>
            <div className="font-medium">€ 45595.00</div>
          </div>
          <div>
            <span className="text-muted-foreground">Mode</span>
            <div className="font-medium">Rail</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">From</span>
            <div className="font-medium">53-202705, Voila</div>
          </div>
          <div>
            <span className="text-muted-foreground">To</span>
            <div className="font-medium">53-21925-3, Curtici</div>
          </div>
        </div>
      </div>

      {/* Trip Type Radio */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Trip Type</Label>
        <RadioGroup defaultValue="one-way" className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="one-way" id="one-way" />
            <Label htmlFor="one-way" className="text-sm font-normal cursor-pointer">One Way</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="round-trip" id="round-trip" />
            <Label htmlFor="round-trip" className="text-sm font-normal cursor-pointer">Round Trip</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="train-no" className="text-sm font-medium">Train No.</Label>
            <Input id="train-no" placeholder="Enter Train No." className="h-9" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cluster" className="text-sm font-medium">Cluster</Label>
            <Select>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="10000406" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10000406">10000406</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="supplier-ref" className="text-sm font-medium">Supplier Ref. No.</Label>
          <Input id="supplier-ref" placeholder="Enter Supplier Ref. No." className="h-9" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="qc-userdefined" className="text-sm font-medium">QC Userdefined 1</Label>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-16 h-9">
                <SelectValue placeholder="QC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qc">QC</SelectItem>
              </SelectContent>
            </Select>
            <Input id="qc-userdefined" placeholder="Enter Value" className="flex-1 h-9" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="remarks" className="text-sm font-medium">Remarks 1</Label>
          <Textarea id="remarks" placeholder="Enter Remarks" className="min-h-[80px] resize-none" />
        </div>
      </div>
    </div>
  );
};