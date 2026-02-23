import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { FileText, TrendingDown, HardDrive, Zap } from "lucide-react";

interface Stats {
  totalFiles: number;
  averageCompressionRatio: number;
  totalSpaceSaved: number;
  totalOriginalSize: number;
}

export const CompressionStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalFiles: 0,
    averageCompressionRatio: 0,
    totalSpaceSaved: 0,
    totalOriginalSize: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("compression_history")
        .select("original_size, compressed_size, compression_ratio")
        .eq("user_id", user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        const totalFiles = data.length;
        const avgRatio = data.reduce((sum, item) => sum + item.compression_ratio, 0) / totalFiles;
        const totalOriginal = data.reduce((sum, item) => sum + item.original_size, 0);
        const totalCompressed = data.reduce((sum, item) => sum + item.compressed_size, 0);
        const spaceSaved = totalOriginal - totalCompressed;

        setStats({
          totalFiles,
          averageCompressionRatio: Math.round(avgRatio * 10) / 10,
          totalSpaceSaved: spaceSaved,
          totalOriginalSize: totalOriginal,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 h-32 bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Compression Statistics</h2>
        <p className="text-muted-foreground">Overview of your compression performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-smooth">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Files Compressed</p>
            <p className="text-3xl font-bold text-foreground">{stats.totalFiles}</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-smooth">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-accent" />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Average Compression Ratio</p>
            <p className="text-3xl font-bold text-foreground">{stats.averageCompressionRatio}%</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover:shadow-lg transition-smooth">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <HardDrive className="w-6 h-6 text-foreground" />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Space Saved</p>
            <p className="text-3xl font-bold text-foreground">{formatBytes(stats.totalSpaceSaved)}</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 hover:shadow-lg transition-smooth">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Efficiency Score</p>
            <p className="text-3xl font-bold text-foreground">
              {stats.totalOriginalSize > 0 
                ? Math.round((stats.totalSpaceSaved / stats.totalOriginalSize) * 100) 
                : 0}%
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
