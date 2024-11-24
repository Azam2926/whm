"use client";

import {useEffect, useState} from 'react';
import {Plus} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {ProductList} from '@/components/products/product-list';
import {ProductDialog} from '@/components/products/product-dialog';
import {api} from '@/lib/services/api';
import {Category, Product} from '@/lib/types';
import productsService from "@/services/products.service";
import categoryService from "@/services/category.service";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    status: 'all', // Changed from empty string to 'all'
    search: '',
  });

  const loadProducts = async () => {
    const {data: {data}} = await productsService.getAll({
      status: filters.status === 'all' ? undefined : filters.status,
      search: filters.search
    });

    setProducts(data)
    const {data: {data: categories}} = await categoryService.getAll({
          status: filters.status === 'all' ? undefined : filters.status,
          search: filters.search
      });
    setCategories(categories);
  };

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const handleCreate = async (product: Omit<Product, 'id' | 'created_at' | 'category' >) => {
    await productsService.create(product);
    await loadProducts();
    setIsDialogOpen(false);
  };

  const handleUpdate = async (id: number, product: Partial<Product>) => {
    await api.updateCategory(id, product);
    await loadProducts();
    setSelectedProducts(null);
  };

  const handleDelete = async (id: number) => {
    await productsService.delete(id);
    await loadProducts();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4"/> Add Products
        </Button>
      </div>

      <ProductList
        products={products}
        onEdit={setSelectedProducts}
        onDelete={handleDelete}
      />

      <ProductDialog
        open={isDialogOpen || !!selectedProducts}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedProducts(null);
        }}
        product={selectedProducts}
        categories={categories}
        onSubmit={selectedProducts ?
          (data) => handleUpdate(selectedProducts.id, data) :
          handleCreate
        }
      />
    </div>
  );
}