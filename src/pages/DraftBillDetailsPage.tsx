import React, { useState } from 'react';
import { ArrowLeft, X, Maximize2, FileText, Info, Trash2, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { DynamicPanel } from '@/components/DynamicPanel';
import { PanelConfig } from '@/types/dynamicPanel';

const DraftBillDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [basicDetailsOpen, setBasicDetailsOpen] = useState(true);
  
  // Summary panel data state
  const [summaryData, setSummaryData] = useState({
    tariffId: 'TAR_HR_DR_22_00007',
    triggeringDoc: 'CN000009193/Dispatch Document',
    basicCharge: '€ 50.00',
    triggeringDate: '07-Apr-2025',
    minMaxCharge: '€ 100.00/€ 200.00',
    referenceDocNo: 'IO_D25_003',
    referenceDocType: 'Internal Order',
    agent: 'AGN0323 - ABC Agent',
    equipment: 'WAG0322 - Habbins Wagon',
    invoiceNo: '--',
    invoiceStatus: '--',
    invoiceDate: '--',
    reasonForAmendment: '--',
    reasonForCancellation: '--',
    remarks: '--',
  });

  // Summary panel configuration using PanelConfig (record of FieldConfig)
  const summaryPanelConfig: PanelConfig = {
    tariffId: { id: 'tariffId', label: 'Tariff ID', fieldType: 'text', value: summaryData.tariffId, mandatory: false, visible: true, editable: false, order: 1, width: 'third' },
    triggeringDoc: { id: 'triggeringDoc', label: 'Triggering Doc.', fieldType: 'text', value: summaryData.triggeringDoc, mandatory: false, visible: true, editable: false, order: 2, width: 'third' },
    basicCharge: { id: 'basicCharge', label: 'Basic Charge', fieldType: 'text', value: summaryData.basicCharge, mandatory: false, visible: true, editable: false, order: 3, width: 'third' },
    triggeringDate: { id: 'triggeringDate', label: 'Triggering Date', fieldType: 'text', value: summaryData.triggeringDate, mandatory: false, visible: true, editable: false, order: 4, width: 'third' },
    minMaxCharge: { id: 'minMaxCharge', label: 'Minimum/Maximum Charge', fieldType: 'text', value: summaryData.minMaxCharge, mandatory: false, visible: true, editable: false, order: 5, width: 'third' },
    referenceDocNo: { id: 'referenceDocNo', label: 'Reference Doc. No.', fieldType: 'text', value: summaryData.referenceDocNo, mandatory: false, visible: true, editable: false, order: 6, width: 'third' },
    referenceDocType: { id: 'referenceDocType', label: 'Reference Doc. Type', fieldType: 'text', value: summaryData.referenceDocType, mandatory: false, visible: true, editable: false, order: 7, width: 'third' },
    agent: { id: 'agent', label: 'Agent', fieldType: 'text', value: summaryData.agent, mandatory: false, visible: true, editable: false, order: 8, width: 'third' },
    equipment: { id: 'equipment', label: 'Equipment', fieldType: 'text', value: summaryData.equipment, mandatory: false, visible: true, editable: false, order: 9, width: 'third' },
    invoiceNo: { id: 'invoiceNo', label: 'Invoice No.', fieldType: 'text', value: summaryData.invoiceNo, mandatory: false, visible: true, editable: false, order: 10, width: 'third' },
    invoiceStatus: { id: 'invoiceStatus', label: 'Invoice Status', fieldType: 'text', value: summaryData.invoiceStatus, mandatory: false, visible: true, editable: false, order: 11, width: 'third' },
    invoiceDate: { id: 'invoiceDate', label: 'Invoice Date', fieldType: 'text', value: summaryData.invoiceDate, mandatory: false, visible: true, editable: false, order: 12, width: 'third' },
    reasonForAmendment: { id: 'reasonForAmendment', label: 'Reason for Amendment', fieldType: 'text', value: summaryData.reasonForAmendment, mandatory: false, visible: true, editable: false, order: 13, width: 'third' },
    reasonForCancellation: { id: 'reasonForCancellation', label: 'Reason for Cancellation', fieldType: 'text', value: summaryData.reasonForCancellation, mandatory: false, visible: true, editable: false, order: 14, width: 'third' },
    remarks: { id: 'remarks', label: 'Remarks', fieldType: 'text', value: summaryData.remarks, mandatory: false, visible: true, editable: false, order: 15, width: 'third' },
  };

  const handleSummaryChange = (updatedData: Record<string, any>) => {
    setSummaryData(prev => ({ ...prev, ...updatedData }));
  };

  // Mock data
  const billData = {
    billNo: 'DB_D25_0001',
    date: '12-Mar-2025',
    status: 'Open',
    releaseStatus: 'BR Released',
    totalValue: '€ 1200.000',
    acceptedValue: '€ 1200.000',
    customer: 'Felbermayr Kran - 10029114',
    invoiceNo: 'INV00024324',
    invoiceStatus: 'Under Amendment',
    docRef: 'IO_D25_003',
    docType: 'Multiple',
    reason: 'Mismatch in consignee details between shipping manifest and bill.',
  };


  const tariffLines = [
    {
      lineNo: 1,
      status: 'Open',
      description: 'Crane-Army-Freight SNCF',
      proposed: '€ 1200.000',
      accepted: '€ 1200.000',
    },
    {
      lineNo: 2,
      status: 'Cancelled',
      description: 'CR-SW (Guarding) Flat Rate-Army-Freig...',
      proposed: '€ 1200.000',
      accepted: '€ 1200.000',
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Draft Bill Details</h1>
          <Badge variant="outline" className="rounded-md">{billData.billNo}</Badge>
          <Badge variant="outline" className="rounded-md">{billData.releaseStatus}</Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <X className="h-5 w-5" />
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 border-r border-border bg-card p-4 overflow-y-auto shrink-0">
          {/* Bill Summary Card */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-foreground">{billData.billNo}</span>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{billData.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{billData.date}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Value</p>
                  <p className="text-sm font-medium text-emerald-600">{billData.totalValue}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Accepted Value</p>
                  <p className="text-sm font-medium text-emerald-600">{billData.acceptedValue}</p>
                </div>
              </div>

              <div className="border-t border-border pt-3 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Settings2 className="h-4 w-4" />
                  <span>{billData.customer}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{billData.invoiceNo}</span>
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-xs">
                    {billData.invoiceStatus}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{billData.docRef}</span>
                    <Info className="h-3 w-3" />
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{billData.docType}</span>
                    <Info className="h-3 w-3" />
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Settings2 className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Reason : {billData.reason}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tariff Details Section */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-foreground">Tariff Details</h3>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 rounded-full h-5 w-5 p-0 flex items-center justify-center text-xs">
                {tariffLines.length}
              </Badge>
            </div>

            <div className="space-y-3">
              {tariffLines.map((line) => (
                <Card key={line.lineNo} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Line No:{line.lineNo}</span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={
                            line.status === 'Open' 
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' 
                              : 'bg-red-100 text-red-700 hover:bg-red-100'
                          }
                        >
                          {line.status}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <span className="truncate">{line.description}</span>
                      <Info className="h-3 w-3 shrink-0" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Proposed</p>
                        <p className="text-sm font-medium text-emerald-600">{line.proposed}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Accepted</p>
                        <p className="text-sm font-medium text-emerald-600">{line.accepted}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Tariff Details</h2>
            <Button size="icon" className="bg-primary text-primary-foreground">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Summary Section - DynamicPanel */}
          <div className="mb-4">
            <DynamicPanel
              panelId="summary-panel"
              panelTitle="Summary"
              panelIcon={<FileText className="h-5 w-5" />}
              panelConfig={summaryPanelConfig}
              initialData={summaryData}
              onDataChange={handleSummaryChange}
              collapsible={true}
              defaultOpen={true}
              panelWidth="full"
            />
          </div>

          {/* Basic Details Section */}
          <Collapsible open={basicDetailsOpen} onOpenChange={setBasicDetailsOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">Basic Details</span>
                  </div>
                  {basicDetailsOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 pb-4 px-4">
                  <div className="grid grid-cols-4 gap-6 mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                      <div className="flex gap-2">
                        <Select defaultValue="TON">
                          <SelectTrigger className="w-20 h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TON">TON</SelectItem>
                            <SelectItem value="KG">KG</SelectItem>
                            <SelectItem value="LB">LB</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input className="h-9" defaultValue="6.00" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Rate</p>
                      <div className="flex gap-2">
                        <Select defaultValue="EUR">
                          <SelectTrigger className="w-16 h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EUR">€</SelectItem>
                            <SelectItem value="USD">$</SelectItem>
                            <SelectItem value="GBP">£</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input className="h-9" defaultValue="200.000" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Accepted Value</p>
                      <div className="flex gap-2">
                        <Select defaultValue="EUR">
                          <SelectTrigger className="w-16 h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EUR">€</SelectItem>
                            <SelectItem value="USD">$</SelectItem>
                            <SelectItem value="GBP">£</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input className="h-9" defaultValue="1200.000" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">User Assigned</p>
                      <Select defaultValue="eklavya">
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eklavya">Eklavya</SelectItem>
                          <SelectItem value="john">John</SelectItem>
                          <SelectItem value="jane">Jane</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Remarks</p>
                      <Textarea className="min-h-[80px] resize-none" placeholder="Enter remarks..." />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Remarks for User Assigned</p>
                      <Textarea className="min-h-[80px] resize-none" placeholder="Enter remarks for user assigned..." />
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </main>
      </div>

      {/* Footer */}
      <footer className="h-14 bg-card border-t border-border flex items-center justify-end px-6 shrink-0">
        <Button className="bg-primary text-primary-foreground">Save</Button>
      </footer>
    </div>
  );
};

export default DraftBillDetailsPage;
