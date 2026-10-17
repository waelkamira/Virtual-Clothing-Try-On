'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  LinkIcon,
  ArrowRight,
  Check,
  AlertCircle,
} from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useStore, type StoreItem } from '@/contexts/store-context';
import { useToast } from '@/components/ui/use-toast';

export default function ImportPage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const {
    filteredItems,
    selectedItems,
    selectItem,
    unselectItem,
    trialCount,
    importFromUrl,
    error: storeError,
  } = useStore();

  // Mock data for testing - will be replaced by actual fetched data
  const mockItems: StoreItem[] = Array.from({ length: 12 }, (_, i) => ({
    id: `mock-item-${i}`,
    name: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 100) + 20,
    image: `/placeholder.svg?height=300&width=200&text=Product${i + 1}`,
    brand: ['Nike', 'Adidas', 'H&M', 'Zara'][Math.floor(Math.random() * 4)],
    category: ['Tops', 'Bottoms', 'Dresses', 'Outerwear'][
      Math.floor(Math.random() * 4)
    ],
    color: ['Red', 'Blue', 'Green', 'Black', 'White'][
      Math.floor(Math.random() * 5)
    ],
    size: ['XS', 'S', 'M', 'L', 'XL'][Math.floor(Math.random() * 5)],
    material: ['Cotton', 'Polyester', 'Wool', 'Leather', 'Denim'][
      Math.floor(Math.random() * 5)
    ],
    storeId: ['nike', 'adidas', 'hm', 'zara'][Math.floor(Math.random() * 4)],
    storeUrl: ['nike.com', 'adidas.com', 'hm.com', 'zara.com'][
      Math.floor(Math.random() * 4)
    ],
    storeLogo: [
      '/stores/nike.svg',
      '/stores/adidas.svg',
      '/stores/hm.svg',
      '/stores/zara.svg',
    ][Math.floor(Math.random() * 4)],
  }));

  const [items, setItems] = useState(mockItems);
  const [isImported, setIsImported] = useState(false);

  const handleImport = async () => {
    if (!url.trim()) {
      toast({
        title: 'URL required',
        description: 'Please enter a valid e-commerce URL',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      // For testing purposes, we'll use a timeout to simulate fetching
      // In a real app, this would be replaced with the actual importFromUrl function
      setTimeout(() => {
        // Simulate successful import
        setItems(mockItems);
        setIsImported(true);
        setProgress(100);
        setIsLoading(false);
        clearInterval(interval);

        toast({
          title: 'Import successful',
          description: 'Products have been imported successfully',
        });
      }, 3000);

      // Uncomment this in a real implementation
      // await importFromUrl(url)
    } catch (error) {
      clearInterval(interval);
      setIsLoading(false);
      toast({
        title: 'Import failed',
        description:
          error instanceof Error ? error.message : 'Failed to import items',
        variant: 'destructive',
      });
    }
  };

  const handleSelectItem = (item: StoreItem) => {
    if (selectedItems.some((i) => i.id === item.id)) {
      unselectItem(item.id);
    } else {
      selectItem(item);
      toast({
        title: 'Item selected',
        description: `${item.name} has been added to your try-on list`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center mb-6">
          <Link
            href="/"
            className="mr-4 p-2 rounded-full bg-orange-500/10 text-muted-foreground hover:text-foreground hover:bg-orange-500/20 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Import from URL</h1>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <LinkIcon size={20} />
                </div>
                <Input
                  type="text"
                  placeholder="Paste e-commerce URL here (e.g., amazon.com/clothing/...)"
                  className="pl-10"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleImport}
                disabled={!url.trim() || isLoading}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {isLoading ? 'Importing...' : 'Import Items'}
              </Button>
            </div>

            {storeError && (
              <div className="mb-6 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-destructive mr-2" />
                <span className="text-sm text-destructive">{storeError}</span>
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-full max-w-md h-2 bg-orange-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  Extracting clothing items from the URL... {progress}%
                </p>
              </div>
            )}

            {!isLoading && !isImported && !items.length && (
              <div className="border border-dashed border-border rounded-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <LinkIcon size={24} />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Paste a URL to get started
                </h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  We support most major e-commerce platforms including Amazon,
                  Shopify stores, and individual retailer websites.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {(isImported || items.length > 0) && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Imported Items</h2>
              {selectedItems.length > 0 && (
                <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                  <Link href="/try-on">
                    Try On Selected Items ({selectedItems.length})
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className={`overflow-hidden ${selectedItems.some((i) => i.id === item.id) ? 'ring-2 ring-orange-500' : ''}`}
                >
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    {selectedItems.some((i) => i.id === item.id) && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white">
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-sm line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {item.brand}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-orange-500">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        Size: {item.size}
                      </div>
                      <div className="h-6 w-12 relative">
                        <Image
                          src={item.storeLogo || '/placeholder.svg'}
                          alt={item.brand}
                          width={48}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                    </div>

                    <Button
                      className="w-full mt-3 bg-orange-500 hover:bg-orange-600"
                      size="sm"
                      onClick={() => handleSelectItem(item)}
                    >
                      {selectedItems.some((i) => i.id === item.id)
                        ? 'Unselect'
                        : 'Try On'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
