// src/index.ts
import { Hono } from "hono";
import { logger } from "hono/logger";
import { setSignedCookie, deleteCookie } from "hono/cookie";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDb, todos, user } from "@repo/db";
import { eq } from "drizzle-orm";
var db = getDb();
var JWT_SECRET = process.env.JWT_SECRET;
var COOKIE_SECRET = process.env.COOKIE_SECRET;
var app = new Hono().basePath("/api");
app.use("*", logger());
app.post("/signup", async (c) => {
  const { email, password } = await c.req.json();
  if (!email || !password) {
    return c.json({ message: "Missing fields" }, 400);
  }
  const exists = await db.select().from(user).where(eq(user.email, email));
  if (exists.length) {
    return c.json({ message: "User exists" }, 400);
  }
  const hashed = await bcrypt.hash(password, 10);
  await db.insert(user).values({
    email,
    password: hashed
  });
  return c.json({ message: "Signup success" });
});
app.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  const result = await db.select().from(user).where(eq(user.email, email));
  if (!result.length) {
    return c.text("Invalid credentials", 401);
  }
  const l = result[0];
  const valid = await bcrypt.compare(password, l.password);
  if (!valid) {
    return c.text("Invalid credentials", 401);
  }
  const token = jwt.sign(
    { id: l.id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  await setSignedCookie(c, "auth_token", token, process.env.COOKIE_SECRET, {
    httpOnly: true,
    secure: false,
    // true in production
    sameSite: "Strict",
    path: "/"
  });
  return c.redirect("/");
});
app.post("/logout", (c) => {
  deleteCookie(c, "auth_token", { path: "/" });
  return c.json({ message: "Logged out" });
});
app.get("/", async (c) => {
  try {
    const db2 = getDb();
    const data = await db2.select().from(todos);
    return c.json(data);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return c.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal server error"
      },
      500
    );
  }
});
app.post("/", async (c) => {
  try {
    const db2 = getDb();
    const body = await c.req.json();
    const [todo] = await db2.insert(todos).values({
      text: body.text,
      description: body.description,
      status: body.status,
      startAt: new Date(body.startAt),
      endAt: new Date(body.endAt)
    }).returning();
    return c.json(
      {
        success: true,
        data: todo
      },
      201
    );
  } catch (error) {
    console.error("Error creating todo:", error);
    return c.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal server error"
      },
      500
    );
  }
});
app.put("/:id", async (c) => {
  try {
    const db2 = getDb();
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const [todo] = await db2.update(todos).set({
      text: body.text,
      description: body.description,
      status: body.status,
      startAt: new Date(body.startAt),
      endAt: new Date(body.endAt)
    }).where(eq(todos.id, id)).returning();
    if (!todo) {
      return c.json(
        {
          success: false,
          message: "Todo not found"
        },
        404
      );
    }
    return c.json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    return c.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal server error"
      },
      500
    );
  }
});
app.patch("/:id", async (c) => {
  try {
    const db2 = getDb();
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const updateData = {};
    if (body.text !== void 0)
      updateData.text = body.text;
    if (body.description !== void 0)
      updateData.description = body.description;
    if (body.status !== void 0)
      updateData.status = body.status;
    if (body.startAt !== void 0)
      updateData.startAt = new Date(body.startAt);
    if (body.endAt !== void 0)
      updateData.endAt = new Date(body.endAt);
    const [todo] = await db2.update(todos).set(updateData).where(eq(todos.id, id)).returning();
    if (!todo) {
      return c.json(
        {
          success: false,
          message: "Todo not found"
        },
        404
      );
    }
    return c.json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    return c.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal server error"
      },
      500
    );
  }
});
app.delete("/:id", async (c) => {
  try {
    const db2 = getDb();
    const id = Number(c.req.param("id"));
    const result = await db2.delete(todos).where(eq(todos.id, id));
    if (result.rowCount === 0) {
      return c.json(
        {
          success: false,
          message: "Todo not found"
        },
        404
      );
    }
    return c.json({
      success: true,
      message: "Todo deleted"
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return c.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal server error"
      },
      500
    );
  }
});
export {
  app
};
