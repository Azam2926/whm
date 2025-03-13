import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, Product } from "@/lib/types";
import { Measurement, RootStatus, TypePrice } from "@/lib/enums";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Form schema only includes editable fields
const formSchema = z.object({
  name: z.string().min(1, "Nomi to'lidirilishi shart"),
  category_id: z.number(),
  price: z.coerce
    .number()
    .min(0, "Price must be positive")
    .or(
      z
        .string()
        .regex(/^\d*\.?\d*$/)
        .transform(Number),
    ),
  quantity: z
    .number()
    .int()
    .min(0, "Quantity must be a positive integer")
    .or(z.string().regex(/^\d+$/).transform(Number)),
  measurement: z.nativeEnum(Measurement),
  type_price: z.nativeEnum(TypePrice),
});

type FormData = z.infer<typeof formSchema>;

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  categories: Category[];
  onSubmit: (data: FormData & { id?: number }) => Promise<void>;
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
  categories,
  onSubmit,
}: ProductDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const default_form_values = {
    name: product?.name,
    category_id: product?.category?.id,
    price: product?.price,
    quantity: product?.quantity,
    measurement: product?.measurement,
    type_price: product?.type_price,
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: default_form_values,
  });

  // Reset form when dialog opens/closes or product changes
  useEffect(() => {
    form.reset(default_form_values); // Reset to default values when closing
  }, [open, product, form]);

  const handleSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit({
        ...data,
        id: product?.id,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {product ? "Mahsulotni tahrirlash" : "Mahsulot yaratish"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Toifa</FormLabel>
                  <Select
                    onValueChange={value => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Toifani tanglash" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomi</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Mahsulot nomini kiriting" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="measurement"
              render={({ field }) => {
                return (
                  <FormItem className="space-y-1">
                    <FormLabel>Birligi:</FormLabel>
                    <FormMessage />
                    <ToggleGroup
                      type="single"
                      variant="default"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormItem>
                        <FormControl>
                          <ToggleGroupItem
                            value={Measurement.UNKNOWN}
                            aria-label="Toggle Naqd"
                          >
                            {Measurement.UNKNOWN}
                          </ToggleGroupItem>
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <ToggleGroupItem
                            value={Measurement.KG}
                            aria-label="Toggle Naqd"
                          >
                            {Measurement.KG}
                          </ToggleGroupItem>
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <ToggleGroupItem
                            value={Measurement.QOP}
                            aria-label="Toggle Naqd"
                          >
                            {Measurement.QOP}
                          </ToggleGroupItem>
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <ToggleGroupItem
                            value={Measurement.METR}
                            aria-label="Toggle Naqd"
                          >
                            {Measurement.METR}
                          </ToggleGroupItem>
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <ToggleGroupItem
                            value={Measurement.DONA}
                            aria-label="Toggle Naqd"
                          >
                            {Measurement.DONA}
                          </ToggleGroupItem>
                        </FormControl>
                      </FormItem>
                    </ToggleGroup>
                  </FormItem>
                );
              }}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Narxi:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        onChange={e => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type_price"
                render={({ field }) => (
                  <FormItem className="mr-auto space-y-1">
                    <FormLabel>Turi:</FormLabel>
                    <FormMessage />
                    <ToggleGroup
                      type="single"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormItem>
                        <FormControl>
                          <ToggleGroupItem
                            value={TypePrice.USD}
                            aria-label="Toggle USD"
                          >
                            {TypePrice.USD}
                          </ToggleGroupItem>
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <ToggleGroupItem
                            value={TypePrice.SUM}
                            aria-label="Toggle SUM"
                          >
                            {TypePrice.SUM}
                          </ToggleGroupItem>
                        </FormControl>
                      </FormItem>
                    </ToggleGroup>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soni</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      onChange={e => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {product && (
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>
                  Created: {new Date(product.created_at).toLocaleDateString()}
                </div>
                <div>ID: {product.id}</div>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saqlanyapti..." : "Saqlash"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
