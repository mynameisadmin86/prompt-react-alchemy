
import React from 'react';
import { SmartGrid } from '@/components/SmartGrid';
import { downloadJsonPlugin } from '@/plugins/downloadJsonPlugin';
import { GridColumnConfig } from '@/types/smartgrid';

// Sample data for the grid
const sampleData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    department: 'Engineering',
    salary: 75000,
    status: 'Active',
    joinDate: '2023-01-15',
    skills: ['React', 'TypeScript', 'Node.js'],
    projects: [
      { name: 'Project Alpha', role: 'Lead Developer', status: 'In Progress' },
      { name: 'Project Beta', role: 'Contributor', status: 'Completed' }
    ]
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 28,
    department: 'Design',
    salary: 65000,
    status: 'Active',
    joinDate: '2023-03-20',
    skills: ['Figma', 'Photoshop', 'UI/UX'],
    projects: [
      { name: 'Design System', role: 'Lead Designer', status: 'In Progress' }
    ]
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    age: 35,
    department: 'Engineering',
    salary: 85000,
    status: 'Inactive',
    joinDate: '2022-08-10',
    skills: ['Python', 'Django', 'PostgreSQL'],
    projects: [
      { name: 'API Redesign', role: 'Backend Lead', status: 'Completed' },
      { name: 'Database Migration', role: 'DBA', status: 'Completed' }
    ]
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    age: 32,
    department: 'Marketing',
    salary: 60000,
    status: 'Active',
    joinDate: '2023-06-05',
    skills: ['Content Marketing', 'SEO', 'Analytics'],
    projects: [
      { name: 'Brand Campaign', role: 'Marketing Manager', status: 'In Progress' }
    ]
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    age: 29,
    department: 'Sales',
    salary: 55000,
    status: 'Active',
    joinDate: '2023-02-14',
    skills: ['CRM', 'Negotiation', 'Lead Generation'],
    projects: [
      { name: 'Q4 Sales Drive', role: 'Sales Rep', status: 'In Progress' }
    ]
  }
];

// Column configuration
const columns: GridColumnConfig[] = [
  {
    key: 'id',
    label: 'ID',
    editable: false,
    mandatory: true,
    sortable: true,
    filterable: true,
    hidden: false,
    order: 0,
    type: 'number'
  },
  {
    key: 'name',
    label: 'Full Name',
    editable: true,
    mandatory: true,
    sortable: true,
    filterable: true,
    hidden: false,
    order: 1,
    type: 'text'
  },
  {
    key: 'email',
    label: 'Email Address',
    editable: true,
    mandatory: true,
    sortable: true,
    filterable: true,
    hidden: false,
    order: 2,
    type: 'text'
  },
  {
    key: 'age',
    label: 'Age',
    editable: true,
    mandatory: false,
    sortable: true,
    filterable: true,
    hidden: false,
    order: 3,
    type: 'number'
  },
  {
    key: 'department',
    label: 'Department',
    editable: true,
    mandatory: false,
    sortable: true,
    filterable: true,
    hidden: false,
    order: 4,
    type: 'select',
    options: ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance']
  },
  {
    key: 'salary',
    label: 'Salary',
    editable: true,
    mandatory: false,
    sortable: true,
    filterable: true,
    hidden: false,
    order: 5,
    type: 'number'
  },
  {
    key: 'status',
    label: 'Status',
    editable: true,
    mandatory: false,
    sortable: true,
    filterable: true,
    hidden: false,
    order: 6,
    type: 'select',
    options: ['Active', 'Inactive', 'On Leave']
  },
  {
    key: 'joinDate',
    label: 'Join Date',
    editable: true,
    mandatory: false,
    sortable: true,
    filterable: true,
    hidden: false,
    order: 7,
    type: 'date'
  }
];

const GridDemo = () => {
  // Handler for inline editing
  const handleInlineEdit = (rowIndex: number, updatedRow: any) => {
    console.log('Row edited:', { rowIndex, updatedRow });
  };

  // Handler for bulk updates
  const handleBulkUpdate = async (rows: any[]) => {
    console.log('Bulk update:', rows);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Bulk update completed');
        resolve(rows);
      }, 1000);
    });
  };

  // Handler for preference saving
  const handlePreferenceSave = async (preferences: any) => {
    console.log('Preferences saved:', preferences);
    // Simulate API call to save preferences
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Preferences saved to server');
        resolve(preferences);
      }, 500);
    });
  };

  // Nested row renderer for expandable rows
  const nestedRowRenderer = (row: any) => (
    <div className="bg-gray-50 p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {row.skills?.map((skill: string, index: number) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Projects</h4>
          <div className="space-y-2">
            {row.projects?.map((project: any, index: number) => (
              <div key={index} className="bg-white p-2 rounded border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{project.name}</p>
                    <p className="text-xs text-gray-600">{project.role}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      project.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SmartGrid Demo
          </h1>
          <p className="text-gray-600">
            A comprehensive data grid with editing, sorting, filtering, and plugin support.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <SmartGrid
              columns={columns}
              data={sampleData}
              editableColumns={true}
              mandatoryColumns={['id', 'name', 'email']}
              onInlineEdit={handleInlineEdit}
              onBulkUpdate={handleBulkUpdate}
              onPreferenceSave={handlePreferenceSave}
              paginationMode="pagination"
              nestedRowRenderer={nestedRowRenderer}
              plugins={[downloadJsonPlugin]}
            />
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Features Demonstrated</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Inline Editing</h3>
              <p className="text-sm text-blue-700">
                Click on any editable cell to modify data inline
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">Sorting & Filtering</h3>
              <p className="text-sm text-green-700">
                Click column headers to sort, use search to filter
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-900 mb-2">Expandable Rows</h3>
              <p className="text-sm text-purple-700">
                Click the arrow in the first column to expand rows
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2">Plugin Architecture</h3>
              <p className="text-sm text-yellow-700">
                Download JSON plugin adds custom functionality
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-medium text-red-900 mb-2">Bulk Operations</h3>
              <p className="text-sm text-red-700">
                Upload CSV files for bulk data updates
              </p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-medium text-indigo-900 mb-2">Export Options</h3>
              <p className="text-sm text-indigo-700">
                Export data to CSV, Excel, or JSON formats
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridDemo;
