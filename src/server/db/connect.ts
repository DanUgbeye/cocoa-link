import * as dotenv from "dotenv";
dotenv.config();
import { SERVER_CONFIG } from "./../config/server.config";
import type _mongoose from "mongoose";
import { Model, connect } from "mongoose";
import { UserDocument } from "../modules/user/user.types";
import registerModels from "./register-models";

declare global {
  // eslint-disable-next-line
  var mongoose: {
    promise: ReturnType<typeof connectDB> | null;
    conn: typeof _mongoose | null;
  };

  var registeredModels: boolean;
}

const { MONGO_DB_URL } = SERVER_CONFIG;

if (!MONGO_DB_URL) {
  throw new Error(
    "Please define the MONGO_DB_URL environment variable inside .env.local"
  );
}

let registered = global.registeredModels;
if (registered === undefined) {
  global.registeredModels = false;
  registered = false;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  global.mongoose = { conn: null, promise: null };
  cached = { conn: null, promise: null };
}

async function connectDB(): Promise<typeof _mongoose | null> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = connect(MONGO_DB_URL!, opts).then((mongoose) => {
      return mongoose;
    });

    if (!registered) {
      registerModels();
      registered = true;
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn!;
}

export default connectDB;
