import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, ExternalLink, Hash, User, Activity } from "lucide-react";

interface Villa {
  id: string;
  name: string;
  tokenId: string;
}

interface EventLogModalProps {
  villa: Villa | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EventLog {
  id: string;
  timestamp: string;
  event: string;
  description: string;
  transactionHash: string;
  blockNumber: number;
  gasUsed: string;
  status: "success" | "pending" | "failed";
  initiator: string;
  metadata?: Record<string, any>;
}

const mockEventLogs: EventLog[] = [
  {
    id: "1",
    timestamp: "2024-01-20T14:30:00Z",
    event: "PriceUpdate",
    description: "Property price updated via external API",
    transactionHash: "0x742d35cc16c3c2c9f2c7b46c5e7b32b9f1e2a1d4c3b2a1d4c3b2a1d4c3b2a1d4",
    blockNumber: 12345678,
    gasUsed: "42,150",
    status: "success",
    initiator: "0x1234...5678",
    metadata: {
      oldPrice: 2500000,
      newPrice: 2650000,
      source: "realestate-api.com"
    }
  },
  {
    id: "2", 
    timestamp: "2024-01-18T09:15:00Z",
    event: "InspectionUpdate",
    description: "Property inspection completed - condition score updated",
    transactionHash: "0x845f28bc17d4d3c1e3d8c47d6f8c43c1f2f3b2e5d4c3b2a1d4c3b2a1d4c3b2a1",
    blockNumber: 12344521,
    gasUsed: "38,920",
    status: "success",
    initiator: "admin.eth",
    metadata: {
      conditionScore: 92,
      inspector: "certified-inspector@company.com",
      evidenceURI: "ipfs://Qm..."
    }
  },
  {
    id: "3",
    timestamp: "2024-01-15T16:45:00Z", 
    event: "MaintenanceStatusUpdate",
    description: "Pool maintenance completed - status changed to active",
    transactionHash: "0x923c45de28e5e4d2f4e9d58e7f9d54d2f3f4c3e6d5c4b3a2d5c4b3a2d5c4b3a2",
    blockNumber: 12343890,
    gasUsed: "31,450",
    status: "success",
    initiator: "maintenance.eth",
    metadata: {
      maintenanceType: "pool_cleaning",
      cost: 850,
      duration: "2 days"
    }
  },
  {
    id: "4",
    timestamp: "2024-01-12T11:20:00Z",
    event: "OccupancyUpdate", 
    description: "Monthly occupancy rate updated",
    transactionHash: "0xa14b67ef39f6f5e3f5faE69f8fae65e3f4f5d4f7e6d5c4b3a2e6d5c4b3a2e6d5",
    blockNumber: 12342156,
    gasUsed: "29,380",
    status: "success",
    initiator: "booking-system",
    metadata: {
      occupancyRate: 85,
      revenue: 12500,
      bookings: 23
    }
  },
  {
    id: "5",
    timestamp: "2024-01-10T08:00:00Z",
    event: "LegalStatusUpdate",
    description: "Property ownership transfer registered",
    transactionHash: "0xb25c78fg40g7g6f4g6gbf70g9gbf76f4g5g6e5g8f7e6d5c4b3a3f7e6d5c4b3a3",
    blockNumber: 12341234,
    gasUsed: "51,220",
    status: "success", 
    initiator: "notary.eth",
    metadata: {
      previousOwner: "0xabcd...1234",
      newOwner: "0x5678...efgh",
      notaryFee: 2500
    }
  }
];

export function EventLogModal({ villa, open, onOpenChange }: EventLogModalProps) {
  if (!villa) return null;

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'PriceUpdate':
        return <Activity className="h-4 w-4 text-villa-emerald" />;
      case 'InspectionUpdate':
        return <Calendar className="h-4 w-4 text-primary" />;
      case 'MaintenanceStatusUpdate':
        return <User className="h-4 w-4 text-warning" />;
      case 'OccupancyUpdate':
        return <Hash className="h-4 w-4 text-villa-gold" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: EventLog['status']) => {
    switch (status) {
      case 'success': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'failed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Event Log - {villa.name}
          </DialogTitle>
          <DialogDescription>
            Blockchain transaction history and transparency log for {villa.tokenId}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-4">
            {mockEventLogs.map((log, index) => (
              <Card key={log.id} className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getEventIcon(log.event)}
                      <div>
                        <h4 className="font-semibold text-lg">{log.event}</h4>
                        <p className="text-sm text-muted-foreground">{log.description}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(log.status)}>
                      {log.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Timestamp</span>
                      <p className="font-mono">{formatTimestamp(log.timestamp)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Block</span>
                      <p className="font-mono">#{log.blockNumber.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Gas Used</span>
                      <p className="font-mono">{log.gasUsed}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Initiator</span>
                      <p className="font-mono text-xs">{log.initiator}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Hash className="h-3 w-3" />
                      <span className="font-mono text-xs">{truncateHash(log.transactionHash)}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground cursor-pointer" />
                    </div>
                  </div>

                  {log.metadata && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm font-medium text-villa-emerald hover:underline">
                        View Metadata
                      </summary>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <pre className="text-xs overflow-x-auto">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </div>
                    </details>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}