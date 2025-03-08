"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import appConfigService from "@/services/appConfig.service";

const fetchKurs = async () => {
  const {
    data: { value },
  } = await appConfigService.get("dollar_rate");

  return value;
};

export default function KursPage() {
  const [kurs, setKurs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchKurs();
        setKurs(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = e => {
    console.log(e.target.value);
    setKurs(e.target.value);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await appConfigService.update({
        key: "dollar_rate",
        value: kurs.toString(),
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dollar kursi</h1>
          <p className="text-gray-500 mt-1">Dollar kursini kiritib borish</p>
        </div>
      </div>

      <div className="w-64 flex gap-4">
        <Input
          type={"number"}
          disabled={isLoading}
          value={kurs}
          onChange={handleChange}
        />
        <Button disabled={isLoading} onClick={handleSave}>
          Saqlash
        </Button>
      </div>
    </div>
  );
}
