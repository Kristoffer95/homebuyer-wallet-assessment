import type { User, UserType } from '~/types/interfaces';

const transformUserType = (type: string): UserType => {
  if (type === 'buyer' || type === 'seller') {
    return type;
  }
  throw new Error(`Invalid user type: ${type}`);
};

export const useUsers = (): User[] => {
  const data = useData();

  return data.value.users.map((user: any) => ({
    ...user,
    type: transformUserType(user.type),
  }));
};
