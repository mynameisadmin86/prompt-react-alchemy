
import { SampleData } from '@/types/gridDemo';

export const sampleData: SampleData[] = [
  {
    id: 'TRIP00000001',
    status: 'Released',
    tripBillingStatus: 'Draft Bill Raised',
    plannedStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
    actualStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
    departurePoint: 'VLA-70',
    arrivalPoint: 'CUR-25',
    customer: '+3',
    resources: '+3',
    departurePointDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
    arrivalPointDetails: 'Currency details for CUR-25',
    customerDetails: [
      { name: 'DB Cargo', id: 'CUS00000123', type: 'customer' },
      { name: 'ABC Rail Goods', id: 'CUS00003214', type: 'customer' },
      { name: 'Wave Cargo', id: 'CUS00012345', type: 'customer' }
    ],
    resourceDetails: [
      { name: 'Train ID', id: 'TR000213', type: 'train' },
      { name: 'AGN01', id: 'Agent-0000001', type: 'agent' },
      { name: '20FT CT', id: '20 Feet Container', type: 'container' }
    ]
  },
  {
    id: 'TRIP00000002',
    status: 'Under Execution',
    tripBillingStatus: 'Not Eligible',
    plannedStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
    actualStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
    departurePoint: 'VLA-70',
    arrivalPoint: 'CUR-25',
    customer: '+3',
    resources: '+3',
    departurePointDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
    arrivalPointDetails: 'Currency details for CUR-25',
    customerDetails: [
      { name: 'DB Cargo', id: 'CUS00000123', type: 'customer' },
      { name: 'ABC Rail Goods', id: 'CUS00003214', type: 'customer' },
      { name: 'Wave Cargo', id: 'CUS00012345', type: 'customer' }
    ],
    resourceDetails: [
      { name: 'Train ID', id: 'TR000213', type: 'train' },
      { name: 'AGN01', id: 'Agent-0000001', type: 'agent' },
      { name: '20FT CT', id: '20 Feet Container', type: 'container' }
    ]
  },
  {
    id: 'TRIP00000003',
    status: 'Initiated',
    tripBillingStatus: 'Revenue Leakage',
    plannedStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
    actualStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
    departurePoint: 'VLA-70',
    arrivalPoint: 'CUR-25',
    customer: '+3',
    resources: '+3',
    departurePointDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
    arrivalPointDetails: 'Currency details for CUR-25',
    customerDetails: [
      { name: 'DB Cargo', id: 'CUS00000123', type: 'customer' },
      { name: 'ABC Rail Goods', id: 'CUS00003214', type: 'customer' },
      { name: 'Wave Cargo', id: 'CUS00012345', type: 'customer' }
    ],
    resourceDetails: [
      { name: 'Train ID', id: 'TR000213', type: 'train' },
      { name: 'AGN01', id: 'Agent-0000001', type: 'agent' },
      { name: '20FT CT', id: '20 Feet Container', type: 'container' }
    ]
  },
  {
    id: 'TRIP00000004',
    status: 'Cancelled',
    tripBillingStatus: 'Invoice Created',
    plannedStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
    actualStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
    departurePoint: 'VLA-70',
    arrivalPoint: 'CUR-25',
    customer: '+3',
    resources: '+3',
    departurePointDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
    arrivalPointDetails: 'Currency details for CUR-25',
    customerDetails: [
      { name: 'DB Cargo', id: 'CUS00000123', type: 'customer' },
      { name: 'ABC Rail Goods', id: 'CUS00003214', type: 'customer' },
      { name: 'Wave Cargo', id: 'CUS00012345', type: 'customer' }
    ],
    resourceDetails: [
      { name: 'Train ID', id: 'TR000213', type: 'train' },
      { name: 'AGN01', id: 'Agent-0000001', type: 'agent' },
      { name: '20FT CT', id: '20 Feet Container', type: 'container' }
    ]
  },
  {
    id: 'TRIP00000005',
    status: 'Deleted',
    tripBillingStatus: 'Invoice Approved',
    plannedStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
    actualStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
    departurePoint: 'VLA-70',
    arrivalPoint: 'CUR-25',
    customer: '+3',
    resources: '+3',
    departurePointDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
    arrivalPointDetails: 'Currency details for CUR-25',
    customerDetails: [
      { name: 'DB Cargo', id: 'CUS00000123', type: 'customer' },
      { name: 'ABC Rail Goods', id: 'CUS00003214', type: 'customer' },
      { name: 'Wave Cargo', id: 'CUS00012345', type: 'customer' }
    ],
    resourceDetails: [
      { name: 'Train ID', id: 'TR000213', type: 'train' },
      { name: 'AGN01', id: 'Agent-0000001', type: 'agent' },
      { name: '20FT CT', id: '20 Feet Container', type: 'container' }
    ]
  },
  {
    id: 'TRIP00000006',
    status: 'Confirmed',
    tripBillingStatus: 'Not Eligible',
    plannedStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
    actualStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
    departurePoint: 'VLA-70',
    arrivalPoint: 'CUR-25',
    customer: '+3',
    resources: '+3',
    departurePointDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
    arrivalPointDetails: 'Currency details for CUR-25',
    customerDetails: [
      { name: 'DB Cargo', id: 'CUS00000123', type: 'customer' },
      { name: 'ABC Rail Goods', id: 'CUS00003214', type: 'customer' },
      { name: 'Wave Cargo', id: 'CUS00012345', type: 'customer' }
    ],
    resourceDetails: [
      { name: 'Train ID', id: 'TR000213', type: 'train' },
      { name: 'AGN01', id: 'Agent-0000001', type: 'agent' },
      { name: '20FT CT', id: '20 Feet Container', type: 'container' }
    ]
  },
  {
    id: 'TRIP00000007',
    status: 'Under Execution',
    tripBillingStatus: 'Revenue Leakage',
    plannedStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
    actualStartEndDateTime: '25-Mar-2025 11:22:34 PM\n27-Mar-2025 11:22:34 PM',
    departurePoint: 'VLA-70',
    arrivalPoint: 'CUR-25',
    customer: '+3',
    resources: '+3',
    departurePointDetails: 'VQL-705\nVolla\n\nAddress\nSardar Patel Rd, Sriram Nagar, Tharamani, Chennai, Tamil Nadu 600113',
    arrivalPointDetails: 'Currency details for CUR-25',
    customerDetails: [
      { name: 'DB Cargo', id: 'CUS00000123', type: 'customer' },
      { name: 'ABC Rail Goods', id: 'CUS00003214', type: 'customer' },
      { name: 'Wave Cargo', id: 'CUS00012345', type: 'customer' }
    ],
    resourceDetails: [
      { name: 'Train ID', id: 'TR000213', type: 'train' },
      { name: 'AGN01', id: 'Agent-0000001', type: 'agent' },
      { name: '20FT CT', id: '20 Feet Container', type: 'container' }
    ]
  }
];
