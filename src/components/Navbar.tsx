import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, ScanLine, LayoutDashboard, Activity, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/access-scan", label: "Access Scan", icon: ScanLine },
    { path: "/activity-monitoring", label: "Activity", icon: Activity },
    { path: "/safety-alerts", label: "Alerts", icon: AlertTriangle },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center gap-2 mr-6">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold text-foreground">Sentinel Shopfloor</span>
        </div>
        
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
