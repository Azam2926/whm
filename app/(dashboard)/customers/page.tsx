"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Customer } from "@/lib/types";
import customerService from "@/services/customer.service";
import { CustomerList } from "@/components/customers/customer-list";
import { CustomerDialog } from "@/components/customers/customer-dialog";
import * as React from "react";

export default function CustomersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const updateRefreshKey = () => setRefreshKey(refreshKey + 1);

  const handleCreate = async (
    customer: Omit<Customer, "id" | "created_at">
  ) => {
    await customerService.create(customer);
    setIsDialogOpen(false);
    updateRefreshKey();
  };

  const handleUpdate = async (id: number, customer: Partial<Customer>) => {
    await customerService.update(id, customer);
    setSelectedCustomer(null);
    updateRefreshKey();
  };

  const handleDelete = async (id: string) => {
    await customerService.delete(id);
    updateRefreshKey();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mijozlar</h1>
          <p className="text-gray-500 mt-1">Barcha mijozlar ro&#39;yxati</p>
        </div>

        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Mijoz qo&#39;shish
        </Button>
      </div>

      <CustomerList
        key={refreshKey}
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
