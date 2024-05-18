import * as dotenv from "dotenv";
dotenv.config();

import type _mongoose from "mongoose";
import { connect } from "mongoose";
import { SERVER_CONFIG } from "./../config/server.config";
import registerModels from "./register-models";
import { setupDB } from "./setup";

declare global {
  // eslint-disable-next-line
  var mongoose: {
    promise: ReturnType<typeof connectDB> | undefined;
    conn: typeof _mongoose | undefined;
  };

  var registeredModels: boolean;
}

const { MONGO_DB_URL } = SERVER_CONFIG;

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
  global.mongoose = { conn: undefined, promise: undefined };
  cached = { conn: undefined, promise: undefined };
}

async function connectDB(): Promise<typeof _mongoose> {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      cached.promise = connect(MONGO_DB_URL!, opts);

      cached.conn = await cached.promise;
      if (!registered) {
        registerModels();
        await setupDB(cached.conn);
        registered = true;
      }
    }
    
    return cached.conn!;
  } catch (e) {
    cached.promise = undefined;
    throw e;
  }
}

export default connectDB;
