import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Info, Zap, BarChart } from "lucide-react";

export const DocumentationViewer = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <CardTitle>Compression Documentation</CardTitle>
        </div>
        <CardDescription>Learn about file compression and how to use this tool effectively</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="getting-started">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                Getting Started
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p><strong>What is file compression?</strong></p>
              <p>File compression reduces the size of files by removing redundant data and using efficient encoding techniques.</p>
              
              <p className="mt-3"><strong>How to compress files:</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Click "Choose File" or drag and drop a file</li>
                <li>Wait for the compression process to complete</li>
                <li>Review your compression results and statistics</li>
                <li>Download the compressed file if needed</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="understanding-metrics">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                Understanding Metrics
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p><strong>Compression Ratio:</strong> The percentage of space saved. Higher is better.</p>
              <p><strong>Original Size:</strong> The size of your file before compression.</p>
              <p><strong>Compressed Size:</strong> The size after compression.</p>
              <p><strong>Redundancy Detected:</strong> The amount of repetitive patterns found in your file.</p>
              <p><strong>Compression Time:</strong> How long the compression process took.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="best-practices">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Best Practices
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p><strong>Text Files:</strong> Highly compressible, especially those with repetitive content.</p>
              <p><strong>Already Compressed Files:</strong> JPEGs, MP3s, and ZIPs won't compress much further.</p>
              <p><strong>Large Files:</strong> May take longer to process but often yield better compression ratios.</p>
              <p><strong>Redundant Data:</strong> Files with patterns and repetition compress better.</p>
              
              <p className="mt-3"><strong>Tips for better compression:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Remove unnecessary formatting from text files</li>
                <li>Consolidate similar data</li>
                <li>Use appropriate file formats</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="technical-details">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                Technical Details
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p><strong>Algorithm:</strong> This tool uses a tree-based compression algorithm inspired by Huffman coding.</p>
              <p><strong>Process:</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Frequency analysis of characters and words</li>
                <li>Dictionary creation for common patterns</li>
                <li>Run-length encoding for repetitive sequences</li>
                <li>Lossless compression ensures no data is lost</li>
              </ol>
              
              <p className="mt-3"><strong>Supported Files:</strong> All text-based files work best. Binary files may have limited compression.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
