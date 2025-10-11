import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface CustomerOrdersDrawerScreenProps {
  onClose: () => void;
  tripId?: string;
}

interface FormData {
  customerId: string;
  customerName: string;
  executionPlanId: string;
  legBehaviour: string;
  departureStation: string;
  arrivalStation: string;
  pickupDate: string;
  deliveryDate: string;
  planFromDate: string;
  planToDate: string;
  remarks: string;
}

interface CustomerOrder {
  id: string;
  customerId: string;
  customerName: string;
  formData: FormData;
}

const initialFormData: FormData = {
  customerId: '',
  customerName: '',
  executionPlanId: '',
  legBehaviour: '',
  departureStation: '',
  arrivalStation: '',
  pickupDate: '',
  deliveryDate: '',
  planFromDate: '',
  planToDate: '',
  remarks: '',
};

const initialOrders: CustomerOrder[] = [
  {
    id: 'CO00000001',
    customerId: 'CO00000001',
    customerName: 'ABC Customer',
    formData: {
      customerId: 'CO00000001',
      customerName: 'ABC Customer',
      executionPlanId: 'EXE302492304',
      legBehaviour: 'Line Haul',
      departureStation: 'Frankfurt Station A',
      arrivalStation: 'Frankfurt Station B',
      pickupDate: '2025-03-12',
      deliveryDate: '2025-03-14',
      planFromDate: '2025-03-12',
      planToDate: '2025-03-14',
      remarks: 'Customer order details',
    },
  },
  {
    id: 'CO00000002',
    customerId: 'CO00000002',
    customerName: 'XYZ Customer',
    formData: {
      customerId: 'CO00000002',
      customerName: 'XYZ Customer',
      executionPlanId: 'EXE302492305',
      legBehaviour: 'Line Haul',
      departureStation: 'Frankfurt Station A',
      arrivalStation: 'Frankfurt Station B',
      pickupDate: '2025-03-12',
      deliveryDate: '2025-03-14',
      planFromDate: '2025-03-12',
      planToDate: '2025-03-14',
      remarks: 'Customer order details',
    },
  },
  {
    id: 'CO00000003',
    customerId: 'CO00000003',
    customerName: 'DEF Customer',
    formData: {
      customerId: 'CO00000003',
      customerName: 'DEF Customer',
      executionPlanId: 'EXE302492306',
      legBehaviour: 'Line Haul',
      departureStation: 'Frankfurt Station A',
      arrivalStation: 'Frankfurt Station B',
      pickupDate: '2025-03-12',
      deliveryDate: '2025-03-14',
      planFromDate: '2025-03-12',
      planToDate: '2025-03-14',
      remarks: 'Customer order details',
    },
  },
  {
    id: 'CO00000004',
    customerId: 'CO00000004',
    customerName: 'GHI Customer',
    formData: {
      customerId: 'CO00000004',
      customerName: 'GHI Customer',
      executionPlanId: 'EXE302492307',
      legBehaviour: 'Line Haul',
      departureStation: 'Frankfurt Station A',
      arrivalStation: 'Frankfurt Station B',
      pickupDate: '2025-03-12',
      deliveryDate: '2025-03-14',
      planFromDate: '2025-03-12',
      planToDate: '2025-03-14',
      remarks: 'Customer order details',
    },
  },
  {
    id: 'CO00000005',
    customerId: 'CO00000005',
    customerName: 'JKL Customer',
    formData: {
      customerId: 'CO00000005',
      customerName: 'JKL Customer',
      executionPlanId: 'EXE302492308',
      legBehaviour: 'Line Haul',
      departureStation: 'Frankfurt Station A',
      arrivalStation: 'Frankfurt Station B',
      pickupDate: '2025-03-12',
      deliveryDate: '2025-03-14',
      planFromDate: '2025-03-12',
      planToDate: '2025-03-14',
      remarks: 'Customer order details',
    },
  },
];

export const CustomerOrdersDrawerScreen: React.FC<CustomerOrdersDrawerScreenProps> = ({
  onClose,
  tripId = 'TRIP00000001',
}) => {
  const [orders, setOrders] = useState<CustomerOrder[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (selectedOrder) {
      // Update existing order
      setOrders(prev =>
        prev.map(o =>
          o.id === selectedOrder.id
            ? { ...o, formData, customerName: formData.customerName, customerId: formData.customerId }
            : o
        )
      );
    } else {
      // Create new order
      const newOrder: CustomerOrder = {
        id: `CO${Date.now()}`,
        customerId: formData.customerId,
        customerName: formData.customerName,
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
      order.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Order List */}
        <div className="w-64 border-r border-border bg-muted/30 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">All Orders</h3>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleAddNew}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                      <div className="font-medium text-sm">{order.customerId}</div>
                      <div className="text-xs text-muted-foreground mt-1">{order.customerName}</div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 -mt-1 -mr-1"
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

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Customer ID and Name */}
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
                <Input
                  placeholder="Enter Customer Name"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                />
              </div>
            </div>

            {/* Execution Plan ID and Leg Behaviour */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Execution Plan ID</Label>
                <div className="relative">
                  <Input
                    placeholder="Enter Execution Plan ID"
                    value={formData.executionPlanId}
                    onChange={(e) => handleInputChange('executionPlanId', e.target.value)}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
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
                    <SelectItem value="Last Mile">Last Mile</SelectItem>
                    <SelectItem value="First Mile">First Mile</SelectItem>
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

            {/* Pickup and Delivery Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pickup Date</Label>
                <Input
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Delivery Date</Label>
                <Input
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                />
              </div>
            </div>

            {/* Plan From and To Dates */}
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
