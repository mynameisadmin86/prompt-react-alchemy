import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronDown, ChevronUp, Truck, Container as ContainerIcon, Package, Box, Calendar, Info, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePlanActualStore } from '@/stores/planActualStore';

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
  const navigate = useNavigate();
  const { wagonItems, activeWagonId, setActiveWagon, getWagonData } = usePlanActualStore();
  
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

  const handleItemClick = (item: WagonItem) => {
    setActiveWagon(item.id);
  };

  // Get current wagon's planned data
  const currentWagonData = activeWagonId ? getWagonData(activeWagonId) : null;
  const plannedData = currentWagonData?.planned || {};

  const handleNavigateToActuals = () => {
    navigate('/actuals-details');
  };

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
                onClick={() => handleItemClick(item)}
                className={cn(
                  "p-3 border rounded-md bg-card hover:bg-accent/50 transition-colors cursor-pointer",
                  item.checked && "border-primary bg-accent",
                  activeWagonId === item.id && "ring-2 ring-primary"
                )}
              >
                <div className="flex items-start gap-2">
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => toggleItemCheck(item.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-sm text-blue-600">{item.name}</div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-5 w-5 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
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
          {/* Header with Actuals Button */}
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Planned Details</h3>
            <Button 
              onClick={handleNavigateToActuals}
              className="gap-2"
            >
              View Actuals
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Wagon Details - Planned */}
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
                      Wagon 1
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
                      <div className="p-4">
                        <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Wagon Type</div>
                            <div className="text-sm font-medium">Habbins</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Wagon ID</div>
                            <div className="text-sm font-medium">HAB3243</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Wagon Quantity</div>
                            <div className="text-sm font-medium">1 EA</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Wagon Tare Weight</div>
                            <div className="text-sm font-medium">100 TON</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Wagon Gross Weight</div>
                            <div className="text-sm font-medium">100 TON</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Wagon Length</div>
                            <div className="text-sm font-medium">2139 M</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Wagon Sequence</div>
                            <div className="text-sm font-medium">1A</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Container Details - Planned */}
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
                      Container 1
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
                      <div className="p-4">
                        <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Container Type</div>
                            <div className="text-sm font-medium">Container A</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Container ID</div>
                            <div className="text-sm font-medium">CONT3243</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Container Quantity</div>
                            <div className="text-sm font-medium">1 EA</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Container Tare Weight</div>
                            <div className="text-sm font-medium">100 TON</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Container Load Weight</div>
                            <div className="text-sm font-medium">100 TON</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Product Details - Planned */}
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
                      <div className="p-4">
                        <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Hazardous Goods</div>
                            <div className="text-sm font-medium">Yes</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">NHM</div>
                            <div className="text-sm font-medium">2WQ1E32R43</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Product ID</div>
                            <div className="text-sm font-medium">Wheat Muslin</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Product Quantity</div>
                            <div className="text-sm font-medium">100 TON</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Class of Stores</div>
                            <div className="text-sm font-medium">Class A</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">UN Code</div>
                            <div className="text-sm font-medium">2432</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">DG Class</div>
                            <div className="text-sm font-medium">AAA</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* THU Details - Planned */}
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
                      THU 5
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
                      <div className="p-4">
                        <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">THU ID</div>
                            <div className="text-sm font-medium">THU329847</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">THU Serial No.</div>
                            <div className="text-sm font-medium">TH23300000/2025</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">THU Quantity</div>
                            <div className="text-sm font-medium">10 EA</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">THU Weight</div>
                            <div className="text-sm font-medium">10 TON</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Journey and Scheduling Details - Planned */}
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
                      <div className="p-4">
                        <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Departure</div>
                            <div className="text-sm font-medium">Frankfurt Station Point A</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Arrival</div>
                            <div className="text-sm font-medium">Frankfurt Station Point B</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Activity Location</div>
                            <div className="text-sm font-medium">Frankfurt Station</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Activity</div>
                            <div className="text-sm font-medium">Loading</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Planned Date and Time</div>
                            <div className="text-sm font-medium">10-Mar-2025 10:00 AM</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Rev. Planned Date and Time</div>
                            <div className="text-sm font-medium">10-Mar-2025 10:00 AM</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Train No.</div>
                            <div className="text-sm font-medium">---</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Load Type</div>
                            <div className="text-sm font-medium">Loaded</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other Details - Planned */}
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
                      <div className="p-4">
                        <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">From Date and Time</div>
                            <div className="text-sm font-medium">12-Mar-2025 08:00 AM</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">To Date and Time</div>
                            <div className="text-sm font-medium">12-Mar-2025 08:00 AM</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">QC Userdefined 1</div>
                            <div className="text-sm font-medium">---</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">QC Userdefined 2</div>
                            <div className="text-sm font-medium">---</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">QC Userdefined 3</div>
                            <div className="text-sm font-medium">---</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Remarks 1</div>
                            <div className="text-sm font-medium">---</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Remarks 2</div>
                            <div className="text-sm font-medium">---</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Remarks 3</div>
                            <div className="text-sm font-medium">---</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="actuals" className="flex-1 m-0 overflow-y-auto p-6 space-y-4">
              {/* Wagon Details */}
              <DynamicPanel
                key={`wagon-${activeWagonId}`}
                panelId="wagon-details"
                panelTitle="Wagon Details"
                panelConfig={{
                  wagonType: {
                    id: 'wagonType',
                    label: 'Wagon Type',
                    fieldType: 'lazyselect',
                    value: actualsData.wagonType || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 1,
                    width: 'third',
                    fetchOptions: async ({ searchTerm, offset, limit }) => {
                      const allOptions = [
                        { label: 'Habbins', value: 'habbins' },
                        { label: 'Zaccs', value: 'zaccs' },
                        { label: 'A Type Wagon', value: 'a-type' },
                        { label: 'Closed Wagon', value: 'closed' },
                      ];
                      const filtered = searchTerm
                        ? allOptions.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
                        : allOptions;
                      return filtered.slice(offset, offset + limit);
                    },
                  },
                  wagonId: {
                    id: 'wagonId',
                    label: 'Wagon ID',
                    fieldType: 'search',
                    value: actualsData.wagonId || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 2,
                    width: 'third',
                    placeholder: 'Search Wagon ID',
                  },
                  wagonQuantity: {
                    id: 'wagonQuantity',
                    label: 'Wagon Quantity',
                    fieldType: 'text',
                    value: actualsData.wagonQuantity || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 3,
                    width: 'third',
                    placeholder: 'Enter quantity',
                  },
                  wagonQuantityUnit: {
                    id: 'wagonQuantityUnit',
                    label: 'Unit',
                    fieldType: 'select',
                    value: actualsData.wagonQuantityUnit || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 4,
                    width: 'third',
                    options: [
                      { label: 'EA', value: 'EA' },
                      { label: 'KG', value: 'KG' },
                    ],
                  },
                  wagonTareWeight: {
                    id: 'wagonTareWeight',
                    label: 'Wagon Tare Weight',
                    fieldType: 'currency',
                    value: actualsData.wagonTareWeight || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 5,
                    width: 'third',
                    placeholder: 'Enter weight',
                  },
                  wagonTareWeightUnit: {
                    id: 'wagonTareWeightUnit',
                    label: 'Unit',
                    fieldType: 'select',
                    value: actualsData.wagonTareWeightUnit || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 6,
                    width: 'third',
                    options: [
                      { label: 'TON', value: 'TON' },
                      { label: 'KG', value: 'KG' },
                    ],
                  },
                  wagonGrossWeight: {
                    id: 'wagonGrossWeight',
                    label: 'Wagon Gross Weight',
                    fieldType: 'currency',
                    value: actualsData.wagonGrossWeight || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 7,
                    width: 'third',
                    placeholder: 'Enter weight',
                  },
                  wagonGrossWeightUnit: {
                    id: 'wagonGrossWeightUnit',
                    label: 'Unit',
                    fieldType: 'select',
                    value: actualsData.wagonGrossWeightUnit || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 8,
                    width: 'third',
                    options: [
                      { label: 'TON', value: 'TON' },
                      { label: 'KG', value: 'KG' },
                    ],
                  },
                  wagonLength: {
                    id: 'wagonLength',
                    label: 'Wagon Length',
                    fieldType: 'currency',
                    value: actualsData.wagonLength || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 9,
                    width: 'third',
                    placeholder: 'Enter length',
                  },
                  wagonLengthUnit: {
                    id: 'wagonLengthUnit',
                    label: 'Unit',
                    fieldType: 'select',
                    value: actualsData.wagonLengthUnit || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 10,
                    width: 'third',
                    options: [
                      { label: 'M', value: 'M' },
                      { label: 'FT', value: 'FT' },
                    ],
                  },
                  wagonSequence: {
                    id: 'wagonSequence',
                    label: 'Wagon Sequence',
                    fieldType: 'text',
                    value: actualsData.wagonSequence || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 11,
                    width: 'third',
                    placeholder: 'Enter sequence',
                  },
                } as PanelConfig}
                initialData={actualsData}
                onDataChange={(data) => updateCurrentActuals(data)}
                className="border-0 shadow-none"
              />

              {/* Container Details */}
              <DynamicPanel
                key={`container-${activeWagonId}`}
                panelId="container-details"
                panelTitle="Container Details"
                panelConfig={{
                  containerType: {
                    id: 'containerType',
                    label: 'Container Type',
                    fieldType: 'select',
                    value: actualsData.containerType || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 1,
                    width: 'third',
                    options: [
                      { label: '20ft Standard', value: '20ft' },
                      { label: '40ft Standard', value: '40ft' },
                      { label: 'Container A', value: 'container-a' },
                    ],
                  },
                  containerId: {
                    id: 'containerId',
                    label: 'Container ID',
                    fieldType: 'search',
                    value: actualsData.containerId || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 2,
                    width: 'third',
                    placeholder: 'Search Container ID',
                  },
                  containerQuantity: {
                    id: 'containerQuantity',
                    label: 'Container Quantity',
                    fieldType: 'text',
                    value: actualsData.containerQuantity || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 3,
                    width: 'third',
                    placeholder: 'Enter quantity',
                  },
                  containerQuantityUnit: {
                    id: 'containerQuantityUnit',
                    label: 'Unit',
                    fieldType: 'select',
                    value: actualsData.containerQuantityUnit || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 4,
                    width: 'third',
                    options: [{ label: 'EA', value: 'EA' }],
                  },
                  containerTareWeight: {
                    id: 'containerTareWeight',
                    label: 'Container Tare Weight',
                    fieldType: 'currency',
                    value: actualsData.containerTareWeight || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 5,
                    width: 'third',
                    placeholder: 'Enter weight',
                  },
                  containerTareWeightUnit: {
                    id: 'containerTareWeightUnit',
                    label: 'Unit',
                    fieldType: 'select',
                    value: actualsData.containerTareWeightUnit || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 6,
                    width: 'third',
                    options: [
                      { label: 'TON', value: 'TON' },
                      { label: 'KG', value: 'KG' },
                    ],
                  },
                  containerLoadWeight: {
                    id: 'containerLoadWeight',
                    label: 'Container Load Weight',
                    fieldType: 'currency',
                    value: actualsData.containerLoadWeight || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 7,
                    width: 'third',
                    placeholder: 'Enter weight',
                  },
                  containerLoadWeightUnit: {
                    id: 'containerLoadWeightUnit',
                    label: 'Unit',
                    fieldType: 'select',
                    value: actualsData.containerLoadWeightUnit || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 8,
                    width: 'third',
                    options: [
                      { label: 'TON', value: 'TON' },
                      { label: 'KG', value: 'KG' },
                    ],
                  },
                } as PanelConfig}
                initialData={actualsData}
                onDataChange={(data) => updateCurrentActuals(data)}
                className="border-0 shadow-none"
              />

              {/* Product Details */}
              <DynamicPanel
                key={`product-${activeWagonId}`}
                panelId="product-details"
                panelTitle="Product Details"
                panelConfig={{
                  hazardousGoods: {
                    id: 'hazardousGoods',
                    label: 'Hazardous Goods',
                    fieldType: 'radio',
                    value: actualsData.hazardousGoods ? 'yes' : 'no',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 1,
                    width: 'third',
                    options: [
                      { label: 'Yes', value: 'yes' },
                      { label: 'No', value: 'no' },
                    ],
                  },
                  nhm: {
                    id: 'nhm',
                    label: 'NHM',
                    fieldType: 'select',
                    value: actualsData.nhm || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 2,
                    width: 'third',
                    options: [
                      { label: '2WQ1E32R43', value: '2WQ1E32R43' },
                      { label: 'NHM 1', value: 'nhm1' },
                      { label: 'NHM 2', value: 'nhm2' },
                    ],
                  },
                  productId: {
                    id: 'productId',
                    label: 'Product ID',
                    fieldType: 'text',
                    value: actualsData.productId || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 3,
                    width: 'third',
                    placeholder: 'Enter Product ID',
                  },
                  productQuantity: {
                    id: 'productQuantity',
                    label: 'Product Quantity',
                    fieldType: 'text',
                    value: actualsData.productQuantity || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 4,
                    width: 'third',
                    placeholder: 'Enter quantity',
                  },
                  productQuantityUnit: {
                    id: 'productQuantityUnit',
                    label: 'Unit',
                    fieldType: 'select',
                    value: actualsData.productQuantityUnit || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 5,
                    width: 'third',
                    options: [
                      { label: 'TON', value: 'TON' },
                      { label: 'EA', value: 'EA' },
                      { label: 'KG', value: 'KG' },
                    ],
                  },
                  classOfStores: {
                    id: 'classOfStores',
                    label: 'Class of Stores',
                    fieldType: 'select',
                    value: actualsData.classOfStores || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 6,
                    width: 'third',
                    options: [
                      { label: 'Class A', value: 'class-a' },
                      { label: 'Class 1', value: 'class1' },
                      { label: 'Class 2', value: 'class2' },
                    ],
                  },
                  unCode: {
                    id: 'unCode',
                    label: 'UN Code',
                    fieldType: 'select',
                    value: actualsData.unCode || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 7,
                    width: 'third',
                    options: [
                      { label: '2432', value: '2432' },
                      { label: 'UN 1', value: 'un1' },
                      { label: 'UN 2', value: 'un2' },
                    ],
                  },
                  dgClass: {
                    id: 'dgClass',
                    label: 'DG Class',
                    fieldType: 'select',
                    value: actualsData.dgClass || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 8,
                    width: 'third',
                    options: [
                      { label: 'AAA', value: 'AAA' },
                      { label: 'DG 1', value: 'dg1' },
                      { label: 'DG 2', value: 'dg2' },
                    ],
                  },
                } as PanelConfig}
                initialData={actualsData}
                onDataChange={(data) => updateCurrentActuals(data)}
                className="border-0 shadow-none"
              />

              {/* THU Details */}
              <DynamicPanel
                key={`thu-${activeWagonId}`}
                panelId="thu-details"
                panelTitle="THU Details"
                panelConfig={{
                  thuId: {
                    id: 'thuId',
                    label: 'THU ID',
                    fieldType: 'select',
                    value: actualsData.thuId || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 1,
                    width: 'third',
                    options: [
                      { label: 'THU329847', value: 'THU329847' },
                      { label: 'THU 1', value: 'thu1' },
                      { label: 'THU 2', value: 'thu2' },
                    ],
                  },
                  thuQuantity: {
                    id: 'thuQuantity',
                    label: 'THU Quantity',
                    fieldType: 'text',
                    value: actualsData.thuQuantity || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 2,
                    width: 'third',
                    placeholder: 'Enter quantity',
                  },
                  thuQuantityUnit: {
                    id: 'thuQuantityUnit',
                    label: 'Unit',
                    fieldType: 'select',
                    value: actualsData.thuQuantityUnit || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 3,
                    width: 'third',
                    options: [{ label: 'EA', value: 'EA' }],
                  },
                  thuGrossWeight: {
                    id: 'thuGrossWeight',
                    label: 'THU Gross Weight',
                    fieldType: 'currency',
                    value: actualsData.thuGrossWeight || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 4,
                    width: 'third',
                    placeholder: 'Enter weight',
                  },
                  thuGrossWeightUnit: {
                    id: 'thuGrossWeightUnit',
                    label: 'Unit',
                    fieldType: 'select',
                    value: actualsData.thuGrossWeightUnit || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 5,
                    width: 'third',
                    options: [
                      { label: 'TON', value: 'TON' },
                      { label: 'KG', value: 'KG' },
                    ],
                  },
                  thuTareWeight: {
                    id: 'thuTareWeight',
                    label: 'THU Tare Weight',
                    fieldType: 'currency',
                    value: actualsData.thuTareWeight || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 6,
                    width: 'third',
                    placeholder: 'Enter weight',
                  },
                  thuTareWeightUnit: {
                    id: 'thuTareWeightUnit',
                    label: 'Unit',
                    fieldType: 'select',
                    value: actualsData.thuTareWeightUnit || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 7,
                    width: 'third',
                    options: [
                      { label: 'TON', value: 'TON' },
                      { label: 'KG', value: 'KG' },
                    ],
                  },
                  thuNetWeight: {
                    id: 'thuNetWeight',
                    label: 'THU Net Weight',
                    fieldType: 'currency',
                    value: actualsData.thuNetWeight || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 8,
                    width: 'third',
                    placeholder: 'Enter weight',
                  },
                  thuNetWeightUnit: {
                    id: 'thuNetWeightUnit',
                    label: 'Unit',
                    fieldType: 'select',
                    value: actualsData.thuNetWeightUnit || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 9,
                    width: 'third',
                    options: [
                      { label: 'TON', value: 'TON' },
                      { label: 'KG', value: 'KG' },
                    ],
                  },
                  thuLength: {
                    id: 'thuLength',
                    label: 'THU Length',
                    fieldType: 'currency',
                    value: actualsData.thuLength || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 10,
                    width: 'third',
                    placeholder: 'Enter length',
                  },
                  thuWidth: {
                    id: 'thuWidth',
                    label: 'THU Width',
                    fieldType: 'currency',
                    value: actualsData.thuWidth || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 11,
                    width: 'third',
                    placeholder: 'Enter width',
                  },
                  thuHeight: {
                    id: 'thuHeight',
                    label: 'THU Height',
                    fieldType: 'currency',
                    value: actualsData.thuHeight || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 12,
                    width: 'third',
                    placeholder: 'Enter height',
                  },
                  thuDimensionUnit: {
                    id: 'thuDimensionUnit',
                    label: 'Dimension Unit',
                    fieldType: 'select',
                    value: actualsData.thuDimensionUnit || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 13,
                    width: 'third',
                    options: [
                      { label: 'M', value: 'M' },
                      { label: 'CM', value: 'CM' },
                    ],
                  },
                } as PanelConfig}
                initialData={actualsData}
                onDataChange={(data) => updateCurrentActuals(data)}
                className="border-0 shadow-none"
              />

              {/* Journey and Scheduling Details */}
              <DynamicPanel
                key={`journey-${activeWagonId}`}
                panelId="journey-details"
                panelTitle="Journey and Scheduling Details"
                panelConfig={{
                  departure: {
                    id: 'departure',
                    label: 'Departure',
                    fieldType: 'select',
                    value: actualsData.departure || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 1,
                    width: 'half',
                    options: [
                      { label: 'Frankfurt Station Point A', value: 'frankfurt-a' },
                      { label: 'Frankfurt Station Point B', value: 'frankfurt-b' },
                    ],
                  },
                  destination: {
                    id: 'destination',
                    label: 'Destination',
                    fieldType: 'select',
                    value: actualsData.destination || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 2,
                    width: 'half',
                    options: [
                      { label: 'Frankfurt Station Point A', value: 'frankfurt-a' },
                      { label: 'Frankfurt Station Point B', value: 'frankfurt-b' },
                    ],
                  },
                  fromDate: {
                    id: 'fromDate',
                    label: 'From Date',
                    fieldType: 'date',
                    value: actualsData.fromDate || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 3,
                    width: 'third',
                  },
                  fromTime: {
                    id: 'fromTime',
                    label: 'From Time',
                    fieldType: 'time',
                    value: actualsData.fromTime || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 4,
                    width: 'third',
                  },
                  toDate: {
                    id: 'toDate',
                    label: 'To Date',
                    fieldType: 'date',
                    value: actualsData.toDate || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 5,
                    width: 'third',
                  },
                  toTime: {
                    id: 'toTime',
                    label: 'To Time',
                    fieldType: 'time',
                    value: actualsData.toTime || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 6,
                    width: 'third',
                  },
                } as PanelConfig}
                initialData={actualsData}
                onDataChange={(data) => updateCurrentActuals(data)}
                className="border-0 shadow-none"
              />

              {/* Other Details */}
              <DynamicPanel
                key={`other-${activeWagonId}`}
                panelId="other-details"
                panelTitle="Other Details"
                panelConfig={{
                  qcUserdefined1: {
                    id: 'qcUserdefined1',
                    label: 'QC Userdefined 1',
                    fieldType: 'select',
                    value: actualsData.qcUserdefined1 || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 1,
                    width: 'third',
                    options: [
                      { label: 'QC 1', value: 'qc1' },
                      { label: 'QC 2', value: 'qc2' },
                    ],
                  },
                  qcUserdefined2: {
                    id: 'qcUserdefined2',
                    label: 'QC Userdefined 2',
                    fieldType: 'select',
                    value: actualsData.qcUserdefined2 || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 2,
                    width: 'third',
                    options: [
                      { label: 'QC 1', value: 'qc1' },
                      { label: 'QC 2', value: 'qc2' },
                    ],
                  },
                  qcUserdefined3: {
                    id: 'qcUserdefined3',
                    label: 'QC Userdefined 3',
                    fieldType: 'select',
                    value: actualsData.qcUserdefined3 || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 3,
                    width: 'third',
                    options: [
                      { label: 'QC 1', value: 'qc1' },
                      { label: 'QC 2', value: 'qc2' },
                    ],
                  },
                  remarks1: {
                    id: 'remarks1',
                    label: 'Remarks 1',
                    fieldType: 'textarea',
                    value: actualsData.remarks1 || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 4,
                    width: 'full',
                    placeholder: 'Enter remarks',
                  },
                  remarks2: {
                    id: 'remarks2',
                    label: 'Remarks 2',
                    fieldType: 'textarea',
                    value: actualsData.remarks2 || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 5,
                    width: 'full',
                    placeholder: 'Enter remarks',
                  },
                  remarks3: {
                    id: 'remarks3',
                    label: 'Remarks 3',
                    fieldType: 'textarea',
                    value: actualsData.remarks3 || '',
                    mandatory: false,
                    visible: true,
                    editable: true,
                    order: 6,
                    width: 'full',
                    placeholder: 'Enter remarks',
                  },
                } as PanelConfig}
                initialData={actualsData}
                onDataChange={(data) => updateCurrentActuals(data)}
                className="border-0 shadow-none"
              />
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
