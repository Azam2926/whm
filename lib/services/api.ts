import { Category, Product, Customer, Sale, ProductAnalytics } from '../types';

// Simulated API delay
const delay = () => new Promise(resolve => setTimeout(resolve, 500));

// Mock data
let categories: Category[] = [
  {
    id: 1,
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    status: 'active',
    createdAt: '2024-02-15T10:00:00Z',
    created_at: '2024-02-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Furniture',
    description: 'Home and office furniture',
    status: 'active',
    createdAt: '2024-02-15T10:00:00Z',
    created_at: '2024-02-15T10:00:00Z'
  }
];

let products: Product[] = [
  {
    id: 1,
    category_id: 1,
    name: 'Laptop',
    price: 999.99,
    quantity: 50,
    createdAt: '2024-02-15T10:00:00Z',
    created_at: '2024-02-15T10:00:00Z'
  },
  {
    id: 2,
    category_id: 2,
    name: 'Office Chair',
    price: 199.99,
    quantity: 30,
    createdAt: '2024-02-15T10:00:00Z',
    created_at: '2024-02-15T10:00:00Z'
  }
];

let customers: Customer[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'active'
  }
];

let sales: Sale[] = [
  {
    id: 1,
    product_id: 1,
    customer_id: 1,
    quantity: 2,
    price: 1999.98,
    sale_date: '2024-02-15'
  },
  {
    id: 2,
    product_id: 2,
    customer_id: 2,
    quantity: 1,
    price: 199.99,
    sale_date: '2024-02-15'
  }
];

const analytics: ProductAnalytics[] = [
  {
    id: 1,
    product_id: 1,
    total_sales_quantity: 10,
    total_sales_amount: 9999.90,
    last_sale_date: '2024-02-15T10:00:00Z'
  },
  {
    id: 2,
    product_id: 2,
    total_sales_quantity: 5,
    total_sales_amount: 999.95,
    last_sale_date: '2024-02-15T10:00:00Z'
  }
];

// Helper function to generate new ID
// @ts-expect-error: Need
const generateId = (items: unknown[]) => Math.max(...items.map(item => item.id), 0) + 1;

// API service
export const api = {
  // Categories
  getCategories: async (filters?: { status?: string; search?: string }) => {
    console.log(filters?.search);
    await delay();
    let filtered = [...categories];
    
    if (filters?.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(search) || 
        c.description.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  },
  
  createCategory: async (category: Omit<Category, 'id' | 'created_at'>) => {
    await delay();
    const newCategory = {
      ...category,
      id: generateId(categories),
      created_at: new Date().toISOString()
    };
    categories.push(newCategory);
    return newCategory;
  },
  
  updateCategory: async (id: number, category: Partial<Category>) => {
    await delay();
    categories = categories.map(c => 
      c.id === id ? { ...c, ...category } : c
    );
    return categories.find(c => c.id === id)!;
  },
  
  deleteCategory: async (id: number) => {
    await delay();
    categories = categories.filter(c => c.id !== id);
  },
  
  // Products
  getProducts: async (filters?: { category_id?: number; search?: string }) => {
    await delay();
    let filtered = [...products];
    
    if (filters?.category_id) {
      filtered = filtered.filter(p => p.category_id === filters.category_id);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search)
      );
    }
    
    return filtered.map(product => ({
      ...product,
      category: categories.find(c => c.id === product.category_id)
    }));
  },
  
  createProduct: async (product: Omit<Product, 'id' | 'created_at'>) => {
    await delay();
    const newProduct = {
      ...product,
      id: generateId(products),
      created_at: new Date().toISOString()
    };
    products.push(newProduct);
    return newProduct;
  },
  
  updateProduct: async (id: number, product: Partial<Product>) => {
    await delay();
    products = products.map(p => 
      p.id === id ? { ...p, ...product } : p
    );
    return products.find(p => p.id === id)!;
  },
  
  deleteProduct: async (id: number) => {
    await delay();
    products = products.filter(p => p.id !== id);
  },
  
  // Customers
  getCustomers: async (filters?: { status?: string; search?: string }) => {
    await delay();
    let filtered = [...customers];
    
    if (filters?.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(search) || 
        c.email.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  },
  
  createCustomer: async (customer: Omit<Customer, 'id'>) => {
    await delay();
    const newCustomer = {
      ...customer,
      id: generateId(customers)
    };
    customers.push(newCustomer);
    return newCustomer;
  },
  
  updateCustomer: async (id: number, customer: Partial<Customer>) => {
    await delay();
    customers = customers.map(c => 
      c.id === id ? { ...c, ...customer } : c
    );
    return customers.find(c => c.id === id)!;
  },
  
  deleteCustomer: async (id: number) => {
    await delay();
    customers = customers.filter(c => c.id !== id);
  },
  
  // Sales
  getSales: async (filters?: { 
    customer_id?: number; 
    product_id?: number;
    start_date: string;
    end_date: string;
  }) => {
    await delay();
    let filtered = [...sales];
    
    if (filters?.customer_id) {
      filtered = filtered.filter(s => s.customer_id === filters.customer_id);
    }
    if (filters?.product_id) {
      filtered = filtered.filter(s => s.product_id === filters.product_id);
    }
    if (filters?.start_date) {
      filtered = filtered.filter(s => s.sale_date >= filters.start_date);
    }
    if (filters?.end_date) {
      filtered = filtered.filter(s => s.sale_date <= filters.end_date);
    }
    
    return filtered.map(sale => ({
      ...sale,
      product: products.find(p => p.id === sale.product_id),
      customer: customers.find(c => c.id === sale.customer_id)
    }));
  },
  
  createSale: async (sale: Omit<Sale, 'id'>) => {
    await delay();
    const newSale = {
      ...sale,
      id: generateId(sales)
    };
    sales.push(newSale);
    
    // Update product quantity
    const product = products.find(p => p.id === sale.product_id);
    if (product) {
      product.quantity -= sale.quantity;
    }
    
    return newSale;
  },
  
  updateSale: async (id: number, sale: Partial<Sale>) => {
    await delay();
    const oldSale = sales.find(s => s.id === id);
    
    if (oldSale && sale.quantity !== undefined) {
      // Adjust product quantity
      const product = products.find(p => p.id === oldSale.product_id);
      if (product) {
        product.quantity += oldSale.quantity - sale.quantity;
      }
    }
    
    sales = sales.map(s => 
      s.id === id ? { ...s, ...sale } : s
    );
    return sales.find(s => s.id === id)!;
  },
  
  deleteSale: async (id: number) => {
    await delay();
    const sale = sales.find(s => s.id === id);
    
    if (sale) {
      // Restore product quantity
      const product = products.find(p => p.id === sale.product_id);
      if (product) {
        product.quantity += sale.quantity;
      }
    }
    
    sales = sales.filter(s => s.id !== id);
  },
  
  // Analytics
  getAnalytics: async () => {
    await delay();
    return analytics.map(analytic => ({
      ...analytic,
      product: products.find(p => p.id === analytic.product_id)
    }));
  }
};