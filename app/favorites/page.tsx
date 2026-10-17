'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Heart, Trash2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface FavoriteItem {
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
  dateAdded: string;
}

export default function FavoritesPage() {
  const { toast } = useToast();

  // Mock favorite items - in a real app, this would come from a context or API
  const [favorites, setFavorites] = useState<FavoriteItem[]>([
    {
      id: 'fav-1',
      name: 'Classic White T-Shirt',
      price: 29.99,
      image: '/placeholder.svg?height=300&width=200&text=White+T-Shirt',
      brand: 'Nike',
      category: 'Tops',
      color: 'White',
      size: 'M',
      material: 'Cotton',
      storeId: 'nike',
      storeUrl: 'nike.com',
      storeLogo: '/stores/nike.svg',
      dateAdded: '2023-05-15',
    },
    {
      id: 'fav-2',
      name: 'Slim Fit Jeans',
      price: 59.99,
      image: '/placeholder.svg?height=300&width=200&text=Slim+Jeans',
      brand: "Levi's",
      category: 'Bottoms',
      color: 'Blue',
      size: '32',
      material: 'Denim',
      storeId: 'levis',
      storeUrl: 'levis.com',
      storeLogo: '/placeholder.svg?text=Levis',
      dateAdded: '2023-05-20',
    },
    {
      id: 'fav-3',
      name: 'Wool Sweater',
      price: 79.99,
      image: '/placeholder.svg?height=300&width=200&text=Wool+Sweater',
      brand: 'H&M',
      category: 'Tops',
      color: 'Gray',
      size: 'L',
      material: 'Wool',
      storeId: 'hm',
      storeUrl: 'hm.com',
      storeLogo: '/stores/hm.svg',
      dateAdded: '2023-06-01',
    },
  ]);

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter((item) => item.id !== id));
    toast({
      title: 'Item removed',
      description: 'The item has been removed from your favorites',
    });
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    toast({
      title: 'Favorites cleared',
      description: 'All items have been removed from your favorites',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              href="/"
              className="mr-4 p-2 rounded-full bg-orange-500/10 text-muted-foreground hover:text-foreground hover:bg-orange-500/20 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">My Favorites</h1>
          </div>

          {favorites.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFavorites}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <Image
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={() => removeFavorite(item.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
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

                  <div className="flex justify-between items-center mb-3">
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

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                      size="sm"
                      asChild
                    >
                      <Link href={`/try-on?item=${item.id}`}>
                        Try On
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-6">
              Items you favorite will appear here
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600" asChild>
              <Link href="/stores">Browse Stores</Link>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
