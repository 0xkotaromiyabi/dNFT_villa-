import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Calendar, TrendingUp, Settings, Eye, History } from "lucide-react";
import { VillaManagementModal } from "./VillaManagementModal";
import { EventLogModal } from "./EventLogModal";
import villaHero from "@/assets/villa-hero.jpg";

interface Villa {
  id: string;
  name: string;
  location: string;
  currentPrice: number;
  occupancyRate: number;
  lastInspection: string;
  status: "active" | "maintenance" | "inspection";
  conditionScore: number;
  tokenId: string;
}

const mockVillas: Villa[] = [
  {
    id: "1",
    name: "Villa Sunset Paradise",
    location: "Ubud, Bali",
    currentPrice: 2500000,
    occupancyRate: 85,
    lastInspection: "2024-01-15",
    status: "active",
    conditionScore: 92,
    tokenId: "VSP_001"
  },
  {
    id: "2", 
    name: "Ocean View Estate",
    location: "Seminyak, Bali",
    currentPrice: 3200000,
    occupancyRate: 78,
    lastInspection: "2024-01-20",
    status: "maintenance", 
    conditionScore: 87,
    tokenId: "OVE_002"
  },
  {
    id: "3",
    name: "Mountain Ridge Villa",
    location: "Lembang, Bandung",
    currentPrice: 1800000,
    occupancyRate: 92,
    lastInspection: "2024-01-10",
    status: "active",
    conditionScore: 95,
    tokenId: "MRV_003"
  }
];

export function VillaDashboard() {
  const [selectedVilla, setSelectedVilla] = useState<Villa | null>(null);
  const [showManagement, setShowManagement] = useState(false);
  const [showEventLog, setShowEventLog] = useState(false);

  const getStatusColor = (status: Villa['status']) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'maintenance': return 'bg-warning text-warning-foreground';
      case 'inspection': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0 
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={villaHero} 
          alt="Luxury Villa" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-villa-slate/80 to-villa-slate/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Villa RWA Management</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Transparent real-world asset management with blockchain-powered event logging
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <Building2 className="h-4 w-4 text-villa-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Active villa properties</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-villa-emerald" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(7500000)}</div>
              <p className="text-xs text-muted-foreground">Portfolio value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Condition</CardTitle>
              <Eye className="h-4 w-4 text-villa-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">91</div>
              <p className="text-xs text-muted-foreground">Inspection score</p>
            </CardContent>
          </Card>
        </div>

        {/* Villa Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockVillas.map((villa) => (
            <Card key={villa.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{villa.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {villa.location}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(villa.status)}>
                    {villa.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Price</span>
                    <p className="font-semibold text-villa-emerald">{formatPrice(villa.currentPrice)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Token ID</span>
                    <p className="font-mono text-xs">{villa.tokenId}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Occupancy</span>
                    <p className="font-semibold">{villa.occupancyRate}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Condition</span>
                    <p className="font-semibold text-success">{villa.conditionScore}/100</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedVilla(villa);
                      setShowManagement(true);
                    }}
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Manage
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedVilla(villa);
                      setShowEventLog(true);
                    }}
                  >
                    <History className="h-3 w-3 mr-1" />
                    Events
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modals */}
      <VillaManagementModal 
        villa={selectedVilla}
        open={showManagement}
        onOpenChange={setShowManagement}
      />
      
      <EventLogModal 
        villa={selectedVilla}
        open={showEventLog}
        onOpenChange={setShowEventLog}
      />
    </div>
  );
}