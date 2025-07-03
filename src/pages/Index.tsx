
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Grid, PanelTop, Layout, Route, SidebarOpen } from "lucide-react";

const Index = () => {
  const demos = [
    {
      title: "Smart Grid Demo",
      description: "Advanced data grid with filtering, sorting, and column management",
      icon: Grid,
      path: "/grid-demo",
      color: "bg-blue-500"
    },
    {
      title: "Trip Plans Search Hub",
      description: "Search and manage trip plans with advanced filtering",
      icon: Route,
      path: "/trip-plans-search-hub",
      color: "bg-green-500"
    },
    {
      title: "Dynamic Panel Demo",
      description: "Configurable panels with dynamic field visibility",
      icon: PanelTop,
      path: "/dynamic-panel-demo",
      color: "bg-purple-500"
    },
    {
      title: "Flex Grid Demo",
      description: "Flexible grid layouts with responsive design",
      icon: Layout,
      path: "/flex-grid-demo",
      color: "bg-orange-500"
    },
    {
      title: "Flex Grid Layout Page",
      description: "Advanced flex grid layout system",
      icon: Layout,
      path: "/flex-grid-layout-page",
      color: "bg-teal-500"
    },
    {
      title: "Trip Execution",
      description: "Trip execution and management interface",
      icon: Route,
      path: "/trip-execution",
      color: "bg-indigo-500"
    },
    {
      title: "Side Drawer Demo",
      description: "Reusable left-side drawer component with smooth animations",
      icon: SidebarOpen,
      path: "/side-drawer-demo",
      color: "bg-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Component Demo Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of reusable components and advanced UI patterns
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((demo) => {
            const IconComponent = demo.icon;
            return (
              <Card key={demo.path} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${demo.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{demo.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-gray-600">
                    {demo.description}
                  </CardDescription>
                  <Link to={demo.path}>
                    <Button className="w-full">
                      View Demo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;
