import React, { useState, useCallback, useRef } from "react";
import { SmartGridPlus } from "@/components/SmartGrid";
import { GridColumnConfig } from "@/types/smartgrid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for cascading selects
const countriesData = [
  { id: "US", name: "United States" },
  { id: "CA", name: "Canada" },
  { id: "UK", name: "United Kingdom" },
  { id: "DE", name: "Germany" },
  { id: "FR", name: "France" },
  { id: "IN", name: "India" },
  { id: "AU", name: "Australia" },
];

const statesData: Record<string, { id: string; name: string }[]> = {
  US: [
    { id: "CA", name: "California" },
    { id: "TX", name: "Texas" },
    { id: "NY", name: "New York" },
    { id: "FL", name: "Florida" },
  ],
  CA: [
    { id: "ON", name: "Ontario" },
    { id: "QC", name: "Quebec" },
    { id: "BC", name: "British Columbia" },
    { id: "AB", name: "Alberta" },
  ],
  UK: [
    { id: "ENG", name: "England" },
    { id: "SCT", name: "Scotland" },
    { id: "WLS", name: "Wales" },
    { id: "NIR", name: "Northern Ireland" },
  ],
  DE: [
    { id: "BY", name: "Bavaria" },
    { id: "NW", name: "North Rhine-Westphalia" },
    { id: "BW", name: "Baden-Württemberg" },
    { id: "HE", name: "Hesse" },
  ],
  FR: [
    { id: "IDF", name: "Île-de-France" },
    { id: "PAC", name: "Provence-Alpes-Côte d'Azur" },
    { id: "ARA", name: "Auvergne-Rhône-Alpes" },
    { id: "NAQ", name: "Nouvelle-Aquitaine" },
  ],
  IN: [
    { id: "MH", name: "Maharashtra" },
    { id: "KA", name: "Karnataka" },
    { id: "TN", name: "Tamil Nadu" },
    { id: "DL", name: "Delhi" },
  ],
  AU: [
    { id: "NSW", name: "New South Wales" },
    { id: "VIC", name: "Victoria" },
    { id: "QLD", name: "Queensland" },
    { id: "WA", name: "Western Australia" },
  ],
};

const citiesData: Record<string, { id: string; name: string }[]> = {
  // US States
  CA: [
    { id: "LA", name: "Los Angeles" },
    { id: "SF", name: "San Francisco" },
    { id: "SD", name: "San Diego" },
  ],
  TX: [
    { id: "HOU", name: "Houston" },
    { id: "DAL", name: "Dallas" },
    { id: "AUS", name: "Austin" },
  ],
  NY: [
    { id: "NYC", name: "New York City" },
    { id: "BUF", name: "Buffalo" },
    { id: "ALB", name: "Albany" },
  ],
  FL: [
    { id: "MIA", name: "Miami" },
    { id: "ORL", name: "Orlando" },
    { id: "TPA", name: "Tampa" },
  ],
  // Canada Provinces
  ON: [
    { id: "TOR", name: "Toronto" },
    { id: "OTT", name: "Ottawa" },
    { id: "MIS", name: "Mississauga" },
  ],
  QC: [
    { id: "MTL", name: "Montreal" },
    { id: "QBC", name: "Quebec City" },
    { id: "LAV", name: "Laval" },
  ],
  BC: [
    { id: "VAN", name: "Vancouver" },
    { id: "VIC", name: "Victoria" },
    { id: "SUR", name: "Surrey" },
  ],
  AB: [
    { id: "CGY", name: "Calgary" },
    { id: "EDM", name: "Edmonton" },
    { id: "RD", name: "Red Deer" },
  ],
  // UK Countries
  ENG: [
    { id: "LON", name: "London" },
    { id: "MAN", name: "Manchester" },
    { id: "BIR", name: "Birmingham" },
  ],
  SCT: [
    { id: "EDI", name: "Edinburgh" },
    { id: "GLA", name: "Glasgow" },
    { id: "ABD", name: "Aberdeen" },
  ],
  WLS: [
    { id: "CDF", name: "Cardiff" },
    { id: "SWA", name: "Swansea" },
    { id: "NWP", name: "Newport" },
  ],
  NIR: [
    { id: "BEL", name: "Belfast" },
    { id: "DER", name: "Derry" },
    { id: "LIS", name: "Lisburn" },
  ],
  // German States
  BY: [
    { id: "MUC", name: "Munich" },
    { id: "NUE", name: "Nuremberg" },
    { id: "AUG", name: "Augsburg" },
  ],
  NW: [
    { id: "CGN", name: "Cologne" },
    { id: "DUS", name: "Düsseldorf" },
    { id: "DOR", name: "Dortmund" },
  ],
  BW: [
    { id: "STR", name: "Stuttgart" },
    { id: "KA", name: "Karlsruhe" },
    { id: "MA", name: "Mannheim" },
  ],
  HE: [
    { id: "FRA", name: "Frankfurt" },
    { id: "WI", name: "Wiesbaden" },
    { id: "KS", name: "Kassel" },
  ],
  // French Regions
  IDF: [
    { id: "PAR", name: "Paris" },
    { id: "VER", name: "Versailles" },
    { id: "NAN", name: "Nanterre" },
  ],
  PAC: [
    { id: "MAR", name: "Marseille" },
    { id: "NIC", name: "Nice" },
    { id: "TLN", name: "Toulon" },
  ],
  ARA: [
    { id: "LYO", name: "Lyon" },
    { id: "GRE", name: "Grenoble" },
    { id: "STE", name: "Saint-Étienne" },
  ],
  NAQ: [
    { id: "BOR", name: "Bordeaux" },
    { id: "LIM", name: "Limoges" },
    { id: "PAU", name: "Pau" },
  ],
  // Indian States
  MH: [
    { id: "MUM", name: "Mumbai" },
    { id: "PUN", name: "Pune" },
    { id: "NAG", name: "Nagpur" },
  ],
  KA: [
    { id: "BLR", name: "Bangalore" },
    { id: "MYS", name: "Mysore" },
    { id: "HUB", name: "Hubli" },
  ],
  TN: [
    { id: "CHE", name: "Chennai" },
    { id: "CBE", name: "Coimbatore" },
    { id: "MDU", name: "Madurai" },
  ],
  DL: [
    { id: "NDL", name: "New Delhi" },
    { id: "GGN", name: "Gurgaon" },
    { id: "NOI", name: "Noida" },
  ],
  // Australian States
  NSW: [
    { id: "SYD", name: "Sydney" },
    { id: "NEW", name: "Newcastle" },
    { id: "WOL", name: "Wollongong" },
  ],
  VIC: [
    { id: "MEL", name: "Melbourne" },
    { id: "GEE", name: "Geelong" },
    { id: "BAL", name: "Ballarat" },
  ],
  QLD: [
    { id: "BNE", name: "Brisbane" },
    { id: "GC", name: "Gold Coast" },
    { id: "CNS", name: "Cairns" },
  ],
  WA: [
    { id: "PER", name: "Perth" },
    { id: "FRE", name: "Fremantle" },
    { id: "BUN", name: "Bunbury" },
  ],
};

// Initial data for the grid
const initialData = [
  {
    id: "1",
    name: "John Doe",
    country: "US",
    state: "CA",
    city: "LA",
    notes: "Primary contact",
  },
  {
    id: "2",
    name: "Jane Smith",
    country: "UK",
    state: "ENG",
    city: "LON",
    notes: "Secondary contact",
  },
  {
    id: "3",
    name: "Hans Mueller",
    country: "DE",
    state: "BY",
    city: "MUC",
    notes: "European office",
  },
];

export default function CascadingLazySelectDemo() {
  const [data, setData] = useState(initialData);
  // Store current row values to enable cascading
  const rowValuesRef = useRef<Record<string, Record<string, any>>>({});

  // Fetch countries (first level)
  const fetchCountries = useCallback(async ({ searchTerm, offset, limit }: { searchTerm: string; offset: number; limit: number }) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const filtered = countriesData.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered.slice(offset, offset + limit);
  }, []);

  // Fetch states based on selected country (second level)
  const fetchStates = useCallback(async ({ searchTerm, offset, limit, rowData }: { searchTerm: string; offset: number; limit: number; rowData?: any }) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const countryId = rowData?.country || "";
    const states = statesData[countryId] || [];
    const filtered = states.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered.slice(offset, offset + limit);
  }, []);

  // Fetch cities based on selected state (third level)
  const fetchCities = useCallback(async ({ searchTerm, offset, limit, rowData }: { searchTerm: string; offset: number; limit: number; rowData?: any }) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const stateId = rowData?.state || "";
    const cities = citiesData[stateId] || [];
    const filtered = cities.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered.slice(offset, offset + limit);
  }, []);

  const columns: GridColumnConfig[] = [
    {
      key: "name",
      label: "Name",
      type: "String",
      sortable: true,
      filterable: true,
      editable: true,
      width: 180,
    },
    {
      key: "country",
      label: "Country",
      type: "LazySelect",
      sortable: true,
      filterable: true,
      editable: true,
      width: 180,
      fetchOptions: fetchCountries,
      onChange: (value, rowData) => {
        console.log("Country changed:", value, "Row data:", rowData);
        // When country changes, clear state and city
        if (rowData) {
          const rowId = rowData.id;
          rowValuesRef.current[rowId] = {
            ...rowValuesRef.current[rowId],
            country: value,
            state: "",
            city: "",
          };
        }
      },
    },
    {
      key: "state",
      label: "State/Province",
      type: "LazySelect",
      sortable: true,
      filterable: true,
      editable: true,
      width: 180,
      fetchOptions: fetchStates,
      onChange: (value, rowData) => {
        console.log("State changed:", value, "Row data:", rowData);
        // When state changes, clear city
        if (rowData) {
          const rowId = rowData.id;
          rowValuesRef.current[rowId] = {
            ...rowValuesRef.current[rowId],
            state: value,
            city: "",
          };
        }
      },
    },
    {
      key: "city",
      label: "City",
      type: "LazySelect",
      sortable: true,
      filterable: true,
      editable: true,
      width: 180,
      fetchOptions: fetchCities,
      onChange: (value, rowData) => {
        console.log("City changed:", value, "Row data:", rowData);
      },
    },
    {
      key: "notes",
      label: "Notes",
      type: "Text",
      sortable: false,
      filterable: false,
      editable: true,
      width: 200,
    },
  ];

  const handleAddRow = async (newRow: any) => {
    console.log("Adding new row:", newRow);
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handleEditRow = async (editedRow: any, rowIndex: number) => {
    console.log("Editing row:", editedRow, "at index:", rowIndex);
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handleDeleteRow = async (row: any, rowIndex: number) => {
    console.log("Deleting row:", row, "at index:", rowIndex);
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const defaultRowValues = {
    name: "",
    country: "",
    state: "",
    city: "",
    notes: "",
  };

  const validationRules = {
    requiredFields: ["name", "country"],
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cascading LazySelect Demo</h1>
        <p className="text-muted-foreground mt-2">
          Demonstrates dependent/cascading LazySelect columns where selecting a value in one column loads options for the next.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Location Management</CardTitle>
          <CardDescription>
            Select a Country to load States/Provinces, then select a State to load Cities.
            Double-click a row to edit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SmartGridPlus
            columns={columns}
            data={data}
            gridTitle="Cascading Select Demo"
            inlineRowAddition={true}
            inlineRowEditing={true}
            onAddRow={handleAddRow}
            onEditRow={handleEditRow}
            onDeleteRow={handleDeleteRow}
            defaultRowValues={defaultRowValues}
            validationRules={validationRules}
            addRowButtonLabel="Add Location"
            addRowButtonPosition="top-left"
            paginationMode="pagination"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Cascading Logic</h4>
              <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                <li>• <strong>Country:</strong> Independent dropdown - loads all available countries</li>
                <li>• <strong>State/Province:</strong> Depends on Country - loads states only for selected country</li>
                <li>• <strong>City:</strong> Depends on State - loads cities only for selected state</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Behavior</h4>
              <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                <li>• When you change Country, State and City are cleared</li>
                <li>• When you change State, City is cleared</li>
                <li>• The fetchOptions function receives rowData which contains current row values</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
