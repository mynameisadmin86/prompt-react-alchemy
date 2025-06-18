
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, MoreHorizontal } from 'lucide-react';

export function GridFooter() {
  return (
    <div className="flex items-center justify-between p-4 border-t bg-gray-50/50">
      <div className="flex items-center space-x-3">
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 px-3 text-gray-700 border-gray-300 hover:bg-gray-100"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 px-3 text-gray-700 border-gray-300 hover:bg-gray-100"
        >
          <MoreHorizontal className="h-4 w-4 mr-2" />
          More
        </Button>
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        className="h-8 px-4 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
      >
        Cancel
      </Button>
    </div>
  );
}
