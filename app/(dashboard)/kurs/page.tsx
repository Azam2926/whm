"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppConfig } from "@/hooks/useAppConfig";
import { useToast } from "@/hooks/use-toast";

export default function KursPage() {
  // Use the hook with the specific config key
  const { toast } = useToast();
  const {
    value: dollarRate,
    isLoading,
    isUpdating,
    error,
    update,
  } = useAppConfig("dollar_rate");

  const [inputValue, setInputValue] = useState(dollarRate);

  // Update local state when the value is loaded or changed
  useEffect(() => {
    if (dollarRate) {
      setInputValue(dollarRate);
    }
  }, [dollarRate]);

  const hasChanges = inputValue !== dollarRate;

  const handleSave = async () => {
    if (!hasChanges) return;

    try {
      update(inputValue);
      toast({
        description: "Dollar kursi muvaffaqiyatli saqlandi",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Dollar kursini saqlashda xatolik yuz berdi",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dollar kursi</h1>
          <p className="text-gray-500 mt-1">Dollar kursini kiritib borish</p>
        </div>
      </div>

      {error && (
        <div
          className="mb-4 p-3 bg-red-100 text-red-700 rounded-md"
          role="alert"
        >
          {String(error)}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-sm">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label
              htmlFor="dollar-rate"
              className="block text-sm font-medium mb-1"
            >
              Kurs qiymati
            </label>
            <Input
              id="dollar-rate"
              type="number"
              min="0"
              step="any"
              disabled={isLoading || isUpdating}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Dollar kursini kiriting"
            />
          </div>
          <div className="flex-none mt-6">
            <Button
              type="submit"
              disabled={isLoading || isUpdating || !hasChanges}
            >
              {isUpdating ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
