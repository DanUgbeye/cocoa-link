import type _mongoose from "mongoose";
import type { Model } from "mongoose";
import { UserDocument } from "./user.types";
import {
  BadRequestException,
  NotFoundException,
  ServerException,
} from "@/server/http-exceptions";
import { PasswordUtil } from "@/server/utils/password";
import {
  USER_ROLES,
  User,
  UserLoginData,
  UserRole,
} from "@/types/user.types";

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
  async login(
    credentials: UserLoginData,
    role: UserRole = USER_ROLES.USER
  ) {
    const { email, password } = credentials;

    let user: UserDocument | null;
    try {
      user = await this.collection.findOne({ email, role });
    } catch (error) {
      throw new ServerException();
    }

    if (
      !user ||
      !(await PasswordUtil.comparePassword(password, user.password))
    ) {
      throw new BadRequestException("incorrect credentials");
    }

    return user;
  }

  /**
   * registers a new employee
   * @param employeeData employee data
   */
  async registerEmployee(employeeData: User) {
    let employee: UserDocument;

    try {
      employeeData.password = await PasswordUtil.hashPassword(
        employeeData.password
      );
      employeeData.role = USER_ROLES.USER;

      employee = await this.collection.create(employeeData);
    } catch (error: any) {
      throw new ServerException(error.message);
    }

    return employee;
  }

  /** gets all employees */
  async getAllEmployees() {
    let users: UserDocument[];

    try {
      users = await this.collection
        .find({ role: USER_ROLES.USER })
        .sort({ createdAt: -1 });
    } catch (error: any) {
      throw new ServerException(error.message);
    }

    return users;
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
