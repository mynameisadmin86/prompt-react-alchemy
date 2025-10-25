import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, MapPin, Calendar, Hash } from 'lucide-react';

interface CustomerOrderDetailsDrawerProps {
  order: {
    CustomerOrderNo: string;
    COStatus: string;
    customerName?: string;
    customerAddress?: string;
    orderDate?: string;
    deliveryDate?: string;
    totalItems?: number;
    Departure: string;
    Arrival: string;
    Mode: string;
    DepartureDate: string;
    ArrivalDate: string;
    LegExecuted: string;
  };
}

export const CustomerOrderDetailsDrawer: React.FC<CustomerOrderDetailsDrawerProps> = ({ order }) => {
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'Confirmed': 'bg-green-100 text-green-800 border-green-200',
      'Partial-Delivered': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Closed': 'bg-red-100 text-red-800 border-red-200',
      'In-Complete': 'bg-orange-100 text-orange-800 border-orange-200',
      'Fully-Delivered': 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-foreground">{order.CustomerOrderNo}</h3>
          <p className="text-sm text-muted-foreground mt-1">Order Details</p>
        </div>
        <Badge className={`${getStatusColor(order.COStatus)} border`}>
          {order.COStatus}
        </Badge>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Panel - Customer Info */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h4 className="text-lg font-semibold text-foreground">Customer Information</h4>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Customer Name</label>
              <p className="text-base text-foreground mt-1">{order.customerName || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Address</label>
              <p className="text-base text-foreground mt-1">{order.customerAddress || 'N/A'}</p>
            </div>
            <div className="pt-2 border-t">
              <label className="text-sm font-medium text-muted-foreground">Total Items</label>
              <p className="text-2xl font-bold text-primary mt-1">{order.totalItems || 0}</p>
            </div>
          </div>
        </Card>

        {/* Right Panel - Order Summary */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h4 className="text-lg font-semibold text-foreground">Order Summary</h4>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Order Date</label>
              <p className="text-base text-foreground mt-1">{order.orderDate || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Delivery Date</label>
              <p className="text-base text-foreground mt-1">{order.deliveryDate || 'N/A'}</p>
            </div>
            <div className="pt-2 border-t">
              <label className="text-sm font-medium text-muted-foreground">Leg Executed</label>
              <p className="text-base font-semibold text-foreground mt-1">{order.LegExecuted}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Route Information */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <h4 className="text-lg font-semibold text-foreground">Route Information</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Departure</label>
              <p className="text-base text-foreground mt-1">{order.Departure}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Departure Date</label>
              <p className="text-base text-foreground mt-1">{order.DepartureDate}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Arrival</label>
              <p className="text-base text-foreground mt-1">{order.Arrival}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Arrival Date</label>
              <p className="text-base text-foreground mt-1">{order.ArrivalDate}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <label className="text-sm font-medium text-muted-foreground">Transport Mode</label>
          <Badge variant="outline" className="mt-2">{order.Mode}</Badge>
        </div>
      </Card>
    </div>
  );
};
