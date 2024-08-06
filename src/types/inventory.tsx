export interface InventoryItem {
  id: number;
  name: string;
  description: string;
  image: string;
  items: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  type: 'suggested' | 'custom';
}