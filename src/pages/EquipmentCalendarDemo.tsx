import { useState } from "react";
import { EquipmentCalendarView } from "@/components/EquipmentCalendar";
import { EquipmentItem, EquipmentCalendarEvent, CalendarView } from "@/components/EquipmentCalendar/types";
import { addDays, addHours } from "date-fns";
import { toast } from "sonner";

const EquipmentCalendarDemo = () => {
  const [view, setView] = useState<CalendarView>('day');
  const [startDate] = useState(new Date('2025-11-17'));

  const sampleEquipments: EquipmentItem[] = [
    { id: '1', title: 'Truck T-101', supplier: 'ABC Transport', status: 'owned' },
    { id: '2', title: 'Van V-205', supplier: 'XYZ Logistics', status: 'leased' },
    { id: '3', title: 'Container C-301', supplier: 'Global Shipping', status: 'owned' },
    { id: '4', title: 'Trailer TR-450', supplier: 'Fast Movers', status: 'maintenance' },
    { id: '5', title: 'Forklift F-102', supplier: 'Warehouse Pro', status: 'owned' },
    { id: '6', title: 'Crane CR-88', supplier: 'Heavy Lifters', status: 'leased' },
  ];

  const sampleEvents: EquipmentCalendarEvent[] = [
    {
      id: 'e1',
      equipmentId: '1',
      label: 'Trip to Chicago',
      type: 'trip',
      start: addHours(startDate, 2).toISOString(),
      end: addHours(startDate, 8).toISOString(),
      color: 'bg-blue-600',
    },
    {
      id: 'e2',
      equipmentId: '1',
      label: 'Return Trip',
      type: 'trip',
      start: addHours(startDate, 14).toISOString(),
      end: addHours(startDate, 20).toISOString(),
      color: 'bg-blue-600',
    },
    {
      id: 'e3',
      equipmentId: '2',
      label: 'Local Delivery',
      type: 'trip',
      start: addHours(startDate, 9).toISOString(),
      end: addHours(startDate, 12).toISOString(),
      color: 'bg-green-600',
    },
    {
      id: 'e4',
      equipmentId: '3',
      label: 'Port Transfer',
      type: 'trip',
      start: addHours(startDate, 6).toISOString(),
      end: addHours(startDate, 18).toISOString(),
      color: 'bg-purple-600',
    },
    {
      id: 'e5',
      equipmentId: '4',
      label: 'Scheduled Maintenance',
      type: 'maintenance',
      start: addHours(startDate, 0).toISOString(),
      end: addHours(startDate, 24).toISOString(),
      color: 'bg-orange-600',
    },
    {
      id: 'e6',
      equipmentId: '5',
      label: 'Warehouse Operations',
      type: 'trip',
      start: addHours(startDate, 8).toISOString(),
      end: addHours(startDate, 17).toISOString(),
      color: 'bg-teal-600',
    },
    {
      id: 'e7',
      equipmentId: '6',
      label: 'Hold for Inspection',
      type: 'hold',
      start: addHours(startDate, 10).toISOString(),
      end: addHours(startDate, 14).toISOString(),
      color: 'bg-yellow-600',
    },
  ];

  const handleBarClick = (event: EquipmentCalendarEvent) => {
    toast.success(`Clicked: ${event.label}`, {
      description: `Type: ${event.type} | Equipment ID: ${event.equipmentId}`,
    });
  };

  const handleEquipmentClick = (equipment: EquipmentItem) => {
    toast.info(`Selected: ${equipment.title}`, {
      description: `Supplier: ${equipment.supplier} | Status: ${equipment.status}`,
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <EquipmentCalendarView
        equipments={sampleEquipments}
        events={sampleEvents}
        view={view}
        startDate={startDate}
        onViewChange={setView}
        onBarClick={handleBarClick}
        onEquipmentClick={handleEquipmentClick}
        enableDrag={false}
      />
    </div>
  );
};

export default EquipmentCalendarDemo;
