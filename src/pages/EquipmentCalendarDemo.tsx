import { useState } from 'react';
import { SmartEquipmentCalendar } from '@/components/SmartEquipmentCalendar';
import { EquipmentItem, EquipmentCalendarEvent } from '@/types/equipmentCalendar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { addDays, addMonths, subDays, subMonths, addWeeks, subWeeks, startOfWeek, startOfMonth } from 'date-fns';
import { toast } from 'sonner';
import { SideDrawer } from '@/components/SideDrawer';

const EquipmentCalendarDemo = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [startDate, setStartDate] = useState(new Date('2025-11-17'));
  const [showHourView, setShowHourView] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);

  // Sample equipment data
  const equipments: EquipmentItem[] = [
    { id: 'eq1', title: 'W001', supplier: 'ABC Logistics', status: 'available', type: 'Freight', capacity: '50T' },
    { id: 'eq2', title: 'W002', supplier: 'XYZ Transport', status: 'available', type: 'Passenger', capacity: '80 seats' },
    { id: 'eq3', title: 'W003', supplier: 'ABC Logistics', status: 'occupied', type: 'Tank', capacity: '40T' },
    { id: 'eq4', title: 'W004', supplier: 'Delta Movers', status: 'available', type: 'Freight', capacity: '50T' },
    { id: 'eq5', title: 'W005', supplier: 'XYZ Transport', status: 'occupied', type: 'Freight', capacity: '55T' },
    { id: 'eq6', title: 'W006', supplier: 'ABC Logistics', status: 'workshop', type: 'Tank', capacity: '45T' },
    { id: 'eq7', title: 'W007', supplier: 'Gamma Fleet', status: 'available', type: 'Freight', capacity: '50T' },
    { id: 'eq8', title: 'W008', supplier: 'Delta Movers', status: 'workshop', type: 'Passenger', capacity: '75 seats' },
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

  const handleAddToTrip = (selectedIds: string[]) => {
    toast.success(`Adding ${selectedIds.length} wagon(s) to CO/Trip`, {
      description: `Wagons: ${selectedIds.join(', ')}`,
    });
    setSelectedEquipments([]);
  };

  return (
    <>
      <div className="h-screen w-full bg-background p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Equipment Calendar Demo</h1>
            <p className="text-sm text-muted-foreground">Schedule and track equipment assignments</p>
          </div>
          <Button onClick={() => setIsDrawerOpen(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Open Calendar
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Click the button above to open the equipment calendar</p>
          </div>
        </div>
      </div>

      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Equipment Calendar"
        width="95%"
        slideDirection="right"
        showCloseButton={true}
        closeOnOutsideClick={true}
      >
        <div className="h-full flex flex-col gap-4 p-4">
          <div className="flex items-center justify-end gap-2">
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

          <div className="flex-1 overflow-hidden">
            <SmartEquipmentCalendar
              equipments={equipments}
              events={events}
              view={view}
              startDate={startDate}
              showHourView={showHourView}
              statusFilter={statusFilter}
              selectedEquipments={selectedEquipments}
              onViewChange={setView}
              onShowHourViewChange={setShowHourView}
              onStatusFilterChange={setStatusFilter}
              onSelectionChange={setSelectedEquipments}
              onAddToTrip={handleAddToTrip}
              onBarClick={handleBarClick}
              onEquipmentClick={handleEquipmentClick}
              enableDrag={false}
            />
          </div>
        </div>
      </SideDrawer>
    </>
  );
};

export default EquipmentCalendarDemo;
