import { useIDEStore } from '@/stores/ideStore';

// Function to create a sample Work Order page in the IDE
export const createSampleWorkOrderPage = () => {
  const store = useIDEStore.getState();
  
  // Check if page already exists
  const existingPage = store.pages.find(p => p.route === '/ide-preview/work-order');
  if (existingPage) {
    return existingPage.id;
  }

  // Create the page
  const pageId = store.addPage({
    name: 'Work Order',
    route: '/ide-preview/work-order',
    components: [],
    pageStyle: { backgroundColor: 'hsl(var(--background))' },
  });

  // Add main row container
  store.addComponent(pageId, {
    type: 'Row',
    config: {},
    position: { x: 0, y: 0 },
    size: { width: '100%', height: 'auto' },
    parentId: null,
    style: { gap: '16px', padding: '16px', flex: '1' },
  });

  // Get the row ID
  let page = useIDEStore.getState().pages.find(p => p.id === pageId);
  const rowId = page?.components[0]?.id;

  // Add left card (form container)
  store.addComponent(pageId, {
    type: 'Card',
    config: { title: 'Work Order Details' },
    position: { x: 0, y: 0 },
    size: { width: '400px', height: 'auto' },
    parentId: rowId || null,
    style: {},
  });

  // Add right section (grid container)
  store.addComponent(pageId, {
    type: 'Section',
    config: { title: 'Work Items' },
    position: { x: 0, y: 0 },
    size: { width: 'auto', height: 'auto' },
    parentId: rowId || null,
    style: { flex: '1' },
  });

  // Get card and section IDs
  page = useIDEStore.getState().pages.find(p => p.id === pageId);
  const cardId = page?.components.find(c => c.type === 'Card')?.id;
  const sectionId = page?.components.find(c => c.type === 'Section')?.id;

  // Add DynamicPanel to card
  store.addComponent(pageId, {
    type: 'DynamicPanel',
    config: {
      panelConfig: {
        sections: [
          {
            id: 'basic',
            title: 'Basic Information',
            fields: [
              { id: 'workOrderId', label: 'Work Order ID', fieldType: 'text', value: 'WO-2024-001', disabled: true, colSpan: 2 },
              { id: 'customer', label: 'Customer', fieldType: 'text', value: '', placeholder: 'Select customer' },
              { id: 'priority', label: 'Priority', fieldType: 'select', value: 'medium', options: [
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'critical', label: 'Critical' },
              ]},
              { id: 'assignedTo', label: 'Assigned To', fieldType: 'text', value: '', placeholder: 'Select assignee' },
              { id: 'dueDate', label: 'Due Date', fieldType: 'date', value: '' },
              { id: 'description', label: 'Description', fieldType: 'textarea', value: '', placeholder: 'Enter description...', colSpan: 2 },
            ],
          },
          {
            id: 'location',
            title: 'Location',
            fields: [
              { id: 'site', label: 'Site', fieldType: 'text', value: '', placeholder: 'Select site' },
              { id: 'building', label: 'Building', fieldType: 'text', value: '' },
              { id: 'floor', label: 'Floor', fieldType: 'text', value: '' },
              { id: 'room', label: 'Room', fieldType: 'text', value: '' },
            ],
          },
        ],
      },
      mode: 'edit',
    },
    position: { x: 0, y: 0 },
    size: { width: '100%', height: 'auto' },
    parentId: cardId || null,
  });

  // Add SmartGridPlus to section
  store.addComponent(pageId, {
    type: 'SmartGridPlus',
    config: {
      columns: [
        { id: 'itemId', header: 'Item ID', accessor: 'itemId', width: 120, editable: false },
        { id: 'description', header: 'Description', accessor: 'description', width: 200, editable: true },
        { id: 'quantity', header: 'Qty', accessor: 'quantity', width: 80, editable: true, type: 'number' },
        { id: 'unit', header: 'Unit', accessor: 'unit', width: 80, editable: true },
        { id: 'status', header: 'Status', accessor: 'status', width: 120, editable: true, type: 'select', selectOptions: [
          { value: 'pending', label: 'Pending' },
          { value: 'in_progress', label: 'In Progress' },
          { value: 'completed', label: 'Completed' },
        ]},
        { id: 'notes', header: 'Notes', accessor: 'notes', width: 200, editable: true },
      ],
      data: [
        { itemId: 'WI-001', description: 'Replace HVAC filter', quantity: 2, unit: 'EA', status: 'pending', notes: '' },
        { itemId: 'WI-002', description: 'Inspect electrical panel', quantity: 1, unit: 'EA', status: 'in_progress', notes: 'Scheduled for Monday' },
        { itemId: 'WI-003', description: 'Repair door hinge', quantity: 3, unit: 'EA', status: 'completed', notes: 'Completed on site' },
      ],
      showCheckboxes: true,
      inlineRowAddition: true,
      inlineRowEditing: true,
    },
    position: { x: 0, y: 0 },
    size: { width: '100%', height: '400px' },
    parentId: sectionId || null,
  });

  // Add footer
  store.addComponent(pageId, {
    type: 'Footer',
    config: {
      leftButtons: [
        { label: 'Print', iconName: 'Printer', variant: 'ghost' },
        { label: 'Export', iconName: 'FileDown', variant: 'ghost' },
      ],
      rightButtons: [
        { label: 'Cancel', variant: 'outline' },
        { label: 'Save Draft', variant: 'outline' },
        { label: 'Submit Work Order', variant: 'default', className: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
      ],
    },
    position: { x: 0, y: 0 },
    size: { width: '100%', height: 'auto' },
    parentId: null,
    style: { padding: '16px' },
  });

  return pageId;
};
