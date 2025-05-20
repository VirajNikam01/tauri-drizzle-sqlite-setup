import { drizzle } from "drizzle-orm/sqlite-proxy";
import Database from "@tauri-apps/plugin-sql";
import { path } from "@tauri-apps/api";
import * as schema from "./schema";

export const db = drizzle(
  async (sql, params, method) => {
    const dbPath = await path.resolveResource("test.db");
    const sqlite = await Database.load(`sqlite:${dbPath}`);
    let rows = [];
    let results = [];

    // If the query is a SELECT, use the select method
    if (isSelectQuery(sql)) {
      rows = await sqlite.select(sql, params).catch((e) => {
        console.error("SQL Error:", e);
        return [];
      });
    } else {
      // Otherwise, use the execute method
      rows = await sqlite.execute(sql, params).catch((e) => {
        console.error("SQL Error:", e);
        return [];
      });
      return { rows: [] };
    }

    rows = rows.map((row) => {
      return Object.values(row);
    });

    // If the method is "all", return all rows
    results = method === "all" ? rows : rows[0];

    return { rows: results };
  },
  // Pass the schema to the drizzle instance
  { schema: schema, logger: true }
);

// Helper to execute raw Drizzle queries
function isSelectQuery(sql) {
  const selectRegex = /^\s*SELECT\b/i;
  return selectRegex.test(sql);
}

export { schema };
