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

export interface ClientUser {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
}

export type UserLoginData = {
  email: string;
  password: string;
};

export type NewUserData = {
  email: string;
  name: string;
  password: string;
};
