import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CategoriesTableSkeleton() {
  return Array.from({ length: 10 }).map((_, rowIndex) => (
    <TableRow key={rowIndex}>
      <TableCell>
        <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-32" />
      </TableCell>
    </TableRow>
  ));
}
