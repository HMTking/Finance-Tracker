import { format, parseISO, isToday, isYesterday, isThisWeek, isThisMonth, isThisYear } from 'date-fns';

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return 'Today';
  } else if (isYesterday(dateObj)) {
    return 'Yesterday';
  } else if (isThisWeek(dateObj)) {
    return format(dateObj, 'EEEE'); // Day name
  } else if (isThisMonth(dateObj)) {
    return format(dateObj, 'MMM d'); // Month day
  } else if (isThisYear(dateObj)) {
    return format(dateObj, 'MMM d'); // Month day
  } else {
    return format(dateObj, 'MMM d, yyyy'); // Full date
  }
};

export const formatDateTime = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy h:mm a');
};

export const getDateRange = (period) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (period) {
    case 'today':
      return {
        start: startOfDay,
        end: now
      };
    case 'week':
      const startOfWeek = new Date(startOfDay);
      startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
      return {
        start: startOfWeek,
        end: now
      };
    case 'month':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: now
      };
    case 'year':
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: now
      };
    default:
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: now
      };
  }
};

export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

export const groupTransactionsByDate = (transactions) => {
  const grouped = {};
  
  transactions.forEach(transaction => {
    const date = format(parseISO(transaction.date), 'yyyy-MM-dd');
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
  });
  
  return grouped;
};

export const validateEmail = (email) => {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const getTransactionTypeColor = (type) => {
  return type === 'income' ? '#10b981' : '#ef4444';
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};
