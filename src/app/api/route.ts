import ServerResponse from "@/server/utils/response";

export async function GET(req: Request) {
  return ServerResponse.success("API up and running⚡", 200);
}
