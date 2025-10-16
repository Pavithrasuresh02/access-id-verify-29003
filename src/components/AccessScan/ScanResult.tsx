import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

interface ScanResultProps {
  result: AccessResult;
  onReset: () => void;
}

export const ScanResult = ({ result, onReset }: ScanResultProps) => {
  const isGranted = result.access === "granted";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`p-6 ${
          isGranted
            ? "bg-success/10 border-success animate-pulse-glow"
            : "bg-destructive/10 border-destructive"
        }`}
      >
        <div className="text-center space-y-4">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            {isGranted ? (
              <ShieldCheck className="w-24 h-24 text-success" />
            ) : (
              <ShieldAlert className="w-24 h-24 text-destructive" />
            )}
          </motion.div>

          {/* Status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2
              className={`text-3xl font-bold ${
                isGranted ? "text-success" : "text-destructive"
              }`}
            >
              {isGranted ? "✅ ACCESS GRANTED" : "❌ ACCESS DENIED"}
            </h2>
          </motion.div>

          {/* Worker Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <p className="text-xl font-semibold text-foreground">{result.name}</p>
            <p className="text-muted-foreground">Worker ID: {result.worker_id}</p>
          </motion.div>

          {/* PPE Status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card/50 rounded-lg p-4 space-y-2"
          >
            <h3 className="font-semibold text-foreground mb-3">PPE Detection Status</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(result.ppe_status).map(([item, detected], index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  {detected ? (
                    <CheckCircle className="w-8 h-8 text-success" />
                  ) : (
                    <XCircle className="w-8 h-8 text-destructive" />
                  )}
                  <span className="text-sm font-medium capitalize text-foreground">
                    {item}
                  </span>
                  <span
                    className={`text-xs ${
                      detected ? "text-success" : "text-destructive"
                    }`}
                  >
                    {detected ? "Detected" : "Missing"}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Reason */}
          {!isGranted && result.reason && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-destructive/20 rounded-lg p-3 border border-destructive/50"
            >
              <p className="text-destructive font-medium">{result.reason}</p>
            </motion.div>
          )}

          {/* Reset Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Button onClick={onReset} variant="outline" className="mt-4" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Another
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};
