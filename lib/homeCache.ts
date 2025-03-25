import { toast } from "sonner";

const CACHE_KEY_PREFIX = "smart_home_connection";
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

interface CachedHomeData {
  homeId: string;
  userId: string;
  timestamp: number;
  expiresAt: number;
}

class HomeCache {
  private static instance: HomeCache;
  private logger: Console;

  private constructor() {
    this.logger = console;
  }

  public static getInstance(): HomeCache {
    if (!HomeCache.instance) {
      HomeCache.instance = new HomeCache();
    }
    return HomeCache.instance;
  }

  private getCacheKey(userId?: string): string {
    return userId ? `${CACHE_KEY_PREFIX}_${userId}` : CACHE_KEY_PREFIX;
  }

  private isStorageAvailable(): boolean {
    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      this.logger.warn("localStorage is not available:", e);
      return false;
    }
  }

  private getStoredData(userId?: string): CachedHomeData | null {
    try {
      const data = localStorage.getItem(this.getCacheKey(userId));
      if (!data) return null;

      const parsedData = JSON.parse(data) as CachedHomeData;

      // Validate that the data belongs to the correct user
      if (userId && parsedData.userId !== userId) {
        this.logger.warn("User ID mismatch in cached data");
        return null;
      }

      return parsedData;
    } catch (e) {
      this.logger.error("Error reading from cache:", e);
      return null;
    }
  }

  public setHomeId(homeId: string, userId: string): boolean {
    if (!userId) {
      toast.error("Authentication required", {
        description: "Please sign in to connect your home.",
      });
      return false;
    }

    if (!this.isStorageAvailable()) {
      toast.error("Unable to save home connection", {
        description: "Please check your browser settings and try again.",
      });
      return false;
    }

    try {
      const now = Date.now();
      const data: CachedHomeData = {
        homeId,
        userId,
        timestamp: now,
        expiresAt: now + CACHE_DURATION,
      };

      localStorage.setItem(this.getCacheKey(userId), JSON.stringify(data));
      this.logger.info("Home ID cached successfully for user:", userId);
      return true;
    } catch (e) {
      if (e instanceof Error && e.name === "QuotaExceededError") {
        this.logger.warn("Storage quota exceeded, clearing old data");
        this.clearAllUserData();
        return this.setHomeId(homeId, userId);
      }

      this.logger.error("Error caching home ID:", e);
      return false;
    }
  }

  public getHomeId(userId?: string): string | null {
    if (!this.isStorageAvailable()) {
      return null;
    }

    const data = this.getStoredData(userId);
    if (!data) return null;

    if (Date.now() > data.expiresAt) {
      this.logger.info("Cache expired, clearing data");
      this.clearCache(userId);
      return null;
    }

    return data.homeId;
  }

  public clearCache(userId?: string): void {
    try {
      if (userId) {
        localStorage.removeItem(this.getCacheKey(userId));
        this.logger.info("Cache cleared successfully for user:", userId);
      } else {
        this.clearAllUserData();
      }
    } catch (e) {
      this.logger.error("Error clearing cache:", e);
    }
  }

  private clearAllUserData(): void {
    try {
      // Clear all smart home related data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(CACHE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      }
      this.logger.info("All user data cleared successfully");
    } catch (e) {
      this.logger.error("Error clearing all user data:", e);
    }
  }

  public refreshCache(userId?: string): boolean {
    const currentData = this.getStoredData(userId);
    if (!currentData?.homeId || !currentData.userId) return false;

    return this.setHomeId(currentData.homeId, currentData.userId);
  }

  public isValidCacheAvailable(userId?: string): boolean {
    if (!this.isStorageAvailable()) return false;

    const data = this.getStoredData(userId);
    if (!data) return false;

    return Date.now() <= data.expiresAt;
  }
}

export const homeCache = HomeCache.getInstance();
