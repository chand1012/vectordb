import {
  Application,
  Context,
  Router,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import logger from "https://deno.land/x/oak_logger@1.0.0/mod.ts";

import VectorDB from "./lib/vector.ts";
import { authMiddleware } from "./lib/middleware.ts";

const app = new Application();
const router = new Router();
const vec = new VectorDB(
  Deno.env.get("VECTORDB_LOCATION") || "data/vector.db",
  false,
);

router.get("/", (ctx: Context) => {
  ctx.response.headers.set("Content-Type", "application/json");
  ctx.response.body = { message: "Welcome to the home page!" };
});

router.post("/add", async (ctx: Context) => {
  const body = ctx.request.body();
  const b = await body.value;

  const id = await vec.add(b.text, b?.source || "unknown", b?.url || "unknown");

  ctx.response.headers.set("Content-Type", "application/json");
  ctx.response.body = { id };
});

router.get("/get", async (ctx: Context) => {
  ctx.response.headers.set("Content-Type", "application/json");

  const id = ctx.request.url.searchParams.get("id");
  if (!id) {
    ctx.response.body = { message: "Missing id!" };
    ctx.response.status = 400;
    return;
  }

  const content = await vec.get(parseInt(id));
  if (!content) {
    ctx.response.body = { message: "Not found!" };
    ctx.response.status = 404;
    return;
  }

  ctx.response.body = content;
});

// search by param. Text only.
router.get("/search", async (ctx: Context) => {
  ctx.response.headers.set("Content-Type", "application/json");

  const q = ctx.request.url.searchParams.get("q");
  if (!q) {
    ctx.response.body = { message: "Missing query!" };
    ctx.response.status = 400;
    return;
  }
  // convert the url encoded string to a normal string
  const query = decodeURIComponent(q);

  const results = await vec.searchText(query);
  ctx.response.body = results;
});

// search by posting an embedding
router.post("/search", async (ctx: Context) => {
  const body = ctx.request.body();
  const b = await body.value;

  const results = await vec.search(b.embedding);
  ctx.response.body = results;
});

app.use(authMiddleware);
app.use(logger.logger);
app.use(logger.responseTime);
app.use(router.routes());
app.use(router.allowedMethods());
app.use(oakCors());

console.log("👂 Listening on http://localhost:8000");
await app.listen({
  port: parseInt(Deno.env.get("VECTORDB_PORT") || "8000"),
  hostname: Deno.env.get("VECTORDB_HOST") || "127.0.0.1",
});
