export type CreateUserDTO = {
  email: string;
  password: string;
  isAdmin?: boolean;
};

export type CreatedUserDTO = {
  id: string;
  createdAt: Date;
} & CreateUserDTO;
