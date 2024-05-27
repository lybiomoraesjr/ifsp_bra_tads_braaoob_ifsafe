export const formattedDate = (date: any): string => {
  const dateObj = (date instanceof Date) ? date : new Date(date);
  return dateObj.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
};