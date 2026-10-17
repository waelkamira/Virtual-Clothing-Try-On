'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { extractProductsFromUrl } from '@/lib/store-service';

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
  decrementTrialCount: () => void;
  openInWebView: (url: string) => void;
  closeWebView: () => void;
  extractProductsFromWebView: () => Promise<void>;
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

// Mock data for initial items
const mockItems: StoreItem[] = Array.from({ length: 30 }, (_, i) => {
  const store = globalStores[Math.floor(Math.random() * globalStores.length)];
  return {
    id: `item-${i}`,
    name: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 100) + 20,
    image: `/placeholder.svg?height=300&width=200&text=Product${i + 1}`,
    brand: store.name,
    category: ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes'][
      Math.floor(Math.random() * 5)
    ],
    color: ['Red', 'Blue', 'Green', 'Black', 'White'][
      Math.floor(Math.random() * 5)
    ],
    size: ['XS', 'S', 'M', 'L', 'XL'][Math.floor(Math.random() * 5)],
    material: ['Cotton', 'Polyester', 'Wool', 'Leather', 'Denim'][
      Math.floor(Math.random() * 5)
    ],
    storeId: store.id,
    storeUrl: store.url,
    storeLogo: store.logo,
  };
});

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stores] = useState<Store[]>(globalStores);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [items, setItems] = useState<StoreItem[]>(mockItems);
  const [filteredItems, setFilteredItems] = useState<StoreItem[]>(mockItems);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [trialCount, setTrialCount] = useState<number>(5);
  const [selectedItems, setSelectedItems] = useState<StoreItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 200] as [number, number],
    colors: [] as string[],
    brands: [] as string[],
    sizes: [] as string[],
    materials: [] as string[],
    categories: [] as string[],
  });

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
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200) {
      result = result.filter(
        (item) =>
          item.price >= filters.priceRange[0] &&
          item.price <= filters.priceRange[1],
      );
    }

    if (filters.colors.length > 0) {
      result = result.filter((item) => filters.colors.includes(item.color));
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
        filters.categories.includes(item.category),
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
    setFilters({
      priceRange: [0, 200],
      colors: [],
      brands: [],
      sizes: [],
      materials: [],
      categories: [],
    });
    setSearchQuery('');
    setSelectedStore(null);
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
