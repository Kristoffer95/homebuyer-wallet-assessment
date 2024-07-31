export type UserType = 'buyer' | 'seller';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  created_at: string;
}

// Program interface
export interface Program {
  id: number;
  name: string;
  type: string;
  created_at: string;
}

// LoanOfficer interface
export interface LoanOfficer {
  id: string;
  name: string;
  email: string;
  position: string;
  created_at: string;
}

// ProgramImport interface
export interface ProgramImport {
  id: number;
  program_id: number;
  user_id: string;
  loan_officer_id: string;
  status: 'sold' | 'available';
  description: string;
  details: string;
  amount: number;
  source: string;
  created_at: string;
}

// Revenue interface
export interface Revenue {
  id: number;
  program_import_id: number;
  created_at: string;
}

// Expanded ProgramImport
export interface ProgramImportExpanded {
  id: number;
  description: string;
  details: string;
  amount: number;
  status: 'sold' | 'available';
  source: string;
  created_at: string;
  user: User;
  program: Program;
  loan_officer: LoanOfficer;
}
