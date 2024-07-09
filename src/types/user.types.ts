export const USER_ROLES = {
  INDUSTRY: "industry",
  FARMER: "farmer",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export type User = {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export type UserLoginData = {
  email: string;
  password: string;
};

export type NewUserData = {
  email: string;
  name: string;
  password: string;
};
