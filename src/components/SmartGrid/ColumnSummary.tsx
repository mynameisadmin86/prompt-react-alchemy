
import React from 'react';
import { Column, GridPreferences } from '@/types/smartgrid';

interface ColumnSummaryProps<T> {
  orderedColumns: Column<T>[];
  mainRowColumns: Column<T>[];
  subRowColumns: Column<T>[];
  preferences: GridPreferences;
  hasSubRowSupport: boolean;
}

export function ColumnSummary<T>({
  orderedColumns,
  mainRowColumns,
  subRowColumns,
  preferences,
  hasSubRowSupport
}: ColumnSummaryProps<T>) {
  return (
    <div className="pt-3 border-t text-sm text-gray-600">
      <div className="flex justify-between">
        <span>Total visible columns:</span>
        <span className="font-medium">{orderedColumns.length - preferences.hiddenColumns.length}</span>
      </div>
      {hasSubRowSupport && (
        <>
          <div className="flex justify-between">
            <span>Main row columns:</span>
            <span className="font-medium">{mainRowColumns.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Sub-row columns:</span>
            <span className="font-medium">{subRowColumns.length}</span>
          </div>
        </>
      )}
    </div>
  );
}
