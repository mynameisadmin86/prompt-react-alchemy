import React, { useRef, useEffect, useState, useMemo } from 'react';
import { DynamicPanel, DynamicPanelRef } from '@/components/DynamicPanel';
import { PanelConfig } from '@/types/dynamicPanel';
import { manageTripStore } from '@/stores/mangeTripStore';
import { quickOrderService } from '@/api/services/quickOrderService';

interface TripFormProps {
  tripExecutionRef: React.RefObject<DynamicPanelRef>;
}

export const TripForm: React.FC<TripFormProps> = ({
  tripExecutionRef,
}) => {
  const { tripData, fetchTrip, updateHeaderField } = manageTripStore();
  const [tripType, setTripType] = useState(tripData?.Header?.IsRoundTrip || "0");
  const [qcList1, setqcList1] = useState<any>();
  const [qcList2, setqcList2] = useState<any>();
  const [qcList3, setqcList3] = useState<any>();
  const [formData, setFormData] = useState<Record<string, any>>(() => buildTripExecutionFormData(tripData)); // Reintroduce and initialize formData

  // utils/formMappers.ts - Moved from TripExecutionLanding.tsx
  function buildTripExecutionFormData(currentTripData: any) {
    const header = currentTripData?.Header || {};

    return {
      IsRoundTrip: header.IsRoundTrip ?? "0",
      TrainNo: header.TrainNo ?? "",
      Cluster: header.Cluster ?? "",
      ForwardTripID: header.ForwardTripID ?? "",
      ReturnTripID: header.ReturnTripID ?? "",
      SupplierRefNo: header.SupplierRefNo ?? "",
      QCUserDefined1: (() => {
        if (header.QCUserDefined1 && typeof header.QCUserDefined1 === "object") {
          return {
            input: header.QCUserDefined1.input ?? header.QCUserDefined1Value ?? "",
            dropdown: header.QCUserDefined1.dropdown ?? header.QCUserDefined1Value ?? ""
          };
        }
        return {
          input: header.QuickCodeValue1 ?? "",
          dropdown: header.QuickCode1 ?? ""
        };
      })(),
      QCUserDefined2: (() => {
        if (header.QCUserDefined2 && typeof header.QCUserDefined2 === "object") {
          return {
            input: header.QCUserDefined2.input ?? header.QCUserDefined2Value ?? "",
            dropdown: header.QCUserDefined2.dropdown ?? header.QCUserDefined2Value ?? ""
          };
        }
        return {
          input: header.QuickCodeValue2 ?? "",
          dropdown: header.QuickCode2 ?? ""
        };
      })(),
      QCUserDefined3: (() => {
        if (header.QCUserDefined3 && typeof header.QCUserDefined3 === "object") {
          return {
            input: header.QCUserDefined3.input ?? header.QCUserDefined3Value ?? "",
            dropdown: header.QCUserDefined3.dropdown ?? header.QCUserDefined3Value ?? ""
          };
        }
        return {
          input: header.QuickCodeValue3 ?? "",
          dropdown: header.QuickCode3 ?? ""
        };
      })(),
      Remarks1: header.Remarks1 ?? "",
      Remarks2: header.Remarks2 ?? "",
      Remarks3: header.Remarks3 ?? "",
    };
  }

  // Trip Execution form configuration for editable fields only
  const tripExecutionPanelConfig: PanelConfig = useMemo(() => {
    return {
      IsRoundTrip: {
        id: 'IsRoundTrip',
        label: '',
        fieldType: 'radio',
        value: tripType || "0",
        mandatory: false,
        visible: true,
        editable: true,
        order: 1,
        options: [
          { label: 'One Way', value: '0' },
          { label: 'Round Trip', value: '1' }
        ],
        events: {
          onChange: (val: string) => {
            setTripType(val); // Update local tripType state
            if (val === "1") {
              updateHeaderField("IsRoundTrip", "1", "Update");
              updateHeaderField("IsOneWay", "0", "Update");
            } else {
              updateHeaderField("IsRoundTrip", "0", "Update");
              updateHeaderField("IsOneWay", "1", "Update");
            }
          }
        }
      },
      TrainNo: {
        id: 'TrainNo',
        label: 'Train No.',
        fieldType: 'text',
        width: 'half',
        value: formData?.TrainNo || "", // Bind to local formData
        mandatory: true,
        visible: true,
        editable: true,
        order: 2,
        maxLength: 40,
        placeholder: 'Enter Train No.',
        events: {
          onChange: (val: string) => {
            updateHeaderField("TrainNo", val, "Update");
          }
        }
      },
      Cluster: {
        id: 'Cluster',
        label: 'Cluster',
        fieldType: 'lazyselect',
        width: 'half',
        value: formData?.Cluster || "", // Bind to local formData
        mandatory: false,
        visible: true,
        editable: true,
        order: 3,
        hideSearch: true,
        disableLazyLoading: false,
        fetchOptions: async ({ searchTerm, offset, limit }) => {
          const response = await quickOrderService.getMasterCommonData({
            messageType: "Cluster Init",
            searchTerm: searchTerm || '',
            offset,
            limit,
          });
          const rr: any = response.data
          return (JSON.parse(rr.ResponseData) || []).map((item: any) => ({
            ...(item.id !== undefined && item.id !== '' && item.name !== undefined && item.name !== ''
              ? {
                label: `${item.id} || ${item.name}`,
                value: `${item.id} || ${item.name}`,
              }
              : {})
          }));
        },
      },
      ForwardTripID: {
        id: 'ForwardTripID',
        label: 'Forward Trip Plan ID',
        fieldType: 'text',
        width: 'half',
        value: formData?.ForwardTripID || "", // Bind to local formData
        mandatory: false,
        visible: String(tripType) === "1", // Ensure comparison is always with string "1"
        editable: true,
        order: 4,
        maxLength: 40,
        placeholder: 'Enter Forward Trip ID'
      },
      ReturnTripID: {
        id: 'ReturnTripID',
        label: 'Return Trip Plan ID',
        fieldType: 'text',
        width: 'half',
        value: formData?.ReturnTripID || "", // Bind to local formData
        mandatory: false,
        visible: String(tripType) === "1", // Ensure comparison is always with string "1"
        editable: true,
        order: 4,
        maxLength: 40,
        placeholder: 'Enter Return Trip ID'
      },
      SupplierRefNo: {
        id: 'SupplierRefNo',
        label: 'Supplier Ref. No.',
        fieldType: 'text',
        width: 'full',
        value: formData?.SupplierRefNo || "", // Bind to local formData
        mandatory: false,
        visible: true,
        editable: true,
        order: 4,
        maxLength: 40,
        placeholder: 'Enter Supplier Ref. No.'
      },
      QCUserDefined1: {
        id: 'QCUserDefined1',
        label: 'QC Userdefined 1',
        fieldType: 'inputdropdown',
        width: 'full',
        value: formData.QCUserDefined1 || { input: '', dropdown: '' }, // Bind to local formData
        mandatory: false,
        visible: true,
        editable: true,
        order: 5,
        maxLength: 255,
        options: qcList1?.filter((qc: any) => qc.id).map((qc: any) => ({ label: qc.name, value: qc.id })),
      },
      QCUserDefined2: {
        id: 'QCUserDefined2',
        label: 'QC Userdefined 2',
        fieldType: 'inputdropdown',
        width: 'full',
        value: formData.QCUserDefined2 || { input: '', dropdown: '' }, // Bind to local formData
        mandatory: false,
        visible: true,
        editable: true,
        order: 5,
        maxLength: 255,
        options: qcList2?.filter((qc: any) => qc.id).map((qc: any) => ({ label: qc.name, value: qc.id })),
      },
      QCUserDefined3: {
        id: 'QCUserDefined3',
        label: 'QC Userdefined 3',
        fieldType: 'inputdropdown',
        width: 'full',
        value: formData.QCUserDefined3 || { input: '', dropdown: '' }, // Bind to local formData
        mandatory: false,
        visible: true,
        editable: true,
        order: 5,
        maxLength: 255,
        options: qcList3?.filter((qc: any) => qc.id).map((qc: any) => ({ label: qc.name, value: qc.id })),
      },
      Remarks1: {
        id: 'Remarks1',
        label: 'Remarks 1',
        fieldType: 'text',
        width: 'full',
        value: formData?.Remarks1 || '',
        mandatory: false,
        visible: true,
        editable: true,
        order: 6,
        placeholder: 'Enter Remarks',
        maxLength: 500,
      },
      Remarks2: {
        id: 'Remarks2',
        label: 'Remarks 2',
        fieldType: 'text',
        width: 'full',
        value: formData?.Remarks2 || '',
        mandatory: false,
        visible: true,
        editable: true,
        order: 6,
        placeholder: 'Enter Remarks',
        maxLength: 500,
      },
      Remarks3: {
        id: 'Remarks3',
        label: 'Remarks 3',
        fieldType: 'text',
        width: 'full',
        value: formData?.Remarks3 || '',
        mandatory: false,
        visible: true,
        editable: true,
        order: 6,
        placeholder: 'Enter Remarks',
        maxLength: 500,
      },
    };
  }, [tripType, qcList1, qcList2, qcList3, updateHeaderField]); // Dependencies for useMemo (removed tripData, formData)

  // Map IsRoundTrip -> TripType - Moved from TripExecutionLanding.tsx
  useEffect(() => {
    if (tripData?.Header) {
      const roundTripValue = String(tripData.Header.IsRoundTrip); // Explicitly cast to string
      setTripType(roundTripValue === "1" ? "1" : "0"); // Simplify comparison as it's now always a string
    }
  }, [tripData?.Header?.IsRoundTrip]);

  // Populate formData when tripData changes (for initial load and store updates)
  const prevTripDataRef = useRef<any>(null); // Explicitly type useRef to handle TripData or null
  useEffect(() => {
    // Only update formData if tripData content has actually changed (deep comparison not needed for simple changes)
    if (tripData && JSON.stringify(tripData) !== JSON.stringify(prevTripDataRef.current)) {
      const mapped = buildTripExecutionFormData(tripData);
      setFormData(mapped);
    }
    prevTripDataRef.current = tripData; // Store current tripData for next comparison
  }, [tripData]); // Depend on tripData for updates

  // Handle data change from DynamicPanel - Moved from TripExecutionLanding.tsx
  const handleDataChange = (data: Record<string, any>) => {
    Object.entries(data).forEach(([key, val]) => {
      updateHeaderField(key as any, val, "Update"); // Update store
    });
    setFormData(prev => ({ ...prev, ...data })); // Update local formData to control DynamicPanel
  };

  // New useEffect to fetch qcList1, qcList2, qcList3 (if needed, otherwise remove)
  // Assuming qcLists are fetched internally by TripForm if not passed
  useEffect(() => {
    const fetchQcData = async (messageType: string, setQcList: React.Dispatch<React.SetStateAction<any>>) => {
      try {
        const data: any = await quickOrderService.getMasterCommonData({ messageType });
        const parsedData = JSON.parse(data?.data?.ResponseData) || [];
        setQcList(parsedData);
      } catch (error) {
        console.error(`TripForm: Error fetching ${messageType}`, error);
      }
    };

    fetchQcData("Trip Log QC1 Combo Init", setqcList1);
    fetchQcData("Trip Log QC2 Combo Init", setqcList2);
    fetchQcData("Trip Log QC3 Combo Init", setqcList3);
  }, []); // Only run once on mount

  return (
    <>
      <DynamicPanel
        key={tripType} // Revert to tripType for controlled remounts on type change
        ref={tripExecutionRef}
        panelId="trip-execution-panel"
        panelTitle="Trip Details"
        panelConfig={tripExecutionPanelConfig} // Use the memoized config
        initialData={formData} // Pass local formData as initialData
        // onDataChange={handleDataChange} // Re-enabled to allow data flow back
      />
      {/* Debug JSON View */}
      {/* <div className="mt-4 p-4 border rounded-md bg-gray-50">
        <h3 className="font-medium mb-2">TripForm Data (formData)</h3>
        <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-[300px]">
          {JSON.stringify(formData, null, 2)} // Display formData
        </pre>
      </div> */}
    </>
  );
};
