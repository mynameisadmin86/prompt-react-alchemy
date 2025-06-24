
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const TripDetailsForm: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trip Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="destination">Destination</Label>
            <Input id="destination" placeholder="Enter destination" />
          </div>
          <div>
            <Label htmlFor="departure">Departure Date</Label>
            <Input id="departure" type="date" />
          </div>
          <div>
            <Label htmlFor="return">Return Date</Label>
            <Input id="return" type="date" />
          </div>
          <div>
            <Label htmlFor="travelers">Number of Travelers</Label>
            <Input id="travelers" type="number" min="1" defaultValue="1" />
          </div>
          <Button className="w-full">Search Trips</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export const TripGridDashboard: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base">Trip Option {i}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">
                Destination: Sample Location {i}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Duration: {3 + i} days
              </p>
              <p className="text-sm font-semibold text-green-600">
                ${299 + i * 50}
              </p>
              <Button size="sm" className="mt-2">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
