import React, { useState } from 'react';
import { SmartGrid } from '@/components/SmartGrid';
import { GridColumnConfig } from '@/types/smartgrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const SmartGridHighlightDemo = () => {
  // Sample data
  const sampleData = [
    { id: 1, orderNo: 'ORD001', customer: 'Acme Corp', status: 'Pending', amount: 1250.00, date: '2025-01-15' },
    { id: 2, orderNo: 'ORD002', customer: 'TechStart Inc', status: 'Shipped', amount: 890.50, date: '2025-01-16' },
    { id: 3, orderNo: 'ORD003', customer: 'Global Solutions', status: 'Delivered', amount: 2100.00, date: '2025-01-17' },
    { id: 4, orderNo: 'ORD004', customer: 'NextGen Systems', status: 'Pending', amount: 750.25, date: '2025-01-18' },
    { id: 5, orderNo: 'ORD005', customer: 'Innovation Labs', status: 'Processing', amount: 1650.00, date: '2025-01-19' },
    { id: 6, orderNo: 'ORD006', customer: 'Digital Dynamics', status: 'Shipped', amount: 920.75, date: '2025-01-20' },
    { id: 7, orderNo: 'ORD007', customer: 'Future Tech', status: 'Delivered', amount: 3200.00, date: '2025-01-21' },
    { id: 8, orderNo: 'ORD008', customer: 'Smart Industries', status: 'Pending', amount: 1450.00, date: '2025-01-22' },
    { id: 9, orderNo: 'ORD009', customer: 'Prime Solutions', status: 'Processing', amount: 1890.50, date: '2025-01-23' },
    { id: 10, orderNo: 'ORD010', customer: 'Elite Systems', status: 'Shipped', amount: 2750.00, date: '2025-01-24' },
  ];

  const columns: GridColumnConfig[] = [
    { key: 'orderNo', label: 'Order No', type: 'Text', sortable: true, filterable: true },
    { key: 'customer', label: 'Customer', type: 'Text', sortable: true, filterable: true },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'Badge', 
      sortable: true, 
      filterable: true,
      statusMap: {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Processing': 'bg-blue-100 text-blue-800',
        'Shipped': 'bg-purple-100 text-purple-800',
        'Delivered': 'bg-green-100 text-green-800',
      }
    },
    { key: 'amount', label: 'Amount ($)', type: 'Text', sortable: true },
    { key: 'date', label: 'Date', type: 'Date', sortable: true, filterable: true },
  ];

  // State for highlighted rows
  const [highlightedRows, setHighlightedRows] = useState<number[]>([1, 3, 5]);
  const [inputValue, setInputValue] = useState('1,3,5');

  const handleHighlightChange = () => {
    const indices = inputValue
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));
    setHighlightedRows(indices);
  };

  const highlightRandomRows = () => {
    const count = Math.floor(Math.random() * 4) + 2; // 2-5 rows
    const indices: number[] = [];
    while (indices.length < count) {
      const random = Math.floor(Math.random() * sampleData.length);
      if (!indices.includes(random)) {
        indices.push(random);
      }
    }
    indices.sort((a, b) => a - b);
    setHighlightedRows(indices);
    setInputValue(indices.join(','));
  };

  const clearHighlights = () => {
    setHighlightedRows([]);
    setInputValue('');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">SmartGrid Highlight Demo</h1>
          <p className="text-muted-foreground">
            Demonstrate row highlighting by passing indices to the SmartGrid component
          </p>
        </div>

        {/* Controls Card */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Highlight Controls</h2>
          
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px] space-y-2">
              <label className="text-sm font-medium text-foreground">
                Row Indices (comma-separated, 0-based)
              </label>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g., 0,2,4"
                className="w-full"
              />
            </div>
            
            <Button onClick={handleHighlightChange} variant="default">
              Apply Highlights
            </Button>
            <Button onClick={highlightRandomRows} variant="outline">
              Random Highlights
            </Button>
            <Button onClick={clearHighlights} variant="ghost">
              Clear All
            </Button>
          </div>

          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              Currently highlighting rows: {highlightedRows.length > 0 ? highlightedRows.join(', ') : 'None'}
            </p>
          </div>
        </Card>

        {/* SmartGrid */}
        <div className="bg-card rounded-lg shadow-sm border">
          <SmartGrid
            columns={columns}
            data={sampleData}
            highlightedRowIndices={highlightedRows}
            gridTitle="Orders Demo"
            recordCount={sampleData.length}
            searchPlaceholder="Search orders..."
          />
        </div>

        {/* Info Card */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Feature Information</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Highlighted rows have a yellow background with a left border</li>
            <li>• Highlighting works with sorting, filtering, and pagination</li>
            <li>• Smooth transition animations when highlights change</li>
            <li>• Hover effects are preserved on highlighted rows</li>
            <li>• Pass row indices as zero-based array to highlightedRowIndices prop</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default SmartGridHighlightDemo;
