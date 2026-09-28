export const formatChartDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
    });
  };