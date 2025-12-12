import { useState, useMemo } from 'react';
import { SmartEquipmentCalendar } from '@/components/SmartEquipmentCalendar';
import { 
  ResourceCategoryResponse, 
  EquipmentItem, 
  EquipmentCalendarEvent,
  transformResourceToEquipment,
  transformTripDataToEvents
} from '@/types/equipmentCalendar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { addDays, addMonths, subDays, subMonths, addWeeks, subWeeks, startOfWeek, startOfMonth } from 'date-fns';
import { toast } from 'sonner';
import { SideDrawer } from '@/components/SideDrawer';

// Sample API response data
const sampleApiResponse: ResourceCategoryResponse = {
  "ResourceCategory": "Equipment",
  "ResourceDetails": [
    {
      "EquipmentType": "Train",
      "EquipmentCode": "ExDAFA 5.1",
      "EquipmentStatus": "Available",
      "EquipmentContract": null,
      "ContractAgent": null,
      "EquipmentGroup": null,
      "EquipmentOwner": "OW",
      "WeightUOM": null,
      "AvilableStatus": "Available for planning",
      "IsChecked": 1,
      "AdditionalData": null,
      "TripData": [
        {
          "RefDocNo": "TRIP00000001",
          "RefDocType": "TRIP",
          "RefDocStatus": "Initiated",
          "PlanStart": "2025-11-27 18:00",
          "PlanEnd": "2025-11-27 22:00",
          "AdditionalData": [
            { "Name": "FromGeo", "Value": "VLA-70" },
            { "Name": "ToGeo", "Value": "CUR-25" },
            { "Name": "FromDate", "Value": "2025-11-27 18:00:00" },
            { "Name": "ToDate", "Value": "2025-11-27 22:00:00" },
            { "Name": "Customer_id", "Value": "ABC Customer" },
            { "Name": "TrainType", "Value": "Block Train Conventional" },
            { "Name": "ServiceType", "Value": "Repair" }
          ]
        }
      ]
    },
    {
      "EquipmentType": "Train",
      "EquipmentCode": "DASP 1",
      "EquipmentStatus": "Available",
      "EquipmentContract": null,
      "ContractAgent": null,
      "EquipmentGroup": null,
      "EquipmentOwner": "OW",
      "WeightUOM": null,
      "AvilableStatus": "Available for planning",
      "IsChecked": 0,
      "AdditionalData": null,
      "TripData": null
    },
    {
      "EquipmentType": "Train",
      "EquipmentCode": "EE24-ExTM6a",
      "EquipmentStatus": "Available",
      "EquipmentContract": null,
      "ContractAgent": null,
      "EquipmentGroup": null,
      "EquipmentOwner": "OW",
      "WeightUOM": null,
      "AvilableStatus": "Available for planning",
      "IsChecked": 0,
      "AdditionalData": null,
      "TripData": null
    },
    {
      "EquipmentType": "Wagon",
      "EquipmentCode": "W001",
      "EquipmentStatus": "Occupied",
      "EquipmentContract": null,
      "ContractAgent": null,
      "EquipmentGroup": null,
      "EquipmentOwner": "ABC Logistics",
      "WeightUOM": "50T",
      "AvilableStatus": "In Use",
      "IsChecked": 0,
      "AdditionalData": null,
      "TripData": [
        {
          "RefDocNo": "TRIP00000012",
          "RefDocType": "TRIP",
          "RefDocStatus": "Initiated",
          "PlanStart": "2025-11-27 08:00",
          "PlanEnd": "2025-11-28 16:00",
          "AdditionalData": [
            { "Name": "FromGeo", "Value": "VLA-70" },
            { "Name": "ToGeo", "Value": "CUR-25" },
            { "Name": "Customer_id", "Value": "ABC Customer" },
            { "Name": "TrainType", "Value": "Block Train Conventional" },
            { "Name": "ServiceType", "Value": "Repair" }
          ]
        }
      ]
    },
    {
      "EquipmentType": "Wagon",
      "EquipmentCode": "W002",
      "EquipmentStatus": "Workshop",
      "EquipmentContract": null,
      "ContractAgent": null,
      "EquipmentGroup": null,
      "EquipmentOwner": "XYZ Transport",
      "WeightUOM": "45T",
      "AvilableStatus": "Under Maintenance",
      "IsChecked": 0,
      "AdditionalData": null,
      "TripData": [
        {
          "RefDocNo": "MNT_0045",
          "RefDocType": "MAINTENANCE",
          "RefDocStatus": "Scheduled",
          "PlanStart": "2025-11-27 09:00",
          "PlanEnd": "2025-11-27 17:00",
          "AdditionalData": [
            { "Name": "FromGeo", "Value": "Workshop A" },
            { "Name": "ToGeo", "Value": "Workshop A" },
            { "Name": "Customer_id", "Value": "Internal Maintenance" },
            { "Name": "ServiceType", "Value": "Scheduled Maintenance" }
          ]
        }
      ]
    }
  ]
};

const EquipmentCalendarDemo = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [startDate, setStartDate] = useState(new Date('2025-11-27'));
  const [showHourView, setShowHourView] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);

  // Transform API data to internal types
  const { equipments, events } = useMemo(() => {
    const equipments: EquipmentItem[] = sampleApiResponse.ResourceDetails.map(transformResourceToEquipment);
    const events: EquipmentCalendarEvent[] = sampleApiResponse.ResourceDetails.flatMap(transformTripDataToEvents);
    return { equipments, events };
  }, []);

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
      description: `Type: ${event.type} | Status: ${event.status || 'N/A'} | Equipment: ${event.equipmentId}`,
    });
  };

  const handleEquipmentClick = (equipment: EquipmentItem) => {
    toast.success(`Selected: ${equipment.title}`, {
      description: `Type: ${equipment.type} | Owner: ${equipment.supplier} | Status: ${equipment.status}`,
    });
  };

  const handleAddToTrip = (selectedIds: string[]) => {
    toast.success(`Adding ${selectedIds.length} equipment(s) to CO/Trip`, {
      description: `Equipment: ${selectedIds.join(', ')}`,
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
