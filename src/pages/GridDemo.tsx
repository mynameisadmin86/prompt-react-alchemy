
import React, { useState, useMemo } from 'react';
import { SmartGrid } from '@/components/SmartGrid';
import { useToast } from '@/hooks/use-toast';
import { GridHeader } from '@/components/GridDemo/GridHeader';
import { GridFooter } from '@/components/GridDemo/GridFooter';
import { useGridColumns } from '@/hooks/useGridColumns';
import { sampleData } from '@/data/sampleGridData';
import { getStatusColor } from '@/utils/statusColors';

const GridDemo = () => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const { columns, handleSubRowToggle } = useGridColumns();
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-6">
        <GridHeader />

        {/* Debug info */}
        <div className="text-sm text-gray-600">
          Selected rows: {Array.from(selectedRows).join(', ') || 'None'}
        </div>

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
            columns={columns}
            data={processedData}
            editableColumns={['plannedStartEndDateTime']}
            paginationMode="pagination"
            onLinkClick={handleLinkClick}
            onUpdate={handleUpdate}
            onSubRowToggle={handleSubRowToggle}
            selectedRows={selectedRows}
            onSelectionChange={handleRowSelection}
            rowClassName={(row: any, index: number) => 
              selectedRows.has(index) ? 'smart-grid-row-selected' : ''
            }
          />
          
          <GridFooter />
        </div>
      </div>
    </div>
  );
};

export default GridDemo;
