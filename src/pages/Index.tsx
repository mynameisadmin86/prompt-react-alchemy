
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Grid3x3, Layout, Search, Workflow, PanelLeft, Layers, Upload, ShoppingCart, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const demos = [
    {
      title: "Grid Demo",
      description: "Interactive data grid with sorting, filtering, and editing capabilities",
      icon: Grid3x3,
      path: "/grid-demo",
      color: "text-blue-600"
    },
    {
      title: "Trip Plans Search Hub",
      description: "Comprehensive trip management interface with advanced search and filtering",
      icon: Search,
      path: "/trip-plans-search-hub",
      color: "text-green-600"
    },
    {
      title: "Trip Plans Search Hub (API)",
      description: "API-integrated version with real data fetching and server-side operations",
      icon: Search,
      path: "/trip-plans-search-hub-api",
      color: "text-purple-600"
    },
    {
      title: "Dynamic Panel Demo",
      description: "Configurable form panels with dynamic field visibility and validation",
      icon: PanelLeft,
      path: "/dynamic-panel-demo",
      color: "text-orange-600"
    },
    {
      title: "Dynamic Panel Demo Clone",
      description: "Clone version of the configurable form panels demo",
      icon: PanelLeft,
      path: "/dynamic-panel-demo-clone",
      color: "text-amber-600"
    },
    {
      title: "Dynamic Panel Demo Clone (Zustand)",
      description: "Clone version with Zustand state management and data binding",
      icon: PanelLeft,
      path: "/dynamic-panel-demo-clone-zustand",
      color: "text-yellow-600"
    },
    {
      title: "Dynamic Panel Demo (Zustand)",
      description: "Dynamic panel demo with Zustand state management and data binding",
      icon: PanelLeft,
      path: "/dynamic-panel-demo-zustand",
      color: "text-fuchsia-600"
    },
    {
      title: "Simple Dynamic Panel Demo",
      description: "Simplified panel with easy config format and all field types including InputDropdown",
      icon: PanelLeft,
      path: "/simple-dynamic-panel-demo",
      color: "text-rose-600"
    },
    {
      title: "FlexGrid Demo",
      description: "Flexible grid layouts with drag-and-drop and responsive design",
      icon: Layout,
      path: "/flex-grid-demo",
      color: "text-indigo-600"
    },
    {
      title: "FlexGrid Layout Page",
      description: "Advanced layout compositions using the FlexGrid system",
      icon: Layers,
      path: "/flex-grid-layout-page",
      color: "text-pink-600"
    },
    {
      title: "Transport Execution-Trip Log",
      description: "Trip execution workflow with status tracking and approval processes",
      icon: Workflow,
      path: "/trip-log",
      color: "text-cyan-600"
    },
    {
      title: "Trip Planning",
      description: "Trip planning interface with customer orders and planning details management",
      icon: Search,
      path: "/trip-planning",
      color: "text-blue-500"
    },
    {
      title: "Trip Execution",
      description: "Trip execution workflow with status tracking and approval processes",
      icon: Workflow,
      path: "/trip-execution",
      color: "text-cyan-600"
    },
    {
      title: "Trip Execution Page", 
      description: "Enhanced trip execution page with activities and summary cards",
      icon: Workflow,
      path: "/trip-execution-page",
      color: "text-sky-600"
    },
    {
      title: "Create Trip Execution", 
      description: "Trip creation interface with dynamic grid and hover popups",
      icon: Workflow,
      path: "/create-trip-execution",
      color: "text-emerald-600"
    },
    {
      title: "Trip Execution Create (Zustand)", 
      description: "Data-entry page for trip execution using Zustand and Dynamic Panels",
      icon: Workflow,
      path: "/trip-execution-create",
      color: "text-lime-600"
    },
    {
      title: "Trip Execution (Zustand)", 
      description: "Trip execution page with Zustand state management",
      icon: Workflow,
      path: "/trip-execution-zustand",
      color: "text-teal-600"
    },
    {
      title: "Side Drawer Demo",
      description: "Configurable side drawer with various width options and content",
      icon: PanelLeft,
      path: "/side-drawer-demo",
      color: "text-orange-600"
    },
    {
      title: "SmartGridPlus Demo",
      description: "Enhanced grid with inline row addition and editing capabilities",
      icon: Grid3x3,
      path: "/smart-grid-plus-demo",
      color: "text-emerald-600"
    },
    {
      title: "File Upload Demo",
      description: "Comprehensive file upload with categorization, drag & drop, and file management",
      icon: Upload,
      path: "/file-upload-demo",
      color: "text-rose-600"
    },
    {
      title: "Bulk Upload Demo",
      description: "Step-by-step bulk upload with column mapping, validation, and error correction",
      icon: Upload,
      path: "/bulk-upload-demo",
      color: "text-red-600"
    },
    {
      title: "SmartGrid Grouping Demo",
      description: "Advanced grid with row grouping functionality and expandable groups",
      icon: Layers,
      path: "/smart-grid-grouping-demo",
      color: "text-violet-600"
    },
    {
      title: "Dynamic Card View",
      description: "Card view",
      icon: PanelLeft,
      path: "/card-view",
      color: "text-amber-600"
    },
    {
      title: "Quick Order Management",
      description: "Quick order management with advanced filters and API integration",
      icon: ShoppingCart,
      path: "/quick-order-management",
      color: "text-blue-500"
    },
    {
      title: "Quick Order Server-Side Management",
      description: "Server-side filtering quick order management with optimized API integration",
      icon: ShoppingCart,
      path: "/quick-order-server-side-management",
      color: "text-emerald-500"
    },
    {
      title: "Billing Demo",
      description: "Dynamic billing interface with configurable pricing and financial snippets",
      icon: CreditCard,
      path: "/billing-demo",
      color: "text-green-500"
    },
    {
      title: "Order Management (Zustand Demo)",
      description: "Complete order management with Zustand store, API integration, and data binding",
      icon: ShoppingCart,
      path: "/order-list",
      color: "text-purple-500"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enterprise ERP Demo Suite
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive collection of enterprise-grade components and features
            designed for modern ERP applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {demos.map((demo) => {
            const Icon = demo.icon;
            return (
              <Card key={demo.path} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-white transition-colors ${demo.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{demo.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 mb-4 min-h-[3rem]">
                    {demo.description}
                  </CardDescription>
                  <Link to={demo.path}>
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      View Demo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500">
            Built with React, TypeScript, Tailwind CSS, and modern enterprise patterns
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
