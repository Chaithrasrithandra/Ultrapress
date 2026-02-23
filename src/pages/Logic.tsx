import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Binary, GitBranch, Database, Zap, FileCode } from "lucide-react";
import { Link } from "react-router-dom";

const Logic = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Link to="/">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Compression
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Compression Logic
          </h1>
          <p className="text-muted-foreground">
            Understanding the tree-based compression algorithm
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Overview */}
          <Card className="p-8 shadow-card border-border">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                <GitBranch className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Tree-Based Compression</h2>
                <p className="text-muted-foreground">
                  Our compression engine uses a sophisticated tree-based algorithm that analyzes patterns
                  in your data to achieve optimal compression ratios while maintaining data integrity.
                </p>
              </div>
            </div>

            <div className="bg-secondary/30 rounded-lg p-6 border border-border">
              <h3 className="text-lg font-semibold mb-4">Algorithm Overview</h3>
              <div className="space-y-3 text-sm">
                <p>
                  The compression process combines multiple techniques including frequency analysis,
                  dictionary encoding, and pattern recognition to reduce file sizes efficiently.
                </p>
                <p className="text-muted-foreground">
                  By building a frequency tree of common patterns and replacing them with shorter codes,
                  we can achieve significant space savings without losing any information.
                </p>
              </div>
            </div>
          </Card>

          {/* Algorithm Steps */}
          <Card className="p-8 shadow-card border-border">
            <h2 className="text-2xl font-bold mb-6">Compression Process</h2>
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-primary" />
                    Data Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    The algorithm first scans the input data to build a frequency map of all characters
                    and words. This analysis identifies which patterns appear most often in your data.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-accent" />
                    Tree Construction
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Using the frequency data, a binary tree structure is created where the most common
                    patterns get shorter codes (similar to Huffman coding principles). Less frequent
                    patterns receive longer codes.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Dictionary Creation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    A compression dictionary is generated mapping the most frequent words and patterns
                    to compact codes. This dictionary becomes the key to both compression and decompression.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Binary className="w-5 h-5 text-accent" />
                    Data Encoding
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    The original data is then encoded by replacing patterns with their corresponding
                    dictionary codes, resulting in a much smaller representation of the same information.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Optimization
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Final optimization passes ensure maximum compression by identifying and eliminating
                    any remaining redundancy in the encoded data.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Technical Details */}
          <Card className="p-8 shadow-card border-border">
            <h2 className="text-2xl font-bold mb-6">Technical Implementation</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-secondary/30 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-primary" />
                  Frequency Analysis
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Character-level frequency mapping</li>
                  <li>• Word-level pattern detection</li>
                  <li>• N-gram sequence analysis</li>
                  <li>• Statistical probability calculations</li>
                </ul>
              </div>

              <div className="bg-secondary/30 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5 text-accent" />
                  Dictionary Encoding
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Adaptive dictionary generation</li>
                  <li>• Optimal code assignment</li>
                  <li>• Pattern replacement mapping</li>
                  <li>• Reversible transformation</li>
                </ul>
              </div>

              <div className="bg-secondary/30 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Binary className="w-5 h-5 text-primary" />
                  Tree Structure
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Binary tree organization</li>
                  <li>• Balanced node distribution</li>
                  <li>• Optimal path length calculation</li>
                  <li>• Efficient traversal algorithms</li>
                </ul>
              </div>

              <div className="bg-secondary/30 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  Performance
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• O(n log n) time complexity</li>
                  <li>• Linear space requirements</li>
                  <li>• Real-time processing capability</li>
                  <li>• Minimal memory overhead</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Benefits */}
          <Card className="p-8 shadow-card border-border">
            <h2 className="text-2xl font-bold mb-6">Key Benefits</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                <h3 className="font-semibold mb-2 text-primary">Lossless</h3>
                <p className="text-sm text-muted-foreground">
                  Perfect data reconstruction guaranteed - no information is lost during compression
                </p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                <h3 className="font-semibold mb-2 text-accent">Adaptive</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically adjusts to your data patterns for optimal compression ratios
                </p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                <h3 className="font-semibold mb-2 text-primary">Efficient</h3>
                <p className="text-sm text-muted-foreground">
                  Fast processing with minimal computational overhead and memory usage
                </p>
              </div>
            </div>
          </Card>

          {/* Example */}
          <Card className="p-8 shadow-card border-border">
            <h2 className="text-2xl font-bold mb-6">Simple Example</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Original Text:</h3>
                <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                  <code className="text-sm font-mono">
                    "the quick brown fox jumps over the lazy dog the end"
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Frequency Analysis:</h3>
                <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                  <code className="text-sm font-mono text-muted-foreground">
                    "the" appears 3 times → Assigned code [0]
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Compressed Result:</h3>
                <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                  <code className="text-sm font-mono text-primary">
                    "[0] quick brown fox jumps over [0] lazy dog [0] end"
                  </code>
                </div>
              </div>

              <div className="bg-accent/10 rounded-lg p-4 border border-accent/30">
                <p className="text-sm text-accent-foreground">
                  <strong>Result:</strong> By replacing the common word "the" with a short code [0],
                  we saved 6 characters, demonstrating how pattern recognition reduces file size.
                </p>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center pt-8">
            <Link to="/">
              <Button size="lg" className="gap-2">
                Try the Compression Engine
                <Zap className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>UltraPress - Advanced compression technology for modern data</p>
        </div>
      </footer>
    </div>
  );
};

export default Logic;
