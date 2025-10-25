import { create } from 'zustand';

interface TripInfo {
  TripID: string;
  Departure: string;
  DepartureDescription: string;
  Arrival: string;
  ArrivalDescription: string;
  DepartureActualDate: string;
  ArrivalActualDate: string;
  LoadType: string;
  TripStatus: string;
  DraftBillNo: string | null;
  DraftBillStatus: string | null;
  DraftBillWarning: string | null;
  SupplierID: string;
  SupplierDescription: string;
}

interface LegDetail {
  LegSequence: number;
  LegID: string;
  LegUniqueId: string;
  Departure: string;
  DepartureDescription: string;
  Arrival: string;
  ArrivalDescription: string;
  LegBehaviour: string;
  LegBehaviourDescription: string;
  TransportMode: string;
  LegStatus: string | null;
  TripInfo: TripInfo[] | null;
  ModeFlag: string;
  ReasonForUpdate: string | null;
  QCCode1: string | null;
  QCCode1Value: string | null;
  Remarks: string | null;
}

interface TransportRoute {
  ExecutionPlanID: string;
  CustomerOrderID: string;
  CustomerID: string;
  CustomerName: string;
  Service: string;
  ServiceDescription: string;
  SubService: string;
  SubServiceDescription: string;
  CODeparture: string;
  CODepartureDescription: string;
  COArrival: string;
  COArrivalDescription: string;
  RouteID: string;
  RouteDescription: string;
  Status: string;
  LegDetails: LegDetail[];
  ReasonForUpdate: string;
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
  fetchDepartures: (params: { searchTerm: string; offset: number; limit: number }) => Promise<{ label: string; value: string }[]>;
  fetchArrivals: (params: { searchTerm: string; offset: number; limit: number }) => Promise<{ label: string; value: string }[]>;
}

// Mock data
const mockRoutes: TransportRoute[] = [
  {
    ExecutionPlanID: "EXE/2021/00002761",
    CustomerOrderID: "BR/2021/00009245",
    CustomerID: "10026536",
    CustomerName: "KAZPHOSPHATE LLC",
    Service: "CT",
    ServiceDescription: "SINGLE CONTAINER TRANSPORT",
    SubService: "WW",
    SubServiceDescription: "WITH WAGON",
    CODeparture: "27-706709",
    CODepartureDescription: "Assa ( 27-706709- )",
    COArrival: "80-154807",
    COArrivalDescription: "Hürth-Kalscheuren ( 80-15480-7 )",
    RouteID: "YP_Route9",
    RouteDescription: "YP_Route9",
    Status: "INCMPLT",
    LegDetails: [
      {
        LegSequence: 1,
        LegID: "YP_Leg7",
        LegUniqueId: "4349296C-B419-4442-BBF6-B88E693CBDCC",
        Departure: "27-706709",
        DepartureDescription: "Assa ( 27-706709- )",
        Arrival: "20-RU",
        ArrivalDescription: "Ossinki ( 20-RU- )",
        LegBehaviour: "Pick",
        LegBehaviourDescription: "Pick",
        TransportMode: "Rail",
        LegStatus: "CF",
        TripInfo: [
          {
            TripID: "TP/2021/00002557",
            Departure: "27-706709",
            DepartureDescription: "Assa ( 27-706709- )",
            Arrival: "20-RU",
            ArrivalDescription: "Ossinki ( 20-RU- )",
            DepartureActualDate: "2021-09-20 03:31:00",
            ArrivalActualDate: "2021-09-20 03:31:20",
            LoadType: "Loaded",
            TripStatus: "Initiated",
            DraftBillNo: null,
            DraftBillStatus: null,
            DraftBillWarning: null,
            SupplierID: "010221",
            SupplierDescription: "CER HUNGARY ZRT"
          }
        ],
        ModeFlag: "Nochange",
        ReasonForUpdate: null,
        QCCode1: null,
        QCCode1Value: null,
        Remarks: null
      },
      {
        LegSequence: 2,
        LegID: "YP_Leg8",
        LegUniqueId: "D53D38DB-E5A3-48DE-A995-06F1A46F2216",
        Departure: "20-RU",
        DepartureDescription: "Ossinki ( 20-RU- )",
        Arrival: "21-130505",
        ArrivalDescription: "Brest-Zevernui Eks ( 21-130505- )",
        LegBehaviour: "LHV",
        LegBehaviourDescription: "LHV",
        TransportMode: "Rail",
        LegStatus: "AC",
        TripInfo: null,
        ModeFlag: "Nochange",
        ReasonForUpdate: null,
        QCCode1: null,
        QCCode1Value: null,
        Remarks: null
      },
      {
        LegSequence: 3,
        LegID: "YP_leg5",
        LegUniqueId: "E0E49D3C-6D4E-480E-B321-902C2BA2AFBD",
        Departure: "21-130505",
        DepartureDescription: "Brest-Zevernui Eks ( 21-130505- )",
        Arrival: "80-000136",
        ArrivalDescription: "Hamburg-Waltershof ( 80-136- )",
        LegBehaviour: "LHV",
        LegBehaviourDescription: "LHV",
        TransportMode: "Rail",
        LegStatus: null,
        TripInfo: null,
        ModeFlag: "Nochange",
        ReasonForUpdate: null,
        QCCode1: null,
        QCCode1Value: null,
        Remarks: null
      },
      {
        LegSequence: 4,
        LegID: "YP_Leg6",
        LegUniqueId: "E70126E3-AF16-4392-845B-D11A3EA89C9A",
        Departure: "80-000136",
        DepartureDescription: "Hamburg-Waltershof ( 80-136- )",
        Arrival: "80-154807",
        ArrivalDescription: "Hürth-Kalscheuren ( 80-15480-7 )",
        LegBehaviour: "Dvry",
        LegBehaviourDescription: "Dvry",
        TransportMode: "Rail",
        LegStatus: null,
        TripInfo: null,
        ModeFlag: "Nochange",
        ReasonForUpdate: null,
        QCCode1: null,
        QCCode1Value: null,
        Remarks: null
      }
    ],
    ReasonForUpdate: ""
  },
  {
    ExecutionPlanID: "EXE/2021/00002762",
    CustomerOrderID: "BR/2021/00009246",
    CustomerID: "10026537",
    CustomerName: "Transport Solutions Ltd",
    Service: "MT",
    ServiceDescription: "MULTI CONTAINER TRANSPORT",
    SubService: "WW",
    SubServiceDescription: "WITH WAGON",
    CODeparture: "27-706709",
    CODepartureDescription: "Berlin ( 27-706709- )",
    COArrival: "21-130505",
    COArrivalDescription: "Poland ( 21-130505- )",
    RouteID: "YP_Route10",
    RouteDescription: "YP_Route10",
    Status: "PRTDLV",
    LegDetails: [],
    ReasonForUpdate: ""
  },
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
    // Simulate API call - in real scenario, fetch from backend
    set({ selectedRoute: route, isRouteDrawerOpen: true });
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

    const newLeg: LegDetail = {
      LegSequence: (selectedRoute.LegDetails?.length || 0) + 1,
      LegID: '',
      LegUniqueId: crypto.randomUUID(),
      Departure: '',
      DepartureDescription: '',
      Arrival: '',
      ArrivalDescription: '',
      LegBehaviour: 'Pick',
      LegBehaviourDescription: 'Pick',
      TransportMode: 'Rail',
      LegStatus: null,
      TripInfo: null,
      ModeFlag: 'Nochange',
      ReasonForUpdate: null,
      QCCode1: null,
      QCCode1Value: null,
      Remarks: null
    };

    set({
      selectedRoute: {
        ...selectedRoute,
        LegDetails: [...selectedRoute.LegDetails, newLeg]
      }
    });
  },

  removeLegPanel: (index: number) => {
    const { selectedRoute } = get();
    if (!selectedRoute) return;

    const updatedLegs = selectedRoute.LegDetails.filter((_, i) => i !== index);
    set({
      selectedRoute: {
        ...selectedRoute,
        LegDetails: updatedLegs
      }
    });
  },

  updateLegData: (index: number, field: string, value: any) => {
    const { selectedRoute } = get();
    if (!selectedRoute) return;

    const updatedLegs = [...selectedRoute.LegDetails];
    updatedLegs[index] = {
      ...updatedLegs[index],
      [field]: value
    };

    set({
      selectedRoute: {
        ...selectedRoute,
        LegDetails: updatedLegs
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
      route.ExecutionPlanID === selectedRoute.ExecutionPlanID ? selectedRoute : route
    );

    set({ routes: updatedRoutes });
  },

  fetchDepartures: async ({ searchTerm, offset, limit }) => {
    // Simulate API call
    const mockDepartures = [
      { label: 'Assa ( 27-706709- )', value: '27-706709' },
      { label: 'Berlin ( 27-706709- )', value: '27-706709' },
      { label: 'Ossinki ( 20-RU- )', value: '20-RU' },
      { label: 'Brest-Zevernui Eks ( 21-130505- )', value: '21-130505' },
      { label: 'Hamburg-Waltershof ( 80-136- )', value: '80-000136' },
      { label: 'Dresden ( 80-000136- )', value: '80-000136' }
    ];

    return mockDepartures.filter(o => 
      o.label.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(offset, offset + limit);
  },

  fetchArrivals: async ({ searchTerm, offset, limit }) => {
    // Simulate API call
    const mockArrivals = [
      { label: 'Ossinki ( 20-RU- )', value: '20-RU' },
      { label: 'Brest-Zevernui Eks ( 21-130505- )', value: '21-130505' },
      { label: 'Hamburg-Waltershof ( 80-136- )', value: '80-000136' },
      { label: 'Hürth-Kalscheuren ( 80-15480-7 )', value: '80-154807' },
      { label: 'Poland ( 21-130505- )', value: '21-130505' },
      { label: 'Czech Republic', value: 'czech_republic' }
    ];

    return mockArrivals.filter(d => 
      d.label.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(offset, offset + limit);
  }
}));
