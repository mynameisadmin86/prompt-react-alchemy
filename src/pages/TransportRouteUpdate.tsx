import React, { useEffect } from 'react';
import { SmartGrid } from '@/components/SmartGrid';
import { SideDrawer } from '@/components/ui/side-drawer';
import { CustomerOrderDetailsDrawer } from '@/components/drawer/CustomerOrderDetailsDrawer';
import { useTransportRouteStore } from '@/stores/transportRouteStore';
import { GridColumnConfig } from '@/types/smartgrid';

const TransportRouteUpdate: React.FC = () => {
  const {
    routes,
    selectedOrder,
    isDrawerOpen,
    highlightedIndexes,
    fetchRoutes,
    handleCustomerOrderClick,
    closeDrawer,
    highlightRowIndexes
  } = useTransportRouteStore();

  useEffect(() => {
    fetchRoutes();
    // Example: Highlight rows at index 1 and 5
    highlightRowIndexes([1, 5]);
  }, [fetchRoutes, highlightRowIndexes]);

  const columns: GridColumnConfig[] = [
    {
      key: 'CustomerOrderNo',
      label: 'Customer Order No.',
      type: 'Link' as const,
      width: 160,
      sortable: true,
      filterable: true,
      onClick: (row: any) => handleCustomerOrderClick(row)
    },
    {
      key: 'COStatus',
      label: 'CO Status',
      type: 'Badge' as const,
      width: 160,
      sortable: true,
      filterable: true,
      statusMap: {
        'Confirmed': 'bg-green-100 text-green-800 border-green-200 border',
        'Partial-Delivered': 'bg-yellow-100 text-yellow-800 border-yellow-200 border',
        'Closed': 'bg-red-100 text-red-800 border-red-200 border',
        'In-Complete': 'bg-orange-100 text-orange-800 border-orange-200 border',
        'Fully-Delivered': 'bg-emerald-100 text-emerald-800 border-emerald-200 border'
      }
    },
    {
      key: 'Departure',
      label: 'Departure',
      type: 'Text' as const,
      width: 140,
      sortable: true,
      filterable: true
    },
    {
      key: 'Arrival',
      label: 'Arrival',
      type: 'Text' as const,
      width: 140,
      sortable: true,
      filterable: true
    },
    {
      key: 'DepartureDate',
      label: 'Departure Date',
      type: 'Text' as const,
      width: 180,
      sortable: true,
      filterable: true
    },
    {
      key: 'ArrivalDate',
      label: 'Arrival Date',
      type: 'Text' as const,
      width: 180,
      sortable: true,
      filterable: true
    },
    {
      key: 'Mode',
      label: 'Mode',
      type: 'Text' as const,
      width: 120,
      sortable: true,
      filterable: true
    },
    {
      key: 'LegExecuted',
      label: 'Leg Executed',
      type: 'Text' as const,
      width: 120,
      sortable: true,
      filterable: true
    },
    {
      key: 'LegDetails',
      label: 'Leg Details',
      type: 'Text' as const,
      width: 100
    }
  ];

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 overflow-hidden">
        <SmartGrid
          columns={columns}
          data={routes}
          highlightedRowIndices={highlightedIndexes}
          gridTitle="Transport Route Update"
          recordCount={routes.length}
        />
      </div>

      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title="Customer Order Details"
        width="80%"
        showFooter={true}
        footerButtons={[
          {
            label: 'Close',
            variant: 'outline',
            action: closeDrawer
          }
        ]}
      >
        {selectedOrder && <CustomerOrderDetailsDrawer order={selectedOrder} />}
      </SideDrawer>
    </div>
  );
};

export default TransportRouteUpdate;
