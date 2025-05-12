import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
// import { neon } from "@neondatabase/serverless";

import { env } from "~/env";
// import * as schema from "./schema";


const conn = postgres(env.DATABASE_URL);

export const db = drizzle(conn);

// const globalForDb = globalThis as unknown as {
//   conn: ReturnType<typeof neon> | undefined;
// };

/*
// const conn = globalForDb.conn ?? neon(env.DATABASE_URL);
// if (env.NODE_ENV !== "production") globalForDb.conn = conn;
*/

