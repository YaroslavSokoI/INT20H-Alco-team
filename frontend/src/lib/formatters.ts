/**
 * Форматування числа як валюти (USD)
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

/**
 * Форматування відсотків
 */
export const formatPercent = (rate: number): string => {
    return `${rate.toFixed(2)}%`;
};

/**
 * Форматування дати у формат DD.MM.YYYY
 */
export const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).replace(/\//g, '.');
};
