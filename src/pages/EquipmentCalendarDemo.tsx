import { useState } from 'react';
import { EquipmentCalendarView } from '@/components/EquipmentCalendar';
import { EquipmentItem, EquipmentCalendarEvent, CalendarView } from '@/types/equipmentCalendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { addHours } from 'date-fns';

const EquipmentCalendarDemo = () => {
  const [view, setView] = useState<CalendarView>('day');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [showDialog, setShowDialog] = useState(true);

  // Sample equipment data
  const equipments: EquipmentItem[] = [
    {
      id: 'hab1',
      title: 'Habbins (Hab000036739)',
      supplier: 'DB Cargo',
      status: 'leased',
    },
    {
      id: 'zac1',
      title: 'Zaccs (Zac638389)',
      supplier: 'SNCF',
      status: 'leased',
    },
    {
      id: 'wagon1',
      title: 'A Type Wagon (A5378292)',
      supplier: 'Railking Europe',
      status: 'owned',
    },
    {
      id: 'hab2',
      title: 'Habbins (Hab6373884)',
      supplier: 'ABC Supplier',
      status: 'leased',
    },
    {
      id: 'hab3',
      title: 'Habbins (Hab000036739)',
      supplier: 'DB Cargo',
      status: 'owned',
    },
    {
      id: 'zac2',
      title: 'Zaccs (Zac638389)',
      supplier: 'SNCF',
      status: 'leased',
    },
    {
      id: 'wagon2',
      title: 'A Type Wagon (A5378292)',
      supplier: 'Railking Europe',
      status: 'owned',
    },
    {
      id: 'hab4',
      title: 'Habbins (Hab6373884)',
      supplier: 'ABC Supplier',
      status: 'leased',
    },
  ];

  // Sample events data
  const today = new Date();
  const events: EquipmentCalendarEvent[] = [
    {
      id: 'event1',
      equipmentId: 'hab1',
      label: 'TRIP00000001',
      type: 'trip',
      start: today.toISOString(),
      end: addHours(today, 12).toISOString(),
    },
    {
      id: 'event2',
      equipmentId: 'zac1',
      label: 'TRIP00000012',
      type: 'maintenance',
      start: addHours(today, 2).toISOString(),
      end: addHours(today, 8).toISOString(),
    },
    {
      id: 'event3',
      equipmentId: 'wagon1',
      label: 'TRIP00000012',
      type: 'maintenance',
      start: addHours(today, 1).toISOString(),
      end: addHours(today, 14).toISOString(),
    },
    {
      id: 'event4',
      equipmentId: 'hab2',
      label: 'TRIP0000011',
      type: 'trip',
      start: addHours(today, 4).toISOString(),
      end: addHours(today, 10).toISOString(),
    },
    {
      id: 'event5',
      equipmentId: 'hab3',
      label: 'TRIP00000001',
      type: 'trip',
      start: addHours(today, 6).toISOString(),
      end: addHours(today, 9).toISOString(),
    },
    {
      id: 'event6',
      equipmentId: 'zac2',
      label: 'TRIP00000012',
      type: 'maintenance',
      start: addHours(today, 8).toISOString(),
      end: addHours(today, 15).toISOString(),
    },
    {
      id: 'event7',
      equipmentId: 'hab4',
      label: 'TRIP00000012',
      type: 'maintenance',
      start: addHours(today, 10).toISOString(),
      end: addHours(today, 16).toISOString(),
    },
    {
      id: 'event8',
      equipmentId: 'hab4',
      label: 'TRIP00000013',
      type: 'hold',
      start: addHours(today, 17).toISOString(),
      end: addHours(today, 22).toISOString(),
    },
  ];

  const handleBarClick = (event: EquipmentCalendarEvent) => {
    console.log('Bar clicked:', event);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Equipment Calendar Demo
          </h1>
          <p className="text-muted-foreground">
            Interactive equipment scheduling and availability calendar view
          </p>
        </div>

        <Button onClick={() => setShowDialog(true)} className="mb-4">
          <Calendar className="mr-2 h-4 w-4" />
          Open Calendar View
        </Button>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0">
            <DialogHeader className="px-6 pt-6 pb-0">
              <DialogTitle className="flex items-center justify-between">
                <span>Select Equipment</span>
                <Tabs value={view} onValueChange={(v) => setView(v as CalendarView)}>
                  <TabsList>
                    <TabsTrigger value="day">List View</TabsTrigger>
                    <TabsTrigger value="day">Calendar View</TabsTrigger>
                  </TabsList>
                </Tabs>
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-hidden">
              <EquipmentCalendarView
                equipments={equipments}
                events={events}
                view={view}
                startDate={today}
                onViewChange={setView}
                onBarClick={handleBarClick}
                onEquipmentSelect={setSelectedEquipment}
                selectedEquipment={selectedEquipment}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EquipmentCalendarDemo;
