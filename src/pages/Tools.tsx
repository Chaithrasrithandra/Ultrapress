import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileArchive, Zap, Settings, TrendingUp } from "lucide-react";

const Tools = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user) return null;

  const tools = [
    {
      icon: FileArchive,
      title: "Batch Compression",
      description: "Compress multiple files at once for maximum efficiency.",
      status: "Coming Soon"
    },
    {
      icon: Zap,
      title: "Quick Compress",
      description: "Lightning-fast compression with optimized settings.",
      status: "Coming Soon"
    },
    {
      icon: Settings,
      title: "Advanced Settings",
      description: "Fine-tune compression parameters for your needs.",
      status: "Coming Soon"
    },
    {
      icon: TrendingUp,
      title: "Analytics Export",
      description: "Export your compression statistics and reports.",
      status: "Coming Soon"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} onLogout={handleLogout} onOpenAuth={() => {}} />
      
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Tools</h1>
          <p className="text-muted-foreground">Advanced compression utilities and features.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <tool.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{tool.title}</CardTitle>
                      <CardDescription className="mt-1">{tool.description}</CardDescription>
                    </div>
                  </div>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                    {tool.status}
                  </span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Tools;
