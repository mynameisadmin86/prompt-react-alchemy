import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Trash2, ArrowLeft, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { DynamicLazySelect } from '@/components/DynamicPanel/DynamicLazySelect';

interface FormData {
  carrier: string;
  supplier: string;
  supplierRef: string;
  carrierStatus: string;
  scheduleNo: string;
  trainNo: string;
  pathNo: string;
  legDetails: string;
  departurePoint: string;
  arrivalPoint: string;
  service: string;
  subService: string;
  infrastructureManager: string;
  reason: string;
  remarks: string;
}

interface Resource {
  id: string;
  type: 'Schedule' | 'Agent' | 'Handler';
  name: string;
  formData: FormData;
}

const initialFormData: FormData = {
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
};

const initialResources: Resource[] = [
  { 
    id: 'SCH32030023', 
    type: 'Schedule', 
    name: 'SCH32030023',
    formData: {
      carrier: 'ABC Executive Agent',
      supplier: 'ABC Supplier',
      supplierRef: 'REF001',
      carrierStatus: 'Inprogress',
      scheduleNo: 'SCH32030023',
      trainNo: 'TR001',
      pathNo: 'P001',
      legDetails: '01 - Voila to Curtici',
      departurePoint: 'S3-202705, Voila',
      arrivalPoint: 'S3-21925-3, Curtici',
      service: 'service1',
      subService: 'sub1',
      infrastructureManager: 'IM001',
      reason: 'reason1',
      remarks: 'Schedule resource details',
    }
  },
  { 
    id: 'DB Cargo', 
    type: 'Agent', 
    name: 'DB Cargo',
    formData: {
      carrier: 'DB Cargo Agent',
      supplier: 'DB Supplier',
      supplierRef: 'REF002',
      carrierStatus: 'Completed',
      scheduleNo: 'SCH002',
      trainNo: 'TR002',
      pathNo: 'P002',
      legDetails: '01 - Voila to Curtici',
      departurePoint: 'S3-202705, Voila',
      arrivalPoint: 'S3-21925-3, Curtici',
      service: 'service2',
      subService: 'sub2',
      infrastructureManager: 'IM002',
      reason: 'reason2',
      remarks: 'Agent resource details',
    }
  },
  { 
    id: '14388 (RAM)', 
    type: 'Handler', 
    name: '14388 (RAM)',
    formData: {
      carrier: 'RAM Executive Agent',
      supplier: 'RAM Supplier',
      supplierRef: 'REF003',
      carrierStatus: 'Pending',
      scheduleNo: 'SCH003',
      trainNo: 'TR003',
      pathNo: 'P003',
      legDetails: '01 - Voila to Curtici',
      departurePoint: 'S3-202705, Voila',
      arrivalPoint: 'S3-21925-3, Curtici',
      service: 'service1',
      subService: 'sub1',
      infrastructureManager: 'IM003',
      reason: 'reason1',
      remarks: 'Handler resource details',
    }
  },
];

export const ResourcesDrawerScreen = ({ onClose }: { onClose?: () => void }) => {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Auto-select first resource on mount
  useEffect(() => {
    if (resources.length > 0) {
      const firstResource = resources[0];
      setSelectedResource(firstResource);
      setFormData(firstResource.formData);
    }
  }, []);

  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource);
    setFormData(resource.formData);
  };

  const handleAddNew = () => {
    setSelectedResource(null);
    setFormData(initialFormData);
  };

  const handleSave = () => {
    if (selectedResource) {
      // Update existing resource
      setResources(prev => 
        prev.map(r => 
          r.id === selectedResource.id 
            ? { ...r, formData } 
            : r
        )
      );
    } else {
      // Create new resource
      const newResource: Resource = {
        id: `RES${Date.now()}`,
        type: 'Schedule',
        name: formData.scheduleNo || `Resource ${resources.length + 1}`,
        formData,
      };
      setResources(prev => [...prev, newResource]);
      setSelectedResource(newResource);
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setSelectedResource(null);
  };

  // Fetch functions for lazy select
  const fetchCarrierOptions = async ({ searchTerm, offset, limit }: { searchTerm: string; offset: number; limit: number }) => {
    const allOptions = [
      { label: 'ABC Executive Agent', value: 'ABC Executive Agent' },
      { label: 'DB Cargo Agent', value: 'DB Cargo Agent' },
      { label: 'RAM Executive Agent', value: 'RAM Executive Agent' },
    ];
    const filtered = allOptions.filter(opt => 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered.slice(offset, offset + limit);
  };

  const fetchCarrierStatusOptions = async ({ searchTerm, offset, limit }: { searchTerm: string; offset: number; limit: number }) => {
    const allOptions = [
      { label: 'Inprogress', value: 'Inprogress' },
      { label: 'Completed', value: 'Completed' },
      { label: 'Pending', value: 'Pending' },
    ];
    const filtered = allOptions.filter(opt => 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered.slice(offset, offset + limit);
  };

  const fetchLegDetailsOptions = async ({ searchTerm, offset, limit }: { searchTerm: string; offset: number; limit: number }) => {
    const allOptions = [
      { label: '01 - Voila to Curtici', value: '01 - Voila to Curtici' },
      { label: '02 - Curtici to Budapest', value: '02 - Curtici to Budapest' },
      { label: '03 - Budapest to Vienna', value: '03 - Budapest to Vienna' },
    ];
    const filtered = allOptions.filter(opt => 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered.slice(offset, offset + limit);
  };

  const fetchServiceOptions = async ({ searchTerm, offset, limit }: { searchTerm: string; offset: number; limit: number }) => {
    const allOptions = [
      { label: 'Service 1', value: 'service1' },
      { label: 'Service 2', value: 'service2' },
      { label: 'Service 3', value: 'service3' },
    ];
    const filtered = allOptions.filter(opt => 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered.slice(offset, offset + limit);
  };

  const fetchSubServiceOptions = async ({ searchTerm, offset, limit }: { searchTerm: string; offset: number; limit: number }) => {
    const allOptions = [
      { label: 'Sub Service 1', value: 'sub1' },
      { label: 'Sub Service 2', value: 'sub2' },
      { label: 'Sub Service 3', value: 'sub3' },
    ];
    const filtered = allOptions.filter(opt => 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered.slice(offset, offset + limit);
  };

  const fetchReasonOptions = async ({ searchTerm, offset, limit }: { searchTerm: string; offset: number; limit: number }) => {
    const allOptions = [
      { label: 'Reason 1', value: 'reason1' },
      { label: 'Reason 2', value: 'reason2' },
      { label: 'Reason 3', value: 'reason3' },
    ];
    const filtered = allOptions.filter(opt => 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered.slice(offset, offset + limit);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Resource List */}
        <div className="w-64 border-r border-border bg-muted/30 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">All Resources</h3>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleAddNew}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto">
            {resources.map((resource) => (
              <Card
                key={resource.id}
                className={`cursor-pointer transition-colors hover:bg-accent ${
                  selectedResource?.id === resource.id ? 'bg-accent border-primary' : ''
                }`}
                onClick={() => handleResourceClick(resource)}
              >
                <CardContent className="p-3">
                  <div className="font-medium text-sm">{resource.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{resource.type}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Carrier and Supplier Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Carrier (Executive Agent)</Label>
                <DynamicLazySelect
                  fetchOptions={fetchCarrierOptions}
                  value={formData.carrier}
                  onChange={(value) => setFormData({ ...formData, carrier: (value as string) || '' })}
                  placeholder="Select Carrier"
                />
              </div>
              <div className="space-y-2">
                <Label>Supplier</Label>
                <div className="relative">
                  <Input
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Supplier Ref and Carrier Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Supplier Ref. No.</Label>
                <Input
                  placeholder="Enter Supplier Ref. No."
                  value={formData.supplierRef}
                  onChange={(e) => setFormData({ ...formData, supplierRef: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Carrier Status</Label>
                <DynamicLazySelect
                  fetchOptions={fetchCarrierStatusOptions}
                  value={formData.carrierStatus}
                  onChange={(value) => setFormData({ ...formData, carrierStatus: (value as string) || '' })}
                  placeholder="Select Status"
                />
              </div>
            </div>

            {/* Schedule No and Train No */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Schedule No.</Label>
                <div className="relative">
                  <Input
                    placeholder="Select Schedule No."
                    value={formData.scheduleNo}
                    onChange={(e) => setFormData({ ...formData, scheduleNo: e.target.value })}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Train No (License Plate No.)</Label>
                <Input
                  placeholder="Enter Train No."
                  value={formData.trainNo}
                  onChange={(e) => setFormData({ ...formData, trainNo: e.target.value })}
                />
              </div>
            </div>

            {/* Path No and Leg Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Path No.</Label>
                <Input
                  placeholder="Enter Path No."
                  value={formData.pathNo}
                  onChange={(e) => setFormData({ ...formData, pathNo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Leg Details</Label>
                <DynamicLazySelect
                  fetchOptions={fetchLegDetailsOptions}
                  value={formData.legDetails}
                  onChange={(value) => setFormData({ ...formData, legDetails: (value as string) || '' })}
                  placeholder="Select Leg Details"
                />
              </div>
            </div>

            {/* Departure and Arrival Points */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Departure Point</Label>
                <div className="relative">
                  <Input
                    value={formData.departurePoint}
                    onChange={(e) => setFormData({ ...formData, departurePoint: e.target.value })}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Arrival Point</Label>
                <div className="relative">
                  <Input
                    value={formData.arrivalPoint}
                    onChange={(e) => setFormData({ ...formData, arrivalPoint: e.target.value })}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Service and Sub Service */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Service</Label>
                <DynamicLazySelect
                  fetchOptions={fetchServiceOptions}
                  value={formData.service}
                  onChange={(value) => setFormData({ ...formData, service: (value as string) || '' })}
                  placeholder="Select Service"
                />
              </div>
              <div className="space-y-2">
                <Label>Sub Service</Label>
                <DynamicLazySelect
                  fetchOptions={fetchSubServiceOptions}
                  value={formData.subService}
                  onChange={(value) => setFormData({ ...formData, subService: (value as string) || '' })}
                  placeholder="Select Sub Service"
                />
              </div>
            </div>

            {/* Infrastructure Manager and Reason */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Infrastructure Manager Name</Label>
                <Input
                  placeholder="Enter Infrastructure Manager Name"
                  value={formData.infrastructureManager}
                  onChange={(e) => setFormData({ ...formData, infrastructureManager: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Reason</Label>
                <DynamicLazySelect
                  fetchOptions={fetchReasonOptions}
                  value={formData.reason}
                  onChange={(value) => setFormData({ ...formData, reason: (value as string) || '' })}
                  placeholder="Select Reason"
                />
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Textarea
                placeholder="Enter remarks"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 z-20 flex items-center justify-end gap-3 px-6 py-4 border-t bg-card">
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
        <Button onClick={handleSave}>
          Save Resource
        </Button>
      </div>
    </div>
  );
};
