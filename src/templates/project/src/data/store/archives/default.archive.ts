import { SQLite } from 'clerk-sqlite';
import path from 'path';

const DatabaseDefaultLocation : string = path.resolve(
  __dirname, '..','..','..','database','data.sqlite'
);

export default new SQLite(DatabaseDefaultLocation)