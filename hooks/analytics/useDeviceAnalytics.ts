import { useEffect, useState } from "react";

interface DeviceUsageData {
  timestamp: string;
  away: number;
  movie: number;
  learning: number;
}

interface DeviceAnalyticsResult {
  data: DeviceUsageData[];
  isLoading: boolean;
  error: Error | null;
}

export function useDeviceAnalytics(): DeviceAnalyticsResult {
  const [data, setData] = useState<DeviceUsageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // TODO: Replace with actual API call
        const mockData: DeviceUsageData[] = [
          {
            timestamp: "00:00",
            away: 60,
            movie: 20,
            learning: 20,
          },
          {
            timestamp: "04:00",
            away: 80,
            movie: 10,
            learning: 10,
          },
          {
            timestamp: "08:00",
            away: 20,
            movie: 30,
            learning: 50,
          },
          {
            timestamp: "12:00",
            away: 10,
            movie: 50,
            learning: 40,
          },
          {
            timestamp: "16:00",
            away: 15,
            movie: 55,
            learning: 30,
          },
          {
            timestamp: "20:00",
            away: 30,
            movie: 45,
            learning: 25,
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
