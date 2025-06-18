
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
  
  const totalColumns = visibleColumns.length;
  let remainingWidth = availableWidth;
  const calculatedWidths: Record<string, number> = {};
  
  // First pass: assign minimum widths based on content type with extra space for headers
  visibleColumns.forEach(col => {
    let minWidth = 120; // Increased minimum width for header content
    
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
    
    // Use stored preference, custom width, or calculated minimum
    const customWidth = columnWidths[col.key];
    const preferredWidth = preferences.columnWidths[col.key];
    calculatedWidths[col.key] = customWidth || (preferredWidth ? Math.max(minWidth, preferredWidth) : minWidth);
    remainingWidth -= calculatedWidths[col.key];
  });
  
  // Second pass: distribute remaining width proportionally
  if (remainingWidth > 0) {
    const totalCurrentWidth = Object.values(calculatedWidths).reduce((sum, width) => sum + width, 0);
    visibleColumns.forEach(col => {
      const proportion = calculatedWidths[col.key] / totalCurrentWidth;
      calculatedWidths[col.key] += remainingWidth * proportion;
    });
  }
  
  return calculatedWidths;
}
