import type { IArchive } from "clerk";
import { Archive as PgArchive } from 'clerk-pgsql';

export const SQLiteArchive: IArchive = new PgArchive({
  host: 'localhost',
  port: 5432,
  user: 'Architect',
  password: 'architect',
  database: 'architect'
});