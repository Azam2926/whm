import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

type ComboboxItem = {
  value: string;
  label: string;
  children?: React.ReactNode;
};

type ComboboxProps<T extends ComboboxItem> = {
  items: T[];
  placeholder?: string;
  onSelect: (value: T | null) => void;
  selectedValue?: string;
};

export function Combobox<T extends ComboboxItem>({
  items,
  placeholder = "Select an item...",
  onSelect,
  selectedValue
}: ComboboxProps<T>) {
  const defaultItem = selectedValue || items[0]?.value || "";
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultItem);

  const handleSelect = (selectedValue: string) => {
    const selectedItem =
      items.find(item => item.value === selectedValue) || null;
    setValue(selectedValue);
    onSelect(selectedItem);
    setOpen(false);
  };

  React.useEffect(() => {
    if (selectedValue) setValue(selectedValue);
  }, [selectedValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between"
        >
          {value
            ? items.find(item => item.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command loop>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup>
              {items.map(item => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={() => handleSelect(item.value)}
                >
                  {item.children || item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
