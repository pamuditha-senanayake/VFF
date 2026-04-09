import api from '@/lib/api-client';
import { InventoryItem, InventoryTransaction } from '@/types';

export const InventoryService = {
  getItems: async () => {
    const response = await api.get<InventoryItem[]>('/inventory/items');
    return response.data;
  },
  
  createItem: async (item: Omit<InventoryItem, 'id'>) => {
    const response = await api.post<InventoryItem>('/inventory/items', item);
    return response.data;
  },

  getTransactions: async (item_id?: number) => {
    const params = item_id ? { item_id } : {};
    const response = await api.get<InventoryTransaction[]>('/inventory/transactions', { params });
    return response.data;
  },

  createTransaction: async (transaction: Omit<InventoryTransaction, 'id'>) => {
    const response = await api.post<InventoryTransaction>('/inventory/transactions', transaction);
    return response.data;
  }
};
