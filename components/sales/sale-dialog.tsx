"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Customer, Product, SaleCreate } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

const saleItemSchema = z.object({
  product_id: z.string().min(1, "Product is required"),
  quantity: z.string().min(1, "Quantity is required").transform(Number),
  price: z.number()
});

type SaleItemType = z.infer<typeof saleItemSchema>;

const formSchema = z.object({
  customer_id: z.string().min(1, "Customer is required"),
  sales: z.array(saleItemSchema).min(1, "At least one product is required")
});

interface SaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SaleCreate) => Promise<void>;
  products: Product[];
  customers: Customer[];
}

export function SaleDialog({
  open,
  onOpenChange,
  onSubmit,
  products,
  customers
}: SaleDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_id: "",
      sales: [{ product_id: "", quantity: 0, price: 0 }]
    }
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await onSubmit({
        customer_id: parseInt(data.customer_id),
        sales: data.sales.map(sale => ({
          product_id: parseInt(sale.product_id),
          quantity: sale.quantity,
          price: sale.price
        }))
      });
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSaleItem = () => {
    const currentSales = form.getValues("sales");
    form.setValue("sales", [
      ...currentSales,
      { product_id: "", quantity: 0, price: 0 }
    ]);
  };

  const removeSaleItem = (index: number) => {
    const currentSales = form.getValues("sales");
    if (currentSales.length > 1) {
      form.setValue(
        "sales",
        currentSales.filter((_, i) => i !== index)
      );
    }
  };

  const updatePrice = (product_id: string, index: number) => {
    const product = products.find(p => p.id === parseInt(product_id));
    if (product) {
      form.setValue(`sales.${index}.price`, product.price);
    }
  };

  const calculateTotal = (sale: SaleItemType) => {
    const product = products.find(p => p.id.toString() === sale.product_id);
    if (!product) return "0.00";

    return (product.price * sale.quantity).toFixed(2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Sale</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem
                          key={customer.id}
                          value={customer.id.toString()}
                        >
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              {form.watch("sales").map((sale, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <FormField
                    control={form.control}
                    name={`sales.${index}.product_id`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Product</FormLabel>
                        <Select
                          onValueChange={value => {
                            field.onChange(value);
                            updatePrice(value, index);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map(product => (
                              <SelectItem
                                key={product.id}
                                value={product.id.toString()}
                              >
                                {product.name}{" "}
                                <span className="text-gray-500">
                                  ${product.price}, {product.quantity} ta
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`sales.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      ${calculateTotal(sale)}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSaleItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button type="button" variant="outline" onClick={addSaleItem}>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Sale"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
