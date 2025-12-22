import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(turso);

const roTurso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_RO_AUTH_TOKEN!, //Important! Read-Only token to block Destructive ops at DB engine level. 
});

/*
Read-Only DB connection will block any Destructive ops at DB engine level. Highest safety.
*/
export const roDB = drizzle(roTurso);
