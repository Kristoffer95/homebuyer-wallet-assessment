export const useLoanOfficers = () => {
  const data = useData();

  return data.value.loan_officers;
};
