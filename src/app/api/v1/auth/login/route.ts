import connectDB from "@/server/db/connect";
import { ServerException } from "@/server/utils/http-exceptions";
import UserRepository from "@/server/modules/user/user.repository";
import ServerResponse from "@/server/utils/response";
import { TokenUtil } from "@/server/utils/token";
import { USER_ROLES, UserLoginData } from "@/types/user.types";

/**
 * logs in an employee
 * @route GET - .../v1/auth/employee-login
 */
async function EmployeeLogin(req: Request) {
  let body = (await req.json()) as UserLoginData;

  try {
    const conn = await connectDB();
    if (!conn) {
      return ServerResponse.error(new ServerException());
    }

    const userRepo = new UserRepository(conn);
    const data = await userRepo.login(body, USER_ROLES.USER);

    const { password, ...user } = data.toObject();
    const tokenUtil = new TokenUtil();
    let auth = tokenUtil.createJwtToken({ _id: data._id, role: data.role });

    const response = { user, auth };

    return ServerResponse.success("Login Successful", response, 200);
  } catch (err: any) {
    return ServerResponse.error(err);
  }
}

export { EmployeeLogin as POST };
