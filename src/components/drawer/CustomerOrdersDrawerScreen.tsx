import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit2, Trash2, Search, Copy, Download, Maximize2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CustomerOrdersDrawerScreenProps {
  onClose?: () => void;
}

interface LineItem {
  id: string;
  itemCode: string;
  description: string;
  quantity: number;
  rate: number;
  total: number;
}

interface OrderFormData {
  orderId: string;
  orderNumber: string;
  customerName: string;
  executionPlanId: string;
  legBehaviour: string;
  departureLocation: string;
  arrivalLocation: string;
  pickupLocation: string;
  deliveryLocation: string;
  planFromDate: string;
  planToDate: string;
  orderDate: string;
  status: string;
  totalValue: number;
  notes: string;
  lineItems: LineItem[];
}

interface CustomerOrder {
  id: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  formData: OrderFormData;
}

const initialFormData: OrderFormData = {
  orderId: '',
  orderNumber: '',
  customerName: '',
  executionPlanId: '',
  legBehaviour: '',
  departureLocation: '',
  arrivalLocation: '',
  pickupLocation: '',
  deliveryLocation: '',
  planFromDate: '',
  planToDate: '',
  orderDate: '',
  status: '',
  totalValue: 0,
  notes: '',
  lineItems: [],
};

const initialOrders: CustomerOrder[] = [
  {
    id: 'CO00000001',
    status: 'Pending',
    formData: {
      ...initialFormData,
      orderId: 'CO00000001',
      orderNumber: 'ORD-2025-001',
      customerName: 'ABC Customer',
      executionPlanId: 'EXE302492304',
      legBehaviour: 'Line Haul',
      departureLocation: 'Frankfurt Station A',
      arrivalLocation: 'Frankfurt Station B',
      pickupLocation: 'Frankfurt Station A',
      deliveryLocation: 'Frankfurt Station B',
      planFromDate: '2025-03-12',
      planToDate: '2025-03-14',
      orderDate: '2025-03-10',
      status: 'pending',
      totalValue: 15000,
      notes: 'Priority shipment',
      lineItems: [
        { id: '1', itemCode: 'ITEM001', description: 'Product A', quantity: 10, rate: 1000, total: 10000 },
        { id: '2', itemCode: 'ITEM002', description: 'Product B', quantity: 5, rate: 1000, total: 5000 },
      ],
    },
  },
  {
    id: 'CO00000002',
    status: 'Processing',
    formData: {
      ...initialFormData,
      orderId: 'CO00000002',
      orderNumber: 'ORD-2025-002',
      customerName: 'XYZ Corporation',
      executionPlanId: 'EXE302492305',
      legBehaviour: 'Direct',
      departureLocation: 'Berlin Hub',
      arrivalLocation: 'Munich Center',
      pickupLocation: 'Berlin Hub',
      deliveryLocation: 'Munich Center',
      planFromDate: '2025-03-13',
      planToDate: '2025-03-15',
      orderDate: '2025-03-11',
      status: 'processing',
      totalValue: 25000,
      notes: 'Handle with care',
      lineItems: [
        { id: '1', itemCode: 'ITEM003', description: 'Product C', quantity: 15, rate: 1000, total: 15000 },
        { id: '2', itemCode: 'ITEM004', description: 'Product D', quantity: 10, rate: 1000, total: 10000 },
      ],
    },
  },
  {
    id: 'CO00000003',
    status: 'Completed',
    formData: {
      ...initialFormData,
      orderId: 'CO00000003',
      orderNumber: 'ORD-2025-003',
      customerName: 'Global Traders',
      executionPlanId: 'EXE302492306',
      legBehaviour: 'Multi-leg',
      departureLocation: 'Hamburg Port',
      arrivalLocation: 'Dresden Station',
      pickupLocation: 'Hamburg Port',
      deliveryLocation: 'Dresden Station',
      planFromDate: '2025-03-10',
      planToDate: '2025-03-12',
      orderDate: '2025-03-08',
      status: 'completed',
      totalValue: 30000,
      notes: 'Completed successfully',
      lineItems: [
        { id: '1', itemCode: 'ITEM005', description: 'Product E', quantity: 20, rate: 1500, total: 30000 },
      ],
    },
  },
];

export const CustomerOrdersDrawerScreen: React.FC<CustomerOrdersDrawerScreenProps> = ({ onClose }) => {
  const [orders, setOrders] = useState<CustomerOrder[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [formData, setFormData] = useState<OrderFormData>(initialFormData);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleInputChange = (field: string, value: string | number | LineItem[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (selectedOrder) {
      const newStatus: 'Pending' | 'Processing' | 'Completed' | 'Cancelled' =
        formData.status === 'pending' ? 'Pending' :
        formData.status === 'processing' ? 'Processing' :
        formData.status === 'completed' ? 'Completed' : 'Cancelled';

      const updatedOrder: CustomerOrder = {
        ...selectedOrder,
        formData,
        status: newStatus,
      };
      setOrders(prev =>
        prev.map(order =>
          order.id === selectedOrder.id ? updatedOrder : order
        )
      );
      setSelectedOrder(updatedOrder);
    } else {
      const newStatus: 'Pending' | 'Processing' | 'Completed' | 'Cancelled' =
        formData.status === 'pending' ? 'Pending' :
        formData.status === 'processing' ? 'Processing' :
        formData.status === 'completed' ? 'Completed' : 'Cancelled';

      const newOrder: CustomerOrder = {
        id: `CO${String(orders.length + 1).padStart(8, '0')}`,
        status: newStatus,
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

  const handleDeleteOrder = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const orderToDelete = orders[index];
    setOrders(prev => prev.filter((_, i) => i !== index));
    if (selectedOrder === orderToDelete) {
      setSelectedOrder(null);
      setFormData(initialFormData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'Processing': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'Completed': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Cancelled': return 'bg-red-100 text-red-800 hover:bg-red-100';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order =>
    order.formData.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.formData.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Order List */}
        <div className="w-[30%] border-r border-border bg-muted/30 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">All Orders</h3>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleAddNew}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto">
            {filteredOrders.map((order, index) => {
              const isSelected = selectedOrder ?
                orders.findIndex(ord => ord === selectedOrder) === orders.findIndex(ord => ord === order) :
                false;

              return (
                <Card
                  key={`${order.id}-${index}`}
                  className={`cursor-pointer transition-colors hover:bg-accent ${
                    isSelected ? 'bg-accent border-primary' : ''
                  }`}
                  onClick={() => handleOrderClick(order)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{order.id}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => handleDeleteOrder(index, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>{order.formData.customerName}</div>
                      <div className="flex items-center justify-between">
                        <span>{order.formData.orderDate}</span>
                        <Badge className={`${getStatusColor(order.status)} text-xs font-medium`}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="font-medium">${order.formData.totalValue.toLocaleString()}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Top row with Order ID, Status and action icons */}
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="orderId">Customer Order ID <span className="text-destructive">*</span></Label>
                <Input
                  id="orderId"
                  value={formData.orderId}
                  onChange={(e) => handleInputChange('orderId', e.target.value)}
                  placeholder="Enter order ID"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="orderStatus">Order Status <span className="text-destructive">*</span></Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger id="orderStatus">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Order Details Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Order Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderNumber">Order Number <span className="text-destructive">*</span></Label>
                    <Input
                      id="orderNumber"
                      value={formData.orderNumber}
                      onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                      placeholder="Enter order number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      placeholder="Enter customer name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="executionPlanId">Execution Plan ID</Label>
                    <Input
                      id="executionPlanId"
                      value={formData.executionPlanId}
                      onChange={(e) => handleInputChange('executionPlanId', e.target.value)}
                      placeholder="Enter execution plan ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="legBehaviour">Leg Behaviour</Label>
                    <Select value={formData.legBehaviour} onValueChange={(value) => handleInputChange('legBehaviour', value)}>
                      <SelectTrigger id="legBehaviour">
                        <SelectValue placeholder="Select Leg Behaviour" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Line Haul">Line Haul</SelectItem>
                        <SelectItem value="Direct">Direct</SelectItem>
                        <SelectItem value="Multi-leg">Multi-leg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orderDate">Order Date</Label>
                    <Input
                      id="orderDate"
                      type="date"
                      value={formData.orderDate}
                      onChange={(e) => handleInputChange('orderDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalValue">Total Value</Label>
                    <Input
                      id="totalValue"
                      type="number"
                      value={formData.totalValue}
                      onChange={(e) => handleInputChange('totalValue', parseFloat(e.target.value) || 0)}
                      placeholder="Enter total value"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Locations Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Departure and Arrival</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="departureLocation">Departure Location</Label>
                    <Input
                      id="departureLocation"
                      value={formData.departureLocation}
                      onChange={(e) => handleInputChange('departureLocation', e.target.value)}
                      placeholder="Enter departure location"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arrivalLocation">Arrival Location</Label>
                    <Input
                      id="arrivalLocation"
                      value={formData.arrivalLocation}
                      onChange={(e) => handleInputChange('arrivalLocation', e.target.value)}
                      placeholder="Enter arrival location"
                    />
                  </div>
                </div>

                <h3 className="font-semibold mb-4 mt-6">Pickup and Delivery</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupLocation">Pickup Location</Label>
                    <Input
                      id="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                      placeholder="Enter pickup location"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryLocation">Delivery Location</Label>
                    <Input
                      id="deliveryLocation"
                      value={formData.deliveryLocation}
                      onChange={(e) => handleInputChange('deliveryLocation', e.target.value)}
                      placeholder="Enter delivery location"
                    />
                  </div>
                </div>

                <h3 className="font-semibold mb-4 mt-6">Plan From & To Date</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="planFromDate">Plan From Date</Label>
                    <Input
                      id="planFromDate"
                      type="date"
                      value={formData.planFromDate}
                      onChange={(e) => handleInputChange('planFromDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="planToDate">Plan To Date</Label>
                    <Input
                      id="planToDate"
                      type="date"
                      value={formData.planToDate}
                      onChange={(e) => handleInputChange('planToDate', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Line Items Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Line Items</h3>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Code</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.lineItems.length > 0 ? (
                        formData.lineItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.itemCode}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>${item.rate.toLocaleString()}</TableCell>
                            <TableCell>${item.total.toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            No line items added
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Notes Section */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Add any additional notes..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
              <Button onClick={handleSave}>
                Save Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
