import React from 'react';
import { Grid, Search, Layout, LayoutGrid } from 'lucide-react';

interface ComponentCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  features: string[];
}

const ComponentCard: React.FC<ComponentCardProps> = ({ title, description, href, icon, features }) => {
  return (
    <a href={href} className="block rounded-lg border border-gray-200 bg-white shadow-md hover:bg-gray-50 transition-colors duration-200">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="mr-4">{icon}</div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <ul className="list-disc list-inside text-sm text-gray-500">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
    </a>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Component Showcase
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of advanced React components with modern design and powerful functionality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <ComponentCard
            title="Smart Grid"
            description="Advanced data grid with filtering, sorting, editing, and nested rows"
            href="/grid-demo"
            icon={<Grid className="h-8 w-8" />}
            features={["Advanced filtering", "Inline editing", "Nested rows", "Export capabilities"]}
          />
          
          <ComponentCard
            title="Trip Plans Search Hub"
            description="Comprehensive search and filter interface for trip management"
            href="/trip-plans-search-hub"
            icon={<Search className="h-8 w-8" />}
            features={["Smart search", "Advanced filters", "Real-time results", "Export options"]}
          />
          
          <ComponentCard
            title="Dynamic Panel"
            description="Configurable form panels with field management and customization"
            href="/dynamic-panel-demo"
            icon={<Layout className="h-8 w-8" />}
            features={["Dynamic fields", "Custom layouts", "Field validation", "Panel management"]}
          />

          <ComponentCard
            title="Flex Grid Layout"
            description="Dynamic layout system with draggable, collapsible panels for any content"
            href="/flex-grid-demo"
            icon={<LayoutGrid className="h-8 w-8" />}
            features={["Drag & drop", "Collapsible panels", "Dynamic content", "Responsive design"]}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
