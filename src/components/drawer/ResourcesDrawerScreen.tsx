import React, { useState } from 'react';
import { DrawerLayout } from './DrawerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, User, Users, Wrench, Search, Plus } from 'lucide-react';

interface Resource {
  id: string;
  type: 'vehicle' | 'driver' | 'crew' | 'equipment';
  name: string;
}

const mockResources: Resource[] = [
  { id: '1', type: 'vehicle', name: 'Truck #101' },
  { id: '2', type: 'vehicle', name: 'Van #205' },
  { id: '3', type: 'driver', name: 'John Doe' },
  { id: '4', type: 'driver', name: 'Jane Smith' },
  { id: '5', type: 'crew', name: 'Crew A' },
  { id: '6', type: 'equipment', name: 'Forklift #12' },
];

interface ResourcesDrawerScreenProps {
  onClose: () => void;
}

export const ResourcesDrawerScreen: React.FC<ResourcesDrawerScreenProps> = ({ onClose }) => {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    carrier: 'ABC Executive Agent',
    supplier: 'ABC Supplier',
    supplierRef: '',
    carrierStatus: 'Inprogress',
    scheduleNo: '',
    trainNo: '',
    pathNo: '',
    legDetails: '01 - Voila to Curtici',
    departurePoint: 'S3-202705, Voila',
    arrivalPoint: 'S3-21925-3, Curtici',
    service: '',
    subService: '',
    infrastructureManager: '',
    reason: '',
    remarks: '',
  });

  const handleSave = () => {
    console.log('Saving resource allocation:', formData);
  };

  const handleClear = () => {
    setFormData({
      carrier: '',
      supplier: '',
      supplierRef: '',
      carrierStatus: '',
      scheduleNo: '',
      trainNo: '',
      pathNo: '',
      legDetails: '',
      departurePoint: '',
      arrivalPoint: '',
      service: '',
      subService: '',
      infrastructureManager: '',
      reason: '',
      remarks: '',
    });
    setSelectedResource(null);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'vehicle': return <Truck className="h-5 w-5" />;
      case 'driver': return <User className="h-5 w-5" />;
      case 'crew': return <Users className="h-5 w-5" />;
      case 'equipment': return <Wrench className="h-5 w-5" />;
      default: return null;
    }
  };

  // Left Panel: Resource List
  const leftPanel = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground">All Resources</h3>
        <Button size="icon" variant="ghost" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {mockResources.map((resource) => (
          <Card
            key={resource.id}
            className={`cursor-pointer transition-colors hover:bg-accent ${
              selectedResource?.id === resource.id ? 'bg-accent border-primary' : ''
            }`}
            onClick={() => setSelectedResource(resource)}
          >
            <CardContent className="p-3 flex items-center gap-3">
              {getResourceIcon(resource.type)}
              <div className="flex-1">
                <p className="font-medium text-sm">{resource.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{resource.type}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );

  // Right Panel: Resource Details Form
  const rightPanel = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="carrier" className="text-xs">Carrier (Executive Agent)</Label>
          <Select
            value={formData.carrier}
            onValueChange={(value) => setFormData({ ...formData, carrier: value })}
          >
            <SelectTrigger id="carrier" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ABC Executive Agent">ABC Executive Agent</SelectItem>
              <SelectItem value="XYZ Executive Agent">XYZ Executive Agent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="supplier" className="text-xs">Supplier</Label>
          <div className="relative">
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="h-9 pr-8"
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="supplierRef" className="text-xs">Supplier Ref. No.</Label>
          <Input
            id="supplierRef"
            placeholder="Enter Supplier Ref. No."
            value={formData.supplierRef}
            onChange={(e) => setFormData({ ...formData, supplierRef: e.target.value })}
            className="h-9"
          />
        </div>

        <div>
          <Label htmlFor="carrierStatus" className="text-xs">Carrier Status</Label>
          <Select
            value={formData.carrierStatus}
            onValueChange={(value) => setFormData({ ...formData, carrierStatus: value })}
          >
            <SelectTrigger id="carrierStatus" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inprogress">Inprogress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="scheduleNo" className="text-xs">Schedule No.</Label>
          <div className="relative">
            <Input
              id="scheduleNo"
              placeholder="Select Schedule No."
              value={formData.scheduleNo}
              onChange={(e) => setFormData({ ...formData, scheduleNo: e.target.value })}
              className="h-9 pr-8"
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div>
          <Label htmlFor="trainNo" className="text-xs">Train No (License Plate No.)</Label>
          <Input
            id="trainNo"
            placeholder="Enter Train No."
            value={formData.trainNo}
            onChange={(e) => setFormData({ ...formData, trainNo: e.target.value })}
            className="h-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pathNo" className="text-xs">Path No.</Label>
          <Input
            id="pathNo"
            placeholder="Enter Path No."
            value={formData.pathNo}
            onChange={(e) => setFormData({ ...formData, pathNo: e.target.value })}
            className="h-9"
          />
        </div>

        <div>
          <Label htmlFor="legDetails" className="text-xs">Leg Details</Label>
          <Select
            value={formData.legDetails}
            onValueChange={(value) => setFormData({ ...formData, legDetails: value })}
          >
            <SelectTrigger id="legDetails" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="01 - Voila to Curtici">01 - Voila to Curtici</SelectItem>
              <SelectItem value="02 - Curtici to Budapest">02 - Curtici to Budapest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="departurePoint" className="text-xs">Departure Point</Label>
          <div className="relative">
            <Input
              id="departurePoint"
              value={formData.departurePoint}
              onChange={(e) => setFormData({ ...formData, departurePoint: e.target.value })}
              className="h-9 pr-8"
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div>
          <Label htmlFor="arrivalPoint" className="text-xs">Arrival Point</Label>
          <div className="relative">
            <Input
              id="arrivalPoint"
              value={formData.arrivalPoint}
              onChange={(e) => setFormData({ ...formData, arrivalPoint: e.target.value })}
              className="h-9 pr-8"
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="service" className="text-xs">Service</Label>
          <Select
            value={formData.service}
            onValueChange={(value) => setFormData({ ...formData, service: value })}
          >
            <SelectTrigger id="service" className="h-9">
              <SelectValue placeholder="Select Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="express">Express Service</SelectItem>
              <SelectItem value="standard">Standard Service</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="subService" className="text-xs">Sub Service</Label>
          <Select
            value={formData.subService}
            onValueChange={(value) => setFormData({ ...formData, subService: value })}
          >
            <SelectTrigger id="subService" className="h-9">
              <SelectValue placeholder="Select Sub Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="door-to-door">Door to Door</SelectItem>
              <SelectItem value="port-to-port">Port to Port</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="infrastructureManager" className="text-xs">Infrastructure Manager Name</Label>
          <Input
            id="infrastructureManager"
            placeholder="Enter Infrastructure Manager Name"
            value={formData.infrastructureManager}
            onChange={(e) => setFormData({ ...formData, infrastructureManager: e.target.value })}
            className="h-9"
          />
        </div>

        <div>
          <Label htmlFor="reason" className="text-xs">Reason</Label>
          <div className="relative">
            <Input
              id="reason"
              placeholder="Select Reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="h-9 pr-8"
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="remarks" className="text-xs">Remarks</Label>
        <Textarea
          id="remarks"
          placeholder="Enter remarks"
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          className="min-h-[80px] resize-none"
        />
      </div>
    </div>
  );

  // Footer Actions
  const footer = (
    <Button onClick={handleSave} className="w-32">
      Save Resource
    </Button>
  );

  return (
    <DrawerLayout
      title="Resource Allocation"
      leftPanel={leftPanel}
      rightPanel={rightPanel}
      footer={footer}
      onClose={onClose}
    />
  );
};
