// API response types matching backend structure
export interface TripAdditionalData {
  Name: string;
  Value: string;
}

export interface TripData {
  RefDocNo: string;
  RefDocType: string;
  RefDocStatus: string;
  PlanStart: string; // "YYYY-MM-DD HH:mm"
  PlanEnd: string;   // "YYYY-MM-DD HH:mm"
  AdditionalData?: TripAdditionalData[];
}

export interface ResourceDetail {
  EquipmentType: string;
  EquipmentCode: string;
  EquipmentStatus: string;
  EquipmentContract: string | null;
  ContractAgent: string | null;
  EquipmentGroup: string | null;
  EquipmentOwner: string;
  WeightUOM: string | null;
  AvilableStatus: string;
  IsChecked: number;
  AdditionalData: any | null;
  TripData: TripData[] | null;
}

export interface ResourceCategoryResponse {
  ResourceCategory: string;
  ResourceDetails: ResourceDetail[];
}

// Internal types used by the calendar component
export interface EquipmentItem {
  id: string;
  title: string;
  supplier: string;
  status: 'available' | 'occupied' | 'workshop';
  type?: string;
  capacity?: string;
}

export interface EquipmentCalendarEvent {
  id: string;
  equipmentId: string;
  label: string;
  type: 'trip' | 'maintenance' | 'hold';
  start: string; // ISO timestamp
  end: string; // ISO timestamp
  color?: string;
  status?: string;
  additionalData?: TripAdditionalData[];
}

// Helper functions to transform API data to internal types
export const transformResourceToEquipment = (resource: ResourceDetail): EquipmentItem => {
  const statusMap: Record<string, 'available' | 'occupied' | 'workshop'> = {
    'Available': 'available',
    'Occupied': 'occupied',
    'Workshop': 'workshop',
  };
  
  return {
    id: resource.EquipmentCode,
    title: resource.EquipmentCode,
    supplier: resource.EquipmentOwner || '',
    status: statusMap[resource.EquipmentStatus] || 'available',
    type: resource.EquipmentType,
    capacity: resource.WeightUOM || undefined,
  };
};

export const transformTripDataToEvents = (resource: ResourceDetail): EquipmentCalendarEvent[] => {
  if (!resource.TripData) return [];
  
  return resource.TripData.map((trip, index) => {
    const typeMap: Record<string, 'trip' | 'maintenance' | 'hold'> = {
      'TRIP': 'trip',
      'MAINTENANCE': 'maintenance',
      'HOLD': 'hold',
    };
    
    return {
      id: `${resource.EquipmentCode}-${trip.RefDocNo}-${index}`,
      equipmentId: resource.EquipmentCode,
      label: trip.RefDocNo,
      type: typeMap[trip.RefDocType?.toUpperCase()] || 'trip',
      start: trip.PlanStart.replace(' ', 'T') + ':00',
      end: trip.PlanEnd.replace(' ', 'T') + ':00',
      status: trip.RefDocStatus,
      additionalData: trip.AdditionalData,
    };
  });
};

export interface DateRangeParams {
  view: 'day' | 'week' | 'month';
  startDate: Date;
  endDate: Date;
}

export interface EquipmentCalendarViewProps {
  equipments: EquipmentItem[];
  events: EquipmentCalendarEvent[];
  view: 'day' | 'week' | 'month';
  startDate: Date;
  showHourView: boolean;
  statusFilter: string;
  selectedEquipments: string[];
  onViewChange: (view: 'day' | 'week' | 'month') => void;
  onShowHourViewChange: (show: boolean) => void;
  onStatusFilterChange: (status: string) => void;
  onSelectionChange: (selectedIds: string[]) => void;
  onAddToTrip: (selectedIds: string[]) => void;
  onBarClick?: (event: EquipmentCalendarEvent) => void;
  onEquipmentClick?: (equipment: EquipmentItem) => void;
  scrollSyncKey?: string;
  enableDrag?: boolean;
  /** Filter mode: 'client' filters events locally, 'server' triggers onDateRangeChange for server-side data fetch */
  filterMode?: 'client' | 'server';
  /** Callback when date range changes (for server-side filtering) */
  onDateRangeChange?: (params: DateRangeParams) => void;
  /** Loading state for server-side data fetch */
  isLoading?: boolean;
}
