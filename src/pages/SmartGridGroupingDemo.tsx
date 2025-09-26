import React, { useState } from 'react';
import { SmartGridWithGrouping } from '@/components/SmartGrid';

// Sample data with different categories
const sampleData = [
  {
    id: '1',
    name: 'Project Alpha',
    project: 'Web Development',
    department: 'Engineering',
    status: { value: 'active', label: 'Active' },
    priority: 'High',
    assignee: 'John Doe',
    startDate: '2024-01-15',
    budget: 50000
  },
  {
    id: '2',
    name: 'Project Beta',
    project: 'Mobile App',
    department: 'Engineering',
    status: { value: 'planning', label: 'Planning' },
    priority: 'Medium',
    assignee: 'Jane Smith',
    startDate: '2024-02-01',
    budget: 30000
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    project: 'Marketing',
    department: 'Marketing',
    status: { value: 'active', label: 'Active' },
    priority: 'High',
    assignee: 'Bob Johnson',
    startDate: '2024-01-20',
    budget: 25000
  },
  {
    id: '4',
    name: 'Data Analysis',
    project: 'Analytics',
    department: 'Data Science',
    status: { value: 'completed', label: 'Completed' },
    priority: 'Low',
    assignee: 'Alice Brown',
    startDate: '2024-01-10',
    budget: 15000
  },
  {
    id: '5',
    name: 'UI Redesign',
    project: 'Web Development',
    department: 'Design',
    status: { value: 'active', label: 'Active' },
    priority: 'Medium',
    assignee: 'Charlie Wilson',
    startDate: '2024-01-25',
    budget: 35000
  },
  {
    id: '6',
    name: 'API Development',
    project: 'Web Development',
    department: 'Engineering',
    status: { value: 'planning', label: 'Planning' },
    priority: 'High',
    assignee: 'David Lee',
    startDate: '2024-02-10',
    budget: 40000
  },
  {
    id: '7',
    name: 'Content Strategy',
    project: 'Marketing',
    department: 'Marketing',
    status: { value: 'active', label: 'Active' },
    priority: 'Medium',
    assignee: 'Eva Garcia',
    startDate: '2024-01-30',
    budget: 20000
  },
  {
    id: '8',
    name: 'User Research',
    project: 'Research',
    department: 'Design',
    status: { value: 'completed', label: 'Completed' },
    priority: 'Low',
    assignee: 'Frank Miller',
    startDate: '2024-01-05',
    budget: 12000
  }
];

const columns = [
  {
    key: 'name',
    label: 'Project Name',
    type: 'Text' as const,
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    key: 'project',
    label: 'Project Type',
    type: 'Badge' as const,
    sortable: true,
    filterable: true,
    width: 150,
    statusMap: {
      'Web Development': 'bg-blue-100 text-blue-800',
      'Mobile App': 'bg-green-100 text-green-800',
      'Marketing': 'bg-purple-100 text-purple-800',
      'Analytics': 'bg-yellow-100 text-yellow-800',
      'Research': 'bg-gray-100 text-gray-800'
    }
  },
  {
    key: 'department',
    label: 'Department',
    type: 'Text' as const,
    sortable: true,
    filterable: true,
    width: 130
  },
  {
    key: 'status',
    label: 'Status',
    type: 'Badge' as const,
    sortable: true,
    filterable: true,
    width: 120,
    statusMap: {
      'active': 'bg-green-100 text-green-800',
      'planning': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-blue-100 text-blue-800'
    }
  },
  {
    key: 'priority',
    label: 'Priority',
    type: 'Badge' as const,
    sortable: true,
    filterable: true,
    width: 100,
    statusMap: {
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-gray-100 text-gray-800'
    }
  },
  {
    key: 'assignee',
    label: 'Assignee',
    type: 'Text' as const,
    sortable: true,
    filterable: true,
    width: 150
  },
  {
    key: 'startDate',
    label: 'Start Date',
    type: 'Date' as const,
    sortable: true,
    filterable: true,
    width: 120
  },
  {
    key: 'budget',
    label: 'Budget ($)',
    type: 'Text' as const,
    sortable: true,
    filterable: true,
    width: 120
  }
];

export default function SmartGridGroupingDemo() {
  const [groupByField, setGroupByField] = useState<string | null>('department');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const handleRowSelection = (selectedRowIndices: Set<number>) => {
    console.log('Selected rows changed:', selectedRowIndices);
    setSelectedRows(selectedRowIndices);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">SmartGrid with Grouping Demo</h1>
        <p className="text-muted-foreground">
          This demo shows the SmartGrid component enhanced with grouping functionality. 
          You can group rows by selecting a column from the dropdown. Click on group headers to expand/collapse groups.
        </p>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Project Management Dashboard</h2>
        
        <SmartGridWithGrouping
          data={sampleData}
          columns={columns}
          groupByField={groupByField}
          onGroupByChange={setGroupByField}
          showGroupingDropdown={true}
          groupableColumns={['department', 'project', 'status', 'priority']}
          gridTitle="Projects"
          recordCount={sampleData.length}
          editableColumns={true}
          paginationMode="pagination"
          selectedRows={selectedRows}
          onSelectionChange={handleRowSelection}
          rowClassName={(row: any, index: number) => 
            selectedRows.has(index) ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
          }
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Features Demonstrated:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li>Group rows by any selectable column (Department, Project Type, Status, Priority)</li>
          <li>Expand/collapse groups by clicking on group headers</li>
          <li>Visual indicators show group status (▶ collapsed, ▼ expanded)</li>
          <li>Group headers display count of items in each group</li>
          <li>All existing SmartGrid features remain intact (sorting, filtering, editing)</li>
          <li>Automatic detection of groupable columns (excludes EditableText and SubRow types)</li>
          <li>Custom styling for group headers with hover effects</li>
        </ul>
      </div>
    </div>
  );
}