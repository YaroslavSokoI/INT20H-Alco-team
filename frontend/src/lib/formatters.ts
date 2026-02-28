/**
 * Format a number as currency (USD)
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

/**
 * Format a number as a percentage
 */
export const formatPercent = (rate: number): string => {
    const fixed = parseFloat(rate.toFixed(4));
    return `${fixed}%`;
};

/**
 * Format a date as DD.MM.YYYY
 */
export const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).replace(/\//g, '.');
};
