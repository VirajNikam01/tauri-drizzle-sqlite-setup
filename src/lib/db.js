import { drizzle } from "drizzle-orm/sqlite-proxy";
import Database from "@tauri-apps/plugin-sql";
import { path } from "@tauri-apps/api";
export * as schema from "./schema";

export const db = drizzle(async (sql, params, method) => {
  const dbPath = await path.resolveResource("test.db");
  const conn = await Database.load(`sqlite:${dbPath}`);
  if (method === "run") {
    await conn.execute(sql, params);
    return { rows: [] };
  } else {
    const result = await conn.select(sql, params);
    return { rows: result };
  }
});

// Helper to execute raw Drizzle queries
export async function rawQuery(query) {
  const dbPath = await path.resolveResource("test.db");
  const conn = await Database.load(`sqlite:${dbPath}`);
  const sqlQuery = query.toSQL();
  const result = await conn.select(sqlQuery.sql, sqlQuery.params);
  return result;
}
