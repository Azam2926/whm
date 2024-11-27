"use client";

import {useEffect, useState} from 'react';
import {Plus} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {SalesList} from '@/components/sales/sales-list';
import {SaleDialog} from '@/components/sales/sale-dialog';
import {api} from '@/lib/services/api';
import {Customer, Product, Sale} from '@/lib/types';
import {LoadingSpinner} from "@/components/ui/loading-spinner";

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 10;

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [{data: {sales: salesData, total_pages}}, {data: {data: productsData}}, {data: {data: customersData}}] = await Promise.all([
        api.getSales({ page: currentPage, size: PAGE_SIZE }),
        api.getProducts(),
        api.getCustomers(),
      ]);
      setSales(salesData);
      setTotalPages(total_pages);
      setProducts(productsData);
      setCustomers(customersData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const handleCreate = async (saleData: {
    customerId: number;
    sales: { productId: number; quantity: number; price: number }[];
  }) => {
    await api.createSale(saleData)
    await loadData()
    setIsDialogOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Sales</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4"/> Add Sale
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner/>
        </div>
      ) : (
        <SalesList 
          sales={sales} 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <SaleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreate}
        products={products}
        customers={customers}
      />
    </div>
  );
}