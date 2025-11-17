import React, { useState } from 'react';
import { EquipmentCalendar, CalendarEvent, CalendarResource } from '@/components/Calendar';

const CalendarDemo = () => {
  const [resources] = useState<CalendarResource[]>([
    {
      id: 'hab001',
      name: 'Habbins (Hab00036739)',
      subtitle: 'DB Cargo',
      status: 'Leased',
      selected: false,
    },
    {
      id: 'zac001',
      name: 'Zaccs (Zac638389)',
      subtitle: 'SNCF',
      status: 'Leased',
      selected: false,
    },
    {
      id: 'wagon001',
      name: 'A Type Wagon (A5378292)',
      subtitle: 'Railking Europe',
      status: 'Owned',
      selected: true,
    },
    {
      id: 'hab002',
      name: 'Habbins (Hab6373884)',
      subtitle: 'ABC Supplier',
      status: 'Leased',
      selected: false,
    },
    {
      id: 'hab003',
      name: 'Habbins (Hab00036739)',
      subtitle: 'DB Cargo',
      status: 'Owned',
      selected: false,
    },
    {
      id: 'zac002',
      name: 'Zaccs (Zac638389)',
      subtitle: 'SNCF',
      status: 'Leased',
      selected: false,
    },
  ]);

  const [events] = useState<CalendarEvent[]>([
    {
      id: 'e1',
      title: 'TRIP00000001',
      startTime: new Date(2023, 10, 17, 2, 0),
      endTime: new Date(2023, 10, 17, 18, 0),
      color: 'yellow',
      resourceId: 'wagon001',
    },
    {
      id: 'e2',
      title: 'TRIP00000012',
      startTime: new Date(2023, 10, 17, 6, 0),
      endTime: new Date(2023, 10, 17, 12, 0),
      color: 'blue',
      resourceId: 'wagon001',
    },
    {
      id: 'e3',
      title: 'TRIP00000011',
      startTime: new Date(2023, 10, 17, 14, 0),
      endTime: new Date(2023, 10, 17, 20, 0),
      color: 'orange',
      resourceId: 'hab002',
    },
    {
      id: 'e4',
      title: 'TRIP00000001',
      startTime: new Date(2023, 10, 17, 20, 0),
      endTime: new Date(2023, 10, 18, 2, 0),
      color: 'orange',
      resourceId: 'hab003',
    },
    {
      id: 'e5',
      title: 'TRIP00000012',
      startTime: new Date(2023, 10, 17, 8, 30),
      endTime: new Date(2023, 10, 17, 16, 0),
      color: 'blue',
      resourceId: 'zac002',
    },
    {
      id: 'e6',
      title: 'TRIP00000012',
      startTime: new Date(2023, 10, 17, 18, 0),
      endTime: new Date(2023, 10, 18, 0, 30),
      color: 'blue',
      resourceId: 'hab002',
    },
    {
      id: 'e7',
      title: 'TRIP00000013',
      startTime: new Date(2023, 10, 18, 1, 0),
      endTime: new Date(2023, 10, 18, 4, 0),
      color: 'green',
      resourceId: 'hab002',
    },
  ]);

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Event clicked:', event);
  };

  return (
    <div className="h-screen p-4">
      <div className="h-full max-w-7xl mx-auto">
        <EquipmentCalendar
          date={new Date(2023, 10, 17)}
          resources={resources}
          events={events}
          onEventClick={handleEventClick}
        />
      </div>
    </div>
  );
};

export default CalendarDemo;
