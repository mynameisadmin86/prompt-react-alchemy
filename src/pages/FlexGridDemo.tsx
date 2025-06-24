
import React from 'react';
import { FlexGridLayout } from '@/components/FlexGridLayout';
import { FlexGridLayoutConfig } from '@/components/FlexGridLayout/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Calendar, Clock } from 'lucide-react';

// Sample components for demonstration
const TripFormPanel = () => (
  <div className="space-y-4">
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Trip Details</CardTitle>
        <CardDescription>Configure your trip settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Destination</label>
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm">San Francisco, CA</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Duration</label>
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm">5 days</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Travelers</label>
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm">4 people</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Dates</label>
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">Dec 15-20, 2024</span>
          </div>
        </div>

        <Button className="w-full mt-4">
          Update Trip
        </Button>
      </CardContent>
    </Card>
  </div>
);

const MainContentPanel = () => (
  <div className="h-full">
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Main Dashboard</CardTitle>
        <CardDescription>Your trip planning workspace</CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-blue-700">Itinerary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600">Plan your daily activities and schedule</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-green-700">Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600">Track expenses and manage budget</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-purple-700">Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-600">Manage hotels, flights, and reservations</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200 md:col-span-2 lg:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-orange-700">Map View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-orange-100 rounded flex items-center justify-center">
                <p className="text-sm text-orange-600">Interactive map would go here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  </div>
);

const FlexGridDemo = () => {
  const layoutConfig: FlexGridLayoutConfig = {
    layoutDirection: 'row',
    panels: [
      {
        id: 'leftPanel',
        title: 'Trip Details',
        collapsible: true,
        defaultCollapsed: false,
        width: '320px',
        minWidth: '0px',
        content: <TripFormPanel />,
      },
      {
        id: 'rightPanel',
        title: 'Main Content',
        collapsible: false,
        fillOnCollapseOf: 'leftPanel',
        content: <MainContentPanel />,
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Flex Grid Layout Demo
          </h1>
          <p className="text-gray-600">
            A dynamic, collapsible layout system with configurable panels. 
            Try collapsing the left panel to see the right panel expand to full width.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border h-[calc(100vh-200px)]">
          <FlexGridLayout config={layoutConfig} />
        </div>
      </div>
    </div>
  );
};

export default FlexGridDemo;
