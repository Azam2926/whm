import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/lib/types";

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.category?.name}</TableCell>
            <TableCell>${product.price.toFixed(2)}</TableCell>
            <TableCell>{product.quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}