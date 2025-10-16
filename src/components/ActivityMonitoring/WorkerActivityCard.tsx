import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Clock, TrendingUp } from "lucide-react";

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

interface WorkerActivityCardProps {
  activity: WorkerActivity;
}

export const WorkerActivityCard = ({ activity }: WorkerActivityCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "idle":
        return "bg-yellow-500 text-white";
      case "break":
        return "bg-blue-500 text-white";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getSafetyColor = (score: number) => {
    if (score >= 95) return "text-success";
    if (score >= 85) return "text-yellow-500";
    return "text-destructive";
  };

  return (
    <Card className="border-border bg-card/50 backdrop-blur hover:bg-card/70 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                {activity.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground font-mono">{activity.worker_id}</p>
            </div>
          </div>
          <Badge className={getStatusColor(activity.status)}>
            {activity.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Zone:</span>
          <span className="font-medium text-foreground">{activity.zone}</span>
        </div>

        <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
          <div className="text-xs text-muted-foreground">Current Task</div>
          <div className="text-sm font-medium text-foreground">{activity.task}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Duration</div>
              <div className="text-sm font-medium text-foreground">{activity.duration} min</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Safety</div>
              <div className={`text-sm font-bold ${getSafetyColor(activity.safety_score)}`}>
                {activity.safety_score.toFixed(0)}%
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Last seen: {activity.last_seen}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
