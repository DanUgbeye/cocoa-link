import { NextRequest } from "next/server";
import AuthHelpers from "./auth.helpers";
import ServerResponse from "@/server/utils/response";
import { AuthenticationException } from "@/server/utils/http-exceptions";

export default class AuthMiddleware {
  /**
   * extracts jwt auth token and sets user info from DB
   * @param {NextRequest} req Next Request Object
   */
  static async authenticateUser(req: NextRequest) {
    // extract jwt token
    const token = AuthHelpers.extractAuthToken(req);
    if (!token) {
      return;
    }
    // fetch user details from DB plus permissions
    const user = { name: "Daniel", age: 24 };
    // set user cookie
    // AuthHelpers.setUser(req, user);
  }
}
