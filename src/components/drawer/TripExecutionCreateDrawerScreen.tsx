import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, Plus, User, FileText, MapPin, Truck, Package, Calendar, Info, Trash2, RefreshCw, Send, AlertCircle, Download, Filter, CheckSquare, MoreVertical, Container, Box, Boxes, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TripExecutionCreateDrawerScreenProps {
  onClose: () => void;
  tripId?: string;
}

interface Leg {
  id: string;
  legNumber: number;
  from: string;
  to: string;
  type: 'Pickup' | 'Bhub' | 'Via';
  typeColor: string;
  planned: number;
  actual: number;
  customer: string;
  consignment: string;
  hasInfo?: boolean;
  statusIcon?: 'success' | 'warning';
}

interface Activity {
  id: string;
  name: string;
  icon: React.ReactNode;
  timestamp: string;
  delayInfo?: string;
  fields: {
    revisedDateTime?: string;
    actualDateTime: string;
    lastLocation?: string;
    lastDateTime?: string;
    reasonForChanges: string;
    delayedReason?: string;
  };
}

interface AdditionalActivity {
  id: string;
  name: string;
  icon: React.ReactNode;
  timestamp: string;
  fields: {
    sequence: string;
    category: string;
    fromLocation: string;
    toLocation: string;
    activity: string;
    revisedDateTime: string;
    actualDateTime: string;
    reasonForChanges: string;
  };
}

export const TripExecutionCreateDrawerScreen: React.FC<TripExecutionCreateDrawerScreenProps> = ({
  onClose,
  tripId = 'TRIP00000001'
}) => {
  const [expandedActivities, setExpandedActivities] = useState(true);
  const [expandedAdditional, setExpandedAdditional] = useState(false);
  const [expandedPlanned, setExpandedPlanned] = useState(true);
  const [expandedActuals, setExpandedActuals] = useState(true);
  const [pickupComplete, setPickupComplete] = useState(false);

  const legs: Leg[] = [
    {
      id: '1',
      legNumber: 1,
      from: 'Berlin',
      to: 'Berlin',
      type: 'Pickup',
      typeColor: 'bg-blue-500',
      planned: 20,
      actual: 20,
      customer: 'ABC Customer',
      consignment: 'CO00000001',
      hasInfo: true,
      statusIcon: 'success'
    },
    {
      id: '2',
      legNumber: 2,
      from: 'Berlin',
      to: 'Paris',
      type: 'Bhub',
      typeColor: 'bg-cyan-500',
      planned: 20,
      actual: 20,
      customer: 'Multiple',
      consignment: 'Multiple',
      hasInfo: true
    },
    {
      id: '3',
      legNumber: 3,
      from: 'Frankfurt',
      to: 'Paris',
      type: 'Bhub',
      typeColor: 'bg-cyan-500',
      planned: 20,
      actual: 20,
      customer: 'Multiple',
      consignment: 'Multiple',
      hasInfo: true
    }
  ];

  const activities: Activity[] = [
    {
      id: 'arrived',
      name: 'Arrived at Destination',
      icon: <MapPin className="h-4 w-4" />,
      timestamp: '25-Mar-2025 10:10 AM',
      delayInfo: '1d 2h 45m Delayed',
      fields: {
        revisedDateTime: '25-Mar-2025 10:20 AM',
        actualDateTime: '25-Mar-2025 10:20 AM',
        lastLocation: '25-Mar-2025 10:20 AM',
        lastDateTime: '25-Mar-2025 10:20 AM',
        reasonForChanges: 'SevenLRC',
        delayedReason: 'SevenLRC'
      }
    },
    {
      id: 'loaded',
      name: 'Loaded',
      icon: <Package className="h-4 w-4" />,
      timestamp: '25-Mar-2025 11:20 AM',
      fields: {
        revisedDateTime: '25-Mar-2025 10:20 AM',
        actualDateTime: '25-Mar-2025 10:20 AM',
        lastLocation: '25-Mar-2025 10:20 AM',
        lastDateTime: '25-Mar-2025 10:20 AM',
        reasonForChanges: 'SevenLRC',
        delayedReason: 'SevenLRC'
      }
    },
    {
      id: 'departed',
      name: 'Departed at Source',
      icon: <Truck className="h-4 w-4" />,
      timestamp: '25-Mar-2025 09:11 AM',
      fields: {
        revisedDateTime: '25-Mar-2025 10:20 AM',
        actualDateTime: '25-Mar-2025 10:20 AM',
        lastLocation: '25-Mar-2025 10:20 AM',
        lastDateTime: '25-Mar-2025 10:20 AM',
        reasonForChanges: 'SevenLRC',
        delayedReason: 'SevenLRC'
      }
    }
  ];

  const additionalActivities: AdditionalActivity[] = [
    {
      id: 'repair',
      name: 'Repair',
      icon: <Info className="h-4 w-4" />,
      timestamp: '25-Mar-2025 10:10 AM',
      fields: {
        sequence: '1',
        category: 'SevenLRC',
        fromLocation: 'Pickup',
        toLocation: 'Pickup',
        activity: 'Pickup',
        revisedDateTime: '25-Mar-2025 10:20 AM',
        actualDateTime: '25-Mar-2025 10:20 AM',
        reasonForChanges: 'SevenLRC'
      }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full bg-background"
    >
      {/* Left Sidebar */}
      <div className="w-64 border-r bg-muted/30 flex flex-col">
        {/* Version Selection */}
        <div className="p-4 border-b space-y-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Version No.</Label>
            <Select defaultValue="v1">
              <SelectTrigger>
                <SelectValue placeholder="Select Version No." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="v1">Version 1</SelectItem>
                <SelectItem value="v2">Version 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Total Legs */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              Total Legs
              <Badge variant="secondary" className="rounded-full h-5 w-5 p-0 flex items-center justify-center text-xs">
                {legs.length}
              </Badge>
            </h3>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Legs List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-2">
            {legs.map((leg) => (
              <div
                key={leg.id}
                className="p-3 rounded-md border bg-card hover:bg-accent/50 transition-colors cursor-pointer space-y-2"
              >
                {/* Leg Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {leg.legNumber}: {leg.from} → {leg.to}
                      </span>
                      {leg.hasInfo && (
                        <Info className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {leg.planned} Planned/{leg.actual} Actuals
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={cn("text-xs", leg.typeColor, "text-white")}>
                      {leg.type}
                    </Badge>
                    {leg.statusIcon === 'success' && (
                      <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer & Consignment */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{leg.customer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{leg.consignment}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <Tabs defaultValue="activities" className="flex-1 flex flex-col">
          <div className="border-b px-6 pt-4">
            <TabsList className="h-10">
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="consignment">Consignment</TabsTrigger>
              <TabsTrigger value="transshipment">Transshipment</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="activities" className="flex-1 flex flex-col m-0">
            {/* Activities Header */}
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Activities Details</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Activities
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <User className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>

            {/* Activities Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* Activities Section */}
              <div className="space-y-3">
                <div 
                  className="flex items-center justify-between cursor-pointer p-2 -mx-2 rounded hover:bg-muted/50"
                  onClick={() => setExpandedActivities(!expandedActivities)}
                >
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    Activities
                    <Badge variant="secondary" className="rounded-full h-5 px-2 text-xs">
                      {activities.length}
                    </Badge>
                  </h3>
                  {expandedActivities ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                {/* Activities List */}
                <AnimatePresence>
                  {expandedActivities && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3 overflow-hidden"
                    >
                      {activities.map((activity) => (
                        <div key={activity.id} className="border rounded-lg bg-card">
                          {/* Activity Header */}
                          <div className="flex items-center justify-between p-4 bg-muted/30">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded bg-blue-500/10 text-blue-600">
                                {activity.icon}
                              </div>
                              <div>
                                <div className="font-medium text-sm">{activity.name}</div>
                                <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {activity.delayInfo && (
                                <Badge variant="destructive" className="text-xs">
                                  {activity.delayInfo}
                                </Badge>
                              )}
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Activity Details - Always Visible */}
                          <div className="px-4 pb-4 pt-4 border-t space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                          {activity.fields.revisedDateTime && (
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">
                                Revised Date and Time
                              </Label>
                              <div className="relative">
                                <Input
                                  defaultValue={activity.fields.revisedDateTime}
                                  className="pr-8 text-sm h-9"
                                />
                                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                              </div>
                            </div>
                          )}
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                              Actual Date and Time <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                              <Input
                                defaultValue={activity.fields.actualDateTime}
                                className="pr-8 text-sm h-9"
                              />
                              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            </div>
                          </div>
                          {activity.fields.lastLocation && (
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">
                                Last Identified Location
                              </Label>
                              <div className="relative">
                                <Input
                                  defaultValue={activity.fields.lastLocation}
                                  className="pr-8 text-sm h-9"
                                />
                                <MapPin className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                              </div>
                            </div>
                          )}
                          {activity.fields.lastDateTime && (
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">
                                Last Identified Date and Time
                              </Label>
                              <div className="relative">
                                <Input
                                  defaultValue={activity.fields.lastDateTime}
                                  className="pr-8 text-sm h-9"
                                />
                                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                              Reason for Changes
                            </Label>
                            <Select defaultValue={activity.fields.reasonForChanges}>
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="SevenLRC">SevenLRC</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {activity.fields.delayedReason && (
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">
                                Delayed Reason
                              </Label>
                              <Select defaultValue={activity.fields.delayedReason}>
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SevenLRC">SevenLRC</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Additional Activities Section */}
          <div className="space-y-3">
                <div
                  className="flex items-center justify-between cursor-pointer p-2 -mx-2 rounded hover:bg-muted/50"
                  onClick={() => setExpandedAdditional(!expandedAdditional)}
                >
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    Additional Activities
                    <Badge variant="secondary" className="rounded-full h-5 px-2 text-xs">
                      {additionalActivities.length}
                    </Badge>
                  </h3>
                  {expandedAdditional ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <AnimatePresence>
                  {expandedAdditional && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                      {additionalActivities.map((activity) => (
                        <div key={activity.id} className="border rounded-lg bg-card p-4 space-y-4">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded bg-blue-500/10 text-blue-600">
                                {activity.icon}
                              </div>
                              <div>
                                <div className="font-medium text-sm">{activity.name}</div>
                                <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Fields */}
                          <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Sequence</Label>
                              <Input defaultValue={activity.fields.sequence} className="h-9" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Category</Label>
                              <div className="relative">
                                <Input defaultValue={activity.fields.category} className="pr-8 h-9" />
                                <MapPin className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">From Location</Label>
                              <Select defaultValue={activity.fields.fromLocation}>
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pickup">Pickup</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">To Location</Label>
                              <Select defaultValue={activity.fields.toLocation}>
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pickup">Pickup</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Activity (Event)</Label>
                              <Select defaultValue={activity.fields.activity}>
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pickup">Pickup</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Revised Date and Time</Label>
                              <div className="relative">
                                <Input defaultValue={activity.fields.revisedDateTime} className="pr-8 h-9" />
                                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">
                                Actual Date and Time <span className="text-red-500">*</span>
                              </Label>
                              <div className="relative">
                                <Input defaultValue={activity.fields.actualDateTime} className="pr-8 h-9" />
                                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Reason for Changes</Label>
                              <Select defaultValue={activity.fields.reasonForChanges}>
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SevenLRC">SevenLRC</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="consignment" className="flex-1 flex flex-col m-0">
            {/* Alert */}
            <div className="px-6 pt-4">
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 text-sm ml-2">
                  Kindly take note that the Actual {'<<'} weight/length/wagon quantity {'>>'}  is higher than the allowed limit. Please check path constraints for more details.
                </AlertDescription>
              </Alert>
            </div>

            {/* Consignment Details Header */}
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Consignment Details</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Actuals
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>

            {/* Consignment Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* Consignment Selection */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Select defaultValue="CO000000001">
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CO000000001">CO000000001</SelectItem>
                      <SelectItem value="CO000000002">CO000000002</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="pickup-complete" 
                    checked={pickupComplete}
                    onCheckedChange={(checked) => setPickupComplete(checked as boolean)}
                  />
                  <Label htmlFor="pickup-complete" className="text-sm cursor-pointer">
                    Pickup Complete for this CO
                  </Label>
                </div>
              </div>

              {/* Planned Section */}
              <div className="space-y-3">
                <div 
                  className="flex items-center justify-between cursor-pointer p-2 -mx-2 rounded hover:bg-muted/50"
                  onClick={() => setExpandedPlanned(!expandedPlanned)}
                >
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    Planned
                    <Badge variant="secondary" className="rounded-full h-5 px-2 text-xs">
                      5
                    </Badge>
                  </h3>
                  {expandedPlanned ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <AnimatePresence>
                  {expandedPlanned && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 overflow-hidden"
                    >
                      {/* Stat Cards */}
                      <div className="grid grid-cols-4 gap-3">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-blue-100">
                              <Truck className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-lg font-semibold">12 Nos</div>
                              <div className="text-xs text-muted-foreground">Wagon Quantity</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-purple-100">
                              <Container className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="text-lg font-semibold">12 Nos</div>
                              <div className="text-xs text-muted-foreground">Container Quantity</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-red-100">
                              <Box className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <div className="text-lg font-semibold">23 Ton</div>
                              <div className="text-xs text-muted-foreground">Product Weight</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-cyan-50 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-cyan-100">
                              <Boxes className="h-5 w-5 text-cyan-600" />
                            </div>
                            <div>
                              <div className="text-lg font-semibold">10 Nos</div>
                              <div className="text-xs text-muted-foreground">THU Quantity</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Plan List Table */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold">Plan List</h4>
                        
                        {/* Table Toolbar */}
                        <div className="flex items-center justify-between">
                          <div className="relative flex-1 max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Search" 
                              className="pl-9 h-9"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-9 w-9">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                              <Filter className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                              <CheckSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Table */}
                        <div className="border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Wagon ID Type</TableHead>
                                <TableHead>Container ID Type</TableHead>
                                <TableHead>Hazardous Goods</TableHead>
                                <TableHead>Departure and Arrival</TableHead>
                                <TableHead>Plan From & To Date</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="w-12"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium text-blue-600">WAG00000001</div>
                                  <div className="text-xs text-muted-foreground">Habbins</div>
                                </TableCell>
                                <TableCell>
                                  <div>CONT100001</div>
                                  <div className="text-xs text-muted-foreground">Container A</div>
                                </TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>Frankfurt Station A - Frankfurt Station B</TableCell>
                                <TableCell>12-Mar-2025 to 12-Mar-2025</TableCell>
                                <TableCell>€ 1395.00</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium text-blue-600">WAG00000001</div>
                                  <div className="text-xs text-muted-foreground">Habbins</div>
                                </TableCell>
                                <TableCell>
                                  <div>CONT100001</div>
                                  <div className="text-xs text-muted-foreground">Container A</div>
                                </TableCell>
                                <TableCell>
                                  <div className="h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center">
                                    <AlertCircle className="h-3 w-3 text-white" />
                                  </div>
                                </TableCell>
                                <TableCell>Frankfurt Station A - Frankfurt Station B</TableCell>
                                <TableCell>12-Mar-2025 to 12-Mar-2025</TableCell>
                                <TableCell>€ 1395.00</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium text-blue-600">WAG00000001</div>
                                  <div className="text-xs text-muted-foreground">Habbins</div>
                                </TableCell>
                                <TableCell>
                                  <div>CONT100001</div>
                                  <div className="text-xs text-muted-foreground">Container A</div>
                                </TableCell>
                                <TableCell>
                                  <div className="h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center">
                                    <AlertCircle className="h-3 w-3 text-white" />
                                  </div>
                                </TableCell>
                                <TableCell>Frankfurt Station A - Frankfurt Station B</TableCell>
                                <TableCell>12-Mar-2025 to 12-Mar-2025</TableCell>
                                <TableCell>€ 1395.00</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <ChevronDown className="h-4 w-4 rotate-90" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <ChevronDown className="h-4 w-4 -rotate-90" />
                            </Button>
                            <Button variant="default" size="sm" className="h-8 w-8 p-0">1</Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">2</Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">3</Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">4</Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">5</Button>
                            <span className="text-muted-foreground">...</span>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">10</Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <ChevronDown className="h-4 w-4 -rotate-90" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <ChevronDown className="h-4 w-4 rotate-90" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Go to</span>
                            <Input className="h-8 w-16 text-center" defaultValue="12" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actuals Section */}
              <div className="space-y-3">
                <div 
                  className="flex items-center justify-between cursor-pointer p-2 -mx-2 rounded hover:bg-muted/50"
                  onClick={() => setExpandedActuals(!expandedActuals)}
                >
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    Actuals
                    <Badge variant="secondary" className="rounded-full h-5 px-2 text-xs">
                      5
                    </Badge>
                  </h3>
                  {expandedActuals ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <AnimatePresence>
                  {expandedActuals && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 overflow-hidden"
                    >
                      {/* Stat Cards */}
                      <div className="grid grid-cols-4 gap-3">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-blue-100">
                              <Truck className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-lg font-semibold">12 Nos</div>
                              <div className="text-xs text-muted-foreground">Wagon Quantity</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-purple-100">
                              <Container className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="text-lg font-semibold">12 Nos</div>
                              <div className="text-xs text-muted-foreground">Container Quantity</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-red-100">
                              <Box className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <div className="text-lg font-semibold">23 Ton</div>
                              <div className="text-xs text-muted-foreground">Product Weight</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-cyan-50 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-cyan-100">
                              <Boxes className="h-5 w-5 text-cyan-600" />
                            </div>
                            <div>
                              <div className="text-lg font-semibold">10 Nos</div>
                              <div className="text-xs text-muted-foreground">THU Quantity</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actual List Table */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold">Actual List</h4>
                        
                        {/* Table Toolbar */}
                        <div className="flex items-center justify-between">
                          <div className="relative flex-1 max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Search" 
                              className="pl-9 h-9"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-9 w-9">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                              <Filter className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                              <CheckSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Table */}
                        <div className="border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Wagon ID Type</TableHead>
                                <TableHead>Container ID Type</TableHead>
                                <TableHead>Hazardous Goods</TableHead>
                                <TableHead>Departure and Arrival</TableHead>
                                <TableHead>Plan From & To Date</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="w-12"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium text-blue-600">WAG00000001</div>
                                  <div className="text-xs text-muted-foreground">Habbins</div>
                                </TableCell>
                                <TableCell>
                                  <div>CONT100001</div>
                                  <div className="text-xs text-muted-foreground">Container A</div>
                                </TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>Frankfurt Station A - Frankfurt Station B</TableCell>
                                <TableCell>12-Mar-2025 to 12-Mar-2025</TableCell>
                                <TableCell>€ 1395.00</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium text-blue-600">WAG00000001</div>
                                  <div className="text-xs text-muted-foreground">Habbins</div>
                                </TableCell>
                                <TableCell>
                                  <div>CONT100001</div>
                                  <div className="text-xs text-muted-foreground">Container A</div>
                                </TableCell>
                                <TableCell>
                                  <div className="h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center">
                                    <AlertCircle className="h-3 w-3 text-white" />
                                  </div>
                                </TableCell>
                                <TableCell>Frankfurt Station A - Frankfurt Station B</TableCell>
                                <TableCell>12-Mar-2025 to 12-Mar-2025</TableCell>
                                <TableCell>€ 1395.00</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium text-blue-600">WAG00000001</div>
                                  <div className="text-xs text-muted-foreground">Habbins</div>
                                </TableCell>
                                <TableCell>
                                  <div>CONT100001</div>
                                  <div className="text-xs text-muted-foreground">Container A</div>
                                </TableCell>
                                <TableCell>
                                  <div className="h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center">
                                    <AlertCircle className="h-3 w-3 text-white" />
                                  </div>
                                </TableCell>
                                <TableCell>Frankfurt Station A - Frankfurt Station B</TableCell>
                                <TableCell>12-Mar-2025 to 12-Mar-2025</TableCell>
                                <TableCell>€ 1395.00</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <ChevronDown className="h-4 w-4 rotate-90" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <ChevronDown className="h-4 w-4 -rotate-90" />
                            </Button>
                            <Button variant="default" size="sm" className="h-8 w-8 p-0">1</Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">2</Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">3</Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">4</Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">5</Button>
                            <span className="text-muted-foreground">...</span>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">10</Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <ChevronDown className="h-4 w-4 -rotate-90" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <ChevronDown className="h-4 w-4 rotate-90" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Go to</span>
                            <Input className="h-8 w-16 text-center" defaultValue="12" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transshipment" className="flex-1 p-6">
            <div className="text-center text-muted-foreground py-12">
              Transshipment content coming soon
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-card">
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" className="gap-2">
              <Send className="h-4 w-4" />
              Send Mail
            </Button>
            <Button className="gap-2">
              Save
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
