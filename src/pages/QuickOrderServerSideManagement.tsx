import React, { useState, useEffect, useMemo } from 'react';
import { format, subDays } from 'date-fns';
import { SmartGridWithGrouping } from '@/components/SmartGrid';
import { GridColumnConfig, FilterConfig, ServerFilter } from '@/types/smartgrid';
import { useToast } from '@/hooks/use-toast';
import { quickOrderService } from '@/api/services/quickOrderService';
import { filterService } from '@/api/services/filterService';
import { useSmartGridState } from '@/hooks/useSmartGridState';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Eye, GitPullRequest } from 'lucide-react';

  const GitPullActionButton = () => <GitPullRequest className="h-4 w-4" />;

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

const QuickOrderServerSideManagement: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({});
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [resourceGroups, setResourceGroups] = useState<any[]>([]);
  const [cardData, setCardData] = useState<any[]>([]);
  const [showServersideFilter, setShowServersideFilter] = useState<boolean>(false);
  const [groupLevelModalOpen, setGroupLevelModalOpen] = useState(false);
  const [firstDropdownOptions, setFirstDropdownOptions] = useState<{label: string; value: string}[]>([]);
  const [secondDropdownOptions, setSecondDropdownOptions] = useState<{label: string; value: string}[]>([]);
  const { toast } = useToast();
  const gridState = useSmartGridState();

  // Cascading dropdown handlers
  const handleFirstDropdownChange = async (value: string) => {
    try {
      // Mock API call - replace with actual service call
      const mockSecondOptions = [
        { label: `Option A for ${value}`, value: `${value}_a` },
        { label: `Option B for ${value}`, value: `${value}_b` },
        { label: `Option C for ${value}`, value: `${value}_c` }
      ];
      
      setSecondDropdownOptions(mockSecondOptions);
      
      toast({
        title: "Second dropdown updated",
        description: `Loaded options for ${value}`,
      });
    } catch (error) {
      console.error('Error loading second dropdown options:', error);
      toast({
        title: "Error",
        description: "Failed to load second dropdown options",
        variant: "destructive",
      });
    }
  };

  const initialColumns: GridColumnConfig[] = [
    {
      key: 'QuickOrderNo',
      label: 'Quick Order No.',
      type: 'Link',
      sortable: true,
      editable: false,
      mandatory: true,
      subRow: false
    },
    {
      key: 'QuickOrderDate',
      label: 'Quick Order Date',
      type: 'Date',
      sortable: true,
      editable: false,
      subRow: false
    },
    {
      key: 'Status',
      label: 'Status',
      type: 'Badge',
      sortable: true,
      editable: false,
      subRow: false
    },
    {
      key: 'CustomerOrVendor',
      label: 'Customer/Supplier',
      type: 'EditableText',
      sortable: true,
      editable: false,
      subRow: false
    },
    {
      key: 'Customer_Supplier_RefNo',
      label: 'Cust/Sup. Ref. No.',
      type: 'Text',
      sortable: true,
      editable: false,
      subRow: false
    },
    {
      key: 'Contract',
      label: 'Contract',
      type: 'Text',
      sortable: true,
      editable: false,
      subRow: false
    },
    {
      key: 'OrderType',
      label: 'Order Type',
      type: 'Text',
      sortable: true,
      editable: false,
      subRow: false
    },
    {
      key: 'TotalNet',
      label: 'Total Net',
      type: 'Text',
      sortable: true,
      editable: false,
      subRow: false
    },
    {
      key: 'actions',
      label: '',
      type: 'Text',
      sortable: false,
      editable: false,
      subRow: false,
      width: 80,
      onClick: async (rowData: any) => {
        console.log('clicked for:', rowData);
        if (rowData.QuickUniqueID) {
          try {
            const resourceGroupAsyncFetch: any = await quickOrderService.screenFetchQuickOrder(rowData.QuickUniqueID);
            const jsonParsedData: any = JSON.parse(resourceGroupAsyncFetch?.data?.ResponseData);
            console.log('Parsed Data:', jsonParsedData);
            setResourceGroups(jsonParsedData?.ResponseResult[0] ? [jsonParsedData.ResponseResult[0]] : []);
            setCardData(jsonParsedData?.ResponseResult[0]?.ResourceGroup || []);
            setGroupLevelModalOpen(true);
          } catch (error) {
            console.error('Error fetching resource group:', error);
            toast({
              title: "Error",
              description: "Failed to fetch resource group data",
              variant: "destructive",
            });
          }
        }
      }
    }
  ];

  // Server-side filters for the ServersideFilter component
  const serverFilters: ServerFilter[] = [
    { key: 'QuickOrderNo', label: 'Quick Order No', type: 'text' },
    { key: 'Status', label: 'Status', type: 'select', options: ['Released', 'Under Execution', 'Fresh', 'Cancelled', 'Deleted', 'Save', 'Under Amendment', 'Confirmed', 'Initiated'], multiSelect: true },
    { key: 'CustomerOrVendor', label: 'Customer/Supplier', type: 'text' },
    {
      key: 'customer',
      label: 'Customer',
      type: 'lazyselect', // lazy-loaded dropdown
      fetchOptions: async ({ searchTerm, offset, limit }) => {
        const res = await fetch(
          `/api/customers?search=${searchTerm}&offset=${offset}&limit=${limit}`
        );
        const data = await res.json();
        return data.items.map((item: any) => ({
          label: item.customerName,
          value: item.customerId
        }));
      }
    },
    { key: 'Contract', label: 'Contract', type: 'dropdownText', options: ['Service Contract', 'Purchase Contract', 'Rental Contract', 'Maintenance Contract', 'Logistics Contract'] },
    { key: 'OrderType', label: 'Order Type', type: 'text' },
    { key: 'QuickOrderDate', label: 'Quick Order Date', type: 'date' },
    { 
      key: 'QuickOrderDateRange', 
      label: 'Quick Order Date Range', 
      type: 'dateRange',
      defaultValue: {
        from: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        to: format(new Date(), 'yyyy-MM-dd')
      }
    },
    { key: 'amount', label: 'Amount', type: 'numberRange' },
    {
      key: 'firstDropdown',
      label: 'First Category',
      type: 'cascadingSelect',
      options: firstDropdownOptions,
      onCascadeChange: handleFirstDropdownChange
    },
    {
      key: 'secondDropdown',
      label: 'Second Category',
      type: 'cascadingSelect',
      options: secondDropdownOptions,
      dependsOn: 'firstDropdown'
    }
  ];

  const handleServerSideSearch = async () => {
    try {
      gridState.setLoading(true);
      setApiStatus('loading');
      
      // Convert filters to API format
      const filterParams: Record<string, any> = {};
      //filters.forEach(filter => {
      //  if (filter.value !== undefined && filter.value !== null && filter.value !== '') {
      //    filterParams[filter.column] = filter.value;
      //  }
      //});

      // Add any current advanced filters
      Object.keys(currentFilters).forEach(key => {
        if (currentFilters[key] !== undefined && currentFilters[key] !== null && currentFilters[key] !== '') {
          filterParams[key] = currentFilters[key];
        }
      });

      console.log('Searching with filters:', filterParams);
      
      const response = await quickOrderService.getQuickOrders({
        filters: [filterParams]
      });
      
      console.log('Server-side Search API Response:', response);

      const parsedResponse = JSON.parse(response?.data?.ResponseData || '{}');
      const data = parsedResponse.ResponseResult;

      if (!data || !Array.isArray(data)) {
        console.warn('API returned invalid data format:', response);
        gridState.setGridData([]);
        gridState.setLoading(false);
        setApiStatus('error');
        toast({
          title: "No Results",
          description: "No orders found matching your criteria",
        });
        return;
      }

      const processedData = data.map((row: any) => {
        const getStatusColorLocal = (status: string) => {
          const statusColors: Record<string, string> = {
            'Released': 'badge-fresh-green rounded-2xl',
            'Under Execution': 'badge-purple rounded-2xl',
            'Fresh': 'badge-blue rounded-2xl',
            'Cancelled': 'badge-red rounded-2xl',
            'Deleted': 'badge-red rounded-2xl',
            'Save': 'badge-green rounded-2xl',
            'Under Amendment': 'badge-orange rounded-2xl',
            'Confirmed': 'badge-green rounded-2xl',
            'Initiated': 'badge-blue rounded-2xl',
          };
          return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-300";
        };

        return {
          ...row,
          Status: {
            value: row.Status,
            variant: getStatusColorLocal(row.Status),
          },
        };
      });

      console.log('Processed Server-side Search Data:', processedData);
      
      gridState.setGridData(processedData);
      gridState.setLoading(false);
      setApiStatus('success');
      
      toast({
        title: "Success",
        description: `Found ${processedData.length} orders`,
      });
      
    } catch (error) {
      console.error('Server-side search failed:', error);
      gridState.setGridData([]);
      gridState.setLoading(false);
      setApiStatus('error');
      toast({
        title: "Error",
        description: "Failed to search orders. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Initialize first dropdown options
  useEffect(() => {
    const mockFirstOptions = [
      { label: 'Category A', value: 'cat_a' },
      { label: 'Category B', value: 'cat_b' },
      { label: 'Category C', value: 'cat_c' }
    ];
    setFirstDropdownOptions(mockFirstOptions);
  }, []);

  // Load initial data without filters
  useEffect(() => {
    gridState.setColumns(initialColumns);
    gridState.setLoading(true);
    setApiStatus('loading');

    let isMounted = true;

    quickOrderService.getQuickOrders({
      filters: []
    })
      .then((response: any) => {
        if (!isMounted) return;

        console.log('Initial API Response:', response);

        const parsedResponse = JSON.parse(response?.data?.ResponseData || '{}');
        const data = parsedResponse.ResponseResult;

        if (!data || !Array.isArray(data)) {
          console.warn('API returned invalid data format:', response);
          if (isMounted) {
            gridState.setGridData([]);
            gridState.setLoading(false);
            setApiStatus('error');
          }
          return;
        }

        const processedData = data.map((row: any) => {
          const getStatusColorLocal = (status: string) => {
            const statusColors: Record<string, string> = {
              'Released': 'badge-fresh-green rounded-2xl',
              'Under Execution': 'badge-purple rounded-2xl',
              'Fresh': 'badge-blue rounded-2xl',
              'Cancelled': 'badge-red rounded-2xl',
              'Deleted': 'badge-red rounded-2xl',
              'Save': 'badge-green rounded-2xl',
              'Under Amendment': 'badge-orange rounded-2xl',
              'Confirmed': 'badge-green rounded-2xl',
              'Initiated': 'badge-blue rounded-2xl',
            };
            return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-300";
          };

          return {
            ...row,
            Status: {
              value: row.Status,
              variant: getStatusColorLocal(row.Status),
            },
          };
        });

        console.log('Initial Processed Data:', processedData);

        if (isMounted) {
          gridState.setGridData(processedData);
          gridState.setLoading(false);
          setApiStatus('success');
        }
      })
      .catch((error: any) => {
        console.error("Initial quick order fetch failed:", error);
        if (isMounted) {
          gridState.setGridData([]);
          gridState.setLoading(false);
          setApiStatus('error');
        }
      });

    return () => {
      isMounted = false;
    };
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
                <BreadcrumbPage>Quick Order Server-Side Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <SmartGridWithGrouping
          columns={initialColumns}
          data={gridState.gridData}
          groupableColumns={['OrderType', 'CustomerOrVendor', 'Status', 'Contract']}
          showGroupingDropdown={true}
          paginationMode="pagination"
          onFiltersChange={setCurrentFilters}
          onSearch={handleServerSideSearch}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          configurableButtons={[]}
          gridTitle="Quick Order Server-Side Management"
          recordCount={gridState.gridData.length}
          showCreateButton={true}
          searchPlaceholder="Search orders..."
          clientSideSearch={false}
          showSubHeaders={false}
          hideAdvancedFilter={true}
          // Server-side filter props
          serverFilters={serverFilters}
          showFilterTypeDropdown={false}
          showServersideFilter={showServersideFilter}
          onToggleServersideFilter={() => setShowServersideFilter(prev => !prev)}
          gridId="quick-order-management"
          userId="current-user"
          api={filterService}
        />
      </div>
    </div>
  );
};

export default QuickOrderServerSideManagement;