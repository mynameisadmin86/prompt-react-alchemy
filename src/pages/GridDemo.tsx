
import React from 'react';
import { SmartGrid } from '@/components/SmartGrid';
import { downloadJsonPlugin } from '@/plugins/downloadJsonPlugin';
import { GridColumnConfig } from '@/types/smartgrid';
import { Search, Filter, Download, MoreHorizontal, Grid3x3, List, Settings, Home, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Sample trip data matching the logistics interface
const tripData = [
  {
    id: 1,
    tripPlanNo: 'TRIP00000001',
    status: 'Released',
    tripBillingStatus: 'Draft Bill Raised',
    plannedStartDateTime: '25-Mar-2025 11:22:34 PM',
    plannedEndDateTime: '27-Mar-2025 11:22:34 PM',
    actualStartDateTime: '25-Mar-2025 11:22:34 PM',
    actualEndDateTime: '27-Mar-2025 11:22:34 PM',
    departurePoint: 'VLA-70',
    arrivalPoint: 'CUR-25',
    customer: '+3',
    resources: '+3'
  },
  {
    id: 2,
    tripPlanNo: 'TRIP00000002',
    status: 'Under Execution',
    tripBillingStatus: 'Not Eligible',
    plannedStartDateTime: '25-Mar-2025 11:22:34 PM',
    plannedEndDateTime: '27-Mar-2025 11:22:34 PM',
    actualStartDateTime: '25-Mar-2025 11:22:34 PM',
    actualEndDateTime: '27-Mar-2025 11:22:34 PM',
    departurePoint: 'VLA-70',
    arrivalPoint: 'CUR-25',
    customer: '+3',
    resources: '+3'
  },
  {
    id: 3,
    tripPlanNo: 'TRIP00000003',
    status: 'Initiated',
    tripBillingStatus: 'Revenue Leakage',
    plannedStartDateTime: '25-Mar-2025 11:22:34 PM',
    plannedEndDateTime: '27-Mar-2025 11:22:34 PM',
    actualStartDateTime: '25-Mar-2025 11:22:34 PM',
    actualEndDateTime: '27-Mar-2025 11:22:34 PM',
    departurePoint: 'VLA-70',
    arrivalPoint: 'CUR-25',
    customer: '+3',
    resources: '+3'
  },
  {
    id: 4,
    tripPlanNo: 'TRIP00000004',
    status: 'Cancelled',
    tripBillingStatus: 'Invoice Created',
    plannedStartDateTime: '25-Mar-2025 11:22:34 PM',
    plannedEndDateTime: '27-Mar-2025 11:22:34 PM',
    actualStartDateTime: '25-Mar-2025 11:22:34 PM',
    actualEndDateTime: '27-Mar-2025 11:22:34 PM',
    departurePoint: 'VLA-70',
    arrivalPoint: 'CUR-25',
    customer: '+3',
    resources: '+3'
  },
  {
    id: 5,
    tripPlanNo: 'TRIP00000005',
    status: 'Deleted',
    tripBillingStatus: 'Invoice Approved',
    plannedStartDateTime: '25-Mar-2025 11:22:34 PM',
    plannedEndDateTime: '27-Mar-2025 11:22:34 PM',
    actualStartDateTime: '25-Mar-2025 11:22:34 PM',
    actualEndDateTime: '27-Mar-2025 11:22:34 PM',
    departurePoint: 'VLA-70',
    arrivalPoint: 'CUR-25',
    customer: '+3',
    resources: '+3'
  },
  {
    id: 6,
    tripPlanNo: 'TRIP00000006',
    status: 'Confirmed',
    tripBillingStatus: 'Not Eligible',
    plannedStartDateTime: '25-Mar-2025 11:22:34 PM',
    plannedEndDateTime: '27-Mar-2025 11:22:34 PM',
    actualStartDateTime: '25-Mar-2025 11:22:34 PM',
    actualEndDateTime: '27-Mar-2025 11:22:34 PM',
    departurePoint: 'VLA-70',
    arrivalPoint: 'CUR-25',
    customer: '+3',
    resources: '+3'
  },
  {
    id: 7,
    tripPlanNo: 'TRIP00000007',
    status: 'Under Execution',
    tripBillingStatus: 'Revenue Leakage',
    plannedStartDateTime: '25-Mar-2025 11:22:34 PM',
    plannedEndDateTime: '27-Mar-2025 11:22:34 PM',
    actualStartDateTime: '25-Mar-2025 11:22:34 PM',
    actualEndDateTime: '27-Mar-2025 11:22:34 PM',
    departurePoint: 'VLA-70',
    arrivalPoint: 'CUR-25',
    customer: '+3',
    resources: '+3'
  }
];

// Status badge component
const StatusBadge = ({ status, type }: { status: string; type: 'status' | 'billing' }) => {
  const getStatusColor = (status: string, type: string) => {
    if (type === 'status') {
      switch (status) {
        case 'Released': return 'bg-green-100 text-green-800 border-green-200';
        case 'Under Execution': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'Initiated': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
        case 'Deleted': return 'bg-red-100 text-red-800 border-red-200';
        case 'Confirmed': return 'bg-green-100 text-green-800 border-green-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    } else {
      switch (status) {
        case 'Draft Bill Raised': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'Not Eligible': return 'bg-red-100 text-red-800 border-red-200';
        case 'Revenue Leakage': return 'bg-red-100 text-red-800 border-red-200';
        case 'Invoice Created': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Invoice Approved': return 'bg-green-100 text-green-800 border-green-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(status, type)}`}>
      {status}
    </span>
  );
};

// Column configuration matching the logistics interface
const columns: GridColumnConfig[] = [
  {
    key: 'tripPlanNo',
    label: 'Trip Plan No',
    editable: false,
    mandatory: true,
    sortable: true,
    filterable: true,
    hidden: false,
    order: 0,
    type: 'text'
  },
  {
    key: 'status',
    label: 'Status',
    editable: true,
    mandatory: false,
    sortable: true,
    filterable: true,
    hidden: false,
    order: 1,
    type: 'select',
    options: ['Released', 'Under Execution', 'Initiated', 'Cancelled', 'Deleted', 'Confirmed']
  },
  {
    key: 'tripBillingStatus',
    label: 'Trip Billing Status',
    editable: true,
    mandatory: false,
    sortable: true,
    filterable: true,
    hidden: false,
    order: 2,
    type: 'select',
    options: ['Draft Bill Raised', 'Not Eligible', 'Revenue Leakage', 'Invoice Created', 'Invoice Approved']
  },
  {
    key: 'plannedStartDateTime',
    label: 'Planned Start and End Date Time',
    editable: true,
    mandatory: false,
    sortable: true,
    filterable: true,
    hidden: false,
    order: 3,
    type: 'text'
  },
  {
    key: 'actualStartDateTime',
    label: 'Actual Start and End Date Time',
    editable: true,
    mandatory: false,
    sortable: true,
    filterable: true,
    hidden: false,
    order: 4,
    type: 'text'
  },
  {
    key: 'departurePoint',
    label: 'Departure Point',
    editable: true,
    mandatory: false,
    sortable: true,
    filterable: true,
    hidden: false,
    order: 5,
    type: 'text'
  },
  {
    key: 'arrivalPoint',
    label: 'Arrival Point',
    editable: true,
    mandatory: false,
    sortable: true,
    filterable: true,
    hidden: false,
    order: 6,
    type: 'text'
  },
  {
    key: 'customer',
    label: 'Customer',
    editable: false,
    mandatory: false,
    sortable: true,
    filterable: true,
    hidden: false,
    order: 7,
    type: 'text'
  },
  {
    key: 'resources',
    label: 'Resources',
    editable: false,
    mandatory: false,
    sortable: true,
    filterable: true,
    hidden: false,
    order: 8,
    type: 'text'
  }
];

const GridDemo = () => {
  // Handler for inline editing
  const handleInlineEdit = (rowIndex: number, updatedRow: any) => {
    console.log('Row edited:', { rowIndex, updatedRow });
  };

  // Handler for bulk updates
  const handleBulkUpdate = async (rows: any[]): Promise<void> => {
    console.log('Bulk update:', rows);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Bulk update completed');
        resolve();
      }, 1000);
    });
  };

  // Handler for preference saving
  const handlePreferenceSave = async (preferences: any): Promise<void> => {
    console.log('Preferences saved:', preferences);
    // Simulate API call to save preferences
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Preferences saved to server');
        resolve();
      }, 500);
    });
  };

  // Custom cell renderer for status badges
  const customCellRenderer = (value: any, column: GridColumnConfig) => {
    if (column.key === 'status') {
      return <StatusBadge status={value} type="status" />;
    }
    if (column.key === 'tripBillingStatus') {
      return <StatusBadge status={value} type="billing" />;
    }
    if (column.key === 'tripPlanNo') {
      return <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">{value}</span>;
    }
    if (column.key === 'plannedStartDateTime' || column.key === 'actualStartDateTime') {
      const [date, time] = value.split(' ');
      return (
        <div className="text-sm">
          <div className="text-gray-900">{date}</div>
          <div className="text-gray-500 text-xs">{time}</div>
        </div>
      );
    }
    if (column.key === 'departurePoint' || column.key === 'arrivalPoint') {
      return (
        <div className="flex items-center gap-1">
          <span className="text-gray-900">{value}</span>
          <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      );
    }
    return <span className="text-gray-900">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="p-1">
              <Menu className="h-5 w-5 text-gray-600" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Logistics</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search"
                className="pl-10 w-64 bg-gray-50 border-gray-200 h-9"
              />
            </div>
            <Button variant="ghost" size="sm" className="p-1">
              <Settings className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar and Main Content */}
      <div className="flex min-h-screen">
        {/* Left Sidebar */}
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
            <Home className="h-5 w-5 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
          </Button>
          <div className="flex-1"></div>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
            <Settings className="h-5 w-5 text-gray-400" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-50">
          {/* Breadcrumb */}
          <div className="bg-white border-b border-gray-200 px-6 py-2">
            <div className="flex items-center space-x-2 text-sm">
              <Home className="h-4 w-4 text-blue-600" />
              <span className="text-blue-600">Home</span>
              <span className="text-gray-400">{'>'}</span>
              <span className="text-gray-600">Trip Execution Management</span>
            </div>
          </div>

          <div className="p-6">
            {/* Trip Plans Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-semibold text-gray-900">Trip Plans</h1>
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  9
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search"
                    className="pl-10 w-80 bg-white border-gray-300 h-9"
                  />
                </div>
                <Button variant="outline" size="sm" className="h-9 px-3">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-9 px-3">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-9 px-3">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-9 px-3">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-9 px-3">
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-9 px-3">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Grid */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <SmartGrid
                columns={columns}
                data={tripData}
                editableColumns={true}
                mandatoryColumns={['tripPlanNo']}
                onInlineEdit={handleInlineEdit}
                onBulkUpdate={handleBulkUpdate}
                onPreferenceSave={handlePreferenceSave}
                paginationMode="pagination"
                plugins={[downloadJsonPlugin]}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridDemo;
