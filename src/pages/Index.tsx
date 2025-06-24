
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid, Search, Settings, Database, Layout } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Components Showcase
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of smart, reusable components built with React, TypeScript, and Tailwind CSS
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Grid className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Smart Grid</CardTitle>
                  <CardDescription>Advanced data grid component</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                A powerful data grid with sorting, filtering, pagination, inline editing, and customizable columns.
              </p>
              <Link to="/grid-demo">
                <Button className="w-full">
                  View Demo
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Search className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>Trip Plans Search Hub</CardTitle>
                  <CardDescription>Advanced search interface</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                A comprehensive search interface with collapsible filters and smart grid integration for trip management.
              </p>
              <Link to="/trip-plans-search-hub">
                <Button className="w-full">
                  View Demo
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Dynamic Panel</CardTitle>
                  <CardDescription>Configurable panel system</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                A flexible panel component with customizable fields, validation, and dynamic layout capabilities.
              </p>
              <Link to="/dynamic-panel-demo">
                <Button className="w-full">
                  View Demo
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Layout className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle>Flex Grid Layout</CardTitle>
                  <CardDescription>Dynamic collapsible layout system</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                A flexible grid layout with collapsible panels, drag-and-drop reordering, and configurable content hosting.
              </p>
              <Link to="/flex-grid-demo">
                <Button className="w-full">
                  View Demo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Built with Modern Technologies
            </h2>
            <p className="text-gray-600 mb-8">
              Our components leverage the latest web technologies to provide exceptional performance, 
              accessibility, and developer experience.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                React 18
              </span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                TypeScript
              </span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                Tailwind CSS
              </span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                Shadcn/ui
              </span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                Vite
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
