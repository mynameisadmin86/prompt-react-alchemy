import React from 'react';
import { SmartGridWithGrouping } from '@/components/SmartGrid';
import { GridColumnConfig } from '@/types/smartgrid';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Sample data for the grouping demo
const sampleData = [
  {
    id: 1,
    name: 'John Doe',
    project: 'Alpha Project',
    department: 'Engineering',
    status: 'Active',
    role: 'Senior Developer',
    salary: 120000,
    startDate: '2022-01-15',
    location: 'New York'
  },
  {
    id: 2,
    name: 'Jane Smith',
    project: 'Beta Project',
    department: 'Engineering',
    status: 'Active',
    role: 'Tech Lead',
    salary: 140000,
    startDate: '2021-06-10',
    location: 'San Francisco'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    project: 'Alpha Project',
    department: 'Marketing',
    status: 'On Leave',
    role: 'Marketing Manager',
    salary: 90000,
    startDate: '2023-03-20',
    location: 'Chicago'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    project: 'Gamma Project',
    department: 'Engineering',
    status: 'Active',
    role: 'Frontend Developer',
    salary: 100000,
    startDate: '2022-09-05',
    location: 'Austin'
  },
  {
    id: 5,
    name: 'David Brown',
    project: 'Beta Project',
    department: 'Sales',
    status: 'Active',
    role: 'Sales Director',
    salary: 110000,
    startDate: '2020-11-30',
    location: 'New York'
  },
  {
    id: 6,
    name: 'Lisa Davis',
    project: 'Alpha Project',
    department: 'HR',
    status: 'Active',
    role: 'HR Manager',
    salary: 85000,
    startDate: '2021-02-14',
    location: 'Remote'
  },
  {
    id: 7,
    name: 'Tom Anderson',
    project: 'Gamma Project',
    department: 'Engineering',
    status: 'Inactive',
    role: 'DevOps Engineer',
    salary: 115000,
    startDate: '2022-07-01',
    location: 'Seattle'
  },
  {
    id: 8,
    name: 'Emma Thompson',
    project: 'Beta Project',
    department: 'Marketing',
    status: 'Active',
    role: 'Content Writer',
    salary: 65000,
    startDate: '2023-01-10',
    location: 'Boston'
  }
];

// Column configuration
const columns: GridColumnConfig[] = [
  {
    key: 'name',
    label: 'Employee Name',
    type: 'Text',
    sortable: true,
    filterable: true,
    width: 150
  },
  {
    key: 'project',
    label: 'Project',
    type: 'Badge',
    sortable: true,
    filterable: true,
    statusMap: {
      'Alpha Project': 'bg-blue-100 text-blue-800',
      'Beta Project': 'bg-green-100 text-green-800',
      'Gamma Project': 'bg-purple-100 text-purple-800'
    },
    width: 120
  },
  {
    key: 'department',
    label: 'Department',
    type: 'Text',
    sortable: true,
    filterable: true,
    width: 120
  },
  {
    key: 'status',
    label: 'Status',
    type: 'Badge',
    sortable: true,
    filterable: true,
    statusMap: {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-red-100 text-red-800',
      'On Leave': 'bg-yellow-100 text-yellow-800'
    },
    width: 100
  },
  {
    key: 'role',
    label: 'Role',
    type: 'Text',
    sortable: true,
    filterable: true,
    width: 150
  },
  {
    key: 'salary',
    label: 'Salary',
    type: 'Text',
    sortable: true,
    filterable: true,
    width: 100
  },
  {
    key: 'location',
    label: 'Location',
    type: 'Text',
    sortable: true,
    filterable: true,
    width: 120
  }
];

// Custom group by fields
const groupByFields = [
  { value: 'project', label: 'Project' },
  { value: 'department', label: 'Department' },
  { value: 'status', label: 'Status' },
  { value: 'location', label: 'Location' }
];

export default function SmartGridGroupingDemo() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          SmartGrid with Grouping Demo
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Experience the power of SmartGridWithGrouping - all the features of SmartGrid 
          enhanced with flexible row grouping capabilities. Group by any field, expand/collapse 
          groups, and maintain all existing functionality like filtering, sorting, and editing.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Main Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Employee Management with Grouping
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SmartGridWithGrouping
              data={sampleData}
              columns={columns}
              groupByFields={groupByFields}
              grouping={{
                enableGrouping: true,
                defaultGroupByField: 'project',
                userCanChangeGroupBy: true,
                groupToggleEnabled: true,
                preserveExpandedStateOnUpdate: true,
                groupRowStyle: {
                  backgroundColor: '#f9fafb',
                  fontWeight: 'semibold',
                  fontSize: 'sm',
                  padding: 'px-3 py-2'
                }
              }}
              gridTitle="Employee Data"
              recordCount={sampleData.length}
              editableColumns={['name', 'role', 'salary']}
              onInlineEdit={(rowIndex, updatedRow) => {
                console.log('Inline edit:', { rowIndex, updatedRow });
              }}
              configurableButtons={[
                {
                  label: 'Export CSV',
                  tooltipTitle: 'Export data to CSV file',
                  showDropdown: false,
                  dropdownItems: []
                },
                {
                  label: 'Reset View',
                  tooltipTitle: 'Reset all preferences to default',
                  showDropdown: false,
                  dropdownItems: []
                }
              ]}
            />
          </CardContent>
        </Card>

        {/* Features Demo */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Group by any field with dropdown selector
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Expand/collapse groups with visual indicators
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Preserve group state during updates
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Compatible with all SmartGrid features
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Customizable group header styling
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Auto-detection of groupable fields
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preserved Functionality</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Inline row editing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Column filtering and sorting
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Column visibility management
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Pagination and lazy loading
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Data export functionality
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Theme and styling system
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Usage Example */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usage Example</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<SmartGridWithGrouping
  data={employeeData}
  columns={columns}
  groupByFields={[
    { value: 'project', label: 'Project' },
    { value: 'department', label: 'Department' }
  ]}
  grouping={{
    enableGrouping: true,
    defaultGroupByField: 'project',
    userCanChangeGroupBy: true,
    groupToggleEnabled: true,
    preserveExpandedStateOnUpdate: true
  }}
  // All regular SmartGrid props work normally
  editableColumns={['name', 'role']}
  onInlineEdit={handleEdit}
  configurableButtons={buttons}
/>`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}