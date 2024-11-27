import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Edit, Trash2} from "lucide-react";
import {Customer} from "@/lib/types";

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
}

const customerStatusColor = {
  'CASH': 'bg-green-100 text-green-800',
  'CREDIT': 'bg-red-100 text-red-800',
}

export function CustomerList({customers, onEdit, onDelete}: CustomerListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell className="font-medium">{customer.name}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${customerStatusColor[customer.status]}`}>
                {customer.status}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(customer)}
                >
                  <Edit className="h-4 w-4"/>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(customer.id)}
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