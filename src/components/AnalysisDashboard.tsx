import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Activity, TrendingDown, Clock, AlertCircle } from "lucide-react";
import type { CompressionData } from "@/pages/Index";

interface AnalysisDashboardProps {
  data: CompressionData;
}

const COLORS = ["hsl(199, 89%, 48%)", "hsl(142, 76%, 36%)", "hsl(217, 33%, 17%)"];

export const AnalysisDashboard = ({ data }: AnalysisDashboardProps) => {
  const sizeData = [
    { name: "Original", size: data.originalSize / 1024 },
    { name: "Compressed", size: data.compressedSize / 1024 },
  ];

  const pieData = [
    { name: "Compressed", value: data.compressedSize },
    { name: "Saved", value: data.originalSize - data.compressedSize },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Analysis Dashboard</h2>
          <p className="text-sm text-muted-foreground">Detailed compression metrics and insights</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6 shadow-card border-border bg-gradient-to-br from-card to-secondary/30">
          <div className="flex items-start justify-between mb-2">
            <TrendingDown className="w-5 h-5 text-accent" />
            <span className="text-2xl font-bold text-accent">{data.compressionRatio}%</span>
          </div>
          <p className="text-sm font-medium">Compression Ratio</p>
          <p className="text-xs text-muted-foreground mt-1">Space reduction achieved</p>
        </Card>

        <Card className="p-6 shadow-card border-border bg-gradient-to-br from-card to-secondary/30">
          <div className="flex items-start justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold text-primary">{data.redundancyDetected}%</span>
          </div>
          <p className="text-sm font-medium">Redundancy Detected</p>
          <p className="text-xs text-muted-foreground mt-1">Duplicate patterns found</p>
        </Card>

        <Card className="p-6 shadow-card border-border bg-gradient-to-br from-card to-secondary/30">
          <div className="flex items-start justify-between mb-2">
            <Clock className="w-5 h-5 text-foreground" />
            <span className="text-2xl font-bold">{data.compressionTime}ms</span>
          </div>
          <p className="text-sm font-medium">Processing Time</p>
          <p className="text-xs text-muted-foreground mt-1">Compression duration</p>
        </Card>

        <Card className="p-6 shadow-card border-border bg-gradient-to-br from-card to-secondary/30">
          <div className="flex items-start justify-between mb-2">
            <Activity className="w-5 h-5 text-accent" />
            <span className="text-2xl font-bold">
              {((data.originalSize - data.compressedSize) / data.originalSize * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-sm font-medium">Efficiency Score</p>
          <p className="text-xs text-muted-foreground mt-1">Overall performance</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 shadow-card border-border">
          <h3 className="text-lg font-semibold mb-4">Size Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sizeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem"
                }} 
              />
              <Bar dataKey="size" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 shadow-card border-border">
          <h3 className="text-lg font-semibold mb-4">Space Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem"
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6 shadow-card border-border">
        <h3 className="text-lg font-semibold mb-4">Compression Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Pattern Detection</p>
              <p className="text-sm text-muted-foreground">
                Found {data.redundancyDetected}% redundant data patterns that were optimized using tree-based compression
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
            <TrendingDown className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Compression Efficiency</p>
              <p className="text-sm text-muted-foreground">
                Achieved {data.compressionRatio}% compression ratio, saving {((data.originalSize - data.compressedSize) / 1024).toFixed(2)} KB of storage space
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
            <Clock className="w-5 h-5 text-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Performance</p>
              <p className="text-sm text-muted-foreground">
                Processed in {data.compressionTime}ms using optimized tree-based algorithms for maximum efficiency
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
