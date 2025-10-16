import { Link } from "react-router-dom";
import { ShieldCheck, ScanLine, Activity, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-foreground">
            Sentinel Shopfloor Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            AI-Powered Worker Safety & Access Control System
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-border bg-card/50 backdrop-blur hover:bg-card/70 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScanLine className="w-6 h-6 text-primary" />
                Access Scanning
              </CardTitle>
              <CardDescription>DeepFace-powered worker identification</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Verify worker identity and PPE compliance in real-time
              </p>
              <Link to="/access-scan">
                <Button className="w-full">
                  Go to Scanner
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary" />
                Activity Monitoring
              </CardTitle>
              <CardDescription>Real-time safety monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Track worker activities and safety compliance
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-primary" />
                Safety Alerts
              </CardTitle>
              <CardDescription>Instant violation notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Get notified of safety violations immediately
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full border border-primary/20">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Powered by DeepFace AI & YOLO Detection
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
