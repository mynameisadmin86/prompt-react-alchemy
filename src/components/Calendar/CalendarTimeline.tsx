import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  color?: string;
  resourceId?: string;
}

export interface CalendarResource {
  id: string;
  name: string;
  subtitle?: string;
  status?: string;
  selected?: boolean;
}

interface CalendarTimelineProps {
  date: Date;
  events: CalendarEvent[];
  resources: CalendarResource[];
  startHour?: number;
  endHour?: number;
  hourWidth?: number;
  onEventClick?: (event: CalendarEvent) => void;
}

export const CalendarTimeline: React.FC<CalendarTimelineProps> = ({
  date,
  events,
  resources,
  startHour = 0,
  endHour = 24,
  hourWidth = 80,
  onEventClick,
}) => {
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let i = startHour; i <= endHour; i++) {
      const hour = i % 24;
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      slots.push(`${displayHour} ${period}`);
    }
    return slots;
  }, [startHour, endHour]);

  const getEventPosition = (event: CalendarEvent) => {
    const eventStart = event.startTime.getHours() + event.startTime.getMinutes() / 60;
    const eventEnd = event.endTime.getHours() + event.endTime.getMinutes() / 60;
    
    const left = ((eventStart - startHour) / (endHour - startHour)) * 100;
    const width = ((eventEnd - eventStart) / (endHour - startHour)) * 100;
    
    return { left: `${left}%`, width: `${width}%` };
  };

  const getEventColor = (color?: string) => {
    const colors: Record<string, string> = {
      yellow: 'bg-yellow-200 border-yellow-400 text-yellow-900',
      blue: 'bg-blue-200 border-blue-400 text-blue-900',
      orange: 'bg-orange-200 border-orange-400 text-orange-900',
      green: 'bg-green-200 border-green-400 text-green-900',
      purple: 'bg-purple-200 border-purple-400 text-purple-900',
    };
    return colors[color || 'blue'] || colors.blue;
  };

  const filteredResources = resources.filter(r => r.selected);

  return (
    <div className="flex flex-col h-full">
      {/* Date Header */}
      <div className="flex items-center justify-center py-4 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">
          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </h3>
      </div>

      {/* Time Header */}
      <div className="flex border-b border-border bg-muted/30">
        <div className="w-48 flex-shrink-0" />
        <div className="flex flex-1 overflow-x-auto">
          {timeSlots.map((slot, idx) => (
            <div
              key={idx}
              className="text-xs text-muted-foreground text-center py-2 flex-shrink-0"
              style={{ minWidth: `${hourWidth}px` }}
            >
              {slot}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        {filteredResources.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select equipment to view availability
          </div>
        ) : (
          filteredResources.map((resource) => {
            const resourceEvents = events.filter(e => e.resourceId === resource.id);
            
            return (
              <div key={resource.id} className="flex border-b border-border hover:bg-muted/20">
                {/* Resource Info */}
                <div className="w-48 flex-shrink-0 p-3 border-r border-border">
                  <div className="text-sm font-medium text-foreground">{resource.name}</div>
                  {resource.subtitle && (
                    <div className="text-xs text-muted-foreground mt-1">{resource.subtitle}</div>
                  )}
                  {resource.status && (
                    <div className="mt-2">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                          resource.status === 'Leased' && "bg-yellow-100 text-yellow-800",
                          resource.status === 'Owned' && "bg-blue-100 text-blue-800"
                        )}
                      >
                        {resource.status}
                      </span>
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div className="flex-1 relative" style={{ minHeight: '80px' }}>
                  {/* Time Grid Lines */}
                  <div className="absolute inset-0 flex">
                    {timeSlots.map((_, idx) => (
                      <div
                        key={idx}
                        className="border-r border-border/50 flex-shrink-0"
                        style={{ minWidth: `${hourWidth}px` }}
                      />
                    ))}
                  </div>

                  {/* Events */}
                  {resourceEvents.map((event) => {
                    const position = getEventPosition(event);
                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute top-2 h-10 rounded border-l-4 px-2 flex items-center cursor-pointer",
                          "hover:shadow-md transition-shadow",
                          getEventColor(event.color)
                        )}
                        style={{
                          left: position.left,
                          width: position.width,
                          minWidth: '60px',
                        }}
                        onClick={() => onEventClick?.(event)}
                      >
                        <span className="text-xs font-medium truncate">{event.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
