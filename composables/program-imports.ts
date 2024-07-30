export const useProgramImports = () => {
  const data = useData();

  return data.value.program_imports;
};
