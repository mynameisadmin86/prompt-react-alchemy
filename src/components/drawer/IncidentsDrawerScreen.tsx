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
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Calendar, Clock, Maximize2, Copy, Download, Car, Wrench, FileText, Users, DollarSign } from 'lucide-react';

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
    // Maintenance Details
    maintenanceRequired: false,
    accidentType: '',
    causeCode: '',
    incidentResolution: '',
    maintenanceType: '',
    wagon: '',
    container: '',
    workType: '',
    workCategory: '',
    workGroup: '',
    maintenanceDescription: '',
    // More Details
    incidentCausedBy: '',
    incidentCauserName: '',
    incidentReportedBy: '',
    incidentCloseDate: '',
    riskInvolved: '',
    dangerousGoods: '',
    loadTime: '',
    refDocNo: '',
    mobileRefIncidentId: '',
    remarks: '',
    // Work Order Details
    workOrderNumber: 'WON00000001',
    workOrderStatus: 'In Progress',
    workRequestNumber: 'WRN00000001',
    workRequestStatus: 'Draft',
    errorMessage: 'Not Applicable',
    // Claim Details
    claimRequired: false,
    claimNo: 'CL00000001',
    claimStatus: 'Initiated',
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
        <h3 className="text-sm font-semibold text-gray-700">All Incidents</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-gray-50">
            <Edit className="h-4 w-4 text-gray-600" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-gray-50">
            <Plus className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>
      <div className="space-y-2 overflow-y-auto flex-1">
        {incidents.map((incident, index) => (
          <Card 
            key={`${incident.id}-${index}`}
            className={`cursor-pointer transition-all border border-gray-200 shadow-sm hover:shadow-md ${
              selectedIncident === incident.id ? 'border-primary bg-blue-50/50' : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedIncident(incident.id)}
          >
            <CardContent className="p-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{incident.id}</span>
              <div className="flex items-center gap-2">
                <Badge className={`${getStatusColor(incident.status)} text-xs font-medium`}>
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
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Incident</span>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {formData.incidentId}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-gray-50">
              <Copy className="h-4 w-4 text-gray-600" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-gray-50">
              <Download className="h-4 w-4 text-gray-600" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-gray-50">
              <Maximize2 className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Top Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="incidentId" className="text-xs font-medium text-gray-600">
              Incident ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="incidentId"
              value={formData.incidentId}
              onChange={(e) => handleInputChange('incidentId', e.target.value)}
              placeholder="Enter incident ID"
              className="h-9 border-gray-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="incidentStatus" className="text-xs font-medium text-gray-600">
              Incident Status <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.incidentStatus} onValueChange={(value) => handleInputChange('incidentStatus', value)}>
              <SelectTrigger id="incidentStatus" className="h-9 border-gray-200">
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
        <Accordion type="single" collapsible defaultValue="incident-details" className="w-full">
          {/* Incident Details Section */}
          <AccordionItem value="incident-details" className="border-b border-gray-200">
            <AccordionTrigger className="text-sm font-medium text-gray-700 hover:no-underline hover:bg-gray-50 px-4 py-3 rounded-md">
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-orange-500" />
                Incident Details
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <div className="grid grid-cols-5 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="incidentType" className="text-xs font-medium text-gray-600">
                    Incident Type <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.incidentType} onValueChange={(value) => handleInputChange('incidentType', value)}>
                    <SelectTrigger id="incidentType" className="h-9 border-gray-200">
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
                  <Label htmlFor="incidentDate" className="text-xs font-medium text-gray-600">
                    Incident Date <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="incidentDate"
                      type="date"
                      value={formData.incidentDate}
                      onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                      className="h-9 border-gray-200"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="incidentTime" className="text-xs font-medium text-gray-600">
                    Incident Time <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="incidentTime"
                      type="time"
                      value={formData.incidentTime}
                      onChange={(e) => handleInputChange('incidentTime', e.target.value)}
                      className="h-9 border-gray-200"
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="placeOfIncident" className="text-xs font-medium text-gray-600">
                    Place of Incident
                  </Label>
                  <Select value={formData.placeOfIncident} onValueChange={(value) => handleInputChange('placeOfIncident', value)}>
                    <SelectTrigger id="placeOfIncident" className="h-9 border-gray-200">
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
                  <Label htmlFor="createdDate" className="text-xs font-medium text-gray-600">
                    Created Date
                  </Label>
                  <div className="relative">
                    <Input
                      id="createdDate"
                      type="date"
                      value={formData.createdDate}
                      onChange={(e) => handleInputChange('createdDate', e.target.value)}
                      className="h-9 border-gray-200"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="weatherCondition" className="text-xs font-medium text-gray-600">
                    Weather Condition
                  </Label>
                  <Select value={formData.weatherCondition} onValueChange={(value) => handleInputChange('weatherCondition', value)}>
                    <SelectTrigger id="weatherCondition" className="h-9 border-gray-200">
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
                  <Label htmlFor="driverFault" className="text-xs font-medium text-gray-600">
                    Driver Fault
                  </Label>
                  <Select value={formData.driverFault} onValueChange={(value) => handleInputChange('driverFault', value)}>
                    <SelectTrigger id="driverFault" className="h-9 border-gray-200">
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
                  <Label htmlFor="vehicleFault" className="text-xs font-medium text-gray-600">
                    Vehicle Fault
                  </Label>
                  <Select value={formData.vehicleFault} onValueChange={(value) => handleInputChange('vehicleFault', value)}>
                    <SelectTrigger id="vehicleFault" className="h-9 border-gray-200">
                      <SelectValue placeholder="Select Vehicle Fault" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-5 space-y-1.5">
                  <Label htmlFor="detailedDescription" className="text-xs font-medium text-gray-600">
                    Detailed Description
                  </Label>
                  <Textarea
                    id="detailedDescription"
                    value={formData.detailedDescription}
                    onChange={(e) => handleInputChange('detailedDescription', e.target.value)}
                    placeholder="Enter Description"
                    className="min-h-[80px] resize-none border-gray-200"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Maintenance Details Section */}
          <AccordionItem value="maintenance-details" className="border-b border-gray-200">
            <AccordionTrigger className="text-sm font-medium text-gray-700 hover:no-underline hover:bg-gray-50 px-4 py-3 rounded-md">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-purple-500" />
                Maintenance Details
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="maintenanceRequired"
                    checked={formData.maintenanceRequired}
                    onCheckedChange={(checked) => handleInputChange('maintenanceRequired', checked.toString())}
                  />
                  <Label htmlFor="maintenanceRequired" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Maintenance Required
                  </Label>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="accidentType" className="text-xs font-medium text-gray-600">
                      Accident Type <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.accidentType} onValueChange={(value) => handleInputChange('accidentType', value)}>
                      <SelectTrigger id="accidentType" className="h-9 border-gray-200">
                        <SelectValue placeholder="Select Accident Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="collision">Collision</SelectItem>
                        <SelectItem value="rollover">Rollover</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="causeCode" className="text-xs font-medium text-gray-600">
                      Cause Code <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.causeCode} onValueChange={(value) => handleInputChange('causeCode', value)}>
                      <SelectTrigger id="causeCode" className="h-9 border-gray-200">
                        <SelectValue placeholder="Select Cause Code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mechanical">Mechanical Failure</SelectItem>
                        <SelectItem value="driver-error">Driver Error</SelectItem>
                        <SelectItem value="weather">Weather Related</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="incidentResolution" className="text-xs font-medium text-gray-600">
                      Incident Resolution <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="incidentResolution"
                      value={formData.incidentResolution}
                      onChange={(e) => handleInputChange('incidentResolution', e.target.value)}
                      placeholder="Enter Incident Resolution"
                      className="h-9 border-gray-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="maintenanceType" className="text-xs font-medium text-gray-600">
                      Maintenance Type
                    </Label>
                    <Select value={formData.maintenanceType} onValueChange={(value) => handleInputChange('maintenanceType', value)}>
                      <SelectTrigger id="maintenanceType" className="h-9 border-gray-200">
                        <SelectValue placeholder="Select Maint. Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preventive">Preventive</SelectItem>
                        <SelectItem value="corrective">Corrective</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="wagon" className="text-xs font-medium text-gray-600">
                      Wagon <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="wagon"
                      value={formData.wagon}
                      onChange={(e) => handleInputChange('wagon', e.target.value)}
                      placeholder="Enter Wagon"
                      className="h-9 border-gray-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="container" className="text-xs font-medium text-gray-600">
                      Container <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="container"
                      value={formData.container}
                      onChange={(e) => handleInputChange('container', e.target.value)}
                      placeholder="Enter Container"
                      className="h-9 border-gray-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="workType" className="text-xs font-medium text-gray-600">
                      Work Type <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.workType} onValueChange={(value) => handleInputChange('workType', value)}>
                      <SelectTrigger id="workType" className="h-9 border-gray-200">
                        <SelectValue placeholder="Select Work Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="replacement">Replacement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="workCategory" className="text-xs font-medium text-gray-600">
                      Work Category <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.workCategory} onValueChange={(value) => handleInputChange('workCategory', value)}>
                      <SelectTrigger id="workCategory" className="h-9 border-gray-200">
                        <SelectValue placeholder="Select Work Categ." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mechanical">Mechanical</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="structural">Structural</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="workGroup" className="text-xs font-medium text-gray-600">
                      Work Group <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.workGroup} onValueChange={(value) => handleInputChange('workGroup', value)}>
                      <SelectTrigger id="workGroup" className="h-9 border-gray-200">
                        <SelectValue placeholder="Select Work Group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-5 space-y-1.5">
                    <Label htmlFor="maintenanceDescription" className="text-xs font-medium text-gray-600">
                      Maintenance Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="maintenanceDescription"
                      value={formData.maintenanceDescription}
                      onChange={(e) => handleInputChange('maintenanceDescription', e.target.value)}
                      placeholder="Enter Maintenance Desc."
                      className="min-h-[80px] resize-none border-gray-200"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* More Details Section */}
          <AccordionItem value="more-details" className="border-b border-gray-200">
            <AccordionTrigger className="text-sm font-medium text-gray-700 hover:no-underline hover:bg-gray-50 px-4 py-3 rounded-md">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-pink-500" />
                More Details
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <div className="grid grid-cols-5 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="incidentCausedBy" className="text-xs font-medium text-gray-600">
                    Incident Caused By
                  </Label>
                  <Select value={formData.incidentCausedBy} onValueChange={(value) => handleInputChange('incidentCausedBy', value)}>
                    <SelectTrigger id="incidentCausedBy" className="h-9 border-gray-200">
                      <SelectValue placeholder="Select Inc. Caused" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="driver">Driver</SelectItem>
                      <SelectItem value="vehicle">Vehicle</SelectItem>
                      <SelectItem value="external">External Factors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="incidentCauserName" className="text-xs font-medium text-gray-600">
                    Incident Causer Name
                  </Label>
                  <Select value={formData.incidentCauserName} onValueChange={(value) => handleInputChange('incidentCauserName', value)}>
                    <SelectTrigger id="incidentCauserName" className="h-9 border-gray-200">
                      <SelectValue placeholder="Select Inc. Causer Name" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-doe">John Doe</SelectItem>
                      <SelectItem value="jane-smith">Jane Smith</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="incidentReportedBy" className="text-xs font-medium text-gray-600">
                    Incident Reported By
                  </Label>
                  <Input
                    id="incidentReportedBy"
                    value={formData.incidentReportedBy}
                    onChange={(e) => handleInputChange('incidentReportedBy', e.target.value)}
                    placeholder="Enter Inc. Reported By"
                    className="h-9 border-gray-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="incidentCloseDate" className="text-xs font-medium text-gray-600">
                    Incident Close Date
                  </Label>
                  <div className="relative">
                    <Input
                      id="incidentCloseDate"
                      type="date"
                      value={formData.incidentCloseDate}
                      onChange={(e) => handleInputChange('incidentCloseDate', e.target.value)}
                      className="h-9 border-gray-200"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="riskInvolved" className="text-xs font-medium text-gray-600">
                    Risk Involved
                  </Label>
                  <Select value={formData.riskInvolved} onValueChange={(value) => handleInputChange('riskInvolved', value)}>
                    <SelectTrigger id="riskInvolved" className="h-9 border-gray-200">
                      <SelectValue placeholder="Select Risk Involved" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="dangerousGoods" className="text-xs font-medium text-gray-600">
                    Dangerous Goods
                  </Label>
                  <Select value={formData.dangerousGoods} onValueChange={(value) => handleInputChange('dangerousGoods', value)}>
                    <SelectTrigger id="dangerousGoods" className="h-9 border-gray-200">
                      <SelectValue placeholder="Select Danger Goods" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="loadTime" className="text-xs font-medium text-gray-600">
                    Load Time
                  </Label>
                  <Select value={formData.loadTime} onValueChange={(value) => handleInputChange('loadTime', value)}>
                    <SelectTrigger id="loadTime" className="h-9 border-gray-200">
                      <SelectValue placeholder="Select Load Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="refDocNo" className="text-xs font-medium text-gray-600">
                    Ref. Doc. No.
                  </Label>
                  <Input
                    id="refDocNo"
                    value={formData.refDocNo}
                    onChange={(e) => handleInputChange('refDocNo', e.target.value)}
                    placeholder="Enter Ref. Doc. No."
                    className="h-9 border-gray-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mobileRefIncidentId" className="text-xs font-medium text-gray-600">
                    Mobile Ref. Incident ID
                  </Label>
                  <Input
                    id="mobileRefIncidentId"
                    value={formData.mobileRefIncidentId}
                    onChange={(e) => handleInputChange('mobileRefIncidentId', e.target.value)}
                    placeholder="Enter Mobile Ref. Inc. ID"
                    className="h-9 border-gray-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="remarks" className="text-xs font-medium text-gray-600">
                    Remarks
                  </Label>
                  <Input
                    id="remarks"
                    value={formData.remarks}
                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                    placeholder="Enter Remarks"
                    className="h-9 border-gray-200"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Work Order Details Section */}
          <AccordionItem value="work-order-details" className="border-b border-gray-200">
            <AccordionTrigger className="text-sm font-medium text-gray-700 hover:no-underline hover:bg-gray-50 px-4 py-3 rounded-md">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                Work Order Details
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <div className="grid grid-cols-5 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-600">Work Order Number</Label>
                  <div className="text-sm text-primary font-medium">{formData.workOrderNumber}</div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-600">Work Order Status</Label>
                  <div className="text-sm text-gray-900">{formData.workOrderStatus}</div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-600">Work Request Number</Label>
                  <div className="text-sm text-gray-900">{formData.workRequestNumber}</div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-600">Work Request Status</Label>
                  <div className="text-sm text-gray-900">{formData.workRequestStatus}</div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-600">Error Message</Label>
                  <div className="text-sm text-gray-900">{formData.errorMessage}</div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Claim Details Section */}
          <AccordionItem value="claim-details" className="border-b border-gray-200">
            <AccordionTrigger className="text-sm font-medium text-gray-700 hover:no-underline hover:bg-gray-50 px-4 py-3 rounded-md">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-teal-500" />
                Claim Details
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="claimRequired"
                    checked={formData.claimRequired}
                    onCheckedChange={(checked) => handleInputChange('claimRequired', checked.toString())}
                  />
                  <Label htmlFor="claimRequired" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Claim Required
                  </Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-600">Claim No.</Label>
                    <div className="text-sm text-primary font-medium">{formData.claimNo}</div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-600">Claim Status</Label>
                    <div className="text-sm text-gray-900">{formData.claimStatus}</div>
                  </div>
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
      <Button variant="outline" onClick={onClose} className="hover:bg-gray-50">
        Cancel
      </Button>
      <Button onClick={handleSaveIncident} className="bg-primary hover:bg-primary/90">
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
      gridColumns="md:grid-cols-[25%_75%]"
    />
  );
};
