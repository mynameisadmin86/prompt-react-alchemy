import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Package, Wrench, Shield, Truck } from 'lucide-react';

interface VASItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: any;
  category: string;
  enabled: boolean;
  quantity: number;
}

export const VASDrawerScreen = () => {
  const [vasItems, setVasItems] = useState<VASItem[]>([
    {
      id: '1',
      name: 'Loading Assistance',
      description: 'Professional loading service',
      cost: 50,
      icon: Package,
      category: 'Service',
      enabled: true,
      quantity: 1,
    },
    {
      id: '2',
      name: 'Packaging Materials',
      description: 'Bubble wrap, boxes, tape',
      cost: 30,
      icon: Wrench,
      category: 'Consumable',
      enabled: true,
      quantity: 2,
    },
    {
      id: '3',
      name: 'Insurance Coverage',
      description: 'Full coverage insurance',
      cost: 100,
      icon: Shield,
      category: 'Service',
      enabled: false,
      quantity: 1,
    },
    {
      id: '4',
      name: 'Express Delivery',
      description: 'Priority delivery service',
      cost: 75,
      icon: Truck,
      category: 'Service',
      enabled: false,
      quantity: 1,
    },
    {
      id: '5',
      name: 'Strapping Materials',
      description: 'Industrial straps and bands',
      cost: 25,
      icon: Wrench,
      category: 'Consumable',
      enabled: true,
      quantity: 3,
    },
  ]);

  const toggleVAS = (id: string) => {
    setVasItems(
      vasItems.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setVasItems(
      vasItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const enabledItems = vasItems.filter((item) => item.enabled);
  const totalCost = enabledItems.reduce(
    (sum, item) => sum + item.cost * item.quantity,
    0
  );
  const totalServices = enabledItems.filter(
    (item) => item.category === 'Service'
  ).length;
  const totalConsumables = enabledItems.reduce(
    (sum, item) => (item.category === 'Consumable' ? sum + item.quantity : sum),
    0
  );

  return (
    <div className="space-y-6">
      {/* VAS Items */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Services</h3>
        <div className="space-y-3">
          {vasItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                className={`transition-all ${
                  item.enabled ? 'border-primary shadow-sm' : 'opacity-60'
                }`}
              >
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        item.enabled
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{item.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <Switch
                          checked={item.enabled}
                          onCheckedChange={() => toggleVAS(item.id)}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-sm">
                          <span className="font-semibold">
                            USD {item.cost * item.quantity}
                          </span>
                          <span className="text-muted-foreground">
                            {' '}
                            (${item.cost} each)
                          </span>
                        </div>
                        {item.enabled && (
                          <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground">
                              Qty:
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-20 h-8"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Summary */}
      <div>
        <h3 className="text-lg font-semibold mb-4">VAS Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <p className="text-sm font-medium text-muted-foreground">
                Total Services
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalServices}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <p className="text-sm font-medium text-muted-foreground">
                Consumables
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalConsumables}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <p className="text-sm font-medium text-muted-foreground">
                Total Cost
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">USD {totalCost}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
