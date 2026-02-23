import { Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CompressionData } from "@/pages/Index";

interface CompressionResultsProps {
  data: CompressionData;
}

export const CompressionResults = ({ data }: CompressionResultsProps) => {
  const handleDownload = () => {
    // Download the compressed file with dictionary
    const blob = new Blob([data.compressedContent], { 
      type: "application/json" 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const fileNameWithoutExt = data.fileName.replace(/\.[^/.]+$/, "");
    a.download = `${fileNameWithoutExt}.compressed.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6 shadow-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Compression Complete</h2>
            <p className="text-sm text-muted-foreground">
              File: {data.fileName}
            </p>
          </div>
        </div>
        <Button onClick={handleDownload} className="gap-2">
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-secondary/50 rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Original Size</p>
          <p className="text-2xl font-bold">{(data.originalSize / 1024).toFixed(2)} KB</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Compressed Size</p>
          <p className="text-2xl font-bold text-primary">
            {(data.compressedSize / 1024).toFixed(2)} KB
          </p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Space Saved</p>
          <p className="text-2xl font-bold text-accent">
            {((data.originalSize - data.compressedSize) / 1024).toFixed(2)} KB
          </p>
        </div>
      </div>
    </Card>
  );
};
