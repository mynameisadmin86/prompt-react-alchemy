import { useState } from 'react';
import { EquipmentCalendarView } from '@/components/EquipmentCalendar';
import { EquipmentItem, EquipmentCalendarEvent } from '@/types/equipmentCalendar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, addMonths, subDays, subMonths, addWeeks, subWeeks, startOfWeek, startOfMonth } from 'date-fns';
import { toast } from 'sonner';

const EquipmentCalendarDemo = () => {
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [startDate, setStartDate] = useState(new Date('2025-11-17'));

  // Sample equipment data
  const equipments: EquipmentItem[] = [
    { id: 'eq1', title: 'Truck A-101', supplier: 'ABC Logistics', status: 'owned' },
    { id: 'eq2', title: 'Truck B-202', supplier: 'XYZ Transport', status: 'leased' },
    { id: 'eq3', title: 'Truck C-303', supplier: 'ABC Logistics', status: 'owned' },
    { id: 'eq4', title: 'Truck D-404', supplier: 'Delta Movers', status: 'maintenance' },
    { id: 'eq5', title: 'Truck E-505', supplier: 'XYZ Transport', status: 'leased' },
    { id: 'eq6', title: 'Truck F-606', supplier: 'ABC Logistics', status: 'owned' },
    { id: 'eq7', title: 'Truck G-707', supplier: 'Gamma Fleet', status: 'owned' },
    { id: 'eq8', title: 'Truck H-808', supplier: 'Delta Movers', status: 'maintenance' },
  ];

  // Sample events
  const events: EquipmentCalendarEvent[] = [
    {
      id: 'ev1',
      equipmentId: 'eq1',
      label: 'Trip to NYC',
      type: 'trip',
      start: '2025-11-17T08:00:00',
      end: '2025-11-17T16:00:00',
    },
    {
      id: 'ev2',
      equipmentId: 'eq1',
      label: 'Trip to Boston',
      type: 'trip',
      start: '2025-11-18T10:00:00',
      end: '2025-11-18T18:00:00',
    },
    {
      id: 'ev3',
      equipmentId: 'eq2',
      label: 'Maintenance Check',
      type: 'maintenance',
      start: '2025-11-17T09:00:00',
      end: '2025-11-17T12:00:00',
    },
    {
      id: 'ev4',
      equipmentId: 'eq2',
      label: 'Trip to Chicago',
      type: 'trip',
      start: '2025-11-18T06:00:00',
      end: '2025-11-19T14:00:00',
    },
    {
      id: 'ev5',
      equipmentId: 'eq3',
      label: 'Hold for Inspection',
      type: 'hold',
      start: '2025-11-17T08:00:00',
      end: '2025-11-17T17:00:00',
    },
    {
      id: 'ev6',
      equipmentId: 'eq4',
      label: 'Scheduled Maintenance',
      type: 'maintenance',
      start: '2025-11-17T08:00:00',
      end: '2025-11-19T17:00:00',
    },
    {
      id: 'ev7',
      equipmentId: 'eq5',
      label: 'Trip to LA',
      type: 'trip',
      start: '2025-11-17T12:00:00',
      end: '2025-11-20T15:00:00',
    },
    {
      id: 'ev8',
      equipmentId: 'eq6',
      label: 'Trip to Seattle',
      type: 'trip',
      start: '2025-11-18T07:00:00',
      end: '2025-11-19T19:00:00',
    },
    {
      id: 'ev9',
      equipmentId: 'eq7',
      label: 'Trip to Portland',
      type: 'trip',
      start: '2025-11-19T08:00:00',
      end: '2025-11-20T16:00:00',
    },
    {
      id: 'ev10',
      equipmentId: 'eq8',
      label: 'Oil Change',
      type: 'maintenance',
      start: '2025-11-17T10:00:00',
      end: '2025-11-17T14:00:00',
    },
  ];

  const handlePrevious = () => {
    switch (view) {
      case 'day':
        setStartDate(subDays(startDate, 1));
        break;
      case 'week':
        setStartDate(subWeeks(startDate, 1));
        break;
      case 'month':
        setStartDate(startOfMonth(subMonths(startDate, 1)));
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case 'day':
        setStartDate(addDays(startDate, 1));
        break;
      case 'week':
        setStartDate(addWeeks(startDate, 1));
        break;
      case 'month':
        setStartDate(startOfMonth(addMonths(startDate, 1)));
        break;
    }
  };

  const handleToday = () => {
    const today = new Date();
    switch (view) {
      case 'day':
        setStartDate(today);
        break;
      case 'week':
        setStartDate(startOfWeek(today, { weekStartsOn: 0 }));
        break;
      case 'month':
        setStartDate(startOfMonth(today));
        break;
    }
  };

  const handleBarClick = (event: EquipmentCalendarEvent) => {
    toast.info(`Clicked: ${event.label}`, {
      description: `Type: ${event.type} | Equipment: ${event.equipmentId}`,
    });
  };

  const handleEquipmentClick = (equipment: EquipmentItem) => {
    toast.success(`Selected: ${equipment.title}`, {
      description: `Supplier: ${equipment.supplier} | Status: ${equipment.status}`,
    });
  };

  return (
    <div className="h-screen w-full bg-background p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Equipment Calendar</h1>
          <p className="text-sm text-muted-foreground">Schedule and track equipment assignments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <EquipmentCalendarView
          equipments={equipments}
          events={events}
          view={view}
          startDate={startDate}
          onViewChange={setView}
          onBarClick={handleBarClick}
          onEquipmentClick={handleEquipmentClick}
          enableDrag={false}
        />
      </div>
    </div>
  );
};

export default EquipmentCalendarDemo;
