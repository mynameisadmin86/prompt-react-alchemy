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

interface PlanActualStore {
  actualsData: ActualsData;
  updateActualsData: (data: Partial<ActualsData>) => void;
  resetActualsData: () => void;
}

const initialActualsData: ActualsData = {};

export const usePlanActualStore = create<PlanActualStore>((set) => ({
  actualsData: initialActualsData,

  updateActualsData: (data) =>
    set((state) => ({
      actualsData: {
        ...state.actualsData,
        ...data,
      },
    })),

  resetActualsData: () =>
    set({ actualsData: initialActualsData }),
}));
