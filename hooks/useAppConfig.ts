import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import appConfigService from "@/services/appConfig.service";

// Type definitions for better type safety
interface AppConfigResponse {
  data: {
    id: number;
    key: string;
    value: string;
  };
}

interface AppConfigUpdateParams {
  key: string;
  value: string;
}

// Fetch function that accepts the key parameter
const fetchConfig = async (key: string): Promise<string> => {
  const response = (await appConfigService.get(key)) as AppConfigResponse;
  return response.data.value;
};

// Update function
const updateConfig = async (data: AppConfigUpdateParams): Promise<any> => {
  return await appConfigService.update(data);
};

export function useAppConfig(key: string) {
  const queryClient = useQueryClient();

  // Query for fetching data
  const query = useQuery({
    queryKey: ["appConfig", key], // Using array with namespace for better organization
    queryFn: () => fetchConfig(key), // Pass the key to the fetch function
  });

  // Mutation for updating data
  const mutation = useMutation({
    mutationFn: updateConfig,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["appConfig", key] });
    },
  });

  return {
    value: query.data || "", // Renamed from "rate" to "value" to be more generic
    isLoading: query.isLoading,
    isUpdating: mutation.isPending,
    error: query.error
      ? String(query.error)
      : mutation.error
        ? String(mutation.error)
        : null,
    update: (newValue: string) => mutation.mutate({ key, value: newValue }),
    refetch: () => query.refetch(), // Wrapped in function to ensure proper typing
  };
}
