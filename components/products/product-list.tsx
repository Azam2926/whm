import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Edit, Trash2} from "lucide-react";
import {Product} from "@/lib/types";
import {format} from "date-fns";

interface ProductListProps {
  products: Product[];
  onEdit: (category: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductList({products, onEdit, onDelete}: ProductListProps) {
    console.log(products)
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.category?.name}</TableCell>
            <TableCell>{product.price}</TableCell>
            <TableCell>{product.quantity}</TableCell>
            <TableCell>
              {product.createdAt ? format(new Date(product.createdAt), 'MMM d, yyyy') : ''}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(product)}
                >
                  <Edit className="h-4 w-4"/>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(product.id)}
                >
                  <Trash2 className="h-4 w-4"/>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}