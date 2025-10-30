import { create } from 'zustand';
import { tripService } from '@/api/services/tripService';

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

interface NextPlan {
  TripID: string;
  TripStatus: string;
}

interface CustomerOrderDetail {
  CustomerOrderNo: string;
  ExecutionLegID: string;
  ExecutionLegSeqNo: number;
  ExecutionPlanID: string;
  ExecutionLegBehaviour: string;
  ExecutionLegBehaviourDescription: string;
  DeparturePoint: string;
  DeparturePointDescription: string;
  ArrivalPoint: string;
  ArrivalPointDescription: string;
  NextPlan: NextPlan[];
}

interface ExecutionLegDetail {
  LegSequence: number;
  LegID: string;
  LegIDDescription: string;
  Departure: string;
  DepartureDescription: string;
  Arrival: string;
  ArrivalDescription: string;
  LegBehaviour: string;
  LegBehaviourDescription: string;
  ReasonForUpdate: string | null;
  Remarks: string | null;
  QuickCode1: string | null;
  QuickCodeValue1: string | null;
  ModeFlag: string;
  WarningMsg: string | null;
  CustomerOrderDetails: Array<{
    CustomerOrderNo: string;
    LegUniqueId: string;
  }>;
}

interface TripLegDetail {
  LegSeqNo: number;
  LegBehaviour: string;
  LegBehaviourDescription: string;
  LegID: string;
  LegIDDescription: string;
  DeparturePoint: string;
  DeparturePointDescription: string;
  DepartureDateTime: string;
  ArrivalPoint: string;
  ArrivalPointDescription: string;
  ArrivalDateTime: string;
  TransportMode: string | null;
  SupplierID: string;
  SupplierDescription: string;
  CustomerOrderDetails: CustomerOrderDetail[];
  ExecutionLegDetails: ExecutionLegDetail[];
}

interface TripData {
  Header: {
    TripID: string;
    TripOU: number;
    TripStatus: string;
    TripStatusDescription: string;
  };
  LegDetails: TripLegDetail[];
  WarnningDetails: {
    HeaderWarningMsg: string | null;
  };
}

interface TransportRouteStore {
  routes: TransportRoute[];
  selectedOrder: TransportRoute | null;
  selectedRoute: TransportRoute | null;
  selectedTrip: TripData | null;
  isDrawerOpen: boolean;
  isRouteDrawerOpen: boolean;
  isTripDrawerOpen: boolean;
  highlightedIndexes: number[];
  isLoading: boolean;
  isRouteLoading: boolean;
  error: string | null;
  fetchRoutes: () => void;
  handleCustomerOrderClick: (order: TransportRoute) => void;
  openRouteDrawer: (tripId: string) => Promise<void>;
  openTripDrawer: (tripId: string) => Promise<void>;
  closeDrawer: () => void;
  closeRouteDrawer: () => void;
  closeTripDrawer: () => void;
  highlightRowIndexes: (indexes: number[]) => void;
  addLegPanel: () => void;
  removeLegPanel: (index: number) => void;
  updateLegData: (index: number, field: string, value: any) => void;
  addExecutionLeg: (legIndex: number) => void;
  removeExecutionLeg: (legIndex: number, execLegIndex: number) => void;
  updateExecutionLeg: (legIndex: number, execLegIndex: number, field: string, value: any) => void;
  saveRouteDetails: () => Promise<void>;
  saveTripDetails: () => Promise<void>;
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

// Mock trip data
const mockTripData: TripData = {
  Header: {
    TripID: "TP/2021/00025067",
    TripOU: 4,
    TripStatus: "DR",
    TripStatusDescription: "Draft"
  },
  LegDetails: [
    {
      LegSeqNo: 1,
      LegBehaviour: "LHV",
      LegBehaviourDescription: "Line Haul Vendor",
      LegID: "Leg 2",
      LegIDDescription: "Leg 2",
      DeparturePoint: "10-00002",
      DeparturePointDescription: "East Chennai",
      DepartureDateTime: "2026-02-09 14:39:00",
      ArrivalPoint: "10-00003",
      ArrivalPointDescription: "West Chennai",
      ArrivalDateTime: "2026-02-11 16:39:00",
      TransportMode: null,
      SupplierID: "001912",
      SupplierDescription: "LEMAN SLOVAKIA SPOL. S.R.O.",
      CustomerOrderDetails: [
        {
          CustomerOrderNo: "BR/2025/0273",
          ExecutionLegID: "Leg 1",
          ExecutionLegSeqNo: 1,
          ExecutionPlanID: "EXE/2021/00005688",
          ExecutionLegBehaviour: "Pick",
          ExecutionLegBehaviourDescription: "Pickup",
          DeparturePoint: "10-00001",
          DeparturePointDescription: "North Chennai",
          ArrivalPoint: "10-00002",
          ArrivalPointDescription: "East Chennai",
          NextPlan: [
            {
              TripID: "TP/2021/00025067",
              TripStatus: "Draft"
            }
          ]
        },
        {
          CustomerOrderNo: "BR/2025/0275",
          ExecutionLegID: "Leg 1",
          ExecutionLegSeqNo: 1,
          ExecutionPlanID: "EXE/2021/00005689",
          ExecutionLegBehaviour: "Pick",
          ExecutionLegBehaviourDescription: "Pickup",
          DeparturePoint: "10-00001",
          DeparturePointDescription: "North Chennai",
          ArrivalPoint: "10-00002",
          ArrivalPointDescription: "East Chennai",
          NextPlan: [
            {
              TripID: "TP/2021/00025008",
              TripStatus: "Initiated"
            },
            {
              TripID: "TP/2021/00025009",
              TripStatus: "Initiated"
            },
            {
              TripID: "TP/2021/00025067",
              TripStatus: "Draft"
            }
          ]
        }
      ],
      ExecutionLegDetails: [
        {
          LegSequence: 1,
          LegID: "Leg 2",
          LegIDDescription: "Line Haul Vendor",
          Departure: "10-00002",
          DepartureDescription: "East Chennai",
          Arrival: "10-00003",
          ArrivalDescription: "West Chennai",
          LegBehaviour: "LHV",
          LegBehaviourDescription: "Line Haul Vendor",
          ReasonForUpdate: null,
          Remarks: null,
          QuickCode1: null,
          QuickCodeValue1: null,
          ModeFlag: "NoChange",
          WarningMsg: null,
          CustomerOrderDetails: [
            {
              CustomerOrderNo: "BR/2025/0273",
              LegUniqueId: "5D939448-DAF8-4832-B130-5527C8A1AB22"
            },
            {
              CustomerOrderNo: "BR/2025/0275",
              LegUniqueId: "05585CB9-F4F8-4F64-AC3E-A5909113A865"
            }
          ]
        }
      ]
    },
    {
      LegSeqNo: 2,
      LegBehaviour: "LHV",
      LegBehaviourDescription: "Line Haul Vendor",
      LegID: "Leg 3",
      LegIDDescription: "Leg 3",
      DeparturePoint: "10-00003",
      DeparturePointDescription: "West Chennai",
      DepartureDateTime: "2026-02-11 18:00:00",
      ArrivalPoint: "10-00004",
      ArrivalPointDescription: "South Chennai",
      ArrivalDateTime: "2026-02-12 10:00:00",
      TransportMode: null,
      SupplierID: "001913",
      SupplierDescription: "TRANSPORT CO LTD",
      CustomerOrderDetails: [
        {
          CustomerOrderNo: "BR/2025/0273",
          ExecutionLegID: "Leg 2",
          ExecutionLegSeqNo: 2,
          ExecutionPlanID: "EXE/2021/00005688",
          ExecutionLegBehaviour: "Dvry",
          ExecutionLegBehaviourDescription: "Delivery",
          DeparturePoint: "10-00003",
          DeparturePointDescription: "West Chennai",
          ArrivalPoint: "10-00004",
          ArrivalPointDescription: "South Chennai",
          NextPlan: []
        }
      ],
      ExecutionLegDetails: [
        {
          LegSequence: 1,
          LegID: "Leg 3",
          LegIDDescription: "Line Haul Vendor",
          Departure: "10-00003",
          DepartureDescription: "West Chennai",
          Arrival: "10-00004",
          ArrivalDescription: "South Chennai",
          LegBehaviour: "LHV",
          LegBehaviourDescription: "Line Haul Vendor",
          ReasonForUpdate: null,
          Remarks: null,
          QuickCode1: null,
          QuickCodeValue1: null,
          ModeFlag: "NoChange",
          WarningMsg: null,
          CustomerOrderDetails: [
            {
              CustomerOrderNo: "BR/2025/0273",
              LegUniqueId: "6E949558-EBF9-5943-CC41-6638D9B4DCDD"
            }
          ]
        }
      ]
    }
  ],
  WarnningDetails: {
    HeaderWarningMsg: null
  }
};

export const useTransportRouteStore = create<TransportRouteStore>((set, get) => ({
  routes: [],
  selectedOrder: null,
  selectedRoute: null,
  selectedTrip: null,
  isDrawerOpen: false,
  isRouteDrawerOpen: false,
  isTripDrawerOpen: false,
  highlightedIndexes: [],
  isLoading: false,
  isRouteLoading: false,
  error: null,

  fetchRoutes: () => {
    // Keep mock population; API call happens in openRouteDrawer per requirement
    set({ routes: mockRoutes });
  },

  handleCustomerOrderClick: (order: TransportRoute) => {
    set({ selectedOrder: order, isDrawerOpen: true });
  },

  openRouteDrawer: async (tripId: string) => {
    try {
      set({ isRouteLoading: true, error: null });
      const apiParams = { TripId: tripId };
      const response: any = await tripService.getplantriplevelupdate(apiParams);
      
      if (response?.data?.ResponseData) {
        const parsedResponse = JSON.parse(response.data.ResponseData);
        console.log('API Response for CO Selection:', parsedResponse);
        console.log('Is array?', Array.isArray(parsedResponse));
        console.log('Array length:', Array.isArray(parsedResponse) ? parsedResponse.length : 'Not an array');
        
        // Handle array response - get the first object
        const responseData = Array.isArray(parsedResponse) ? parsedResponse[0] : parsedResponse;
        console.log('Response data (first object):', responseData);
        console.log('LegDetails from API:', responseData?.LegDetails);
        
        // Ensure LegDetails is an array and has proper structure
        const legDetails = Array.isArray(responseData?.LegDetails) 
          ? responseData.LegDetails.map((leg: any, index: number) => ({
              LegSequence: leg.LegSequence || index + 1,
              LegID: leg.LegID || '',
              LegUniqueId: leg.LegUniqueId || `${Date.now()}`,
              Departure: leg.Departure || '',
              DepartureDescription: leg.DepartureDescription || '',
              Arrival: leg.Arrival || '',
              ArrivalDescription: leg.ArrivalDescription || '',
              LegBehaviour: leg.LegBehaviour || 'Pick',
              LegBehaviourDescription: leg.LegBehaviourDescription || 'Pick',
              TransportMode: leg.TransportMode || 'Rail',
              LegStatus: leg.LegStatus || null,
              TripInfo: leg.TripInfo || null,
              ModeFlag: leg.ModeFlag || 'Nochange',
              ReasonForUpdate: leg.ReasonForUpdate || null,
              QCCode1: leg.QCCode1 || null,
              QCCode1Value: leg.QCCode1Value || null,
              Remarks: leg.Remarks || null
            }))
          : [];
        
        // Transform API response to match our TransportRoute interface
        const apiRoute: TransportRoute = {
          ExecutionPlanID: responseData?.ExecutionPlanID || '',
          CustomerOrderID: responseData?.CustomerOrderID || '',
          CustomerID: responseData?.CustomerID || '',
          CustomerName: responseData?.CustomerName || '',
          Service: responseData?.Service || '',
          ServiceDescription: responseData?.ServiceDescription || '',
          SubService: responseData?.SubService || '',
          SubServiceDescription: responseData?.SubServiceDescription || '',
          CODeparture: responseData?.CODeparture || '',
          CODepartureDescription: responseData?.CODepartureDescription || '',
          COArrival: responseData?.COArrival || '',
          COArrivalDescription: responseData?.COArrivalDescription || '',
          RouteID: responseData?.RouteID || '',
          RouteDescription: responseData?.RouteDescription || '',
          Status: responseData?.Status || '',
          LegDetails: legDetails,
          ReasonForUpdate: responseData?.ReasonForUpdate || ""
        };
        
        set({ 
          selectedRoute: apiRoute, 
          isRouteDrawerOpen: true,
          isRouteLoading: false 
        });
      } else {
        set({ isRouteDrawerOpen: true, isRouteLoading: false });
      }
    } catch (error) {
      console.error('Error fetching route details:', error);
      set({ 
        error: 'Failed to load route details. Please try again.',
        isRouteLoading: false,
        isRouteDrawerOpen: true
      });
    }
  },

  closeDrawer: () => {
    set({ isDrawerOpen: false, selectedOrder: null });
  },

  closeRouteDrawer: () => {
    set({ isRouteDrawerOpen: false, selectedRoute: null });
  },

  openTripDrawer: async (tripId: string) => {
    // Simulate API call - in real scenario, fetch from backend
    set({ selectedTrip: mockTripData, isTripDrawerOpen: true });
  },

  closeTripDrawer: () => {
    set({ isTripDrawerOpen: false, selectedTrip: null });
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

  addExecutionLeg: (legIndex: number) => {
    const { selectedTrip } = get();
    if (!selectedTrip) return;

    const newExecLeg: ExecutionLegDetail = {
      LegSequence: (selectedTrip.LegDetails[legIndex].ExecutionLegDetails?.length || 0) + 1,
      LegID: '',
      LegIDDescription: '',
      Departure: '',
      DepartureDescription: '',
      Arrival: '',
      ArrivalDescription: '',
      LegBehaviour: 'Pick',
      LegBehaviourDescription: 'Pick',
      ReasonForUpdate: null,
      Remarks: null,
      QuickCode1: null,
      QuickCodeValue1: null,
      ModeFlag: 'NoChange',
      WarningMsg: null,
      CustomerOrderDetails: []
    };

    const updatedLegDetails = [...selectedTrip.LegDetails];
    updatedLegDetails[legIndex] = {
      ...updatedLegDetails[legIndex],
      ExecutionLegDetails: [...updatedLegDetails[legIndex].ExecutionLegDetails, newExecLeg]
    };

    set({
      selectedTrip: {
        ...selectedTrip,
        LegDetails: updatedLegDetails
      }
    });
  },

  removeExecutionLeg: (legIndex: number, execLegIndex: number) => {
    const { selectedTrip } = get();
    if (!selectedTrip) return;

    const updatedLegDetails = [...selectedTrip.LegDetails];
    updatedLegDetails[legIndex] = {
      ...updatedLegDetails[legIndex],
      ExecutionLegDetails: updatedLegDetails[legIndex].ExecutionLegDetails.filter((_, i) => i !== execLegIndex)
    };

    set({
      selectedTrip: {
        ...selectedTrip,
        LegDetails: updatedLegDetails
      }
    });
  },

  updateExecutionLeg: (legIndex: number, execLegIndex: number, field: string, value: any) => {
    const { selectedTrip } = get();
    if (!selectedTrip) return;

    const updatedLegDetails = [...selectedTrip.LegDetails];
    const updatedExecLegs = [...updatedLegDetails[legIndex].ExecutionLegDetails];
    updatedExecLegs[execLegIndex] = {
      ...updatedExecLegs[execLegIndex],
      [field]: value
    };

    updatedLegDetails[legIndex] = {
      ...updatedLegDetails[legIndex],
      ExecutionLegDetails: updatedExecLegs
    };

    set({
      selectedTrip: {
        ...selectedTrip,
        LegDetails: updatedLegDetails
      }
    });
  },

  saveTripDetails: async () => {
    const { selectedTrip } = get();
    if (!selectedTrip) return;

    // Simulate API call
    console.log('Saving trip details:', selectedTrip);
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