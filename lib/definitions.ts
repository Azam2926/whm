import { z } from "zod";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character."
    })
    .trim()
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type GeneralSearchParam = {
  page: number;
  size: number;
  sorting?: SortingState;
  columnFilters?: ColumnFiltersState;
  name?: string;
};

export type GeneralResponse<T> = {
  data: T[];
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  _link: [
    {
      rel: "first" | "self" | "next" | "last";
      href: string;
    }
  ];
};

export const PAGE_SIZE = 10;
