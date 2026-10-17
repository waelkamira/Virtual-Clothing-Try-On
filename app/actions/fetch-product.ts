"use server"

export interface ProductData {
  title: string
  price: string
  images: string[]
  description: string
  brand: string
  url: string
  error?: string
}

// Mock product data to use as fallback
const mockProducts: Record<string, ProductData> = {
  default: {
    title: "Classic White T-Shirt",
    price: "$24.99",
    images: ["/placeholder.svg?height=400&width=300&text=T-Shirt"],
    description: "A comfortable classic white t-shirt made from 100% cotton.",
    brand: "Fashion Brand",
    url: "https://example.com/product/123",
  },
  tshirt: {
    title: "Premium Cotton T-Shirt",
    price: "$29.99",
    images: ["/placeholder.svg?height=400&width=300&text=Premium+T-Shirt"],
    description: "Premium cotton t-shirt with a modern fit and exceptional comfort.",
    brand: "Premium Basics",
    url: "https://example.com/product/tshirt",
  },
  dress: {
    title: "Floral Summer Dress",
    price: "$59.99",
    images: ["/placeholder.svg?height=400&width=300&text=Summer+Dress"],
    description: "Beautiful floral pattern summer dress, perfect for warm weather.",
    brand: "Summer Collection",
    url: "https://example.com/product/dress",
  },
  jeans: {
    title: "Slim Fit Denim Jeans",
    price: "$79.99",
    images: ["/placeholder.svg?height=400&width=300&text=Denim+Jeans"],
    description: "Classic slim fit jeans with a modern wash and comfortable stretch.",
    brand: "Denim Co.",
    url: "https://example.com/product/jeans",
  },
  jacket: {
    title: "Lightweight Bomber Jacket",
    price: "$89.99",
    images: ["/placeholder.svg?height=400&width=300&text=Bomber+Jacket"],
    description: "Stylish lightweight bomber jacket, perfect for spring and fall.",
    brand: "Urban Outfitters",
    url: "https://example.com/product/jacket",
  },
}

export async function fetchProductFromUrl(url: string): Promise<ProductData> {
  try {
    // Extract product type from URL for mock data selection
    const urlLower = url.toLowerCase()
    let mockProduct = mockProducts.default

    // Select appropriate mock product based on URL keywords
    if (urlLower.includes("tshirt") || urlLower.includes("t-shirt")) {
      mockProduct = mockProducts.tshirt
    } else if (urlLower.includes("dress")) {
      mockProduct = mockProducts.dress
    } else if (urlLower.includes("jeans") || urlLower.includes("pants")) {
      mockProduct = mockProducts.jeans
    } else if (urlLower.includes("jacket") || urlLower.includes("coat")) {
      mockProduct = mockProducts.jacket
    }

    // Validate URL
    try {
      new URL(url)
    } catch (e) {
      return {
        ...mockProduct,
        url,
        error: "Invalid URL format",
      }
    }

    // In a production environment, you would use a proxy service or API
    // to fetch product data from external websites to avoid CORS issues

    // For demo purposes, we'll use mock data instead of actual fetching
    // This simulates successful product retrieval without CORS issues

    // Add a slight delay to simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return mock product data with the actual URL
    return {
      ...mockProduct,
      url,
    }

    /* 
    // The following code would be used in a production environment with a proper proxy
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = load(html);
    
    // Extract product information
    const title = $('h1').first().text().trim() || 
                 $('[class*="title" i]').first().text().trim() ||
                 $('title').text().trim();
    
    const price = $('[class*="price" i]').first().text().trim() ||
                 $('[itemprop="price"]').first().text().trim() ||
                 'Price not found';
    
    const images = [];
    $('img').each((_, element) => {
      const src = $(element).attr('src') || $(element).attr('data-src');
      if (src && (src.includes('product') || src.includes('img') || src.includes('image'))) {
        const imageUrl = src.startsWith('http') ? src : new URL(src, new URL(url).origin).toString();
        images.push(imageUrl);
      }
    });
    
    const description = $('[class*="description" i]').first().text().trim() ||
                       $('[itemprop="description"]').first().text().trim() ||
                       $('meta[name="description"]').attr('content') || 
                       'Description not found';
    
    const brand = $('[itemprop="brand"]').first().text().trim() ||
                 $('[class*="brand" i]').first().text().trim() ||
                 'Brand not found';
    
    return {
      title: title || 'Title not found',
      price,
      images: images.length > 0 ? images : ['/placeholder.svg?height=400&width=300'],
      description,
      brand,
      url
    };
    */
  } catch (error) {
    console.error("Error fetching product:", error)

    // Return a default mock product with error information
    return {
      ...mockProducts.default,
      title: "Sample Product",
      url,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

