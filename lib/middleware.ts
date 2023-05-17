import {
  Context,
  Middleware,
  Next,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";

export const authMiddleware: Middleware = async (ctx: Context, next: Next) => {
  if (!Deno.env.get("AUTH")) {
    await next();
    return;
  }

  const auth = ctx.request.headers.get("Authorization");
  if (!auth || auth !== Deno.env.get("AUTH")) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Unauthorized" };
    return;
  }

  await next();
};
