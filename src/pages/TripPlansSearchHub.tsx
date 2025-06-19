
import React, { useState, useMemo, useEffect } from 'react';
import { SmartGrid } from '@/components/SmartGrid';
import { GridColumnConfig } from '@/types/smartgrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Search, ChevronDown, ChevronUp, Filter, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSmartGridState } from '@/hooks/useSmartGridState';
import { DraggableSubRow } from '@/components/SmartGrid/DraggableSubRow';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface TripPlanData {
  id: string;
  status: string;
  tripBillingStatus: string;
  plannedStartEndDateTime: string;
  actualStartEndDateTime: string;
  departurePoint: string;
  arrivalPoint: string;
  customer: string;
  draftBill: string;
}

const TripPlansSearchHub = () => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    tripPlanNo: '',
    status: '',
    customer: '',
    departurePoint: '',
    arrivalPoint: ''
  });
  
  const gridState = useSmartGridState();
  const { toast } = useToast();

  const columns: GridColumnConfig[] = [
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
      type: 'DateTimeRange',
      sortable: true,
      editable: false,
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
      type: 'Text',
      sortable: true,
      editable: false,
      subRow: true
    },
    {
      key: 'arrivalPoint',
      label: 'Arrival Point',
      type: 'Text',
      sortable: true,
      editable: false,
      subRow: true
    },
    {
      key: 'customer',
      label: 'Customer',
      type: 'Text',
      sortable: true,
      editable: false,
      subRow: false
    },
    {
      key: 'draftBill',
      label: 'Draft Bill',
      type: 'Link',
      sortable: true,
      editable: false,
      subRow: false
    }
  ];

  // Initialize columns and data
  useEffect(() => {
    gridState.setColumns(columns);
    gridState.setGridData(processedData);
  }, []);

  const sampleData: TripPlanData[] = [
    {
      id: 'TRIP00000001',
      status: 'Released',
      tripBillingStatus: 'Draft Bill Raised',
      plannedStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      actualStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
      departurePoint: 'VLA-70',
      arrivalPoint: 'CUR-25',
      customer: '+3',
      draftBill: 'DB/000234'
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
      draftBill: 'DB/000234'
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
      draftBill: 'DB/000234'
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
      draftBill: 'DB/000234'
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
      draftBill: 'DB/000234'
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
      draftBill: 'DB/000234'
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
      draftBill: 'DB/000234'
    }
  ];

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'Released': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Under Execution': 'bg-purple-100 text-purple-800 border-purple-300',
      'Initiated': 'bg-blue-100 text-blue-800 border-blue-300',
      'Cancelled': 'bg-red-100 text-red-800 border-red-300',
      'Deleted': 'bg-red-100 text-red-800 border-red-300',
      'Confirmed': 'bg-green-100 text-green-800 border-green-300',
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

  const handleLinkClick = (value: any, row: any) => {
    console.log('Link clicked:', value, row);
  };

  const handleUpdate = async (updatedRow: any) => {
    console.log('Updating row:', updatedRow);
    gridState.setGridData(prev => 
      prev.map((row, index) => 
        index === updatedRow.index ? { ...row, ...updatedRow } : row
      )
    );
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast({
      title: "Success",
      description: "Trip plan updated successfully"
    });
  };

  const handleRowSelection = (selectedRowIndices: Set<number>) => {
    setSelectedRows(selectedRowIndices);
  };

  const handleSearchFilterChange = (field: string, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    console.log('Searching with filters:', searchFilters);
    toast({
      title: "Search",
      description: "Search functionality would be implemented here"
    });
  };

  const handleClearFilters = () => {
    setSearchFilters({
      tripPlanNo: '',
      status: '',
      customer: '',
      departurePoint: '',
      arrivalPoint: ''
    });
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
                Trip Plans Search Hub
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Title Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-semibold text-gray-900">Trip Plans</h1>
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
              {sampleData.length}
            </span>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Trip
          </Button>
        </div>

        {/* Collapsible Search Panel */}
        <Collapsible open={isSearchPanelOpen} onOpenChange={setIsSearchPanelOpen}>
          <Card className="bg-white shadow-sm">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Search Filters
                  </CardTitle>
                  {isSearchPanelOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Trip Plan No</label>
                    <Input
                      placeholder="Enter trip plan number"
                      value={searchFilters.tripPlanNo}
                      onChange={(e) => handleSearchFilterChange('tripPlanNo', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Input
                      placeholder="Enter status"
                      value={searchFilters.status}
                      onChange={(e) => handleSearchFilterChange('status', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Customer</label>
                    <Input
                      placeholder="Enter customer"
                      value={searchFilters.customer}
                      onChange={(e) => handleSearchFilterChange('customer', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Departure Point</label>
                    <Input
                      placeholder="Enter departure point"
                      value={searchFilters.departurePoint}
                      onChange={(e) => handleSearchFilterChange('departurePoint', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Arrival Point</label>
                    <Input
                      placeholder="Enter arrival point"
                      value={searchFilters.arrivalPoint}
                      onChange={(e) => handleSearchFilterChange('arrivalPoint', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear
                  </Button>
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Grid Container */}
        <div className="bg-white rounded-lg shadow-sm">
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
          />
        </div>
      </div>
    </div>
  );
};

export default TripPlansSearchHub;
