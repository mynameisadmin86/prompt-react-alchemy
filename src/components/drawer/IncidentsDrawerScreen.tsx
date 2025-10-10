import React, { useState } from 'react';
import { DrawerLayout } from './DrawerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit, Trash2, Calendar, Clock, Maximize2, Copy, Download } from 'lucide-react';

interface IncidentsDrawerScreenProps {
  onClose: () => void;
}

interface Incident {
  id: string;
  status: 'Open' | 'In Progress' | 'Closed';
}

export const IncidentsDrawerScreen: React.FC<IncidentsDrawerScreenProps> = ({ onClose }) => {
  const [incidents, setIncidents] = useState<Incident[]>([
    { id: 'INC000001', status: 'Open' },
    { id: 'INC000001', status: 'In Progress' },
    { id: 'INC000001', status: 'Open' },
    { id: 'INC000001', status: 'Closed' },
    { id: 'INC000001', status: 'Open' },
  ]);

  const [selectedIncident, setSelectedIncident] = useState<string>('INC000001');
  const [formData, setFormData] = useState({
    incidentId: 'TRIP00000001',
    incidentStatus: '',
    incidentType: '',
    incidentDate: '',
    incidentTime: '',
    placeOfIncident: '',
    createdDate: '',
    weatherCondition: '',
    driverFault: '',
    vehicleFault: '',
    detailedDescription: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveIncident = () => {
    console.log('Saving incident:', formData);
    // API call here
  };

  const handleDeleteIncident = (id: string) => {
    setIncidents(prev => prev.filter(inc => inc.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'In Progress': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'Closed': return 'bg-green-100 text-green-800 hover:bg-green-100';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const leftPanel = (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">All Incidents</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-2 overflow-y-auto flex-1">
        {incidents.map((incident, index) => (
          <Card 
            key={`${incident.id}-${index}`}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedIncident === incident.id ? 'border-primary' : ''
            }`}
            onClick={() => setSelectedIncident(incident.id)}
          >
            <CardContent className="p-3 flex items-center justify-between">
              <span className="text-sm font-medium">{incident.id}</span>
              <div className="flex items-center gap-2">
                <Badge className={`${getStatusColor(incident.status)} text-xs`}>
                  {incident.status}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteIncident(incident.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const rightPanel = (
    <div className="h-full overflow-y-auto">
      <div className="space-y-4">
        {/* Header with Incident ID and Actions */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Incident</span>
            <Badge variant="outline" className="text-xs bg-blue-50">
              {formData.incidentId}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Top Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="incidentId" className="text-xs">
              Incident ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="incidentId"
              value={formData.incidentId}
              onChange={(e) => handleInputChange('incidentId', e.target.value)}
              placeholder="Enter incident ID"
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="incidentStatus" className="text-xs">
              Incident Status <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.incidentStatus} onValueChange={(value) => handleInputChange('incidentStatus', value)}>
              <SelectTrigger id="incidentStatus" className="h-9">
                <SelectValue placeholder="Select Incident Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Accordion Sections */}
        <Accordion type="multiple" defaultValue={['incident-details']} className="w-full">
          {/* Incident Details Section */}
          <AccordionItem value="incident-details">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-orange-100 flex items-center justify-center">
                  🚗
                </div>
                Incident Details
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="incidentType" className="text-xs">
                    Incident Type <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.incidentType} onValueChange={(value) => handleInputChange('incidentType', value)}>
                    <SelectTrigger id="incidentType" className="h-9">
                      <SelectValue placeholder="Select Incident Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accident">Accident</SelectItem>
                      <SelectItem value="breakdown">Breakdown</SelectItem>
                      <SelectItem value="delay">Delay</SelectItem>
                      <SelectItem value="theft">Theft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="incidentDate" className="text-xs">
                    Incident Date <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="incidentDate"
                      type="date"
                      value={formData.incidentDate}
                      onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                      className="h-9"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="incidentTime" className="text-xs">
                    Incident Time <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="incidentTime"
                      type="time"
                      value={formData.incidentTime}
                      onChange={(e) => handleInputChange('incidentTime', e.target.value)}
                      className="h-9"
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="placeOfIncident" className="text-xs">
                    Place of Incident
                  </Label>
                  <Select value={formData.placeOfIncident} onValueChange={(value) => handleInputChange('placeOfIncident', value)}>
                    <SelectTrigger id="placeOfIncident" className="h-9">
                      <SelectValue placeholder="Select Place of Inc." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="highway">Highway</SelectItem>
                      <SelectItem value="city">City</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="createdDate" className="text-xs">
                    Created Date
                  </Label>
                  <div className="relative">
                    <Input
                      id="createdDate"
                      type="date"
                      value={formData.createdDate}
                      onChange={(e) => handleInputChange('createdDate', e.target.value)}
                      className="h-9"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="weatherCondition" className="text-xs">
                    Weather Condition
                  </Label>
                  <Select value={formData.weatherCondition} onValueChange={(value) => handleInputChange('weatherCondition', value)}>
                    <SelectTrigger id="weatherCondition" className="h-9">
                      <SelectValue placeholder="Select Weather Con." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clear">Clear</SelectItem>
                      <SelectItem value="rainy">Rainy</SelectItem>
                      <SelectItem value="foggy">Foggy</SelectItem>
                      <SelectItem value="snowy">Snowy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="driverFault" className="text-xs">
                    Driver Fault
                  </Label>
                  <Select value={formData.driverFault} onValueChange={(value) => handleInputChange('driverFault', value)}>
                    <SelectTrigger id="driverFault" className="h-9">
                      <SelectValue placeholder="Select Driver Fault" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="vehicleFault" className="text-xs">
                    Vehicle Fault
                  </Label>
                  <Select value={formData.vehicleFault} onValueChange={(value) => handleInputChange('vehicleFault', value)}>
                    <SelectTrigger id="vehicleFault" className="h-9">
                      <SelectValue placeholder="Select Vehicle Fault" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="detailedDescription" className="text-xs">
                    Detailed Description
                  </Label>
                  <Textarea
                    id="detailedDescription"
                    value={formData.detailedDescription}
                    onChange={(e) => handleInputChange('detailedDescription', e.target.value)}
                    placeholder="Enter Description"
                    className="min-h-[80px] resize-none"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Maintenance Details Section */}
          <AccordionItem value="maintenance-details">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-purple-100 flex items-center justify-center">
                  🔧
                </div>
                Maintenance Details
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="col-span-2 text-sm text-muted-foreground">
                  Maintenance details will be displayed here...
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* More Details Section */}
          <AccordionItem value="more-details">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-pink-100 flex items-center justify-center">
                  📄
                </div>
                More Details
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="col-span-2 text-sm text-muted-foreground">
                  Additional details will be displayed here...
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Work Order Details Section */}
          <AccordionItem value="work-order-details">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-green-100 flex items-center justify-center">
                  📋
                </div>
                Work Order Details
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="col-span-2 text-sm text-muted-foreground">
                  Work order details will be displayed here...
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Claim Details Section */}
          <AccordionItem value="claim-details">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-teal-100 flex items-center justify-center">
                  💰
                </div>
                Claim Details
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="col-span-2 text-sm text-muted-foreground">
                  Claim details will be displayed here...
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );

  const footer = (
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={handleSaveIncident}>
        Save Incident
      </Button>
    </div>
  );

  return (
    <DrawerLayout
      title="Incident Management"
      leftPanel={leftPanel}
      rightPanel={rightPanel}
      footer={footer}
      onClose={onClose}
    />
  );
};
