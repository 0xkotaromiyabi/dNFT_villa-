import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Upload, DollarSign, Wrench, FileText } from "lucide-react";

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

interface VillaManagementModalProps {
  villa: Villa | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VillaManagementModal({ villa, open, onOpenChange }: VillaManagementModalProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [apiUrl, setApiUrl] = useState("https://api.realestate-data.com/properties/");

  if (!villa) return null;

  const handleManualUpdate = async (formData: FormData) => {
    setIsUpdating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const updateType = formData.get('updateType') as string;
    
    toast({
      title: "Update Successful",
      description: `${updateType} has been updated on-chain. Transaction hash: 0x123...abc`,
    });
    
    setIsUpdating(false);
    onOpenChange(false);
  };

  const handleApiUpdate = async () => {
    setIsUpdating(true);
    
    // Simulate external API call and blockchain update
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Price Update Successful", 
      description: "Property price updated from external API. New price: $2,650,000",
    });
    
    setIsUpdating(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{villa.name}</DialogTitle>
          <DialogDescription>
            Manage villa metadata and update blockchain records
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Manual Update
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              API Integration
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manual Metadata Update</CardTitle>
                <CardDescription>
                  Update villa information directly through admin interface
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleManualUpdate(formData);
                }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="updateType">Update Type</Label>
                      <Select name="updateType" defaultValue="inspection">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inspection">Property Inspection</SelectItem>
                          <SelectItem value="maintenance">Maintenance Status</SelectItem>
                          <SelectItem value="occupancy">Occupancy Rate</SelectItem>
                          <SelectItem value="legal">Legal Status</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="conditionScore">Condition Score (1-100)</Label>
                      <Input 
                        name="conditionScore"
                        type="number" 
                        min="1" 
                        max="100" 
                        defaultValue={villa.conditionScore}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="evidenceURI">Evidence URI</Label>
                    <Input 
                      name="evidenceURI"
                      placeholder="https://ipfs.io/ipfs/..." 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Update Notes</Label>
                    <Textarea 
                      name="notes"
                      placeholder="Describe the update being made..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input 
                      name="tags"
                      placeholder="maintenance, plumbing, electrical"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Updating on-chain...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Update Metadata
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>External API Integration</CardTitle>
                <CardDescription>
                  Automatically update villa data from external real estate APIs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiUrl">API Endpoint</Label>
                  <Input 
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="https://api.realestate-data.com/properties/"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Current Price</Label>
                    <p className="text-2xl font-bold text-villa-emerald">
                      ${villa.currentPrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label>Last Updated</Label>
                    <p className="text-sm text-muted-foreground">
                      {villa.lastInspection}
                    </p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">API Response Preview</h4>
                  <pre className="text-xs text-muted-foreground">
{`{
  "property_id": "${villa.tokenId}",
  "current_price": 2650000,
  "market_trend": "increasing",
  "last_sale": "2024-01-20",
  "comparable_sales": [...],
  "occupancy_data": {
    "rate": 87,
    "revenue": 125000
  }
}`}
                  </pre>
                </div>

                <Button 
                  onClick={handleApiUpdate}
                  className="w-full"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Fetching & Updating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Update from API
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Token ID</span>
                    <Badge variant="outline">{villa.tokenId}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span>{villa.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge>{villa.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Price</span>
                    <span className="font-semibold">${villa.currentPrice.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Occupancy Rate</span>
                    <span className="font-semibold">{villa.occupancyRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Condition Score</span>
                    <span className="font-semibold">{villa.conditionScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Inspection</span>
                    <span>{villa.lastInspection}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revenue (Monthly)</span>
                    <span className="font-semibold text-villa-emerald">$12,500</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}