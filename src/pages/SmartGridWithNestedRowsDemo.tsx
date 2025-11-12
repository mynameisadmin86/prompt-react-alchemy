import React, { useState } from "react";
import { SmartGridWithNestedRows } from "@/components/SmartGrid";
import { GridColumnConfig } from "@/types/smartgrid";

// Mock data for trips with nested legs
const initialTripsData = [
  {
    tripId: "TRIP-001",
    vehicleNo: "MH-12-AB-1234",
    driverName: "John Doe",
    status: "In Transit",
    distance: 450,
    tripLegs: [
      {
        legNo: 1,
        from: "Mumbai",
        to: "Pune",
        distance: 150,
        eta: "2024-01-15 10:00",
        departureTime: "08:00",
        status: "Completed",
      },
      {
        legNo: 2,
        from: "Pune",
        to: "Nashik",
        distance: 210,
        eta: "2024-01-15 14:30",
        departureTime: "12:00",
        status: "In Progress",
      },
      {
        legNo: 3,
        from: "Nashik",
        to: "Aurangabad",
        distance: 90,
        eta: "2024-01-15 17:00",
        departureTime: "15:30",
        status: "Pending",
      },
    ],
  },
  {
    tripId: "TRIP-002",
    vehicleNo: "DL-14-CD-5678",
    driverName: "Jane Smith",
    status: "Pending",
    distance: 320,
    tripLegs: [
      {
        legNo: 1,
        from: "Delhi",
        to: "Jaipur",
        distance: 280,
        eta: "2024-01-16 09:00",
        departureTime: "06:30",
        status: "Pending",
      },
      {
        legNo: 2,
        from: "Jaipur",
        to: "Ajmer",
        distance: 40,
        eta: "2024-01-16 12:00",
        departureTime: "10:00",
        status: "Pending",
      },
    ],
  },
  {
    tripId: "TRIP-003",
    vehicleNo: "KA-05-EF-9012",
    driverName: "Robert Brown",
    status: "Completed",
    distance: 180,
    tripLegs: [
      {
        legNo: 1,
        from: "Bangalore",
        to: "Mysore",
        distance: 180,
        eta: "2024-01-14 11:00",
        departureTime: "08:30",
        status: "Completed",
      },
    ],
  },
  {
    tripId: "TRIP-004",
    vehicleNo: "TN-09-GH-3456",
    driverName: "Emily Davis",
    status: "Cancelled",
    distance: 0,
    tripLegs: [],
  },
];

// Mock data for orders with nested items
const initialOrdersData = [
  {
    orderId: "ORD-1001",
    customerName: "Acme Corp",
    orderDate: "2024-01-10",
    totalAmount: 15000,
    status: "Delivered",
    orderItems: [
      { itemNo: 1, productName: "Widget A", quantity: 10, unitPrice: 500, total: 5000 },
      { itemNo: 2, productName: "Widget B", quantity: 20, unitPrice: 250, total: 5000 },
      { itemNo: 3, productName: "Widget C", quantity: 10, unitPrice: 500, total: 5000 },
    ],
  },
  {
    orderId: "ORD-1002",
    customerName: "TechStart Inc",
    orderDate: "2024-01-12",
    totalAmount: 8000,
    status: "Pending",
    orderItems: [{ itemNo: 1, productName: "Gadget X", quantity: 5, unitPrice: 1600, total: 8000 }],
  },
  {
    orderId: "ORD-1003",
    customerName: "Global Solutions",
    orderDate: "2024-01-14",
    totalAmount: 25000,
    status: "Processing",
    orderItems: [
      { itemNo: 1, productName: "Device Alpha", quantity: 10, unitPrice: 1500, total: 15000 },
      { itemNo: 2, productName: "Device Beta", quantity: 5, unitPrice: 2000, total: 10000 },
    ],
  },
];

export default function SmartGridWithNestedRowsDemo() {
  // State for trips and orders
  const [tripsData, setTripsData] = useState(initialTripsData);
  const [ordersData, setOrdersData] = useState(initialOrdersData);

  // Handler to update nested trip legs
  const handleTripLegUpdate = (parentRowIndex: number, legIndex: number, updatedLeg: any) => {
    setTripsData((prevData) => {
      const newData = [...prevData];
      const trip = { ...newData[parentRowIndex] };
      const updatedLegs = [...trip.tripLegs];
      updatedLegs[legIndex] = { ...updatedLegs[legIndex], ...updatedLeg };
      trip.tripLegs = updatedLegs;
      newData[parentRowIndex] = trip;
      return newData;
    });
  };

  // Handler to update nested order items
  const handleOrderItemUpdate = (parentRowIndex: number, itemIndex: number, updatedItem: any) => {
    setOrdersData((prevData) => {
      const newData = [...prevData];
      const order = { ...newData[parentRowIndex] };
      const updatedItems = [...order.orderItems];
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], ...updatedItem };
      order.orderItems = updatedItems;
      newData[parentRowIndex] = order;
      return newData;
    });
  };

  // Server callback for trip leg updates
  const handleTripLegServerUpdate = async (parentRow: any, nestedRow: any, updatedData: any) => {
    try {
      console.log("Sending trip leg update to server:", {
        tripId: parentRow.tripId,
        legNo: nestedRow.legNo,
        updatedData,
      });

      // Replace with your actual API call
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     tripId: parentRow.tripId,
      //     legNo: nestedRow.legNo,
      //     ...updatedData
      //   })
      // });
      //
      // if (!response.ok) throw new Error('Failed to update');
    } catch (error) {
      console.error("Failed to update server:", error);
    }
  };

  // Server callback for order item updates
  const handleOrderItemServerUpdate = async (parentRow: any, nestedRow: any, updatedData: any) => {
    try {
      console.log("Sending order item update to server:", {
        orderId: parentRow.orderId,
        itemNo: nestedRow.itemNo,
        updatedData,
      });

      // Replace with your actual API call
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     orderId: parentRow.orderId,
      //     itemNo: nestedRow.itemNo,
      //     ...updatedData
      //   })
      // });
      //
      // if (!response.ok) throw new Error('Failed to update');
    } catch (error) {
      console.error("Failed to update server:", error);
    }
  };

  // Column config for trips
  const tripColumns: GridColumnConfig[] = [
    { key: "tripId", label: "Trip ID", type: "Text", width: 120 },
    { key: "vehicleNo", label: "Vehicle No", type: "Text", width: 140 },
    { key: "driverName", label: "Driver Name", type: "Text", width: 150 },
    {
      key: "status",
      label: "Status",
      type: "Badge",
      width: 120,
      statusMap: {
        "In Transit": "In Transit",
        Pending: "Pending",
        Completed: "Completed",
        Cancelled: "Cancelled",
      },
    },
    { key: "distance", label: "Distance (KM)", type: "Text", width: 120 },
  ];

  // Column config for trip legs (nested)
  const tripLegColumns: GridColumnConfig[] = [
    { key: "legNo", label: "Leg No", type: "Text", width: 80 },
    { key: "from", label: "From", type: "Text", width: 160, editable: true },
    { key: "to", label: "To", type: "Text", width: 160, editable: true },
    { key: "distance", label: "Distance (KM)", type: "Text", width: 120, editable: true },
    { key: "departureTime", label: "Departure Time", type: "Time", width: 140, editable: true },
    { key: "eta", label: "ETA", type: "Date", width: 180, editable: true },
    {
      key: "status",
      label: "Status",
      type: "Badge",
      width: 120,
      editable: true,
      statusMap: {
        Completed: "Completed",
        "In Progress": "In Progress",
        Pending: "Pending",
      },
    },
  ];

  // Column config for orders
  const orderColumns: GridColumnConfig[] = [
    { key: "orderId", label: "Order ID", type: "Text", width: 120 },
    { key: "customerName", label: "Customer Name", type: "Text", width: 180 },
    { key: "orderDate", label: "Order Date", type: "Text", width: 120 },
    { key: "totalAmount", label: "Total Amount", type: "Text", width: 120 },
    {
      key: "status",
      label: "Status",
      type: "Badge",
      width: 120,
      statusMap: {
        Delivered: "Delivered",
        Pending: "Pending",
        Processing: "Processing",
      },
    },
  ];

  // Column config for order items (nested)
  const orderItemColumns: GridColumnConfig[] = [
    { key: "itemNo", label: "Item No", type: "Text", width: 80 },
    { key: "productName", label: "Product Name", type: "Text", width: 200, editable: true },
    { key: "quantity", label: "Quantity", type: "Text", width: 100, editable: true },
    { key: "unitPrice", label: "Unit Price", type: "Text", width: 120, editable: true },
    { key: "total", label: "Total", type: "Text", width: 120 },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">SmartGrid with Nested Rows Demo</h1>
        <p className="text-muted-foreground mb-6">
          Extended SmartGrid component that displays nested array data in collapsible sections. All base SmartGrid
          features (sorting, filtering, selection, etc.) remain intact.
        </p>
      </div>

      {/* Example 1: Trips with Legs */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Trip Management with Nested Legs</h2>
          <p className="text-sm text-muted-foreground">
            Each trip can be expanded to view its leg details in a nested grid.
          </p>
        </div>
        <SmartGridWithNestedRows
          columns={tripColumns}
          data={tripsData}
          gridTitle="Trips"
          nestedSectionConfig={{
            nestedDataKey: "tripLegs",
            columns: tripLegColumns,
            title: "Trip Legs",
            initiallyExpanded: true,
            showNestedRowCount: true,
            editableColumns: true,
            onInlineEdit: (parentRowIndex, legIndex, updatedLeg) => {
              handleTripLegUpdate(parentRowIndex, legIndex, updatedLeg);
            },
            onServerUpdate: handleTripLegServerUpdate,
          }}
          editableColumns={true}
          paginationMode="pagination"
          customPageSize={10}
        />
      </div>

      {/* Example 2: Orders with Items */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Order Management with Nested Items</h2>
          <p className="text-sm text-muted-foreground">
            Each order can be expanded to view its line items in a nested grid.
          </p>
        </div>
        <SmartGridWithNestedRows
          columns={orderColumns}
          data={ordersData}
          gridTitle="Orders"
          nestedSectionConfig={{
            nestedDataKey: "orderItems",
            columns: orderItemColumns,
            title: "Order Line Items",
            initiallyExpanded: false,
            showNestedRowCount: true,
            editableColumns: ["productName", "quantity", "unitPrice"],
            onInlineEdit: (parentRowIndex, itemIndex, updatedItem) => {
              handleOrderItemUpdate(parentRowIndex, itemIndex, updatedItem);
            },
            onServerUpdate: handleOrderItemServerUpdate,
          }}
          editableColumns={true}
          paginationMode="pagination"
          customPageSize={10}
        />
      </div>

      {/* Example 3: Without nested section (base SmartGrid behavior) */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Base SmartGrid (No Nested Section)</h2>
          <p className="text-sm text-muted-foreground">
            SmartGridWithNestedRows works as a regular SmartGrid when no nestedSectionConfig is provided.
          </p>
        </div>
        <SmartGridWithNestedRows
          columns={tripColumns}
          data={tripsData}
          gridTitle="Simple Trips View"
          editableColumns={true}
          paginationMode="pagination"
          customPageSize={10}
        />
      </div>
    </div>
  );
}
