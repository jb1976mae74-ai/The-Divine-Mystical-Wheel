export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'GRAND_ARCHITECT' 
  | 'SUPREME_COMMANDER' 
  | 'SYSTEM_AUDITOR' 
  | 'SCHOLAR_OPERATOR' 
  | 'SEEKER_READONLY';

export type PermissionKey =
  | 'MANAGE_USERS'
  | 'ELEVATE_ROLES'
  | 'VIEW_AUDIT_LOGS'
  | 'EXPORT_SYSTEM_LOGS'
  | 'DATABASE_ADMIN'
  | 'PURGE_RECORDS'
  | 'EXECUTE_DECREES'
  | 'CONFIGURE_SECURITY'
  | 'DEPLOY_ARMAMENTS'
  | 'ACCESS_NEXUS_CORE';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'QUARANTINED';
  mfaEnabled: boolean;
  lastLogin: string;
  createdAt: string;
  ipAddress: string;
  location: string;
  permissions: PermissionKey[];
  avatarUrl?: string;
  failedAttempts: number;
}

export type LogLevel = 'info' | 'warn' | 'error' | 'security' | 'database' | 'adjustment';

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  actionCode?: string;
  ipAddress?: string;
  userEmail?: string;
  durationMs?: number;
  statusCode?: number;
  metadata?: Record<string, any>;
}

export interface TableMetric {
  name: string;
  rowCount: number;
  sizeFormatted: string;
  lastVacuum: string;
  status: 'OPTIMAL' | 'REINDEX_NEEDED' | 'LOCKED' | 'SYNCHRONIZED';
}

export interface DatabaseHealthData {
  status: 'HEALTHY' | 'DEGRADED' | 'MAINTENANCE' | 'OFFLINE';
  engine: string;
  host: string;
  databaseName: string;
  latencyMs: number;
  uptimeSeconds: number;
  lastPing: string;
  connectionPool: {
    active: number;
    idle: number;
    max: number;
    waiting: number;
  };
  cacheHitRatio: number;
  transactionsPerSec: number;
  activeQueriesCount: number;
  storageUsage: {
    usedMb: number;
    totalMb: number;
    percentage: number;
  };
  replication: {
    status: 'SYNCHRONIZED' | 'STREAMING' | 'LOCAL_STANDALONE';
    role: 'PRIMARY' | 'REPLICA';
    lagMs: number;
  };
  tables: TableMetric[];
  recentErrors: string[];
}

export interface AdminStats {
  totalUsers: number;
  activeSessions: number;
  mfaAdoptionRate: number;
  securityEventsToday: number;
  dbQueryCountToday: number;
  averageLatencyMs: number;
  systemHealthScore: number;
}
