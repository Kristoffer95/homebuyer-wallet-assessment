export const usePrograms = () => {
  const data = useData();

  return data.value.programs;
};
