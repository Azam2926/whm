import type { jsPDF } from "jspdf";

// Map of font files to be lazy-loaded
const fontFiles = {
  "Roboto-Regular": "/fonts/Roboto-Regular.ttf",
  "Roboto-Bold": "/fonts/Roboto-Bold.ttf",
};

// Track which fonts have been loaded to avoid duplicate loading
const loadedFonts = new Set<string>();

/**
 * Add custom fonts to support Uzbek characters
 * This implementation lazy-loads fonts when needed
 */
export async function addFonts(doc: jsPDF): Promise<void> {
  // Only load fonts if they haven't been loaded already
  if (loadedFonts.size === 0) {
    try {
      // Load Roboto Regular
      if (!loadedFonts.has("Roboto-Regular")) {
        const regularFontResponse = await fetch(fontFiles["Roboto-Regular"]);
        if (regularFontResponse.ok) {
          const regularFontData = await regularFontResponse.arrayBuffer();
          doc.addFileToVFS(
            "Roboto-Regular.ttf",
            btoa(
              new Uint8Array(regularFontData).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                "",
              ),
            ),
          );
          doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
          loadedFonts.add("Roboto-Regular");
        }
      }

      // Load Roboto Bold
      if (!loadedFonts.has("Roboto-Bold")) {
        const boldFontResponse = await fetch(fontFiles["Roboto-Bold"]);
        if (boldFontResponse.ok) {
          const boldFontData = await boldFontResponse.arrayBuffer();
          doc.addFileToVFS(
            "Roboto-Bold.ttf",
            btoa(
              new Uint8Array(boldFontData).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                "",
              ),
            ),
          );
          doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");
          loadedFonts.add("Roboto-Bold");
        }
      }
    } catch (error) {
      console.error("Failed to load custom fonts:", error);
      // Fallback to default fonts
    }
  }

  // Set font regardless of whether custom fonts loaded (will use default if custom failed)
  doc.setFont("Roboto");
}

/**
 * Check if the fonts are available
 * This can be used to determine if we need to show a loading state
 */
export function areFontsLoaded(): boolean {
  return loadedFonts.size === Object.keys(fontFiles).length;
}
