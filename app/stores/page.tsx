'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Heart, ShoppingBag, Star, Filter, X } from 'lucide-react';
import { GlassProcessingBar } from '@/components/glass-processing-bar';

interface StoreCardItem {
  id: number;
  name: string;
  logo: string;
  popular: boolean;
  rating: number;
}

const STORES: StoreCardItem[] = [
  {
    id: 1,
    name: 'Amazon Fashion',
    logo: '/placeholder.svg?height=80&width=80&text=A',
    popular: true,
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Zara',
    logo: '/placeholder.svg?height=80&width=80&text=Z',
    popular: true,
    rating: 4.7,
  },
  {
    id: 3,
    name: 'H&M',
    logo: '/placeholder.svg?height=80&width=80&text=H',
    popular: true,
    rating: 4.2,
  },
  {
    id: 4,
    name: 'Nike',
    logo: '/placeholder.svg?height=80&width=80&text=N',
    popular: true,
    rating: 4.8,
  },
  {
    id: 5,
    name: 'Adidas',
    logo: '/placeholder.svg?height=80&width=80&text=A',
    popular: false,
    rating: 4.6,
  },
  {
    id: 6,
    name: 'ASOS',
    logo: '/placeholder.svg?height=80&width=80&text=A',
    popular: false,
    rating: 4.3,
  },
  {
    id: 7,
    name: "Macy's",
    logo: '/placeholder.svg?height=80&width=80&text=M',
    popular: false,
    rating: 4.1,
  },
  {
    id: 8,
    name: 'Nordstrom',
    logo: '/placeholder.svg?height=80&width=80&text=N',
    popular: false,
    rating: 4.4,
  },
];

export default function StoresPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredStores = STORES.filter((store) =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleBrowseStore = (storeName: string) => {
    setSelectedStore(storeName);
    setIsProcessing(true);
    // Simulate connecting to store
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-amber-800 dark:text-amber-200 mb-6">
          Browse Stores
        </h1>

        {/* Search bar */}
        <div className="glass-card p-4 mb-8">
          <div className="relative mb-4">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-10 pr-10"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {searchQuery && (
                <button
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} className="text-amber-500" />
                </button>
              )}
              <button
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter
                  size={16}
                  className={
                    showFilters ? 'text-amber-500' : 'text-amber-500/50'
                  }
                />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-amber-700/70 dark:text-amber-300/70 mb-1 block">
                  Category
                </label>
                <select className="glass-input w-full">
                  <option value="">All Categories</option>
                  <option value="fashion">Fashion</option>
                  <option value="sportswear">Sportswear</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-amber-700/70 dark:text-amber-300/70 mb-1 block">
                  Sort By
                </label>
                <select className="glass-input w-full">
                  <option value="popular">Popularity</option>
                  <option value="rating">Rating</option>
                  <option value="az">A-Z</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-amber-700/70 dark:text-amber-300/70 mb-1 block">
                  Show Only
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded-full" />
                    <span className="text-sm text-amber-800 dark:text-amber-200">
                      Favorites
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded-full" />
                    <span className="text-sm text-amber-800 dark:text-amber-200">
                      Popular
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Popular stores */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-amber-800 dark:text-amber-200 mb-4 flex items-center">
          <Star className="h-5 w-5 mr-2 text-amber-500" />
          Popular Stores
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {filteredStores
            .filter((store) => store.popular)
            .map((store) => (
              <motion.div key={store.id} variants={item}>
                <StoreCard
                  store={store}
                  isFavorite={favorites.includes(store.id)}
                  onToggleFavorite={() => toggleFavorite(store.id)}
                  onBrowse={() => handleBrowseStore(store.name)}
                />
              </motion.div>
            ))}
        </motion.div>
      </div>

      {/* All stores */}
      <div>
        <h2 className="text-xl font-bold text-amber-800 dark:text-amber-200 mb-4">
          All Stores
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {filteredStores
            .filter((store) => !store.popular)
            .map((store) => (
              <motion.div key={store.id} variants={item}>
                <StoreCard
                  store={store}
                  isFavorite={favorites.includes(store.id)}
                  onToggleFavorite={() => toggleFavorite(store.id)}
                  onBrowse={() => handleBrowseStore(store.name)}
                />
              </motion.div>
            ))}
        </motion.div>
      </div>

      {/* Processing overlay */}
      <GlassProcessingBar
        isProcessing={isProcessing}
        onComplete={() => setIsProcessing(false)}
        message={`Connecting to ${selectedStore}...`}
      />
    </div>
  );
}

function StoreCard({
  store,
  isFavorite,
  onToggleFavorite,
  onBrowse,
}: {
  store: StoreCardItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBrowse: () => void;
}) {
  return (
    <motion.div whileHover={{ y: -5 }} className="glass-card overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 mr-3 flex items-center justify-center bg-amber-500/10 rounded-full overflow-hidden">
              <Image
                src={store.logo || '/placeholder.svg'}
                alt={store.name}
                width={32}
                height={32}
              />
            </div>
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-200">
                {store.name}
              </h3>
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={
                      i < Math.floor(store.rating)
                        ? 'fill-amber-500'
                        : 'opacity-30'
                    }
                  />
                ))}
                <span className="ml-1 text-xs text-amber-700/70 dark:text-amber-300/70">
                  {store.rating}
                </span>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleFavorite}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-amber-500'}`}
            />
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBrowse}
          className="w-full py-2 px-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-center gap-2 shadow-md"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Browse Products</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
