import React, { useState, useMemo, useEffect } from 'react';
import { SmartGrid } from '@/components/SmartGrid';
import { GridColumnConfig } from '@/types/smartgrid';
import { Button } from '@/components/ui/button';
import { Printer, MoreHorizontal, User, Train, UserCheck, Container, Plus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSmartGridState } from '@/hooks/useSmartGridState';
import { DraggableSubRow } from '@/components/SmartGrid/DraggableSubRow';
import { ConfigurableButtonConfig } from '@/components/ui/configurable-button';
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
  const gridState = useSmartGridState();
  
  const initialColumns: GridColumnConfig[] = [
    {
      key: 'id',
      label: 'Trip Plan No',
      type: 'Link',
      sortable: true,
      editable: false,
      mandatory: true,
      subRow: false
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
      key: 'status',
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
        <div>
          <div className="d-flex align-items-center mb-4 small font-weight-medium text-secondary">
            <User className="mr-2" style={{ width: '16px', height: '16px' }} />
            Customer Details
          </div>
          {row.customerDetails?.map((customer, index) => (
            <div key={index} className="d-flex align-items-center p-3 bg-light rounded mb-3">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mr-3" style={{ width: '32px', height: '32px', backgroundColor: '#e3f2fd' }}>
                <User style={{ width: '16px', height: '16px', color: '#1976d2' }} />
              </div>
              <div>
                <div className="font-weight-medium text-dark">{customer.name}</div>
                <div className="small text-muted">{customer.id}</div>
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
        <div>
          <div className="d-flex align-items-center mb-4 small font-weight-medium text-secondary">
            <Container className="mr-2" style={{ width: '16px', height: '16px' }} />
            Resource Details
          </div>
          {row.resourceDetails?.map((resource, index) => (
            <div key={index} className="d-flex align-items-center p-3 bg-light rounded mb-3">
              <div className="bg-success rounded-circle d-flex align-items-center justify-content-center mr-3" style={{ width: '32px', height: '32px', backgroundColor: '#e8f5e8' }}>
                {resource.type === 'train' && <Train style={{ width: '16px', height: '16px', color: '#388e3c' }} />}
                {resource.type === 'agent' && <UserCheck style={{ width: '16px', height: '16px', color: '#388e3c' }} />}
                {resource.type === 'container' && <Container style={{ width: '16px', height: '16px', color: '#388e3c' }} />}
              </div>
              <div>
                <div className="font-weight-medium text-dark">{resource.name}</div>
                <div className="small text-muted">{resource.id}</div>
              </div>
            </div>
          ))}
        </div>
      )
    }
  ];

  // Initialize columns and data in the grid state
  useEffect(() => {
    console.log('Initializing columns in GridDemo');
    gridState.setColumns(initialColumns);
    gridState.setGridData(processedData);
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
    console.log('Selected rows changed:', selectedRowIndices);
    setSelectedRows(selectedRowIndices);
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
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
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
        <div className="bg-white rounded shadow-sm mb-4">
          <style>{`
            .smart-grid-row-selected {
              background-color: #eff6ff !important;
              border-left: 4px solid #3b82f6 !important;
            }
            .smart-grid-row-selected:hover {
              background-color: #dbeafe !important;
            }
          `}</style>
          <SmartGrid
            key={`grid-${gridState.forceUpdate}`}
            columns={gridState.columns}
            data={gridState.gridData.length > 0 ? gridState.gridData : processedData}
            editableColumns={['plannedStartEndDateTime']}
            paginationMode="pagination"
            onLinkClick={handleLinkClick}
            onUpdate={handleUpdate}
            onSubRowToggle={gridState.handleSubRowToggle}
            selectedRows={selectedRows}
            onSelectionChange={handleRowSelection}
            rowClassName={(row: any, index: number) => 
              selectedRows.has(index) ? 'smart-grid-row-selected' : ''
            }
            nestedRowRenderer={renderSubRow}
            configurableButtons={configurableButtons}
            showDefaultConfigurableButton={false}
            gridTitle="Trip Plans"
            recordCount={gridState.gridData.length > 0 ? gridState.gridData.length : processedData.length}
            showCreateButton={true}
            searchPlaceholder="Search all columns..."
          />
          
          {/* Footer with action buttons */}
          <div className="d-flex justify-content-between align-items-center p-4 border-top bg-light">
            <div className="d-flex align-items-center">
              <Button 
                variant="outline" 
                size="sm"
                className="btn btn-sm btn-outline-secondary d-flex align-items-center mr-3"
                onClick={() => {
                  toast({
                    title: "Print",
                    description: "Printing functionality would be implemented here"
                  });
                }}
              >
                <Printer className="mr-2" style={{ width: '16px', height: '16px' }} />
                Print
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                onClick={() => {
                  toast({
                    title: "More Actions",
                    description: "Additional actions menu would appear here"
                  });
                }}
              >
                <MoreHorizontal className="mr-2" style={{ width: '16px', height: '16px' }} />
                More Actions
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              className="btn btn-sm btn-outline-danger"
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
