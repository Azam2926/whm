import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

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
};

type ComboboxProps = {
  items: ComboboxItem[];
  placeholder?: string;
  onCreate: (newItem: ComboboxItem) => void;
  onSelect: (selectedItem: ComboboxItem | null) => void;
};

export function ComboboxWithCreation({
  items: initialItems,
  placeholder = "Search or create...",
  onCreate,
  onSelect
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>("");
  const [items, setItems] = React.useState<ComboboxItem[]>(initialItems);
  const [inputValue, setInputValue] = React.useState("");

  const filteredItems = inputValue
    ? items.filter(item =>
        item.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    : items;

  const handleSelect = (selectedValue: string) => {
    const selectedItem =
      items.find(item => item.value === selectedValue) || null;
    setValue(selectedValue);
    setInputValue(""); // Clear the input after selection
    onSelect(selectedItem);
    setOpen(false);
  };

  const handleCreate = () => {
    const newItem = { value: inputValue, label: inputValue };
    setItems(prev => [...prev, newItem]);
    setValue(inputValue);
    onCreate(newItem);
    setInputValue(""); // Clear the input after creation
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value
            ? items.find(item => item.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search or create..."
            value={inputValue}
            onValueChange={e => setInputValue(e)}
          />
          <CommandList>
            {filteredItems.length === 0 && inputValue && (
              <CommandItem onSelect={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Create &#34;{inputValue}&#34;
              </CommandItem>
            )}
            {filteredItems.length > 0 ? (
              <CommandGroup>
                {filteredItems.map(item => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => handleSelect(item.value)}
                  >
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty>No items found.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
