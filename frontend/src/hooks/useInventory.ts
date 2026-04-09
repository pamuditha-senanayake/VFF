import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InventoryService } from '@/services/inventory.service';
import { InventoryItem, InventoryTransaction } from '@/types';

export function useInventoryItems() {
  return useQuery({
    queryKey: ['inventoryItems'],
    queryFn: InventoryService.getItems
  });
}

export function useInventoryTransactions(itemId?: number) {
  return useQuery({
    queryKey: ['inventoryTransactions', itemId],
    queryFn: () => InventoryService.getTransactions(itemId)
  });
}

export function useCreateInventoryTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tx: Omit<InventoryTransaction, 'id'>) => InventoryService.createTransaction(tx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryTransactions'] });
    }
  });
}
