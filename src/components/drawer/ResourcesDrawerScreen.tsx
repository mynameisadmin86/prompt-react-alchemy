import React, { useState } from 'react';
import { DrawerLayout } from './DrawerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, User, Users, Wrench } from 'lucide-react';

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
    resourceType: '',
    resourceName: '',
    assignedTo: '',
    startDate: '',
    endDate: '',
    notes: '',
  });

  const handleSave = () => {
    console.log('Saving resource allocation:', formData);
  };

  const handleClear = () => {
    setFormData({
      resourceType: '',
      resourceName: '',
      assignedTo: '',
      startDate: '',
      endDate: '',
      notes: '',
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
      <h3 className="text-lg font-semibold mb-3">Available Resources</h3>
      <div className="space-y-2">
        {mockResources.map((resource) => (
          <Card
            key={resource.id}
            className={`cursor-pointer transition-colors hover:bg-accent ${
              selectedResource?.id === resource.id ? 'bg-accent border-primary' : ''
            }`}
            onClick={() => setSelectedResource(resource)}
          >
            <CardContent className="p-4 flex items-center gap-3">
              {getResourceIcon(resource.type)}
              <div>
                <p className="font-medium">{resource.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{resource.type}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );

  // Right Panel: Resource Details Form
  const rightPanel = (
    <>
      <h3 className="text-lg font-semibold mb-3">Resource Details</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="resourceType">Resource Type</Label>
          <Select
            value={formData.resourceType}
            onValueChange={(value) => setFormData({ ...formData, resourceType: value })}
          >
            <SelectTrigger id="resourceType">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vehicle">Vehicle</SelectItem>
              <SelectItem value="driver">Driver</SelectItem>
              <SelectItem value="crew">Crew</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="resourceName">Resource Name</Label>
          <Input
            id="resourceName"
            placeholder="Enter resource name"
            value={formData.resourceName}
            onChange={(e) => setFormData({ ...formData, resourceName: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="assignedTo">Assigned To</Label>
          <Input
            id="assignedTo"
            placeholder="Trip or order ID"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            placeholder="Additional notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
      </div>
    </>
  );

  // Footer Actions
  const footer = (
    <>
      <Button variant="outline" onClick={handleClear}>
        Clear
      </Button>
      <Button onClick={handleSave}>
        Assign Resource
      </Button>
    </>
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
