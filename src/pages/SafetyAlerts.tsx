import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Bell, Filter, Download, Trash2, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertCard } from "@/components/SafetyAlerts/AlertCard";

interface SafetyAlert {
  id: string;
  zone: string;
  worker_id: string;
  worker_name: string;
  alert_type: "No Helmet" | "No Gloves" | "No Boots" | "Fire" | "Fall" | "Restricted Area" | "Equipment Misuse";
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  status: "active" | "acknowledged" | "resolved";
  snapshot_url: string;
  confidence: number;
}

const mockAlerts: SafetyAlert[] = [
  { id: "A001", zone: "Welding Station", worker_id: "W102", worker_name: "Vijay B", alert_type: "No Helmet", severity: "high", timestamp: new Date(Date.now() - 2 * 60000).toISOString(), status: "active", snapshot_url: "/placeholder.svg", confidence: 94 },
  { id: "A002", zone: "Assembly Line", worker_id: "W105", worker_name: "Sneha Patel", alert_type: "No Gloves", severity: "medium", timestamp: new Date(Date.now() - 5 * 60000).toISOString(), status: "active", snapshot_url: "/placeholder.svg", confidence: 87 },
  { id: "A003", zone: "Storage", worker_id: "W104", worker_name: "Arun Singh", alert_type: "Restricted Area", severity: "high", timestamp: new Date(Date.now() - 8 * 60000).toISOString(), status: "acknowledged", snapshot_url: "/placeholder.svg", confidence: 96 },
  { id: "A004", zone: "Welding Station", worker_id: "W106", worker_name: "Karthik M", alert_type: "Fire", severity: "critical", timestamp: new Date(Date.now() - 12 * 60000).toISOString(), status: "resolved", snapshot_url: "/placeholder.svg", confidence: 92 },
];

const SafetyAlerts = () => {
  const [alerts, setAlerts] = useState<SafetyAlert[]>(mockAlerts);
  const [filter, setFilter] = useState<"all" | "active" | "acknowledged" | "resolved">("all");
  const [severityFilter, setSeverityFilter] = useState<"all" | "low" | "medium" | "high" | "critical">("all");
  const { toast } = useToast();

  useEffect(() => {
    // Simulate new alerts every 15-30 seconds
    const interval = setInterval(() => {
      const alertTypes: SafetyAlert["alert_type"][] = ["No Helmet", "No Gloves", "No Boots", "Fire", "Fall", "Restricted Area", "Equipment Misuse"];
      const severities: SafetyAlert["severity"][] = ["low", "medium", "high", "critical"];
      const zones = ["Assembly Line", "Welding Station", "Storage", "Packaging"];
      const workers = [
        { id: "W101", name: "Rajesh Kumar" },
        { id: "W102", name: "Vijay B" },
        { id: "W103", name: "Priya Sharma" },
        { id: "W104", name: "Arun Singh" },
      ];

      if (Math.random() > 0.7) {
        const worker = workers[Math.floor(Math.random() * workers.length)];
        const newAlert: SafetyAlert = {
          id: `A${Date.now().toString().slice(-3)}`,
          zone: zones[Math.floor(Math.random() * zones.length)],
          worker_id: worker.id,
          worker_name: worker.name,
          alert_type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          timestamp: new Date().toISOString(),
          status: "active",
          snapshot_url: "/placeholder.svg",
          confidence: Math.floor(Math.random() * 15) + 85,
        };

        setAlerts(prev => [newAlert, ...prev].slice(0, 50));

        // Play alert sound for critical alerts
        if (newAlert.severity === "critical") {
          try {
            const audioContext = new AudioContext();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 880;
            oscillator.type = "sine";
            gainNode.gain.value = 0.1;
            
            oscillator.start();
            setTimeout(() => oscillator.stop(), 300);
          } catch {
            // Ignore audio errors
          }
        }

        toast({
          title: `${newAlert.severity.toUpperCase()} Alert`,
          description: `${newAlert.alert_type} detected in ${newAlert.zone}`,
          variant: newAlert.severity === "critical" || newAlert.severity === "high" ? "destructive" : "default",
        });
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [toast]);

  const filteredAlerts = alerts.filter(alert => {
    const statusMatch = filter === "all" || alert.status === filter;
    const severityMatch = severityFilter === "all" || alert.severity === severityFilter;
    return statusMatch && severityMatch;
  });

  const stats = {
    total: alerts.length,
    active: alerts.filter(a => a.status === "active").length,
    critical: alerts.filter(a => a.severity === "critical").length,
    acknowledged: alerts.filter(a => a.status === "acknowledged").length,
  };

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, status: "acknowledged" as const } : alert
    ));
    toast({
      title: "Alert acknowledged",
      description: "Alert has been marked as acknowledged",
    });
  };

  const handleResolve = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, status: "resolved" as const } : alert
    ));
    toast({
      title: "Alert resolved",
      description: "Alert has been marked as resolved",
    });
  };

  const handleClearResolved = () => {
    setAlerts(prev => prev.filter(alert => alert.status !== "resolved"));
    toast({
      title: "Resolved alerts cleared",
      description: "All resolved alerts have been removed",
    });
  };

  const handleRefresh = () => {
    toast({
      title: "Alerts refreshed",
      description: "Alert data has been updated",
    });
  };

  const handleExport = () => {
    const csv = [
      ["Alert ID", "Zone", "Worker ID", "Worker Name", "Alert Type", "Severity", "Status", "Timestamp", "Confidence"],
      ...alerts.map(a => [a.id, a.zone, a.worker_id, a.worker_name, a.alert_type, a.severity, a.status, a.timestamp, a.confidence])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `safety-alerts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Report exported",
      description: "Safety alerts report downloaded successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-gradient-to-br from-background via-secondary to-background opacity-50" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-10 h-10 text-destructive" />
              <div>
                <h1 className="text-4xl font-bold text-foreground">Safety Alerts</h1>
                <p className="text-muted-foreground">Real-time safety violation monitoring</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRefresh} variant="outline" className="gap-2">
                <RefreshCcw className="w-4 h-4" />
                Refresh
              </Button>
              <Button onClick={handleClearResolved} variant="outline" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Clear Resolved
              </Button>
              <Button onClick={handleExport} className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-border bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  Total Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.total}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-border bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-500">{stats.active}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-border bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  Critical
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">{stats.critical}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-border bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Bell className="w-4 h-4 text-success" />
                  Acknowledged
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">{stats.acknowledged}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Status</div>
                <div className="flex gap-2">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    onClick={() => setFilter("all")}
                    size="sm"
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === "active" ? "default" : "outline"}
                    onClick={() => setFilter("active")}
                    size="sm"
                  >
                    Active
                  </Button>
                  <Button
                    variant={filter === "acknowledged" ? "default" : "outline"}
                    onClick={() => setFilter("acknowledged")}
                    size="sm"
                  >
                    Acknowledged
                  </Button>
                  <Button
                    variant={filter === "resolved" ? "default" : "outline"}
                    onClick={() => setFilter("resolved")}
                    size="sm"
                  >
                    Resolved
                  </Button>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">Severity</div>
                <div className="flex gap-2">
                  <Button
                    variant={severityFilter === "all" ? "default" : "outline"}
                    onClick={() => setSeverityFilter("all")}
                    size="sm"
                  >
                    All
                  </Button>
                  <Button
                    variant={severityFilter === "low" ? "default" : "outline"}
                    onClick={() => setSeverityFilter("low")}
                    size="sm"
                  >
                    Low
                  </Button>
                  <Button
                    variant={severityFilter === "medium" ? "default" : "outline"}
                    onClick={() => setSeverityFilter("medium")}
                    size="sm"
                  >
                    Medium
                  </Button>
                  <Button
                    variant={severityFilter === "high" ? "default" : "outline"}
                    onClick={() => setSeverityFilter("high")}
                    size="sm"
                  >
                    High
                  </Button>
                  <Button
                    variant={severityFilter === "critical" ? "default" : "outline"}
                    onClick={() => setSeverityFilter("critical")}
                    size="sm"
                  >
                    Critical
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <AlertCard
                  alert={alert}
                  onAcknowledge={handleAcknowledge}
                  onResolve={handleResolve}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredAlerts.length === 0 && (
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardContent className="py-12 text-center">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No alerts match the selected filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SafetyAlerts;
