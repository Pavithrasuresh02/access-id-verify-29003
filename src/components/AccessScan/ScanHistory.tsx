import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface PPEStatus {
  helmet: boolean;
  gloves: boolean;
  boots: boolean;
}

interface AccessResult {
  worker_id: string;
  name: string;
  ppe_status: PPEStatus;
  access: "granted" | "denied";
  reason?: string;
  timestamp: string;
}

interface ScanHistoryProps {
  history: AccessResult[];
  onClearHistory: () => void;
}

export const ScanHistory = ({ history, onClearHistory }: ScanHistoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (history.length === 0) return null;

  const getMissingItems = (ppe: PPEStatus): string => {
    const missing = Object.entries(ppe)
      .filter(([_, detected]) => !detected)
      .map(([item]) => item.charAt(0).toUpperCase() + item.slice(1));
    return missing.length > 0 ? missing.join(", ") : "None";
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="border-border bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <div>
                <CardTitle>Recent Scans</CardTitle>
                <CardDescription>{history.length} scans recorded</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={onClearHistory}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear History
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Collapse
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Expand
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent>
                <div className="rounded-md border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead className="text-foreground">Worker ID</TableHead>
                        <TableHead className="text-foreground">Name</TableHead>
                        <TableHead className="text-foreground">Access Result</TableHead>
                        <TableHead className="text-foreground">Time</TableHead>
                        <TableHead className="text-foreground">Missing Items</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((scan, index) => (
                        <motion.tr
                          key={`${scan.worker_id}-${scan.timestamp}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-border hover:bg-secondary/20"
                        >
                          <TableCell className="font-mono text-foreground">
                            {scan.worker_id}
                          </TableCell>
                          <TableCell className="text-foreground">{scan.name}</TableCell>
                          <TableCell>
                            <Badge
                              variant={scan.access === "granted" ? "default" : "destructive"}
                              className={
                                scan.access === "granted"
                                  ? "bg-success text-success-foreground"
                                  : ""
                              }
                            >
                              {scan.access.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatTime(scan.timestamp)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {getMissingItems(scan.ppe_status)}
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};
