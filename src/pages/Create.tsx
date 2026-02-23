import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { FileUpload } from "@/components/FileUpload";
import { CompressionResults } from "@/components/CompressionResults";
import { useToast } from "@/hooks/use-toast";
import type { CompressionData } from "@/pages/Index";

const Create = () => {
  const [user, setUser] = useState<any>(null);
  const [compressionData, setCompressionData] = useState<CompressionData | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleCompressionComplete = async (data: CompressionData) => {
    setCompressionData(data);
    setIsCompressing(false);

    if (user) {
      const { error } = await supabase.from("compression_history").insert({
        user_id: user.id,
        file_name: data.fileName,
        original_size: data.originalSize,
        compressed_size: data.compressedSize,
        compression_ratio: data.compressionRatio,
        redundancy_detected: data.redundancyDetected,
        compression_time: data.compressionTime,
        original_content: data.originalContent,
        compressed_content: data.compressedContent,
      });

      if (error) {
        console.error("Error saving compression history:", error);
      } else {
        toast({
          title: "Success!",
          description: "Compression completed and saved to history.",
        });
      }
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} onLogout={handleLogout} onOpenAuth={() => {}} />
      
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Create Compression</h1>
          <p className="text-muted-foreground">Upload a file to compress and analyze.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <FileUpload 
            onCompressionComplete={handleCompressionComplete}
            isCompressing={isCompressing}
            setIsCompressing={setIsCompressing}
          />
          
          {compressionData && (
            <div className="mt-8">
              <CompressionResults data={compressionData} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Create;
