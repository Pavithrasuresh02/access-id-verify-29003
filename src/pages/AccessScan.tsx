import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, ScanLine, Camera, Upload, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ScanResult } from "@/components/AccessScan/ScanResult";
import { ScanHistory } from "@/components/AccessScan/ScanHistory";
import { useScanHistory } from "@/hooks/useScanHistory";

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

const AccessScan = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AccessResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { history, addScan, clearHistory } = useScanHistory();

  const mockAnalyzeImage = (): AccessResult => {
    const workers = [
      { id: "W101", name: "Rajesh Kumar" },
      { id: "W102", name: "Vijay B" },
      { id: "W103", name: "Priya Sharma" },
      { id: "W201", name: "Demo Worker" },
    ];

    const worker = workers[Math.floor(Math.random() * workers.length)];
    const ppeItems = ["helmet", "gloves", "boots"] as const;
    const randomPPE: PPEStatus = {
      helmet: Math.random() > 0.3,
      gloves: Math.random() > 0.3,
      boots: Math.random() > 0.3,
    };

    const allPresent = randomPPE.helmet && randomPPE.gloves && randomPPE.boots;
    const missing = ppeItems.filter((item) => !randomPPE[item]);

    return {
      worker_id: worker.id,
      name: worker.name,
      ppe_status: randomPPE,
      access: allPresent ? "granted" : "denied",
      reason: allPresent ? undefined : `${missing.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(", ")} not detected`,
      timestamp: new Date().toISOString(),
    };
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPEG or PNG image",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload or capture a worker snapshot first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    // Simulate API call with delay
    setTimeout(async () => {
      try {
        // In production, this would call: POST /api/check_access
        // For now, use mock data
        const mockResult = mockAnalyzeImage();
        
        toast({
          title: "Running in demo mode",
          description: "Backend offline — using simulated DeepFace analysis",
        });

        setResult(mockResult);
        addScan(mockResult);

        // Play alert sound for denied access
        if (mockResult.access === "denied") {
          // Simple beep sound for denied access
          try {
            const audioContext = new AudioContext();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 440;
            oscillator.type = "sine";
            gainNode.gain.value = 0.1;
            
            oscillator.start();
            setTimeout(() => oscillator.stop(), 200);
          } catch {
            // Ignore audio errors
          }
        }
      } catch (error) {
        toast({
          title: "Analysis failed",
          description: "Unable to process image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsAnalyzing(false);
      }
    }, 2000);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-secondary to-background opacity-50" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmRiMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEzIDAgNiAyLjY4NyA2IDZzLTIuNjg3IDYtNiA2LTYtMi42ODctNi02IDIuNjg3LTYgNi02ek0yNCA0MmMtMy4zMTMgMC02LTIuNjg3LTYtNnMyLjY4Ny02IDYtNiA2IDIuNjg3IDYgNi0yLjY4NyA2LTYgNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <ScanLine className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Worker Access Verification</h1>
          </div>
          <p className="text-muted-foreground">AI-powered PPE compliance & identity verification</p>
        </motion.div>

        {/* Main Scanner Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Scan Worker Snapshot
              </CardTitle>
              <CardDescription>Upload or capture worker image for DeepFace analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Section */}
              {!result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleImageUpload}
                        className="cursor-pointer"
                      />
                    </div>
                    {selectedImage && (
                      <Button variant="outline" size="icon" onClick={handleReset}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Image Preview */}
                  {selectedImage && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative rounded-lg overflow-hidden border-2 border-border"
                    >
                      <img
                        src={selectedImage}
                        alt="Worker snapshot"
                        className="w-full h-64 object-cover"
                      />
                    </motion.div>
                  )}

                  {/* Analyze Button */}
                  <Button
                    onClick={handleAnalyze}
                    disabled={!selectedImage || isAnalyzing}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Analyze Snapshot
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {/* Result Display */}
              <AnimatePresence mode="wait">
                {result && <ScanResult result={result} onReset={handleReset} />}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* Scan History Section */}
        <ScanHistory history={history} onClearHistory={clearHistory} />
      </div>
    </div>
  );
};

export default AccessScan;
