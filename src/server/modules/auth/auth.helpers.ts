import {
  AuthenticationException,
  AuthorizationException,
} from "@/server/utils/http-exceptions";
import { TokenUtil } from "@/server/utils/token";
import { UserRole } from "@/types/user.types";
import { NextRequest } from "next/server";
import { UserDocument } from "../user/user.types";

export default class AuthHelpers {
  /**
   * checks if user has a specific role for the request
   * @param user user data
   * @param role required role
   */
  static hasRole(user: UserDocument, role: UserRole) {
    if (user.role === role) {
      return true;
    }
    return false;
  }

  /**
   * extracts auth token from request
   * @param {NextRequest} req Next Request Object
   */
  static extractAuthToken(req: NextRequest) {
    let authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return null;
    }

    let token = authHeader.split(" ")[1];
    return token || null;
  }

  /** gets user payload from token
   * @throws {Exception}
   */
  static authenticateUser(req: NextRequest, role?: UserRole[]) {
    const authToken = AuthHelpers.extractAuthToken(req);

    if (!authToken) {
      throw new AuthenticationException("auth token not found");
    }

    const tokenUtil = new TokenUtil();
    const authPayload: any = tokenUtil.verifyJwtToken(authToken);

    if (role) {
      if (!role.includes(authPayload.role)) {
        throw new AuthorizationException();
      }
    }

    return authPayload;
  }
}
