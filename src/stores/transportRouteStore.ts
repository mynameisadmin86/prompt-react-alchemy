import { create } from 'zustand';

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
}

interface TransportRouteStore {
  routes: TransportRoute[];
  selectedOrder: TransportRoute | null;
  isDrawerOpen: boolean;
  highlightedIndexes: number[];
  fetchRoutes: () => void;
  handleCustomerOrderClick: (order: TransportRoute) => void;
  closeDrawer: () => void;
  highlightRowIndexes: (indexes: number[]) => void;
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

export const useTransportRouteStore = create<TransportRouteStore>((set) => ({
  routes: [],
  selectedOrder: null,
  isDrawerOpen: false,
  highlightedIndexes: [],

  fetchRoutes: () => {
    // Simulate API call
    set({ routes: mockRoutes });
  },

  handleCustomerOrderClick: (order: TransportRoute) => {
    set({ selectedOrder: order, isDrawerOpen: true });
  },

  closeDrawer: () => {
    set({ isDrawerOpen: false, selectedOrder: null });
  },

  highlightRowIndexes: (indexes: number[]) => {
    set({ highlightedIndexes: indexes });
  }
}));
