
import { GridColumnConfig, GridPreferences, GridPlugin } from '@/types/smartgrid';

export function calculateColumnWidths(
  visibleColumns: GridColumnConfig[],
  showCheckboxes: boolean,
  plugins: GridPlugin[],
  preferences: GridPreferences,
  columnWidths: Record<string, number>
) {
  const containerWidth = window.innerWidth - 64; // Account for padding
  const checkboxWidth = showCheckboxes ? 50 : 0;
  const actionsWidth = plugins.some(plugin => plugin.rowActions) ? 100 : 0;
  const availableWidth = containerWidth - checkboxWidth - actionsWidth;
  
  const calculatedWidths: Record<string, number> = {};
  let totalConfiguredWidth = 0;
  let columnsWithoutWidth = 0;
  
  // First pass: use configured widths where available
  visibleColumns.forEach(col => {
    const customWidth = columnWidths[col.key];
    const preferredWidth = preferences.columnWidths[col.key];
    const configuredWidth = col.width;
    
    if (customWidth) {
      calculatedWidths[col.key] = customWidth;
      totalConfiguredWidth += customWidth;
    } else if (preferredWidth) {
      calculatedWidths[col.key] = preferredWidth;
      totalConfiguredWidth += preferredWidth;
    } else if (configuredWidth) {
      calculatedWidths[col.key] = configuredWidth;
      totalConfiguredWidth += configuredWidth;
    } else {
      columnsWithoutWidth++;
    }
  });
  
  // Second pass: calculate widths for columns without configured width
  const remainingWidth = Math.max(0, availableWidth - totalConfiguredWidth);
  const defaultWidthPerColumn = columnsWithoutWidth > 0 ? Math.max(120, remainingWidth / columnsWithoutWidth) : 120;
  
  visibleColumns.forEach(col => {
    if (!calculatedWidths[col.key]) {
      let minWidth = 120;
      
      switch (col.type) {
        case 'Badge':
          minWidth = 100;
          break;
        case 'Date':
          minWidth = 140;
          break;
        case 'DateTimeRange':
          minWidth = 200;
          break;
        case 'Link':
          minWidth = 150;
          break;
        case 'ExpandableCount':
          minWidth = 90;
          break;
        case 'Text':
        case 'EditableText':
        default:
          minWidth = 120;
          break;
      }
      
      calculatedWidths[col.key] = Math.max(minWidth, defaultWidthPerColumn);
    }
  });
  
  return calculatedWidths;
}
