'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { extractProductsFromUrl } from '@/lib/store-service';
import { testProducts } from '@/lib/test-products';

// Define types for our store items
export interface StoreItem {
  id: string;
  name: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  color: string;
  size: string;
  material: string;
  storeId: string;
  storeUrl: string;
  storeLogo: string;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  url: string;
  category: string;
  region: string;
  popular: boolean;
}

interface StoreContextType {
  stores: Store[];
  selectedStore: Store | null;
  items: StoreItem[];
  filteredItems: StoreItem[];
  loading: boolean;
  error: string | null;
  trialCount: number;
  selectedItems: StoreItem[];
  favoriteItems: StoreItem[];
  userPhotoUrl: string | null;
  searchQuery: string;
  webViewUrl: string | null;
  filters: {
    priceRange: [number, number];
    colors: string[];
    brands: string[];
    sizes: string[];
    materials: string[];
    categories: string[];
  };

  // Actions
  selectStore: (storeId: string) => void;
  importFromUrl: (url: string, useProxy?: boolean) => Promise<void>;
  setSearchQuery: (query: string) => void;
  updateFilters: (filterType: string, value: any) => void;
  resetFilters: () => void;
  selectItem: (item: StoreItem) => void;
  unselectItem: (itemId: string) => void;
  clearSelectedItems: () => void;
  toggleFavorite: (item: StoreItem) => void;
  isFavorite: (itemId: string) => boolean;
  setUserPhotoUrl: (url: string | null) => void;
  decrementTrialCount: () => void;
  openInWebView: (url: string) => void;
  closeWebView: () => void;
  extractProductsFromWebView: () => Promise<void>;
}

const STORAGE_KEYS = {
  selected: 'vss-selected-items',
  favorites: 'vss-favorites',
  trial: 'vss-trial-count',
  photo: 'vss-user-photo',
}

const defaultFilters = {
  priceRange: [0, 400] as [number, number],
  colors: [] as string[],
  brands: [] as string[],
  sizes: [] as string[],
  materials: [] as string[],
  categories: [] as string[],
}

const CATEGORY_ALIASES: Record<string, string[]> = {
  Tops: ['tops', 't-shirts', 't-shirt', 'shirts', 'sweatshirts', 'knitwear', 'activewear'],
  Bottoms: ['bottoms', 'pants', 'jeans', 'shorts', 'skirts'],
  Dresses: ['dresses'],
  Outerwear: ['outerwear'],
  Shoes: ['shoes', 'footwear'],
  Footwear: ['shoes', 'footwear'],
  Accessories: ['accessories'],
}

function matchesCategory(itemCategory: string, filterCategory: string) {
  const item = itemCategory.toLowerCase()
  const filter = filterCategory.toLowerCase()
  if (item === filter || item.includes(filter) || filter.includes(item)) return true
  const aliases = CATEGORY_ALIASES[filterCategory] || CATEGORY_ALIASES[itemCategory] || []
  return aliases.includes(item) || aliases.includes(filter)
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

// Define global store data
const globalStores: Store[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    logo: '/stores/amazon.svg',
    url: 'amazon.com',
    category: 'department',
    region: 'global',
    popular: true,
  },
  {
    id: 'asos',
    name: 'ASOS',
    logo: '/stores/asos.svg',
    url: 'asos.com',
    category: 'fashion',
    region: 'global',
    popular: true,
  },
  {
    id: 'hm',
    name: 'H&M',
    logo: '/stores/hm.svg',
    url: 'hm.com',
    category: 'fast-fashion',
    region: 'global',
    popular: true,
  },
  {
    id: 'zara',
    name: 'Zara',
    logo: '/stores/zara.svg',
    url: 'zara.com',
    category: 'fast-fashion',
    region: 'global',
    popular: true,
  },
  {
    id: 'nike',
    name: 'Nike',
    logo: '/stores/nike.svg',
    url: 'nike.com',
    category: 'sports',
    region: 'global',
    popular: true,
  },
  {
    id: 'adidas',
    name: 'Adidas',
    logo: '/stores/adidas.svg',
    url: 'adidas.com',
    category: 'sports',
    region: 'global',
    popular: true,
  },
  {
    id: 'macys',
    name: "Macy's",
    logo: '/stores/macys.svg',
    url: 'macys.com',
    category: 'department',
    region: 'north-america',
    popular: false,
  },
  {
    id: 'nordstrom',
    name: 'Nordstrom',
    logo: '/stores/nordstrom.svg',
    url: 'nordstrom.com',
    category: 'department',
    region: 'north-america',
    popular: false,
  },
  {
    id: 'target',
    name: 'Target',
    logo: '/stores/target.svg',
    url: 'target.com',
    category: 'department',
    region: 'north-america',
    popular: false,
  },
  {
    id: 'walmart',
    name: 'Walmart',
    logo: '/stores/walmart.svg',
    url: 'walmart.com',
    category: 'department',
    region: 'north-america',
    popular: false,
  },
  {
    id: 'gap',
    name: 'Gap',
    logo: '/stores/gap.svg',
    url: 'gap.com',
    category: 'fashion',
    region: 'north-america',
    popular: false,
  },
  {
    id: 'oldnavy',
    name: 'Old Navy',
    logo: '/stores/oldnavy.svg',
    url: 'oldnavy.com',
    category: 'fast-fashion',
    region: 'north-america',
    popular: false,
  },
  {
    id: 'forever21',
    name: 'Forever 21',
    logo: '/stores/forever21.svg',
    url: 'forever21.com',
    category: 'fast-fashion',
    region: 'global',
    popular: false,
  },
  {
    id: 'uniqlo',
    name: 'Uniqlo',
    logo: '/stores/uniqlo.svg',
    url: 'uniqlo.com',
    category: 'fast-fashion',
    region: 'global',
    popular: true,
  },
  {
    id: 'urbanoutfitters',
    name: 'Urban Outfitters',
    logo: '/stores/urbanoutfitters.svg',
    url: 'urbanoutfitters.com',
    category: 'fashion',
    region: 'north-america',
    popular: false,
  },
  {
    id: 'jcrew',
    name: 'J.Crew',
    logo: '/stores/jcrew.svg',
    url: 'jcrew.com',
    category: 'fashion',
    region: 'north-america',
    popular: false,
  },
  {
    id: 'anthropologie',
    name: 'Anthropologie',
    logo: '/stores/anthropologie.svg',
    url: 'anthropologie.com',
    category: 'fashion',
    region: 'north-america',
    popular: false,
  },
  {
    id: 'freepeople',
    name: 'Free People',
    logo: '/stores/freepeople.svg',
    url: 'freepeople.com',
    category: 'fashion',
    region: 'north-america',
    popular: false,
  },
  {
    id: 'lululemon',
    name: 'Lululemon',
    logo: '/stores/lululemon.svg',
    url: 'lululemon.com',
    category: 'sports',
    region: 'global',
    popular: true,
  },
  {
    id: 'sephora',
    name: 'Sephora',
    logo: '/stores/sephora.svg',
    url: 'sephora.com',
    category: 'beauty',
    region: 'global',
    popular: false,
  },
  {
    id: 'gucci',
    name: 'Gucci',
    logo: '/stores/gucci.svg',
    url: 'gucci.com',
    category: 'luxury',
    region: 'global',
    popular: true,
  },
  {
    id: 'louisvuitton',
    name: 'Louis Vuitton',
    logo: '/stores/louisvuitton.svg',
    url: 'louisvuitton.com',
    category: 'luxury',
    region: 'global',
    popular: true,
  },
  {
    id: 'chanel',
    name: 'Chanel',
    logo: '/stores/chanel.svg',
    url: 'chanel.com',
    category: 'luxury',
    region: 'global',
    popular: true,
  },
  {
    id: 'dior',
    name: 'Dior',
    logo: '/stores/dior.svg',
    url: 'dior.com',
    category: 'luxury',
    region: 'global',
    popular: true,
  },
  {
    id: 'prada',
    name: 'Prada',
    logo: '/stores/prada.svg',
    url: 'prada.com',
    category: 'luxury',
    region: 'global',
    popular: true,
  },
  {
    id: 'hermes',
    name: 'Hermès',
    logo: '/stores/hermes.svg',
    url: 'hermes.com',
    category: 'luxury',
    region: 'global',
    popular: true,
  },
  {
    id: 'burberry',
    name: 'Burberry',
    logo: '/stores/burberry.svg',
    url: 'burberry.com',
    category: 'luxury',
    region: 'europe',
    popular: false,
  },
  {
    id: 'versace',
    name: 'Versace',
    logo: '/stores/versace.svg',
    url: 'versace.com',
    category: 'luxury',
    region: 'europe',
    popular: false,
  },
  {
    id: 'balenciaga',
    name: 'Balenciaga',
    logo: '/stores/balenciaga.svg',
    url: 'balenciaga.com',
    category: 'luxury',
    region: 'europe',
    popular: false,
  },
  {
    id: 'fendi',
    name: 'Fendi',
    logo: '/stores/fendi.svg',
    url: 'fendi.com',
    category: 'luxury',
    region: 'europe',
    popular: false,
  },
];

const catalogItems: StoreItem[] = testProducts;

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stores] = useState<Store[]>(globalStores);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [items, setItems] = useState<StoreItem[]>(catalogItems);
  const [filteredItems, setFilteredItems] = useState<StoreItem[]>(catalogItems);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [trialCount, setTrialCount] = useState<number>(5);
  const [selectedItems, setSelectedItems] = useState<StoreItem[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<StoreItem[]>([]);
  const [userPhotoUrl, setUserPhotoUrlState] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSelectedItems(readJson<StoreItem[]>(STORAGE_KEYS.selected, []));
    setFavoriteItems(readJson<StoreItem[]>(STORAGE_KEYS.favorites, []));
    const savedTrial = localStorage.getItem(STORAGE_KEYS.trial);
    if (savedTrial) setTrialCount(Number(savedTrial) || 5);
    setUserPhotoUrlState(sessionStorage.getItem(STORAGE_KEYS.photo));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEYS.selected, JSON.stringify(selectedItems));
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favoriteItems));
    localStorage.setItem(STORAGE_KEYS.trial, String(trialCount));
    if (userPhotoUrl) sessionStorage.setItem(STORAGE_KEYS.photo, userPhotoUrl);
    else sessionStorage.removeItem(STORAGE_KEYS.photo);
  }, [hydrated, selectedItems, favoriteItems, trialCount, userPhotoUrl]);

  // Apply filters and search whenever relevant state changes
  useEffect(() => {
    let result = [...items];

    // Apply store filter
    if (selectedStore) {
      result = result.filter((item) => item.storeId === selectedStore.id);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.brand.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query),
      );
    }

    // Apply filters
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 400) {
      result = result.filter(
        (item) =>
          item.price >= filters.priceRange[0] &&
          item.price <= filters.priceRange[1],
      );
    }

    if (filters.colors.length > 0) {
      result = result.filter((item) =>
        filters.colors.some((color) =>
          item.color.toLowerCase().includes(color.toLowerCase()),
        ),
      );
    }

    if (filters.brands.length > 0) {
      result = result.filter((item) => filters.brands.includes(item.brand));
    }

    if (filters.sizes.length > 0) {
      result = result.filter((item) => filters.sizes.includes(item.size));
    }

    if (filters.materials.length > 0) {
      result = result.filter((item) =>
        filters.materials.includes(item.material),
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter((item) =>
        filters.categories.some((category) => matchesCategory(item.category, category)),
      );
    }

    setFilteredItems(result);
  }, [items, selectedStore, searchQuery, filters]);

  const selectStore = (storeId: string) => {
    const store = stores.find((s) => s.id === storeId) || null;
    setSelectedStore(store);
  };

  const importFromUrl = async (
    url: string,
    useProxy = false,
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Use our new service to extract products
      const result = await extractProductsFromUrl(url, useProxy);

      if (!result.success) {
        throw new Error(result.error || 'Failed to extract products from URL');
      }

      // If we have store info, select that store
      if (result.storeInfo) {
        // Check if the store already exists in our list
        const existingStore = stores.find(
          (s) => s.id === result.storeInfo?.storeId,
        );

        if (existingStore) {
          setSelectedStore(existingStore);
        } else if (result.storeInfo) {
          // Create a new store entry
          const newStore: Store = {
            id: result.storeInfo.storeId,
            name: result.storeInfo.storeName,
            logo: result.storeInfo.logo,
            url: result.storeInfo.storeUrl,
            category: 'other',
            region: 'global',
            popular: false,
          };

          // In a real app, we would update the stores list
          // For this demo, we'll just set the selected store
          setSelectedStore(newStore);
        }
      }

      // Add the new items to our existing items
      setItems((prevItems) => {
        // Filter out any items from the same store to avoid duplicates
        const storeId = result.storeInfo?.storeId;
        const filteredItems = storeId
          ? prevItems.filter((item) => item.storeId !== storeId)
          : prevItems;

        return [...filteredItems, ...result.items];
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (filterType: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSearchQuery('');
    setSelectedStore(null);
  };

  const clearSelectedItems = () => {
    setSelectedItems([]);
  };

  const toggleFavorite = (item: StoreItem) => {
    setFavoriteItems((prev) =>
      prev.some((favorite) => favorite.id === item.id)
        ? prev.filter((favorite) => favorite.id !== item.id)
        : [...prev, item],
    );
  };

  const isFavorite = (itemId: string) => favoriteItems.some((item) => item.id === itemId);

  const setUserPhotoUrl = (url: string | null) => {
    setUserPhotoUrlState(url);
  };

  const selectItem = (item: StoreItem) => {
    // Check if we have trials left
    if (trialCount <= 0 && selectedItems.length >= 5) {
      setError(
        'You have used all your free trials. Please upgrade to try on more items.',
      );
      return;
    }

    // Check if item is already selected
    if (selectedItems.some((i) => i.id === item.id)) {
      return;
    }

    setSelectedItems((prev) => [...prev, item]);

    // Decrement trial count if we're under the limit
    if (selectedItems.length < 5) {
      decrementTrialCount();
    }
  };

  const unselectItem = (itemId: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const decrementTrialCount = () => {
    setTrialCount((prev) => Math.max(0, prev - 1));
  };

  // WebView related functions
  const openInWebView = (url: string) => {
    setWebViewUrl(url);
  };

  const closeWebView = () => {
    setWebViewUrl(null);
  };

  const extractProductsFromWebView = async (): Promise<void> => {
    if (!webViewUrl) {
      setError('No URL to extract products from');
      return;
    }

    // Use the current webViewUrl to extract products
    await importFromUrl(webViewUrl);
  };

  return (
    <StoreContext.Provider
      value={{
        stores,
        selectedStore,
        items,
        filteredItems,
        loading,
        error,
        trialCount,
        selectedItems,
        favoriteItems,
        userPhotoUrl,
        searchQuery,
        webViewUrl,
        filters,
        selectStore,
        importFromUrl,
        setSearchQuery,
        updateFilters,
        resetFilters,
        selectItem,
        unselectItem,
        clearSelectedItems,
        toggleFavorite,
        isFavorite,
        setUserPhotoUrl,
        decrementTrialCount,
        openInWebView,
        closeWebView,
        extractProductsFromWebView,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
