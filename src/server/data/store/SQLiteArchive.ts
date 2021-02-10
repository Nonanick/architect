import type { IArchive } from "clerk";
import { SQLite } from 'clerk-sqlite';
import path from 'path';
import { FileSystem } from '../../services/file-system/file-system.service';

const ArchitectSQLiteDbFolder = path.resolve(
  __dirname,
  '..',
  'database'
);

const ArchitectSQLiteDbFilename = "Architect.sqlite";

FileSystem.createFolder(ArchitectSQLiteDbFolder);

export let SQLiteArchive: IArchive = new SQLite(
  path.resolve(ArchitectSQLiteDbFolder, ArchitectSQLiteDbFilename)
);
