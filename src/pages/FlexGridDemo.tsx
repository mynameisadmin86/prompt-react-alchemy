
import React, { useState } from 'react';
import { FlexGridLayout } from '@/components/FlexGridLayout';
import { PanelConfig } from '@/components/FlexGridLayout/types';
import { SmartGrid } from '@/components/SmartGrid';
import { GridColumnConfig } from '@/types/smartgrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const FlexGridDemo = () => {
  const { toast } = useToast();
  const [layoutDirection, setLayoutDirection] = useState<'row' | 'column'>('column');

  // Sample data for chart
  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
  ];

  // Sample grid columns
  const gridColumns: GridColumnConfig[] = [
    { key: 'id', label: 'ID', type: 'Text', sortable: true, editable: false, mandatory: true, subRow: false },
    { key: 'name', label: 'Name', type: 'Text', sortable: true, editable: true, subRow: false },
    { key: 'status', label: 'Status', type: 'Badge', sortable: true, editable: false, subRow: false },
  ];

  // Sample grid data
  const gridData = [
    { id: '1', name: 'John Doe', status: { value: 'Active', variant: 'bg-green-100 text-green-800' } },
    { id: '2', name: 'Jane Smith', status: { value: 'Inactive', variant: 'bg-red-100 text-red-800' } },
    { id: '3', name: 'Bob Johnson', status: { value: 'Pending', variant: 'bg-yellow-100 text-yellow-800' } },
  ];

  // Form Component
  const FormPanel = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Enter name" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter email" />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" placeholder="Enter message" />
      </div>
      <Button onClick={() => toast({ title: "Form submitted!" })}>
        Submit
      </Button>
    </div>
  );

  // Chart Component
  const ChartPanel = () => (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  // Grid Component
  const GridPanel = () => (
    <div className="h-96">
      <SmartGrid
        columns={gridColumns}
        data={gridData}
        paginationMode="pagination"
        gridTitle="Sample Data"
        searchPlaceholder="Search..."
      />
    </div>
  );

  // Stats Component
  const StatsPanel = () => (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,234</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">567</div>
          <p className="text-xs text-muted-foreground">+15.3% from last hour</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$12,345</div>
          <p className="text-xs text-muted-foreground">+8.2% from last week</p>
        </CardContent>
      </Card>
    </div>
  );

  const initialPanels: PanelConfig[] = [
    {
      id: 'stats',
      title: 'Dashboard Stats',
      visible: true,
      collapsible: true,
      draggable: true,
      defaultCollapsed: false,
      content: <StatsPanel />,
      height: 'auto',
    },
    {
      id: 'chart',
      title: 'Analytics Chart',
      visible: true,
      collapsible: true,
      draggable: true,
      defaultCollapsed: false,
      content: <ChartPanel />,
      height: '300px',
    },
    {
      id: 'grid',
      title: 'Data Grid',
      visible: true,
      collapsible: true,
      draggable: true,
      defaultCollapsed: false,
      content: <GridPanel />,
      height: '400px',
    },
    {
      id: 'form',
      title: 'Contact Form',
      visible: true,
      collapsible: true,
      draggable: true,
      defaultCollapsed: true,
      content: <FormPanel />,
      height: 'auto',
    },
  ];

  const handlePanelReorder = (panels: PanelConfig[]) => {
    console.log('Panels reordered:', panels.map(p => p.title));
    toast({
      title: "Panels Reordered",
      description: "Panel order has been updated successfully."
    });
  };

  const handlePanelToggle = (panelId: string, visible: boolean) => {
    console.log(`Panel ${panelId} visibility changed to:`, visible);
    toast({
      title: visible ? "Panel Shown" : "Panel Hidden",
      description: `Panel has been ${visible ? 'shown' : 'hidden'}.`
    });
  };

  const handlePanelCollapse = (panelId: string, collapsed: boolean) => {
    console.log(`Panel ${panelId} collapsed state:`, collapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Flex Grid Layout Demo</h1>
          <p className="text-gray-600 mb-6">
            A dynamic, reusable layout component with configurable panels that support collapsing, 
            drag-and-drop reordering, visibility toggle, and hosting any component.
          </p>
          
          {/* Layout Direction Toggle */}
          <div className="flex items-center gap-4 mb-6">
            <Label>Layout Direction:</Label>
            <div className="flex gap-2">
              <Button
                variant={layoutDirection === 'column' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLayoutDirection('column')}
              >
                Column
              </Button>
              <Button
                variant={layoutDirection === 'row' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLayoutDirection('row')}
              >
                Row
              </Button>
            </div>
          </div>
        </div>

        {/* Flex Grid Layout */}
        <FlexGridLayout
          layoutDirection={layoutDirection}
          panels={initialPanels}
          onPanelReorder={handlePanelReorder}
          onPanelToggle={handlePanelToggle}
          onPanelCollapse={handlePanelCollapse}
          className="bg-white rounded-lg shadow-sm"
        />
      </div>
    </div>
  );
};

export default FlexGridDemo;
