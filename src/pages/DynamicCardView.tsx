
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddIcon from '../../assets/images/addIcon.png';
import DynamicCard from '../components/DynamicCard/DynamicCard';
import { Input } from '@/components/ui/input';

const DynamicCardView = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMoreInfoOpen, setMoreInfoOpen] = useState(false);
  const [isBack, setIsBack] = useState(true);

  const cardData = [
    {
      id: "1",
      title: "R01 - Wagon Rentals",
      subtitle: "Vehicle",
      wagons: "10 Wagons",
      price: "€ 45595.00",
      trainType: "Block Train Conventional",
      repairType: "Repair",
      date: "12-Mar-2025 to 12-Mar-2025",
      rateType: "Rate Per Unit-Buy Sell",
      location: "Frankfurt Station A - Frankfurt Station B",
      draftBill: "DB/000234",
      status: "Approved",
    },
    {
      id: "2",
      title: "R01 - Wagon Rentals",
      subtitle: "Vehicle",
      wagons: "10 Wagons",
      price: "€ 45595.00",
      trainType: "Block Train Conventional",
      repairType: "Repair",
      date: "12-Mar-2025 to 12-Mar-2025",
      rateType: "Rate Per Unit-Buy Sell",
      location: "Frankfurt Station A - Frankfurt Station B",
      draftBill: "DB/000234",
      status: "Failed",
    },
    {
      id: "3",
      title: "R01 - Wagon Rentals",
      subtitle: "Vehicle",
      wagons: "10 Wagons",
      price: "€ 45595.00",
      trainType: "Block Train Conventional",
      repairType: "Repair",
      date: "12-Mar-2025 to 12-Mar-2025",
      rateType: "Rate Per Unit-Buy Sell",
      location: "Frankfurt Station A - Frankfurt Station B",
      draftBill: "DB/000234",
      status: "Under Amendment",
    },
  ];

  return (
    <>
        <div className='w-[80%] m-auto mt-6 mb-6'>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    Resource Group Details
                    <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">3</span>
                </h2>
                <div className="flex items-center gap-3">
                <div className="relative">
                    <Input
                    name='grid-search-input'
                    placeholder="Search"
                    className="border border-gray-300 rounded text-sm placeholder-gray-400 px-2 py-1 pl-3 w-64 h-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ width: 200 }}
                    />
                    <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
                </div>
                <Button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 bg-gray-100 text-gray-600 p-0 border border-gray-300">
                    <Plus className="w-4 h-4" />
                </Button>
                </div>
            </div>
            <div className="mt-4">
                <DynamicCard data={cardData} />
            </div>
        </div>
    </>
  );
};

export default DynamicCardView;