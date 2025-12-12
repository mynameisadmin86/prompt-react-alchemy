import React, { useState } from 'react';
import { SmartGridWithGrouping } from '@/components/SmartGrid/SmartGridWithGrouping';
import { GridColumnConfig } from '@/types/smartgrid';
import { toast } from '@/hooks/use-toast';

const initialData = [
  { id: 1, name: 'John Smith', department: 'Engineering', status: { value: 'Active', variant: 'success' }, salary: 85000, startDate: '2023-01-15', role: 'Developer' },
  { id: 2, name: 'Sarah Johnson', department: 'Engineering', status: { value: 'Active', variant: 'success' }, salary: 92000, startDate: '2022-06-20', role: 'Senior Developer' },
  { id: 3, name: 'Mike Brown', department: 'Marketing', status: { value: 'On Leave', variant: 'warning' }, salary: 68000, startDate: '2023-03-10', role: 'Marketing Manager' },
  { id: 4, name: 'Emily Davis', department: 'HR', status: { value: 'Active', variant: 'success' }, salary: 55000, startDate: '2021-11-05', role: 'HR Specialist' },
  { id: 5, name: 'Chris Wilson', department: 'Engineering', status: { value: 'Inactive', variant: 'destructive' }, salary: 78000, startDate: '2020-08-12', role: 'QA Engineer' },
  { id: 6, name: 'Lisa Anderson', department: 'Marketing', status: { value: 'Active', variant: 'success' }, salary: 72000, startDate: '2022-02-28', role: 'Content Writer' },
  { id: 7, name: 'David Martinez', department: 'Finance', status: { value: 'Active', variant: 'success' }, salary: 95000, startDate: '2019-04-17', role: 'Financial Analyst' },
  { id: 8, name: 'Amanda Taylor', department: 'HR', status: { value: 'Active', variant: 'success' }, salary: 62000, startDate: '2023-07-01', role: 'Recruiter' },
  { id: 9, name: 'James Thomas', department: 'Finance', status: { value: 'On Leave', variant: 'warning' }, salary: 88000, startDate: '2021-09-22', role: 'Accountant' },
  { id: 10, name: 'Jennifer White', department: 'Engineering', status: { value: 'Active', variant: 'success' }, salary: 105000, startDate: '2018-12-03', role: 'Tech Lead' },
];

const columns: GridColumnConfig[] = [
  { key: 'id', label: 'ID', type: 'Integer', sortable: true, editable: false },
  { key: 'name', label: 'Employee Name', type: 'EditableText', sortable: true, filterable: true, editable: true },
  { key: 'department', label: 'Department', type: 'Select', sortable: true, filterable: true, editable: true, options: ['Engineering', 'Marketing', 'HR', 'Finance'] },
  { key: 'role', label: 'Role', type: 'EditableText', sortable: true, filterable: true, editable: true },
  { key: 'status', label: 'Status', type: 'Badge', sortable: true, filterable: true, editable: true, options: ['Active', 'Inactive', 'On Leave'] },
  { key: 'salary', label: 'Salary', type: 'Integer', sortable: true, filterable: true, editable: true },
  { key: 'startDate', label: 'Start Date', type: 'Date', sortable: true, filterable: true, editable: true },
];

export default function SmartGridWithGroupingEditableDemo() {
  const [data, setData] = useState(initialData);
  const [groupByField, setGroupByField] = useState<string | null>('department');

  const handleInlineEdit = (rowIndex: number, updatedRow: any) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[rowIndex] = updatedRow;
      return newData;
    });

    toast({
      title: 'Row Updated',
      description: `Row ${rowIndex + 1} has been updated`,
    });
  };

  const handleGroupByChange = (field: string | null) => {
    setGroupByField(field);
    toast({
      title: 'Grouping Changed',
      description: field ? `Grouped by: ${field}` : 'Grouping removed',
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">SmartGrid with Grouping - Editable Demo</h1>
        <p className="text-muted-foreground mt-1">
          Demonstrates grouping functionality with editable columns. Double-click cells to edit.
        </p>
      </div>

      <SmartGridWithGrouping
        gridTitle="Employee Directory"
        columns={columns}
        data={data}
        groupByField={groupByField}
        onGroupByChange={handleGroupByChange}
        groupableColumns={['department', 'status', 'role']}
        showGroupingDropdown={true}
        editableColumns={true}
        onInlineEdit={handleInlineEdit}
        customPageSize={10}
      />
    </div>
  );
}
