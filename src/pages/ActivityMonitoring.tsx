import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Users, Clock, TrendingUp, Filter, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { WorkerActivityCard } from "@/components/ActivityMonitoring/WorkerActivityCard";

interface WorkerActivity {
  worker_id: string;
  name: string;
  zone: string;
  status: "active" | "idle" | "break";
  task: string;
  duration: number;
  safety_score: number;
  last_seen: string;
}

const mockActivities: WorkerActivity[] = [
  { worker_id: "W101", name: "Rajesh Kumar", zone: "Assembly Line", status: "active", task: "Component Assembly", duration: 45, safety_score: 98, last_seen: "2 min ago" },
  { worker_id: "W102", name: "Vijay B", zone: "Welding Station", status: "active", task: "Spot Welding", duration: 32, safety_score: 95, last_seen: "1 min ago" },
  { worker_id: "W103", name: "Priya Sharma", zone: "Packaging", status: "break", task: "Quality Check", duration: 15, safety_score: 100, last_seen: "5 min ago" },
  { worker_id: "W104", name: "Arun Singh", zone: "Storage", status: "active", task: "Inventory Management", duration: 67, safety_score: 92, last_seen: "Just now" },
  { worker_id: "W105", name: "Sneha Patel", zone: "Assembly Line", status: "idle", task: "Machine Setup", duration: 8, safety_score: 97, last_seen: "3 min ago" },
  { worker_id: "W106", name: "Karthik M", zone: "Welding Station", status: "active", task: "TIG Welding", duration: 54, safety_score: 89, last_seen: "1 min ago" },
];

const ActivityMonitoring = () => {
  const [activities, setActivities] = useState<WorkerActivity[]>(mockActivities);
  const [filter, setFilter] = useState<"all" | "active" | "idle" | "break">("all");
  const { toast } = useToast();

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setActivities(prev => 
        prev.map(activity => ({
          ...activity,
          duration: activity.status === "active" ? activity.duration + 1 : activity.duration,
          safety_score: Math.max(85, Math.min(100, activity.safety_score + (Math.random() - 0.5) * 2)),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(a => a.status === filter);

  const stats = {
    total: activities.length,
    active: activities.filter(a => a.status === "active").length,
    avgSafety: Math.round(activities.reduce((sum, a) => sum + a.safety_score, 0) / activities.length),
    avgDuration: Math.round(activities.reduce((sum, a) => sum + a.duration, 0) / activities.length),
  };

  const handleExport = () => {
    const csv = [
      ["Worker ID", "Name", "Zone", "Status", "Task", "Duration (min)", "Safety Score", "Last Seen"],
      ...activities.map(a => [a.worker_id, a.name, a.zone, a.status, a.task, a.duration, a.safety_score, a.last_seen])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Report exported",
      description: "Activity report downloaded successfully",
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
              <Activity className="w-10 h-10 text-primary" />
              <div>
                <h1 className="text-4xl font-bold text-foreground">Activity Monitoring</h1>
                <p className="text-muted-foreground">Real-time worker activity & safety tracking</p>
              </div>
            </div>
            <Button onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-border bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Total Workers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">{stats.active} currently active</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-border bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="w-4 h-4 text-success" />
                  Active Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">{stats.active}</div>
                <p className="text-xs text-muted-foreground mt-1">Working on tasks</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-border bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Avg Safety Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.avgSafety}%</div>
                <p className="text-xs text-muted-foreground mt-1">Compliance rate</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-border bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Avg Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.avgDuration}</div>
                <p className="text-xs text-muted-foreground mt-1">Minutes per task</p>
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
                Filter by Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                >
                  All Workers
                </Button>
                <Button
                  variant={filter === "active" ? "default" : "outline"}
                  onClick={() => setFilter("active")}
                >
                  Active
                </Button>
                <Button
                  variant={filter === "idle" ? "default" : "outline"}
                  onClick={() => setFilter("idle")}
                >
                  Idle
                </Button>
                <Button
                  variant={filter === "break" ? "default" : "outline"}
                  onClick={() => setFilter("break")}
                >
                  On Break
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Worker Activity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.worker_id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.05 }}
            >
              <WorkerActivityCard activity={activity} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityMonitoring;
