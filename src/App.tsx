import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  formatBytes,
  formatSpeed,
  getMemoryUsagePercentage,
} from "@/lib/utils";

export default function App() {
  const queryClient = new QueryClient();

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Data />
      </QueryClientProvider>
    </div>
  );
}

interface SystemData {
  cpu: {
    manufacturer: string;
    brand: string;
    speed: number;
    speedMax: number;
    cores: number;
    physicalCores: number;
    governor: string;
    cache: {
      l1d: number;
      l1i: number;
      l2: number;
      l3: number;
    };
  };
  mem: {
    total: number;
    free: number;
    used: number;
    available: number;
    swaptotal: number;
    swapused: number;
  };
  network: Array<{
    iface: string;
    operstate: string;
    rx_bytes: number;
    tx_bytes: number;
    rx_sec: number;
    tx_sec: number;
  }>;
  os: {
    platform: string;
    distro: string;
    release: string;
    kernel: string;
    arch: string;
    hostname: string;
    uefi: boolean;
  };
}

function Data() {
  const { data, isLoading, error } = useQuery<SystemData>({
    queryKey: ["home"],
    refetchInterval: 1500,
    queryFn: async () => {
      return fetch("http://localhost:9872/api").then((res) => res.json());
    },
  });
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading system information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Error loading system information</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">No data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-balance">
            System Monitor Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time system information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CPU Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🖥️</span>
                CPU Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-semibold">{data.cpu.brand}</div>
                <div className="text-sm text-muted-foreground">
                  {data.cpu.manufacturer}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Cores:</span>
                  <div className="font-medium">
                    {data.cpu.cores} ({data.cpu.physicalCores} physical)
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Speed:</span>
                  <div className="font-medium">
                    {data.cpu.speed} GHz (max {data.cpu.speedMax} GHz)
                  </div>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground text-sm">Governor:</span>
                <Badge variant="secondary" className="ml-2">
                  {data.cpu.governor}
                </Badge>
              </div>

              <Separator />

              <div>
                <div className="text-sm font-medium mb-2">Cache</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>L1D: {formatBytes(data.cpu.cache.l1d)}</div>
                  <div>L1I: {formatBytes(data.cpu.cache.l1i)}</div>
                  <div>L2: {formatBytes(data.cpu.cache.l2)}</div>
                  <div>L3: {formatBytes(data.cpu.cache.l3)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Memory Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>💾</span>
                Memory Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">RAM Usage</span>
                  <span className="text-sm font-medium">
                    {getMemoryUsagePercentage(data.mem.used, data.mem.total)}%
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${getMemoryUsagePercentage(
                        data.mem.used,
                        data.mem.total
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatBytes(data.mem.used)} used</span>
                  <span>{formatBytes(data.mem.total)} total</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Swap Usage</span>
                  <span className="text-sm font-medium">
                    {getMemoryUsagePercentage(
                      data.mem.swapused,
                      data.mem.swaptotal
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${getMemoryUsagePercentage(
                        data.mem.swapused,
                        data.mem.swaptotal
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatBytes(data.mem.swapused)} used</span>
                  <span>{formatBytes(data.mem.swaptotal)} total</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Available:</span>
                  <div className="font-medium">
                    {formatBytes(data.mem.available)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Free:</span>
                  <div className="font-medium">
                    {formatBytes(data.mem.free)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Network Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🌐</span>
                Network Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.network.map((net, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{net.iface}</span>
                    <Badge
                      variant={net.operstate === "up" ? "default" : "secondary"}
                    >
                      {net.operstate}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Download:</span>
                      <div className="font-medium">
                        {formatBytes(net.rx_bytes)} total
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatSpeed(net.rx_sec)} current
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Upload:</span>
                      <div className="font-medium">
                        {formatBytes(net.tx_bytes)} total
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatSpeed(net.tx_sec)} current
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* OS Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🖥️</span>
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hostname:</span>
                  <span className="font-medium">{data.os.hostname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">OS:</span>
                  <span className="font-medium">
                    {data.os.distro} {data.os.release}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kernel:</span>
                  <span className="font-medium">{data.os.kernel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Architecture:</span>
                  <span className="font-medium">{data.os.arch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform:</span>
                  <span className="font-medium">{data.os.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">UEFI:</span>
                  <Badge variant={data.os.uefi ? "default" : "secondary"}>
                    {data.os.uefi ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
