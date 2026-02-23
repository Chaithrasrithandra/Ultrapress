// Decompression algorithm that reverses the tree-based compression
export const decompressData = (compressedContent: string): string => {
  try {
    // Parse the compressed data structure
    const parsed = JSON.parse(compressedContent);
    
    if (!parsed.version || !parsed.dictionary || !parsed.compressed) {
      throw new Error("Invalid compressed file format");
    }

    // Reconstruct the dictionary
    const dictionary = new Map<string, string>(parsed.dictionary);
    
    // Reverse the dictionary (code -> original word)
    const reverseDictionary = new Map<string, string>();
    dictionary.forEach((code, word) => {
      reverseDictionary.set(code, word);
    });

    // Decompress by replacing codes with original words
    let decompressed = parsed.compressed;
    
    // Sort codes by length (longest first) to avoid partial replacements
    const sortedCodes = Array.from(reverseDictionary.keys()).sort(
      (a, b) => b.length - a.length
    );

    sortedCodes.forEach(code => {
      const original = reverseDictionary.get(code);
      if (original) {
        decompressed = decompressed.split(code).join(original);
      }
    });

    return decompressed;
  } catch (error) {
    console.error("Decompression error:", error);
    throw new Error("Failed to decompress file. The file may be corrupted or in an invalid format.");
  }
};
