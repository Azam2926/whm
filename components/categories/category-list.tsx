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
import { Category } from "@/lib/types";
import { formatDate } from "@/utils/formatDate";
import { RootStatus } from "@/lib/enums";
import { Badge } from "@/components/ui/badge";

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export function CategoryList({
  categories,
  onEdit,
  onDelete
}: CategoryListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map(category => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell>{category.description}</TableCell>
            <TableCell>
              <Badge
                variant={
                  category.status === RootStatus.ACTIVE
                    ? "outline"
                    : "destructive"
                }
              >
                {category.status}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(category.created_at)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(category)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(category.id)}
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
