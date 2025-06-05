
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Grid, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <Grid className="h-16 w-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            SmartGrid Component
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A powerful, extensible data grid with advanced features like inline editing, 
            sorting, filtering, nested rows, and plugin architecture.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/grid-demo">
            <Button size="lg" className="w-full sm:w-auto">
              View Grid Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              Advanced Editing
            </h3>
            <p className="text-gray-600 text-sm">
              Inline editing with validation, bulk updates via CSV upload, and real-time data synchronization.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              Plugin Architecture
            </h3>
            <p className="text-gray-600 text-sm">
              Extensible design allowing custom toolbar buttons, row actions, and footer components.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              Rich Features
            </h3>
            <p className="text-gray-600 text-sm">
              Nested rows, multiple export formats, preference persistence, and responsive design.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
