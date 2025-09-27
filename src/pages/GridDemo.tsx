import React, { useState, useMemo, useEffect } from 'react';
import { SmartGridWithGrouping } from '@/components/SmartGrid';
import { GridColumnConfig } from '@/types/smartgrid';
import { Button } from '@/components/ui/button';
import { Printer, MoreHorizontal, User, Train, UserCheck, Container, Plus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSmartGridState } from '@/hooks/useSmartGridState';
import { DraggableSubRow } from '@/components/SmartGrid/DraggableSubRow';
import { ConfigurableButtonConfig } from '@/components/ui/configurable-button';
import { tripService } from '@/api/services/tripService';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface SampleData {
  id: string;
  status: string;
  tripBillingStatus: string;
  plannedStartEndDateTime: string;
  actualStartEndDateTime: string;
  departurePoint: string;
  arrivalPoint: string;
  customer: string;
  resources: string;
  departurePointDetails?: string;
  arrivalPointDetails?: string;
  customerDetails?: Array<{
    name: string;
    id: string;
    type: 'customer';
  }>;
  resourceDetails?: Array<{
    name: string;
    id: string;
    type: 'train' | 'agent' | 'container';
  }>;
}

const GridDemo = () => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [selectedRowObjects, setSelectedRowObjects] = useState<SampleData[]>([]);
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({});
  const [apiData, setApiData] = useState<SampleData[]>([]);
  const [loading, setLoading] = useState(false);
  const gridState = useSmartGridState();
  
  const initialColumns: GridColumnConfig[] = [
    {
      key: 'id',
      label: 'Trip Plan No',
      type: 'Link',
      sortable: true,
      editable: false,
      mandatory: true,
      subRow: false,
      filterMode: 'local'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'Badge',
      sortable: true,
      editable: false,
      subRow: false
    },
    {
      key: 'tripBillingStatus',
      label: 'Trip Billing Status',
      type: 'Badge',
      sortable: true,
      editable: false,
      subRow: false
    },
    {
      key: 'plannedStartEndDateTime',
      label: 'Planned Start and End Date Time',
      type: 'EditableText',
      sortable: true,
      editable: true,
      subRow: true
    },
    {
      key: 'actualStartEndDateTime',
      label: 'Actual Start and End Date Time',
      type: 'DateTimeRange',
      sortable: true,
      editable: false,
      subRow: true
    },
    {
      key: 'departurePoint',
      label: 'Departure Point',
      type: 'TextWithTooltip',
      sortable: true,
      editable: false,
      infoTextField: 'departurePointDetails',
      subRow: true
    },
    {
      key: 'arrivalPoint',
      label: 'Arrival Point',
      type: 'TextWithTooltip',
      sortable: true,
      editable: false,
      infoTextField: 'arrivalPointDetails',
      subRow: true
    },
    {
      key: 'customer',
      label: 'Customer',
      type: 'ExpandableCount',
      sortable: true,
      editable: false,
      renderExpandedContent: (row: SampleData) => (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
            <User className="h-4 w-4" />
            Customer Details
          </div>
          {row.customerDetails?.map((customer, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{customer.name}</div>
                <div className="text-sm text-gray-500">{customer.id}</div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      key: 'resources',
      label: 'Resources',
      type: 'ExpandableCount',
      sortable: true,
      editable: false,
      renderExpandedContent: (row: SampleData) => (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
            <Container className="h-4 w-4" />
            Resource Details
          </div>
          {row.resourceDetails?.map((resource, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                {resource.type === 'train' && <Train className="h-4 w-4 text-green-600" />}
                {resource.type === 'agent' && <UserCheck className="h-4 w-4 text-green-600" />}
                {resource.type === 'container' && <Container className="h-4 w-4 text-green-600" />}
              </div>
              <div>
                <div className="font-medium text-gray-900">{resource.name}</div>
                <div className="text-sm text-gray-500">{resource.id}</div>
              </div>
            </div>
          ))}
        </div>
      )
    }
  ];

  // Initialize columns only (data will be set after processedData is computed)
  useEffect(() => {
    console.log('Initializing columns in GridDemo');
    gridState.setColumns(initialColumns);
  }, []);

  // Log when columns change
  useEffect(() => {
    console.log('Columns changed in GridDemo:', gridState.columns);
    console.log('Sub-row columns:', gridState.columns.filter(col => col.subRow).map(col => col.key));
  }, [gridState.columns, gridState.forceUpdate]);
  
  const { toast } = useToast();

  const sampleData: SampleData[] = [
    {
      id: 'TRIP00000001',
      status: 'Released',
      tripBillingStatus: 'Draft Bill Raised',
      plannedStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      actualStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      departurePoint: 'VLA-70',
      arrivalPoint: 'CUR-25',
      customer: '+3',
      resources: '+3',
      departurePointDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
      arrivalPointDetails: 'Currency details for CUR-25',
      customerDetails: [
        { name: 'DB Cargo', id: 'CUS00000123', type: 'customer' },
        { name: 'ABC Rail Goods', id: 'CUS00003214', type: 'customer' },
        { name: 'Wave Cargo', id: 'CUS00012345', type: 'customer' }
      ],
      resourceDetails: [
        { name: 'Train ID', id: 'TR000213', type: 'train' },
        { name: 'AGN01', id: 'Agent-0000001', type: 'agent' },
        { name: '20FT CT', id: '20 Feet Container', type: 'container' }
      ]
    },
    {
      id: 'TRIP00000002',
      status: 'Under Execution',
      tripBillingStatus: 'Not Eligible',
      plannedStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      actualStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      departurePoint: 'VLA-70',
      arrivalPoint: 'CUR-25',
      customer: '+3',
      resources: '+3',
      departurePointDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
      arrivalPointDetails: 'Currency details for CUR-25',
      customerDetails: [
        { name: 'DB Cargo', id: 'CUS00000123', type: 'customer' },
        { name: 'ABC Rail Goods', id: 'CUS00003214', type: 'customer' },
        { name: 'Wave Cargo', id: 'CUS00012345', type: 'customer' }
      ],
      resourceDetails: [
        { name: 'Train ID', id: 'TR000213', type: 'train' },
        { name: 'AGN01', id: 'Agent-0000001', type: 'agent' },
        { name: '20FT CT', id: '20 Feet Container', type: 'container' }
      ]
    },
    {
      id: 'TRIP00000003',
      status: 'Initiated',
      tripBillingStatus: 'Revenue Leakage',
      plannedStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      actualStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      departurePoint: 'VLA-70',
      arrivalPoint: 'CUR-25',
      customer: '+3',
      resources: '+3',
      departurePointDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
      arrivalPointDetails: 'Currency details for CUR-25',
      customerDetails: [
        { name: 'DB Cargo', id: 'CUS00000123', type: 'customer' },
        { name: 'ABC Rail Goods', id: 'CUS00003214', type: 'customer' },
        { name: 'Wave Cargo', id: 'CUS00012345', type: 'customer' }
      ],
      resourceDetails: [
        { name: 'Train ID', id: 'TR000213', type: 'train' },
        { name: 'AGN01', id: 'Agent-0000001', type: 'agent' },
        { name: '20FT CT', id: '20 Feet Container', type: 'container' }
      ]
    },
    {
      id: 'TRIP00000004',
      status: 'Cancelled',
      tripBillingStatus: 'Invoice Created',
      plannedStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      actualStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      departurePoint: 'VLA-70',
      arrivalPoint: 'CUR-25',
      customer: '+3',
      resources: '+3',
      departurePointDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
      arrivalPointDetails: 'Currency details for CUR-25',
      customerDetails: [
        { name: 'DB Cargo', id: 'CUS00000123', type: 'customer' },
        { name: 'ABC Rail Goods', id: 'CUS00003214', type: 'customer' },
        { name: 'Wave Cargo', id: 'CUS00012345', type: 'customer' }
      ],
      resourceDetails: [
        { name: 'Train ID', id: 'TR000213', type: 'train' },
        { name: 'AGN01', id: 'Agent-0000001', type: 'agent' },
        { name: '20FT CT', id: '20 Feet Container', type: 'container' }
      ]
    },
    {
      id: 'TRIP00000005',
      status: 'Deleted',
      tripBillingStatus: 'Invoice Approved',
      plannedStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      actualStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      departurePoint: 'VLA-70',
      arrivalPoint: 'CUR-25',
      customer: '+3',
      resources: '+3',
      departurePointDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
      arrivalPointDetails: 'Currency details for CUR-25',
      customerDetails: [
        { name: 'DB Cargo', id: 'CUS00000123', type: 'customer' },
        { name: 'ABC Rail Goods', id: 'CUS00003214', type: 'customer' },
        { name: 'Wave Cargo', id: 'CUS00012345', type: 'customer' }
      ],
      resourceDetails: [
        { name: 'Train ID', id: 'TR000213', type: 'train' },
        { name: 'AGN01', id: 'Agent-0000001', type: 'agent' },
        { name: '20FT CT', id: '20 Feet Container', type: 'container' }
      ]
    },
    {
      id: 'TRIP00000006',
      status: 'Confirmed',
      tripBillingStatus: 'Not Eligible',
      plannedStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      actualStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      departurePoint: 'VLA-70',
      arrivalPoint: 'CUR-25',
      customer: '+3',
      resources: '+3',
      departurePointDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
      arrivalPointDetails: 'Currency details for CUR-25',
      customerDetails: [
        { name: 'DB Cargo', id: 'CUS00000123', type: 'customer' },
        { name: 'ABC Rail Goods', id: 'CUS00003214', type: 'customer' },
        { name: 'Wave Cargo', id: 'CUS00012345', type: 'customer' }
      ],
      resourceDetails: [
        { name: 'Train ID', id: 'TR000213', type: 'train' },
        { name: 'AGN01', id: 'Agent-0000001', type: 'agent' },
        { name: '20FT CT', id: '20 Feet Container', type: 'container' }
      ]
    },
    {
      id: 'TRIP00000007',
      status: 'Under Execution',
      tripBillingStatus: 'Revenue Leakage',
      plannedStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      actualStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      departurePoint: 'VLA-70',
      arrivalPoint: 'CUR-25',
      customer: '+3',
      resources: '+3',
      departurePointDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
      arrivalPointDetails: 'Currency details for CUR-25',
      customerDetails: [
        { name: 'DB Cargo', id: 'CUS00000123', type: 'customer' },
        { name: 'ABC Rail Goods', id: 'CUS00003214', type: 'customer' },
        { name: 'Wave Cargo', id: 'CUS00012345', type: 'customer' }
      ],
      resourceDetails: [
        { name: 'Train ID', id: 'TR000213', type: 'train' },
        { name: 'AGN01', id: 'Agent-0000001', type: 'agent' },
        { name: '20FT CT', id: '20 Feet Container', type: 'container' }
      ]
    },
    {
      id: 'TRIP00000008',
      status: 'Under Execution',
      tripBillingStatus: 'Revenue Leakage',
      plannedStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      actualStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      departurePoint: 'VLA-70',
      arrivalPoint: 'CUR-25',
      customer: '+3',
      resources: '+3',
      departurePointDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
      arrivalPointDetails: 'Currency details for CUR-25',
      customerDetails: [
        { name: 'DB Cargo', id: 'CUS00000123', type: 'customer' },
        { name: 'ABC Rail Goods', id: 'CUS00003214', type: 'customer' },
        { name: 'Wave Cargo', id: 'CUS00012345', type: 'customer' }
      ],
      resourceDetails: [
        { name: 'Train ID', id: 'TR000213', type: 'train' },
        { name: 'AGN01', id: 'Agent-0000001', type: 'agent' },
        { name: '20FT CT', id: '20 Feet Container', type: 'container' }
      ]
    },
    {
      id: 'TRIP00000009',
      status: 'Under Execution',
      tripBillingStatus: 'Revenue Leakage',
      plannedStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      actualStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      departurePoint: 'VLA-70',
      arrivalPoint: 'CUR-25',
      customer: '+3',
      resources: '+3',
      departurePointDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
      arrivalPointDetails: 'Currency details for CUR-25',
      customerDetails: [
        { name: 'DB Cargo', id: 'CUS00000123', type: 'customer' },
        { name: 'ABC Rail Goods', id: 'CUS00003214', type: 'customer' },
        { name: 'Wave Cargo', id: 'CUS00012345', type: 'customer' }
      ],
      resourceDetails: [
        { name: 'Train ID', id: 'TR000213', type: 'train' },
        { name: 'AGN01', id: 'Agent-0000001', type: 'agent' },
        { name: '20FT CT', id: '20 Feet Container', type: 'container' }
      ]
    },
    {
      id: 'TRIP00000010',
      status: 'Under Execution',
      tripBillingStatus: 'Revenue Leakage',
      plannedStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      actualStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      departurePoint: 'VLA-70',
      arrivalPoint: 'CUR-25',
      customer: '+3',
      resources: '+3',
      departurePointDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
      arrivalPointDetails: 'Currency details for CUR-25',
      customerDetails: [
        { name: 'DB Cargo', id: 'CUS00000123', type: 'customer' },
        { name: 'ABC Rail Goods', id: 'CUS00003214', type: 'customer' },
        { name: 'Wave Cargo', id: 'CUS00012345', type: 'customer' }
      ],
      resourceDetails: [
        { name: 'Train ID', id: 'TR000213', type: 'train' },
        { name: 'AGN01', id: 'Agent-0000001', type: 'agent' },
        { name: '20FT CT', id: '20 Feet Container', type: 'container' }
      ]
    },
    {
      id: 'TRIP00000011',
      status: 'Under Execution',
      tripBillingStatus: 'Revenue Leakage',
      plannedStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      actualStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      departurePoint: 'VLA-70',
      arrivalPoint: 'CUR-25',
      customer: '+3',
      resources: '+3',
      departurePointDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
      arrivalPointDetails: 'Currency details for CUR-25',
      customerDetails: [
        { name: 'DB Cargo', id: 'CUS00000123', type: 'customer' },
        { name: 'ABC Rail Goods', id: 'CUS00003214', type: 'customer' },
        { name: 'Wave Cargo', id: 'CUS00012345', type: 'customer' }
      ],
      resourceDetails: [
        { name: 'Train ID', id: 'TR000213', type: 'train' },
        { name: 'AGN01', id: 'Agent-0000001', type: 'agent' },
        { name: '20FT CT', id: '20 Feet Container', type: 'container' }
      ]
    },
    {
      id: 'TRIP00000012',
      status: 'Under Execution',
      tripBillingStatus: 'Revenue Leakage',
      plannedStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      actualStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      departurePoint: 'VLA-70',
      arrivalPoint: 'CUR-25',
      customer: '+3',
      resources: '+3',
      departurePointDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
      arrivalPointDetails: 'Currency details for CUR-25',
      customerDetails: [
        { name: 'DB Cargo', id: 'CUS00000123', type: 'customer' },
        { name: 'ABC Rail Goods', id: 'CUS00003214', type: 'customer' },
        { name: 'Wave Cargo', id: 'CUS00012345', type: 'customer' }
      ],
      resourceDetails: [
        { name: 'Train ID', id: 'TR000213', type: 'train' },
        { name: 'AGN01', id: 'Agent-0000001', type: 'agent' },
        { name: '20FT CT', id: '20 Feet Container', type: 'container' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      // Status column colors
      'Released': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Under Execution': 'bg-purple-100 text-purple-800 border-purple-300',
      'Initiated': 'bg-blue-100 text-blue-800 border-blue-300',
      'Cancelled': 'bg-red-100 text-red-800 border-red-300',
      'Deleted': 'bg-red-100 text-red-800 border-red-300',
      'Confirmed': 'bg-green-100 text-green-800 border-green-300',
      
      // Trip Billing Status colors
      'Draft Bill Raised': 'bg-orange-100 text-orange-800 border-orange-300',
      'Not Eligible': 'bg-red-100 text-red-800 border-red-300',
      'Revenue Leakage': 'bg-red-100 text-red-800 border-red-300',
      'Invoice Created': 'bg-blue-100 text-blue-800 border-blue-300',
      'Invoice Approved': 'bg-green-100 text-green-800 border-green-300'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const processedData = useMemo(() => {
    return sampleData.map(row => ({
      ...row,
      status: {
        value: row.status,
        variant: getStatusColor(row.status)
      },
      tripBillingStatus: {
        value: row.tripBillingStatus,
        variant: getStatusColor(row.tripBillingStatus)
      }
    }));
  }, []);

  // Initialize columns and processed data in the grid state
  useEffect(() => {
    console.log('Initializing columns and data in GridDemo');
    gridState.setColumns(initialColumns);
    gridState.setGridData(processedData);
  }, [processedData]);

  // Update selected row indices based on current page data to maintain selection state
  useEffect(() => {
    const currentData = gridState.gridData.length > 0 ? gridState.gridData : processedData;
    const newSelectedIndices = new Set<number>();
    
    // Find indices of currently selected row IDs in the current page data
    currentData.forEach((row: SampleData, index: number) => {
      if (selectedRowIds.has(row.id)) {
        newSelectedIndices.add(index);
      }
    });
    
    // Only update if there's a difference to avoid infinite loops
    // Also prevent updates that might trigger unwanted side effects
    if (newSelectedIndices.size !== selectedRows.size || 
        !Array.from(newSelectedIndices).every(index => selectedRows.has(index))) {
      console.log('Updating selected row indices without affecting pagination');
      setSelectedRows(newSelectedIndices);
    }
  }, [gridState.gridData, processedData, selectedRowIds]);

  // Configurable buttons for the grid toolbar
  const configurableButtons: ConfigurableButtonConfig[] = [
    {
      label: "+ Create button",
      tooltipTitle: "Create button",
      showDropdown: false,
      dropdownItems: [
        {
          label: "Create Trip",
          icon: <Plus className="h-4 w-4" />,
          onClick: () => {
            toast({
              title: "Create Trip",
              description: "Opening trip creation form..."
            });
          }
        },
        {
          label: "Bulk Upload",
          icon: <Upload className="h-4 w-4" />,
          onClick: () => {
            toast({
              title: "Bulk Upload",
              description: "Opening bulk upload dialog..."
            });
          }
        }
      ]
    }
  ];

  const handleLinkClick = (value: any, row: any) => {
    console.log('Link clicked:', value, row);
  };

  const handleUpdate = async (updatedRow: any) => {
    console.log('Updating row:', updatedRow);
    // Update the grid data
    gridState.setGridData(prev => 
      prev.map((row, index) => 
        index === updatedRow.index ? { ...row, ...updatedRow } : row
      )
    );
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast({
      title: "Success",
      description: "Trip plan updated successfully"
    });
  };

  const handleRowSelection = (selectedRowIndices: Set<number>) => {
    console.log('Selected rows changed via checkbox:', selectedRowIndices);
    setSelectedRows(selectedRowIndices);
    
    // Update selected row objects and IDs using unique row identification
    const currentData = gridState.gridData.length > 0 ? gridState.gridData : processedData;
    const selectedObjects = Array.from(selectedRowIndices)
      .map(index => currentData[index])
      .filter(Boolean);
    
    // Create a new Set of unique row IDs
    const newSelectedRowIds = new Set(selectedObjects.map(row => row.id));
    
    // Update selected row objects to ensure uniqueness by ID
    const uniqueSelectedObjects = selectedObjects.filter((row, index, self) => 
      self.findIndex(r => r.id === row.id) === index
    );
    
    setSelectedRowIds(newSelectedRowIds);
    setSelectedRowObjects(uniqueSelectedObjects);
    console.log('Selected row objects:', uniqueSelectedObjects);
    console.log('Selected row IDs:', Array.from(newSelectedRowIds));
  };

  const handleRowClick = (row: SampleData, index: number) => {
    console.log('Row clicked:', row, index);
    
    const currentData = gridState.gridData.length > 0 ? gridState.gridData : processedData;
    const newSelectedRows = new Set(selectedRows);
    const newSelectedRowIds = new Set(selectedRowIds);
    const newSelectedRowObjects = [...selectedRowObjects];
    
    // Check if this row is already selected by ID (not index)
    const isRowSelected = newSelectedRowIds.has(row.id);
    
    if (isRowSelected) {
      // Remove row: remove from all tracking sets/arrays
      newSelectedRows.delete(index);
      newSelectedRowIds.delete(row.id);
      const objectIndex = newSelectedRowObjects.findIndex(obj => obj.id === row.id);
      if (objectIndex > -1) {
        newSelectedRowObjects.splice(objectIndex, 1);
      }
      console.log('Removed row:', row.id);
    } else {
      // Add row: add to all tracking sets/arrays (ensure uniqueness)
      newSelectedRows.add(index);
      newSelectedRowIds.add(row.id);
      // Only add if not already in objects array (double-check uniqueness)
      if (!newSelectedRowObjects.some(obj => obj.id === row.id)) {
        newSelectedRowObjects.push(row);
      }
      console.log('Added row:', row.id);
    }
    
    // Update all state
    setSelectedRows(newSelectedRows);
    setSelectedRowIds(newSelectedRowIds);
    setSelectedRowObjects(newSelectedRowObjects);
    
    console.log('Selected row objects after click:', newSelectedRowObjects);
    console.log('Selected row IDs after click:', Array.from(newSelectedRowIds));
  };

  const handleFiltersChange = (filters: Record<string, any>) => {
    console.log('Advanced Filters Changed:', filters);
    // Store filters for later use when search is clicked
    setCurrentFilters(filters);
    Object.entries(filters).forEach(([key, value]) => {
      console.log(`Filter - Key: ${key}, Value:`, value);
    });
  };

  const handleSearch = async () => {
    console.log('Search button clicked with filters:', currentFilters);
    setLoading(true);
    
    try {
      // Convert filters to API format
      const apiFilters: Record<string, any> = {};
      Object.entries(currentFilters).forEach(([key, filterValue]) => {
        if (filterValue && filterValue.value) {
          apiFilters[key] = filterValue.value;
        }
      });

      // Call the trip service API with filters
      const response = await tripService.getTrips({
        page: 1,
        limit: 50,
        filters: apiFilters
      });

      // Transform API data to match SampleData structure if needed
      // For now, we'll use the API data or fallback to sample data
      console.log('API Response:', response);
      
      // If API returns data, use it, otherwise keep sample data
      if (response.data && response.data.length > 0) {
        setApiData(response.data as any);
        gridState.setGridData(response.data as any);
      }

      toast({
        title: "Success",
        description: `Found ${response.data?.length || 0} results`
      });

    } catch (error) {
      console.error('API call failed:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data from server",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderSubRow = (row: any, rowIndex: number) => {
    return (
      <DraggableSubRow
        row={row}
        rowIndex={rowIndex}
        columns={gridState.columns}
        subRowColumnOrder={gridState.subRowColumnOrder}
        editingCell={gridState.editingCell}
        onReorderSubRowColumns={gridState.handleReorderSubRowColumns}
        onSubRowEdit={gridState.handleSubRowEdit}
        onSubRowEditStart={gridState.handleSubRowEditStart}
        onSubRowEditCancel={gridState.handleSubRowEditCancel}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-blue-600 hover:text-blue-800">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-600">
                Trip Execution Management
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Grid Container */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Selected rows indicator */}
          {selectedRowObjects.length > 0 && (
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
              <div className="text-sm text-blue-700">
                <span className="font-medium">{selectedRowObjects.length}</span> row{selectedRowObjects.length !== 1 ? 's' : ''} selected
                <span className="ml-2 text-xs">
                  ({selectedRowObjects.map(row => row.id).join(', ')})
                </span>
              </div>
            </div>
          )}
          <style>{`
            ${Array.from(selectedRowIds).map((rowId) => {
              return `
                tr[data-row-id="${rowId}"] {
                  background-color: #eff6ff !important;
                  border-left: 4px solid #3b82f6 !important;
                }
                tr[data-row-id="${rowId}"]:hover {
                  background-color: #dbeafe !important;
                }
              `;
            }).join('\n')}
          `}</style>
          <SmartGridWithGrouping
            key={`grid-${gridState.forceUpdate}`}
            columns={gridState.columns}
            data={gridState.gridData.length > 0 ? gridState.gridData : processedData}
            groupableColumns={['id','status', 'tripBillingStatus', 'departurePoint', 'arrivalPoint']}
            showGroupingDropdown={true}
            editableColumns={['plannedStartEndDateTime']}
            paginationMode="pagination"
            onLinkClick={handleLinkClick}
            onUpdate={handleUpdate}
            onSubRowToggle={gridState.handleSubRowToggle}
            selectedRows={selectedRows}
            onSelectionChange={handleRowSelection}
            onRowClick={handleRowClick}
            onFiltersChange={handleFiltersChange}
            onServerFilter={handleSearch}
            rowClassName={(row: any, index: number) => {
              return selectedRowIds.has(row.id) ? 'selected' : '';
            }}
            nestedRowRenderer={renderSubRow}
            configurableButtons={configurableButtons}
            showDefaultConfigurableButton={false}
            gridTitle="Trip Plans"
            recordCount={gridState.gridData.length > 0 ? gridState.gridData.length : processedData.length}
            showCreateButton={true}
            searchPlaceholder="Search all columns..."
            clientSideSearch={false}
            extraFilters={[
              {
                key: 'priority',
                label: 'Priority Level',
                type: 'select',
                options: ['High Priority', 'Medium Priority', 'Low Priority']
              }
            ]}
            showSubHeaders={false}
          />
          
          {/* Footer with action buttons matching the screenshot style */}
          <div className="flex items-center justify-between p-4 border-t bg-gray-50/50">
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 px-3 text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 px-3 text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                <MoreHorizontal className="h-4 w-4 mr-2" />
                More
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 px-4 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridDemo;
