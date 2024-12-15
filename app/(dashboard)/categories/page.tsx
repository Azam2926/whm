"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryList } from "@/components/categories/category-list";
import { CategoryDialog } from "@/components/categories/category-dialog";
import { Category } from "@/lib/types";
import categoryService from "@/services/category.service";

export default function CategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const updateRefreshKey = () => setRefreshKey(refreshKey + 1);

  const handleCreate = async (category: Partial<Category>) => {
    await categoryService.create(category);
    setIsDialogOpen(false);
    updateRefreshKey();
  };

  const handleUpdate = async (id: number, category: Partial<Category>) => {
    console.log("Updating category", id, category);
    await categoryService.update(id, category);
    setSelectedCategory(null);
    updateRefreshKey();
  };

  const handleDelete = async (id: string) => {
    await categoryService.delete(id);
    updateRefreshKey();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Toifalar</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Toifa qo&#39;shish
        </Button>
      </div>

      <CategoryList
        key={refreshKey}
        onEdit={setSelectedCategory}
        onDelete={handleDelete}
      />

      <CategoryDialog
        open={isDialogOpen || !!selectedCategory}
        onOpenChange={open => {
          setIsDialogOpen(open);
          if (!open) setSelectedCategory(null);
        }}
        category={selectedCategory}
        onSubmit={
          selectedCategory
            ? data => handleUpdate(selectedCategory.id, data)
            : handleCreate
        }
      />
    </div>
  );
}
