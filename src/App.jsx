import React, { useEffect, useState } from "react";
import { db, schema, rawQuery } from "./lib/db";
import { eq } from "drizzle-orm";

const App = () => {
  const [data, setData] = useState("");
  const [error, setError] = useState(null);

  async function demo() {
    try {
      const existingUser = await rawQuery(
        db
          .select()
          .from(schema.users)
          .where(eq(schema.users.name, "Alice"))
          .limit(1)
      );

      if (existingUser.length === 0) {
        await db.insert(schema.users).values({ name: "Alice" });
      }

      const result = await rawQuery(db.select().from(schema.users));
      setData(result);
    } catch (err) {
      console.error("Database error:", err);
      setError(err.message);
    }
  }

  useEffect(() => {
    demo();
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
      {error ? <p>Error: {error}</p> : <p>{JSON.stringify(data)}</p>}
    </div>
  );
};

export default App;
