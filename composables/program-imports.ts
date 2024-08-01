import { computed } from 'vue';
import type {
  ProgramImportExpanded,
  User,
  Program,
  LoanOfficer,
} from '~/types/interfaces';

export const useProgramImports = (): ComputedRef<ProgramImportExpanded[]> => {
  const data = useData();
  const users = useUsers();
  const programs = usePrograms();
  const loanOfficers = useLoanOfficers();

  const programImports = computed(() => data.value.program_imports);

  // Helper methods
  const getUser = (id: string): User | undefined =>
    users.find((user: User) => user.id === id);
  const getProgram = (id: number): Program | undefined =>
    programs.find((program: Program) => program.id === id);
  const getLoanOfficer = (id: string): LoanOfficer | undefined =>
    loanOfficers.find((officer: LoanOfficer) => officer.id === id);

  // Transform program imports
  const updatedProgramImports = computed(() =>
    programImports.value.map((programImport: any) => {
      const user = getUser(programImport.user_id);
      const program = getProgram(programImport.program_id);
      const loan_officer = getLoanOfficer(programImport.loan_officer_id);

      if (!user || !program || !loan_officer) {
        throw new Error(`Invalid data: ${JSON.stringify(programImport)}`);
      }

      // Creating a new object to avoid TypeScript errors
      const newProgramImport: ProgramImportExpanded = {
        id: programImport.id,
        description: programImport.description,
        details: programImport.details,
        amount: programImport.amount,
        source: programImport.source,
        status: programImport.status,
        sold_at: programImport.sold_at,
        created_at: programImport.created_at,
        user,
        program,
        loan_officer,
      };

      return newProgramImport;
    })
  );

  return updatedProgramImports;
};
