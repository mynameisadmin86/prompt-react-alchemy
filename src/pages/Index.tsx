
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Grid3x3, Layout, Search, Workflow, PanelLeft, Layers } from "lucide-react";
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
      title: "Trip Execution",
      description: "Trip execution workflow with status tracking and approval processes",
      icon: Workflow,
      path: "/trip-execution",
      color: "text-cyan-600"
    },
    {
      title: "Side Drawer Demo",
      description: "Configurable side drawer with various width options and content",
      icon: PanelLeft,
      path: "/side-drawer-demo",
      color: "text-teal-600"
    }
  ];

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)' }}>
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 font-weight-bold text-dark mb-4">
            Enterprise ERP Demo Suite
          </h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '48rem' }}>
            Explore our comprehensive collection of enterprise-grade components and features
            designed for modern ERP applications.
          </p>
        </div>

        <div className="row">
          {demos.map((demo) => {
            const Icon = demo.icon;
            return (
              <div key={demo.path} className="col-12 col-md-6 col-lg-4 mb-4">
                <Card className="h-100 border-0 shadow-sm hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="d-flex align-items-center">
                      <div className={`p-2 rounded bg-light mr-3 ${demo.color}`} style={{ transition: 'background-color 0.2s' }}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="h5 mb-0">{demo.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 d-flex flex-column">
                    <CardDescription className="text-muted mb-4 flex-grow-1" style={{ minHeight: '3rem' }}>
                      {demo.description}
                    </CardDescription>
                    <Link to={demo.path} className="mt-auto">
                      <Button className="btn btn-block">
                        View Demo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-5">
          <p className="text-muted">
            Built with React, TypeScript, Bootstrap 4, and modern enterprise patterns
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
