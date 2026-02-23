import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type ChartData = {
  date: string;
  compressionRatio: number;
  fileSize: number;
};

export const LiveCompressionChart = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCompressionData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('compression_history_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'compression_history'
        },
        () => {
          loadCompressionData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadCompressionData = async () => {
    try {
      const { data: historyData, error } = await supabase
        .from('compression_history')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(10);

      if (error) throw error;

      if (historyData) {
        const chartData = historyData.map((item) => ({
          date: new Date(item.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit'
          }),
          compressionRatio: item.compression_ratio,
          fileSize: Math.round(item.original_size / 1024), // Convert to KB
        }));
        setData(chartData);
      }
    } catch (error) {
      console.error('Error loading compression data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Compression Analytics</CardTitle>
          <CardDescription>Loading chart data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Compression Analytics</CardTitle>
          <CardDescription>No compression data available yet. Compress some files to see analytics!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Compression Analytics</CardTitle>
        <CardDescription>Real-time visualization of your compression performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              yAxisId="left"
              label={{ value: 'Compression %', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              label={{ value: 'File Size (KB)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="compressionRatio" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              name="Compression Ratio %"
              dot={{ fill: 'hsl(var(--primary))' }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="fileSize" 
              stroke="hsl(var(--accent))" 
              strokeWidth={2}
              name="Original Size (KB)"
              dot={{ fill: 'hsl(var(--accent))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
