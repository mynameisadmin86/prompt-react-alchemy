import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Filter, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalendarTimeline, CalendarEvent, CalendarResource } from './CalendarTimeline';

interface EquipmentCalendarProps {
  date?: Date;
  resources: CalendarResource[];
  events: CalendarEvent[];
  onResourceSelect?: (resourceId: string, selected: boolean) => void;
  onEventClick?: (event: CalendarEvent) => void;
  showLegend?: boolean;
}

export const EquipmentCalendar: React.FC<EquipmentCalendarProps> = ({
  date = new Date(),
  resources: initialResources,
  events,
  onResourceSelect,
  onEventClick,
  showLegend = true,
}) => {
  const [resources, setResources] = useState(initialResources);

  const handleResourceToggle = (resourceId: string) => {
    setResources(prev =>
      prev.map(r =>
        r.id === resourceId ? { ...r, selected: !r.selected } : r
      )
    );
    const resource = resources.find(r => r.id === resourceId);
    onResourceSelect?.(resourceId, !resource?.selected);
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border border-border">
      <Tabs defaultValue="calendar" className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Select Equipment</h2>
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="list" className="flex-1 m-0">
          <div className="p-4">
            <div className="space-y-2">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50"
                >
                  <Checkbox
                    checked={resource.selected}
                    onCheckedChange={() => handleResourceToggle(resource.id)}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{resource.name}</div>
                    {resource.subtitle && (
                      <div className="text-xs text-muted-foreground">{resource.subtitle}</div>
                    )}
                  </div>
                  {resource.status && (
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                        resource.status === 'Leased' && "bg-yellow-100 text-yellow-800",
                        resource.status === 'Owned' && "bg-blue-100 text-blue-800"
                      )}
                    >
                      {resource.status}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="flex-1 flex m-0">
          {/* Left Sidebar - Resource List */}
          <div className="w-64 border-r border-border flex flex-col overflow-hidden">
            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">Equipment Availability</h3>
                <Button variant="ghost" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              {showLegend && (
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-muted-foreground">Planned</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-muted-foreground">Under Maintenance</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className={cn(
                    "flex items-start gap-2 p-3 border-b border-border cursor-pointer hover:bg-muted/50",
                    resource.selected && "bg-muted/30"
                  )}
                  onClick={() => handleResourceToggle(resource.id)}
                >
                  <Checkbox
                    checked={resource.selected}
                    onCheckedChange={() => handleResourceToggle(resource.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {resource.name}
                    </div>
                    {resource.subtitle && (
                      <div className="text-xs text-muted-foreground truncate">{resource.subtitle}</div>
                    )}
                  </div>
                  {resource.status && (
                    <span
                      className={cn(
                        "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0",
                        resource.status === 'Leased' && "bg-yellow-100 text-yellow-800",
                        resource.status === 'Owned' && "bg-blue-100 text-blue-800"
                      )}
                    >
                      {resource.status}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Right - Calendar Timeline */}
          <div className="flex-1 overflow-hidden">
            <CalendarTimeline
              date={date}
              events={events}
              resources={resources}
              onEventClick={onEventClick}
              startHour={0}
              endHour={28}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
