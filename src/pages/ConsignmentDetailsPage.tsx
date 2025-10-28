import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Truck,
  ArrowRight,
  User,
  FileText,
  MapPin,
  Check,
  Plus,
  Download,
  Filter,
  CheckSquare,
  MoreVertical,
  Package,
  Container,
  Weight,
  Box,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LegCard {
  id: number;
  from: string;
  to: string;
  type: "pickup" | "via" | "bhub";
  status: "completed" | "pending";
  customer: string;
  orderNumber: string;
  planned: number;
  actuals: number;
}

interface SummaryCard {
  id: string;
  title: string;
  value: string;
  icon: React.ReactNode;
  iconColor: string;
}

const ConsignmentDetailsPage = () => {
  const [selectedLeg, setSelectedLeg] = useState<number>(1);

  const legs: LegCard[] = [
    {
      id: 1,
      from: "Berlin",
      to: "Berlin",
      type: "pickup",
      status: "completed",
      customer: "ABC Customer",
      orderNumber: "CO00000001",
      planned: 20,
      actuals: 20,
    },
    {
      id: 2,
      from: "Berlin",
      to: "Frankfurt",
      type: "via",
      status: "completed",
      customer: "ABC Customer",
      orderNumber: "CO00000001",
      planned: 20,
      actuals: 20,
    },
    {
      id: 3,
      from: "Frankfurt",
      to: "Paris",
      type: "bhub",
      status: "pending",
      customer: "Multiple",
      orderNumber: "Multiple",
      planned: 20,
      actuals: 20,
    },
  ];

  const summaryCards: SummaryCard[] = [
    {
      id: "wagon",
      title: "Wagon Quantity",
      value: "12 Nos",
      icon: <Truck className="h-5 w-5" />,
      iconColor: "text-blue-500",
    },
    {
      id: "container",
      title: "Container Quantity",
      value: "12 Nos",
      icon: <Container className="h-5 w-5" />,
      iconColor: "text-purple-500",
    },
    {
      id: "weight",
      title: "Product Weight",
      value: "23 Ton",
      icon: <Weight className="h-5 w-5" />,
      iconColor: "text-pink-500",
    },
    {
      id: "thu",
      title: "THU Quantity",
      value: "10 Nos",
      icon: <Box className="h-5 w-5" />,
      iconColor: "text-cyan-500",
    },
  ];

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "pickup":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "via":
        return "bg-purple-100 text-purple-700 hover:bg-purple-100";
      case "bhub":
        return "bg-cyan-100 text-cyan-700 hover:bg-cyan-100";
      default:
        return "secondary";
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Legs */}
      <div className="w-80 border-r bg-card p-4 overflow-y-auto">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-muted-foreground">
              Total Legs
            </h2>
            <Badge variant="secondary" className="rounded-full">
              {legs.length}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Leg
          </Button>
        </div>

        <div className="space-y-3">
          {legs.map((leg) => (
            <Card
              key={leg.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedLeg === leg.id && "ring-2 ring-primary"
              )}
              onClick={() => setSelectedLeg(leg.id)}
            >
              <CardContent className="p-4">
                {/* Header with route and badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm font-semibold text-foreground">
                      {leg.id}: {leg.from}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-semibold text-foreground truncate">
                      {leg.to}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <Badge
                      className={cn(
                        "text-xs capitalize",
                        getBadgeVariant(leg.type)
                      )}
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      {leg.type}
                    </Badge>
                    {leg.status === "completed" && (
                      <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Planned/Actuals */}
                <div className="text-xs text-muted-foreground mb-3">
                  {leg.planned} Planned/{leg.actuals} Actuals
                </div>

                {/* Customer and Order */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {leg.customer}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {leg.orderNumber}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Consignment Details</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Actuals
              </Button>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Consignment Selector */}
          <div className="mb-6">
            <select className="w-64 h-10 px-3 rounded-md border border-input bg-background text-sm">
              <option>CO00000001</option>
            </select>
            <label className="inline-flex items-center ml-4">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-muted-foreground">
                Pickup Complete for this CO
              </span>
            </label>
          </div>

          {/* Summary Cards */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-medium">Planned</h2>
                <Badge variant="secondary" className="rounded-full">
                  5
                </Badge>
              </div>
              <Button variant="ghost" size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {summaryCards.map((card) => (
                <Card key={card.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "h-12 w-12 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0",
                          card.iconColor
                        )}
                      >
                        {card.icon}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-lg font-semibold">{card.value}</p>
                        <p className="text-xs text-muted-foreground">
                          {card.title}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Plan List Table */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Plan List</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Input
                      placeholder="Search"
                      className="w-64 pr-8"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <CheckSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Wagon ID Type
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Container ID Type
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Hazardous Goods
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Departure and Arrival
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Plan From & To Date
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Price
                      </th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4].map((row) => (
                      <tr key={row} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div>
                            <div className="text-sm font-medium text-blue-600">
                              WAG00000001
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Habbins
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="text-sm">CONT100001</div>
                            <div className="text-xs text-muted-foreground">
                              Container A
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {row > 1 && (
                            <div className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs">
                              ⚠
                            </div>
                          )}
                          {row === 1 && <span className="text-sm">-</span>}
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            Frankfurt Station A - Frankfurt Station B
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            12-Mar-2025 to 12-Mar-2025
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm font-medium">€ 1395.00</div>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline">Send Mail</Button>
            <Button>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsignmentDetailsPage;
