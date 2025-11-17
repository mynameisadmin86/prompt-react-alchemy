import { useState, useRef, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, ChevronRight, MapPin, User, Calendar } from 'lucide-react';
import { EquipmentItem, EquipmentCalendarEvent, CalendarView } from '@/types/equipmentCalendar';
import { format, addHours, addDays, startOfDay, differenceInMinutes, isSameDay } from 'date-fns';

interface EquipmentCalendarViewProps {
  equipments: EquipmentItem[];
  events: EquipmentCalendarEvent[];
  view?: CalendarView;
  startDate?: Date;
  onViewChange?: (view: CalendarView) => void;
  onBarClick?: (event: EquipmentCalendarEvent) => void;
  onEquipmentSelect?: (equipmentId: string) => void;
  selectedEquipment?: string;
  enableDrag?: boolean;
}

const ROW_HEIGHT = 72;
const HOUR_WIDTH = 80;

export const EquipmentCalendarView = ({
  equipments,
  events,
  view = 'day',
  startDate = new Date(),
  onViewChange,
  onBarClick,
  onEquipmentSelect,
  selectedEquipment,
  enableDrag = false,
}: EquipmentCalendarViewProps) => {
  const [selectedView, setSelectedView] = useState<CalendarView>(view);
  const timelineRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);

  const handleViewChange = (newView: CalendarView) => {
    setSelectedView(newView);
    onViewChange?.(newView);
  };

  // Generate time columns based on view
  const getTimeColumns = () => {
    const columns: Date[] = [];
    const start = startOfDay(startDate);

    if (selectedView === 'day') {
      for (let i = 0; i < 24; i++) {
        columns.push(addHours(start, i));
      }
    } else if (selectedView === 'week') {
      for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
          columns.push(addHours(addDays(start, day), hour));
        }
      }
    } else {
      for (let day = 0; day < 30; day++) {
        columns.push(addDays(start, day));
      }
    }

    return columns;
  };

  const timeColumns = getTimeColumns();
  const columnWidth = selectedView === 'month' ? 60 : HOUR_WIDTH;

  // Calculate bar position and width
  const calculateBarStyle = (event: EquipmentCalendarEvent, equipmentIndex: number) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const viewStart = startOfDay(startDate);

    const startOffset = differenceInMinutes(eventStart, viewStart);
    const duration = differenceInMinutes(eventEnd, eventStart);

    const pixelsPerMinute = columnWidth / (selectedView === 'month' ? 1440 : 60);
    const left = startOffset * pixelsPerMinute;
    const width = duration * pixelsPerMinute;
    const top = equipmentIndex * ROW_HEIGHT + 20;

    return {
      left: `${left}px`,
      width: `${width}px`,
      top: `${top}px`,
      height: '32px',
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'owned':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'leased':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'maintenance':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'trip':
        return 'bg-amber-200 border-amber-300';
      case 'maintenance':
        return 'bg-blue-200 border-blue-300';
      case 'hold':
        return 'bg-green-200 border-green-300';
      default:
        return 'bg-gray-200 border-gray-300';
    }
  };

  // Sync scroll between panels
  useEffect(() => {
    const handleScroll = (e: Event) => {
      if (leftPanelRef.current && timelineRef.current) {
        const target = e.target as HTMLElement;
        if (target === leftPanelRef.current) {
          timelineRef.current.scrollTop = target.scrollTop;
        } else if (target === timelineRef.current) {
          leftPanelRef.current.scrollTop = target.scrollTop;
        }
      }
    };

    const leftPanel = leftPanelRef.current;
    const timeline = timelineRef.current;

    leftPanel?.addEventListener('scroll', handleScroll);
    timeline?.addEventListener('scroll', handleScroll);

    return () => {
      leftPanel?.removeEventListener('scroll', handleScroll);
      timeline?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Header */}
      <div className="border-b px-4 py-3 flex items-center justify-between bg-background">
        <div className="flex items-center gap-3">
          <Checkbox />
          <h3 className="font-semibold text-foreground">Equipment Availability</h3>
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Planned</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Under Maintenance</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Equipment List */}
        <div
          ref={leftPanelRef}
          className="w-80 border-r overflow-y-auto bg-background flex-shrink-0"
          style={{ scrollbarGutter: 'stable' }}
        >
          {equipments.map((equipment, index) => (
            <div
              key={equipment.id}
              className={`flex items-center gap-3 px-3 py-4 border-b hover:bg-accent cursor-pointer transition-colors ${
                selectedEquipment === equipment.id ? 'bg-accent' : ''
              }`}
              style={{ height: `${ROW_HEIGHT}px` }}
              onClick={() => onEquipmentSelect?.(equipment.id)}
            >
              <Checkbox checked={selectedEquipment === equipment.id} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-foreground truncate">
                  {equipment.title}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {equipment.supplier}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge
                  variant="outline"
                  className={`text-xs ${getStatusColor(equipment.status)}`}
                >
                  {equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1)}
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel - Calendar Timeline */}
        <div className="flex-1 overflow-auto relative" ref={timelineRef}>
          {/* Timeline Header */}
          <div className="sticky top-0 z-10 bg-background border-b">
            <div className="flex items-center justify-center py-2 border-b">
              <span className="font-semibold text-foreground">
                {format(startDate, 'MMM dd, yyyy')}
              </span>
            </div>
            <div className="flex">
              {timeColumns.map((time, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-2 py-2 border-r text-center text-xs text-muted-foreground"
                  style={{ width: `${columnWidth}px` }}
                >
                  {selectedView === 'month'
                    ? format(time, 'dd')
                    : format(time, 'h a')}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Grid */}
          <div className="relative" style={{ minHeight: `${equipments.length * ROW_HEIGHT}px` }}>
            {/* Grid Lines */}
            {equipments.map((_, index) => (
              <div
                key={index}
                className="absolute left-0 right-0 border-b"
                style={{
                  top: `${index * ROW_HEIGHT}px`,
                  height: `${ROW_HEIGHT}px`,
                }}
              >
                <div className="flex h-full">
                  {timeColumns.map((_, colIndex) => (
                    <div
                      key={colIndex}
                      className="border-r"
                      style={{ width: `${columnWidth}px` }}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Event Bars */}
            {events.map((event) => {
              const equipmentIndex = equipments.findIndex(
                (eq) => eq.id === event.equipmentId
              );
              if (equipmentIndex === -1) return null;

              const barStyle = calculateBarStyle(event, equipmentIndex);

              return (
                <div
                  key={event.id}
                  className={`absolute rounded-md border shadow-sm cursor-pointer hover:shadow-md transition-shadow ${getEventColor(
                    event.type
                  )}`}
                  style={barStyle}
                  onClick={() => onBarClick?.(event)}
                >
                  <div className="px-2 py-1 text-xs font-medium text-foreground truncate">
                    {event.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
