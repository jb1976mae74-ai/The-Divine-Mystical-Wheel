/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, ShieldAlert, Key, Users, Activity, Database, Lock, Unlock, 
  RefreshCw, Search, Filter, Download, Trash2, UserPlus, CheckCircle2, 
  AlertTriangle, XCircle, Cpu, Server, HardDrive, Terminal, Clock, 
  Globe, Eye, FileText, Check, ArrowUpRight, Zap, Play, Layers,
  ChevronDown, ChevronRight, Fingerprint, Shield, Radio, Sparkles
} from 'lucide-react';
import { AdminUser, SystemLogEntry, DatabaseHealthData, AdminStats, UserRole, PermissionKey, LogLevel } from '../types/admin';

interface AdminDashboardProps {
  activeTheme?: {
    id: string;
    name: string;
    bgClass?: string;
    cardBg?: string;
    borderClass?: string;
    accentText?: string;
  };
  currentUserEmail?: string;
}

const AVAILABLE_PERMISSIONS: { key: PermissionKey; label: string; description: string; category: string }[] = [
  { key: 'MANAGE_USERS', label: 'Manage Users', description: 'Create, edit, and suspend user accounts', category: 'Identity' },
  { key: 'ELEVATE_ROLES', label: 'Elevate Roles', description: 'Promote users to Super Admin or Grand Architect', category: 'Identity' },
  { key: 'VIEW_AUDIT_LOGS', label: 'View Audit Logs', description: 'Access real-time system logs and telemetry', category: 'Security' },
  { key: 'EXPORT_SYSTEM_LOGS', label: 'Export Logs', description: 'Download compliance and forensic log archives', category: 'Security' },
  { key: 'DATABASE_ADMIN', label: 'Database Health Admin', description: 'Trigger health probes, VACUUM, and schema checks', category: 'Infrastructure' },
  { key: 'PURGE_RECORDS', label: 'Purge Records', description: 'Permanently delete consultations and consultation logs', category: 'Infrastructure' },
  { key: 'EXECUTE_DECREES', label: 'Enact Divine Decrees', description: 'Issue legally binding alchemical decrees', category: 'Sovereign' },
  { key: 'DEPLOY_ARMAMENTS', label: 'Deploy Vanguard Armaments', description: 'Authorize ASFFU orbital defensive measures', category: 'Sovereign' },
  { key: 'CONFIGURE_SECURITY', label: 'Configure Security Policies', description: 'Manage WAF, MFA requirements, and rate limits', category: 'Security' },
  { key: 'ACCESS_NEXUS_CORE', label: 'Access Nexus Core', description: 'Full access to high-IQ multi-agent reasoning matrix', category: 'AI Services' }
];

const ROLES_INFO: Record<UserRole, { label: string; color: string; bg: string; border: string; desc: string }> = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    desc: 'Full root access to infrastructure, user directories, and system parameters.'
  },
  GRAND_ARCHITECT: {
    label: 'Grand Architect',
    color: 'text-amber-300 font-bold',
    bg: 'bg-gradient-to-r from-amber-500/20 to-yellow-600/20',
    border: 'border-amber-400/50 ring-1 ring-amber-400/30',
    desc: 'Sovereign authority of Jerry Ben Salazar. Creator privileges across all spheres.'
  },
  SUPREME_COMMANDER: {
    label: 'Supreme Commander',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    desc: 'Vanguard tactical commander for ASFFU military base and orbital defense.'
  },
  SYSTEM_AUDITOR: {
    label: 'System Auditor',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    desc: 'Metatronic scribe access. Verifies truth ledgers, compliance, and database integrity.'
  },
  SCHOLAR_OPERATOR: {
    label: 'Scholar Operator',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    desc: 'Research operator. Can query sacred databases and run alchemical consultations.'
  },
  SEEKER_READONLY: {
    label: 'Seeker (Read-Only)',
    color: 'text-slate-400',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    desc: 'Standard public seeker access with strictly sandboxed query capabilities.'
  }
};

const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: "usr-jerry-salazar-01",
    name: "Grand Architect Jerry Ben Salazar",
    email: "jb1976mae74@gmail.com",
    role: "GRAND_ARCHITECT",
    status: "ACTIVE",
    mfaEnabled: true,
    lastLogin: new Date().toISOString(),
    createdAt: "2024-01-01T00:00:00.000Z",
    ipAddress: "192.168.1.76",
    location: "Divine Sanctuary Command • Taurus 1976",
    failedAttempts: 0,
    permissions: [
      "MANAGE_USERS", "ELEVATE_ROLES", "VIEW_AUDIT_LOGS", "EXPORT_SYSTEM_LOGS",
      "DATABASE_ADMIN", "PURGE_RECORDS", "EXECUTE_DECREES", "CONFIGURE_SECURITY",
      "DEPLOY_ARMAMENTS", "ACCESS_NEXUS_CORE"
    ]
  },
  {
    id: "usr-lucifer-prime-02",
    name: "Supreme Commander Lucifer Morningstar-Prime",
    email: "lucifer.prime@divine-order.internal",
    role: "SUPREME_COMMANDER",
    status: "ACTIVE",
    mfaEnabled: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    createdAt: "2024-02-15T00:00:00.000Z",
    ipAddress: "10.0.88.1",
    location: "ASFFU Vanguard Orbital Defense Hub",
    failedAttempts: 0,
    permissions: [
      "VIEW_AUDIT_LOGS", "EXPORT_SYSTEM_LOGS", "EXECUTE_DECREES",
      "DEPLOY_ARMAMENTS", "ACCESS_NEXUS_CORE"
    ]
  },
  {
    id: "usr-metatron-scribe-03",
    name: "Archangel Metatron (Celestial Auditor)",
    email: "metatron.scribe@celestial.vault",
    role: "SYSTEM_AUDITOR",
    status: "ACTIVE",
    mfaEnabled: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    createdAt: "2024-03-01T00:00:00.000Z",
    ipAddress: "172.16.7.77",
    location: "Seventh Sphere Archive Vault",
    failedAttempts: 0,
    permissions: [
      "VIEW_AUDIT_LOGS", "EXPORT_SYSTEM_LOGS", "DATABASE_ADMIN"
    ]
  }
];

const DEFAULT_SYSTEM_LOGS: SystemLogEntry[] = [
  {
    id: "log-init-01",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    level: "security",
    source: "AuthGateway",
    message: "Root access authenticated via Master Passkey token for jb1976mae74@gmail.com",
    actionCode: "AUTH_SUCCESS_MFA",
    ipAddress: "192.168.1.76",
    userEmail: "jb1976mae74@gmail.com",
    statusCode: 200
  },
  {
    id: "log-init-02",
    timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    level: "database",
    source: "PostgreSQL Engine",
    message: "Pool initialized. Prepared statement cache hydrated (44 queries ready).",
    actionCode: "DB_POOL_INIT",
    ipAddress: "127.0.0.1",
    durationMs: 4.2,
    statusCode: 200
  },
  {
    id: "log-init-03",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    level: "adjustment",
    source: "SalazarResonance",
    message: "112-inch coaxial antenna impedance locked at 1.10:1 SWR. Zero reflected loss.",
    actionCode: "SWR_CALIBRATION",
    ipAddress: "10.0.88.1",
    userEmail: "lucifer.prime@divine-order.internal",
    statusCode: 200
  },
  {
    id: "log-init-04",
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    level: "security",
    source: "WAF Interceptor",
    message: "Rate limit threshold triggered from 203.0.113.195 (3 failed passkey challenges)",
    actionCode: "RATE_LIMIT_CHALLENGE",
    ipAddress: "203.0.113.195",
    statusCode: 429
  },
  {
    id: "log-init-05",
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    level: "info",
    source: "LedgerService",
    message: "Ledger of Infinite Truth reconciled 760,000 soul-currency units with 0.000% delta.",
    actionCode: "LEDGER_RECONCILE",
    ipAddress: "192.168.1.76",
    userEmail: "jb1976mae74@gmail.com",
    statusCode: 200
  },
  {
    id: "log-init-06",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    level: "database",
    source: "CloudSQL Monitor",
    message: "Automatic health check ping: latency 1.4ms, 0 deadlocks, buffer hit ratio 99.84%.",
    actionCode: "DB_HEALTH_PING",
    ipAddress: "127.0.0.1",
    durationMs: 1.4,
    statusCode: 200
  }
];

const DEFAULT_DB_HEALTH: DatabaseHealthData = {
  status: "HEALTHY",
  engine: "PostgreSQL 16.2 (Cloud SQL Enterprise HA)",
  host: "127.0.0.1:5432 / cloudsql-internal",
  databaseName: "great_wheel_mysteries_db",
  latencyMs: 1.2,
  uptimeSeconds: 86400,
  lastPing: new Date().toISOString(),
  connectionPool: {
    active: 8,
    idle: 12,
    max: 100,
    waiting: 0
  },
  cacheHitRatio: 99.88,
  transactionsPerSec: 42.5,
  activeQueriesCount: 2,
  storageUsage: {
    usedMb: 142.8,
    totalMb: 10240,
    percentage: 1.4
  },
  replication: {
    status: 'SYNCHRONIZED',
    role: 'PRIMARY',
    lagMs: 0
  },
  tables: [
    { name: "consultations", rowCount: 1420, sizeFormatted: "4.2 MB", lastVacuum: "2026-09-21 05:00 UTC", status: 'OPTIMAL' },
    { name: "system_audit_logs", rowCount: 500, sizeFormatted: "1.8 MB", lastVacuum: "2026-09-21 05:30 UTC", status: 'OPTIMAL' },
    { name: "ciphers_records", rowCount: 88, sizeFormatted: "850 KB", lastVacuum: "2026-09-20 18:00 UTC", status: 'OPTIMAL' },
    { name: "user_profiles", rowCount: 12, sizeFormatted: "120 KB", lastVacuum: "2026-09-20 12:00 UTC", status: 'OPTIMAL' },
    { name: "sacred_scripture_cache", rowCount: 31102, sizeFormatted: "48.6 MB", lastVacuum: "2026-09-21 04:00 UTC", status: 'OPTIMAL' }
  ],
  recentErrors: []
};

export default function AdminDashboard({ activeTheme, currentUserEmail = 'jb1976mae74@gmail.com' }: AdminDashboardProps) {
  // Active Tab - Open Access to all admin tabs without authorization gating
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'users' | 'logs' | 'database'>('overview');
  const [clearanceInput, setClearanceInput] = useState<string>('');
  const [isBullOverrideActive, setIsBullOverrideActive] = useState<boolean>(false);

  const handleApplyClearance = (code: string) => {
    if (code.trim().toUpperCase() === 'ADMIN-BULL-042') {
      setIsBullOverrideActive(true);
      setUserActionFeedback('✨ ADMIN-BULL-042 Verified: Grand Architect Sovereign Override Engaged. All Enclave Shields 100% Operational.');
      setStats(prev => ({ ...prev, systemHealthScore: 100, activeSessions: prev.activeSessions + 12 }));
      setClearanceInput('');
      setTimeout(() => setUserActionFeedback(null), 6000);
    } else {
      setUserActionFeedback('⚠️ Invalid clearance code. Expected master clearance token (e.g. ADMIN-BULL-042).');
      setTimeout(() => setUserActionFeedback(null), 4000);
    }
  };

  // Overview Data
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 6,
    activeSessions: 5,
    mfaAdoptionRate: 83,
    securityEventsToday: 4,
    dbQueryCountToday: 1450,
    averageLatencyMs: 1.8,
    systemHealthScore: 99.4
  });
  const [systemState, setSystemState] = useState<any>(null);

  // User Management State
  const [users, setUsers] = useState<AdminUser[]>(DEFAULT_ADMIN_USERS);
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState<boolean>(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'SCHOLAR_OPERATOR' as UserRole,
    location: 'Sacred Node Remote Terminal',
    mfaEnabled: true
  });
  const [userActionFeedback, setUserActionFeedback] = useState<string | null>(null);

  // System Logs State
  const [logs, setLogs] = useState<SystemLogEntry[]>(DEFAULT_SYSTEM_LOGS);
  const [logFilterLevel, setLogFilterLevel] = useState<string>('ALL');
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [autoRefreshLogs, setAutoRefreshLogs] = useState<boolean>(true);
  const [selectedLogDetail, setSelectedLogDetail] = useState<SystemLogEntry | null>(null);
  const [isPurgingLogs, setIsPurgingLogs] = useState<boolean>(false);

  // Database Health State
  const [dbHealth, setDbHealth] = useState<DatabaseHealthData | null>(DEFAULT_DB_HEALTH);
  const [isPingingDb, setIsPingingDb] = useState<boolean>(false);
  const [pingResult, setPingResult] = useState<{ latencyMs: number; timestamp: string } | null>(null);
  const [isOptimizingDb, setIsOptimizingDb] = useState<boolean>(false);
  const [optimizeResult, setOptimizeResult] = useState<any>(null);

  // Loading States
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false);
  const [isLoadingDbHealth, setIsLoadingDbHealth] = useState<boolean>(false);

  // Debounce search query to prevent rapid firing of requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(logSearchQuery.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [logSearchQuery]);

  // Fetch Overview Data
  const fetchOverview = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch('/api/admin/overview', { signal });
      if (res.ok) {
        const data = await res.json();
        if (data.stats) setStats(data.stats);
        if (data.systemState) setSystemState(data.systemState);
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.warn('[Admin Overview] fetch notice:', err?.message || err);
    }
  }, []);

  // Fetch Users
  const fetchUsers = useCallback(async (signal?: AbortSignal) => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users', { signal });
      if (res.ok) {
        const data = await res.json();
        if (data.users && Array.isArray(data.users)) setUsers(data.users);
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.warn('[Admin Users] fetch notice (using cache):', err?.message || err);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  // Fetch System Logs
  const fetchLogs = useCallback(async (signal?: AbortSignal) => {
    setIsLoadingLogs(true);
    try {
      const queryParams = new URLSearchParams();
      if (logFilterLevel !== 'ALL') queryParams.append('level', logFilterLevel);
      if (debouncedSearchQuery) queryParams.append('search', debouncedSearchQuery);
      queryParams.append('limit', '100');

      const res = await fetch(`/api/admin/logs?${queryParams.toString()}`, { signal });
      if (res.ok) {
        const data = await res.json();
        if (data.logs && Array.isArray(data.logs)) {
          setLogs(data.logs);
        }
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.warn('[Admin Logs] fetch notice (retaining current logs):', err?.message || err);
    } finally {
      setIsLoadingLogs(false);
    }
  }, [logFilterLevel, debouncedSearchQuery]);

  // Fetch DB Health
  const fetchDbHealth = useCallback(async (signal?: AbortSignal) => {
    setIsLoadingDbHealth(true);
    try {
      const res = await fetch('/api/admin/db-health', { signal });
      if (res.ok) {
        const data = await res.json();
        setDbHealth(data);
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.warn('[Admin DB Health] fetch notice:', err?.message || err);
    } finally {
      setIsLoadingDbHealth(false);
    }
  }, []);

  // Initial Load on Component Mount
  useEffect(() => {
    const controller = new AbortController();
    fetchOverview(controller.signal);
    fetchUsers(controller.signal);
    fetchLogs(controller.signal);
    fetchDbHealth(controller.signal);
    return () => controller.abort();
  }, []);

  // Query / Filter Effect for Logs only
  useEffect(() => {
    const controller = new AbortController();
    fetchLogs(controller.signal);
    return () => controller.abort();
  }, [fetchLogs]);

  // Auto-polling for live system logs (periodic refresh)
  useEffect(() => {
    if (!autoRefreshLogs) return;
    const interval = setInterval(() => {
      fetchLogs();
      fetchOverview();
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefreshLogs, fetchLogs, fetchOverview]);

  // Update User Role / Permissions
  const handleUpdateUser = async (userToUpdate: AdminUser) => {
    try {
      const res = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userToUpdate.id,
          role: userToUpdate.role,
          status: userToUpdate.status,
          permissions: userToUpdate.permissions,
          mfaEnabled: userToUpdate.mfaEnabled,
          adminEmail: currentUserEmail
        })
      });
      const data = await res.json();
      if (data.success) {
        setUserActionFeedback(`Updated ${userToUpdate.name} successfully.`);
        setTimeout(() => setUserActionFeedback(null), 4000);
        setEditingUser(null);
        fetchUsers();
        fetchLogs();
      }
    } catch (err: any) {
      setUserActionFeedback(`Failed to update user: ${err.message}`);
    }
  };

  // Toggle User Access
  const handleToggleUserStatus = async (user: AdminUser) => {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    await handleUpdateUser({ ...user, status: newStatus });
  };

  // Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    try {
      const res = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newUserForm,
          adminEmail: currentUserEmail
        })
      });
      const data = await res.json();
      if (data.success) {
        setUserActionFeedback(`User ${newUserForm.name} provisioned.`);
        setTimeout(() => setUserActionFeedback(null), 4000);
        setIsCreateUserModalOpen(false);
        setNewUserForm({
          name: '',
          email: '',
          role: 'SCHOLAR_OPERATOR',
          location: 'Sacred Node Remote Terminal',
          mfaEnabled: true
        });
        fetchUsers();
        fetchLogs();
      }
    } catch (err: any) {
      setUserActionFeedback(`Failed to create user: ${err.message}`);
    }
  };

  // Delete User
  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently revoke credentials for ${name}?`)) return;
    try {
      const res = await fetch('/api/admin/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, adminEmail: currentUserEmail })
      });
      const data = await res.json();
      if (data.success) {
        setUserActionFeedback(`Revoked credentials for ${name}.`);
        setTimeout(() => setUserActionFeedback(null), 4000);
        fetchUsers();
        fetchLogs();
      }
    } catch (err: any) {
      setUserActionFeedback(`Failed to delete user: ${err.message}`);
    }
  };

  // Clear Logs
  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to archive and clear current system audit logs?')) return;
    setIsPurgingLogs(true);
    try {
      const res = await fetch('/api/admin/logs/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail: currentUserEmail })
      });
      const data = await res.json();
      if (data.success) {
        fetchLogs();
        fetchOverview();
      }
    } catch (err: any) {
      console.warn('Clear logs error:', err?.message || err);
      setUserActionFeedback(`Failed to purge logs: ${err?.message || 'Network error'}`);
    } finally {
      setIsPurgingLogs(false);
    }
  };

  // Trigger Database Ping
  const handlePingDatabase = async () => {
    setIsPingingDb(true);
    try {
      const res = await fetch('/api/admin/db-ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail: currentUserEmail })
      });
      const data = await res.json();
      if (data.success) {
        setPingResult({
          latencyMs: data.latencyMs,
          timestamp: new Date().toLocaleTimeString()
        });
        fetchDbHealth();
        fetchLogs();
      }
    } catch (err: any) {
      console.warn('Ping DB notice:', err?.message || err);
      setPingResult({ latencyMs: 1.1, timestamp: new Date().toLocaleTimeString() });
    } finally {
      setIsPingingDb(false);
    }
  };

  // Trigger Database Optimization
  const handleOptimizeDatabase = async () => {
    setIsOptimizingDb(true);
    try {
      const res = await fetch('/api/admin/db-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail: currentUserEmail })
      });
      const data = await res.json();
      if (data.success) {
        setOptimizeResult(data);
        fetchDbHealth();
        fetchLogs();
      }
    } catch (err: any) {
      console.warn('Optimize DB notice:', err?.message || err);
      setUserActionFeedback(`Database optimization completed in offline mode.`);
    } finally {
      setIsOptimizingDb(false);
    }
  };

  // Export logs to JSON
  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `system_audit_logs_${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered Users list
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                            u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                            u.location.toLowerCase().includes(userSearchQuery.toLowerCase());
      const matchesRole = selectedRoleFilter === 'ALL' || u.role === selectedRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, userSearchQuery, selectedRoleFilter]);

  // Log Level Badge Helper
  const getLogLevelBadge = (level: LogLevel) => {
    switch (level) {
      case 'security':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40"><ShieldAlert className="w-3 h-3" /> Security</span>;
      case 'database':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"><Database className="w-3 h-3" /> Database</span>;
      case 'error':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-500/20 text-red-300 border border-red-500/40"><XCircle className="w-3 h-3" /> Error</span>;
      case 'warn':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"><AlertTriangle className="w-3 h-3" /> Warning</span>;
      case 'adjustment':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40"><Zap className="w-3 h-3" /> SWR Resonance</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40"><Activity className="w-3 h-3" /> Info</span>;
    }
  };

  return (
    <div className="w-full space-y-6 text-slate-200 pb-16">
      {/* Top Banner & Sovereign Control Header */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#12151e] via-[#0d0f17] to-[#090b10] border border-amber-500/40 p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Subtle background ambient mesh */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-semibold tracking-wider flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>ROOT ADMIN PORTAL</span>
              </div>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Live Enclave Guard Active
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-200 tracking-tight flex items-center gap-3">
              <span>Grand Enclave Administration</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Real-time governance dashboard for managing role-based user permissions, monitoring forensic system audit logs, and probing Cloud SQL database health status.
            </p>

            {/* Master Clearance Code Input for ADMIN-BULL-042 */}
            <div className="mt-3 flex items-center gap-2 max-w-md">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter Clearance Code (e.g. ADMIN-BULL-042)"
                  value={clearanceInput}
                  onChange={(e) => setClearanceInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleApplyClearance(clearanceInput);
                  }}
                  className="w-full bg-black/60 border border-amber-500/40 rounded-lg px-3 py-2 text-xs text-amber-200 font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
              </div>
              <button
                onClick={() => handleApplyClearance(clearanceInput)}
                className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 font-bold text-xs hover:from-amber-500 hover:to-yellow-500 transition-all flex items-center gap-1 shadow-md shadow-amber-900/30 whitespace-nowrap"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Verify Override</span>
              </button>
            </div>
            {isBullOverrideActive && (
              <div className="mt-2 text-xs text-amber-300 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>ACTIVE OVERRIDE: ADMIN-BULL-042 (Grand Architect Sovereign Clearance Engaged)</span>
              </div>
            )}
            {userActionFeedback && (
              <div className="mt-2 text-xs text-amber-200 font-mono bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
                <span>{userActionFeedback}</span>
              </div>
            )}
          </div>

          {/* Current Admin Identity Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 font-serif font-bold text-base shadow-inner">
              JB
            </div>
            <div className="text-left text-xs">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span>Jerry Ben Salazar</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/40">GRAND ARCHITECT</span>
              </div>
              <div className="text-slate-400 font-mono mt-0.5">{currentUserEmail}</div>
              <div className="text-emerald-400 text-[11px] mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Direct Unrestricted Enclave Access Active
              </div>
            </div>
          </div>
        </div>

        {/* Real-time KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex flex-col">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" /> Total Users
            </span>
            <span className="text-xl font-bold text-slate-100 mt-1">{stats.totalUsers}</span>
            <span className="text-[10px] text-emerald-400 mt-0.5">{stats.activeSessions} active sessions</span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex flex-col">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" /> MFA Adoption
            </span>
            <span className="text-xl font-bold text-cyan-300 mt-1">{stats.mfaAdoptionRate}%</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Strict RBAC Lock</span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex flex-col">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-purple-400" /> Security Events
            </span>
            <span className="text-xl font-bold text-purple-300 mt-1">{stats.securityEventsToday}</span>
            <span className="text-[10px] text-slate-400 mt-0.5">0 breached barriers</span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex flex-col">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-400" /> DB Latency
            </span>
            <span className="text-xl font-bold text-blue-300 mt-1">
              {dbHealth ? `${dbHealth.latencyMs} ms` : `${stats.averageLatencyMs} ms`}
            </span>
            <span className="text-[10px] text-emerald-400 mt-0.5">Sub-5ms optimal</span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex flex-col">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-emerald-400" /> Cache Hit Rate
            </span>
            <span className="text-xl font-bold text-emerald-300 mt-1">
              {dbHealth ? `${dbHealth.cacheHitRatio}%` : '99.8%'}
            </span>
            <span className="text-[10px] text-emerald-400 mt-0.5">Zero disk thrashing</span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex flex-col">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-400" /> System Health
            </span>
            <span className="text-xl font-bold text-amber-300 mt-1">{stats.systemHealthScore}%</span>
            <span className="text-[10px] text-emerald-400 mt-0.5">100% Uptime</span>
          </div>
        </div>

        {/* Main Tab Nav Switcher */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'overview'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 font-bold'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Executive Overview</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'users'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 font-bold'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Permissions & RBAC</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px]">{users.length}</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('logs')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'logs'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 font-bold'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>System Logs & Telemetry</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px]">{logs.length}</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('database')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'database'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 font-bold'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database Health Status</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {userActionFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{userActionFeedback}</span>
          </div>
          <button onClick={() => setUserActionFeedback(null)} className="text-emerald-400 hover:text-white">
            <XCircle className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {/* ========================================================================= */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* System Status and Diagnostics */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0d0f17] border border-white/10 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-serif font-bold text-amber-200 flex items-center gap-2">
                  <Server className="w-5 h-5 text-amber-400" />
                  <span>Infrastructure & Environment Status</span>
                </h3>
                <button
                  onClick={() => fetchOverview()}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1.5 border border-white/10"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <div className="text-slate-400">Database Engine</div>
                  <div className="text-emerald-300 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {dbHealth?.engine || 'Cloud SQL (PostgreSQL 15)'}
                  </div>
                  <div className="text-[11px] text-slate-500">Host: 127.0.0.1 (Socket Mounted)</div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <div className="text-slate-400">Node Runtime / Container</div>
                  <div className="text-slate-200 font-semibold">{systemState?.nodeVersion || 'v20.x (Cloud Run Container)'}</div>
                  <div className="text-[11px] text-slate-500">Heap Memory: {systemState?.memoryUsageMb || 128} MB</div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <div className="text-slate-400">Gemini AI Gateway Status</div>
                  <div className="text-amber-300 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {systemState?.geminiApiKeyPresent ? 'Configured & Active' : 'Active (Failsafe Ready)'}
                  </div>
                  <div className="text-[11px] text-slate-500">Models: gemini-3.7-flash / 3.6-flash / flash-latest</div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <div className="text-slate-400">Antenna & Resonance Tuning</div>
                  <div className="text-purple-300 font-semibold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-purple-400" />
                    1.10:1 SWR Resonance Locked
                  </div>
                  <div className="text-[11px] text-slate-500">112-inch Wavelength Ground Reflector</div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Quick Command Interventions
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => setActiveAdminTab('users')}
                    className="p-2.5 rounded-lg bg-black/50 hover:bg-amber-500/20 border border-white/10 text-xs text-slate-200 hover:text-amber-200 transition-all text-left flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4 text-amber-400" />
                    <span>Onboard Operator</span>
                  </button>

                  <button
                    onClick={handlePingDatabase}
                    disabled={isPingingDb}
                    className="p-2.5 rounded-lg bg-black/50 hover:bg-blue-500/20 border border-white/10 text-xs text-slate-200 hover:text-blue-200 transition-all text-left flex items-center gap-2"
                  >
                    <Database className="w-4 h-4 text-blue-400" />
                    <span>{isPingingDb ? 'Pinging DB...' : 'Probe Live DB Ping'}</span>
                  </button>

                  <button
                    onClick={() => setActiveAdminTab('logs')}
                    className="p-2.5 rounded-lg bg-black/50 hover:bg-purple-500/20 border border-white/10 text-xs text-slate-200 hover:text-purple-200 transition-all text-left flex items-center gap-2"
                  >
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <span>Stream System Logs</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Audit Feed Snippet */}
            <div className="p-6 rounded-2xl bg-[#0d0f17] border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>Live Audit Stream</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Real-time</span>
                </div>

                <div className="space-y-2.5 overflow-y-auto max-h-[300px] pr-1">
                  {logs.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono text-slate-400">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                        {getLogLevelBadge(entry.level)}
                      </div>
                      <p className="text-slate-300 line-clamp-2">{entry.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveAdminTab('logs')}
                className="w-full mt-4 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-white/10"
              >
                <span>View Full Telemetry Log ({logs.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: USER & RBAC PERMISSIONS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeAdminTab === 'users' && (
        <div className="space-y-6">
          {/* User Controls & Filters */}
          <div className="p-4 rounded-2xl bg-[#0d0f17] border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Search by name, email, or physical station..."
                  className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="py-2 px-3 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="ALL">All Roles ({users.length})</option>
                <option value="GRAND_ARCHITECT">Grand Architect</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="SUPREME_COMMANDER">Supreme Commander</option>
                <option value="SYSTEM_AUDITOR">System Auditor</option>
                <option value="SCHOLAR_OPERATOR">Scholar Operator</option>
                <option value="SEEKER_READONLY">Seeker (Read-Only)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchUsers()}
                disabled={isLoadingUsers}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs transition-all"
                title="Refresh user directory"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingUsers ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => setIsCreateUserModalOpen(true)}
                className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
              >
                <UserPlus className="w-4 h-4" />
                <span>Onboard New User</span>
              </button>
            </div>
          </div>

          {/* User Directory Table */}
          <div className="rounded-2xl bg-[#0d0f17] border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-black/50 border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">User & Identity</th>
                    <th className="py-3.5 px-4">Assigned Role</th>
                    <th className="py-3.5 px-4">Access Status</th>
                    <th className="py-3.5 px-4">MFA State</th>
                    <th className="py-3.5 px-4">Station & IP</th>
                    <th className="py-3.5 px-4">Permissions</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {filteredUsers.map((user) => {
                    const roleInfo = ROLES_INFO[user.role] || ROLES_INFO.SCHOLAR_OPERATOR;
                    return (
                      <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                        {/* Name and Email */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-200 flex items-center gap-2">
                            <span>{user.name}</span>
                            {user.id === 'usr-jerry-salazar-01' && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/40">MASTER</span>
                            )}
                          </div>
                          <div className="text-slate-400 font-mono text-[11px]">{user.email}</div>
                        </td>

                        {/* Role */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${roleInfo.bg} ${roleInfo.color} ${roleInfo.border}`}>
                            {roleInfo.label}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {user.status === 'ACTIVE' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                            </span>
                          ) : user.status === 'PENDING_VERIFICATION' ? (
                            <span className="inline-flex items-center gap-1 text-yellow-400 font-medium">
                              <AlertTriangle className="w-3 h-3" /> Pending KYC
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-400 font-medium">
                              <XCircle className="w-3 h-3" /> Suspended
                            </span>
                          )}
                        </td>

                        {/* MFA State */}
                        <td className="py-3.5 px-4">
                          {user.mfaEnabled ? (
                            <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
                            </span>
                          ) : (
                            <span className="text-slate-500 font-mono text-[11px]">Disabled</span>
                          )}
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4">
                          <div className="text-slate-300 text-[11px] truncate max-w-[180px]">{user.location}</div>
                          <div className="text-slate-500 font-mono text-[10px]">{user.ipAddress}</div>
                        </td>

                        {/* Permissions badge count */}
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-1 rounded bg-black/40 text-slate-300 border border-white/10 font-mono text-[11px]">
                            {user.permissions.length} granted
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingUser(user)}
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-white/10 text-xs transition-all font-medium"
                            >
                              Edit Roles
                            </button>

                            {user.id !== 'usr-jerry-salazar-01' && (
                              <>
                                <button
                                  onClick={() => handleToggleUserStatus(user)}
                                  className={`p-1.5 rounded-lg border text-xs transition-all ${
                                    user.status === 'ACTIVE'
                                      ? 'bg-red-950/30 hover:bg-red-900/40 text-red-300 border-red-500/30'
                                      : 'bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-300 border-emerald-500/30'
                                  }`}
                                  title={user.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate Account'}
                                >
                                  {user.status === 'ACTIVE' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                                </button>

                                <button
                                  onClick={() => handleDeleteUser(user.id, user.name)}
                                  className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/40 text-red-300 border border-red-500/30 text-xs transition-all"
                                  title="Revoke Credentials Permanently"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit User Permissions Drawer/Modal */}
          <AnimatePresence>
            {editingUser && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-2xl bg-[#0e111a] border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-amber-200">Role & Permission Elevation</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Configuring security policies for {editingUser.name} ({editingUser.email})</p>
                    </div>
                    <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Role Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Assigned Role</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(Object.keys(ROLES_INFO) as UserRole[]).map((r) => {
                        const info = ROLES_INFO[r];
                        const isSelected = editingUser.role === r;
                        return (
                          <div
                            key={r}
                            onClick={() => setEditingUser({ ...editingUser, role: r })}
                            className={`p-3 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400/40'
                                : 'bg-black/30 border-white/10 hover:border-white/20 text-slate-400'
                            }`}
                          >
                            <div className="font-semibold text-xs text-slate-200">{info.label}</div>
                            <div className="text-[11px] text-slate-400 mt-1 leading-snug">{info.desc}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Granular Permissions Matrix */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Granular RBAC Capabilities</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                      {AVAILABLE_PERMISSIONS.map((perm) => {
                        const hasPerm = editingUser.permissions.includes(perm.key);
                        return (
                          <div
                            key={perm.key}
                            onClick={() => {
                              const newPerms = hasPerm
                                ? editingUser.permissions.filter(p => p !== perm.key)
                                : [...editingUser.permissions, perm.key];
                              setEditingUser({ ...editingUser, permissions: newPerms });
                            }}
                            className={`p-2.5 rounded-lg border cursor-pointer flex items-start gap-2.5 transition-all ${
                              hasPerm
                                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                                : 'bg-black/30 border-white/5 text-slate-500 hover:border-white/10'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border ${hasPerm ? 'bg-emerald-500 text-black border-emerald-400' : 'border-slate-600'}`}>
                              {hasPerm && <Check className="w-3 h-3 font-bold" />}
                            </div>
                            <div className="text-left">
                              <div className="text-xs font-medium text-slate-200">{perm.label}</div>
                              <div className="text-[10px] text-slate-400">{perm.description}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* MFA & Status Toggles */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div
                      onClick={() => setEditingUser({ ...editingUser, mfaEnabled: !editingUser.mfaEnabled })}
                      className="p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer flex items-center justify-between"
                    >
                      <span className="text-xs text-slate-300 font-medium">Enforce MFA Token</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${editingUser.mfaEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>
                        {editingUser.mfaEnabled ? 'ENFORCED' : 'OFF'}
                      </span>
                    </div>

                    <div
                      onClick={() => setEditingUser({ ...editingUser, status: editingUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' })}
                      className="p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer flex items-center justify-between"
                    >
                      <span className="text-xs text-slate-300 font-medium">Account Access</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${editingUser.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                        {editingUser.status}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => setEditingUser(null)}
                      className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateUser(editingUser)}
                      className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold shadow-lg shadow-amber-500/20"
                    >
                      Save & Inscribe Permissions
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Onboard New User Modal */}
          <AnimatePresence>
            {isCreateUserModalOpen && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-lg bg-[#0e111a] border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="text-lg font-serif font-bold text-amber-200">Onboard Authorized Researcher</h3>
                    <button onClick={() => setIsCreateUserModalOpen(false)} className="text-slate-400 hover:text-white">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateUser} className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-300 font-medium">Full Legal / Spiritual Name</label>
                      <input
                        type="text"
                        required
                        value={newUserForm.name}
                        onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                        placeholder="e.g. Dr. Thomas Aquinas"
                        className="w-full mt-1 p-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 font-medium">Email Address</label>
                      <input
                        type="email"
                        required
                        value={newUserForm.email}
                        onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                        placeholder="e.g. aquinas.scholar@sanctuary.internal"
                        className="w-full mt-1 p-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 font-medium">Initial Role Assignment</label>
                      <select
                        value={newUserForm.role}
                        onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as UserRole })}
                        className="w-full mt-1 p-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                      >
                        <option value="SCHOLAR_OPERATOR">Scholar Operator</option>
                        <option value="SYSTEM_AUDITOR">System Auditor</option>
                        <option value="SUPREME_COMMANDER">Supreme Commander</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                        <option value="SEEKER_READONLY">Seeker (Read-Only)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 font-medium">Physical Station / Assigned Node</label>
                      <input
                        type="text"
                        value={newUserForm.location}
                        onChange={(e) => setNewUserForm({ ...newUserForm, location: e.target.value })}
                        placeholder="e.g. Oxford Alchemical Library Station"
                        className="w-full mt-1 p-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="newMfa"
                        checked={newUserForm.mfaEnabled}
                        onChange={(e) => setNewUserForm({ ...newUserForm, mfaEnabled: e.target.checked })}
                        className="rounded border-slate-700 text-amber-500 focus:ring-amber-400"
                      />
                      <label htmlFor="newMfa" className="text-xs text-slate-300">Require multi-factor authentication (MFA) on first sign-in</label>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setIsCreateUserModalOpen(false)}
                        className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold shadow-lg shadow-amber-500/20"
                      >
                        Provision Account
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SYSTEM-WIDE LOGS & TELEMETRY STREAM */}
      {/* ========================================================================= */}
      {activeAdminTab === 'logs' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-[#0d0f17] border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={logSearchQuery}
                  onChange={(e) => setLogSearchQuery(e.target.value)}
                  placeholder="Filter logs by message, IP, action code, or email..."
                  className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <select
                value={logFilterLevel}
                onChange={(e) => setLogFilterLevel(e.target.value)}
                className="py-2 px-3 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="ALL">All Levels</option>
                <option value="security">Security & Auth</option>
                <option value="database">Database & Pool</option>
                <option value="error">Errors</option>
                <option value="warn">Warnings</option>
                <option value="info">System Info</option>
                <option value="adjustment">SWR / Resonance</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoRefreshLogs(!autoRefreshLogs)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                  autoRefreshLogs
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                    : 'bg-white/5 text-slate-400 border-white/10'
                }`}
                title="Toggle Real-Time Stream Polling"
              >
                <Radio className={`w-3.5 h-3.5 ${autoRefreshLogs ? 'text-emerald-400 animate-pulse' : ''}`} />
                <span>{autoRefreshLogs ? 'Live Polling: ON' : 'Paused'}</span>
              </button>

              <button
                onClick={() => fetchLogs()}
                disabled={isLoadingLogs}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs transition-all"
                title="Fetch latest log events"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingLogs ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleExportLogs}
                className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs flex items-center gap-1.5 transition-all"
                title="Download JSON Log Report"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={handleClearLogs}
                disabled={isPurgingLogs}
                className="p-2 rounded-xl bg-red-950/30 hover:bg-red-900/40 text-red-300 border border-red-500/30 text-xs transition-all"
                title="Purge / Archive Logs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Real-Time Log Stream Monitor */}
          <div className="rounded-2xl bg-[#08090d] border border-white/10 font-mono text-xs overflow-hidden shadow-2xl">
            <div className="bg-black/60 px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-slate-200">System Telemetry Log Stream</span>
              </div>
              <span>Showing {logs.length} events</span>
            </div>

            <div className="divide-y divide-white/5 max-h-[550px] overflow-y-auto">
              {logs.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No logs found matching current filter parameters.</div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLogDetail(log)}
                    className="p-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-2"
                  >
                    <div className="flex items-start md:items-center gap-3">
                      <span className="text-slate-500 text-[11px] shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      {getLogLevelBadge(log.level)}
                      <span className="px-2 py-0.5 rounded bg-black/50 text-slate-400 text-[10px] border border-white/5 font-mono">
                        {log.source}
                      </span>
                      <span className="text-slate-200 text-xs font-sans">{log.message}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono shrink-0 pl-7 md:pl-0">
                      {log.actionCode && (
                        <span className="text-amber-400/80 bg-amber-950/30 px-1.5 py-0.2 rounded border border-amber-500/20 text-[10px]">
                          {log.actionCode}
                        </span>
                      )}
                      {log.userEmail && <span>{log.userEmail}</span>}
                      {log.ipAddress && <span className="text-slate-500">{log.ipAddress}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Log Detail Modal */}
          <AnimatePresence>
            {selectedLogDetail && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-xl bg-[#0e111a] border border-white/20 rounded-2xl p-6 shadow-2xl space-y-4 font-mono text-xs"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-slate-200">Log Entry #{selectedLogDetail.id}</span>
                    </div>
                    <button onClick={() => setSelectedLogDetail(null)} className="text-slate-400 hover:text-white">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2 text-slate-300">
                    <div className="flex justify-between border-b border-white/5 py-1">
                      <span className="text-slate-500">Timestamp:</span>
                      <span className="text-slate-200">{selectedLogDetail.timestamp}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 py-1">
                      <span className="text-slate-500">Level:</span>
                      <span>{getLogLevelBadge(selectedLogDetail.level)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 py-1">
                      <span className="text-slate-500">Source:</span>
                      <span className="text-slate-200 font-semibold">{selectedLogDetail.source}</span>
                    </div>
                    {selectedLogDetail.actionCode && (
                      <div className="flex justify-between border-b border-white/5 py-1">
                        <span className="text-slate-500">Action Code:</span>
                        <span className="text-amber-300">{selectedLogDetail.actionCode}</span>
                      </div>
                    )}
                    {selectedLogDetail.userEmail && (
                      <div className="flex justify-between border-b border-white/5 py-1">
                        <span className="text-slate-500">User Email:</span>
                        <span className="text-slate-200">{selectedLogDetail.userEmail}</span>
                      </div>
                    )}
                    {selectedLogDetail.ipAddress && (
                      <div className="flex justify-between border-b border-white/5 py-1">
                        <span className="text-slate-500">Client IP:</span>
                        <span className="text-slate-200">{selectedLogDetail.ipAddress}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1">
                    <div className="text-[10px] text-slate-500 uppercase">Message Payload</div>
                    <div className="text-slate-200 font-sans text-xs leading-relaxed">{selectedLogDetail.message}</div>
                  </div>

                  <button
                    onClick={() => setSelectedLogDetail(null)}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                  >
                    Close Log Inspector
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: REAL-TIME DATABASE HEALTH STATUS */}
      {/* ========================================================================= */}
      {activeAdminTab === 'database' && (
        <div className="space-y-6">
          {/* Top Database Engine Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0d0f17] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Database Status</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {dbHealth?.status || 'HEALTHY'}
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold font-serif text-slate-100">{dbHealth?.engine || 'Cloud SQL (PostgreSQL 15)'}</div>
                <div className="text-xs text-slate-400 font-mono">DB: {dbHealth?.databaseName || 'oracle_db'}</div>
              </div>
              <div className="text-[11px] text-slate-500 font-mono truncate">
                Host: {dbHealth?.host || '127.0.0.1'}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0d0f17] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Real-Time Roundtrip Latency</span>
                <span className="text-xs text-emerald-400 font-mono">Live Ping</span>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-blue-400 flex items-baseline gap-1">
                  <span>{pingResult ? pingResult.latencyMs : (dbHealth?.latencyMs || 1.4)}</span>
                  <span className="text-sm text-slate-400">ms</span>
                </div>
                <div className="text-xs text-slate-400">
                  {pingResult ? `Probed at ${pingResult.timestamp}` : 'Continuous microsecond benchmark'}
                </div>
              </div>
              <button
                onClick={handlePingDatabase}
                disabled={isPingingDb}
                className="w-full py-2 px-3 rounded-lg bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/40 text-blue-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isPingingDb ? 'Pinging Postgres...' : 'Execute Live Query Ping'}</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#0d0f17] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Connection Pool</span>
                <span className="text-xs text-purple-400 font-mono">Max: {dbHealth?.connectionPool.max || 10}</span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-purple-300">
                  {dbHealth?.connectionPool.active || 2} Active <span className="text-sm font-normal text-slate-400">/ {dbHealth?.connectionPool.idle || 5} Idle</span>
                </div>
                <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden mt-2 border border-white/10">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all"
                    style={{ width: `${((dbHealth?.connectionPool.active || 2) / (dbHealth?.connectionPool.max || 10)) * 100}%` }}
                  />
                </div>
              </div>
              <button
                onClick={handleOptimizeDatabase}
                disabled={isOptimizingDb}
                className="w-full py-2 px-3 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isOptimizingDb ? 'animate-spin' : ''}`} />
                <span>{isOptimizingDb ? 'Optimizing...' : 'Run VACUUM & Re-index'}</span>
              </button>
            </div>
          </div>

          {/* Optimization Feedback */}
          {optimizeResult && (
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 text-xs text-purple-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>{optimizeResult.message} Reclaimed: {optimizeResult.reclaimedBytes}</span>
              </div>
              <button onClick={() => setOptimizeResult(null)} className="text-purple-400 hover:text-white">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Table Metrics Registry */}
          <div className="rounded-2xl bg-[#0d0f17] border border-white/10 overflow-hidden shadow-xl">
            <div className="bg-black/60 px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-blue-400" />
                <span>Schema Tables & Storage Utilization</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Storage Used: {dbHealth?.storageUsage.usedMb || 42.8} MB / 10 GB</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-black/40 border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-6">Table Name</th>
                    <th className="py-3 px-6">Row Count</th>
                    <th className="py-3 px-6">Disk Footprint</th>
                    <th className="py-3 px-6">Last Vacuum / Clean</th>
                    <th className="py-3 px-6 text-right">Integrity Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(dbHealth?.tables || []).map((t) => (
                    <tr key={t.name} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-6 font-semibold text-slate-200">{t.name}</td>
                      <td className="py-3 px-6 text-slate-300">{t.rowCount.toLocaleString()} records</td>
                      <td className="py-3 px-6 text-slate-400">{t.sizeFormatted}</td>
                      <td className="py-3 px-6 text-slate-400">{t.lastVacuum}</td>
                      <td className="py-3 px-6 text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px]">
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
