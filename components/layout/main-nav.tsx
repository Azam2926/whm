"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Tags,
  Users,
  ShoppingCart
} from "lucide-react";

const items = [
  {
    title: "Umumiy",
    href: "/",
    icon: LayoutDashboard
  },
  {
    title: "Sotuvlar",
    href: "/sales",
    icon: ShoppingCart
  },
  {
    title: "Toifalar",
    href: "/categories",
    icon: Tags
  },
  {
    title: "Mahsulotlar",
    href: "/products",
    icon: Package
  },
  {
    title: "Mijozlar",
    href: "/customers",
    icon: Users
  }
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {items.map(item => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
