
import React from 'react';
import { User } from 'lucide-react';
import { SampleData } from '@/types/gridDemo';

interface ExpandableCustomerContentProps {
  row: SampleData;
}

export function ExpandableCustomerContent({ row }: ExpandableCustomerContentProps) {
  // Add defensive checks to prevent crashes
  if (!row) {
    return (
      <div className="text-center text-gray-500 py-4">
        No data available
      </div>
    );
  }

  const customerDetails = row.customerDetails || [];

  if (customerDetails.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No customer details available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
        <User className="h-4 w-4" />
        Customer Details
      </div>
      {customerDetails.map((customer, index) => (
        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{customer.name}</div>
            <div className="text-sm text-gray-500">{customer.id}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
