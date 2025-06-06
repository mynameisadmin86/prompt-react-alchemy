
import React, { useState, useMemo } from 'react';
import { SmartGrid } from '@/components/SmartGrid';
import { GridColumnConfig } from '@/types/smartgrid';
import { Button } from '@/components/ui/button';
import { Printer, MoreHorizontal } from 'lucide-react';
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
}

const GridDemo = () => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const columns: GridColumnConfig[] = [
    {
      key: 'id',
      label: 'Trip Plan No',
      type: 'Link',
      sortable: true,
      editable: false,
      mandatory: true
    },
    {
      key: 'status',
      label: 'Status',
      type: 'Badge',
      sortable: true,
      editable: false
    },
    {
      key: 'tripBillingStatus',
      label: 'Trip Billing Status',
      type: 'Badge',
      sortable: true,
      editable: false
    },
    {
      key: 'plannedStartEndDateTime',
      label: 'Planned Start and End Date Time',
      type: 'DateTimeRange',
      sortable: true,
      editable: false
    },
    {
      key: 'actualStartEndDateTime',
      label: 'Actual Start and End Date Time',
      type: 'DateTimeRange',
      sortable: true,
      editable: false
    },
    {
      key: 'departurePoint',
      label: 'Departure Point',
      type: 'TextWithTooltip',
      sortable: true,
      editable: false,
      infoTextField: 'departurePointDetails'
    },
    {
      key: 'arrivalPoint',
      label: 'Arrival Point',
      type: 'TextWithTooltip',
      sortable: true,
      editable: false,
      infoTextField: 'arrivalPointDetails'
    },
    {
      key: 'customer',
      label: 'Customer',
      type: 'Text',
      sortable: true,
      editable: false
    },
    {
      key: 'resources',
      label: 'Resources',
      type: 'Text',
      sortable: true,
      editable: false
    }
  ];

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
      arrivalPointDetails: 'Currency details for CUR-25'
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
      arrivalPointDetails: 'Currency details for CUR-25'
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
      arrivalPointDetails: 'Currency details for CUR-25'
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
      arrivalPointDetails: 'Currency details for CUR-25'
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
      arrivalPointDetails: 'Currency details for CUR-25'
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
      arrivalPointDetails: 'Currency details for CUR-25'
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
      arrivalPointDetails: 'Currency details for CUR-25'
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

  const handleLinkClick = (value: any, row: any) => {
    console.log('Link clicked:', value, row);
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

        {/* Title Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-semibold text-gray-900">Trip Plans</h1>
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
              9
            </span>
          </div>
        </div>

        {/* Grid Container */}
        <div className="bg-white rounded-lg shadow-sm">
          <SmartGrid
            columns={columns}
            data={processedData}
            editableColumns={false}
            paginationMode="pagination"
            onLinkClick={handleLinkClick}
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
