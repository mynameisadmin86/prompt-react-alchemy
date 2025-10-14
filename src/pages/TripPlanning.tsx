import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Package, Settings, ExternalLink, Home, ChevronRight, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const TripPlanning = () => {
  const [tripNo, setTripNo] = useState('');
  const [location, setLocation] = useState('Forwardis GMBH');
  const [cluster, setCluster] = useState('10000406');
  const [tripType, setTripType] = useState('Normal Trip');
  const [planDate, setPlanDate] = useState<Date>(new Date(2023, 9, 12));
  const [requestSupplier, setRequestSupplier] = useState(false);
  const [customerOrderSearch, setCustomerOrderSearch] = useState('');

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
                  <SelectItem value="Express Trip">Express Trip</SelectItem>
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

        {/* Customer Orders Card */}
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

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="relative mb-6">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className="h-1 w-6 bg-primary/20 rounded-full"
                      style={{ 
                        transform: `rotate(${(i - 2) * 15}deg) translateY(${Math.abs(i - 2) * 4}px)`,
                        opacity: 1 - Math.abs(i - 2) * 0.2 
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="h-32 w-40 bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-500 rounded-lg transform rotate-12 opacity-80" />
                <div className="absolute inset-0 h-32 w-40 bg-gradient-to-br from-purple-300 via-purple-400 to-indigo-400 rounded-lg transform -rotate-6" />
                <div className="absolute inset-0 h-32 w-40 bg-gradient-to-br from-purple-200 via-purple-300 to-indigo-300 rounded-lg" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-24 border-l-4 border-t-4 border-purple-400/50 rounded-tl-lg" />
              </div>
            </div>
            <p className="text-muted-foreground max-w-md">
              There are no customer orders to display. Please use the "search" to find orders.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripPlanning;
