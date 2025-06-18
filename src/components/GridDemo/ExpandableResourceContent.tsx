
import React from 'react';
import { Train, UserCheck, Container } from 'lucide-react';
import { SampleData } from '@/types/gridDemo';

interface ExpandableResourceContentProps {
  row: SampleData;
}

export function ExpandableResourceContent({ row }: ExpandableResourceContentProps) {
  // Add defensive checks to prevent crashes
  if (!row) {
    return (
      <div className="text-center text-gray-500 py-4">
        No data available
      </div>
    );
  }

  const resourceDetails = row.resourceDetails || [];

  if (resourceDetails.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No resource details available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
        <Container className="h-4 w-4" />
        Resource Details
      </div>
      {resourceDetails.map((resource, index) => (
        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            {resource.type === 'train' && <Train className="h-4 w-4 text-green-600" />}
            {resource.type === 'agent' && <UserCheck className="h-4 w-4 text-green-600" />}
            {resource.type === 'container' && <Container className="h-4 w-4 text-green-600" />}
          </div>
          <div>
            <div className="font-medium text-gray-900">{resource.name}</div>
            <div className="text-sm text-gray-500">{resource.id}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
