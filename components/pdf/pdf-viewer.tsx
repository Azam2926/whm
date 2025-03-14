"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

// Set up the PDF.js worker
// This should be set once at the application level
if (!pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
}

const options = {
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts`,
};

interface PdfViewerProps {
  pdfUrl: string;
  fileName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Loading component extracted for reuse
const LoadingIndicator = memo(() => (
  <div className="flex items-center justify-center h-[60vh]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
));
LoadingIndicator.displayName = "LoadingIndicator";

export function PdfViewer({
  pdfUrl,
  fileName = "document.pdf",
  open,
  onOpenChange,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  console.log("pdfUrl", pdfUrl);
  // Reset state when PDF changes or dialog opens
  useEffect(() => {
    if (open) {
      setLoading(true);
      setPageNumber(1);
      setScale(1.0);
    }
  }, [open, pdfUrl]);

  // Memoized callbacks to prevent unnecessary rerenders
  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setLoading(false);
    },
    [],
  );

  const changePage = useCallback(
    (offset: number) => {
      setPageNumber(prevPageNumber => {
        const newPageNumber = prevPageNumber + offset;
        return Math.max(1, Math.min(numPages || 1, newPageNumber));
      });
    },
    [numPages],
  );

  const previousPage = useCallback(() => changePage(-1), [changePage]);
  const nextPage = useCallback(() => changePage(1), [changePage]);

  const zoomIn = useCallback(() => {
    setScale(prevScale => Math.min(2.0, prevScale + 0.1));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prevScale => Math.max(0.5, prevScale - 0.1));
  }, []);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = fileName;
    link.click();
  }, [pdfUrl, fileName]);

  // Don't render anything if not open for performance
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[200vw] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chek ko'rinishi</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto my-4 flex justify-center">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<LoadingIndicator />}
            error={
              <div className="text-red-500">Failed to load PDF document</div>
            }
            options={options}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={<LoadingIndicator />}
            />
          </Document>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={zoomOut}
              disabled={scale <= 0.5}
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <Button
              variant="outline"
              size="icon"
              onClick={zoomIn}
              disabled={scale >= 2.0}
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={previousPage}
              disabled={pageNumber <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              {pageNumber} / {numPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              disabled={pageNumber >= (numPages || 1)}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Yopish
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Yuklab olish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
