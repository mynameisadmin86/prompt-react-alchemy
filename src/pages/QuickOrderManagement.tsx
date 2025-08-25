import React, { useState, useEffect, useMemo } from 'react';
import { SmartGridWithGrouping } from '@/components/SmartGrid';
import { GridColumnConfig, FilterConfig } from '@/types/smartgrid';
import { useToast } from '@/hooks/use-toast';
import { quickOrderService } from '@/api/services/quickOrderService';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface QuickOrderData {
  id: string;
  orderType: string;
  supplier: string;
  contract: string;
  cluster: string;
  customer: string;
  customerSupplierRefNo: string;
  draftBillNo: string;
  departurePoint: string;
  arrivalPoint: string;
  serviceType: string;
  serviceFromDate: string;
  serviceToDate: string;
  quickUniqueId: string;
  quickOrderNo: string;
  draftBillStatus: string;
  isBillingFailed: boolean;
  subService: string;
  wbs: string;
  operationalLocation: string;
  primaryRefDoc: string;
  createdBy: string;
  secondaryDoc: string;
  invoiceNo: string;
  invoiceStatus: string;
  resourceType: string;
  wagon: string;
  container: string;
  fromOrderDate: string;
  [key: string]: any;
}

const QuickOrderManagement: React.FC = () => {
  const [data, setData] = useState<QuickOrderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const initialColumns: GridColumnConfig[] = [
    {
      key: 'quickOrderNo',
      label: 'Quick Order No',
      type: 'Link',
      width: 140,
      sortable: true,
      filterable: true,
      onClick: (rowData: any) => {
        console.log('Quick Order clicked:', rowData);
      }
    },
    {
      key: 'orderType',
      label: 'Order Type',
      type: 'Text',
      width: 120,
      sortable: true,
      filterable: true
    },
    {
      key: 'supplier',
      label: 'Supplier',
      type: 'Text',
      width: 150,
      sortable: true,
      filterable: true
    },
    {
      key: 'customer',
      label: 'Customer',
      type: 'Text',
      width: 150,
      sortable: true,
      filterable: true
    },
    {
      key: 'draftBillStatus',
      label: 'Draft Bill Status',
      type: 'Badge',
      width: 130,
      sortable: true,
      filterable: true,
      statusMap: {
        'draft': 'Draft',
        'pending': 'Pending',
        'approved': 'Approved',
        'rejected': 'Rejected'
      }
    },
    {
      key: 'invoiceStatus',
      label: 'Invoice Status',
      type: 'Badge',
      width: 120,
      sortable: true,
      filterable: true,
      statusMap: {
        'pending': 'Pending',
        'paid': 'Paid',
        'overdue': 'Overdue'
      }
    },
    {
      key: 'serviceFromDate',
      label: 'Service From Date',
      type: 'Date',
      width: 140,
      sortable: true,
      filterable: true
    },
    {
      key: 'serviceToDate',
      label: 'Service To Date',
      type: 'Date',
      width: 140,
      sortable: true,
      filterable: true
    },
    {
      key: 'departurePoint',
      label: 'Departure Point',
      type: 'Text',
      width: 150,
      sortable: true,
      filterable: true
    },
    {
      key: 'arrivalPoint',
      label: 'Arrival Point',
      type: 'Text',
      width: 150,
      sortable: true,
      filterable: true
    },
    {
      key: 'isBillingFailed',
      label: 'Is Billing Failed',
      type: 'Badge',
      width: 130,
      sortable: true,
      filterable: true,
      statusMap: {
        'true': 'Failed',
        'false': 'Success'
      }
    }
  ];

  const extraFilters = [
    { key: 'orderType', label: 'Order Type', type: 'text' as const },
    { key: 'supplier', label: 'Supplier', type: 'text' as const },
    { key: 'contract', label: 'Contract', type: 'text' as const },
    { key: 'cluster', label: 'Cluster', type: 'text' as const },
    { key: 'customer', label: 'Customer', type: 'text' as const },
    { key: 'customerSupplierRefNo', label: 'Customer Supplier Ref No', type: 'text' as const },
    { key: 'draftBillNo', label: 'Draft Bill No', type: 'text' as const },
    { key: 'departurePoint', label: 'Departure Point', type: 'text' as const },
    { key: 'arrivalPoint', label: 'Arrival Point', type: 'text' as const },
    { key: 'serviceType', label: 'Service Type', type: 'text' as const },
    { key: 'serviceFromDate', label: 'Service From Date', type: 'date' as const },
    { key: 'serviceToDate', label: 'Service To Date', type: 'date' as const },
    { key: 'quickUniqueId', label: 'Quick Unique ID', type: 'text' as const },
    { key: 'quickOrderNo', label: 'Quick Order No', type: 'text' as const },
    { key: 'draftBillStatus', label: 'Draft Bill Status', type: 'text' as const },
    { key: 'isBillingFailed', label: 'Is Billing Failed', type: 'select' as const, 
      options: ['', 'true', 'false']
    },
    { key: 'subService', label: 'Sub Service', type: 'text' as const },
    { key: 'wbs', label: 'WBS', type: 'text' as const },
    { key: 'operationalLocation', label: 'Operational Location', type: 'text' as const },
    { key: 'primaryRefDoc', label: 'Primary Ref Doc', type: 'text' as const },
    { key: 'createdBy', label: 'Created By', type: 'text' as const },
    { key: 'secondaryDoc', label: 'Secondary Doc', type: 'text' as const },
    { key: 'invoiceNo', label: 'Invoice No', type: 'text' as const },
    { key: 'invoiceStatus', label: 'Invoice Status', type: 'text' as const },
    { key: 'resourceType', label: 'Resource Type', type: 'text' as const },
    { key: 'wagon', label: 'Wagon', type: 'text' as const },
    { key: 'container', label: 'Container', type: 'text' as const },
    { key: 'fromOrderDate', label: 'From Order Date', type: 'date' as const }
  ];

  const handleSearch = async (filters: FilterConfig[]) => {
    try {
      setLoading(true);
      
      // Convert filters to API format
      const filterParams: Record<string, any> = {};
      filters.forEach(filter => {
        if (filter.value !== undefined && filter.value !== null && filter.value !== '') {
          filterParams[filter.column] = filter.value;
        }
      });

      // Add any current advanced filters
      Object.keys(currentFilters).forEach(key => {
        if (currentFilters[key] !== undefined && currentFilters[key] !== null && currentFilters[key] !== '') {
          filterParams[key] = currentFilters[key];
        }
      });

      console.log('Searching with filters:', filterParams);
      
      const response = await quickOrderService.searchOrders(filterParams);
      console.log('Search response:', response);
      
      if (response && response.success && Array.isArray(response.data)) {
        setData(response.data);
        toast({
          title: "Success",
          description: `Found ${response.data.length} orders`,
        });
      } else {
        setData([]);
        toast({
          title: "No Results",
          description: "No orders found matching your criteria",
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Error",
        description: "Failed to search orders. Please try again.",
        variant: "destructive",
      });
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters: Record<string, any>) => {
    setCurrentFilters(filters);
  };

  const handleRowSelection = (selectedRowIds: Set<number>) => {
    setSelectedRows(selectedRowIds);
  };

  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      isBillingFailed: {
        value: item.isBillingFailed,
        variant: item.isBillingFailed ? 'destructive' : 'default'
      }
    }));
  }, [data]);

  // Initial load with empty filters
  useEffect(() => {
    handleSearch([]);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Quick Order Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <SmartGridWithGrouping
          columns={initialColumns}
          data={processedData}
          groupableColumns={['orderType', 'supplier', 'draftBillStatus', 'invoiceStatus', 'departurePoint', 'arrivalPoint']}
          showGroupingDropdown={true}
          paginationMode="pagination"
          onServerFilter={handleSearch}
          onFiltersChange={handleFiltersChange}
          selectedRows={selectedRows}
          onSelectionChange={handleRowSelection}
          configurableButtons={[]}
          gridTitle="Quick Order"
          recordCount={data.length}
          showCreateButton={true}
          searchPlaceholder="Search orders..."
          clientSideSearch={false}
          extraFilters={extraFilters}
          showSubHeaders={false}
        />
      </div>
    </div>
  );
};

export default QuickOrderManagement;