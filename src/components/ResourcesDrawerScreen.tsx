import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Truck, User, Users, Wrench, Plus, X } from 'lucide-react';

interface Resource {
  id: string;
  type: 'vehicle' | 'driver' | 'crew' | 'equipment';
  name: string;
  details: string;
}

export const ResourcesDrawerScreen = () => {
  const [resources, setResources] = useState<Resource[]>([
    { id: '1', type: 'vehicle', name: 'Vehicle-001', details: 'Truck - 10 TON' },
    { id: '2', type: 'driver', name: 'John Doe', details: 'License: ABC123' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newResource, setNewResource] = useState({
    type: 'vehicle' as Resource['type'],
    name: '',
    details: '',
  });

  const handleAddResource = () => {
    if (newResource.name && newResource.details) {
      setResources([
        ...resources,
        {
          id: Date.now().toString(),
          ...newResource,
        },
      ]);
      setNewResource({ type: 'vehicle', name: '', details: '' });
      setShowAddForm(false);
    }
  };

  const handleRemoveResource = (id: string) => {
    setResources(resources.filter((r) => r.id !== id));
  };

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'vehicle':
        return <Truck className="h-4 w-4" />;
      case 'driver':
        return <User className="h-4 w-4" />;
      case 'crew':
        return <Users className="h-4 w-4" />;
      case 'equipment':
        return <Wrench className="h-4 w-4" />;
    }
  };

  const getResourceColor = (type: Resource['type']) => {
    switch (type) {
      case 'vehicle':
        return 'bg-blue-50 text-blue-600';
      case 'driver':
        return 'bg-green-50 text-green-600';
      case 'crew':
        return 'bg-purple-50 text-purple-600';
      case 'equipment':
        return 'bg-amber-50 text-amber-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Allocated Resources */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Allocated Resources</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-4">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Resource Type</Label>
                <Select
                  value={newResource.type}
                  onValueChange={(value: Resource['type']) =>
                    setNewResource({ ...newResource, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vehicle">Vehicle</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="crew">Crew</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Name/ID</Label>
                <Input
                  placeholder="Enter name or ID"
                  value={newResource.name}
                  onChange={(e) =>
                    setNewResource({ ...newResource, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Details</Label>
                <Input
                  placeholder="Enter details"
                  value={newResource.details}
                  onChange={(e) =>
                    setNewResource({ ...newResource, details: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddResource} className="flex-1">
                  Assign
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {resources.map((resource) => (
            <Card key={resource.id} className="border-l-4 border-l-primary">
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-lg ${getResourceColor(resource.type)}`}>
                      {getResourceIcon(resource.type)}
                    </div>
                    <div>
                      <h4 className="font-medium capitalize">{resource.type}</h4>
                      <p className="text-sm text-muted-foreground">{resource.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {resource.details}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveResource(resource.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Summary */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Resource Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{resources.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Estimated Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">USD 400</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
