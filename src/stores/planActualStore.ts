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
  shuntInLocation?: string;
  shuntOutLocation?: string;
  shuntInDate?: string;
  shuntInTime?: string;
  shuntOutDate?: string;
  shuntOutTime?: string;

  // Other Details
  quickCode1?: string;
  quickCode2?: string;
  quickCode3?: string;
  quickCodeValue1?: string;
  quickCodeValue2?: string;
  quickCodeValue3?: string;
  remarks1?: string;
  remarks2?: string;
  remarks3?: string;
  wagonSealNo?: string;
  containerSealNo?: string;
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
  loadFromJson: (jsonData: any[]) => void;
  exportToJson: () => any[];
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

  loadFromJson: (jsonData) =>
    set(() => {
      const wagonItems: Record<string, WagonItemData> = {};
      
      jsonData.forEach((item, index) => {
        const wagonId = item.Wagon || `WAG${String(index + 1).padStart(8, '0')}`;
        
        wagonItems[wagonId] = {
          id: wagonId,
          planned: {},
          actuals: {
            wagonType: item.WagonType,
            wagonId: item.Wagon,
            wagonQuantity: item.WagonQty?.toString(),
            wagonQuantityUnit: item.WagonQtyUOM,
            wagonTareWeight: item.WagonTareWeight,
            wagonTareWeightUnit: item.WagonTareWeightUOM,
            wagonLength: item.WagonLength,
            wagonLengthUnit: item.WagonLengthUOM,
            wagonSequence: item.WagonPosition,
            containerType: item.ContainerType,
            containerId: item.ContainerId,
            containerQuantity: item.ContainerQty?.toString(),
            containerQuantityUnit: item.ContainerQtyUOM,
            containerTareWeight: item.ContainerTareWeight,
            containerTareWeightUnit: item.ContainerTareWeightUOM,
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
            thuQuantityUnit: 'EA',
            thuGrossWeight: item.ThuWeight,
            thuGrossWeightUnit: item.ThuWeightUOM,
            thuLength: item.ThuLength,
            thuWidth: item.ThuWidth,
            thuHeight: item.ThuHeight,
            shuntInLocation: item.ShuntInLocation,
            shuntOutLocation: item.ShuntOutLocation,
            shuntInDate: item.ShuntInDate,
            shuntInTime: item.ShuntInTime,
            shuntOutDate: item.ShuntOutDate,
            shuntOutTime: item.ShuntOutTime,
            quickCode1: item.QuickCode1,
            quickCode2: item.QuickCode2,
            quickCode3: item.QuickCode3,
            quickCodeValue1: item.QuickCodeValue1,
            quickCodeValue2: item.QuickCodeValue2,
            quickCodeValue3: item.QuickCodeValue3,
            remarks1: item.Remarks1,
            remarks2: item.Remarks2,
            remarks3: item.Remarks3,
            wagonSealNo: item.WagonSealNo,
            containerSealNo: item.ContainerSealNo,
          },
        };
      });

      return {
        wagonItems,
        activeWagonId: Object.keys(wagonItems)[0] || null,
      };
    }),

  exportToJson: () => {
    const state = get();
    return Object.values(state.wagonItems).map((wagon) => ({
      Seqno: wagon.actuals.wagonSequence || '1',
      WagonType: wagon.actuals.wagonType,
      Wagon: wagon.actuals.wagonId,
      WagonDescription: wagon.actuals.wagonId,
      WagonQty: wagon.actuals.wagonQuantity ? Number(wagon.actuals.wagonQuantity) : null,
      WagonQtyUOM: wagon.actuals.wagonQuantityUnit,
      WagonTareWeight: wagon.actuals.wagonTareWeight,
      WagonTareWeightUOM: wagon.actuals.wagonTareWeightUnit,
      WagonLength: wagon.actuals.wagonLength,
      WagonLengthUOM: wagon.actuals.wagonLengthUnit,
      WagonPosition: wagon.actuals.wagonSequence,
      ContainerType: wagon.actuals.containerType,
      ContainerId: wagon.actuals.containerId,
      ContainerDescription: wagon.actuals.containerId,
      ContainerQty: wagon.actuals.containerQuantity ? Number(wagon.actuals.containerQuantity) : null,
      ContainerQtyUOM: wagon.actuals.containerQuantityUnit,
      ContainerTareWeight: wagon.actuals.containerTareWeight,
      ContainerTareWeightUOM: wagon.actuals.containerTareWeightUnit,
      ContainsHazardousGoods: wagon.actuals.hazardousGoods ? '1' : '0',
      NHM: wagon.actuals.nhm,
      Product: wagon.actuals.productId,
      ProductWeight: wagon.actuals.productQuantity,
      ProductWeightUOM: wagon.actuals.productQuantityUnit,
      ClassOfStores: wagon.actuals.classOfStores,
      UNCode: wagon.actuals.unCode,
      DGClass: wagon.actuals.dgClass,
      Thu: wagon.actuals.thuId,
      ThuQty: wagon.actuals.thuQuantity ? Number(wagon.actuals.thuQuantity) : null,
      ThuWeight: wagon.actuals.thuGrossWeight,
      ThuWeightUOM: wagon.actuals.thuGrossWeightUnit,
      ThuLength: wagon.actuals.thuLength,
      ThuWidth: wagon.actuals.thuWidth,
      ThuHeight: wagon.actuals.thuHeight,
      ShuntInLocation: wagon.actuals.shuntInLocation,
      ShuntOutLocation: wagon.actuals.shuntOutLocation,
      ShuntInDate: wagon.actuals.shuntInDate,
      ShuntInTime: wagon.actuals.shuntInTime,
      ShuntOutDate: wagon.actuals.shuntOutDate,
      ShuntOutTime: wagon.actuals.shuntOutTime,
      QuickCode1: wagon.actuals.quickCode1,
      QuickCode2: wagon.actuals.quickCode2,
      QuickCode3: wagon.actuals.quickCode3,
      QuickCodeValue1: wagon.actuals.quickCodeValue1,
      QuickCodeValue2: wagon.actuals.quickCodeValue2,
      QuickCodeValue3: wagon.actuals.quickCodeValue3,
      Remarks1: wagon.actuals.remarks1,
      Remarks2: wagon.actuals.remarks2,
      Remarks3: wagon.actuals.remarks3,
      WagonSealNo: wagon.actuals.wagonSealNo,
      ContainerSealNo: wagon.actuals.containerSealNo,
      ModeFlag: 'Nochange',
    }));
  },
}));
