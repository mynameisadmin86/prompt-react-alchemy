import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { EquipmentCalendarViewProps, EquipmentItem, EquipmentCalendarEvent } from '@/types/equipmentCalendar';
import { format, addHours, addDays, startOfDay, endOfDay, differenceInMinutes, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

const statusColors = {
  owned: 'bg-green-100 text-green-800 border-green-200',
  leased: 'bg-blue-100 text-blue-800 border-blue-200',
  maintenance: 'bg-orange-100 text-orange-800 border-orange-200',
};

const eventTypeColors = {
  trip: 'bg-primary',
  maintenance: 'bg-orange-500',
  hold: 'bg-muted',
};

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
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);

  const ROW_HEIGHT = 60;
  const HOUR_WIDTH = 60; // pixels per hour for day view
  const DAY_WIDTH = 120; // pixels per day for week view
  const MONTH_DAY_WIDTH = 40; // pixels per day for month view (smaller to fit 31 days)

  // Calculate timeline dimensions based on view
  const getTimelineDimensions = () => {
    switch (view) {
      case 'day':
        return {
          columns: 24,
          width: 0, // Will use full width via flex
          unit: 'hour',
          columnWidth: 0, // Will use flex-1
          useFlex: true,
        };
      case 'week':
        return {
          columns: 7,
          width: 0, // Will use full width via flex
          unit: 'day',
          columnWidth: 0, // Will use flex-1
          useFlex: true,
        };
      case 'month':
        return {
          columns: 31,
          width: 31 * MONTH_DAY_WIDTH,
          unit: 'day',
          columnWidth: MONTH_DAY_WIDTH,
          useFlex: false,
        };
      default:
        return {
          columns: 24,
          width: 0,
          unit: 'hour',
          columnWidth: 0,
          useFlex: true,
        };
    }
  };

  const dimensions = getTimelineDimensions();

  // Generate timeline header labels
  const getTimelineLabels = () => {
    const labels = [];
    
    if (view === 'month') {
      for (let i = 0; i < 31; i++) {
        const day = addDays(startOfMonth(startDate), i);
        labels.push({
          label: format(day, 'd'),
          fullLabel: format(day, 'MMM d'),
        });
      }
      return labels;
    }
    
    if (view === 'day') {
      for (let i = 0; i < 24; i++) {
        const hour = addHours(startOfDay(startDate), i);
        labels.push({
          label: format(hour, 'HH:00'),
          fullLabel: format(hour, 'HH:00'),
        });
      }
    } else if (view === 'week') {
      for (let d = 0; d < 7; d++) {
        const day = addDays(startOfDay(startDate), d);
        labels.push({
          label: format(day, 'EEE d'),
          fullLabel: format(day, 'EEEE, MMM d'),
        });
      }
    }
    
    return labels;
  };

  const timelineLabels = getTimelineLabels();

  // Calculate bar position and width
  const calculateBarPosition = (event: EquipmentCalendarEvent) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    if (view === 'month') {
      const monthStart = startOfMonth(startDate);
      const daysFromStart = differenceInDays(startOfDay(eventStart), monthStart);
      const duration = differenceInDays(startOfDay(eventEnd), startOfDay(eventStart)) || 1;
      
      const left = Math.max(0, daysFromStart * MONTH_DAY_WIDTH);
      const width = duration * MONTH_DAY_WIDTH;
      return { left: Math.max(0, left), width: Math.max(20, width) };
    } else if (view === 'week') {
      // week view (percentage-based for flex layout)
      const viewStart = startOfDay(startDate);
      const daysFromStart = differenceInDays(startOfDay(eventStart), viewStart);
      const duration = differenceInDays(startOfDay(eventEnd), startOfDay(eventStart)) || 1;
      
      const leftPercent = (daysFromStart / 7) * 100;
      const widthPercent = (duration / 7) * 100;
      return { leftPercent: Math.max(0, leftPercent), widthPercent: Math.max(2, widthPercent) };
    } else {
      // day view (percentage-based for flex layout)
      const viewStart = startOfDay(startDate);
      const minutesFromStart = differenceInMinutes(eventStart, viewStart);
      const duration = differenceInMinutes(eventEnd, eventStart);
      
      const leftPercent = (minutesFromStart / (24 * 60)) * 100;
      const widthPercent = (duration / (24 * 60)) * 100;
      return { leftPercent: Math.max(0, leftPercent), widthPercent: Math.max(1, widthPercent) };
    }
  };

  // Get events for a specific equipment
  const getEventsForEquipment = (equipmentId: string) => {
    return events.filter(e => e.equipmentId === equipmentId);
  };

  const handleEquipmentClick = (equipment: EquipmentItem) => {
    setSelectedEquipmentId(equipment.id);
    onEquipmentClick?.(equipment);
  };

  const handleBarClick = (event: EquipmentCalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onBarClick?.(event);
  };

  // Sync vertical scroll between left panel and timeline
  useEffect(() => {
    const handleScroll = () => {
      if (timelineRef.current && leftPanelRef.current) {
        leftPanelRef.current.scrollTop = timelineRef.current.scrollTop;
      }
    };

    const timeline = timelineRef.current;
    timeline?.addEventListener('scroll', handleScroll);

    return () => {
      timeline?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden">
      {/* Header with view controls */}
      <div className="border-b bg-background p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Equipment Calendar</h2>
          <span className="text-sm text-muted-foreground">
            {format(startDate, view === 'month' ? 'MMMM yyyy' : 'MMM d, yyyy')}
          </span>
        </div>
        <Tabs value={view} onValueChange={(v) => onViewChange(v as any)}>
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Equipment List */}
        <div className="w-80 border-r bg-background flex flex-col">
          <div className="border-b p-3 bg-muted/50 font-medium text-sm">
            Equipment
          </div>
          <ScrollArea className="flex-1" ref={leftPanelRef}>
            <div>
              {equipments.map((equipment) => (
                <div
                  key={equipment.id}
                  onClick={() => handleEquipmentClick(equipment)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 border-b cursor-pointer transition-colors",
                    "hover:bg-accent/50",
                    selectedEquipmentId === equipment.id && "bg-accent"
                  )}
                  style={{ height: ROW_HEIGHT }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{equipment.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{equipment.supplier}</div>
                  </div>
                  <Badge variant="outline" className={cn("ml-2", statusColors[equipment.status])}>
                    {equipment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Timeline */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Timeline Header */}
          <div className={cn(
            "border-b bg-muted/30",
            dimensions.useFlex ? "" : "overflow-x-auto scrollbar-thin"
          )}>
            <div className={cn(
              "flex",
              dimensions.useFlex ? "w-full" : ""
            )} style={dimensions.useFlex ? {} : { width: dimensions.width }}>
              {timelineLabels.map((label, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "text-center py-2 text-xs font-medium border-r",
                    dimensions.useFlex ? "flex-1" : "flex-shrink-0",
                    (label as any).isDayStart && view === 'week' && "border-l-2 border-l-primary/50 bg-muted/70 font-semibold",
                    (label as any).isDayStart && view !== 'week' && "border-l-2 border-l-primary/30 bg-muted/50"
                  )}
                  style={dimensions.useFlex ? {} : { width: dimensions.columnWidth }}
                  title={label.fullLabel}
                >
                  {label.label}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Body */}
          <ScrollArea className="flex-1" ref={timelineRef}>
            <div className={cn("relative", dimensions.useFlex ? "w-full" : "")} 
                 style={dimensions.useFlex ? { minHeight: equipments.length * ROW_HEIGHT } : { width: dimensions.width, minHeight: equipments.length * ROW_HEIGHT }}>
              {/* Grid lines */}
              {!dimensions.useFlex && (
                <div className="absolute inset-0 pointer-events-none">
                  {timelineLabels.map((_, idx) => (
                    <div
                      key={idx}
                      className="absolute top-0 bottom-0 border-r border-border/30"
                      style={{ left: idx * dimensions.columnWidth }}
                    />
                  ))}
                  {equipments.map((_, idx) => (
                    <div
                      key={idx}
                      className="absolute left-0 right-0 border-b border-border/30"
                      style={{ top: (idx + 1) * ROW_HEIGHT }}
                    />
                  ))}
                </div>
              )}
              
              {/* Grid lines for flex layout */}
              {dimensions.useFlex && (
                <div className="absolute inset-0 pointer-events-none flex">
                  {timelineLabels.map((_, idx) => (
                    <div
                      key={idx}
                      className="flex-1 border-r border-border/30"
                    />
                  ))}
                </div>
              )}
              {dimensions.useFlex && equipments.map((_, idx) => (
                <div
                  key={idx}
                  className="absolute left-0 right-0 border-b border-border/30"
                  style={{ top: (idx + 1) * ROW_HEIGHT }}
                />
              ))}

              {/* Event bars */}
              {equipments.map((equipment, equipmentIdx) => {
                const equipmentEvents = getEventsForEquipment(equipment.id);
                
                return equipmentEvents.map((event) => {
                  const position = calculateBarPosition(event);
                  const top = equipmentIdx * ROW_HEIGHT + 10;
                  const height = ROW_HEIGHT - 20;

                  const isPercentBased = 'leftPercent' in position;

                  return (
                    <div
                      key={event.id}
                      onClick={(e) => handleBarClick(event, e)}
                      className={cn(
                        "absolute rounded-md text-xs text-white px-2 flex items-center shadow-sm cursor-pointer transition-all hover:shadow-md hover:brightness-110",
                        event.color || eventTypeColors[event.type],
                        enableDrag && "cursor-move"
                      )}
                      style={{
                        left: isPercentBased ? `${(position as any).leftPercent}%` : `${(position as any).left}px`,
                        top: `${top}px`,
                        width: isPercentBased ? `${(position as any).widthPercent}%` : `${(position as any).width}px`,
                        height: `${height}px`,
                      }}
                      title={`${event.label}\n${format(new Date(event.start), 'MMM d, HH:mm')} - ${format(new Date(event.end), 'MMM d, HH:mm')}`}
                    >
                      <span className="truncate font-medium">{event.label}</span>
                    </div>
                  );
                });
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
};
