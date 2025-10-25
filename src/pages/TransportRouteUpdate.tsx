import React, { useEffect } from 'react';
import { SmartGrid } from '@/components/SmartGrid';
import { SideDrawer } from '@/components/ui/side-drawer';
import { CustomerOrderDetailsDrawer } from '@/components/drawer/CustomerOrderDetailsDrawer';
import { TransportRouteLegDrawer } from '@/components/drawer/TransportRouteLegDrawer';
import { useTransportRouteStore } from '@/stores/transportRouteStore';
import { GridColumnConfig } from '@/types/smartgrid';

const TransportRouteUpdate: React.FC = () => {
  const {
    routes,
    selectedOrder,
    selectedRoute,
    isDrawerOpen,
    isRouteDrawerOpen,
    highlightedIndexes,
    fetchRoutes,
    handleCustomerOrderClick,
    openRouteDrawer,
    closeDrawer,
    closeRouteDrawer,
    highlightRowIndexes,
    addLegPanel,
    removeLegPanel,
    updateLegData,
    saveRouteDetails,
    fetchDepartures,
    fetchArrivals
  } = useTransportRouteStore();

  useEffect(() => {
    fetchRoutes();
    // Example: Highlight rows at index 1 and 5
    highlightRowIndexes([1, 5]);
  }, [fetchRoutes, highlightRowIndexes]);

  const columns: GridColumnConfig[] = [
    {
      key: 'CustomerOrderID',
      label: 'Customer Order No.',
      type: 'Link' as const,
      width: 160,
      sortable: true,
      filterable: true,
      onClick: (row: any) => openRouteDrawer(row)
    },
    {
      key: 'Status',
      label: 'CO Status',
      type: 'Badge' as const,
      width: 160,
      sortable: true,
      filterable: true,
      statusMap: {
        'Confirmed': 'bg-green-100 text-green-800 border-green-200 border',
        'PRTDLV': 'bg-yellow-100 text-yellow-800 border-yellow-200 border',
        'Partial-Delivered': 'bg-yellow-100 text-yellow-800 border-yellow-200 border',
        'Closed': 'bg-red-100 text-red-800 border-red-200 border',
        'INCMPLT': 'bg-orange-100 text-orange-800 border-orange-200 border',
        'In-Complete': 'bg-orange-100 text-orange-800 border-orange-200 border',
        'Fully-Delivered': 'bg-emerald-100 text-emerald-800 border-emerald-200 border'
      }
    },
    {
      key: 'CODepartureDescription',
      label: 'Departure',
      type: 'Text' as const,
      width: 140,
      sortable: true,
      filterable: true
    },
    {
      key: 'COArrivalDescription',
      label: 'Arrival',
      type: 'Text' as const,
      width: 140,
      sortable: true,
      filterable: true
    },
    {
      key: 'ServiceDescription',
      label: 'Service',
      type: 'Text' as const,
      width: 180,
      sortable: true,
      filterable: true
    },
    {
      key: 'SubServiceDescription',
      label: 'Sub-Service',
      type: 'Text' as const,
      width: 180,
      sortable: true,
      filterable: true
    },
    {
      key: 'RouteDescription',
      label: 'Route',
      type: 'Text' as const,
      width: 120,
      sortable: true,
      filterable: true
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

      {/* Customer Order Details Drawer */}
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
        {selectedOrder && (
          <div className="p-6">
            <p className="text-sm text-muted-foreground">Customer order details would go here</p>
          </div>
        )}
      </SideDrawer>

      {/* Transport Route Leg Drawer */}
      <SideDrawer
        isOpen={isRouteDrawerOpen}
        onClose={closeRouteDrawer}
        title="Transport Route Details"
        width="100%"
        showFooter={false}
      >
        {selectedRoute && (
          <TransportRouteLegDrawer
            route={selectedRoute}
            onAddLeg={addLegPanel}
            onRemoveLeg={removeLegPanel}
            onUpdateLeg={updateLegData}
            onSave={saveRouteDetails}
            fetchDepartures={fetchDepartures}
            fetchArrivals={fetchArrivals}
          />
        )}
      </SideDrawer>
    </div>
  );
};

export default TransportRouteUpdate;
