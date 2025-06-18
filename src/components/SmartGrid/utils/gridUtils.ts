
import { GridColumnConfig, SortConfig, FilterConfig, GridPlugin } from '@/types/smartgrid';

export const calculateColumnWidths = (
  visibleColumns: GridColumnConfig[],
  showCheckboxes: boolean,
  plugins: GridPlugin[],
  preferences: any,
  columnWidths: Record<string, number>
) => {
  const containerWidth = window.innerWidth - 64;
  const checkboxWidth = showCheckboxes ? 50 : 0;
  const actionsWidth = plugins.some(plugin => plugin.rowActions) ? 100 : 0;
  const availableWidth = containerWidth - checkboxWidth - actionsWidth;
  
  const totalColumns = visibleColumns.length;
  let remainingWidth = availableWidth;
  const calculatedWidths: Record<string, number> = {};
  
  visibleColumns.forEach(col => {
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
    
    const customWidth = columnWidths[col.key];
    const preferredWidth = preferences.columnWidths[col.key];
    calculatedWidths[col.key] = customWidth || (preferredWidth ? Math.max(minWidth, preferredWidth) : minWidth);
    remainingWidth -= calculatedWidths[col.key];
  });
  
  if (remainingWidth > 0) {
    const totalCurrentWidth = Object.values(calculatedWidths).reduce((sum, width) => sum + width, 0);
    visibleColumns.forEach(col => {
      const proportion = calculatedWidths[col.key] / totalCurrentWidth;
      calculatedWidths[col.key] += remainingWidth * proportion;
    });
  }
  
  return calculatedWidths;
};

export const processGridData = (
  gridData: any[],
  globalFilter: string,
  filters: FilterConfig[],
  sort: SortConfig | undefined,
  columns: GridColumnConfig[],
  onDataFetch?: any
) => {
  if (onDataFetch) {
    return gridData;
  }

  let result = [...gridData];

  if (globalFilter) {
    result = result.filter(row =>
      columns.some(col => {
        let value = row[col.key];
        
        if (value && typeof value === 'object' && 'value' in value) {
          value = value.value;
        }
        
        return String(value || '').toLowerCase().includes(globalFilter.toLowerCase());
      })
    );
  }

  if (filters.length > 0) {
    result = result.filter(row => {
      return filters.every(filter => {
        let value = row[filter.column];
        
        if (value && typeof value === 'object' && 'value' in value) {
          value = value.value;
        }
        
        const filterValue = filter.value;
        const operator = filter.operator || 'contains';

        if (value == null) return false;

        const stringValue = String(value).toLowerCase();
        const stringFilter = String(filterValue).toLowerCase();

        switch (operator) {
          case 'equals':
            return stringValue === stringFilter;
          case 'contains':
            return stringValue.includes(stringFilter);
          case 'startsWith':
            return stringValue.startsWith(stringFilter);
          case 'endsWith':
            return stringValue.endsWith(stringFilter);
          case 'gt':
            return Number(value) > Number(filterValue);
          case 'lt':
            return Number(value) < Number(filterValue);
          case 'gte':
            return Number(value) >= Number(filterValue);
          case 'lte':
            return Number(value) <= Number(filterValue);
          default:
            return true;
        }
      });
    });
  }

  if (sort) {
    result.sort((a, b) => {
      let aValue = a[sort.column];
      let bValue = b[sort.column];
      
      if (aValue && typeof aValue === 'object' && 'value' in aValue) {
        aValue = aValue.value;
      }
      if (bValue && typeof bValue === 'object' && 'value' in bValue) {
        bValue = bValue.value;
      }
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }

  return result;
};
