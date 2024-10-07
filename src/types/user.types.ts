export enum UserRole {
  Industry = "Industry",
  Farmer = "Farmer",
}

export type User = {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  walletBalance: number;
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
