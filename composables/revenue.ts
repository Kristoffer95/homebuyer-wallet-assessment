export const useRevenue = () => {
  const data = useData();

  return data.value.revenue;
};
