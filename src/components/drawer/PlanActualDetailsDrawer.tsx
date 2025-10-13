import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Truck, Container as ContainerIcon, Package, Box, Calendar, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PlanActualDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WagonItem {
  id: string;
  name: string;
  description: string;
  price: string;
  checked: boolean;
}

export const PlanActualDetailsDrawer: React.FC<PlanActualDetailsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    wagon: true,
    container: true,
    product: true,
    thu: true,
    journey: true,
    other: false,
  });

  const [selectedItems, setSelectedItems] = useState<WagonItem[]>([
    { id: 'WAG00000001', name: 'WAG00000001', description: 'Habbins', price: '€ 1395.00', checked: true },
    { id: 'WAG00000002', name: 'WAG00000002', description: 'Zaccs', price: '€ 1395.00', checked: false },
    { id: 'WAG00000003', name: 'WAG00000003', description: 'A Type Wagon', price: '€ 1395.00', checked: false },
    { id: 'WAG00000004', name: 'WAG00000004', description: 'Closed Wagon', price: '€ 1395.00', checked: false },
  ]);

  const [selectAll, setSelectAll] = useState(false);
  const [wagonCount, setWagonCount] = useState('1');
  const [containerCount, setContainerCount] = useState('1');
  const [thuCount, setTHUCount] = useState('5');
  const [hazardousGoods, setHazardousGoods] = useState(false);
  const [loadType, setLoadType] = useState('loaded');

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleItemCheck = (id: string) => {
    setSelectedItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const toggleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    setSelectedItems(prev => prev.map(item => ({ ...item, checked: newValue })));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-50 bg-background"
    >
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-6">
        <h2 className="text-lg font-semibold">Plan and Actual Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex h-[calc(100vh-56px)]">
        {/* Left Sidebar - Items List */}
        <div className="w-64 border-r bg-muted/30 flex flex-col">
          {/* Select All */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectAll}
                onCheckedChange={toggleSelectAll}
              />
              <Label htmlFor="select-all" className="font-medium cursor-pointer">
                All Item
              </Label>
              <div className="flex-1" />
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <path d="M9 3v18M15 3v18" />
                </svg>
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
              </Button>
              <Button size="icon" variant="default" className="h-8 w-8">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "p-3 border rounded-md bg-card hover:bg-accent/50 transition-colors cursor-pointer",
                  item.checked && "border-primary bg-accent"
                )}
              >
                <div className="flex items-start gap-2">
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => toggleItemCheck(item.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-sm text-blue-600">{item.name}</div>
                      <Button size="icon" variant="ghost" className="h-5 w-5 shrink-0">
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="5" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="12" cy="19" r="2" />
                        </svg>
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">{item.description}</div>
                    <div className="text-sm font-medium text-blue-600">{item.price}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add More Button */}
            <Button variant="outline" className="w-full h-12 border-dashed">
              --
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <Tabs defaultValue="actuals" className="flex-1 flex flex-col">
            <div className="border-b px-6 pt-4">
              <TabsList>
                <TabsTrigger value="planned">Planned</TabsTrigger>
                <TabsTrigger value="actuals">Actuals</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="planned" className="flex-1 m-0 overflow-y-auto p-6">
              <div className="text-muted-foreground">Planned details will be displayed here</div>
            </TabsContent>

            <TabsContent value="actuals" className="flex-1 m-0 overflow-y-auto p-6 space-y-4">
              {/* Wagon Details */}
              <div className="border rounded-lg bg-card">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleSection('wagon')}
                >
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">Wagon Details</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                      Wagon {wagonCount}
                    </Badge>
                    {expandedSections.wagon ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedSections.wagon && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <Separator />
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Wagon Type</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="habbins">Habbins</SelectItem>
                                <SelectItem value="zaccs">Zaccs</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Wagon ID</Label>
                            <Input placeholder="Enter ID" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Wagon Quantity</Label>
                            <div className="flex items-center gap-2">
                              <Select defaultValue="EA">
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="EA">EA</SelectItem>
                                  <SelectItem value="KG">KG</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input type="number" value={wagonCount} onChange={(e) => setWagonCount(e.target.value)} />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Wagon Tare Weight</Label>
                            <div className="flex items-center gap-2">
                              <Select defaultValue="TON">
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="TON">TON</SelectItem>
                                  <SelectItem value="KG">KG</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input placeholder="Enter Value" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Wagon Gross Weight</Label>
                            <div className="flex items-center gap-2">
                              <Select defaultValue="TON">
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="TON">TON</SelectItem>
                                  <SelectItem value="KG">KG</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input placeholder="Enter Value" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Wagon Length</Label>
                            <div className="flex items-center gap-2">
                              <Select defaultValue="M">
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="M">M</SelectItem>
                                  <SelectItem value="FT">FT</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input placeholder="Enter Value" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">Wagon Sequence</Label>
                          <Input placeholder="Enter Wagon Sequence" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Container Details */}
              <div className="border rounded-lg bg-card">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleSection('container')}
                >
                  <div className="flex items-center gap-2">
                    <ContainerIcon className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold">Container Details</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-teal-50 text-teal-600 border-teal-200">
                      Container {containerCount}
                    </Badge>
                    {expandedSections.container ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedSections.container && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <Separator />
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Container Type</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="20ft">20ft Standard</SelectItem>
                                <SelectItem value="40ft">40ft Standard</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Container ID</Label>
                            <Input placeholder="Enter ID" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Container Quantity</Label>
                            <div className="flex items-center gap-2">
                              <Select defaultValue="EA">
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="EA">EA</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input type="number" value={containerCount} onChange={(e) => setContainerCount(e.target.value)} />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Container Tare Weight</Label>
                            <div className="flex items-center gap-2">
                              <Select defaultValue="TON">
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="TON">TON</SelectItem>
                                  <SelectItem value="KG">KG</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input placeholder="Enter Value" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Container Load Weight</Label>
                            <div className="flex items-center gap-2">
                              <Select defaultValue="TON">
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="TON">TON</SelectItem>
                                  <SelectItem value="KG">KG</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input placeholder="Enter Value" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Product Details */}
              <div className="border rounded-lg bg-card">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleSection('product')}
                >
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-pink-600" />
                    <h3 className="font-semibold">Product Details</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                      Wheat Muslin
                    </Badge>
                    {expandedSections.product ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedSections.product && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <Separator />
                      <div className="p-4 space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="hazardous"
                            checked={hazardousGoods}
                            onCheckedChange={setHazardousGoods}
                          />
                          <Label htmlFor="hazardous" className="text-sm cursor-pointer">
                            Contain Hazardous Goods
                          </Label>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">NHM</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select NHM" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="nhm1">NHM 1</SelectItem>
                                <SelectItem value="nhm2">NHM 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Product ID</Label>
                            <Input value="Wheat Muslin" readOnly />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Product Quantity</Label>
                            <div className="flex items-center gap-2">
                              <Select defaultValue="EA">
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="EA">EA</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input placeholder="Enter Value" />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Class of Stores</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Class of Stores" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="class1">Class 1</SelectItem>
                                <SelectItem value="class2">Class 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">UN Code</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Code" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="un1">UN 1</SelectItem>
                                <SelectItem value="un2">UN 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">DG Class</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Class" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="dg1">DG 1</SelectItem>
                                <SelectItem value="dg2">DG 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* THU Details */}
              <div className="border rounded-lg bg-card">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleSection('thu')}
                >
                  <div className="flex items-center gap-2">
                    <Box className="h-5 w-5 text-cyan-600" />
                    <h3 className="font-semibold">THU Details</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-cyan-50 text-cyan-600 border-cyan-200">
                      THU {thuCount}
                    </Badge>
                    {expandedSections.thu ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedSections.thu && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <Separator />
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">THU ID</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Class of Stores" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="thu1">THU 1</SelectItem>
                                <SelectItem value="thu2">THU 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">THU Serial No.</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Code" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="serial1">Serial 1</SelectItem>
                                <SelectItem value="serial2">Serial 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">THU Quantity</Label>
                            <div className="flex items-center gap-2">
                              <Select defaultValue="EA">
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="EA">EA</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input placeholder="Enter Value" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">THU Weight</Label>
                          <div className="flex items-center gap-2">
                            <Select defaultValue="TON">
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="TON">TON</SelectItem>
                                <SelectItem value="KG">KG</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input placeholder="Enter Value" className="flex-1" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Journey and Scheduling Details */}
              <div className="border rounded-lg bg-card">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleSection('journey')}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">Journey and Scheduling Details</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                      10-Mar-2025
                    </Badge>
                    {expandedSections.journey ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedSections.journey && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <Separator />
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Departure</Label>
                            <Select defaultValue="frankfurt-a">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="frankfurt-a">Frankfurt Station Point A</SelectItem>
                                <SelectItem value="frankfurt-b">Frankfurt Station Point B</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Arrival</Label>
                            <Select defaultValue="frankfurt-b">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="frankfurt-a">Frankfurt Station Point A</SelectItem>
                                <SelectItem value="frankfurt-b">Frankfurt Station Point B</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Activity Location</Label>
                            <div className="relative">
                              <Input placeholder="Search Location" className="pr-8" />
                              <svg className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Activity</Label>
                            <Select defaultValue="loading">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="loading">Loading</SelectItem>
                                <SelectItem value="unloading">Unloading</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Planned Date and Time</Label>
                            <Input type="date" defaultValue="2025-03-10" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Rev. Planned Date and Time</Label>
                            <Input type="date" defaultValue="2025-03-10" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Train No.</Label>
                            <Input placeholder="Enter Train No." />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Load Type</Label>
                            <RadioGroup value={loadType} onValueChange={setLoadType} className="flex items-center gap-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="loaded" id="loaded" />
                                <Label htmlFor="loaded" className="cursor-pointer font-normal">
                                  Loaded
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="empty" id="empty" />
                                <Label htmlFor="empty" className="cursor-pointer font-normal">
                                  Empty
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other Details */}
              <div className="border rounded-lg bg-card">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleSection('other')}
                >
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold">Other Details</h3>
                  </div>
                  {expandedSections.other ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>

                <AnimatePresence>
                  {expandedSections.other && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <Separator />
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">From Date</Label>
                            <Input type="date" defaultValue="2025-03-12" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">From Time</Label>
                            <Input type="time" defaultValue="08:00:00" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">To Date</Label>
                            <Input type="date" defaultValue="2025-03-12" />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">To Time</Label>
                            <Input type="time" defaultValue="08:00:00" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">QC Userdefined 1</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="QC" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="qc1">QC 1</SelectItem>
                                <SelectItem value="qc2">QC 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">QC Userdefined 2</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="QC" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="qc1">QC 1</SelectItem>
                                <SelectItem value="qc2">QC 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">QC Userdefined 3</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="QC" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="qc1">QC 1</SelectItem>
                                <SelectItem value="qc2">QC 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Remarks 1</Label>
                            <Input placeholder="Enter Remarks" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Remarks 2</Label>
                            <Input placeholder="Enter Remarks" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">Remarks 3</Label>
                          <Input placeholder="Enter Remarks" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="border-t p-4 flex items-center justify-end gap-2">
            <Button variant="outline">Move to Transshipment</Button>
            <Button>Save Actual Details</Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
