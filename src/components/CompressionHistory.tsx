import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Clock, FileText, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnalysisDashboard } from "./AnalysisDashboard";

interface HistoryItem {
  id: string;
  file_name: string;
  original_size: number;
  compressed_size: number;
  compression_ratio: number;
  redundancy_detected: number;
  compression_time: number;
  compressed_content: string;
  original_content: string;
  created_at: string;
}

export const CompressionHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("compression_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast({
        title: "Error",
        description: "Failed to load compression history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (item: HistoryItem) => {
    try {
      // Use the original content for download since compression is simulated
      const binaryString = atob(item.original_content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download complete",
        description: `Downloaded ${item.file_name}`,
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Error",
        description: "Failed to download file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("compression_history")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setHistory(history.filter((item) => item.id !== id));
      toast({
        title: "Success",
        description: "History item deleted",
      });
    } catch (error) {
      console.error("Error deleting history:", error);
      toast({
        title: "Error",
        description: "Failed to delete history item",
        variant: "destructive",
      });
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">Loading history...</div>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No compression history yet. Upload a file to get started!</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Compression History</h2>
        <div className="grid gap-4">
          {history.map((item) => (
            <Card key={item.id} className="p-6 hover:shadow-glow transition-smooth">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">{item.file_name}</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Original:</span>
                      <div className="font-medium">{formatBytes(item.original_size)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Compressed:</span>
                      <div className="font-medium text-primary">{formatBytes(item.compressed_size)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ratio:</span>
                      <div className="font-medium">{item.compression_ratio.toFixed(1)}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Saved:</span>
                      <div className="font-medium text-green-600">
                        {formatBytes(item.original_size - item.compressed_size)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedItem(item)}
                    className="gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(item)}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(item.id)}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compression Analytics</DialogTitle>
            <DialogDescription>
              Detailed analysis for {selectedItem?.file_name}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <AnalysisDashboard
              data={{
                originalSize: selectedItem.original_size,
                compressedSize: selectedItem.compressed_size,
                compressionRatio: selectedItem.compression_ratio,
                redundancyDetected: selectedItem.redundancy_detected,
                compressionTime: selectedItem.compression_time,
                compressedContent: selectedItem.compressed_content,
                originalContent: selectedItem.original_content,
                fileName: selectedItem.file_name,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
