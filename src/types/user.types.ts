export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  password: string;
}

export type UserLoginData = {
  email: string;
  password: string;
};

export type NewEmployeeData = {
  email: string;
  name: string;
  password: string;
  sex: string;
  phoneNumber: string;
};
