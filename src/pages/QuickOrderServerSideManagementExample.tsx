import React, { useState, useEffect } from 'react';
import { SmartGridWithGrouping } from '@/components/SmartGrid/SmartGridWithGrouping';
import { filterService } from '@/api/services/filterService';
import { useSmartGridState } from '@/hooks/useSmartGridState';
import { GridColumnConfig, ServerFilter } from '@/types/smartgrid';
import { FilterValue } from '@/types/filterSystem';

// Example data interface
interface ExampleOrderData {
  id: string;
  orderType: string;
  supplier: string;
  quickOrderNo: string;
  status: string;
  customerName: string;
  product: string;
}

// Mock function to simulate API calls for lazy-loaded options
const mockFetchSuppliers = async ({ 
  searchTerm, 
  offset, 
  limit 
}: { 
  searchTerm: string; 
  offset: number; 
  limit: number; 
}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock supplier data
  const allSuppliers = [
    'ABC Manufacturing Co.',
    'XYZ Logistics Ltd.',
    'Global Supply Chain Inc.',
    'Premium Parts Provider',
    'Reliable Components Corp.',
    'Quality Materials LLC',
    'Efficient Systems Group',
    'Industrial Solutions Ltd.',
    'Advanced Tech Supplies',
    'Universal Components Inc.',
    'Swift Delivery Services',
    'Precision Manufacturing',
    'Elite Supply Solutions',
    'Dynamic Distribution Co.',
    'Strategic Sourcing Ltd.',
    'Innovative Materials Corp.',
    'Streamlined Logistics Inc.',
    'Professional Parts Provider',
    'Comprehensive Supply Chain',
    'Excellence in Manufacturing'
  ];
  
  // Filter by search term
  const filteredSuppliers = searchTerm 
    ? allSuppliers.filter(supplier => 
        supplier.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allSuppliers;
  
  // Paginate results
  const paginatedSuppliers = filteredSuppliers.slice(offset, offset + limit);
  
  return paginatedSuppliers.map(supplier => ({
    label: supplier,
    value: supplier.toLowerCase().replace(/[^a-z0-9]/g, '_')
  }));
};

// Mock function for customers
const mockFetchCustomers = async ({ 
  searchTerm, 
  offset, 
  limit 
}: { 
  searchTerm: string; 
  offset: number; 
  limit: number; 
}) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const allCustomers = [
    'Acme Corporation',
    'Beta Industries',
    'Gamma Solutions',
    'Delta Enterprises',
    'Epsilon Technologies',
    'Zeta Manufacturing',
    'Eta Services Ltd.',
    'Theta Products Inc.',
    'Iota Systems Corp.',
    'Kappa Logistics LLC'
  ];
  
  const filteredCustomers = searchTerm 
    ? allCustomers.filter(customer => 
        customer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allCustomers;
  
  const paginatedCustomers = filteredCustomers.slice(offset, offset + limit);
  
  return paginatedCustomers.map(customer => ({
    label: customer,
    value: customer.toLowerCase().replace(/[^a-z0-9]/g, '_')
  }));
};

export function QuickOrderServerSideManagementExample() {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentFilters, setCurrentFilters] = useState<Record<string, FilterValue>>({});
  const [showServersideFilter, setShowServersideFilter] = useState(true);

  const {
    gridData,
    setGridData,
    loading,
    setLoading,
    error,
    setError
  } = useSmartGridState();

  // Example columns configuration
  const initialColumns: GridColumnConfig[] = [
    {
      key: 'id', 
      label: 'Order ID', 
      type: 'Text', 
      width: 120, 
      sortable: true, 
      filterable: true
    },
    {
      key: 'orderType', 
      label: 'Order Type', 
      type: 'Badge', 
      width: 150,
      statusMap: {
        'urgent': 'bg-red-100 text-red-800',
        'normal': 'bg-blue-100 text-blue-800',
        'low': 'bg-gray-100 text-gray-800'
      }
    },
    {
      key: 'supplier', 
      label: 'Supplier', 
      type: 'Text', 
      width: 200, 
      sortable: true
    },
    {
      key: 'quickOrderNo', 
      label: 'Quick Order No', 
      type: 'Link', 
      width: 150,
      onClick: (rowData: ExampleOrderData) => {
        console.log('Clicked order:', rowData.quickOrderNo);
      }
    },
    {
      key: 'status', 
      label: 'Status', 
      type: 'Badge', 
      width: 120,
      statusMap: {
        'pending': 'bg-yellow-100 text-yellow-800',
        'approved': 'bg-green-100 text-green-800',
        'rejected': 'bg-red-100 text-red-800'
      }
    },
    {
      key: 'customerName', 
      label: 'Customer', 
      type: 'Text', 
      width: 180
    },
    {
      key: 'product', 
      label: 'Product', 
      type: 'Text', 
      width: 200
    }
  ];

  // Server-side filters configuration with lazyselect
  const serverFilters: ServerFilter[] = [
    {
      key: 'orderType',
      label: 'Order Type',
      type: 'select',
      options: ['urgent', 'normal', 'low']
    },
    {
      key: 'supplier',
      label: 'Supplier',
      type: 'lazyselect',  // New lazyselect type
      fetchOptions: mockFetchSuppliers,  // Function to fetch options
      multiSelect: false
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: ['pending', 'approved', 'rejected'],
      multiSelect: true
    },
    {
      key: 'customerName',
      label: 'Customer',
      type: 'lazyselect',  // Another lazyselect example
      fetchOptions: mockFetchCustomers,
      multiSelect: true  // Support multi-select for customers
    }
  ];

  // Mock function to simulate server-side search
  const handleServerSideSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Searching with filters:', currentFilters);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock response data
      const mockData: ExampleOrderData[] = [
        {
          id: 'ORD-001',
          orderType: 'urgent',
          supplier: 'ABC Manufacturing Co.',
          quickOrderNo: 'QO-2024-001',
          status: 'pending',
          customerName: 'Acme Corporation',
          product: 'Industrial Widget A'
        },
        {
          id: 'ORD-002',
          orderType: 'normal',
          supplier: 'XYZ Logistics Ltd.',
          quickOrderNo: 'QO-2024-002',
          status: 'approved',
          customerName: 'Beta Industries',
          product: 'Component B'
        },
        {
          id: 'ORD-003',
          orderType: 'low',
          supplier: 'Global Supply Chain Inc.',
          quickOrderNo: 'QO-2024-003',
          status: 'rejected',
          customerName: 'Gamma Solutions',
          product: 'Material C'
        }
      ];

      setGridData(mockData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    handleServerSideSearch();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quick Order Management - LazySelect Example</h1>
          <p className="text-gray-600 mt-1">
            Demonstration of server-side filters with lazy-loading, infinite scroll, and search
          </p>
        </div>
      </div>

      <SmartGridWithGrouping
        columns={initialColumns}
        data={gridData}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        gridTitle="Quick Orders with LazySelect Filters"
        recordCount={gridData.length}
        showCreateButton={true}
        // Server-side filter configuration
        serverFilters={serverFilters}
        showServersideFilter={showServersideFilter}
        onToggleServersideFilter={() => setShowServersideFilter(!showServersideFilter)}
        onFiltersChange={setCurrentFilters}
        onSearch={handleServerSideSearch}
        gridId="quick-order-lazyselect-example"
        userId="demo-user"
        api={filterService}
        // Grouping configuration
        groupByField={null}
        onGroupByChange={(field) => console.log('Group by:', field)}
        groupableColumns={['orderType', 'status', 'supplier']}
        showGroupingDropdown={true}
      />
    </div>
  );
}