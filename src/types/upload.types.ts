export type Upload = {
  _id: string;
  userId: string;

  name: string;
  size: number;
  type: string;
  key: string;
  url: string;
  appUrl: string;

  createdAt: Date;
  updatedAt: Date;
};
