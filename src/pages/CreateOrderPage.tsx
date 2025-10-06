import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '@/datastore/orderStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';

const CreateOrderPage = () => {
  const navigate = useNavigate();
  const { selectedOrder, loading, error, updateField, saveOrder, reset } = useOrderStore();

  useEffect(() => {
    // Initialize new order with defaults
    updateField('id', 'ORDER_NEW');
    updateField('orderNumber', `ORD-${Date.now()}`);
    updateField('status', 'pending');
    updateField('quantity', 1);
    updateField('price', 0);
    updateField('orderDate', new Date().toISOString().split('T')[0]);

    return () => {
      reset();
    };
  }, [updateField, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrder?.customerName || !selectedOrder?.product) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Calculate total amount
    const totalAmount = (selectedOrder.quantity || 0) * (selectedOrder.price || 0);
    updateField('totalAmount', totalAmount);

    await saveOrder({ ...selectedOrder, totalAmount });
    toast.success('Order created successfully');
    navigate('/order-list');
  };

  const handleFieldChange = (field: keyof typeof selectedOrder, value: any) => {
    updateField(field, value);
    
    // Auto-calculate total amount
    if (field === 'quantity' || field === 'price') {
      const quantity = field === 'quantity' ? value : selectedOrder?.quantity || 0;
      const price = field === 'price' ? value : selectedOrder?.price || 0;
      updateField('totalAmount', quantity * price);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/order-list')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Create New Order</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Fill in the order details below
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderNumber">
                      Order Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="orderNumber"
                      value={selectedOrder?.orderNumber || ''}
                      onChange={(e) => handleFieldChange('orderNumber', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orderDate">
                      Order Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="orderDate"
                      type="date"
                      value={selectedOrder?.orderDate || ''}
                      onChange={(e) => handleFieldChange('orderDate', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerName">
                    Customer Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="customerName"
                    value={selectedOrder?.customerName || ''}
                    onChange={(e) => handleFieldChange('customerName', e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product">
                    Product <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="product"
                    value={selectedOrder?.product || ''}
                    onChange={(e) => handleFieldChange('product', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">
                      Quantity <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={selectedOrder?.quantity || 1}
                      onChange={(e) => handleFieldChange('quantity', parseInt(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price ($) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={selectedOrder?.price || 0}
                      onChange={(e) => handleFieldChange('price', parseFloat(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalAmount">Total Amount ($)</Label>
                    <Input
                      id="totalAmount"
                      type="number"
                      value={selectedOrder?.totalAmount || 0}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingAddress">
                    Shipping Address <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="shippingAddress"
                    value={selectedOrder?.shippingAddress || ''}
                    onChange={(e) => handleFieldChange('shippingAddress', e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={selectedOrder?.notes || ''}
                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                    rows={3}
                    placeholder="Additional notes or instructions..."
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/order-list')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Creating...' : 'Create Order'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderPage;
