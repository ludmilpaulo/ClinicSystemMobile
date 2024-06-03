

export interface Drug {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity_available: number;
  image_urls: string[];
  category_name: string;
  category: number;
}
