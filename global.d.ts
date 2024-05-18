import mongoose from "mongoose";

declare global {
  namespace NodeJS {
    interface Global {
      dbConnection: mongoose.Connection | null;
    }
  }
}
