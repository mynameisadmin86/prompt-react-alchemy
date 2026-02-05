
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Grid3x3, Layout, Search, Workflow, PanelLeft, Layers, Upload, ShoppingCart, CreditCard, Tag, Calendar, Code2, FileCode, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useIDEStore } from "@/stores/ideStore";

const Index = () => {
  const { pages: idePages } = useIDEStore();
  const demos = [
    {
      title: "Grid Demo",
      description: "Interactive data grid with sorting, filtering, and editing capabilities",
      icon: Grid3x3,
      path: "/grid-demo",
      color: "text-blue-600"
    },
    {
      title: "Grid Demo Grouping",
      description: "Interactive data grid with grouping functionality and expandable groups",
      icon: Layers,
      path: "/grid-demo-grouping",
      color: "text-indigo-600"
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
      title: "Plan Actuals",
      description: "Plan and actual details management with wagon and container tracking",
      icon: Workflow,
      path: "/plan-actuals",
      color: "text-violet-600"
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
    {
      title: "SmartGrid Highlight Demo",
      description: "Interactive demo showcasing row highlighting feature with dynamic controls",
      icon: Grid3x3,
      path: "/smartgrid-highlight-demo",
      color: "text-yellow-600"
    },
    {
      title: "Transport Route Update",
      description: "Manage transport routes with clickable customer orders and detailed side drawer view",
      icon: Search,
      path: "/transport-route-update",
      color: "text-indigo-600"
    },
    {
      title: "SmartGrid Selection Demo",
      description: "Interactive demo showcasing default selected rows with selection controls and management",
      icon: Grid3x3,
      path: "/smartgrid-selection-demo",
      color: "text-teal-600"
    },
    {
      title: "Consignment Details",
      description: "Comprehensive consignment management with leg cards, summary cards, and plan details",
      icon: Workflow,
      path: "/consignment-details",
      color: "text-blue-600"
    },
    {
      title: "Badges List Demo",
      description: "Interactive badges list component with remove functionality and multiple variants",
      icon: Tag,
      path: "/badges-list-demo",
      color: "text-pink-500"
    },
    {
      title: "SmartGrid with Nested Rows",
      description: "Extended SmartGrid with collapsible nested array sections for hierarchical data",
      icon: Layers,
      path: "/smartgrid-nested-rows-demo",
      color: "text-cyan-500"
    },
    {
      title: "Equipment Calendar",
      description: "Timeline-based calendar view for equipment scheduling and availability tracking",
      icon: Calendar,
      path: "/equipment-calendar-demo",
      color: "text-emerald-600"
    },
    {
      title: "SmartGridPlus with Nested Rows",
      description: "Extended SmartGridPlus with inline editing for both parent and nested child rows",
      icon: Layers,
      path: "/smartgrid-plus-nested-rows-demo",
      color: "text-orange-500"
    },
    {
      title: "Cascading LazySelect Demo",
      description: "Dependent LazySelect columns where selecting a value loads options for the next column",
      icon: Grid3x3,
      path: "/cascading-lazyselect-demo",
      color: "text-purple-500"
    },
    {
      title: "LazySelect Add New Demo",
      description: "LazySelect with allowAddNew feature to add new items directly from the dropdown",
      icon: PanelLeft,
      path: "/lazyselect-add-new-demo",
      color: "text-teal-500"
    },
    {
      title: "DynamicLazySelect Add New Demo",
      description: "DynamicLazySelect with allowAddNew feature for DynamicPanel integration",
      icon: PanelLeft,
      path: "/dynamic-lazyselect-add-new-demo",
      color: "text-cyan-500"
    },
    {
      title: "Visual IDE",
      description: "Drag-and-drop IDE to build pages with available components and configurations",
      icon: Code2,
      path: "/ide",
      color: "text-violet-600"
    },
    {
      title: "Receivables Authorization",
      description: "Customer invoice authorization with invoice details grid and financial management",
      icon: FileText,
      path: "/receivables-authorization",
      color: "text-green-600"
    },
    {
      title: "Draft Bill Details",
      description: "Detailed bill management with tariff details, summary sections, and editable fields",
      icon: FileText,
      path: "/draft-bill-details",
      color: "text-blue-500"
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

        {/* IDE Created Pages Section */}
        {idePages.length > 0 && (
          <div className="mt-16 max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                IDE Created Pages
              </h2>
              <p className="text-gray-600">
                Pages built using the Visual IDE
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {idePages.map((page) => (
                <Card key={page.id} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md border-l-4 border-l-violet-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-white transition-colors text-violet-600">
                        <FileCode className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{page.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-gray-600 mb-2">
                      <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{page.route}</span>
                    </CardDescription>
                    <CardDescription className="text-gray-600 mb-4">
                      {page.components.length} component{page.components.length !== 1 ? 's' : ''}
                    </CardDescription>
                    <Link to={page.route}>
                      <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        View Page
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

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
