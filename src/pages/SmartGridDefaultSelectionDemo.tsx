import React, { useState } from 'react';
import { SmartGridWithGrouping } from '@/components/SmartGrid/SmartGridWithGrouping';
import { GridColumnConfig } from '@/types/smartgrid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';

// Sample data
const generateSampleData = () => [
  { id: 1, orderNo: 'ORD-001', customer: 'Acme Corp', status: 'Active', amount: '$15,000', priority: 'High' },
  { id: 2, orderNo: 'ORD-002', customer: 'TechStart Inc', status: 'Pending', amount: '$8,500', priority: 'Medium' },
  { id: 3, orderNo: 'ORD-003', customer: 'Global Solutions', status: 'Active', amount: '$22,000', priority: 'High' },
  { id: 4, orderNo: 'ORD-004', customer: 'Innovation Labs', status: 'Completed', amount: '$12,000', priority: 'Low' },
  { id: 5, orderNo: 'ORD-005', customer: 'Digital Ventures', status: 'Active', amount: '$18,500', priority: 'High' },
  { id: 6, orderNo: 'ORD-006', customer: 'Smart Systems', status: 'Pending', amount: '$9,500', priority: 'Medium' },
  { id: 7, orderNo: 'ORD-007', customer: 'Future Tech', status: 'Active', amount: '$25,000', priority: 'High' },
  { id: 8, orderNo: 'ORD-008', customer: 'Cloud Masters', status: 'Completed', amount: '$14,000', priority: 'Low' },
];

const columns: GridColumnConfig[] = [
  { key: 'orderNo', label: 'Order #', sortable: true, type: 'Link' },
  { key: 'customer', label: 'Customer', sortable: true, filterable: true, type: 'Text' },
  { 
    key: 'status', 
    label: 'Status', 
    sortable: true, 
    filterable: true,
    type: 'Badge',
    statusMap: {
      'Active': 'default',
      'Pending': 'secondary',
      'Completed': 'outline'
    }
  },
  { 
    key: 'amount', 
    label: 'Amount', 
    sortable: true,
    type: 'Text'
  },
  { 
    key: 'priority', 
    label: 'Priority', 
    sortable: true, 
    filterable: true,
    type: 'Badge',
    statusMap: {
      'High': 'destructive',
      'Medium': 'secondary',
      'Low': 'outline'
    }
  },
];

export default function SmartGridDefaultSelectionDemo() {
  const [data] = useState(generateSampleData());
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [defaultIndexes, setDefaultIndexes] = useState<number[]>([0, 2, 4]);
  const [selectionHistory, setSelectionHistory] = useState<string[]>([]);

  const handleSelectionChange = (rows: any[]) => {
    setSelectedRows(rows);
    const timestamp = new Date().toLocaleTimeString();
    const orderNos = rows.map(r => r.orderNo).join(', ');
    setSelectionHistory(prev => [
      `[${timestamp}] Selected ${rows.length} row(s): ${orderNos || 'None'}`,
      ...prev.slice(0, 9) // Keep last 10 entries
    ]);
  };

  const parseAmount = (amountStr: string): number => {
    return parseInt(amountStr.replace(/[$,]/g, ''), 10);
  };

  const handleResetSelection = () => {
    setDefaultIndexes([0, 2, 4]);
    const timestamp = new Date().toLocaleTimeString();
    setSelectionHistory(prev => [
      `[${timestamp}] Reset to default selection (indexes: 0, 2, 4)`,
      ...prev.slice(0, 9)
    ]);
  };

  const handleCustomSelection = () => {
    const randomIndexes = Array.from(
      { length: 3 }, 
      () => Math.floor(Math.random() * data.length)
    ).filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates
    
    setDefaultIndexes(randomIndexes);
    const timestamp = new Date().toLocaleTimeString();
    setSelectionHistory(prev => [
      `[${timestamp}] Applied random selection (indexes: ${randomIndexes.join(', ')})`,
      ...prev.slice(0, 9)
    ]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">SmartGrid Default Selection Demo</h1>
        <p className="text-muted-foreground">
          Demonstrates default row selection with full toggle behavior (select/unselect/reselect)
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Default Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{defaultIndexes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Indexes: {defaultIndexes.join(', ')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Currently Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedRows.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedRows.map(r => r.orderNo).join(', ') || 'None'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${selectedRows.reduce((sum, row) => sum + parseAmount(row.amount), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From selected orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Control Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Selection Controls</CardTitle>
          <CardDescription>Test different selection scenarios</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={handleResetSelection} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Default (0, 2, 4)
          </Button>
          <Button onClick={handleCustomSelection} variant="secondary">
            Apply Random Selection
          </Button>
          <Button 
            onClick={() => setDefaultIndexes([])} 
            variant="outline"
          >
            Clear All (Empty Array)
          </Button>
          <Button 
            onClick={() => setDefaultIndexes([1, 3, 5, 7])} 
            variant="outline"
          >
            Select Even Indexes
          </Button>
        </CardContent>
      </Card>

      {/* Selection History */}
      <Card>
        <CardHeader>
          <CardTitle>Selection History</CardTitle>
          <CardDescription>Recent selection changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {selectionHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">No selection changes yet. Click on rows to select/deselect them.</p>
            ) : (
              selectionHistory.map((entry, idx) => (
                <div key={idx} className="text-xs font-mono bg-muted/50 p-2 rounded">
                  {entry}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feature Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Features Demonstrated</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-2">
            <Badge>1</Badge>
            <p className="text-sm">
              <strong>Default Selection:</strong> Rows at indexes 0, 2, and 4 are preselected on load
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge>2</Badge>
            <p className="text-sm">
              <strong>Toggle Behavior:</strong> Click any row to select/deselect it
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge>3</Badge>
            <p className="text-sm">
              <strong>Visual Feedback:</strong> Selected rows have blue background and left border accent
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge>4</Badge>
            <p className="text-sm">
              <strong>Clear Selection:</strong> Use the "Clear Selection" button above the grid
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge>5</Badge>
            <p className="text-sm">
              <strong>Reapply Selection:</strong> Use control buttons to dynamically change default selection
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge>6</Badge>
            <p className="text-sm">
              <strong>Grouping Compatible:</strong> Try grouping by Status or Priority to see selection work with groups
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      <SmartGridWithGrouping
        columns={columns}
        data={data}
        defaultSelectedRowIndexes={defaultIndexes}
        onRowSelectionChange={handleSelectionChange}
        selectable={true}
        groupableColumns={['status', 'priority', 'customer']}
        showGroupingDropdown={true}
        paginationMode="pagination"
        gridTitle="Orders with Default Selection"
        recordCount={data.length}
        showCreateButton={false}
        searchPlaceholder="Search orders..."
        clientSideSearch={true}
        hideAdvancedFilter={true}
        hideCheckboxToggle={true}
      />

      {/* Selected Rows Details */}
      {selectedRows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Rows Details</CardTitle>
            <CardDescription>{selectedRows.length} order(s) selected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedRows.map((row, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{idx + 1}</Badge>
                    <div>
                      <p className="font-medium">{row.orderNo}</p>
                      <p className="text-sm text-muted-foreground">{row.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={row.priority === 'High' ? 'destructive' : 'secondary'}>
                      {row.priority}
                    </Badge>
                    <span className="font-medium">{row.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
