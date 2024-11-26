import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Sale} from "@/lib/types";
import {format} from "date-fns";

interface SalesListProps {
  sales: Sale[];
}

export function SalesList({sales}: SalesListProps) {
  if (sales.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No sales found. Create your first sale by clicking the &#34;Add Sale&#34; button.
      </div>
    );
  }

  return (
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
  );
}