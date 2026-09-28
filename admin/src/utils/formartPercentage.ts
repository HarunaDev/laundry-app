export const formatPercentage = (value: number): string => {
    const prefix = value > 0 ? "↑" : value < 0 ? "↓" : "—";
  
    return `${prefix} ${Math.abs(value).toFixed(1)}%`;
  };