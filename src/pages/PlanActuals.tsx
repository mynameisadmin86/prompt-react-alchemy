import { useState } from 'react';
import { SimpleDynamicPanel } from '@/components/DynamicPanel/SimpleDynamicPanel';
import { PanelFieldConfig } from '@/types/dynamicPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Edit, Copy, Plus, X } from 'lucide-react';
import { usePlanActualStore } from '@/stores/planActualStore';

const PlanActuals = () => {
  const { wagonItems, activeWagonId, setActiveWagon } = usePlanActualStore();
  const [selectedTab, setSelectedTab] = useState('actuals');

  // Wagon Details Panel Configuration
  const wagonDetailsConfig: PanelFieldConfig[] = [
    {
      key: 'wagonType',
      label: 'Wagon Type',
      fieldType: 'select',
      options: [
        { value: 'type1', label: 'Type 1' },
        { value: 'type2', label: 'Type 2' },
        { value: 'type3', label: 'Type 3' },
      ],
    },
    {
      key: 'wagonId',
      label: 'Wagon ID',
      fieldType: 'text',
    },
    {
      key: 'wagonQuantity',
      label: 'Wagon Quantity',
      fieldType: 'inputdropdown',
      options: [
        { value: 'EA', label: 'EA' },
        { value: 'TON', label: 'TON' },
      ],
    },
    {
      key: 'wagonTareWeight',
      label: 'Wagon Tare Weight',
      fieldType: 'inputdropdown',
      options: [
        { value: 'TON', label: 'TON' },
        { value: 'KG', label: 'KG' },
      ],
    },
    {
      key: 'wagonGrossWeight',
      label: 'Wagon Gross Weight',
      fieldType: 'inputdropdown',
      options: [
        { value: 'TON', label: 'TON' },
        { value: 'KG', label: 'KG' },
      ],
    },
    {
      key: 'wagonLength',
      label: 'Wagon Length',
      fieldType: 'inputdropdown',
      options: [
        { value: 'M', label: 'M' },
        { value: 'FT', label: 'FT' },
      ],
    },
    {
      key: 'wagonSequence',
      label: 'Wagon Sequence',
      fieldType: 'text',
    },
  ];

  // Container Details Panel Configuration
  const containerDetailsConfig: PanelFieldConfig[] = [
    {
      key: 'containerType',
      label: 'Container Type',
      fieldType: 'select',
      options: [
        { value: 'type1', label: 'Type 1' },
        { value: 'type2', label: 'Type 2' },
      ],
    },
    {
      key: 'containerId',
      label: 'Container ID',
      fieldType: 'text',
    },
    {
      key: 'containerQuantity',
      label: 'Container Quantity',
      fieldType: 'inputdropdown',
      options: [
        { value: 'EA', label: 'EA' },
        { value: 'TON', label: 'TON' },
      ],
    },
    {
      key: 'containerTareWeight',
      label: 'Container Tare Weight',
      fieldType: 'inputdropdown',
      options: [
        { value: 'TON', label: 'TON' },
        { value: 'KG', label: 'KG' },
      ],
    },
    {
      key: 'containerLoadWeight',
      label: 'Container Load Weight',
      fieldType: 'inputdropdown',
      options: [
        { value: 'TON', label: 'TON' },
        { value: 'KG', label: 'KG' },
      ],
    },
  ];

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
            <SimpleDynamicPanel
              title="Wagon Details"
              config={wagonDetailsConfig}
              initialData={{}}
              onDataChange={(data) => console.log('Planned wagon data:', data)}
              collapsible={true}
              defaultCollapsed={false}
            />
            <SimpleDynamicPanel
              title="Container Details"
              config={containerDetailsConfig}
              initialData={{}}
              onDataChange={(data) => console.log('Planned container data:', data)}
              collapsible={true}
              defaultCollapsed={false}
            />
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
            <SimpleDynamicPanel
              title="Wagon Details"
              config={wagonDetailsConfig}
              initialData={{}}
              onDataChange={(data) => console.log('Actuals wagon data:', data)}
              collapsible={true}
              defaultCollapsed={false}
            />

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
            <SimpleDynamicPanel
              title="Container Details"
              config={containerDetailsConfig}
              initialData={{}}
              onDataChange={(data) => console.log('Actuals container data:', data)}
              collapsible={true}
              defaultCollapsed={false}
            />
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
