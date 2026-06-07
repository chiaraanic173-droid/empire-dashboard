import { neon } from '@neondatabase/serverless';

let sql: ReturnType<typeof neon> | null = null;

function getDb() {
  if (!sql) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set');
    sql = neon(process.env.DATABASE_URL);
  }
  return sql;
}

export async function initDb() {
  const db = getDb();
  await db`
    CREATE TABLE IF NOT EXISTS user_data (
      user_id TEXT PRIMARY KEY,
      data JSONB NOT NULL DEFAULT '{}',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export async function loadUserData(userId: string): Promise<Record<string, unknown>> {
  const db = getDb();
  await initDb();
  const rows = await db`SELECT data FROM user_data WHERE user_id = ${userId}` as { data: Record<string, unknown> }[];
  return rows[0]?.data ?? {};
}

export async function saveUserData(userId: string, data: Record<string, unknown>): Promise<void> {
  const db = getDb();
  await initDb();
  await db`
    INSERT INTO user_data (user_id, data, updated_at)
    VALUES (${userId}, ${JSON.stringify(data)}, NOW())
    ON CONFLICT (user_id) DO UPDATE
    SET data = ${JSON.stringify(data)}, updated_at = NOW()
  `;
}
