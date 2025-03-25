import { toast } from 'sonner';

const CACHE_KEY = 'smart_home_connection';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

interface CachedHomeData {
  homeId: string;
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

  private isStorageAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      this.logger.warn('localStorage is not available:', e);
      return false;
    }
  }

  private getStoredData(): CachedHomeData | null {
    try {
      const data = localStorage.getItem(CACHE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      this.logger.error('Error reading from cache:', e);
      return null;
    }
  }

  public setHomeId(homeId: string): boolean {
    if (!this.isStorageAvailable()) {
      toast.error('Unable to save home connection', {
        description: 'Please check your browser settings and try again.'
      });
      return false;
    }

    try {
      const now = Date.now();
      const data: CachedHomeData = {
        homeId,
        timestamp: now,
        expiresAt: now + CACHE_DURATION
      };

      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      this.logger.info('Home ID cached successfully');
      return true;
    } catch (e) {
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        this.logger.warn('Storage quota exceeded, clearing old data');
        localStorage.clear();
        return this.setHomeId(homeId);
      }
      
      this.logger.error('Error caching home ID:', e);
      return false;
    }
  }

  public getHomeId(): string | null {
    if (!this.isStorageAvailable()) {
      return null;
    }

    const data = this.getStoredData();
    if (!data) return null;

    if (Date.now() > data.expiresAt) {
      this.logger.info('Cache expired, clearing data');
      this.clearCache();
      return null;
    }

    return data.homeId;
  }

  public clearCache(): void {
    try {
      localStorage.removeItem(CACHE_KEY);
      this.logger.info('Cache cleared successfully');
    } catch (e) {
      this.logger.error('Error clearing cache:', e);
    }
  }

  public refreshCache(): boolean {
    const currentData = this.getStoredData();
    if (!currentData?.homeId) return false;
    
    return this.setHomeId(currentData.homeId);
  }

  public isValidCacheAvailable(): boolean {
    if (!this.isStorageAvailable()) return false;
    
    const data = this.getStoredData();
    if (!data) return false;

    return Date.now() <= data.expiresAt;
  }
}

export const homeCache = HomeCache.getInstance();