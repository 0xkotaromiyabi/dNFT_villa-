import React, { useMemo, useState, useEffect, useCallback } from "react";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { 
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Building2, Hammer, UserCheck, PlusCircle, RefreshCw, Search } from "lucide-react";

/**
 * Villa RWA dApp for Sui Move smart contracts
 * 
 * Features:
 * - Connect wallet & manage network
 * - Configure smart contract addresses
 * - Mint villa NFTs with metadata
 * - Update villa properties (inspection, maintenance, occupancy)
 * - Browse and manage villa portfolio
 */

const DEFAULT_RPC = getFullnodeUrl("mainnet");
const client = new SuiClient({ url: DEFAULT_RPC });

function ConditionBadge({ score }: { score: number }) {
  let label = "Critical";
  let cls = "bg-destructive text-destructive-foreground";
  if (score >= 85) { label = "Excellent"; cls = "bg-emerald-600 text-white"; }
  else if (score >= 65) { label = "Good"; cls = "bg-lime-600 text-white"; }
  else if (score >= 45) { label = "Fair"; cls = "bg-amber-600 text-white"; }
  else if (score >= 25) { label = "Poor"; cls = "bg-red-600 text-white"; }
  return <Badge className={cls}>{label} ({score})</Badge>;
}

function VillaCard({ v, onRefresh }: { v: any; onRefresh: () => void }) {
  const f = v.data?.content?.fields;
  const tags = f?.tags || [];
  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">{f?.name}</h3>
          </div>
          <Button size="sm" variant="outline" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-1"/>Refresh
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <ConditionBadge score={Number(f?.condition_score || 0)} />
          {f?.occupied ? 
            <Badge variant="default">Occupied</Badge> : 
            <Badge variant="outline">Vacant</Badge>
          }
          {f?.undergoing_maintenance ? 
            <Badge className="bg-indigo-600 text-white">Maintenance</Badge> : null
          }
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div>
            <div className="text-muted-foreground">Image</div>
            <a className="text-primary underline break-all" href={f?.image_url} target="_blank" rel="noreferrer">{f?.image_url}</a>
          </div>
          <div>
            <div className="text-muted-foreground">Evidence</div>
            <a className="text-primary underline break-all" href={f?.evidence_uri} target="_blank" rel="noreferrer">{f?.evidence_uri}</a>
          </div>
          <div>
            <div className="text-muted-foreground">Gallery</div>
            <a className="text-primary underline break-all" href={f?.gallery_uri} target="_blank" rel="noreferrer">{f?.gallery_uri}</a>
          </div>
        </div>
        <div className="text-muted-foreground text-sm">{f?.description}</div>
        <div className="flex flex-wrap gap-1">
          {tags.map((t: string, i: number) => 
            <Badge key={i} variant="secondary">{t}</Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground">Object ID: {v.data?.objectId}</div>
      </CardContent>
    </Card>
  );
}

function MintForm({ pkg, collectionId, minterCapId, onDone }: { 
  pkg: string; 
  collectionId: string; 
  minterCapId: string; 
  onDone: () => void; 
}) {
  const acct = useCurrentAccount();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const [form, setForm] = useState({
    name: "Villa Luxury Resort",
    description: "Premium beachfront villa with modern amenities",
    image_url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    initial_condition: 90,
    occupied: false,
    evidence_uri: "ipfs://QmExample...",
    gallery_uri: "ipfs://QmGallery...",
    tags: "luxury,beachfront,pool",
    recipient: "",
  });

  const submit = useCallback(() => {
    if (!acct) return;
    const tx = new Transaction();
    
    const tagsArray = form.tags.split(",").map((s) => s.trim()).filter(Boolean);
    
    tx.moveCall({
      target: `${pkg}::villa_dnft::mint_villa_entry`,
      arguments: [
        tx.object(collectionId),
        tx.object(minterCapId),
        tx.pure.string(form.name),
        tx.pure.string(form.description),
        tx.pure.string(form.image_url),
        tx.pure.u8(Number(form.initial_condition)),
        tx.pure.bool(!!form.occupied),
        tx.pure.string(form.evidence_uri),
        tx.pure.string(form.gallery_uri),
        tx.pure.vector("string", tagsArray),
        tx.pure.address(form.recipient || acct.address),
        tx.object("0x6"), // Clock
      ],
    });

    signAndExecute(
      { transaction: tx },
      { onSuccess: onDone, onError: console.error }
    );
  }, [acct, form, signAndExecute, pkg, collectionId, minterCapId, onDone]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          placeholder="Villa name" 
          value={form.name} 
          onChange={(e)=>setForm({...form,name:e.target.value})}
        />
        <Input 
          placeholder="Image URL" 
          value={form.image_url} 
          onChange={(e)=>setForm({...form,image_url:e.target.value})}
        />
        <Textarea 
          placeholder="Description" 
          value={form.description} 
          onChange={(e)=>setForm({...form,description:e.target.value})}
          className="md:col-span-2"
        />
        <Input 
          placeholder="Initial Condition (0-100)" 
          type="number" 
          min="0"
          max="100"
          value={form.initial_condition} 
          onChange={(e)=>setForm({...form,initial_condition:e.target.valueAsNumber})}
        />
        <Input 
          placeholder="Evidence URI" 
          value={form.evidence_uri} 
          onChange={(e)=>setForm({...form,evidence_uri:e.target.value})}
        />
        <Input 
          placeholder="Gallery URI" 
          value={form.gallery_uri} 
          onChange={(e)=>setForm({...form,gallery_uri:e.target.value})}
        />
        <Input 
          placeholder="Tags (comma-separated)" 
          value={form.tags} 
          onChange={(e)=>setForm({...form,tags:e.target.value})}
        />
        <Input 
          placeholder="Recipient address (optional)" 
          value={form.recipient} 
          onChange={(e)=>setForm({...form,recipient:e.target.value})}
          className="md:col-span-2"
        />
      </div>
      <Button onClick={submit} disabled={isPending} className="w-full">
        {isPending ? 
          <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : 
          <PlusCircle className="w-4 h-4 mr-2"/>
        }
        Mint Villa NFT
      </Button>
    </div>
  );
}

function UpdateForms({ pkg, collectionId, assetCapId, villaId, onDone }: { 
  pkg: string; 
  collectionId: string; 
  assetCapId: string; 
  villaId: string; 
  onDone: () => void; 
}) {
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const [inspection, setInspection] = useState({ 
    score: 85, 
    evidence_uri: "ipfs://QmInspection...", 
    tags: "inspection,passed,excellent" 
  });
  const [maintenance, setMaintenance] = useState({ 
    active: false, 
    renovated_at_ms: "" 
  });
  const [occupied, setOccupied] = useState(false);

  const doInspection = useCallback(() => {
    const tx = new Transaction();
    const tagsArray = inspection.tags.split(",").map((s)=>s.trim()).filter(Boolean);
    
    tx.moveCall({
      target: `${pkg}::villa_dnft::set_inspection`,
      arguments: [
        tx.object(collectionId),
        tx.object(villaId),
        tx.object(assetCapId),
        tx.pure.u8(Number(inspection.score)),
        tx.pure.string(inspection.evidence_uri),
        tx.pure.vector("string", tagsArray),
        tx.object("0x6"),
      ],
    });
    signAndExecute({ transaction: tx }, { onSuccess: onDone, onError: console.error });
  }, [pkg, collectionId, villaId, assetCapId, inspection, signAndExecute, onDone]);

  const doMaintenance = useCallback(() => {
    const tx = new Transaction();
    const renovated = maintenance.renovated_at_ms ? 
      tx.pure.u64(Number(maintenance.renovated_at_ms)) : 
      tx.pure.option("u64", null);
      
    tx.moveCall({
      target: `${pkg}::villa_dnft::set_maintenance_status`,
      arguments: [
        tx.object(collectionId),
        tx.object(villaId),
        tx.object(assetCapId),
        tx.pure.bool(!!maintenance.active),
        renovated,
        tx.object("0x6"),
      ],
    });
    signAndExecute({ transaction: tx }, { onSuccess: onDone, onError: console.error });
  }, [pkg, collectionId, villaId, assetCapId, maintenance, signAndExecute, onDone]);

  const doOccupied = useCallback(() => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${pkg}::villa_dnft::set_occupied`,
      arguments: [
        tx.object(collectionId),
        tx.object(villaId),
        tx.object(assetCapId),
        tx.pure.bool(!!occupied),
        tx.object("0x6"),
      ],
    });
    signAndExecute({ transaction: tx }, { onSuccess: onDone, onError: console.error });
  }, [pkg, collectionId, villaId, assetCapId, occupied, signAndExecute, onDone]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 font-medium">
            <Hammer className="w-4 h-4 text-primary"/>
            Property Inspection
          </div>
          <Input 
            type="number" 
            placeholder="Condition Score (0-100)" 
            min="0"
            max="100"
            value={inspection.score} 
            onChange={(e)=>setInspection({...inspection, score: e.target.valueAsNumber})}
          />
          <Input 
            placeholder="Evidence URI" 
            value={inspection.evidence_uri} 
            onChange={(e)=>setInspection({...inspection, evidence_uri: e.target.value})}
          />
          <Input 
            placeholder="Tags (comma-separated)" 
            value={inspection.tags} 
            onChange={(e)=>setInspection({...inspection, tags: e.target.value})}
          />
          <Button onClick={doInspection} disabled={isPending} className="w-full">
            Update Inspection
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 font-medium">
            <Hammer className="w-4 h-4 text-primary"/>
            Maintenance Status
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="maintenance-active"
              checked={maintenance.active} 
              onChange={(e)=>setMaintenance({...maintenance, active: e.target.checked})} 
              className="rounded"
            />
            <label htmlFor="maintenance-active" className="text-sm">Under Maintenance</label>
          </div>
          <Input 
            type="number" 
            placeholder="Renovation timestamp (ms)" 
            value={maintenance.renovated_at_ms} 
            onChange={(e)=>setMaintenance({...maintenance, renovated_at_ms: e.target.value})}
          />
          <Button onClick={doMaintenance} disabled={isPending} className="w-full">
            Update Maintenance
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 font-medium">
            <UserCheck className="w-4 h-4 text-primary"/>
            Occupancy Status
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="villa-occupied"
              checked={occupied} 
              onChange={(e)=>setOccupied(e.target.checked)} 
              className="rounded"
            />
            <label htmlFor="villa-occupied" className="text-sm">Currently Occupied</label>
          </div>
          <Button onClick={doOccupied} disabled={isPending} className="w-full">
            Update Occupancy
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuiVillaDApp() {
  const [pkg, setPkg] = useState("0xYOUR_PACKAGE_ID");
  const [collectionId, setCollectionId] = useState("0xCOLLECTION_OBJECT_ID");
  const [minterCapId, setMinterCapId] = useState("0xMINTER_CAP_OBJECT_ID");
  const [assetCapId, setAssetCapId] = useState("0xASSET_MANAGER_CAP_OBJECT_ID");
  const [addressFilter, setAddressFilter] = useState("");
  const acct = useCurrentAccount();
  const owner = addressFilter || acct?.address || "";
  const [loading, setLoading] = useState(false);
  const [villas, setVillas] = useState<any[]>([]);

  const fetchVillas = useCallback(async () => {
    if (!owner || pkg === "0xYOUR_PACKAGE_ID") return;
    setLoading(true);
    try {
      const type = `${pkg}::villa_dnft::VillaNFT`;
      const resp = await client.getOwnedObjects({
        owner,
        filter: { StructType: type },
        options: { showType: true, showContent: true },
      });
      setVillas(resp.data);
    } catch (e) {
      console.error("Error fetching villas:", e);
    } finally {
      setLoading(false);
    }
  }, [owner, pkg]);

  useEffect(() => { 
    fetchVillas(); 
  }, [fetchVillas]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4 flex items-center justify-between">
        <div className="font-semibold text-xl">Villa RWA dNFT Manager</div>
        <ConnectButton />
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="text-sm text-muted-foreground">Smart Contract Configuration</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                value={pkg} 
                onChange={(e)=>setPkg(e.target.value)} 
                placeholder="Package ID (0x...)"
              />
              <Input 
                value={collectionId} 
                onChange={(e)=>setCollectionId(e.target.value)} 
                placeholder="Collection Object ID"
              />
              <Input 
                value={minterCapId} 
                onChange={(e)=>setMinterCapId(e.target.value)} 
                placeholder="MinterCap Object ID"
              />
              <Input 
                value={assetCapId} 
                onChange={(e)=>setAssetCapId(e.target.value)} 
                placeholder="AssetManagerCap Object ID"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="mint" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mint">
              <PlusCircle className="w-4 h-4 mr-2"/>
              Mint Villa
            </TabsTrigger>
            <TabsTrigger value="manage">
              <Hammer className="w-4 h-4 mr-2"/>
              Manage Properties
            </TabsTrigger>
            <TabsTrigger value="browse">
              <Search className="w-4 h-4 mr-2"/>
              Browse Portfolio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mint" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <MintForm 
                  pkg={pkg} 
                  collectionId={collectionId} 
                  minterCapId={minterCapId} 
                  onDone={fetchVillas} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <Input 
                    placeholder="Owner address (optional)" 
                    value={addressFilter} 
                    onChange={(e)=>setAddressFilter(e.target.value)}
                  />
                  <Button onClick={fetchVillas} disabled={loading} variant="outline">
                    {loading ? 
                      <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : 
                      <RefreshCw className="w-4 h-4 mr-2"/>
                    }
                    Refresh Villas
                  </Button>
                </div>

                <div className="space-y-6">
                  {villas.length === 0 && !loading && (
                    <div className="text-muted-foreground text-center py-8">
                      {owner ? "No villas found for this address." : "Connect wallet to view villas."}
                    </div>
                  )}
                  {villas.map((villa) => (
                    <div key={villa.data?.objectId} className="space-y-4">
                      <VillaCard v={villa} onRefresh={fetchVillas} />
                      <UpdateForms
                        pkg={pkg}
                        collectionId={collectionId}
                        assetCapId={assetCapId}
                        villaId={villa.data?.objectId}
                        onDone={fetchVillas}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="browse" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {villas.map((villa) => (
                <VillaCard key={villa.data?.objectId} v={villa} onRefresh={fetchVillas} />
              ))}
            </div>
            {villas.length === 0 && !loading && (
              <div className="text-center text-muted-foreground py-12">
                <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No villas in your portfolio yet.</p>
                <p className="text-sm">Start by minting your first villa NFT.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}