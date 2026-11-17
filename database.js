import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.dirname(fileURLToPath(import.meta.url));
const pastaDados = path.join(raiz, 'data');
fs.mkdirSync(pastaDados, { recursive: true });

// node:sqlite vem embutido no Node.js (22.5+), sem compilação nem Visual Studio.
export const db = new DatabaseSync(path.join(pastaDados, 'neurocore.db'));
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
db.exec(fs.readFileSync(path.join(raiz, 'BD', 'schema.sql'), 'utf8'));
