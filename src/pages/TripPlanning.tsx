import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LegEventsDrawer } from '@/components/drawer/LegEventsDrawer';
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
import { Search, Package, Settings, ExternalLink, Home, ChevronRight, CalendarIcon, MapPin, Building2, Users, Truck, Calendar as CalendarIcon2, Box, UserCog, Car, UserCircle, Plus, AlertTriangle, Info, Printer, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SmartGrid } from '@/components/SmartGrid';
import type { GridColumnConfig } from '@/types/smartgrid';

const TripPlanning = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isManageMode = searchParams.get('manage') === 'true';
  const tripId = searchParams.get('tripId') || '';
  
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
  const [isLegEventsDrawerOpen, setIsLegEventsDrawerOpen] = useState(false);

  const isWagonContainer = tripType === 'Wagon/Container Movement';

  // Customer Orders Grid Configuration for Manage Mode
  const manageOrdersColumns: GridColumnConfig[] = [
    { key: 'customerOrder', label: 'Customer Order', type: 'Text', width: 150, editable: false },
    { key: 'coStatus', label: 'CO Status', type: 'Badge', width: 120, editable: false },
    { key: 'legFromTo', label: 'Leg From & To', type: 'Text', width: 180, editable: false },
    { key: 'departureDate', label: 'Departure Date', type: 'Text', width: 150, editable: false },
    { key: 'arrivalDate', label: 'Arrival Date', type: 'Text', width: 150, editable: false },
    { key: 'trainPara', label: 'Train Para.', type: 'Text', width: 100, editable: false },
  ];

  const manageOrdersData = [
    {
      id: '1',
      customerOrder: 'CO000122025',
      coStatus: 'Pickup',
      legFromTo: 'Voila - Curtioi',
      departureDate: '10-Mar-2025\n10:00 AM',
      arrivalDate: '10-Mar-2025\n10:00 AM',
      trainPara: 'warning',
      coDescription: 'CO Description',
    },
    {
      id: '2',
      customerOrder: 'CO000122025',
      coStatus: 'Delivery',
      legFromTo: 'Voila - Curtioi',
      departureDate: '10-Mar-2025\n10:00 AM',
      arrivalDate: '10-Mar-2025\n10:00 AM',
      trainPara: 'warning',
      coDescription: 'CO Description',
    },
    {
      id: '3',
      customerOrder: 'CO000122026',
      coStatus: 'PUD',
      legFromTo: 'Voila - Curtioi',
      departureDate: '10-Mar-2025\n10:00 AM',
      arrivalDate: '10-Mar-2025\n10:00 AM',
      trainPara: 'warning',
      coDescription: 'CO Description',
    },
  ];

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

  // If in manage mode, show the detailed trip management view
  if (isManageMode && tripId) {
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

          {/* Trip Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-medium text-muted-foreground">Trip No.</h1>
                <Input 
                  value={tripId} 
                  readOnly
                  className="w-48 font-medium"
                />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Badge className="bg-[#FFF4E6] text-[#F97316] border-[#FED7AA] hover:bg-[#FFF4E6] font-normal px-3">
                  Draft
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="text-primary border-primary hover:bg-primary/5">
                  Manage Trips
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Printer className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Route Information */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-semibold text-foreground">PAR565, Paris</p>
                  <p className="text-sm text-muted-foreground">10-Mar-2025 10:00AM</p>
                </div>
              </div>
              <div className="h-px flex-1 mx-6 border-t-2 border-dashed border-muted-foreground/30"></div>
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-semibold text-foreground">BER323, Berlin</p>
                  <p className="text-sm text-muted-foreground">10-Mar-2025 10:00AM</p>
                </div>
              </div>
              <div className="ml-auto pl-8 flex items-center gap-8">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Expected Revenue</p>
                  <p className="text-base font-semibold text-[#7C3AED]">€ 5580,00</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Expected Cost</p>
                  <p className="text-base font-semibold text-[#EC4899]">€ 1580,00</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Planning Details Card */}
          <div className="bg-card border border-border rounded-lg px-6 py-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-medium">Planning Details</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  </div>
                  <span className="text-sm">Forwardis GMBH</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#FFF4E6] text-[#F97316] border-[#FED7AA] hover:bg-[#FFF4E6] font-normal">
                  Normal Trip
                </Badge>
                <span className="text-sm text-muted-foreground">12-Mar-2025</span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Split View - Customer Orders & Resources */}
          <div className="flex gap-4 mb-6">
            {/* Customer Orders - Left Panel */}
            <div className="flex-1 bg-card border border-border rounded-lg overflow-hidden">
              {/* Header */}
              <div className="bg-[#3B82F6] text-white px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded bg-white/10 flex items-center justify-center">
                      <Package className="h-5 w-5" />
                    </div>
                    <h2 className="text-base font-medium">Customer Orders</h2>
                    <Badge className="bg-white/20 text-white hover:bg-white/20 border-none font-normal">12</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Search Bar */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search"
                      className="pl-9 bg-muted/50"
                    />
                  </div>
                  <Button size="icon" variant="outline" className="h-9 w-9">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="h-9 w-9">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button size="icon" className="h-9 w-9 bg-primary text-white">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </Button>
                  <Button size="icon" variant="destructive" className="h-9 w-9">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                  <Button size="icon" variant="outline" className="h-9 w-9">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="h-9 w-9">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" />
                    </svg>
                  </Button>
                </div>

                {/* Table */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="border-b">
                        <th className="w-12 p-3">
                          <Checkbox />
                        </th>
                        <th className="text-left p-3 text-sm font-medium">Customer Order</th>
                        <th className="text-left p-3 text-sm font-medium">CO Status</th>
                        <th className="text-left p-3 text-sm font-medium">Leg From & To</th>
                        <th className="text-left p-3 text-sm font-medium">Departure Date</th>
                        <th className="text-left p-3 text-sm font-medium">Arrival Date</th>
                        <th className="text-left p-3 text-sm font-medium">Train Para.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {manageOrdersData.map((order, idx) => (
                        <tr key={order.id} className="border-b hover:bg-muted/30">
                          <td className="p-3">
                            <Checkbox />
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="text-sm font-medium">{order.customerOrder}</p>
                              <p className="text-xs text-muted-foreground">{order.coDescription}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge 
                              className={
                                order.coStatus === 'Pickup' 
                                  ? 'bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7] border-none font-normal'
                                  : order.coStatus === 'Delivery'
                                  ? 'bg-[#D1FAE5] text-[#065F46] hover:bg-[#D1FAE5] border-none font-normal'
                                  : 'bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7] border-none font-normal'
                              }
                            >
                              {order.coStatus}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <Info className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{order.legFromTo}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm whitespace-pre-line">{order.departureDate}</div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm whitespace-pre-line">{order.arrivalDate}</div>
                          </td>
                          <td className="p-3">
                            <AlertTriangle className="h-5 w-5 text-[#F97316]" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources - Right Panel */}
            <div className="w-[420px] bg-card border border-border rounded-lg overflow-hidden">
              {/* Header */}
              <div className="bg-[#EC4899] text-white px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded bg-white/10 flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <h2 className="text-base font-medium">Resources</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#F97316] text-white hover:bg-[#F97316] border-none font-normal px-2.5">
                      Supplier: 1
                    </Badge>
                    <Badge className="bg-[#F97316] text-white hover:bg-[#F97316] border-none font-normal px-2.5">
                      Handler: 1
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Supplier Card */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded bg-[#A5F3FC] flex items-center justify-center">
                        <Truck className="h-5 w-5 text-[#0E7490]" />
                      </div>
                      <h3 className="font-medium">Supplier</h3>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4 bg-muted/20 space-y-3">
                    <div>
                      <p className="font-semibold text-base">VEN0000001</p>
                      <p className="text-sm text-muted-foreground">Vendor Name</p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Contract ID</p>
                        <p className="font-medium">AG-00000001</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Cost</p>
                        <p className="font-medium">10 USD</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Cost</p>
                        <p className="font-medium">10 USD</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Estimated Time</p>
                        <p className="font-medium">1 Hr</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
            <Button variant="ghost" className="text-[#DC2626] hover:text-[#DC2626] hover:bg-red-50">
              Cancel
            </Button>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
              Confirm
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Confirm & Release
            </Button>
          </div>
        </main>
      </div>
    );
  }

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
              <Button 
                variant="outline" 
                className="text-primary border-primary"
                onClick={() => navigate('/trip-planning?manage=true&tripId=TRIP00000001')}
              >
                Manage Trips
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsLegEventsDrawerOpen(true)}
                data-lov-id="src/pages/TripPlanning.tsx:570:14"
              >
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
          /* Customer Orders Section */
          <>
            {!consolidatedTrip ? (
              /* Default View - Single Customer Orders Card */
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
                    <Label htmlFor="consolidated-trip" className="cursor-pointer text-foreground font-medium">
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
            ) : (
              /* Split View - Customer Orders & Resources */
              <div className="flex gap-4">
                {/* Customer Orders - Left Panel */}
                <div className="flex-1 bg-card border border-border rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-blue-500 text-white p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                          <Package className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-semibold">Customer Orders</h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                          <Search className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-white/90">12 orders ready for planning</p>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Search */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search orders..."
                        value={customerOrderSearch}
                        onChange={(e) => setCustomerOrderSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    {/* Toggle */}
                    <div className="flex items-center gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
                      <Switch 
                        id="consolidated-trip-inline"
                        checked={consolidatedTrip}
                        onCheckedChange={setConsolidatedTrip}
                        className="data-[state=checked]:bg-orange-500"
                      />
                      <Label htmlFor="consolidated-trip-inline" className="cursor-pointer text-sm font-medium">
                        Create single trip with consolidated orders
                      </Label>
                    </div>

                    {/* Grid */}
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
                </div>

                {/* Resources - Right Panel */}
                <div className="w-96 bg-card border border-border rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-emerald-500 text-white p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                          <Truck className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-semibold">Resources</h2>
                      </div>
                    </div>
                    <p className="text-sm text-white/90">Assign supplies and schedules</p>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-4">
                    {/* Supplier Section */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Supplier</label>
                      <Select defaultValue="supplier1">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="supplier1">Supplier 1</SelectItem>
                          <SelectItem value="supplier2">Supplier 2</SelectItem>
                          <SelectItem value="supplier3">Supplier 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Schedule Section */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Schedule</label>
                      <Select defaultValue="">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Schedule" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="schedule1">Schedule 1</SelectItem>
                          <SelectItem value="schedule2">Schedule 2</SelectItem>
                          <SelectItem value="schedule3">Schedule 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* More Resources Button */}
                    <Button variant="outline" className="w-full text-emerald-600 border-emerald-300 hover:bg-emerald-50">
                      <Plus className="h-4 w-4 mr-2" />
                      More Resources
                    </Button>

                    {/* Statistics */}
                    <div className="border-t border-border pt-4 mt-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Orders:</span>
                        <span className="font-semibold">12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Assigned:</span>
                        <span className="font-semibold text-emerald-600">5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Unassigned:</span>
                        <span className="font-semibold text-orange-600">7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Leg Events Drawer */}
      <LegEventsDrawer
        isOpen={isLegEventsDrawerOpen}
        onClose={() => setIsLegEventsDrawerOpen(false)}
        tripId="TRIP00000001"
      />
    </div>
  );
};

export default TripPlanning;
