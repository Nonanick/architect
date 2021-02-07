import type { IArchive } from "clerk";
import { SQLite } from 'clerk-sqlite';
import path from 'path';
import { createFolder } from '../../modules/project/Project';

const ArchitectSQLiteDbFolder = path.resolve(
  __dirname,
  '..',
  'database'
);

const ArchitectSQLiteDbFilename = "Architect.sqlite";

createFolder(ArchitectSQLiteDbFolder);

export const SQLiteArchive: IArchive = new SQLite(
  path.resolve(ArchitectSQLiteDbFolder, ArchitectSQLiteDbFilename)
);