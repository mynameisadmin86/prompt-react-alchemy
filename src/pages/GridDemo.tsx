
import React, { useState, useMemo } from 'react';
import { SmartGrid } from '@/components/SmartGrid';
import { GridColumnConfig } from '@/types/smartgrid';
import { Button } from '@/components/ui/button';
import { Printer, MoreHorizontal } from 'lucide-react';

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
      type: 'Text',
      sortable: true,
      editable: false
    },
    {
      key: 'currency',
      label: 'Currency',
      type: 'Text',
      sortable: true,
      editable: false
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
      value2: '+3'
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
      value2: '+3'
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
      value2: '+3'
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
      value2: '+3'
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
      value2: '+5'
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
      value2: '+7'
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
      value2: '+2'
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
      value2: '+4'
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
      value2: '+6'
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
      'Not Eligible': 'bg-red-100 text-red-800',
      'Revenue Leakage': 'bg-red-100 text-red-800',
      'Invoice Created': 'bg-blue-100 text-blue-800',
      'Invoice Approved': 'bg-green-100 text-green-800',
      'Pending Review': 'bg-yellow-100 text-yellow-800',
      'Payment Processed': 'bg-green-100 text-green-800',
      'Documentation Missing': 'bg-orange-100 text-orange-800',
      'Ready for Dispatch': 'bg-blue-100 text-blue-800',
      'Policy Violation': 'bg-red-100 text-red-800'
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
    <div className="container mx-auto p-6 space-y-6">
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
  );
};

export default GridDemo;
