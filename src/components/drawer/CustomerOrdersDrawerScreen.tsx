import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface CustomerOrdersDrawerScreenProps {
  onClose?: () => void;
  tripId?: string;
}

interface OrderFormData {
  customerId: string;
  customerName: string;
  executionPlanId: string;
  legBehaviour: string;
  departureStation: string;
  arrivalStation: string;
  pickupDateFrom: string;
  pickupDateTo: string;
  deliveryDateFrom: string;
  deliveryDateTo: string;
  planFromDate: string;
  planToDate: string;
  remarks: string;
}

interface CustomerOrder {
  id: string;
  formData: OrderFormData;
}

const initialFormData: OrderFormData = {
  customerId: '',
  customerName: '',
  executionPlanId: '',
  legBehaviour: '',
  departureStation: '',
  arrivalStation: '',
  pickupDateFrom: '',
  pickupDateTo: '',
  deliveryDateFrom: '',
  deliveryDateTo: '',
  planFromDate: '',
  planToDate: '',
  remarks: '',
};

const initialOrders: CustomerOrder[] = [
  {
    id: 'CO00000001',
    formData: {
      customerId: 'CO00000001',
      customerName: 'ABC Customer',
      executionPlanId: 'EXE302492304',
      legBehaviour: 'Line Haul',
      departureStation: 'Frankfurt Station A',
      arrivalStation: 'Frankfurt Station B',
      pickupDateFrom: '12-Mar-2025',
      pickupDateTo: '14-Mar-2025',
      deliveryDateFrom: '12-Mar-2025',
      deliveryDateTo: '14-Mar-2025',
      planFromDate: '12-Mar-2025',
      planToDate: '14-Mar-2025',
      remarks: 'Customer order details for CO00000001',
    }
  },
  {
    id: 'CO00000002',
    formData: {
      customerId: 'CO00000002',
      customerName: 'ABC Customer',
      executionPlanId: 'EXE302492304',
      legBehaviour: 'Line Haul',
      departureStation: 'Frankfurt Station A',
      arrivalStation: 'Frankfurt Station B',
      pickupDateFrom: '12-Mar-2025',
      pickupDateTo: '14-Mar-2025',
      deliveryDateFrom: '12-Mar-2025',
      deliveryDateTo: '14-Mar-2025',
      planFromDate: '12-Mar-2025',
      planToDate: '14-Mar-2025',
      remarks: 'Customer order details for CO00000002',
    }
  },
  {
    id: 'CO00000003',
    formData: {
      customerId: 'CO00000003',
      customerName: 'ABC Customer',
      executionPlanId: 'EXE302492304',
      legBehaviour: 'Line Haul',
      departureStation: 'Frankfurt Station A',
      arrivalStation: 'Frankfurt Station B',
      pickupDateFrom: '12-Mar-2025',
      pickupDateTo: '14-Mar-2025',
      deliveryDateFrom: '12-Mar-2025',
      deliveryDateTo: '14-Mar-2025',
      planFromDate: '12-Mar-2025',
      planToDate: '14-Mar-2025',
      remarks: 'Customer order details for CO00000003',
    }
  },
  {
    id: 'CO00000004',
    formData: {
      customerId: 'CO00000004',
      customerName: 'ABC Customer',
      executionPlanId: 'EXE302492304',
      legBehaviour: 'Line Haul',
      departureStation: 'Frankfurt Station A',
      arrivalStation: 'Frankfurt Station B',
      pickupDateFrom: '12-Mar-2025',
      pickupDateTo: '14-Mar-2025',
      deliveryDateFrom: '12-Mar-2025',
      deliveryDateTo: '14-Mar-2025',
      planFromDate: '12-Mar-2025',
      planToDate: '14-Mar-2025',
      remarks: 'Customer order details for CO00000004',
    }
  },
  {
    id: 'CO00000005',
    formData: {
      customerId: 'CO00000005',
      customerName: 'ABC Customer',
      executionPlanId: 'EXE302492304',
      legBehaviour: 'Line Haul',
      departureStation: 'Frankfurt Station A',
      arrivalStation: 'Frankfurt Station B',
      pickupDateFrom: '12-Mar-2025',
      pickupDateTo: '14-Mar-2025',
      deliveryDateFrom: '12-Mar-2025',
      deliveryDateTo: '14-Mar-2025',
      planFromDate: '12-Mar-2025',
      planToDate: '14-Mar-2025',
      remarks: 'Customer order details for CO00000005',
    }
  },
];

export const CustomerOrdersDrawerScreen: React.FC<CustomerOrdersDrawerScreenProps> = ({
  onClose,
  tripId = 'TRIP00000001',
}) => {
  const [orders, setOrders] = useState<CustomerOrder[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [formData, setFormData] = useState<OrderFormData>(initialFormData);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-select first order on mount
  useEffect(() => {
    if (orders.length > 0) {
      const firstOrder = orders[0];
      setSelectedOrder(firstOrder);
      setFormData(firstOrder.formData);
    }
  }, []);

  const handleOrderClick = (order: CustomerOrder) => {
    setSelectedOrder(order);
    setFormData(order.formData);
  };

  const handleAddNew = () => {
    setSelectedOrder(null);
    setFormData(initialFormData);
  };

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (selectedOrder) {
      // Update existing order
      const updatedOrder = { ...selectedOrder, formData };
      setOrders(prev =>
        prev.map(o => (o.id === selectedOrder.id ? updatedOrder : o))
      );
      setSelectedOrder(updatedOrder);
    } else {
      // Create new order
      const newOrder: CustomerOrder = {
        id: `CO${String(orders.length + 1).padStart(8, '0')}`,
        formData,
      };
      setOrders(prev => [...prev, newOrder]);
      setSelectedOrder(newOrder);
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(null);
      setFormData(initialFormData);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.formData.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.formData.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Order List */}
        <div className="w-80 border-r border-border bg-muted/30 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">Customer Orders</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">Total Bookings</span>
                <Badge variant="secondary" className="rounded-full h-5 text-xs">
                  {orders.length}
                </Badge>
              </div>
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleAddNew}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className={`cursor-pointer transition-colors hover:bg-accent ${
                  selectedOrder?.id === order.id ? 'bg-accent border-primary' : ''
                }`}
                onClick={() => handleOrderClick(order)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-blue-600">{order.formData.customerId}</div>
                      <div className="text-xs text-muted-foreground mt-1">{order.formData.customerName}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {order.formData.executionPlanId}
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 -mr-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteOrder(order.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content Area - Order Details */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Customer Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer ID</Label>
                <Input
                  placeholder="Enter Customer ID"
                  value={formData.customerId}
                  onChange={(e) => handleInputChange('customerId', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <div className="relative">
                  <Input
                    placeholder="Enter Customer Name"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Execution Plan and Leg Behaviour */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Execution Plan ID</Label>
                <Input
                  placeholder="Enter Execution Plan ID"
                  value={formData.executionPlanId}
                  onChange={(e) => handleInputChange('executionPlanId', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Leg Behaviour</Label>
                <Select 
                  value={formData.legBehaviour} 
                  onValueChange={(value) => handleInputChange('legBehaviour', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Leg Behaviour" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Line Haul">Line Haul</SelectItem>
                    <SelectItem value="First Mile">First Mile</SelectItem>
                    <SelectItem value="Last Mile">Last Mile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Departure and Arrival Stations */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Departure Station</Label>
                <div className="relative">
                  <Input
                    placeholder="Enter Departure Station"
                    value={formData.departureStation}
                    onChange={(e) => handleInputChange('departureStation', e.target.value)}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Arrival Station</Label>
                <div className="relative">
                  <Input
                    placeholder="Enter Arrival Station"
                    value={formData.arrivalStation}
                    onChange={(e) => handleInputChange('arrivalStation', e.target.value)}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Pickup Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pickup Date From</Label>
                <Input
                  type="date"
                  value={formData.pickupDateFrom}
                  onChange={(e) => handleInputChange('pickupDateFrom', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Pickup Date To</Label>
                <Input
                  type="date"
                  value={formData.pickupDateTo}
                  onChange={(e) => handleInputChange('pickupDateTo', e.target.value)}
                />
              </div>
            </div>

            {/* Delivery Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Delivery Date From</Label>
                <Input
                  type="date"
                  value={formData.deliveryDateFrom}
                  onChange={(e) => handleInputChange('deliveryDateFrom', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Delivery Date To</Label>
                <Input
                  type="date"
                  value={formData.deliveryDateTo}
                  onChange={(e) => handleInputChange('deliveryDateTo', e.target.value)}
                />
              </div>
            </div>

            {/* Plan Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plan From Date</Label>
                <Input
                  type="date"
                  value={formData.planFromDate}
                  onChange={(e) => handleInputChange('planFromDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Plan To Date</Label>
                <Input
                  type="date"
                  value={formData.planToDate}
                  onChange={(e) => handleInputChange('planToDate', e.target.value)}
                />
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Textarea
                placeholder="Enter remarks"
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 z-20 flex items-center justify-end gap-3 px-6 py-4 border-t bg-card">
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
        <Button onClick={handleSave}>
          Save Order
        </Button>
      </div>
    </div>
  );
};
