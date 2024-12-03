"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Customer } from "@/lib/types";
import customerService from "@/services/customer.service";
import { CustomerList } from "@/components/customers/customer-list";
import { CustomerDialog } from "@/components/customers/customer-dialog";
import { CustomerStatus } from "@/lib/enums";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [filters, setFilters] = useState({
    status: "all", // Changed from empty string to 'all'
    search: ""
  });

  const loadCategories = async () => {
    const {
      data: { data }
    } = await customerService.getAll(filters);
    setCustomers(data);
  };

  useEffect(() => {
    loadCategories();
  }, [filters]);

  const handleCreate = async (
    customer: Omit<Customer, "id" | "created_at">
  ) => {
    await customerService.create(customer);
    await loadCategories();
    setIsDialogOpen(false);
  };

  const handleUpdate = async (id: number, customer: Partial<Customer>) => {
    await customerService.update(id, customer);
    await loadCategories();
    setSelectedCustomer(null);
  };

  const handleDelete = async (id: number) => {
    await customerService.delete(id);
    await loadCategories();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search customers..."
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
          className="max-w-sm"
        />
        <Select
          value={filters.status}
          onValueChange={value => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value={CustomerStatus.ACTIVE}>
              {CustomerStatus.ACTIVE}
            </SelectItem>
            <SelectItem value={CustomerStatus.INACTIVE}>
              {CustomerStatus.INACTIVE}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CustomerList
        customers={customers}
        onEdit={setSelectedCustomer}
        onDelete={handleDelete}
      />

      <CustomerDialog
        open={isDialogOpen || !!selectedCustomer}
        onOpenChange={open => {
          setIsDialogOpen(open);
          if (!open) setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onSubmit={
          selectedCustomer
            ? data => handleUpdate(selectedCustomer.id, data)
            : handleCreate
        }
      />
    </div>
  );
}
