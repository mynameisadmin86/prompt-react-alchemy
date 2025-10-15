import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreVertical, Edit, Copy, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { usePlanActualStore } from '@/stores/planActualStore';

const PlanActuals = () => {
  const { wagonItems, activeWagonId, setActiveWagon } = usePlanActualStore();
  const [selectedTab, setSelectedTab] = useState('actuals');
  const [wagonCollapsed, setWagonCollapsed] = useState(false);
  const [containerCollapsed, setContainerCollapsed] = useState(false);

  const wagonList = Object.entries(wagonItems).map(([id, data]) => ({
    id,
    ...data,
  }));

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Wagon List */}
      <div className="w-64 border-r border-border bg-card p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Plan and Actual Details</h2>
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2 mb-4">
          <Checkbox id="all-items" />
          <label htmlFor="all-items" className="text-sm">All Item</label>
          <div className="flex gap-1 ml-auto">
            <Button variant="default" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Wagon List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {wagonList.map((wagon) => (
            <div
              key={wagon.id}
              className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                activeWagonId === wagon.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-accent'
              }`}
              onClick={() => setActiveWagon(wagon.id)}
            >
              <Checkbox />
              <div className="flex-1">
                <div className="font-semibold text-sm">{wagon.id}</div>
                <div className="text-xs text-muted-foreground">
                  {wagon.planned.wagonType || 'Hasbins'}
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                € 1395.00
              </Badge>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Empty Item Placeholder */}
          <div className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-border">
            <Checkbox disabled />
            <span className="text-sm text-muted-foreground">--</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel - Details */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
          <div className="border-b border-border px-6 py-4 flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="planned">Planned</TabsTrigger>
              <TabsTrigger value="actuals">Actuals</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="default" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Planned Tab */}
          <TabsContent value="planned" className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Wagon Details */}
            <Collapsible open={!wagonCollapsed} onOpenChange={(open) => setWagonCollapsed(!open)}>
              <Card>
                <CardHeader className="cursor-pointer">
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <CardTitle className="text-base">Wagon Details</CardTitle>
                    {wagonCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="wagon-type">Wagon Type</Label>
                        <Select>
                          <SelectTrigger id="wagon-type">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="type1">Type 1</SelectItem>
                            <SelectItem value="type2">Type 2</SelectItem>
                            <SelectItem value="type3">Type 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="wagon-id">Wagon ID</Label>
                        <Input id="wagon-id" placeholder="Enter ID" />
                      </div>
                      <div>
                        <Label htmlFor="wagon-quantity">Wagon Quantity</Label>
                        <div className="flex gap-2">
                          <Select defaultValue="EA">
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EA">EA</SelectItem>
                              <SelectItem value="TON">TON</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input id="wagon-quantity" placeholder="1" className="flex-1" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="wagon-tare-weight">Wagon Tare Weight</Label>
                        <div className="flex gap-2">
                          <Select defaultValue="TON">
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TON">TON</SelectItem>
                              <SelectItem value="KG">KG</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input id="wagon-tare-weight" placeholder="Enter Value" className="flex-1" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="wagon-gross-weight">Wagon Gross Weight</Label>
                        <div className="flex gap-2">
                          <Select defaultValue="TON">
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TON">TON</SelectItem>
                              <SelectItem value="KG">KG</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input id="wagon-gross-weight" placeholder="Enter Value" className="flex-1" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="wagon-length">Wagon Length</Label>
                        <div className="flex gap-2">
                          <Select defaultValue="M">
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="M">M</SelectItem>
                              <SelectItem value="FT">FT</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input id="wagon-length" placeholder="Enter Value" className="flex-1" />
                        </div>
                      </div>
                      <div className="col-span-3">
                        <Label htmlFor="wagon-sequence">Wagon Sequence</Label>
                        <Input id="wagon-sequence" placeholder="Enter Wagon Sequence" />
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Container Details */}
            <Collapsible open={!containerCollapsed} onOpenChange={(open) => setContainerCollapsed(!open)}>
              <Card>
                <CardHeader className="cursor-pointer">
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <CardTitle className="text-base">Container Details</CardTitle>
                    {containerCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="container-type">Container Type</Label>
                        <Select>
                          <SelectTrigger id="container-type">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="type1">Type 1</SelectItem>
                            <SelectItem value="type2">Type 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="container-id">Container ID</Label>
                        <Input id="container-id" placeholder="Enter ID" />
                      </div>
                      <div>
                        <Label htmlFor="container-quantity">Container Quantity</Label>
                        <div className="flex gap-2">
                          <Select defaultValue="EA">
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EA">EA</SelectItem>
                              <SelectItem value="TON">TON</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input id="container-quantity" placeholder="1" className="flex-1" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="container-tare-weight">Container Tare Weight</Label>
                        <div className="flex gap-2">
                          <Select defaultValue="TON">
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TON">TON</SelectItem>
                              <SelectItem value="KG">KG</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input id="container-tare-weight" placeholder="Enter Value" className="flex-1" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="container-load-weight">Container Load Weight</Label>
                        <div className="flex gap-2">
                          <Select defaultValue="TON">
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TON">TON</SelectItem>
                              <SelectItem value="KG">KG</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input id="container-load-weight" placeholder="Enter Value" className="flex-1" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </TabsContent>

          {/* Actuals Tab */}
          <TabsContent value="actuals" className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-sm">🚃</span>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Wagon 1
                </Badge>
              </div>
            </div>
            
            {/* Wagon Details */}
            <Collapsible open={!wagonCollapsed} onOpenChange={(open) => setWagonCollapsed(!open)}>
              <Card>
                <CardHeader className="cursor-pointer">
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <CardTitle className="text-base">Wagon Details</CardTitle>
                    {wagonCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="actuals-wagon-type">Wagon Type</Label>
                        <Select>
                          <SelectTrigger id="actuals-wagon-type">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="type1">Type 1</SelectItem>
                            <SelectItem value="type2">Type 2</SelectItem>
                            <SelectItem value="type3">Type 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="actuals-wagon-id">Wagon ID</Label>
                        <Input id="actuals-wagon-id" placeholder="Enter ID" />
                      </div>
                      <div>
                        <Label htmlFor="actuals-wagon-quantity">Wagon Quantity</Label>
                        <div className="flex gap-2">
                          <Select defaultValue="EA">
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EA">EA</SelectItem>
                              <SelectItem value="TON">TON</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input id="actuals-wagon-quantity" placeholder="1" className="flex-1" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="actuals-wagon-tare-weight">Wagon Tare Weight</Label>
                        <div className="flex gap-2">
                          <Select defaultValue="TON">
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TON">TON</SelectItem>
                              <SelectItem value="KG">KG</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input id="actuals-wagon-tare-weight" placeholder="Enter Value" className="flex-1" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="actuals-wagon-gross-weight">Wagon Gross Weight</Label>
                        <div className="flex gap-2">
                          <Select defaultValue="TON">
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TON">TON</SelectItem>
                              <SelectItem value="KG">KG</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input id="actuals-wagon-gross-weight" placeholder="Enter Value" className="flex-1" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="actuals-wagon-length">Wagon Length</Label>
                        <div className="flex gap-2">
                          <Select defaultValue="M">
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="M">M</SelectItem>
                              <SelectItem value="FT">FT</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input id="actuals-wagon-length" placeholder="Enter Value" className="flex-1" />
                        </div>
                      </div>
                      <div className="col-span-3">
                        <Label htmlFor="actuals-wagon-sequence">Wagon Sequence</Label>
                        <Input id="actuals-wagon-sequence" placeholder="Enter Wagon Sequence" />
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 text-sm">📦</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Container 1
                </Badge>
              </div>
            </div>
            
            {/* Container Details */}
            <Collapsible open={!containerCollapsed} onOpenChange={(open) => setContainerCollapsed(!open)}>
              <Card>
                <CardHeader className="cursor-pointer">
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <CardTitle className="text-base">Container Details</CardTitle>
                    {containerCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="actuals-container-type">Container Type</Label>
                        <Select>
                          <SelectTrigger id="actuals-container-type">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="type1">Type 1</SelectItem>
                            <SelectItem value="type2">Type 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="actuals-container-id">Container ID</Label>
                        <Input id="actuals-container-id" placeholder="Enter ID" />
                      </div>
                      <div>
                        <Label htmlFor="actuals-container-quantity">Container Quantity</Label>
                        <div className="flex gap-2">
                          <Select defaultValue="EA">
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EA">EA</SelectItem>
                              <SelectItem value="TON">TON</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input id="actuals-container-quantity" placeholder="1" className="flex-1" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="actuals-container-tare-weight">Container Tare Weight</Label>
                        <div className="flex gap-2">
                          <Select defaultValue="TON">
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TON">TON</SelectItem>
                              <SelectItem value="KG">KG</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input id="actuals-container-tare-weight" placeholder="Enter Value" className="flex-1" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="actuals-container-load-weight">Container Load Weight</Label>
                        <div className="flex gap-2">
                          <Select defaultValue="TON">
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TON">TON</SelectItem>
                              <SelectItem value="KG">KG</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input id="actuals-container-load-weight" placeholder="Enter Value" className="flex-1" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="border-t border-border p-4 flex justify-end gap-2">
          <Button variant="outline">Move to Transshipment</Button>
          <Button variant="default">Save Actual Details</Button>
        </div>
      </div>
    </div>
  );
};

export default PlanActuals;
