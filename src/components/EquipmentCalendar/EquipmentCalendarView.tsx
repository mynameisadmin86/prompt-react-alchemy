import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format, addDays, addHours, startOfDay, startOfWeek, startOfMonth, endOfMonth, differenceInHours, differenceInDays } from "date-fns";
import { EquipmentCalendarViewProps, EquipmentItem, EquipmentCalendarEvent, CalendarView } from "./types";

const ROW_HEIGHT = 60;

export const EquipmentCalendarView = ({
  equipments,
  events,
  view,
  startDate,
  onViewChange,
  onBarClick,
  onEquipmentClick,
  enableDrag = false,
}: EquipmentCalendarViewProps) => {
  
  const getStatusColor = (status: EquipmentItem['status']) => {
    switch (status) {
      case 'owned': return 'bg-green-500';
      case 'leased': return 'bg-blue-500';
      case 'maintenance': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventColor = (event: EquipmentCalendarEvent) => {
    if (event.color) return event.color;
    switch (event.type) {
      case 'trip': return 'bg-primary';
      case 'maintenance': return 'bg-orange-600';
      case 'hold': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  // Calculate timeline dimensions based on view
  const getTimelineConfig = () => {
    switch (view) {
      case 'day':
        return {
          columns: 24,
          columnWidth: 80,
          timeScale: 'hour',
          getLabel: (index: number) => `${index}:00`,
          getPosition: (eventStart: Date, eventEnd: Date) => {
            const hoursFromStart = differenceInHours(eventStart, startOfDay(startDate));
            const duration = differenceInHours(eventEnd, eventStart);
            return {
              left: hoursFromStart * 80,
              width: duration * 80,
            };
          },
        };
      case 'week':
        return {
          columns: 7 * 24,
          columnWidth: 40,
          timeScale: 'hour',
          getLabel: (index: number) => {
            const day = Math.floor(index / 24);
            const hour = index % 24;
            if (hour === 0) return format(addDays(startOfWeek(startDate), day), 'EEE d');
            return hour % 6 === 0 ? `${hour}:00` : '';
          },
          getPosition: (eventStart: Date, eventEnd: Date) => {
            const hoursFromStart = differenceInHours(eventStart, startOfWeek(startDate));
            const duration = differenceInHours(eventEnd, eventStart);
            return {
              left: hoursFromStart * 40,
              width: duration * 40,
            };
          },
        };
      case 'month':
        const daysInMonth = differenceInDays(endOfMonth(startDate), startOfMonth(startDate)) + 1;
        return {
          columns: daysInMonth,
          columnWidth: 60,
          timeScale: 'day',
          getLabel: (index: number) => format(addDays(startOfMonth(startDate), index), 'd'),
          getPosition: (eventStart: Date, eventEnd: Date) => {
            const daysFromStart = differenceInDays(eventStart, startOfMonth(startDate));
            const duration = differenceInDays(eventEnd, eventStart) + 1;
            return {
              left: daysFromStart * 60,
              width: duration * 60,
            };
          },
        };
    }
  };

  const timelineConfig = getTimelineConfig();
  const totalWidth = timelineConfig.columns * timelineConfig.columnWidth;

  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Header */}
      <div className="border-b p-4 bg-background">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Equipment Calendar</h2>
          <Tabs value={view} onValueChange={(v) => onViewChange(v as CalendarView)}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {format(startDate, 'MMMM d, yyyy')}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Equipment List */}
        <div className="w-80 border-r overflow-y-auto bg-background z-20">
          <div className="sticky top-0 bg-background border-b px-4 py-3 font-semibold text-sm z-10">
            Equipment
          </div>
          {equipments.map((equipment, index) => (
            <div
              key={equipment.id}
              className="flex items-center justify-between px-4 py-3 border-b hover:bg-muted/50 cursor-pointer transition-colors"
              style={{ height: ROW_HEIGHT }}
              onClick={() => onEquipmentClick?.(equipment)}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{equipment.title}</div>
                <div className="text-xs text-muted-foreground truncate">{equipment.supplier}</div>
              </div>
              <Badge variant="secondary" className={cn("ml-2", getStatusColor(equipment.status))}>
                {equipment.status}
              </Badge>
            </div>
          ))}
        </div>

        {/* Right Panel - Timeline */}
        <div className="flex-1 overflow-auto relative">
          {/* Timeline Header */}
          <div className="sticky top-0 bg-background border-b z-10" style={{ width: totalWidth }}>
            <div className="flex">
              {Array.from({ length: timelineConfig.columns }).map((_, index) => (
                <div
                  key={index}
                  className="border-r text-center text-xs py-2 text-muted-foreground"
                  style={{ width: timelineConfig.columnWidth, minWidth: timelineConfig.columnWidth }}
                >
                  {timelineConfig.getLabel(index)}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Grid & Events */}
          <div className="relative" style={{ width: totalWidth }}>
            {equipments.map((equipment, equipmentIndex) => {
              const equipmentEvents = events.filter(e => e.equipmentId === equipment.id);
              
              return (
                <div
                  key={equipment.id}
                  className="relative border-b"
                  style={{ height: ROW_HEIGHT }}
                >
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex">
                    {Array.from({ length: timelineConfig.columns }).map((_, index) => (
                      <div
                        key={index}
                        className="border-r"
                        style={{ width: timelineConfig.columnWidth }}
                      />
                    ))}
                  </div>

                  {/* Event bars */}
                  {equipmentEvents.map((event) => {
                    const eventStart = new Date(event.start);
                    const eventEnd = new Date(event.end);
                    const position = timelineConfig.getPosition(eventStart, eventEnd);
                    
                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute rounded-md text-xs text-white px-2 flex items-center shadow-sm cursor-pointer hover:opacity-90 transition-opacity",
                          getEventColor(event),
                          enableDrag && "cursor-move"
                        )}
                        style={{
                          left: position.left,
                          width: Math.max(position.width, 40),
                          top: 10,
                          height: ROW_HEIGHT - 20,
                        }}
                        onClick={() => onBarClick?.(event)}
                      >
                        <span className="truncate font-medium">{event.label}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
