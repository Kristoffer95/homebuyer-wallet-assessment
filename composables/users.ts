export const useUsers = () => {
  const data = useData();

  return data.value.users;
};
