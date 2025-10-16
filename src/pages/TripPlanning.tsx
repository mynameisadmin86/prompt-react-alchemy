import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Search, Package, Settings, ExternalLink, Home, ChevronRight, CalendarIcon, MapPin, Building2, Users, Truck, Calendar as CalendarIcon2, Box, UserCog, Car, UserCircle, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SmartGrid } from '@/components/SmartGrid';
import type { GridColumnConfig } from '@/types/smartgrid';

const TripPlanning = () => {
  const [tripNo, setTripNo] = useState('');
  const [location, setLocation] = useState('Forwardis GMBH');
  const [cluster, setCluster] = useState('10000406');
  const [tripType, setTripType] = useState('Normal Trip');
  const [planDate, setPlanDate] = useState<Date>(new Date(2023, 9, 12));
  const [requestSupplier, setRequestSupplier] = useState(false);
  const [customerOrderSearch, setCustomerOrderSearch] = useState('');
  const [referenceDocType, setReferenceDocType] = useState('');
  const [referenceDocNo, setReferenceDocNo] = useState('');
  const [transportMode, setTransportMode] = useState('rail');
  const [departureCode, setDepartureCode] = useState('234315');
  const [departureLocation, setDepartureLocation] = useState('Berlin Central Station');
  const [arrivalCode, setArrivalCode] = useState('52115');
  const [arrivalLocation, setArrivalLocation] = useState('Frankfurt Station');
  const [selectedOrders, setSelectedOrders] = useState<Set<number>>(new Set());
  const [consolidatedTrip, setConsolidatedTrip] = useState(true);

  const isWagonContainer = tripType === 'Wagon/Container Movement';

  // Customer Orders Grid Configuration
  const customerOrdersColumns: GridColumnConfig[] = [
    { key: 'orderNo', label: 'Order No.', type: 'Text', width: 150, editable: false },
    { key: 'customerName', label: 'Customer Name', type: 'Text', width: 200, editable: false },
    { key: 'orderDate', label: 'Order Date', type: 'Date', width: 150, editable: false },
    { key: 'deliveryDate', label: 'Delivery Date', type: 'Date', width: 150, editable: false },
    { key: 'origin', label: 'Origin', type: 'Text', width: 180, editable: false },
    { key: 'destination', label: 'Destination', type: 'Text', width: 180, editable: false },
    { key: 'weight', label: 'Weight (kg)', type: 'Text', width: 120, editable: false },
    { key: 'volume', label: 'Volume (m³)', type: 'Text', width: 120, editable: false },
    { key: 'status', label: 'Status', type: 'Badge', width: 120, editable: false, statusMap: {
      'Confirmed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Transit': 'bg-blue-100 text-blue-800',
    }},
  ];

  const customerOrdersData = [
    {
      id: '1',
      orderNo: 'ORD-2023-001',
      customerName: 'Acme Corp',
      orderDate: '2023-10-01',
      deliveryDate: '2023-10-15',
      origin: 'Berlin Central Station',
      destination: 'Frankfurt Station',
      weight: 1500,
      volume: 12.5,
      status: 'Confirmed',
    },
    {
      id: '2',
      orderNo: 'ORD-2023-002',
      customerName: 'Global Logistics GmbH',
      orderDate: '2023-10-02',
      deliveryDate: '2023-10-16',
      origin: 'Hamburg Port',
      destination: 'Munich Hub',
      weight: 2300,
      volume: 18.2,
      status: 'Pending',
    },
    {
      id: '3',
      orderNo: 'ORD-2023-003',
      customerName: 'Express Shipping Ltd',
      orderDate: '2023-10-03',
      deliveryDate: '2023-10-14',
      origin: 'Cologne Station',
      destination: 'Stuttgart Center',
      weight: 890,
      volume: 7.8,
      status: 'In Transit',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">Logistics</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search" 
                className="pl-9 w-64 bg-muted/50"
              />
            </div>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Home className="h-4 w-4 text-primary" />
          <a href="/" className="text-primary hover:underline">Home</a>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Transport Planning</span>
        </div>

        {/* Trip No. Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">Trip No.</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="text-primary border-primary">
                Manage Trips
              </Button>
              <Button variant="ghost" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="relative max-w-md">
            <Input 
              placeholder="Trip No."
              value={tripNo}
              onChange={(e) => setTripNo(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Planning Details Card */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-medium">Planning Details</h2>
              <div className="flex items-center gap-1 text-muted-foreground">
                <div className="h-4 w-4 rounded-full border border-muted-foreground flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                </div>
                <span className="text-sm">{location}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                Normal Trip
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                12-Mar-2025
              </Badge>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Forwardis GMBH">Forwardis GMBH</SelectItem>
                  <SelectItem value="Location 2">Location 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cluster</label>
              <Select value={cluster} onValueChange={setCluster}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10000406">10000406</SelectItem>
                  <SelectItem value="10000407">10000407</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Trip Type</label>
              <Select value={tripType} onValueChange={setTripType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal Trip">Normal Trip</SelectItem>
                  <SelectItem value="Wagon/Container Movement">Wagon/Container Movement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Plan Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !planDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {planDate ? format(planDate, "dd/MM/yyyy") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={planDate}
                    onSelect={(date) => date && setPlanDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {isWagonContainer && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Reference Doc. Type</label>
                <Select value={referenceDocType} onValueChange={setReferenceDocType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Reference Doc. Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PO">Purchase Order</SelectItem>
                    <SelectItem value="SO">Sales Order</SelectItem>
                    <SelectItem value="DO">Delivery Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reference Doc. No.</label>
                <div className="relative">
                  <Input 
                    placeholder="Enter Reference Doc. No."
                    value={referenceDocNo}
                    onChange={(e) => setReferenceDocNo(e.target.value)}
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Transport Mode</label>
                <RadioGroup value={transportMode} onValueChange={setTransportMode} className="flex items-center gap-6 h-10">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rail" id="rail" />
                    <Label htmlFor="rail" className="cursor-pointer">Rail</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="road" id="road" />
                    <Label htmlFor="road" className="cursor-pointer">Road</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 mt-4">
            <Checkbox 
              id="request-supplier"
              checked={requestSupplier}
              onCheckedChange={(checked) => setRequestSupplier(checked as boolean)}
            />
            <label 
              htmlFor="request-supplier" 
              className="text-sm font-medium cursor-pointer"
            >
              Request Supplier
            </label>
          </div>
        </div>

        {/* Conditional Content Based on Trip Type */}
        {isWagonContainer ? (
          <div className="flex gap-6">
            {/* Address Details Section - Left */}
            <div className="flex-1 bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-medium">Address Details</h2>
                </div>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Departure */}
                <div className="space-y-4 bg-blue-50/50 p-4 rounded-lg">
                  <h3 className="font-medium text-sm">Departure</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Departure *</label>
                    <div className="relative">
                      <Input 
                        value={`${departureCode} | ${departureLocation}`}
                        onChange={(e) => {
                          const value = e.target.value;
                          const parts = value.split('|');
                          setDepartureCode(parts[0]?.trim() || '');
                          setDepartureLocation(parts[1]?.trim() || '');
                        }}
                        className="pr-10"
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-white p-3 rounded border border-border">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">Berlin Central Station - Europaplatz 1, 10557</p>
                      <p className="text-muted-foreground">Berlin, Germany</p>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-auto flex-shrink-0">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Arrival */}
                <div className="space-y-4 bg-orange-50/50 p-4 rounded-lg">
                  <h3 className="font-medium text-sm">Arrival</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Arrival *</label>
                    <div className="relative">
                      <Input 
                        value={`${arrivalCode} | ${arrivalLocation}`}
                        onChange={(e) => {
                          const value = e.target.value;
                          const parts = value.split('|');
                          setArrivalCode(parts[0]?.trim() || '');
                          setArrivalLocation(parts[1]?.trim() || '');
                        }}
                        className="pr-10"
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-white p-3 rounded border border-border">
                    <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">Hauptbahnhof, 60329 Frankfurt am Main,</p>
                      <p className="text-muted-foreground">Germany</p>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-auto flex-shrink-0">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources Cards - Right */}
            <div className="w-80 space-y-3">
              {[
                { title: 'Resources', subtitle: 'Selected Resources', icon: Users, color: 'bg-pink-100', iconColor: 'text-pink-600' },
                { title: 'Supplier', icon: Truck, color: 'bg-cyan-100', iconColor: 'text-cyan-600' },
                { title: 'Schedule', icon: CalendarIcon2, color: 'bg-lime-100', iconColor: 'text-lime-600' },
                { title: 'Equipment', icon: Box, color: 'bg-red-100', iconColor: 'text-red-600' },
                { title: 'Handler', icon: UserCog, color: 'bg-orange-100', iconColor: 'text-orange-600' },
                { title: 'Vehicle', icon: Car, color: 'bg-amber-100', iconColor: 'text-amber-600' },
                { title: 'Driver', icon: UserCircle, color: 'bg-indigo-100', iconColor: 'text-indigo-600' },
              ].map((resource) => {
                const Icon = resource.icon;
                return (
                  <Card key={resource.title} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", resource.color)}>
                          <Icon className={cn("h-5 w-5", resource.iconColor)} />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{resource.title}</h3>
                          {resource.subtitle && (
                            <p className="text-xs text-muted-foreground">{resource.subtitle}</p>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          /* Customer Orders Card - Default */
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-medium">Customer Orders</h2>
                  <Badge variant="secondary" className="rounded-full">0</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search"
                    value={customerOrderSearch}
                    onChange={(e) => setCustomerOrderSearch(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* SmartGrid */}
            <div className="mt-4">
              <SmartGrid
                columns={customerOrdersColumns}
                data={customerOrdersData}
                onUpdate={async (row) => {
                  console.log('Data changed:', row);
                }}
                selectedRows={selectedOrders}
                onSelectionChange={(rows) => {
                  setSelectedOrders(rows);
                  console.log('Selection changed:', rows);
                }}
                paginationMode="pagination"
              />
            </div>

            {/* Trip Creation Controls */}
            <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
              <div className="flex items-center gap-4">
                <Label htmlFor="consolidated-trip" className="cursor-pointer text-orange-600 font-medium">
                  Create Single trip with Consolidated COs
                </Label>
                <Switch 
                  id="consolidated-trip"
                  checked={consolidatedTrip}
                  onCheckedChange={setConsolidatedTrip}
                  className="data-[state=checked]:bg-orange-500"
                />
                <span className="text-sm text-muted-foreground">
                  {consolidatedTrip ? 'Switch off' : 'Switch on'}
                </span>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                Create Trip
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TripPlanning;
