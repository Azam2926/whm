import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Customer } from "@/lib/types";
import { RootStatus } from "@/lib/enums";
import { Badge } from "@/components/ui/badge";

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
}

export function CustomerList({
  customers,
  onEdit,
  onDelete
}: CustomerListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nomi</TableHead>
          <TableHead>Tel. nomer</TableHead>
          <TableHead>Manzil</TableHead>
          <TableHead>Holati</TableHead>
          <TableHead>Harakatlar</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map(customer => (
          <TableRow key={customer.id}>
            <TableCell className="font-medium">{customer.name}</TableCell>
            <TableCell>{customer.phone_number}</TableCell>
            <TableCell>{customer.address}</TableCell>
            <TableCell>
              <Badge
                variant={
                  customer.status === RootStatus.ACTIVE
                    ? "outline"
                    : "destructive"
                }
              >
                {customer.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(customer)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(customer.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
