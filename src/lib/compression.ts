import type { CompressionData } from "@/pages/Index";

// Helper: compress bytes using CompressionStream (gzip)
async function gzipCompress(data: Uint8Array): Promise<Uint8Array> {
  const cs = new CompressionStream("gzip");
  const writer = cs.writable.getWriter();
  writer.write(data as unknown as BufferSource);
  writer.close();

  const reader = cs.readable.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

// Convert Uint8Array to base64 (chunk-safe)
function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  const CHUNK_SIZE = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE));
  }
  return btoa(binary);
}

// Detect redundancy in original data for analytics
function detectRedundancy(data: Uint8Array): number {
  // Simple byte-frequency based redundancy estimate
  const freq = new Map<number, number>();
  for (const byte of data) {
    freq.set(byte, (freq.get(byte) || 0) + 1);
  }
  // Shannon entropy
  const len = data.length;
  if (len === 0) return 0;
  let entropy = 0;
  for (const count of freq.values()) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  // Max entropy for bytes is 8 bits; redundancy = how far below max
  const maxEntropy = 8;
  const redundancy = Math.round(((maxEntropy - entropy) / maxEntropy) * 100);
  return Math.max(0, Math.min(redundancy, 100));
}

export const compressData = async (
  base64Content: string,
  fileName: string,
  targetCompressionLevel: number = 50,
  _targetSizeBytes?: number
): Promise<CompressionData> => {
  const startTime = performance.now();

  // Decode base64 to get original binary bytes
  const binaryString = atob(base64Content);
  const originalBytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    originalBytes[i] = binaryString.charCodeAt(i);
  }

  const originalSize = originalBytes.length;

  // Detect redundancy for analytics
  const redundancyDetected = detectRedundancy(originalBytes);

  // Compress using gzip
  const compressedBytes = await gzipCompress(originalBytes);
  const compressedSize = compressedBytes.length;

  // Convert compressed bytes to base64 for storage
  const compressedBase64 = uint8ToBase64(compressedBytes);

  const compressionRatio = Math.round(
    ((originalSize - compressedSize) / originalSize) * 100
  );
  const compressionTime = Math.round(performance.now() - startTime);

  return {
    originalSize,
    compressedSize,
    compressionRatio: Math.max(compressionRatio, 0),
    redundancyDetected,
    compressionTime: Math.max(compressionTime, 1),
    compressedContent: compressedBase64,
    originalContent: base64Content,
    fileName,
  };
};
