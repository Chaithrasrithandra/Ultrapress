import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { FileUpload } from "@/components/FileUpload";
import { CompressionResults } from "@/components/CompressionResults";
import { AnalysisDashboard } from "@/components/AnalysisDashboard";
import { CompressionHistory } from "@/components/CompressionHistory";
import { CompressionStats } from "@/components/CompressionStats";
import { Navigation } from "@/components/Navigation";
import { AIAssistant } from "@/components/AIAssistant";
import { LiveCompressionChart } from "@/components/LiveCompressionChart";
import { DocumentationViewer } from "@/components/DocumentationViewer";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Layers } from "lucide-react";

export interface CompressionData {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  redundancyDetected: number;
  compressionTime: number;
  compressedContent: string;
  originalContent: string;
  fileName: string;
}

const Index = () => {
  const [compressionData, setCompressionData] = useState<CompressionData | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [historyKey, setHistoryKey] = useState(0);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authIsLogin, setAuthIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCompressionComplete = async (data: CompressionData) => {
    setCompressionData(data);
    setIsCompressing(false);

    // Save to history only if user is logged in
    if (user) {
      try {
        const { error } = await supabase.from("compression_history").insert({
          user_id: user.id,
          file_name: data.fileName,
          original_size: data.originalSize,
          compressed_size: data.compressedSize,
          compression_ratio: data.compressionRatio,
          redundancy_detected: data.redundancyDetected,
          compression_time: data.compressionTime,
          compressed_content: data.compressedContent,
          original_content: data.originalContent,
        });

        if (error) throw error;

        // Refresh history
        setHistoryKey((prev) => prev + 1);

        toast({
          title: "Success",
          description: "Compression saved to history",
        });
      } catch (error) {
        console.error("Error saving to history:", error);
        toast({
          title: "Error",
          description: "Failed to save compression to history. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Show success message for non-authenticated users
      toast({
        title: "Compression Complete",
        description: "Sign up to save your compression history!",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleOpenAuth = (isLogin: boolean) => {
    setAuthIsLogin(isLogin);
    setAuthDialogOpen(true);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authIsLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        setAuthDialogOpen(false);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        
        if (error) throw error;
        
        toast({
          title: "Account created!",
          description: "You've successfully signed up and logged in.",
        });
        setAuthDialogOpen(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during authentication.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred with Google sign in.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation user={user} onLogout={handleLogout} onOpenAuth={handleOpenAuth} />

      {/* Auth Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">{authIsLogin ? "Login" : "Sign Up"}</DialogTitle>
            <DialogDescription>
              {authIsLogin
                ? "Enter your credentials to access your account"
                : "Create a new account to get started"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : authIsLogin ? "Login" : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={handleGoogleSignIn}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {authIsLogin ? "Sign in with Google" : "Sign up with Google"}
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => setAuthIsLogin(!authIsLogin)}
              className="text-primary hover:underline"
            >
              {authIsLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Login"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <header className="container mx-auto px-6 pt-16 pb-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-primary leading-tight">
            UltraPress
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Compress Smarter. Analyse Better.
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            High-efficiency data compression with AI-powered analytics. Upload, compress, and receive detailed insights.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Toggle Buttons for logged-in users */}
          {user && (
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => setShowHistory(false)} 
                variant={!showHistory ? "default" : "outline"}
                size="lg"
              >
                Upload & Compress
              </Button>
              <Button 
                onClick={() => setShowHistory(true)} 
                variant={showHistory ? "default" : "outline"}
                size="lg"
              >
                View Analysis History
              </Button>
            </div>
          )}

          {/* Show History or Upload Section */}
          {showHistory && user ? (
            <>
              <section className="animate-fade-in">
                <CompressionStats />
              </section>
              <section className="animate-fade-in">
                <LiveCompressionChart />
              </section>
              <section className="animate-fade-in">
                <CompressionHistory key={historyKey} />
              </section>
            </>
          ) : (
            <>
              {/* Documentation Section - Only for non-authenticated users */}
              {!user && (
                <section className="animate-fade-in">
                  <DocumentationViewer />
                </section>
              )}

              {/* Upload Section */}
              <section className="animate-fade-in">
                <FileUpload
                  onCompressionComplete={handleCompressionComplete}
                  isCompressing={isCompressing}
                  setIsCompressing={setIsCompressing}
                />
              </section>

              {/* Results Section */}
              {compressionData && (
                <>
                  <section className="animate-fade-in">
                    <CompressionResults data={compressionData} />
                  </section>

                  <section className="animate-fade-in">
                    <AnalysisDashboard data={compressionData} />
                  </section>
                  
                  {user && (
                    <section className="animate-fade-in">
                      <LiveCompressionChart />
                    </section>
                  )}
                </>
              )}
            </>
          )}

          {/* Statistics Section */}
          <section className="bg-card border border-border rounded-lg p-12 shadow-card mt-16">
            <h2 className="text-3xl font-bold text-center mb-12">Powerful Compression Performance</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">90%</div>
                <div className="text-sm text-muted-foreground">Average Compression Ratio</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">&lt;1s</div>
                <div className="text-sm text-muted-foreground">Processing Time</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Data Privacy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">∞</div>
                <div className="text-sm text-muted-foreground">File Size Support</div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-16">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-2xl font-bold text-primary">1</div>
                <h3 className="font-semibold text-lg">Upload Your File</h3>
                <p className="text-sm text-muted-foreground">Drop your text file, document, or raw data into the upload zone</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-2xl font-bold text-primary">2</div>
                <h3 className="font-semibold text-lg">Smart Analysis</h3>
                <p className="text-sm text-muted-foreground">Our tree-based algorithm analyzes patterns and redundancies in your data</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-2xl font-bold text-primary">3</div>
                <h3 className="font-semibold text-lg">Intelligent Compression</h3>
                <p className="text-sm text-muted-foreground">Data is compressed using optimized tree structures for maximum efficiency</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-2xl font-bold text-primary">4</div>
                <h3 className="font-semibold text-lg">Download Results</h3>
                <p className="text-sm text-muted-foreground">Get detailed analytics and download your compressed file instantly</p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 shadow-card transition-smooth hover:shadow-glow">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Tree-Based Algorithm</h3>
              <p className="text-sm text-muted-foreground">
                Advanced compression using smart tree structures for optimal data reduction
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-card transition-smooth hover:shadow-glow">
              <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-Time Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Instant metrics on compression ratio, redundancy detection, and data insights
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-card transition-smooth hover:shadow-glow">
              <div className="w-12 h-12 rounded-lg gradient-secondary flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                All compression happens in your browser - your data never leaves your device
              </p>
            </div>
          </section>

          {/* Use Cases Section */}
          <section className="bg-card border border-border rounded-lg p-12 shadow-card mt-16">
            <h2 className="text-3xl font-bold text-center mb-12">Perfect For</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">📊 Data Scientists</h3>
                <p className="text-muted-foreground">Compress large datasets and log files for efficient storage and faster processing</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">💼 Business Professionals</h3>
                <p className="text-muted-foreground">Reduce document sizes for email attachments and cloud storage optimization</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">👨‍💻 Developers</h3>
                <p className="text-muted-foreground">Optimize configuration files, logs, and text-based resources in your projects</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">📚 Researchers</h3>
                <p className="text-muted-foreground">Compress research data, papers, and documentation for archival and sharing</p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="font-semibold text-lg hover:no-underline">
                    What file types are supported?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Our compression engine works with text files, documents, JSON, CSV, XML, and any text-based data format.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="font-semibold text-lg hover:no-underline">
                    Is my data secure?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Absolutely! All compression happens entirely in your browser. Your files never touch our servers or leave your device.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="font-semibold text-lg hover:no-underline">
                    What is the maximum file size?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    While there's no hard limit, browser memory constraints may affect very large files (typically 100MB+). For best results, use files under 50MB.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="font-semibold text-lg hover:no-underline">
                    How does tree-based compression work?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Our algorithm builds an intelligent tree structure from your data, identifying patterns and redundancies to achieve optimal compression ratios.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </section>

          {/* Support Section */}
          <section id="support" className="py-20 bg-gradient-to-b from-background to-muted/20 -mx-6 px-6 mt-16 rounded-2xl">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12 animate-fade-in">
                <h2 className="text-4xl font-bold mb-4">Support & Information</h2>
                <p className="text-lg text-muted-foreground">Everything you need to know about UltraPress</p>
              </div>

              {/* About Section */}
              <div className="mb-12 animate-fade-in">
                <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-primary" />
                    </span>
                    About UltraPress
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    UltraPress is a cutting-edge data compression platform that uses advanced tree-based algorithms to deliver exceptional compression ratios while maintaining data integrity. Our platform is designed for professionals, developers, and businesses who need efficient, secure, and reliable compression solutions.
                  </p>
                  <p className="text-muted-foreground">
                    All processing happens locally in your browser, ensuring complete privacy and security. Your data never leaves your device, and we never store or access your files.
                  </p>
                </div>
              </div>

              {/* What We Provide */}
              <div className="mb-12 animate-fade-in">
                <h3 className="text-2xl font-bold mb-6 text-center">What We Provide</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-smooth">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Lightning-Fast Compression</h4>
                    <p className="text-sm text-muted-foreground">Process files in seconds with our optimized tree-based algorithm that delivers up to 90% compression ratios.</p>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-smooth">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Detailed Analytics</h4>
                    <p className="text-sm text-muted-foreground">Get comprehensive insights including compression ratios, redundancy detection, and performance metrics.</p>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-smooth">
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Complete Privacy</h4>
                    <p className="text-sm text-muted-foreground">100% client-side processing means your data never leaves your browser. Zero server uploads, zero data collection.</p>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-smooth">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Multiple File Formats</h4>
                    <p className="text-sm text-muted-foreground">Support for TXT, DOC, DOCX, JSON, CSV, XML, LOG, MD, and more text-based file formats.</p>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-smooth">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Compression History</h4>
                    <p className="text-sm text-muted-foreground">Track all your compressions with detailed history and statistics. Download previous results anytime.</p>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-smooth">
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Instant Downloads</h4>
                    <p className="text-sm text-muted-foreground">Download your compressed files immediately with a single click. No waiting, no delays.</p>
                  </div>
                </div>
              </div>

              {/* Support Options */}
              <div className="mb-12 animate-fade-in">
                <h3 className="text-2xl font-bold mb-6 text-center">Get Support</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-smooth">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Email Support</h4>
                    <p className="text-sm text-muted-foreground mb-3">Get help via email within 24 hours</p>
                    <a href="mailto:support@ultrapress.com" className="text-primary hover:underline text-sm font-medium">
                      support@ultrapress.com
                    </a>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-smooth">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Documentation</h4>
                    <p className="text-sm text-muted-foreground mb-3">Comprehensive guides and tutorials</p>
                    <Button variant="outline" size="sm">View Docs</Button>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-smooth">
                    <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Live Chat</h4>
                    <p className="text-sm text-muted-foreground mb-3">Chat with our support team</p>
                    <Button variant="outline" size="sm">Start Chat</Button>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center animate-fade-in">
                <h3 className="text-xl font-bold mb-4">Need More Help?</h3>
                <p className="text-muted-foreground mb-6">
                  Our team is here to help you get the most out of UltraPress. 
                  Whether you have questions about features, need technical support, or want to provide feedback, we're here for you.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="default" size="lg">Contact Us</Button>
                  <Button variant="outline" size="lg">Schedule Demo</Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-12 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">UltraPress</h4>
              <p className="text-sm text-muted-foreground">Advanced compression technology for modern data processing needs.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Tree-Based Compression</li>
                <li>Real-Time Analysis</li>
                <li>Secure Processing</li>
                <li>Instant Results</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/logic" className="hover:text-primary transition-colors">How It Works</a></li>
                <li>Documentation</li>
                <li>API Access</li>
                <li>Support</li>
              </ul>
            </div>
            <div id="pricing">
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
            <p>© 2024 UltraPress. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* AI Assistant Floating Button */}
      <AIAssistant />
    </div>
  );
};

export default Index;
