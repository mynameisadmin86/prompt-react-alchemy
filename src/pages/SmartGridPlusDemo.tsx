import React, { useState } from "react";
import { SmartGridPlus } from "@/components/SmartGrid";
import { GridColumnConfig } from "@/types/smartgrid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for the demo
const initialData = [
  {
    id: "1",
    productName: "Laptop Pro",
    quantity: null,
    unitPrice: 1299.99,
    category: "Electronics",
    status: "Active",
    dateAdded: "2024-01-15",
    deliveryTime: "14:30",
    supplier: "TechCorp",
    specifications: [
      { id: "RAM-16GB", name: "RAM: 16GB DDR4" },
      { id: "Storage-512GB", name: "Storage: 512GB SSD" },
      { id: "Processor-i7", name: "Processor: Intel i7" },
    ],
    reviews: [
      { reviewer: "John D.", rating: 5, comment: "Excellent performance" },
      { reviewer: "Jane S.", rating: 4, comment: "Great value for money" },
    ],
    notes: "Premium product with extended warranty",
    internalCode: "TECH-LAP-001",
    warehouse: "Warehouse A",
  },
  {
    id: "2",
    productName: "Office Chair",
    quantity: 12,
    unitPrice: 199.99,
    category: "Furniture",
    status: "Active",
    dateAdded: "2024-01-10",
    deliveryTime: "10:00",
    supplier: "FurniCorp",
    specifications: [
      { id: "Material-Mesh", name: "Material: Mesh Back" },
      { id: "Height-Adj", name: "Height: Adjustable" },
      { id: "Wheels-Caster", name: "Wheels: Caster Wheels" },
    ],
    reviews: [{ reviewer: "Mike R.", rating: 4, comment: "Very comfortable" }],
    notes: "Ergonomic design, suitable for long hours",
    internalCode: "FURN-CHR-002",
    warehouse: "Warehouse B",
  },
  {
    id: "3",
    productName: "Smartphone X",
    quantity: 8,
    unitPrice: 899.99,
    category: "Electronics",
    status: "Low Stock",
    dateAdded: "2024-01-08",
    deliveryTime: "16:45",
    supplier: "MobileTech",
    specifications: [
      { id: "Screen-6.5", name: 'Screen: 6.5" OLED' },
      { id: "Camera-108MP", name: "Camera: 108MP Triple" },
      { id: "Battery-4500", name: "Battery: 4500mAh" },
    ],
    reviews: [{ reviewer: "Sarah T.", rating: 5, comment: "Amazing camera quality" }],
    notes: "Latest model with 5G connectivity",
    internalCode: "MOB-PHN-003",
    warehouse: "Warehouse A",
  },
];

const columns: GridColumnConfig[] = [
  {
    key: "productName",
    label: "Product Name",
    type: "String",
    sortable: true,
    filterable: true,
    editable: true,
    width: 200,
  },
  {
    key: "quantity",
    label: "Quantity",
    type: "Integer",
    sortable: true,
    filterable: true,
    editable: true,
    width: 100,
  },
  {
    key: "unitPrice",
    label: "Unit Price",
    type: "Integer",
    sortable: true,
    filterable: true,
    editable: true,
    width: 120,
  },
  {
    key: "category",
    label: "Category",
    type: "Select",
    sortable: true,
    filterable: true,
    editable: true,
    width: 120,
    options: ["Electronics", "Furniture", "Office Supplies", "Tools"],
  },
  {
    key: "status",
    label: "Status",
    type: "Badge",
    sortable: true,
    filterable: true,
    width: 100,
    statusMap: {
      Active: "green",
      "Low Stock": "orange",
      "Out of Stock": "red",
    },
  },
  {
    key: "dateAdded",
    label: "Date Added",
    type: "Date",
    sortable: true,
    filterable: true,
    editable: true,
    width: 120,
  },
  {
    key: "deliveryTime",
    label: "Delivery Time",
    type: "Time",
    sortable: true,
    filterable: true,
    editable: true,
    width: 130,
  },
  {
    key: "supplier",
    label: "Supplier",
    type: "LazySelect",
    sortable: true,
    filterable: true,
    editable: true,
    width: 150,
    fetchOptions: async ({ searchTerm, offset, limit }) => {
      // Mock async data fetching - simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      const allSuppliers = [
        "TechCorp",
        "FurniCorp",
        "MobileTech",
        "OfficeMax",
        "ToolMasters",
        "ElectroHub",
        "SmartDevices",
        "HomeGoods",
      ];
      const filtered = allSuppliers.filter((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
      return filtered.slice(offset, offset + limit).map((s) => ({ id: s, name: s }));
    },
    onChange: (value, rowData) => {
      console.log("Supplier changed:", value, "Row data:", rowData);
    },
  },
  {
    key: "specifications",
    label: "Specifications",
    type: "MultiselectLazySelect",
    sortable: false,
    filterable: false,
    editable: true,
    width: 200,
    fetchOptions: async ({ searchTerm, offset, limit }) => {
      // Mock async data fetching for specifications
      await new Promise((resolve) => setTimeout(resolve, 300));
      const allSpecs = [
        { id: "RAM-16GB", name: "RAM: 16GB DDR4" },
        { id: "RAM-32GB", name: "RAM: 32GB DDR4" },
        { id: "Storage-512GB", name: "Storage: 512GB SSD" },
        { id: "Storage-1TB", name: "Storage: 1TB SSD" },
        { id: "Processor-i7", name: "Processor: Intel i7" },
        { id: "Processor-i9", name: "Processor: Intel i9" },
        { id: "Screen-6.5", name: 'Screen: 6.5" OLED' },
        { id: "Screen-7", name: 'Screen: 7" AMOLED' },
        { id: "Camera-108MP", name: "Camera: 108MP Triple" },
        { id: "Camera-200MP", name: "Camera: 200MP Quad" },
        { id: "Battery-4500", name: "Battery: 4500mAh" },
        { id: "Battery-5000", name: "Battery: 5000mAh" },
        { id: "Material-Mesh", name: "Material: Mesh Back" },
        { id: "Material-Leather", name: "Material: Leather" },
        { id: "Height-Adj", name: "Height: Adjustable" },
        { id: "Wheels-Caster", name: "Wheels: Caster Wheels" },
      ];
      const filtered = allSpecs.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
      return filtered.slice(offset, offset + limit);
    },
    onChange: (value, rowData) => {
      console.log("Specifications changed:", value, "Row data:", rowData);
    },
  },
  {
    key: "reviews",
    label: "Reviews",
    type: "SubRow",
    sortable: false,
    filterable: false,
    width: 150,
    subRowColumns: [
      { key: "reviewer", label: "Reviewer", type: "Text", width: 80 },
      { key: "rating", label: "Rating", type: "Text", width: 60 },
      { key: "comment", label: "Comment", type: "Text", width: 150 },
    ],
  },
  // Subrow columns (collapsed by default)
  {
    key: "notes",
    label: "Notes",
    type: "Text",
    sortable: false,
    filterable: false,
    editable: true,
    width: 200,
    subRow: true,
  },
  {
    key: "internalCode",
    label: "Internal Code",
    type: "String",
    sortable: false,
    filterable: false,
    editable: true,
    width: 150,
    subRow: true,
  },
  {
    key: "warehouse",
    label: "Warehouse",
    type: "Select",
    sortable: false,
    filterable: false,
    editable: true,
    width: 150,
    subRow: true,
    options: ["Warehouse A", "Warehouse B", "Warehouse C", "Warehouse D"],
  },
  {
    key: "actions",
    label: "Actions",
    type: "Text",
    sortable: false,
    filterable: false,
    width: 120,
  },
];

export default function SmartGridPlusDemo() {
  const [data, setData] = useState(initialData);

  const handleAddRow = async (newRow: any) => {
    console.log("Adding new row:", newRow);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleEditRow = async (editedRow: any, rowIndex: number) => {
    console.log("Editing row:", editedRow, "at index:", rowIndex);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleDeleteRow = async (row: any, rowIndex: number) => {
    console.log("Deleting row:", row, "at index:", rowIndex);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const defaultRowValues = {
    productName: "",
    quantity: 0,
    unitPrice: 0,
    category: "Electronics",
    status: "Active",
    dateAdded: new Date().toISOString().split("T")[0],
    deliveryTime: "09:00",
    supplier: "",
    specifications: [],
    reviews: [{ reviewer: "", rating: 5, comment: "" }],
    notes: "",
    internalCode: "",
    warehouse: "Warehouse A",
  };

  const validationRules = {
    requiredFields: ["productName", "supplier"],
    maxLength: {
      productName: 50,
      supplier: 30,
    },
    customValidationFn: (values: Record<string, any>) => {
      const errors: Record<string, string> = {};

      if (values.quantity && values.quantity < 0) {
        errors.quantity = "Quantity must be positive";
      }

      if (values.unitPrice && values.unitPrice < 0) {
        errors.unitPrice = "Unit price must be positive";
      }

      return errors;
    },
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SmartGridPlus Demo</h1>
        <p className="text-muted-foreground mt-2">
          Enhanced grid component with inline row addition and editing capabilities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.filter((item) => item.status === "Active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {data.filter((item) => item.status === "Low Stock").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            Manage your product inventory with inline editing capabilities. Double-click any row to edit, or use the Add
            Row button to create new entries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SmartGridPlus
            columns={columns}
            data={data}
            gridTitle="Product Inventory"
            inlineRowAddition={true}
            inlineRowEditing={true}
            onAddRow={handleAddRow}
            onEditRow={handleEditRow}
            onDeleteRow={handleDeleteRow}
            defaultRowValues={defaultRowValues}
            validationRules={validationRules}
            addRowButtonLabel="Add Product"
            addRowButtonPosition="top-left"
            paginationMode="pagination"
            showEmptyRow={true}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Cell Data Types</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • <strong>String:</strong> Product Name - Text input
                </li>
                <li>
                  • <strong>Integer:</strong> Quantity & Price - Number input
                </li>
                <li>
                  • <strong>Select:</strong> Category - Dropdown selection
                </li>
                <li>
                  • <strong>LazySelect:</strong> Supplier - Searchable async dropdown
                </li>
                <li>
                  • <strong>Date:</strong> Date Added - Date picker
                </li>
                <li>
                  • <strong>Time:</strong> Delivery Time - Time picker
                </li>
                <li>
                  • <strong>Badge:</strong> Status - Color-coded display
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Inline Row Editing</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Double-click rows to edit inline</li>
                <li>• Real-time validation feedback</li>
                <li>• Save/cancel actions with keyboard shortcuts</li>
                <li>• Row highlighting during edit mode</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Data Operations</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Delete rows with confirmation</li>
                <li>• Export data to CSV</li>
                <li>• Advanced filtering and sorting</li>
                <li>• Pagination support</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Validation & UX</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Required field validation</li>
                <li>• Custom validation functions</li>
                <li>• Smooth animations and transitions</li>
                <li>• Toast notifications for actions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
