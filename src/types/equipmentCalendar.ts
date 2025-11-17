export interface EquipmentItem {
  id: string;
  title: string;
  supplier: string;
  status: 'owned' | 'leased' | 'maintenance';
}

export interface EquipmentCalendarEvent {
  id: string;
  equipmentId: string;
  label: string;
  type: 'trip' | 'maintenance' | 'hold';
  start: string; // ISO timestamp
  end: string; // ISO timestamp
  color?: string; // CSS color
}

export interface EquipmentCalendarViewProps {
  equipments: EquipmentItem[];
  events: EquipmentCalendarEvent[];
  view: 'day' | 'week' | 'month';
  startDate: Date;
  onViewChange: (view: 'day' | 'week' | 'month') => void;
  onBarClick?: (event: EquipmentCalendarEvent) => void;
  onEquipmentClick?: (equipment: EquipmentItem) => void;
  scrollSyncKey?: string;
  enableDrag?: boolean;
}
