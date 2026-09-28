export interface ChartPoint {
    x: number;
    y: number;
  }
  
  export const createLineChartPath = (
    values: number[],
    width: number,
    height: number,
    padding = 8
  ): string => {
    if (values.length === 0) {
      return "";
    }
  
    if (values.length === 1) {
      const y = height / 2;
  
      return `M ${padding},${y} L ${width - padding},${y}`;
    }
  
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
  
    const range = maxValue - minValue || 1;
  
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
  
    return values
      .map((value, index) => {
        const x =
          padding +
          (index / (values.length - 1)) * chartWidth;
  
        const normalized =
          (value - minValue) / range;
  
        const y =
          height -
          padding -
          normalized * chartHeight;
  
        return `${index === 0 ? "M" : "L"} ${x},${y}`;
      })
      .join(" ");
  };