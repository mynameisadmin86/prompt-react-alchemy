import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, Search, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SmartGrid } from '@/components/SmartGrid/SmartGrid';
import { GridColumnConfig } from '@/types/smartgrid';

const ReceivablesAuthorizationPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState('INV-2024-001');
  const [moreDetailsOpen, setMoreDetailsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('invoice');

  // Invoice line items data
  const invoiceData = [
    {
      id: '1',
      lineNo: 1,
      tariffTypeId: 'TRF-001',
      tariffDesc: 'Standard Service Charge',
      printDescription: 'Standard Service Charge Description',
      serviceDate: '2024-01-15',
      purchaseOrderNo: 'PO-2024-001',
      uom: 'EA',
      remarks: 'First line item',
      qty: 10,
      rate: 100.00,
      amount: 1000.00,
      surcharge: 50.00,
      totalAmount: 1050.00,
    },
    {
      id: '2',
      lineNo: 2,
      tariffTypeId: 'USG-002',
      tariffDesc: 'Usage Type - Bandwidth',
      printDescription: 'Bandwidth Usage Description',
      serviceDate: '2024-01-16',
      purchaseOrderNo: 'PO-2024-002',
      uom: 'GB',
      remarks: 'Second line item',
      qty: 500,
      rate: 2.50,
      amount: 1250.00,
      surcharge: 75.00,
      totalAmount: 1325.00,
    },
    {
      id: '3',
      lineNo: 3,
      tariffTypeId: 'TRF-003',
      tariffDesc: 'Installation Charges',
      printDescription: 'Installation Charges Description',
      serviceDate: '2024-01-17',
      purchaseOrderNo: 'PO-2024-003',
      uom: 'SVC',
      remarks: 'Installation service',
      qty: 1,
      rate: 500.00,
      amount: 500.00,
      surcharge: 25.00,
      totalAmount: 525.00,
    },
    {
      id: '4',
      lineNo: 4,
      tariffTypeId: 'TRF-004',
      tariffDesc: 'Maintenance Fee',
      printDescription: 'Maintenance Fee Description',
      serviceDate: '2024-01-18',
      purchaseOrderNo: 'PO-2024-004',
      uom: 'YR',
      remarks: 'Annual contract',
      qty: 1,
      rate: 1200.00,
      amount: 1200.00,
      surcharge: 60.00,
      totalAmount: 1260.00,
    },
    {
      id: '5',
      lineNo: 5,
      tariffTypeId: 'USG-005',
      tariffDesc: 'Usage Type - Storage',
      printDescription: 'Storage Usage Description',
      serviceDate: '2024-01-19',
      purchaseOrderNo: 'PO-2024-005',
      uom: 'TB',
      remarks: 'Monthly storage',
      qty: 10,
      rate: 50.00,
      amount: 500.00,
      surcharge: 30.00,
      totalAmount: 530.00,
    },
  ];

  const columns: GridColumnConfig[] = [
    { key: 'lineNo', label: 'Line No.', type: 'Text', sortable: true },
    { key: 'tariffTypeId', label: 'Tariff Type ID / Usage Type ID', type: 'Text', sortable: true },
    { key: 'tariffDesc', label: 'Tariff Desc. / Usage Desc.', type: 'Text', sortable: true },
    { key: 'printDescription', label: 'Print Description', type: 'Text', sortable: true },
    { key: 'serviceDate', label: 'Service Date', type: 'Date', sortable: true },
  ];

  const totalAmount = invoiceData.reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card px-6 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="flex items-center gap-1 text-primary hover:underline">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link to="/" className="text-primary hover:underline">
            Receivables and Customer Credit Note Management
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Receivables Authorization</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Left Panel */}
        <div className="w-[450px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
          {/* Search Box */}
          <div className="relative">
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search invoice..."
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Customer Invoice Details Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base font-semibold">Customer Invoice Details</CardTitle>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                    Fresh
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Acme Corporation Ltd. | 15-Jan-2024
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Amount Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <p className="text-xs text-muted-foreground">Incl. VAT Amount</p>
                  <p className="text-lg font-semibold text-green-600">€ 5580.00</p>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <p className="text-xs text-muted-foreground">Exc. VAT Amount</p>
                  <p className="text-lg font-semibold text-red-500">€ 5580.00</p>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <p className="text-xs text-muted-foreground">Balance Amount</p>
                  <p className="text-lg font-semibold text-orange-500">€ 1200.00</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Purchase Order No.</label>
                  <Input placeholder="Enter Purchase Order No." />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Secondary Ref. No.</label>
                  <Input placeholder="Enter Secondary Ref. No." />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Printed Remark</label>
                <Textarea placeholder="Enter Printed Remark" rows={3} />
              </div>

              {/* More Details Collapsible */}
              <Collapsible open={moreDetailsOpen} onOpenChange={setMoreDetailsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between px-0 hover:bg-transparent">
                    <span className="font-semibold text-sm">More Details</span>
                    <ChevronRight className={`h-4 w-4 transition-transform ${moreDetailsOpen ? 'rotate-90' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Financial Year</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2022">2022</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Transfer Invoice No.</label>
                      <Input placeholder="Enter Transfer Invoice No." />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Transfer Invoice Date</label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Pay Term</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pay term" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="net30">Net 30</SelectItem>
                          <SelectItem value="net60">Net 60</SelectItem>
                          <SelectItem value="net90">Net 90</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Anchor Date</label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Numbering Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select numbering type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Currency</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eur">EUR</SelectItem>
                          <SelectItem value="usd">USD</SelectItem>
                          <SelectItem value="gbp">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Exchange Rate</label>
                      <Input defaultValue="1.00" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Total amount excl VAT (EUR)</label>
                      <Input defaultValue="€ 0.00" readOnly className="bg-muted/50" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Invoice Authorization Date</label>
                      <Input type="date" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Due Date</label>
                      <Input defaultValue="Auto-calculated" readOnly className="bg-muted/50" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Assign to user</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user1">John Smith</SelectItem>
                          <SelectItem value="user2">Jane Doe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Audit Section */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-semibold mb-3">Audit & Traceability</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Created By</p>
                        <p>John Smith</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Creation Date</p>
                        <p>15-Jan-2024</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Modified By</p>
                        <p>Jane Doe</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Modified Date</p>
                        <p>20-Jan-2024</p>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-fit">
              <TabsTrigger value="invoice">Invoice</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
            </TabsList>

            <TabsContent value="invoice" className="flex-1 flex flex-col mt-4">
              <Card className="flex-1 flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base font-semibold">Invoice Details</CardTitle>
                      <Badge className="bg-primary text-primary-foreground rounded-full">
                        {invoiceData.length}
                      </Badge>
                    </div>
                    <p className="text-sm">
                      Total Amount: <span className="font-semibold text-green-600">€ {totalAmount.toFixed(2)}</span>
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <SmartGrid
                    columns={columns}
                    data={invoiceData}
                    paginationMode="pagination"
                    customPageSize={10}
                    hideToolbar
                    hideAdvancedFilter
                    hideCheckboxToggle
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="finance" className="flex-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Finance Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">Finance details content goes here...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select defaultValue="english">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="german">German</SelectItem>
                <SelectItem value="french">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">Excel Attachment</Button>
            <Button variant="outline" className="text-destructive hover:text-destructive">Delete</Button>
            <Button variant="outline">Save</Button>
            <Button>Authorize</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivablesAuthorizationPage;
