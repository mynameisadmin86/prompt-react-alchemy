
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GridDemo from "./pages/GridDemo";
import GridDemoGrouping from "./pages/GridDemoGrouping";
import TripPlansSearchHub from "./pages/TripPlansSearchHub";
import TripPlansSearchHubAPI from "./pages/TripPlansSearchHubAPI";
import DynamicPanelDemo from "./pages/DynamicPanelDemo";
import DynamicPanelDemoClone from "./pages/DynamicPanelDemoClone";
import DynamicPanelDemoCloneZustand from "./pages/DynamicPanelDemoCloneZustand";
import DynamicPanelDemoZustand from "./pages/DynamicPanelDemoZustand";
import SimpleDynamicPanelDemo from "./pages/SimpleDynamicPanelDemo";
import FlexGridDemo from "./pages/FlexGridDemo";
import FlexGridLayoutPage from "./pages/FlexGridLayoutPage";
import TripExecution from "./pages/TripExecution";
import TripExecutionPage from "./pages/TripExecutionPage";
import CreateTripExecutionPage from "./pages/CreateTripExecutionPage";
import TripExecutionCreate from "./pages/TripExecutionCreate";
import TripExecutionZustand from "./pages/TripExecutionZustand";
import TripExecutionStep1 from "./pages/TripExecutionStep1";
import TripExecutionStep2 from "./pages/TripExecutionStep2";
import TripExecutionStep3 from "./pages/TripExecutionStep3";
import TripExecutionStep4 from "./pages/TripExecutionStep4";
import SideDrawerDemo from "./pages/SideDrawerDemo";
import SmartGridPlusDemo from "./pages/SmartGridPlusDemo";
import BillingDemo from "./pages/BillingDemo";
import FileUploadDemo from "./pages/FileUploadDemo";
import BulkUploadDemo from "./pages/BulkUploadDemo";
import SmartGridGroupingDemo from "./pages/SmartGridGroupingDemo";
import NotFound from "./pages/NotFound";
import DynamicCardView from "./pages/DynamicCardView";
import ConsignmentDetailsPage from "./pages/ConsignmentDetailsPage";
import QuickOrderManagement from "./pages/QuickOrderManagement";
import QuickOrderServerSideManagement from "./pages/QuickOrderServerSideManagement";
import OrderListPage from "./pages/OrderListPage";
import CreateOrderPage from "./pages/CreateOrderPage";
import ManageTripExecution from "./pages/ManageTripExecution";
import TripPlanning from "./pages/TripPlanning";
import PlanActuals from "./pages/PlanActuals";
import SmartGridHighlightDemo from "./pages/SmartGridHighlightDemo";
import TransportRouteUpdate from "./pages/TransportRouteUpdate";
import SmartGridSelectionDemo from "./pages/SmartGridSelectionDemo";
import BadgesListDemo from "./pages/BadgesListDemo";
import SmartGridWithNestedRowsDemo from "./pages/SmartGridWithNestedRowsDemo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/grid-demo" element={<GridDemo />} />
          <Route path="/grid-demo-grouping" element={<GridDemoGrouping />} />
          <Route path="/trip-plans-search-hub" element={<TripPlansSearchHub />} />
          <Route path="/trip-plans-search-hub-api" element={<TripPlansSearchHubAPI />} />
          <Route path="/dynamic-panel-demo" element={<DynamicPanelDemo />} />
          <Route path="/dynamic-panel-demo-clone" element={<DynamicPanelDemoClone />} />
          <Route path="/dynamic-panel-demo-clone-zustand" element={<DynamicPanelDemoCloneZustand />} />
          <Route path="/dynamic-panel-demo-zustand" element={<DynamicPanelDemoZustand />} />
          <Route path="/simple-dynamic-panel-demo" element={<SimpleDynamicPanelDemo />} />
          <Route path="/card-view" element={<DynamicCardView />} />
          <Route path="/flex-grid-demo" element={<FlexGridDemo />} />
        <Route path="/flex-grid-layout-page" element={<FlexGridLayoutPage />} />
        <Route path="/trip-execution" element={<TripExecution />} />
          <Route path="/trip-execution-page" element={<TripExecutionPage />} />
          <Route path="/create-trip-execution" element={<CreateTripExecutionPage />} />
          <Route path="/trip-execution-create" element={<TripExecutionCreate />} />
          <Route path="/trip-execution-zustand" element={<TripExecutionZustand />} />
          <Route path="/trip-execution-step1" element={<TripExecutionStep1 />} />
          <Route path="/trip-execution-step2" element={<TripExecutionStep2 />} />
          <Route path="/trip-execution-step3" element={<TripExecutionStep3 />} />
          <Route path="/trip-execution-step4" element={<TripExecutionStep4 />} />
          <Route path="/side-drawer-demo" element={<SideDrawerDemo />} />
          <Route path="/smart-grid-plus-demo" element={<SmartGridPlusDemo />} />
          <Route path="/billing-demo" element={<BillingDemo />} />
          <Route path="/file-upload-demo" element={<FileUploadDemo />} />
          <Route path="/bulk-upload-demo" element={<BulkUploadDemo />} />
          <Route path="/smart-grid-grouping-demo" element={<SmartGridGroupingDemo />} />
          <Route path="/quick-order-management" element={<QuickOrderManagement />} />
          <Route path="/quick-order-server-side-management" element={<QuickOrderServerSideManagement />} />
          <Route path="/order-list" element={<OrderListPage />} />
          <Route path="/create-order" element={<CreateOrderPage />} />
          <Route path="/trip-log" element={<ManageTripExecution />} />
          <Route path="/trip-planning" element={<TripPlanning />} />
          <Route path="/plan-actuals" element={<PlanActuals />} />
          <Route path="/smartgrid-highlight-demo" element={<SmartGridHighlightDemo />} />
          <Route path="/transport-route-update" element={<TransportRouteUpdate />} />
          <Route path="/smartgrid-selection-demo" element={<SmartGridSelectionDemo />} />
          <Route path="/consignment-details" element={<ConsignmentDetailsPage />} />
          <Route path="/badges-list-demo" element={<BadgesListDemo />} />
          <Route path="/smartgrid-nested-rows-demo" element={<SmartGridWithNestedRowsDemo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
