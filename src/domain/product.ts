import type { Yen } from './money.js';

export type ProductCategory = 'drink' | 'food';

export interface Product {
  id: string;
  name: string;
  price: Yen;
  category: ProductCategory;
}
