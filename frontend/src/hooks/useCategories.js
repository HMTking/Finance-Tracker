import { useQuery, useMutation, useQueryClient } from 'react-query';
import { categoryAPI } from '../utils/api';
import toast from 'react-hot-toast';

export const useCategories = (type = null) => {
  return useQuery(
    ['categories', type],
    () => categoryAPI.getCategories(type ? { type } : {}),
    {
      select: (data) => data.data.data,
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to fetch categories');
      }
    }
  );
};

export const useCategory = (id) => {
  return useQuery(
    ['category', id],
    () => categoryAPI.getCategory(id),
    {
      select: (data) => data.data.data,
      enabled: !!id,
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to fetch category');
      }
    }
  );
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation(categoryAPI.createCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create category');
    }
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, data }) => categoryAPI.updateCategory(id, data),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['categories']);
        queryClient.invalidateQueries(['category', variables.id]);
        toast.success('Category updated successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update category');
      }
    }
  );
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation(categoryAPI.deleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  });
};

export const useCreateDefaultCategories = () => {
  const queryClient = useQueryClient();
  
  return useMutation(categoryAPI.createDefaults, {
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Default categories created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create default categories');
    }
  });
};
