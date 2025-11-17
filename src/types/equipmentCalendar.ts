export interface EquipmentItem {
  id: string;
  title: string;
  subtitle?: string;
  supplier: string;
  status: 'owned' | 'leased' | 'maintenance';
  location?: string;
  weight?: string;
}

export interface EquipmentCalendarEvent {
  id: string;
  equipmentId: string;
  label: string;
  type: 'trip' | 'maintenance' | 'hold';
  start: string; // ISO timestamp
  end: string; // ISO timestamp
  color?: string;
}

export type CalendarView = 'day' | 'week' | 'month';
