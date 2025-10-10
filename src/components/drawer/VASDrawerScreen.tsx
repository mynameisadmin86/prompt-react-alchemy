import React, { useState } from 'react';
import { DrawerLayout } from './DrawerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Minus } from 'lucide-react';

interface VASItem {
  id: string;
  name: string;
  quantity: number;
}

const mockVASItems: VASItem[] = [
  { id: '1', name: 'Loading Service', quantity: 1 },
  { id: '2', name: 'Unloading Service', quantity: 1 },
  { id: '3', name: 'Packaging', quantity: 2 },
];

interface VASDrawerScreenProps {
  onClose: () => void;
}

export const VASDrawerScreen: React.FC<VASDrawerScreenProps> = ({ onClose }) => {
  const [vasItems, setVasItems] = useState<VASItem[]>(mockVASItems);
  const [formData, setFormData] = useState({
    vasType: '',
    customer: '',
    supplier: '',
    pickupDate: '',
    pickupTime: '',
    deliveryDate: '',
    deliveryTime: '',
    remarks: '',
  });

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setVasItems(vasItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleDeleteItem = (id: string) => {
    setVasItems(vasItems.filter(item => item.id !== id));
  };

  const handleSave = () => {
    console.log('Saving VAS data:', { formData, vasItems });
  };

  // Left Panel: VAS Items List
  const leftPanel = (
    <>
      <h3 className="text-lg font-semibold mb-3">Added VAS Items</h3>
      <div className="space-y-2">
        {vasItems.map((item) => (
          <Card key={item.id} className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );

  // Right Panel: VAS Order Form
  const rightPanel = (
    <>
      <h3 className="text-lg font-semibold mb-3">Order Details</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="vasType">VAS Type</Label>
          <Select
            value={formData.vasType}
            onValueChange={(value) => setFormData({ ...formData, vasType: value })}
          >
            <SelectTrigger id="vasType">
              <SelectValue placeholder="Select VAS type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="loading">Loading Service</SelectItem>
              <SelectItem value="unloading">Unloading Service</SelectItem>
              <SelectItem value="packaging">Packaging</SelectItem>
              <SelectItem value="labeling">Labeling</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="customer">Customer</Label>
          <Input
            id="customer"
            placeholder="Customer name"
            value={formData.customer}
            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="supplier">Supplier</Label>
          <Input
            id="supplier"
            placeholder="Supplier name"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="pickupDate">Pickup Date</Label>
            <Input
              id="pickupDate"
              type="date"
              value={formData.pickupDate}
              onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="pickupTime">Pickup Time</Label>
            <Input
              id="pickupTime"
              type="time"
              value={formData.pickupTime}
              onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="deliveryDate">Delivery Date</Label>
            <Input
              id="deliveryDate"
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="deliveryTime">Delivery Time</Label>
            <Input
              id="deliveryTime"
              type="time"
              value={formData.deliveryTime}
              onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            placeholder="Additional notes"
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            rows={3}
          />
        </div>
      </div>
    </>
  );

  // Footer Actions
  const footer = (
    <>
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={handleSave}>
        Apply VAS
      </Button>
    </>
  );

  return (
    <DrawerLayout
      title="Value Added Services"
      leftPanel={leftPanel}
      rightPanel={rightPanel}
      footer={footer}
      onClose={onClose}
    />
  );
};
