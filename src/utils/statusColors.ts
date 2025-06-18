
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    // Status column colors
    'Released': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Under Execution': 'bg-purple-100 text-purple-800 border-purple-300',
    'Initiated': 'bg-blue-100 text-blue-800 border-blue-300',
    'Cancelled': 'bg-red-100 text-red-800 border-red-300',
    'Deleted': 'bg-red-100 text-red-800 border-red-300',
    'Confirmed': 'bg-green-100 text-green-800 border-green-300',
    
    // Trip Billing Status colors
    'Draft Bill Raised': 'bg-orange-100 text-orange-800 border-orange-300',
    'Not Eligible': 'bg-red-100 text-red-800 border-red-300',
    'Revenue Leakage': 'bg-red-100 text-red-800 border-red-300',
    'Invoice Created': 'bg-blue-100 text-blue-800 border-blue-300',
    'Invoice Approved': 'bg-green-100 text-green-800 border-green-300'
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
};
