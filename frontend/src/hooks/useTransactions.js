import { useQuery, useMutation, useQueryClient } from 'react-query';
import { transactionAPI } from '../utils/api';
import toast from 'react-hot-toast';

export const useTransactions = (filters = {}) => {
  return useQuery(
    ['transactions', filters],
    () => transactionAPI.getTransactions(filters),
    {
      select: (data) => data.data,
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to fetch transactions');
      }
    }
  );
};

export const useTransaction = (id) => {
  return useQuery(
    ['transaction', id],
    () => transactionAPI.getTransaction(id),
    {
      select: (data) => data.data.data,
      enabled: !!id,
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to fetch transaction');
      }
    }
  );
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation(transactionAPI.createTransaction, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['transaction-stats']);
      toast.success('Transaction created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create transaction');
    }
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, data }) => transactionAPI.updateTransaction(id, data),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['transactions']);
        queryClient.invalidateQueries(['transaction', variables.id]);
        queryClient.invalidateQueries(['transaction-stats']);
        toast.success('Transaction updated successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update transaction');
      }
    }
  );
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation(transactionAPI.deleteTransaction, {
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['transaction-stats']);
      toast.success('Transaction deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete transaction');
    }
  });
};

export const useTransactionStats = (period = 'month') => {
  return useQuery(
    ['transaction-stats', period],
    () => transactionAPI.getStats({ period }),
    {
      select: (data) => data.data.data,
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to fetch statistics');
      }
    }
  );
};
