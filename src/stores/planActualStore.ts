import { create } from 'zustand';

export interface ActualsData {
  // Wagon Details
  wagonType?: string;
  wagonId?: string;
  wagonQuantity?: string;
  wagonQuantityUnit?: string;
  wagonTareWeight?: string;
  wagonTareWeightUnit?: string;
  wagonGrossWeight?: string;
  wagonGrossWeightUnit?: string;
  wagonLength?: string;
  wagonLengthUnit?: string;
  wagonSequence?: string;

  // Container Details
  containerType?: string;
  containerId?: string;
  containerQuantity?: string;
  containerQuantityUnit?: string;
  containerTareWeight?: string;
  containerTareWeightUnit?: string;
  containerLoadWeight?: string;
  containerLoadWeightUnit?: string;

  // Product Details
  hazardousGoods?: boolean;
  nhm?: string;
  productId?: string;
  productQuantity?: string;
  productQuantityUnit?: string;
  classOfStores?: string;
  unCode?: string;
  dgClass?: string;

  // THU Details
  thuId?: string;
  thuQuantity?: string;
  thuQuantityUnit?: string;
  thuGrossWeight?: string;
  thuGrossWeightUnit?: string;
  thuTareWeight?: string;
  thuTareWeightUnit?: string;
  thuNetWeight?: string;
  thuNetWeightUnit?: string;
  thuLength?: string;
  thuLengthUnit?: string;
  thuWidth?: string;
  thuWidthUnit?: string;
  thuHeight?: string;
  thuHeightUnit?: string;

  // Journey Details
  departure?: string;
  destination?: string;
  fromDate?: string;
  fromTime?: string;
  toDate?: string;
  toTime?: string;

  // Other Details
  qcUserdefined1?: string;
  qcUserdefined2?: string;
  qcUserdefined3?: string;
  remarks1?: string;
  remarks2?: string;
  remarks3?: string;
}

export interface PlannedData {
  // Wagon Details
  wagonType?: string;
  wagonId?: string;
  wagonQuantity?: string;
  wagonTareWeight?: string;
  wagonGrossWeight?: string;
  wagonLength?: string;
  wagonSequence?: string;

  // Container Details
  containerType?: string;
  containerId?: string;
  containerQuantity?: string;
  containerTareWeight?: string;
  containerLoadWeight?: string;

  // Product Details
  hazardousGoods?: string;
  nhm?: string;
  productId?: string;
  productQuantity?: string;
  classOfStores?: string;
  unCode?: string;
  dgClass?: string;

  // THU Details
  thuId?: string;
  thuQuantity?: string;
  thuGrossWeight?: string;
  thuTareWeight?: string;
  thuNetWeight?: string;
  thuLength?: string;
  thuWidth?: string;
  thuHeight?: string;

  // Journey Details
  departure?: string;
  destination?: string;
  fromDate?: string;
  fromTime?: string;
  toDate?: string;
  toTime?: string;

  // Other Details
  qcUserdefined1?: string;
  qcUserdefined2?: string;
  qcUserdefined3?: string;
  remarks1?: string;
  remarks2?: string;
  remarks3?: string;
}

export interface WagonItemData {
  id: string;
  planned: PlannedData;
  actuals: ActualsData;
}

interface PlanActualStore {
  wagonItems: Record<string, WagonItemData>;
  activeWagonId: string | null;
  setActiveWagon: (id: string) => void;
  updatePlannedData: (wagonId: string, data: Partial<PlannedData>) => void;
  updateActualsData: (wagonId: string, data: Partial<ActualsData>) => void;
  getWagonData: (wagonId: string) => WagonItemData | null;
  initializeWagon: (wagonId: string) => void;
  loadActualsFromJson: (jsonData: any[]) => void;
  loadPlannedFromJson: (jsonData: any[]) => void;
  exportActualsToJson: () => any[];
  exportPlannedToJson: () => any[];
  getAllWagonIds: () => string[];
}

const createDefaultWagonData = (id: string): WagonItemData => ({
  id,
  planned: {},
  actuals: {},
});

export const usePlanActualStore = create<PlanActualStore>((set, get) => ({
  wagonItems: {
    'WAG00000001': createDefaultWagonData('WAG00000001'),
    'WAG00000002': createDefaultWagonData('WAG00000002'),
    'WAG00000003': createDefaultWagonData('WAG00000003'),
    'WAG00000004': createDefaultWagonData('WAG00000004'),
  },
  activeWagonId: 'WAG00000001',

  setActiveWagon: (id) =>
    set({ activeWagonId: id }),

  initializeWagon: (wagonId) =>
    set((state) => ({
      wagonItems: {
        ...state.wagonItems,
        [wagonId]: state.wagonItems[wagonId] || createDefaultWagonData(wagonId),
      },
    })),

  updatePlannedData: (wagonId, data) =>
    set((state) => ({
      wagonItems: {
        ...state.wagonItems,
        [wagonId]: {
          ...state.wagonItems[wagonId],
          planned: {
            ...state.wagonItems[wagonId]?.planned,
            ...data,
          },
        },
      },
    })),

  updateActualsData: (wagonId, data) =>
    set((state) => ({
      wagonItems: {
        ...state.wagonItems,
        [wagonId]: {
          ...state.wagonItems[wagonId],
          actuals: {
            ...state.wagonItems[wagonId]?.actuals,
            ...data,
          },
        },
      },
    })),

  getWagonData: (wagonId) => {
    const state = get();
    return state.wagonItems[wagonId] || null;
  },

  getAllWagonIds: () => {
    const state = get();
    return Object.keys(state.wagonItems);
  },

  loadActualsFromJson: (jsonData) => {
    const newWagonItems: Record<string, WagonItemData> = {};
    
    jsonData.forEach((item, index) => {
      const wagonId = item.Wagon || `WAGON_${index + 1}`;
      
      newWagonItems[wagonId] = {
        id: wagonId,
        planned: {},
        actuals: {
          wagonType: item.WagonType,
          wagonId: item.Wagon,
          wagonQuantity: item.WagonQty?.toString(),
          wagonQuantityUnit: item.WagonQtyUOM,
          wagonTareWeight: item.WagonTareWeight,
          wagonTareWeightUnit: item.WagonTareWeightUOM,
          wagonGrossWeight: item.WagonGrossWeight,
          wagonGrossWeightUnit: item.WagonGrossWeightUOM,
          wagonLength: item.WagonLength,
          wagonLengthUnit: item.WagonLengthUOM,
          wagonSequence: item.Seqno,
          
          containerType: item.ContainerType,
          containerId: item.ContainerId,
          containerQuantity: item.ContainerQty?.toString(),
          containerQuantityUnit: item.ContainerQtyUOM,
          containerTareWeight: item.ContainerTareWeight,
          containerTareWeightUnit: item.ContainerTareWeightUOM,
          containerLoadWeight: item.ProductWeight,
          containerLoadWeightUnit: item.ProductWeightUOM,
          
          hazardousGoods: item.ContainsHazardousGoods === '1',
          nhm: item.NHM,
          productId: item.Product,
          productQuantity: item.ProductWeight,
          productQuantityUnit: item.ProductWeightUOM,
          classOfStores: item.ClassOfStores,
          unCode: item.UNCode,
          dgClass: item.DGClass,
          
          thuId: item.Thu,
          thuQuantity: item.ThuQty?.toString(),
          thuQuantityUnit: item.ThuWeightUOM,
          thuGrossWeight: item.ThuWeight,
          thuGrossWeightUnit: item.ThuWeightUOM,
          thuTareWeight: item.ThuTareWeight,
          thuTareWeightUnit: item.ThuWeightUOM,
          
          departure: item.ShuntInLocation,
          destination: item.ShuntOutLocation,
          fromDate: item.ShuntInDate,
          fromTime: item.ShuntInTime,
          toDate: item.ShuntOutDate,
          toTime: item.ShuntOutTime,
          
          qcUserdefined1: item.QuickCode1,
          qcUserdefined2: item.QuickCode2,
          qcUserdefined3: item.QuickCode3,
          remarks1: item.Remarks1,
          remarks2: item.Remarks2,
          remarks3: item.Remarks3,
        },
      };
    });
    
    set({ 
      wagonItems: newWagonItems,
      activeWagonId: Object.keys(newWagonItems)[0] || null
    });
  },

  loadPlannedFromJson: (jsonData) => {
    const newWagonItems: Record<string, WagonItemData> = {};
    
    jsonData.forEach((item, index) => {
      const wagonId = item.WagonId || `WAGON_${index + 1}`;
      
      newWagonItems[wagonId] = {
        id: wagonId,
        actuals: {},
        planned: {
          wagonType: item.WagonType,
          wagonId: item.WagonId,
          wagonQuantity: item.WagonQty?.toString(),
          wagonTareWeight: item.WagonTareWeight,
          wagonGrossWeight: item.GrossWeight,
          wagonLength: item.WagonLength,
          wagonSequence: item.Seqno,
          
          containerType: item.ContainerType,
          containerId: item.ContainerId,
          containerQuantity: item.ContainerQty?.toString(),
          containerTareWeight: item.ContainerAvgTareWeight,
          containerLoadWeight: item.ContainerAvgLoadWeight,
          
          hazardousGoods: item.ContainsHazardousGoods,
          nhm: item.NHM,
          productId: item.Product,
          productQuantity: item.ProductWeight,
          classOfStores: item.ClassOfStores,
          unCode: item.UNCode,
          dgClass: item.DGClass,
          
          thuId: item.ThuId,
          thuQuantity: item.ThuQty?.toString(),
          thuGrossWeight: item.ThuWeight,
          thuTareWeight: item.ThuTareWeight,
          thuNetWeight: item.ThuNetWeight,
          thuLength: item.ThuLength,
          thuWidth: item.ThuWidth,
          thuHeight: item.ThuHeight,
          
          departure: item.Departure,
          destination: item.Arrival,
          fromDate: item.FromDate,
          fromTime: item.FromTime,
          toDate: item.ToDate,
          toTime: item.ToTime,
          
          qcUserdefined1: item.QuickCode1,
          qcUserdefined2: item.QuickCode2,
          qcUserdefined3: item.QuickCode3,
          remarks1: item.Remarks1,
          remarks2: item.Remarks2,
          remarks3: item.Remarks3,
        },
      };
    });
    
    set({ 
      wagonItems: newWagonItems,
      activeWagonId: Object.keys(newWagonItems)[0] || null
    });
  },

  exportActualsToJson: () => {
    const state = get();
    return Object.values(state.wagonItems).map((wagon) => ({
      Seqno: wagon.actuals.wagonSequence || '1',
      PlanToActualCopy: null,
      WagonPosition: null,
      WagonType: wagon.actuals.wagonType,
      Wagon: wagon.actuals.wagonId,
      WagonDescription: wagon.actuals.wagonId,
      WagonQty: wagon.actuals.wagonQuantity ? Number(wagon.actuals.wagonQuantity) : null,
      WagonQtyUOM: wagon.actuals.wagonQuantityUnit,
      ContainerType: wagon.actuals.containerType,
      ContainerId: wagon.actuals.containerId,
      ContainerDescription: wagon.actuals.containerId,
      ContainerQty: wagon.actuals.containerQuantity ? Number(wagon.actuals.containerQuantity) : null,
      ContainerQtyUOM: wagon.actuals.containerQuantityUnit,
      Product: wagon.actuals.productId,
      ProductWeight: wagon.actuals.productQuantity,
      ProductWeightUOM: wagon.actuals.productQuantityUnit,
      Thu: wagon.actuals.thuId,
      ThuSerialNo: null,
      ThuQty: wagon.actuals.thuQuantity ? Number(wagon.actuals.thuQuantity) : null,
      ThuWeight: wagon.actuals.thuGrossWeight,
      ThuWeightUOM: wagon.actuals.thuGrossWeightUnit,
      ShuntingOption: null,
      ReplacedWagon: null,
      ShuntingReasonCode: null,
      Remarks: null,
      ShuntInLocation: wagon.actuals.departure,
      ShuntInLocationDescription: wagon.actuals.departure || 'UD',
      ShuntOutLocation: wagon.actuals.destination,
      ShuntOutLocationDescription: wagon.actuals.destination || 'UD',
      ShuntInDate: wagon.actuals.fromDate,
      ShuntInTime: wagon.actuals.fromTime,
      ShuntOutDate: wagon.actuals.toDate,
      ShuntOutTime: wagon.actuals.toTime,
      ClassOfStores: wagon.actuals.classOfStores,
      NHM: wagon.actuals.nhm,
      NHMDescription: wagon.actuals.nhm,
      UNCode: wagon.actuals.unCode,
      UNCodeDescription: wagon.actuals.unCode,
      DGClass: wagon.actuals.dgClass,
      ContainsHazardousGoods: wagon.actuals.hazardousGoods ? '1' : '0',
      WagonSealNo: null,
      ContainerSealNo: null,
      ContainerTareWeight: wagon.actuals.containerTareWeight,
      ContainerTareWeightUOM: wagon.actuals.containerTareWeightUnit,
      LastCommodityTransported1: null,
      LastCommodityTransportedDate1: null,
      LastCommodityTransported2: null,
      LastCommodityTransportedDate2: null,
      LastCommodityTransported3: null,
      LastCommodityTransportedDate3: null,
      WagonTareWeight: wagon.actuals.wagonTareWeight,
      WagonTareWeightUOM: wagon.actuals.wagonTareWeightUnit,
      WagonLength: wagon.actuals.wagonLength,
      WagonLengthUOM: wagon.actuals.wagonLengthUnit,
      QuickCode1: wagon.actuals.qcUserdefined1,
      QuickCode2: wagon.actuals.qcUserdefined2,
      QuickCode3: wagon.actuals.qcUserdefined3,
      QuickCodeValue1: null,
      QuickCodeValue2: null,
      QuickCodeValue3: null,
      Remarks1: wagon.actuals.remarks1,
      Remarks2: wagon.actuals.remarks2,
      Remarks3: wagon.actuals.remarks3,
      ModeFlag: 'Nochange',
    }));
  },

  exportPlannedToJson: () => {
    const state = get();
    return Object.values(state.wagonItems).map((wagon) => ({
      Seqno: wagon.planned.wagonSequence || '1',
      WagonType: wagon.planned.wagonType,
      WagonId: wagon.planned.wagonId,
      WagonDescription: wagon.planned.wagonId || 'UD',
      WagonQty: wagon.planned.wagonQuantity ? Number(wagon.planned.wagonQuantity) : null,
      WagonAvgLoadWeight: null,
      WagonWeightUOM: 'TON',
      ContainerType: wagon.planned.containerType,
      ContainerId: wagon.planned.containerId,
      ContainerDescription: wagon.planned.containerId || 'UD',
      WagonAvgTareWeight: wagon.planned.wagonTareWeight,
      WagonAvgLength: wagon.planned.wagonLength,
      WagonAvgLengthUOM: null,
      ContainerQty: wagon.planned.containerQuantity ? Number(wagon.planned.containerQuantity) : null,
      ContainerAvgTareWeight: wagon.planned.containerTareWeight,
      ContainerAvgLoadWeight: wagon.planned.containerLoadWeight,
      ContainerWeightUOM: 'TON',
      Product: wagon.planned.productId,
      ProductWeight: wagon.planned.productQuantity,
      ProductWeightUOM: 'TON',
      ThuId: wagon.planned.thuId,
      ThuSerialNo: null,
      ThuQty: wagon.planned.thuQuantity ? Number(wagon.planned.thuQuantity) : 1,
      ThuWeight: wagon.planned.thuGrossWeight,
      ThuWeightUOM: 'TON',
      Remarks1: wagon.planned.remarks1,
      Remarks2: wagon.planned.remarks2,
      Remarks3: wagon.planned.remarks3,
      WagonTareWeight: wagon.planned.wagonTareWeight,
      WagonTareWeightUOM: null,
      GrossWeight: wagon.planned.wagonGrossWeight,
      GrossWeightUOM: null,
      WagonLength: wagon.planned.wagonLength,
      WagonLengthUOM: null,
      LastCommodityTransported1: null,
      LastCommodityTransportedDate1: null,
      LastCommodityTransported2: null,
      LastCommodityTransportedDate2: null,
      LastCommodityTransported3: null,
      LastCommodityTransportedDate3: null,
      Modeflag: 'Nochange',
    }));
  },
}));
