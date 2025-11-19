import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EquipmentCalendarViewProps, EquipmentItem, EquipmentCalendarEvent } from '@/types/equipmentCalendar';
import { format, addHours, addDays, startOfDay, endOfDay, differenceInMinutes, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

const statusColors = {
  available: 'bg-green-100 text-green-800 border-green-200',
  occupied: 'bg-blue-100 text-blue-800 border-blue-200',
  workshop: 'bg-orange-100 text-orange-800 border-orange-200',
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
  showHourView,
  statusFilter,
  selectedEquipments,
  onViewChange,
  onShowHourViewChange,
  onStatusFilterChange,
  onSelectionChange,
  onAddToTrip,
  onBarClick,
  onEquipmentClick,
  enableDrag = false,
}: EquipmentCalendarViewProps) => {
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);

  // Filter equipments by status
  const filteredEquipments = statusFilter === 'all' 
    ? equipments 
    : equipments.filter(eq => eq.status === statusFilter);

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

  const handleSelectEquipment = (equipmentId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedEquipments, equipmentId]);
    } else {
      onSelectionChange(selectedEquipments.filter(id => id !== equipmentId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(filteredEquipments.map(eq => eq.id));
    } else {
      onSelectionChange([]);
    }
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
      <div className="border-b bg-background p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Rail Fleet Calendar</h2>
            <span className="text-sm text-muted-foreground">
              Manage wagon availability and trip scheduling
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
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="show-hour-view" 
                checked={showHourView}
                onCheckedChange={(checked) => onShowHourViewChange(checked as boolean)}
              />
              <label htmlFor="show-hour-view" className="text-sm cursor-pointer">
                Show Hour View
              </label>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="workshop">In Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-100 border border-green-200" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200" />
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-orange-100 border border-orange-200" />
                <span>In Workshop</span>
              </div>
            </div>
          </div>

          <span className="text-sm text-muted-foreground">
            {format(startDate, 'MMMM yyyy')}
          </span>
        </div>
      </div>

      {/* Selection bar */}
      {selectedEquipments.length > 0 && (
        <div className="bg-primary/10 border-b px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-primary">
            {selectedEquipments.length} Wagon{selectedEquipments.length > 1 ? 's' : ''} Selected
            <span className="ml-2 text-muted-foreground">
              {selectedEquipments.map(id => filteredEquipments.find(eq => eq.id === id)?.title).join(', ')}
            </span>
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onSelectionChange([])}>
              Clear Selection
            </Button>
            <Button size="sm" onClick={() => onAddToTrip(selectedEquipments)}>
              Add to CO/Trip
            </Button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Equipment List */}
        <div className="border-r bg-background flex flex-col w-80">
          <div className="border-b p-3 bg-muted/50 font-medium text-sm flex items-center gap-3">
            <Checkbox 
              checked={selectedEquipments.length === filteredEquipments.length && filteredEquipments.length > 0}
              onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
            />
            <span className="flex-1">Wagon ID</span>
            <span className="w-24">Type</span>
            <span className="w-24">Capacity</span>
          </div>
          <ScrollArea className="flex-1" ref={leftPanelRef}>
            <div>
              {filteredEquipments.map((equipment) => (
                <div
                  key={equipment.id}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 border-b transition-colors",
                    "hover:bg-accent/50",
                    selectedEquipmentId === equipment.id && "bg-accent"
                  )}
                  style={{ height: ROW_HEIGHT }}
                >
                  <Checkbox 
                    checked={selectedEquipments.includes(equipment.id)}
                    onCheckedChange={(checked) => handleSelectEquipment(equipment.id, checked as boolean)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div 
                    className="flex-1 min-w-0 cursor-pointer" 
                    onClick={() => handleEquipmentClick(equipment)}
                  >
                    <div className="font-medium text-sm truncate">{equipment.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{equipment.supplier}</div>
                  </div>
                  <span className="w-24 text-sm truncate">{equipment.type || '-'}</span>
                  <span className="w-24 text-sm truncate">{equipment.capacity || '-'}</span>
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
                 style={dimensions.useFlex ? { minHeight: filteredEquipments.length * ROW_HEIGHT } : { width: dimensions.width, minHeight: filteredEquipments.length * ROW_HEIGHT }}>
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
                  {filteredEquipments.map((_, idx) => (
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
              {dimensions.useFlex && filteredEquipments.map((_, idx) => (
                <div
                  key={idx}
                  className="absolute left-0 right-0 border-b border-border/30"
                  style={{ top: (idx + 1) * ROW_HEIGHT }}
                />
              ))}

              {/* Event bars */}
              {filteredEquipments.map((equipment, equipmentIdx) => {
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
                        "absolute rounded text-xs text-white px-2 flex flex-col justify-center shadow-sm cursor-pointer transition-all hover:shadow-md hover:brightness-110",
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
                      <div className="truncate font-semibold leading-tight">{event.label}</div>
                      {showHourView && (
                        <div className="truncate text-[10px] opacity-90">
                          {format(new Date(event.start), 'HH:mm')} - {format(new Date(event.end), 'HH:mm')}
                        </div>
                      )}
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
