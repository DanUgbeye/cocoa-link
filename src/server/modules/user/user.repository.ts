import {
  BadRequestException,
  NotFoundException,
  ServerException,
} from "@/server/utils/http-exceptions";
import { passwordUtil } from "@/server/utils/password";
import { USER_ROLES, User, UserLoginData, UserRole } from "@/types/user.types";
import type _mongoose from "mongoose";
import type { Model } from "mongoose";
import { UserDocument } from "./user.types";

export default class UserRepository {
  public collection: Model<UserDocument>;

  constructor(conn: typeof _mongoose) {
    this.collection = conn.models.User as Model<UserDocument>;
  }

  /**
   * logs in a user
   * @param credentials user credentials
   * @param role the user role to login
   */
  async login(credentials: UserLoginData, role: UserRole = USER_ROLES.USER) {
    const { email, password } = credentials;

    let user: UserDocument | null;
    try {
      user = await this.collection.findOne({ email, role });
    } catch (error: any) {
      throw new ServerException(error.message);
    }

    if (
      !user ||
      !(await passwordUtil.comparePassword(password, user.password))
    ) {
      throw new BadRequestException("incorrect credentials");
    }

    return user;
  }

  /**
   * registers a new user
   * @param data user data
   */
  async signup(data: Omit<User, "_id" | "role">) {
    let newUser: any = { ...data };
    let user: UserDocument;

    try {
      newUser.password = await passwordUtil.hashPassword(newUser.password);
      newUser.role = USER_ROLES.USER;

      user = await this.collection.create(data);
    } catch (error: any) {
      throw new ServerException(error.message);
    }

    return user;
  }

  /**
   * gets a user profile
   * @param id user id to fetch
   */
  async getProfile(id: string) {
    let user: UserDocument | null = null;

    try {
      user = await this.collection.findById(id);
    } catch (err: any) {
      throw new ServerException(err.message);
    }

    if (!user) {
      throw new NotFoundException("user profile not found");
    }

    return user;
  }

  /**
   * deletes a user
   * @param id user id to delete
   */
  async deleteUser(id: string) {
    let user: UserDocument | null = null;

    try {
      user = await this.collection.findByIdAndDelete(id);
    } catch (err: any) {
      throw new ServerException(err.message);
    }

    if (!user) {
      throw new NotFoundException("user not found");
    }

    return user;
  }
}
