import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Sale} from "@/lib/types";
import {format} from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SalesListProps {
  sales: Sale[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function SalesList({ sales, currentPage, totalPages, onPageChange }: SalesListProps) {
  if (sales.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No sales found. Create your first sale by clicking the &#34;Add Sale&#34; button.
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale, index) => (
            <TableRow key={index}>
              <TableCell>
                {sale.sale_date ? format(new Date(sale.sale_date), 'MMM d, yyyy') : '-'}
              </TableCell>
              <TableCell>{sale.customer?.name}</TableCell>
              <TableCell>{sale.product?.name}</TableCell>
              <TableCell>{sale.quantity}</TableCell>
              <TableCell>${sale.price.toFixed(2)}</TableCell>
              <TableCell>${(sale.quantity * sale.price).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Sahifa {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}