import React, { useState } from 'react';
import { DynamicPanel, DynamicPanelRef } from '@/components/DynamicPanel/DynamicPanel';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PanelConfig } from '@/types/dynamicPanel';
import { useTransportRouteStore } from '@/stores/transportRouteStore';
import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export const TransportRouteLegDrawer: React.FC = () => {
  const { selectedRoute, addLegPanel, removeLegPanel, updateLegData, saveRouteDetails, fetchOrigins, fetchDestinations } = useTransportRouteStore();
  const [reasonForUpdate, setReasonForUpdate] = useState('');
  const { toast } = useToast();

  if (!selectedRoute) return null;

  const handleSave = async () => {
    await saveRouteDetails();
    toast({
      title: 'Success',
      description: 'Route details saved successfully',
    });
  };

  const createLegPanelConfig = (legIndex: number): PanelConfig => {
    const leg = selectedRoute.legs?.[legIndex];
    if (!leg) return {};

    return {
      LegSequence: {
        id: 'LegSequence',
        label: 'Leg Sequence',
        fieldType: 'text',
        value: leg.LegSequence.toString(),
        mandatory: true,
        visible: true,
        editable: false,
        order: 1,
        width: 'third'
      },
      LegID: {
        id: 'LegID',
        label: 'Leg ID',
        fieldType: 'select',
        value: leg.LegID,
        mandatory: true,
        visible: true,
        editable: true,
        order: 2,
        width: 'third',
        options: [
          { label: 'LEG01', value: 'LEG01' },
          { label: 'LEG02', value: 'LEG02' },
          { label: 'LEG03', value: 'LEG03' },
          { label: 'LEG04', value: 'LEG04' }
        ],
        onChange: (value) => updateLegData(legIndex, 'LegID', value)
      },
      Origin: {
        id: 'Origin',
        label: 'Departure',
        fieldType: 'lazyselect',
        value: leg.Origin,
        mandatory: true,
        visible: true,
        editable: true,
        order: 3,
        width: 'third',
        fetchOptions: fetchOrigins,
        onChange: (value) => updateLegData(legIndex, 'Origin', value)
      },
      Destination: {
        id: 'Destination',
        label: 'Arrival',
        fieldType: 'lazyselect',
        value: leg.Destination,
        mandatory: true,
        visible: true,
        editable: true,
        order: 4,
        width: 'third',
        fetchOptions: fetchDestinations,
        onChange: (value) => updateLegData(legIndex, 'Destination', value)
      },
      LegBehaviour: {
        id: 'LegBehaviour',
        label: 'Leg Behaviour',
        fieldType: 'select',
        value: leg.LegBehaviour,
        mandatory: false,
        visible: true,
        editable: true,
        order: 5,
        width: 'third',
        options: [
          { label: 'Pickup', value: 'Pickup' },
          { label: 'Line Haul', value: 'Line Haul' },
          { label: 'Delivery', value: 'Delivery' }
        ],
        onChange: (value) => updateLegData(legIndex, 'LegBehaviour', value)
      },
      TransportMode: {
        id: 'TransportMode',
        label: 'Transport Mode',
        fieldType: 'select',
        value: leg.TransportMode,
        mandatory: true,
        visible: true,
        editable: true,
        order: 6,
        width: 'third',
        options: [
          { label: 'Rail', value: 'Rail' },
          { label: 'Road', value: 'Road' },
          { label: 'Air', value: 'Air' },
          { label: 'Sea', value: 'Sea' }
        ],
        onChange: (value) => updateLegData(legIndex, 'TransportMode', value)
      },
      TripDetails: {
        id: 'TripDetails',
        label: 'Trip Details',
        fieldType: 'text',
        value: leg.TripDetails || '',
        mandatory: false,
        visible: true,
        editable: false,
        order: 7,
        width: 'full'
      }
    };
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header Section */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Leg Details</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={addLegPanel}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Order Info */}
        <div className="flex gap-2 items-center mb-4">
          <Badge variant="outline" className="text-sm">
            {selectedRoute.CustomerOrderNo}
          </Badge>
          <Badge 
            className={
              selectedRoute.COStatus === 'Confirmed' 
                ? 'bg-green-100 text-green-800 border-green-200'
                : selectedRoute.COStatus === 'Partial-Delivered'
                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                : 'bg-gray-100 text-gray-800 border-gray-200'
            }
          >
            {selectedRoute.COStatus}
          </Badge>
        </div>

        {/* Customer & Service Info Grid */}
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Customer</p>
            <p className="font-medium">{selectedRoute.CustomerOrderNo} - {selectedRoute.customerName}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">From and To Location</p>
            <p className="font-medium">{selectedRoute.FromToLocation}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Service</p>
            <p className="font-medium">{selectedRoute.Service}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Sub-Service</p>
            <p className="font-medium">{selectedRoute.SubService}</p>
          </div>
        </div>
      </div>

      {/* Legs Section */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {selectedRoute.legs?.map((leg, index) => (
            <Card key={index} className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => removeLegPanel(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <DynamicPanel
                panelId={`leg-${index}`}
                panelTitle={`Leg Sequence`}
                panelConfig={createLegPanelConfig(index)}
                initialData={leg}
                collapsible={true}
                panelWidth="full"
                showPreview={false}
                badgeValue={leg.LegSequence.toString()}
              />

              {/* Trip Details with Badges */}
              {leg.TripDetails && (
                <div className="px-6 pb-4 text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                  <span>{leg.TripDetails}</span>
                  {leg.Status && (
                    <Badge 
                      variant="outline"
                      className={
                        leg.Status === 'Initiated' 
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : leg.Status === 'Released'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          : 'bg-gray-100 text-gray-800 border-gray-200'
                      }
                    >
                      {leg.Status}
                    </Badge>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Reason for Update */}
        <div className="mt-6">
          <Label htmlFor="reasonForUpdate">Reason For Update</Label>
          <Select value={reasonForUpdate} onValueChange={setReasonForUpdate}>
            <SelectTrigger id="reasonForUpdate" className="mt-2">
              <SelectValue placeholder="Select Reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="route_change">Route Change</SelectItem>
              <SelectItem value="vehicle_change">Vehicle Change</SelectItem>
              <SelectItem value="driver_change">Driver Change</SelectItem>
              <SelectItem value="schedule_update">Schedule Update</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-card px-6 py-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Last Modified: Samuel Wilson 10:10:00 AM
        </p>
        <Button onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};
