import { create } from 'zustand';

interface RouteLeg {
  LegSequence: number;
  LegID: string;
  LegName: string;
  Origin: string;
  Destination: string;
  VehicleNo: string;
  DriverName: string;
  DepartureTime: string;
  ArrivalTime: string;
  Status: string;
  LegBehaviour: string;
  TransportMode: string;
  TripDetails?: string;
}

interface TransportRoute {
  id: string;
  CustomerOrderNo: string;
  COStatus: string;
  Departure: string;
  Arrival: string;
  DepartureDate: string;
  ArrivalDate: string;
  Mode: string;
  LegExecuted: string;
  customerName?: string;
  customerAddress?: string;
  orderDate?: string;
  deliveryDate?: string;
  totalItems?: number;
  FromToLocation?: string;
  Service?: string;
  SubService?: string;
  legs?: RouteLeg[];
}

interface TransportRouteStore {
  routes: TransportRoute[];
  selectedOrder: TransportRoute | null;
  selectedRoute: TransportRoute | null;
  isDrawerOpen: boolean;
  isRouteDrawerOpen: boolean;
  highlightedIndexes: number[];
  fetchRoutes: () => void;
  handleCustomerOrderClick: (order: TransportRoute) => void;
  openRouteDrawer: (route: TransportRoute) => Promise<void>;
  closeDrawer: () => void;
  closeRouteDrawer: () => void;
  highlightRowIndexes: (indexes: number[]) => void;
  addLegPanel: () => void;
  removeLegPanel: (index: number) => void;
  updateLegData: (index: number, field: string, value: any) => void;
  saveRouteDetails: () => Promise<void>;
  fetchOrigins: (params: { searchTerm: string; offset: number; limit: number }) => Promise<{ label: string; value: string }[]>;
  fetchDestinations: (params: { searchTerm: string; offset: number; limit: number }) => Promise<{ label: string; value: string }[]>;
}

// Mock data
const mockRoutes: TransportRoute[] = [
  {
    id: '1',
    CustomerOrderNo: 'CO00000001',
    COStatus: 'Confirmed',
    Departure: 'Berlin',
    Arrival: 'Czech Republic',
    DepartureDate: '25-Mar-2025 09:22',
    ArrivalDate: '25-Mar-2025 09:22',
    Mode: 'Rail',
    LegExecuted: '0/3',
    customerName: 'ABC Logistics GmbH',
    customerAddress: 'Hauptstraße 123, Berlin, Germany',
    orderDate: '20-Mar-2025',
    deliveryDate: '25-Mar-2025',
    totalItems: 150
  },
  {
    id: '2',
    CustomerOrderNo: 'CO00000002',
    COStatus: 'Partial-Delivered',
    Departure: 'Berlin',
    Arrival: 'Poland',
    DepartureDate: '25-Mar-2025 09:22',
    ArrivalDate: '25-Mar-2025 09:22',
    Mode: 'Rail',
    LegExecuted: '0/3',
    customerName: 'Transport Solutions Ltd',
    customerAddress: 'Alexanderplatz 45, Berlin, Germany',
    orderDate: '21-Mar-2025',
    deliveryDate: '26-Mar-2025',
    totalItems: 200
  },
  {
    id: '3',
    CustomerOrderNo: 'CO00000003',
    COStatus: 'Confirmed',
    Departure: 'Berlin',
    Arrival: 'Hannover',
    DepartureDate: '25-Mar-2025 09:22',
    ArrivalDate: '25-Mar-2025 09:22',
    Mode: 'Multimodal',
    LegExecuted: '0/3',
    customerName: 'Express Cargo Services',
    customerAddress: 'Friedrichstraße 78, Berlin, Germany',
    orderDate: '22-Mar-2025',
    deliveryDate: '25-Mar-2025',
    totalItems: 95
  },
  {
    id: '4',
    CustomerOrderNo: 'CO00000004',
    COStatus: 'Confirmed',
    Departure: 'Frankfurt',
    Arrival: 'Berlin',
    DepartureDate: '25-Mar-2025 09:22',
    ArrivalDate: '25-Mar-2025 09:22',
    Mode: 'Rail',
    LegExecuted: '0/3',
    customerName: 'Deutsche Spedition AG',
    customerAddress: 'Müllerstraße 56, Frankfurt, Germany',
    orderDate: '19-Mar-2025',
    deliveryDate: '25-Mar-2025',
    totalItems: 180
  },
  {
    id: '5',
    CustomerOrderNo: 'CO00000005',
    COStatus: 'Closed',
    Departure: 'Dresden',
    Arrival: 'Czech Republic',
    DepartureDate: '25-Mar-2025 09:22',
    ArrivalDate: '25-Mar-2025 09:22',
    Mode: 'Rail',
    LegExecuted: '0/3',
    customerName: 'Cargo Masters International',
    customerAddress: 'Königstraße 12, Dresden, Germany',
    orderDate: '18-Mar-2025',
    deliveryDate: '24-Mar-2025',
    totalItems: 120
  },
  {
    id: '6',
    CustomerOrderNo: 'CO00000006',
    COStatus: 'In-Complete',
    Departure: 'Czech Republic',
    Arrival: 'Berlin',
    DepartureDate: '25-Mar-2025 09:22',
    ArrivalDate: '25-Mar-2025 09:22',
    Mode: 'Multimodal',
    LegExecuted: '0/3',
    customerName: 'Continental Freight Co',
    customerAddress: 'Wenceslas Square 34, Prague, Czech Republic',
    orderDate: '23-Mar-2025',
    deliveryDate: '28-Mar-2025',
    totalItems: 75
  },
  {
    id: '7',
    CustomerOrderNo: 'CO00000007',
    COStatus: 'Fully-Delivered',
    Departure: 'Berlin',
    Arrival: 'MUMES, Mumbai',
    DepartureDate: '25-Mar-2025 09:22',
    ArrivalDate: '25-Mar-2025 09:22',
    Mode: 'Rail',
    LegExecuted: '0/3',
    customerName: 'Global Shipping Partners',
    customerAddress: 'Potsdamer Platz 2, Berlin, Germany',
    orderDate: '15-Mar-2025',
    deliveryDate: '22-Mar-2025',
    totalItems: 300
  },
  {
    id: '8',
    CustomerOrderNo: 'CO00000008',
    COStatus: 'Closed',
    Departure: 'Berlin',
    Arrival: 'Czech Republic',
    DepartureDate: '25-Mar-2025 09:22',
    ArrivalDate: '25-Mar-2025 09:22',
    Mode: 'Rail',
    LegExecuted: '0/3',
    customerName: 'Euro Transport Group',
    customerAddress: 'Unter den Linden 77, Berlin, Germany',
    orderDate: '17-Mar-2025',
    deliveryDate: '24-Mar-2025',
    totalItems: 140
  },
  {
    id: '9',
    CustomerOrderNo: 'CO00000009',
    COStatus: 'Partial-Delivered',
    Departure: 'Frankfurt',
    Arrival: 'Hannover',
    DepartureDate: '25-Mar-2025 09:22',
    ArrivalDate: '25-Mar-2025 09:22',
    Mode: 'Multimodal',
    LegExecuted: '0/3',
    customerName: 'Quick Logistics Solutions',
    customerAddress: 'Bahnhofstraße 89, Frankfurt, Germany',
    orderDate: '21-Mar-2025',
    deliveryDate: '27-Mar-2025',
    totalItems: 165
  },
  {
    id: '10',
    CustomerOrderNo: 'CO00000010',
    COStatus: 'In-Complete',
    Departure: 'Czech Republic',
    Arrival: 'Berlin',
    DepartureDate: '25-Mar-2025 09:22',
    ArrivalDate: '25-Mar-2025 09:22',
    Mode: 'Rail',
    LegExecuted: '0/3',
    customerName: 'Prime Cargo Services',
    customerAddress: 'Masarykova 56, Prague, Czech Republic',
    orderDate: '24-Mar-2025',
    deliveryDate: '29-Mar-2025',
    totalItems: 88
  },
  {
    id: '11',
    CustomerOrderNo: 'CO00000011',
    COStatus: 'Confirmed',
    Departure: 'Hannover',
    Arrival: 'Berlin',
    DepartureDate: '25-Mar-2025 09:22',
    ArrivalDate: '25-Mar-2025 09:22',
    Mode: 'Rail',
    LegExecuted: '0/3',
    customerName: 'Northern Transport Ltd',
    customerAddress: 'Ernst-August-Platz 5, Hannover, Germany',
    orderDate: '22-Mar-2025',
    deliveryDate: '25-Mar-2025',
    totalItems: 110
  },
  {
    id: '12',
    CustomerOrderNo: 'CO00000005',
    COStatus: 'Closed',
    Departure: 'Dresden',
    Arrival: 'Czech Republic',
    DepartureDate: '25-Mar-2025 09:22',
    ArrivalDate: '25-Mar-2025 09:22',
    Mode: 'Rail',
    LegExecuted: '0/3',
    customerName: 'Cargo Masters International',
    customerAddress: 'Königstraße 12, Dresden, Germany',
    orderDate: '18-Mar-2025',
    deliveryDate: '24-Mar-2025',
    totalItems: 120
  },
  {
    id: '13',
    CustomerOrderNo: 'CO00000006',
    COStatus: 'In-Complete',
    Departure: 'Czech Republic',
    Arrival: 'Berlin',
    DepartureDate: '25-Mar-2025 09:22',
    ArrivalDate: '25-Mar-2025 09:22',
    Mode: 'Multimodal',
    LegExecuted: '0/3',
    customerName: 'Continental Freight Co',
    customerAddress: 'Wenceslas Square 34, Prague, Czech Republic',
    orderDate: '23-Mar-2025',
    deliveryDate: '28-Mar-2025',
    totalItems: 75
  }
];

export const useTransportRouteStore = create<TransportRouteStore>((set, get) => ({
  routes: [],
  selectedOrder: null,
  selectedRoute: null,
  isDrawerOpen: false,
  isRouteDrawerOpen: false,
  highlightedIndexes: [],

  fetchRoutes: () => {
    // Simulate API call
    set({ routes: mockRoutes });
  },

  handleCustomerOrderClick: (order: TransportRoute) => {
    set({ selectedOrder: order, isDrawerOpen: true });
  },

  openRouteDrawer: async (route: TransportRoute) => {
    // Simulate API call to fetch detailed route data with legs
    const mockLegs: RouteLeg[] = [
      {
        LegSequence: 1,
        LegID: 'LEG01',
        LegName: 'First Leg',
        Origin: 'Berlin',
        Destination: 'Heidelblick',
        VehicleNo: 'VH-1234',
        DriverName: 'John Doe',
        DepartureTime: '2025-03-25T09:22:00',
        ArrivalTime: '2025-03-25T12:22:00',
        Status: 'Initiated',
        LegBehaviour: 'Pickup',
        TransportMode: 'Rail',
        TripDetails: 'TRIP0000001 : Berlin, 25-Mar-2025 09:22 → Heidelblick, 25-Mar-2025 09:22 | Loaded'
      },
      {
        LegSequence: 2,
        LegID: 'LEG02',
        LegName: 'Second Leg',
        Origin: 'Heidelblick',
        Destination: 'Dresden',
        VehicleNo: 'VH-5678',
        DriverName: 'Jane Smith',
        DepartureTime: '2025-03-25T13:22:00',
        ArrivalTime: '2025-03-25T16:22:00',
        Status: 'Released',
        LegBehaviour: 'Line Haul',
        TransportMode: 'Rail',
        TripDetails: 'TRIP0000002 : Heidelblick, 25-Mar-2025 09:22 → Dresden, 25-Mar-2025 09:22 | Empty'
      },
      {
        LegSequence: 3,
        LegID: 'LEG03',
        LegName: 'Third Leg',
        Origin: 'Dresden',
        Destination: 'Czech Republic',
        VehicleNo: 'VH-9012',
        DriverName: 'Mike Johnson',
        DepartureTime: '2025-03-25T17:22:00',
        ArrivalTime: '2025-03-25T20:22:00',
        Status: 'Planned',
        LegBehaviour: 'Delivery',
        TransportMode: 'Rail',
        TripDetails: 'TRIP0000003 : Dresden, 25-Mar-2025 09:22 → Czech Republic, 25-Mar-2025 09:22'
      }
    ];

    const detailedRoute: TransportRoute = {
      ...route,
      FromToLocation: `${route.Departure} - ${route.Arrival}`,
      Service: 'Block Train Conventional',
      SubService: 'Repair',
      legs: mockLegs
    };

    set({ selectedRoute: detailedRoute, isRouteDrawerOpen: true });
  },

  closeDrawer: () => {
    set({ isDrawerOpen: false, selectedOrder: null });
  },

  closeRouteDrawer: () => {
    set({ isRouteDrawerOpen: false, selectedRoute: null });
  },

  highlightRowIndexes: (indexes: number[]) => {
    set({ highlightedIndexes: indexes });
  },

  addLegPanel: () => {
    const { selectedRoute } = get();
    if (!selectedRoute) return;

    const newLeg: RouteLeg = {
      LegSequence: (selectedRoute.legs?.length || 0) + 1,
      LegID: '',
      LegName: `Leg ${(selectedRoute.legs?.length || 0) + 1}`,
      Origin: '',
      Destination: '',
      VehicleNo: '',
      DriverName: '',
      DepartureTime: '',
      ArrivalTime: '',
      Status: 'Planned',
      LegBehaviour: '',
      TransportMode: 'Rail'
    };

    set({
      selectedRoute: {
        ...selectedRoute,
        legs: [...(selectedRoute.legs || []), newLeg]
      }
    });
  },

  removeLegPanel: (index: number) => {
    const { selectedRoute } = get();
    if (!selectedRoute || !selectedRoute.legs) return;

    const updatedLegs = selectedRoute.legs.filter((_, i) => i !== index);
    set({
      selectedRoute: {
        ...selectedRoute,
        legs: updatedLegs
      }
    });
  },

  updateLegData: (index: number, field: string, value: any) => {
    const { selectedRoute } = get();
    if (!selectedRoute || !selectedRoute.legs) return;

    const updatedLegs = [...selectedRoute.legs];
    updatedLegs[index] = {
      ...updatedLegs[index],
      [field]: value
    };

    set({
      selectedRoute: {
        ...selectedRoute,
        legs: updatedLegs
      }
    });
  },

  saveRouteDetails: async () => {
    const { selectedRoute } = get();
    if (!selectedRoute) return;

    // Simulate API call
    console.log('Saving route details:', selectedRoute);
    
    // Update the route in the routes array
    const { routes } = get();
    const updatedRoutes = routes.map(route => 
      route.id === selectedRoute.id ? selectedRoute : route
    );

    set({ routes: updatedRoutes });
  },

  fetchOrigins: async ({ searchTerm, offset, limit }) => {
    // Simulate API call
    const mockOrigins = [
      { label: 'Berlin', value: 'berlin' },
      { label: 'Hamburg', value: 'hamburg' },
      { label: 'Munich', value: 'munich' },
      { label: 'Frankfurt', value: 'frankfurt' },
      { label: 'Dresden', value: 'dresden' },
      { label: 'Heidelblick', value: 'heidelblick' },
      { label: 'Hannover', value: 'hannover' }
    ];

    return mockOrigins.filter(o => 
      o.label.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(offset, offset + limit);
  },

  fetchDestinations: async ({ searchTerm, offset, limit }) => {
    // Simulate API call
    const mockDestinations = [
      { label: 'Berlin', value: 'berlin' },
      { label: 'Hamburg', value: 'hamburg' },
      { label: 'Munich', value: 'munich' },
      { label: 'Frankfurt', value: 'frankfurt' },
      { label: 'Dresden', value: 'dresden' },
      { label: 'Czech Republic', value: 'czech_republic' },
      { label: 'Poland', value: 'poland' },
      { label: 'Heidelblick', value: 'heidelblick' },
      { label: 'Hannover', value: 'hannover' },
      { label: 'MUMES, Mumbai', value: 'mumbai' }
    ];

    return mockDestinations.filter(d => 
      d.label.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(offset, offset + limit);
  }
}));
