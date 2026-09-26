/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import pg from 'pg';

const { Pool } = pg;

// Connection options from environment variables
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'oracle_db';
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = parseInt(process.env.DB_PORT || '5432', 10);

// Google Cloud SQL instance connection name
// project-4ce47da6-adfb-438e-b77 in us-east1
const cloudSqlConnectionName = process.env.CLOUD_SQL_CONNECTION_NAME || 'project-4ce47da6-adfb-438e-b77:us-east1:oracle-db';

const hasValidCloudSql = !!(
  cloudSqlConnectionName &&
  cloudSqlConnectionName.includes(':') &&
  cloudSqlConnectionName !== '100' &&
  !cloudSqlConnectionName.includes('placeholder') &&
  !cloudSqlConnectionName.includes('MY_')
);

let pool: pg.Pool | null = null;
let isDbConnected = false;
let isDbChecking = true;
let dbConnectionError: string | null = null;

/**
 * Returns the current state of the database connection.
 */
export function isDatabaseConnected(): { connected: boolean; checking: boolean; error?: string | null } {
  return { connected: isDbConnected, checking: isDbChecking, error: dbConnectionError };
}

// Robust virtual fallback ledger
const inMemoryConsultations: any[] = [];
const inMemoryNexusOperations = new Map<string, any>();

/**
 * Initializes and returns the PostgreSQL Connection Pool for Google Cloud SQL.
 * Supports standard TCP connections (local development) and Unix domain sockets
 * (Cloud Run production environment).
 */
export function getDatabasePool(): pg.Pool {
  if (!pool) {
    // Cloud Run automatically mounts Cloud SQL Unix Sockets at /cloudsql/CONNECTION_NAME
    const isProduction = process.env.NODE_ENV === 'production' || process.env.USE_CLOUD_SQL_SOCKET === 'true';

    if (isProduction && hasValidCloudSql) {
      console.log(`[Cloud SQL] Initializing Unix Domain Socket connection pool for project-4ce47da6-adfb-438e-b77:`);
      console.log(`[Cloud SQL] Connection Name: ${cloudSqlConnectionName}`);
      pool = new Pool({
        user: dbUser,
        password: dbPassword,
        database: dbName,
        host: `/cloudsql/${cloudSqlConnectionName}`,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    } else {
      console.log(`[Cloud SQL] Initializing local PostgreSQL TCP pool on ${dbHost}:${dbPort}`);
      pool = new Pool({
        user: dbUser,
        password: dbPassword,
        host: dbHost,
        port: dbPort,
        database: dbName,
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    }

    pool.on('error', (err: Error) => {
      // Avoid excessive logging if we are already disconnected or running fallback
      if (isDbConnected) {
        console.warn('[Cloud SQL] Unexpected error on idle client:', err);
      }
    });
  }

  return pool;
}

/**
 * Ensures that the required tables for long-term consultation and Nexus records exist.
 * Gracefully switches to virtual ledger mode if connection is refused or unavailable.
 */
export async function initializeDatabaseSchema(): Promise<void> {
  if (!hasValidCloudSql) {
    isDbConnected = false;
    isDbChecking = false;
    dbConnectionError = "No valid Cloud SQL instance has been provisioned yet for this Applet. Running in offline fallback mode.";
    console.log('[Cloud SQL Offline Mode] No valid Cloud SQL instance configured. Running in virtual fallback mode.');
    return;
  }

  const dbPool = getDatabasePool();
  
  try {
    console.log('[Cloud SQL] Verifying database connectivity...');
    // Attempt a quick connection test with a short timeout
    const client = await dbPool.connect();
    
    isDbConnected = true;
    dbConnectionError = null;
    console.log('[Cloud SQL] Connection verified. Executing database schema initialization...');
    
    // Create consultation_records table
    await client.query(`
      CREATE TABLE IF NOT EXISTS consultation_records (
        id VARCHAR(64) PRIMARY KEY,
        question TEXT NOT NULL,
        school VARCHAR(100) NOT NULL,
        zodiac_sign VARCHAR(50),
        birth_date VARCHAR(50),
        answer TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        energy_spiritus INT,
        energy_ignis INT,
        energy_aqua INT,
        energy_aer INT,
        energy_materia INT
      );
    `);

    // Create nexus_operations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS nexus_operations (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        state VARCHAR(50) NOT NULL,
        progress INT DEFAULT 0,
        log_trace TEXT[] DEFAULT '{}',
        created_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_updated_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        payload_result JSONB,
        owner_id VARCHAR(64) NOT NULL DEFAULT 'default_user'
      );
    `);

    // Ensure owner_id column exists if table was previously created without it
    await client.query(`
      ALTER TABLE nexus_operations 
      ADD COLUMN IF NOT EXISTS owner_id VARCHAR(64) NOT NULL DEFAULT 'default_user';
    `);

    // Enable Row Level Security (RLS)
    await client.query(`
      ALTER TABLE nexus_operations ENABLE ROW LEVEL SECURITY;
    `);

    // Create RLS policies if they don't exist
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'nexus_operations' AND policyname = 'user_own_operations'
        ) THEN
          CREATE POLICY user_own_operations ON nexus_operations
          USING (owner_id = current_setting('app.current_user_id', true)::VARCHAR)
          WITH CHECK (owner_id = current_setting('app.current_user_id', true)::VARCHAR);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'nexus_operations' AND policyname = 'admin_full_access'
        ) THEN
          CREATE POLICY admin_full_access ON nexus_operations
          USING (current_user = 'admin' OR pg_has_role('admin', 'MEMBER'))
          WITH CHECK (true);
        END IF;
      END
      $$;
    `);

    // Create a trigger function for automatic update timestamps
    await client.query(`
      CREATE OR REPLACE FUNCTION update_nexus_operations_last_updated()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.last_updated_time = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Attach trigger to the nexus_operations table
    await client.query(`
      DROP TRIGGER IF EXISTS trg_nexus_operations_last_updated ON nexus_operations;
      CREATE TRIGGER trg_nexus_operations_last_updated
      BEFORE UPDATE ON nexus_operations
      FOR EACH ROW
      EXECUTE FUNCTION update_nexus_operations_last_updated();
    `);

    console.log('[Cloud SQL] Database schema, RLS policies, and update triggers initialized successfully.');
    client.release();
  } catch (error: any) {
    isDbConnected = false;
    dbConnectionError = error.message || 'Unknown PostgreSQL connection failure';
    console.warn(`[Cloud SQL Offline Mode] Could not connect to PostgreSQL database (${error.message}).`);
    console.log('[Cloud SQL Offline Mode] Gracefully falling back to robust in-memory/localStorage virtual ledger.');
  } finally {
    isDbChecking = false;
  }
}

/**
 * Saves a consultation record durably.
 */
export async function saveConsultationRecord(record: {
  id: string;
  question: string;
  school: string;
  zodiacSign?: string;
  birthDate?: string;
  answer: string;
  energies?: { spiritus: number; ignis: number; aqua: number; aer: number; materia: number };
}): Promise<boolean> {
  if (!isDbConnected) {
    // Save to in-memory fallback
    const index = inMemoryConsultations.findIndex(c => c.id === record.id);
    const newRecord = {
      id: record.id,
      question: record.question,
      school: record.school,
      zodiac_sign: record.zodiacSign || null,
      birth_date: record.birthDate || null,
      answer: record.answer,
      created_at: new Date().toISOString(),
      energy_spiritus: record.energies?.spiritus || 0,
      energy_ignis: record.energies?.ignis || 0,
      energy_aqua: record.energies?.aqua || 0,
      energy_aer: record.energies?.aer || 0,
      energy_materia: record.energies?.materia || 0,
    };
    if (index >= 0) {
      inMemoryConsultations[index] = newRecord;
    } else {
      inMemoryConsultations.unshift(newRecord);
    }
    console.log(`[Cloud SQL Offline] Saved consultation record ${record.id} to virtual ledger.`);
    return true;
  }

  try {
    const dbPool = getDatabasePool();
    const query = `
      INSERT INTO consultation_records (
        id, question, school, zodiac_sign, birth_date, answer, 
        energy_spiritus, energy_ignis, energy_aqua, energy_aer, energy_materia
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET
        question = EXCLUDED.question,
        school = EXCLUDED.school,
        zodiac_sign = EXCLUDED.zodiac_sign,
        birth_date = EXCLUDED.birth_date,
        answer = EXCLUDED.answer,
        energy_spiritus = EXCLUDED.energy_spiritus,
        energy_ignis = EXCLUDED.energy_ignis,
        energy_aqua = EXCLUDED.energy_aqua,
        energy_aer = EXCLUDED.energy_aer,
        energy_materia = EXCLUDED.energy_materia;
    `;
    const params = [
      record.id,
      record.question,
      record.school,
      record.zodiacSign || null,
      record.birthDate || null,
      record.answer,
      record.energies?.spiritus || 0,
      record.energies?.ignis || 0,
      record.energies?.aqua || 0,
      record.energies?.aer || 0,
      record.energies?.materia || 0,
    ];
    await dbPool.query(query, params);
    console.log(`[Cloud SQL] Saved consultation record ${record.id} successfully.`);
    return true;
  } catch (err) {
    console.warn('[Cloud SQL] Error saving consultation record:', err);
    return false;
  }
}

/**
 * Saves or updates a Nexus operation state durably.
 */
export async function saveOrUpdateNexusOperation(op: {
  id: string;
  name: string;
  state: string;
  progress: number;
  logTrace: string[];
  lastUpdatedTime: string;
  payloadResult?: any;
  ownerId?: string;
}): Promise<boolean> {
  if (!isDbConnected) {
    inMemoryNexusOperations.set(op.id, {
      ...op,
      created_time: new Date().toISOString(),
    });
    console.log(`[Cloud SQL Offline] Updated Nexus Operation ${op.id} state to ${op.state} inside virtual ledger.`);
    return true;
  }

  try {
    const dbPool = getDatabasePool();
    const owner = op.ownerId || 'default_user';
    const query = `
      INSERT INTO nexus_operations (
        id, name, state, progress, log_trace, last_updated_time, payload_result, owner_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        state = EXCLUDED.state,
        progress = EXCLUDED.progress,
        log_trace = EXCLUDED.log_trace,
        last_updated_time = EXCLUDED.last_updated_time,
        payload_result = EXCLUDED.payload_result,
        owner_id = EXCLUDED.owner_id;
    `;
    const params = [
      op.id,
      op.name,
      op.state,
      op.progress,
      op.logTrace,
      op.lastUpdatedTime,
      op.payloadResult ? JSON.stringify(op.payloadResult) : null,
      owner
    ];
    await dbPool.query(query, params);
    return true;
  } catch (err) {
    console.warn('[Cloud SQL] Error updating Nexus operation in database:', err);
    return false;
  }
}

/**
 * Retrieves all saved consultation records.
 */
export async function getConsultationRecords(): Promise<any[]> {
  if (!isDbConnected) {
    return inMemoryConsultations;
  }

  try {
    const dbPool = getDatabasePool();
    const res = await dbPool.query('SELECT * FROM consultation_records ORDER BY created_at DESC LIMIT 50');
    return res.rows;
  } catch (err) {
    console.warn('[Cloud SQL] Error getting consultation records, returning virtual ledger:', err);
    return inMemoryConsultations;
  }
}

/**
 * Deletes a single consultation record by ID.
 */
export async function deleteConsultationRecord(id: string): Promise<boolean> {
  const index = inMemoryConsultations.findIndex(c => c.id === id);
  if (index >= 0) {
    inMemoryConsultations.splice(index, 1);
  }

  if (!isDbConnected) {
    console.log(`[Cloud SQL Offline] Deleted consultation record ${id} from virtual ledger.`);
    return true;
  }

  try {
    const dbPool = getDatabasePool();
    await dbPool.query('DELETE FROM consultation_records WHERE id = $1', [id]);
    console.log(`[Cloud SQL] Deleted consultation record ${id} successfully.`);
    return true;
  } catch (err) {
    console.warn('[Cloud SQL] Error deleting consultation record:', err);
    return false;
  }
}

/**
 * Purges all consultation records.
 */
export async function purgeAllConsultationRecords(): Promise<boolean> {
  inMemoryConsultations.length = 0;

  if (!isDbConnected) {
    console.log('[Cloud SQL Offline] Purged all consultation records from virtual ledger.');
    return true;
  }

  try {
    const dbPool = getDatabasePool();
    await dbPool.query('DELETE FROM consultation_records');
    console.log('[Cloud SQL] Purged all consultation records successfully.');
    return true;
  } catch (err) {
    console.warn('[Cloud SQL] Error purging consultation records:', err);
    return false;
  }
}


