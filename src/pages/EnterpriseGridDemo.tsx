import React, { useState, useMemo } from 'react';
import { SmartGrid } from '@/components/SmartGrid';
import { GridColumnConfig, GridPlugin } from '@/types/smartgrid';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock space mission data similar to AG Grid example
const generateMissionData = () => {
  const missions = [
    'CRS SpX-25', 'LARES 2 & Cubesats', 'Wise One Looks Ahead (NROL-162)', 
    'TROPICS Flight 1', 'Starlink Group 3-1', 'Starlink Group 4-21', 
    'DS-EO, NeuSAR, SBUDNIC & Others', 'SES-22', 'CAPSTONE', 
    'Measat-3d & GSAT-24', 'Globalstar FM15', 'SARah 1', 
    'Starlink Group 4-18', 'Nilesat-301', 'Progress MS-20',
    'Transporter 5', 'Starlink Group 4-19', 'Starlink Group 4-23',
    'Starlink Group 4-20', 'There and Back Again', 'SpaceX Crew-4'
  ];

  const companies = [
    { name: 'SpaceX', logo: '🚀' },
    { name: 'ESA', logo: '🛰️' },
    { name: 'Rocket Lab', logo: '🔬' },
    { name: 'Astra', logo: '⭐' },
    { name: 'ISRO', logo: '🇮🇳' },
    { name: 'Arianespace', logo: '🇪🇺' },
    { name: 'Roscosmos', logo: '🇷🇺' }
  ];

  const locations = [
    'LC-39A, Kennedy Space Center, Florida, USA',
    'ELV-1, Guiana Space Centre, French Guiana, France',
    'Rocket Lab LC-1A, Māhia Peninsula, New Zealand',
    'SLC-46, Cape Canaveral SFS, Florida, USA',
    'SLC-4E, Vandenberg SFB, California, USA',
    'SLC-40, Cape Canaveral SFS, Florida, USA',
    'Second Launch Pad, Satish Dhawan Space Centre, India',
    'Rocket Lab LC-1B, Māhia Peninsula, New Zealand',
    'ELA-3, Guiana Space Centre, French Guiana, France',
    'Site 31/6, Baikonur Cosmodrome, Kazakhstan'
  ];

  const rockets = [
    'Falcon 9 Block 5', 'Vega C', 'Electron/Curie', 'Rocket 3',
    'PSLV-CA', 'Electron/Photon', 'Ariane 5 ECA', 'Soyuz 2.1a'
  ];

  const data = [];
  for (let i = 0; i < 1375; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const isSuccessful = Math.random() > 0.15; // 85% success rate
    
    data.push({
      id: i + 1,
      mission: missions[Math.floor(Math.random() * missions.length)] + (i > 20 ? ` ${i}` : ''),
      company: company.name,
      companyLogo: company.logo,
      location: locations[Math.floor(Math.random() * locations.length)],
      date: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      price: `£${(Math.random() * 25000000 + 1000000).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`,
      priceValue: Math.random() * 25000000 + 1000000,
      successful: isSuccessful,
      rocket: rockets[Math.floor(Math.random() * rockets.length)]
    });
  }
  
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export default function EnterpriseGridDemo() {
  const [data] = useState(generateMissionData());
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const columns: GridColumnConfig[] = [
    {
      key: 'mission',
      label: 'Mission',
      type: 'Text',
      sortable: true,
      filterable: true,
      width: 200
    },
    {
      key: 'company',
      label: 'Company',
      type: 'Text',
      sortable: true,
      filterable: true,
      width: 150,
    },
    {
      key: 'location',
      label: 'Location',
      type: 'Text',
      sortable: true,
      filterable: true,
      width: 300
    },
    {
      key: 'date',
      label: 'Date',
      type: 'Text',
      sortable: true,
      filterable: true,
      width: 180
    },
    {
      key: 'price',
      label: 'Price',
      type: 'Text',
      sortable: true,
      filterable: true,
      width: 150
    },
    {
      key: 'successful',
      label: 'Successful',
      type: 'Badge',
      sortable: true,
      filterable: true,
      width: 120,
      statusMap: {
        'true': 'bg-green-100 text-green-700 border-green-300',
        'false': 'bg-red-100 text-red-700 border-red-300'
      }
    },
    {
      key: 'rocket',
      label: 'Rocket',
      type: 'Text',
      sortable: true,
      filterable: true,
      width: 180
    }
  ];

  // Custom plugin for bulk actions
  const bulkActionsPlugin: GridPlugin = {
    id: 'bulk-actions',
    name: 'Bulk Actions',
    toolbar: (api) => {
      const selectedCount = api.selectedRows.length;
      
      if (selectedCount === 0) return null;
      
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm font-medium text-blue-900">
            {selectedCount} row{selectedCount !== 1 ? 's' : ''} selected
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              toast({
                title: "Export Selected",
                description: `Exporting ${selectedCount} missions...`
              });
            }}
            className="h-8"
          >
            <Download className="h-3 w-3 mr-1" />
            Export Selected
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              api.actions.clearSelection();
              toast({
                title: "Selection Cleared",
                description: "All selections have been cleared"
              });
            }}
            className="h-8"
          >
            Clear Selection
          </Button>
        </div>
      );
    }
  };

  // Statistics plugin
  const statisticsPlugin: GridPlugin = {
    id: 'statistics',
    name: 'Statistics',
    footer: (api) => {
      const total = api.filteredData.length;
      const successful = api.filteredData.filter(row => row.successful).length;
      const failed = total - successful;
      const successRate = total > 0 ? ((successful / total) * 100).toFixed(1) : '0';
      
      const totalValue = api.filteredData.reduce((sum, row) => sum + (row.priceValue || 0), 0);
      const avgValue = total > 0 ? totalValue / total : 0;

      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 border-t">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Total Missions</div>
            <div className="text-2xl font-bold">{total.toLocaleString()}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Successful</div>
            <div className="text-2xl font-bold text-green-600">{successful.toLocaleString()}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Success Rate</div>
            <div className="text-2xl font-bold">{successRate}%</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Avg Value</div>
            <div className="text-2xl font-bold">
              £{avgValue.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>
      );
    }
  };

  const handleRefreshData = () => {
    toast({
      title: "Data Refreshed",
      description: "Grid data has been refreshed"
    });
  };

  // Custom row styling for failed missions
  const rowClassName = (row: any) => {
    if (!row.successful) {
      return 'bg-red-50/50 hover:bg-red-100/50';
    }
    return '';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Space Mission Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive grid with 1,375 space missions • Advanced filtering, sorting & selection
          </p>
        </div>
        <Button onClick={handleRefreshData} variant="outline">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Total Records</div>
            <div className="text-2xl font-bold">{data.length.toLocaleString()}</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Companies</div>
            <div className="text-2xl font-bold">7</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Launch Sites</div>
            <div className="text-2xl font-bold">10</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Selected Rows</div>
            <div className="text-2xl font-bold text-blue-600">{selectedRows.size}</div>
          </div>
        </Card>
      </div>

      <Card>
        <SmartGrid
          columns={columns}
          data={data}
          paginationMode="pagination"
          plugins={[bulkActionsPlugin, statisticsPlugin]}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          rowClassName={rowClassName}
          gridTitle="Space Missions Database"
          recordCount={data.length}
        />
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Features Demonstrated</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Badge variant="outline">Data</Badge>
              Large Dataset
            </h4>
            <p className="text-sm text-muted-foreground">
              1,375 records with efficient rendering and pagination
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Badge variant="outline">Filtering</Badge>
              Column Filters
            </h4>
            <p className="text-sm text-muted-foreground">
              Advanced filtering on all columns with multiple operators
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Badge variant="outline">Sorting</Badge>
              Multi-Column Sort
            </h4>
            <p className="text-sm text-muted-foreground">
              Click column headers to sort data ascending/descending
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Badge variant="outline">Selection</Badge>
              Row Selection
            </h4>
            <p className="text-sm text-muted-foreground">
              Checkbox-based selection with bulk actions
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Badge variant="outline">Export</Badge>
              Data Export
            </h4>
            <p className="text-sm text-muted-foreground">
              Export to CSV, Excel, or JSON formats
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Badge variant="outline">Plugins</Badge>
              Extensible
            </h4>
            <p className="text-sm text-muted-foreground">
              Custom plugins for bulk actions and statistics
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Badge variant="outline">Styling</Badge>
              Conditional Formatting
            </h4>
            <p className="text-sm text-muted-foreground">
              Custom row styles based on data (failed missions highlighted)
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Badge variant="outline">Performance</Badge>
              Optimized
            </h4>
            <p className="text-sm text-muted-foreground">
              Virtual scrolling and efficient re-rendering
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Badge variant="outline">Responsive</Badge>
              Mobile Ready
            </h4>
            <p className="text-sm text-muted-foreground">
              Adapts to different screen sizes and devices
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold mb-2 text-blue-900">💡 Pro Tip</h3>
        <p className="text-sm text-blue-800">
          Try selecting multiple rows using checkboxes, then use the bulk actions toolbar that appears. 
          You can also click column headers to sort, use the filter button to refine data, 
          and check the statistics footer for real-time analytics.
        </p>
      </Card>
    </div>
  );
}
