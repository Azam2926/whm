import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

// Define the props interface for type safety
const MetricCard = ({
  title,
  description,
  value,
  icon: Icon,
}: {
  title: string;
  description?: string;
  value: string | number;
  icon: LucideIcon;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex flex-col">
          <div className="text- sm font-medium">{title}</div>
          <CardDescription>{description}</CardDescription>
        </div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
