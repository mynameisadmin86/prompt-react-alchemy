
import { useState } from 'react';
import { GridColumnConfig } from '@/types/smartgrid';
import { ExpandableCustomerContent } from '@/components/GridDemo/ExpandableCustomerContent';
import { ExpandableResourceContent } from '@/components/GridDemo/ExpandableResourceContent';

export function useGridColumns() {
  const [columns, setColumns] = useState<GridColumnConfig[]>([
    {
      key: 'id',
      label: 'Trip Plan No',
      type: 'Link',
      sortable: true,
      editable: false,
      mandatory: true,
      subRow: false,
      childRow: false
    },
    {
      key: 'status',
      label: 'Status',
      type: 'Badge',
      sortable: true,
      editable: false,
      subRow: false,
      childRow: false
    },
    {
      key: 'tripBillingStatus',
      label: 'Trip Billing Status',
      type: 'Badge',
      sortable: true,
      editable: false,
      subRow: false,
      childRow: false
    },
    {
      key: 'plannedStartEndDateTime',
      label: 'Planned Start and End Date Time',
      type: 'EditableText',
      sortable: true,
      editable: true,
      subRow: true,
      childRow: false
    },
    {
      key: 'actualStartEndDateTime',
      label: 'Actual Start and End Date Time',
      type: 'DateTimeRange',
      sortable: true,
      editable: false,
      subRow: true,
      childRow: false
    },
    {
      key: 'departurePoint',
      label: 'Departure Point',
      type: 'TextWithTooltip',
      sortable: true,
      editable: false,
      infoTextField: 'departurePointDetails',
      subRow: true,
      childRow: false
    },
    {
      key: 'arrivalPoint',
      label: 'Arrival Point',
      type: 'TextWithTooltip',
      sortable: true,
      editable: false,
      infoTextField: 'arrivalPointDetails',
      subRow: true,
      childRow: false
    },
    {
      key: 'customer',
      label: 'Customer',
      type: 'ExpandableCount',
      sortable: true,
      editable: false,
      renderExpandedContent: ExpandableCustomerContent,
      childRow: false
    },
    {
      key: 'resources',
      label: 'Resources',
      type: 'ExpandableCount',
      sortable: true,
      editable: false,
      renderExpandedContent: ExpandableResourceContent,
      childRow: false
    }
  ]);

  const handleSubRowToggle = (columnKey: string) => {
    setColumns(prevColumns => 
      prevColumns.map(col => 
        col.key === columnKey 
          ? { ...col, subRow: !col.subRow }
          : col
      )
    );
  };

  const handleChildRowToggle = (columnKey: string) => {
    setColumns(prevColumns => 
      prevColumns.map(col => 
        col.key === columnKey 
          ? { ...col, childRow: !col.childRow }
          : col
      )
    );
  };

  return {
    columns,
    setColumns,
    handleSubRowToggle,
    handleChildRowToggle
  };
}
