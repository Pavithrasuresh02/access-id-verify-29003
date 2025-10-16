import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, User, Clock, CheckCircle, XCircle } from "lucide-react";

interface SafetyAlert {
  id: string;
  zone: string;
  worker_id: string;
  worker_name: string;
  alert_type: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  status: "active" | "acknowledged" | "resolved";
  snapshot_url: string;
  confidence: number;
}

interface AlertCardProps {
  alert: SafetyAlert;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}

export const AlertCard = ({ alert, onAcknowledge, onResolve }: AlertCardProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600 text-white border-red-700";
      case "high":
        return "bg-orange-500 text-white border-orange-600";
      case "medium":
        return "bg-yellow-500 text-white border-yellow-600";
      case "low":
        return "bg-blue-500 text-white border-blue-600";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-yellow-500 text-white";
      case "acknowledged":
        return "bg-blue-500 text-white";
      case "resolved":
        return "bg-success text-success-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return date.toLocaleString();
  };

  return (
    <Card className={`border-2 ${alert.severity === "critical" ? "border-red-600 animate-pulse-glow" : "border-border"} bg-card/50 backdrop-blur`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Snapshot */}
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
            <img
              src={alert.snapshot_url}
              alt="Alert snapshot"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-5 h-5 ${
                    alert.severity === "critical" || alert.severity === "high" 
                      ? "text-destructive" 
                      : "text-yellow-500"
                  }`} />
                  <h3 className="text-lg font-bold text-foreground">{alert.alert_type}</h3>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <Badge className={getStatusColor(alert.status)}>
                    {alert.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  Alert ID: {alert.id}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">{alert.confidence}%</div>
                <div className="text-xs text-muted-foreground">Confidence</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Zone</div>
                  <div className="text-sm font-medium text-foreground">{alert.zone}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Worker</div>
                  <div className="text-sm font-medium text-foreground">
                    {alert.worker_name} ({alert.worker_id})
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Time</div>
                  <div className="text-sm font-medium text-foreground">
                    {formatTimestamp(alert.timestamp)}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {alert.status === "active" && (
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => onAcknowledge(alert.id)}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Acknowledge
                </Button>
                <Button
                  onClick={() => onResolve(alert.id)}
                  size="sm"
                  className="gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Resolve
                </Button>
              </div>
            )}
            {alert.status === "acknowledged" && (
              <Button
                onClick={() => onResolve(alert.id)}
                size="sm"
                className="gap-2"
              >
                <XCircle className="w-4 h-4" />
                Mark as Resolved
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
