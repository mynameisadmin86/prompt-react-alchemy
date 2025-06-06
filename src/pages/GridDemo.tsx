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
  status1: string;
  status2: string;
  startDate: string;
  endDate: string;
  location: string;
  currency: string;
  value1: string;
  value2: string;
  locationDetails?: string;
  currencyDetails?: string;
}

const GridDemo = () => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const columns: GridColumnConfig[] = [
    {
      key: 'id',
      label: 'Trip ID',
      type: 'Link',
      sortable: true,
      editable: false,
      mandatory: true
    },
    {
      key: 'status1',
      label: 'Status 1',
      type: 'Badge',
      sortable: true,
      editable: false
    },
    {
      key: 'status2',
      label: 'Status 2',
      type: 'Badge',
      sortable: true,
      editable: false
    },
    {
      key: 'startDate',
      label: 'Start Date',
      type: 'DateTimeRange',
      sortable: true,
      editable: false
    },
    {
      key: 'endDate',
      label: 'End Date',
      type: 'DateTimeRange',
      sortable: true,
      editable: false
    },
    {
      key: 'location',
      label: 'Location',
      type: 'TextWithTooltip',
      sortable: true,
      editable: false,
      infoTextField: 'locationDetails'
    },
    {
      key: 'currency',
      label: 'Currency',
      type: 'TextWithTooltip',
      sortable: true,
      editable: false,
      infoTextField: 'currencyDetails'
    },
    {
      key: 'value1',
      label: 'Value 1',
      type: 'Text',
      sortable: true,
      editable: false
    },
    {
      key: 'value2',
      label: 'Value 2',
      type: 'Text',
      sortable: true,
      editable: false
    }
  ];

  const sampleData: SampleData[] = [
    {
      id: 'TRIP00000006',
      status1: 'Confirmed',
      status2: 'Not Eligible',
      startDate: '25-Mar-2025 11:22:34 PM',
      endDate: '25-Mar-2025 11:22:34 PM',
      location: 'VLA-70',
      currency: 'CUR-25',
      value1: '+3',
      value2: '+3',
      locationDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
      currencyDetails: 'Currency details for CUR-25'
    },
    {
      id: 'TRIP00000007',
      status1: 'Under Execution',
      status2: 'Revenue Leakage',
      startDate: '25-Mar-2025 11:22:34 PM',
      endDate: '25-Mar-2025 11:22:34 PM',
      location: 'VLA-70',
      currency: 'CUR-25',
      value1: '+3',
      value2: '+3',
      locationDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
      currencyDetails: 'Currency details for CUR-25'
    },
    {
      id: 'TRIP00000008',
      status1: 'Released',
      status2: 'Invoice Created',
      startDate: '25-Mar-2025 11:22:34 PM',
      endDate: '25-Mar-2025 11:22:34 PM',
      location: 'VLA-70',
      currency: 'CUR-25',
      value1: '+3',
      value2: '+3',
      locationDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
      currencyDetails: 'Currency details for CUR-25'
    },
    {
      id: 'TRIP00000009',
      status1: 'Cancelled',
      status2: 'Invoice Approved',
      startDate: '25-Mar-2025 11:22:34 PM',
      endDate: '25-Mar-2025 11:22:34 PM',
      location: 'VLA-70',
      currency: 'CUR-25',
      value1: '+3',
      value2: '+3',
      locationDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
      currencyDetails: 'Currency details for CUR-25'
    },
    {
      id: 'TRIP00000010',
      status1: 'In Progress',
      status2: 'Pending Review',
      startDate: '26-Mar-2025 09:15:22 AM',
      endDate: '26-Mar-2025 09:15:22 AM',
      location: 'NYC-45',
      currency: 'USD-50',
      value1: '+5',
      value2: '+5',
      locationDetails: 'NYC-450\nNew York Central\n\nAddress\n42nd Street, Manhattan, New York, NY 10017',
      currencyDetails: 'Currency details for USD-50'
    },
    {
      id: 'TRIP00000011',
      status1: 'Completed',
      status2: 'Payment Processed',
      startDate: '26-Mar-2025 02:30:18 PM',
      endDate: '26-Mar-2025 02:30:18 PM',
      location: 'LON-88',
      currency: 'GBP-75',
      value1: '+7',
      value2: '+7',
      locationDetails: 'LON-880\nLondon Central\n\nAddress\nKing\'s Cross Station, Euston Rd, London N1 9AL',
      currencyDetails: 'Currency details for GBP-75'
    },
    {
      id: 'TRIP00000012',
      status1: 'On Hold',
      status2: 'Documentation Missing',
      startDate: '27-Mar-2025 08:45:10 AM',
      endDate: '27-Mar-2025 08:45:10 AM',
      location: 'TKY-12',
      currency: 'JPY-100',
      value1: '+2',
      value2: '+2',
      locationDetails: 'TKY-120\nTokyo Station\n\nAddress\n1 Chome Marunouchi, Chiyoda City, Tokyo 100-0005',
      currencyDetails: 'Currency details for JPY-100'
    },
    {
      id: 'TRIP00000013',
      status1: 'Approved',
      status2: 'Ready for Dispatch',
      startDate: '27-Mar-2025 04:20:33 PM',
      endDate: '27-Mar-2025 04:20:33 PM',
      location: 'SYD-66',
      currency: 'AUD-35',
      value1: '+4',
      value2: '+4',
      locationDetails: 'SYD-660\nSydney Central\n\nAddress\nCentral Station, Eddy Ave, Sydney NSW 2000',
      currencyDetails: 'Currency details for AUD-35'
    },
    {
      id: 'TRIP00000014',
      status1: 'Rejected',
      status2: 'Policy Violation',
      startDate: '28-Mar-2025 11:55:47 AM',
      endDate: '28-Mar-2025 11:55:47 AM',
      location: 'PAR-23',
      currency: 'EUR-90',
      value1: '+6',
      value2: '+6',
      locationDetails: 'PAR-230\nParis Gare du Nord\n\nAddress\n18 Rue de Dunkerque, 75010 Paris',
      currencyDetails: 'Currency details for EUR-90'
    },
    {
      id: 'TRIP00000015',
      status1: 'Initiated',
      status2: 'Under Review',
      startDate: '29-Mar-2025 03:12:15 PM',
      endDate: '29-Mar-2025 03:12:15 PM',
      location: 'BER-34',
      currency: 'EUR-85',
      value1: '+8',
      value2: '+8',
      locationDetails: 'BER-340\nBerlin Hauptbahnhof\n\nAddress\nEuropaplatz 1, 10557 Berlin',
      currencyDetails: 'Currency details for EUR-85'
    },
    {
      id: 'TRIP00000016',
      status1: 'Confirmed',
      status2: 'Awaiting Approval',
      startDate: '30-Mar-2025 07:45:28 AM',
      endDate: '30-Mar-2025 07:45:28 AM',
      location: 'ROM-56',
      currency: 'EUR-75',
      value1: '+3',
      value2: '+3',
      locationDetails: 'ROM-560\nRoma Termini\n\nAddress\nPiazza dei Cinquecento, 00185 Roma RM',
      currencyDetails: 'Currency details for EUR-75'
    },
    {
      id: 'TRIP00000017',
      status1: 'Under Execution',
      status2: 'Processing Payment',
      startDate: '31-Mar-2025 01:30:42 PM',
      endDate: '31-Mar-2025 01:30:42 PM',
      location: 'MAD-89',
      currency: 'EUR-95',
      value1: '+6',
      value2: '+6',
      locationDetails: 'MAD-890\nMadrid Atocha\n\nAddress\nGlorieta del Emperador Carlos V, 28045 Madrid',
      currencyDetails: 'Currency details for EUR-95'
    },
    {
      id: 'TRIP00000018',
      status1: 'Released',
      status2: 'Dispatched',
      startDate: '01-Apr-2025 10:20:55 AM',
      endDate: '01-Apr-2025 10:20:55 AM',
      location: 'AMS-67',
      currency: 'EUR-80',
      value1: '+4',
      value2: '+4',
      locationDetails: 'AMS-670\nAmsterdam Centraal\n\nAddress\nStationsplein, 1012 AB Amsterdam',
      currencyDetails: 'Currency details for EUR-80'
    },
    {
      id: 'TRIP00000019',
      status1: 'Completed',
      status2: 'Invoice Sent',
      startDate: '02-Apr-2025 05:15:33 PM',
      endDate: '02-Apr-2025 05:15:33 PM',
      location: 'BRU-45',
      currency: 'EUR-70',
      value1: '+5',
      value2: '+5',
      locationDetails: 'BRU-450\nBruxelles-Central\n\nAddress\nCarrefour de l\'Europe 2, 1000 Bruxelles',
      currencyDetails: 'Currency details for EUR-70'
    }
  ];

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'Confirmed': 'bg-green-100 text-green-800',
      'Under Execution': 'bg-purple-100 text-purple-800',
      'Released': 'bg-yellow-100 text-yellow-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'On Hold': 'bg-orange-100 text-orange-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Initiated': 'bg-blue-100 text-blue-800',
      'Not Eligible': 'bg-red-100 text-red-800',
      'Revenue Leakage': 'bg-red-100 text-red-800',
      'Invoice Created': 'bg-blue-100 text-blue-800',
      'Invoice Approved': 'bg-green-100 text-green-800',
      'Pending Review': 'bg-yellow-100 text-yellow-800',
      'Payment Processed': 'bg-green-100 text-green-800',
      'Documentation Missing': 'bg-orange-100 text-orange-800',
      'Ready for Dispatch': 'bg-blue-100 text-blue-800',
      'Policy Violation': 'bg-red-100 text-red-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
      'Awaiting Approval': 'bg-yellow-100 text-yellow-800',
      'Processing Payment': 'bg-blue-100 text-blue-800',
      'Dispatched': 'bg-green-100 text-green-800',
      'Invoice Sent': 'bg-blue-100 text-blue-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const processedData = useMemo(() => {
    return sampleData.map(row => ({
      ...row,
      status1: {
        value: row.status1,
        variant: getStatusColor(row.status1)
      },
      status2: {
        value: row.status2,
        variant: getStatusColor(row.status2)
      },
      startDate: `${row.startDate.split(' ')[0]}\n${row.startDate.split(' ')[1]} ${row.startDate.split(' ')[2]}`,
      endDate: `${row.endDate.split(' ')[0]}\n${row.endDate.split(' ')[1]} ${row.endDate.split(' ')[2]}`
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
