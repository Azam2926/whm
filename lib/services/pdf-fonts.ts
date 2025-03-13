import type { jsPDF } from "jspdf";

// Add custom fonts to support Uzbek characters
export function addFonts(doc: jsPDF): void {
  // This is a simplified version. In a real implementation, you would:
  // 1. Include the actual font files in your project
  // 2. Convert them to the format required by jsPDF
  // 3. Add them using doc.addFont()
  // For this example, we'll use the built-in fonts
  // In a production environment, you should add proper font support
  // for Uzbek characters
  // Example of how to add a custom font:
  /*
  doc.addFont(
    "path/to/Roboto-Regular.ttf",
    "Roboto",
    "normal"
  );

  doc.addFont(
    "path/to/Roboto-Bold.ttf",
    "Roboto",
    "bold"
  );
  */
}
