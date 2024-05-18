import { SERVER_CONFIG } from "@/server/config/server.config";
import { AuthenticationException } from "@/server/utils/http-exceptions";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

const secret = SERVER_CONFIG.TOKEN_SECRET;

const _1_DAY = 24 * 60 * 60; // 3 days

export class TokenUtil {
  /**
   * creates a jwt token
   * @param data the data to create a token with
   * @param expiresIn the jwt token expiry time in seconds
   */
  createJwtToken<P extends Object>(data: P, expiresIn: number = _1_DAY) {
    return {
      token: jwt.sign(data, secret, { expiresIn }),
      expiresIn: Date.now() + expiresIn * 1000,
    };
  }

  /**
   * verifies and decodes a jwt token
   * @param token
   */
  verifyJwtToken<P = unknown>(token: string) {
    let response: P;
    try {
      response = jwt.verify(token, secret) as P;
    } catch (error: any) {
      let err = error as JsonWebTokenError;
      throw new AuthenticationException(err.message.replaceAll("jwt", "token"));
    }

    return response;
  }
}
