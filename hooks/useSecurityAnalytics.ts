import { useEffect, useState } from "react";

interface SecurityEventData {
  timestamp: string;
  alerts: number;
  warnings: number;
  info: number;
}

interface SecurityAnalyticsResult {
  data: SecurityEventData[];
  isLoading: boolean;
  error: Error | null;
}

export function useSecurityAnalytics(): SecurityAnalyticsResult {
  const [data, setData] = useState<SecurityEventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // TODO: Replace with actual API call
        const mockData: SecurityEventData[] = [
          {
            timestamp: "Mon",
            alerts: 5,
            warnings: 8,
            info: 12,
          },
          {
            timestamp: "Tue",
            alerts: 3,
            warnings: 6,
            info: 15,
          },
          {
            timestamp: "Wed",
            alerts: 7,
            warnings: 4,
            info: 10,
          },
          {
            timestamp: "Thu",
            alerts: 2,
            warnings: 9,
            info: 14,
          },
          {
            timestamp: "Fri",
            alerts: 6,
            warnings: 5,
            info: 11,
          },
          {
            timestamp: "Sat",
            alerts: 4,
            warnings: 7,
            info: 13,
          },
          {
            timestamp: "Sun",
            alerts: 8,
            warnings: 3,
            info: 9,
          },
        ];

        setData(mockData);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch data")
        );
        setIsLoading(false);
      }
    }

    void fetchData();
  }, []);

  return { data, isLoading, error };
}
