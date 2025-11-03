import { SideDrawer } from '@/components/ui/side-drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Package, Truck, Plus } from 'lucide-react';
import { DateTimePicker } from '@/components/Common/DateTimePicker';
import { useState } from 'react';

interface LegEventsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tripId?: string;
}

interface Activity {
  id: string;
  title: string;
  status?: string;
  statusType?: 'warning' | 'info' | 'success';
  plannedDate: string;
  plannedTime: string;
  icon: React.ReactNode;
}

export const LegEventsDrawer: React.FC<LegEventsDrawerProps> = ({
  isOpen,
  onClose,
  tripId = 'TRIP00000001'
}) => {
  const [tripStartDate, setTripStartDate] = useState<Date>(new Date('2025-03-10T10:00:00'));
  const [tripStartTime, setTripStartTime] = useState('10:00AM');
  const [tripEndDate, setTripEndDate] = useState<Date>(new Date('2025-03-15T12:00:00'));
  const [tripEndTime, setTripEndTime] = useState('12:00PM');
  
  const [legStartDate, setLegStartDate] = useState<Date>(new Date('2025-03-10T10:00:00'));
  const [legStartTime, setLegStartTime] = useState('10:00AM');
  const [legEndDate, setLegEndDate] = useState<Date>(new Date('2025-03-10T12:00:00'));
  const [legEndTime, setLegEndTime] = useState('12:00PM');

  const [activeTab, setActiveTab] = useState<'activities' | 'additional'>('activities');

  const activities: Activity[] = [
    {
      id: '1',
      title: 'Arrived at Destination',
      status: '1d 2h 45m Delayed',
      statusType: 'warning',
      plannedDate: '10-Mar-2025',
      plannedTime: '10:20 AM',
      icon: <MapPin className="h-4 w-4" />
    },
    {
      id: '2',
      title: 'Departed at Source',
      plannedDate: '10-Mar-2025',
      plannedTime: '10:20 AM',
      icon: <Truck className="h-4 w-4" />
    },
    {
      id: '3',
      title: 'Loaded',
      plannedDate: '10-Mar-2025',
      plannedTime: '10:20 AM',
      icon: <Package className="h-4 w-4" />
    },
  ];

  const legs = [
    { id: 1, from: 'Berlin', to: 'Berlin', customer: 'ABC Customer', order: 'CO00000001', status: 'Pickup', isActive: true },
    { id: 2, from: 'Berlin', to: 'Frankfurt', customer: 'ABC Customer', order: 'CO00000001', status: 'Via', isActive: false },
    { id: 3, from: 'Frankfurt', to: 'Paris', customer: 'Multiple', order: 'Multiple', status: 'Bhub', isActive: false },
  ];

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Leg and Events"
      width="90%"
      showFooter
      footerButtons={[
        { label: 'Cancel', variant: 'outline', action: onClose },
        { label: 'Save', variant: 'default', action: () => console.log('Save') }
      ]}
    >
      <div className="mb-4">
        <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-primary/20">
          {tripId}
        </Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Left Panel - Trip Level Details */}
        <div className="space-y-4">
          {/* Trip Dates */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Trip Start Date <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value="2025-03-10"
                    className="pr-8"
                  />
                  <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Trip Start Time <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="time"
                    value="10:00"
                    className="pr-8"
                  />
                  <Clock className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Trip End Date <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value="2025-03-15"
                    className="pr-8"
                  />
                  <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Trip End Time <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="time"
                    value="12:00"
                    className="pr-8"
                  />
                  <Clock className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Legs List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">
                Total Legs <Badge variant="outline" className="ml-2">{legs.length}</Badge>
              </h3>
            </div>
            
            <div className="space-y-2">
              {legs.map((leg) => (
                <Card
                  key={leg.id}
                  className={`p-3 cursor-pointer transition-colors ${
                    leg.isActive ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {leg.id}: {leg.from} → {leg.to}
                      </span>
                      {leg.id === 1 && (
                        <div className="flex items-center gap-1">
                          <Truck className="h-3 w-3 text-primary" />
                          <span className="text-xs text-primary">Pickup</span>
                        </div>
                      )}
                      {leg.status === 'Via' && (
                        <Badge variant="outline" className="text-xs bg-pink-50 text-pink-600 border-pink-200">
                          Via
                        </Badge>
                      )}
                      {leg.status === 'Bhub' && (
                        <Badge variant="outline" className="text-xs bg-cyan-50 text-cyan-600 border-cyan-200">
                          Bhub
                        </Badge>
                      )}
                      {leg.isActive && (
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{leg.customer}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      <span>{leg.order}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Leg Details & Activities */}
        <div className="lg:col-span-2 space-y-4">
          {/* Leg Dates */}
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Leg Start Date</label>
              <div className="relative">
                <Input
                  type="date"
                  value="2025-03-10"
                  className="pr-8"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Leg Start Time</label>
              <div className="relative">
                <Input
                  type="time"
                  value="10:00"
                  className="pr-8"
                />
                <Clock className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Leg End Date</label>
              <div className="relative">
                <Input
                  type="date"
                  value="2025-03-10"
                  className="pr-8"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Leg End Time</label>
              <div className="relative">
                <Input
                  type="time"
                  value="12:00"
                  className="pr-8"
                />
                <Clock className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Activities Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 border-b border-border">
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`pb-2 px-1 text-sm font-medium transition-colors ${
                    activeTab === 'activities'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Activities
                </button>
                <button
                  onClick={() => setActiveTab('additional')}
                  className={`pb-2 px-1 text-sm font-medium transition-colors ${
                    activeTab === 'additional'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Additional Activities
                </button>
              </div>
              <Button size="sm" variant="outline" className="gap-2">
                <Plus className="h-3 w-3" />
                Add
              </Button>
            </div>

            {/* Activities List */}
            <div className="space-y-3">
              {activities.map((activity) => (
                <Card key={activity.id} className="p-4 border-l-4 border-l-primary">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {activity.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{activity.title}</h4>
                        {activity.status && (
                          <Badge 
                            variant="outline" 
                            className={`mt-1 ${
                              activity.statusType === 'warning' 
                                ? 'bg-red-50 text-red-600 border-red-200'
                                : 'bg-blue-50 text-blue-600 border-blue-200'
                            }`}
                          >
                            {activity.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Planned Date</label>
                      <div className="relative">
                        <Input
                          type="date"
                          value="2025-03-10"
                          className="pr-8 h-9 text-sm"
                        />
                        <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Planned Time</label>
                      <div className="relative">
                        <Input
                          type="time"
                          value="10:20"
                          className="pr-8 h-9 text-sm"
                        />
                        <Clock className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SideDrawer>
  );
};
