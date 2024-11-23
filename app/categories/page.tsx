"use client";

import {useState, useEffect} from 'react';
import {Plus} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {CategoryList} from '@/components/categories/category-list';
import {CategoryDialog} from '@/components/categories/category-dialog';
import {api} from '@/lib/services/api';
import {Category} from '@/lib/types';
import categoryService from "@/services/category.service";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [filters, setFilters] = useState({
    status: 'all', // Changed from empty string to 'all'
    search: '',
  });

  const loadCategories = async () => {
    const {data: {data}} = await categoryService.getAll({
      status: filters.status === 'all' ? undefined : filters.status,
      search: filters.search
    });
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, [filters]);

  const handleCreate = async (category: Omit<Category, 'id' | 'created_at'>) => {
    await categoryService.create(category);
    await loadCategories();
    setIsDialogOpen(false);
  };

  const handleUpdate = async (id: number, category: Partial<Category>) => {
    await api.updateCategory(id, category);
    await loadCategories();
    setSelectedCategory(null);
  };

  const handleDelete = async (id: number) => {
    await categoryService.delete(id);
    await loadCategories();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4"/> Add Category
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search categories..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
          className="max-w-sm"
        />
        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({...filters, status: value})}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CategoryList
        categories={categories}
        onEdit={setSelectedCategory}
        onDelete={handleDelete}
      />

      <CategoryDialog
        open={isDialogOpen || !!selectedCategory}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedCategory(null);
        }}
        category={selectedCategory}
        onSubmit={selectedCategory ?
          (data) => handleUpdate(selectedCategory.id, data) :
          handleCreate
        }
      />
    </div>
  );
}