import { useCallback, useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { compressData } from "@/lib/compression";
import type { CompressionData } from "@/pages/Index";

interface FileUploadProps {
  onCompressionComplete: (data: CompressionData) => void;
  isCompressing: boolean;
  setIsCompressing: (value: boolean) => void;
}

export const FileUpload = ({
  onCompressionComplete,
  isCompressing,
  setIsCompressing,
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState<number>(50);
  const [compressionMode, setCompressionMode] = useState<"percentage" | "size">("percentage");
  const [targetSizeValue, setTargetSizeValue] = useState<string>("");
  const [targetSizeUnit, setTargetSizeUnit] = useState<"KB" | "MB">("KB");
  const { toast } = useToast();

  const handleFile = useCallback(
    async (file: File) => {
      setIsCompressing(true);
      setProgress(0);

      try {
        // Read file as ArrayBuffer to handle both text and binary files
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // Convert to base64 for consistent storage using chunks to avoid stack overflows
        let binary = "";
        const CHUNK_SIZE = 0x8000; // 32KB chunks
        for (let i = 0; i < uint8Array.length; i += CHUNK_SIZE) {
          binary += String.fromCharCode(...uint8Array.subarray(i, i + CHUNK_SIZE));
        }
        const base64Content = btoa(binary);
        
        // Simulate compression progress
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        // Calculate target size in bytes if size mode is selected
        let targetSizeBytes: number | undefined;
        if (compressionMode === "size" && targetSizeValue) {
          const sizeValue = parseFloat(targetSizeValue);
          if (!isNaN(sizeValue) && sizeValue > 0) {
            targetSizeBytes = targetSizeUnit === "KB" 
              ? sizeValue * 1024 
              : sizeValue * 1024 * 1024;
          }
        }

        const result = await compressData(
          base64Content, 
          file.name, 
          compressionLevel,
          targetSizeBytes
        );
        
        clearInterval(progressInterval);
        setProgress(100);

        setTimeout(() => {
          onCompressionComplete(result);
          toast({
            title: "Compression complete!",
            description: `Achieved ${result.compressionRatio}% compression ratio`,
          });
        }, 500);
      } catch (error) {
        console.error("Compression error:", error);
        toast({
          title: "Compression failed",
          description: "An error occurred during compression",
          variant: "destructive",
        });
        setIsCompressing(false);
      }
    },
    [onCompressionComplete, setIsCompressing, toast]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  return (
    <div className="bg-white border-2 border-dashed border-primary/40 rounded-2xl p-16 transition-smooth hover:border-primary/60">
      <div
        className={`flex flex-col items-center justify-center ${
          dragActive ? "scale-105" : ""
        } transition-smooth`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleChange}
          disabled={isCompressing}
        />

        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center cursor-pointer w-full"
        >
          {isCompressing ? (
            <Loader2 className="w-16 h-16 text-primary mb-6 animate-spin" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Upload className="w-10 h-10 text-primary" />
            </div>
          )}

          <p className="text-xl font-medium text-foreground mb-2">
            {isCompressing
              ? "Compressing your file..."
              : "Drop your file here or click to upload"}
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Supports all file types and datasets
          </p>
        </label>

        {!isCompressing && (
          <div className="w-full max-w-md mb-6 px-4 space-y-4 flex flex-col items-center">
            <RadioGroup 
              value={compressionMode} 
              onValueChange={(value) => setCompressionMode(value as "percentage" | "size")}
              className="flex gap-4 justify-center"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage" className="cursor-pointer">Compression Level</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="size" id="size" />
                <Label htmlFor="size" className="cursor-pointer">Target Size</Label>
              </div>
            </RadioGroup>

            {compressionMode === "percentage" ? (
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Compression Target: {compressionLevel < 25 ? 'Light' : compressionLevel < 50 ? 'Medium' : compressionLevel < 75 ? 'Heavy' : 'Maximum'} 
                  <span className="text-muted-foreground ml-2">
                    (~{compressionLevel}% reduction)
                  </span>
                </Label>
                <Slider
                  value={[compressionLevel]}
                  onValueChange={(value) => setCompressionLevel(value[0])}
                  min={15}
                  max={85}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Light</span>
                  <span>Medium</span>
                  <span>Heavy</span>
                  <span>Maximum</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Label className="text-sm font-medium block">
                  Target Compressed Size
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Enter size"
                    value={targetSizeValue}
                    onChange={(e) => setTargetSizeValue(e.target.value)}
                    min="0.1"
                    step="0.1"
                    className="flex-1"
                  />
                  <select
                    value={targetSizeUnit}
                    onChange={(e) => setTargetSizeUnit(e.target.value as "KB" | "MB")}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="KB">KB</option>
                    <option value="MB">MB</option>
                  </select>
                </div>
                <p className="text-xs text-muted-foreground">
                  Specify the desired file size after compression
                </p>
              </div>
            )}
          </div>
        )}

        {isCompressing && (
          <div className="w-full max-w-md mb-6">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-center mt-2 text-muted-foreground">
              {progress}% complete
            </p>
          </div>
        )}

        {!isCompressing && (
          <Button 
            asChild 
            size="lg" 
            className="px-12 py-6 text-base font-medium bg-primary hover:bg-primary/90"
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              Start Compression
            </label>
          </Button>
        )}
      </div>
    </div>
  );
};
