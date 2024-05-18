import { NextResponse } from "next/server";
import Exception from "./http-exceptions";

export default class ServerResponse {
  static success(message: string): any;
  static success(message: string, code: number): any;
  static success(message: string, data: any): any;
  static success(message: string, data: any, code: number): any;
  static success(...args: any[]) {
    let code: number = 200;
    let data: any = undefined;
    let message: string = "";

    switch (args.length) {
      case 1:
        message = args[0];
        code = 200;
        break;

      case 2:
        message = args[0];
        if (typeof args[1] === "number") {
          code = args[1];
        } else {
          data = args[1];
        }
        break;

      default:
        message = args[0];
        data = args[1];
        code = args[2];
    }

    return NextResponse.json(
      {
        success: true,
        code,
        message,
        data,
      },
      {
        status: code,
      }
    );
  }

  static error(error: Exception): any;
  static error(error: Error): any;
  static error(message: string, code: number): any;
  static error(...args: any[]): any {
    let errorObject: Exception;

    switch (args.length) {
      case 1: {
        if (args[0] instanceof Exception) {
          errorObject = args[0];
        } else {
          let err: Error = args[0];
          errorObject = new Exception(err.message);
        }
        break;
      }

      default: {
        errorObject = new Exception(args[0], args[1]);
      }
    }

    return NextResponse.json(
      {
        success: false,
        ...errorObject.toObject(),
      },
      { status: errorObject.getCode() }
    );
  }
}
