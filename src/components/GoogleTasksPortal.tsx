import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Plus, Trash2, Calendar, Clock, 
  Tag, Sparkles, RefreshCw, AlertCircle, LogIn, ChevronRight,
  Filter, SortAsc, LayoutList, CheckSquare, ListTodo
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAccessToken, googleSignIn } from '../firebase';
import { User } from 'firebase/auth';
import GoogleKeepAndPickerHub from './GoogleKeepAndPickerHub';

interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string;
  updated: string;
  position: string;
}

interface GoogleTaskList {
  id: string;
  title: string;
  updated: string;
}

interface GoogleTasksPortalProps {
  activeTheme: any;
  user: User | null;
  onScryQuery?: (query: string, school?: string) => void;
}

export const GoogleTasksPortal: React.FC<GoogleTasksPortalProps> = ({ activeTheme, user, onScryQuery }) => {
  const [taskLists, setTaskLists] = useState<GoogleTaskList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>('@default');
  const [tasks, setTasks] = useState<GoogleTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const fetchTaskLists = async () => {
    const token = await getAccessToken();
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch task lists');
      const data = await res.json();
      setTaskLists(data.items || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (listId: string) => {
    const token = await getAccessToken();
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks?showCompleted=true&showHidden=true`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data.items || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTaskLists();
    }
  }, [user]);

  useEffect(() => {
    if (user && selectedListId) {
      fetchTasks(selectedListId);
    }
  }, [user, selectedListId]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const token = await getAccessToken();
    if (!token) return;

    try {
      setIsAdding(true);
      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${selectedListId}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newTaskTitle,
          notes: newTaskNotes
        })
      });

      if (!res.ok) throw new Error('Failed to create task');
      
      const newTask = await res.json();
      setTasks(prev => [newTask, ...prev]);
      setNewTaskTitle('');
      setNewTaskNotes('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleTask = async (task: GoogleTask) => {
    const token = await getAccessToken();
    if (!token) return;

    const newStatus = task.status === 'needsAction' ? 'completed' : 'needsAction';
    
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));

    try {
      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${selectedListId}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
        })
      });

      if (!res.ok) throw new Error('Failed to update task status');
    } catch (err: any) {
      // Revert optimistic update
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: task.status } : t));
      setError(err.message);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to banish this task from your sacred list?')) return;

    const token = await getAccessToken();
    if (!token) return;

    try {
      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${selectedListId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md">
        <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
          <ListTodo className="w-12 h-12 text-amber-500" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-100 mb-2">Sacred Scrolls & Tasks Hub</h2>
        <p className="text-slate-400 max-w-md mb-8">
          Sync your mystical revelations and spiritual goals with Google Tasks. Link your account to access your sacred to-do lists across all devices.
        </p>
        <button
          onClick={() => googleSignIn()}
          className="flex items-center gap-3 px-8 py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-900/20"
        >
          <LogIn className="w-5 h-5" />
          <span>Connect Workspace</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-amber-950/30 via-black/40 to-black/40 border border-amber-500/20 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <CheckSquare className="w-32 h-32 text-amber-500" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Spiritual Execution Stream</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-100 flex items-center gap-3">
            Sacred Scrolls
            <span className="text-[10px] font-sans font-normal px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
              Google Tasks Sync Active
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl font-sans">
            Manage your spiritual rituals, study goals, and alchemical tasks. Your progress is mirrored in Google Workspace for constant alignment.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <div className="flex flex-col items-end mr-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Current List</span>
            <select
              value={selectedListId}
              onChange={(e) => setSelectedListId(e.target.value)}
              className="bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-amber-200 focus:outline-none focus:border-amber-500/50 cursor-pointer font-serif"
            >
              {taskLists.map(list => (
                <option key={list.id} value={list.id}>{list.title}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => fetchTaskLists()}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-amber-400 transition-all"
            title="Refresh Archival Stream"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Add Task Form */}
      <motion.form 
        onSubmit={handleAddTask}
        className="p-6 bg-black/40 border border-white/5 rounded-2xl flex flex-col gap-4 shadow-lg backdrop-blur-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Plus className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-serif text-slate-400 uppercase tracking-widest">Inscribe New Task</span>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <input 
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What spiritual work must be done?..."
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 transition-all font-serif"
              required
            />
            <textarea 
              value={newTaskNotes}
              onChange={(e) => setNewTaskNotes(e.target.value)}
              placeholder="Additional alchemical notes or context..."
              rows={2}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-400 focus:outline-none focus:border-amber-500/50 transition-all font-sans resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={isAdding || !newTaskTitle.trim()}
            className="md:w-32 bg-amber-500/90 hover:bg-amber-500 text-black font-bold rounded-xl px-6 py-3 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed h-fit"
          >
            {isAdding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-5 h-5" />}
            <span>Inscribe</span>
          </button>
        </div>
      </motion.form>

      {/* Google Keep & Picker Hub Integration */}
      <div className="mt-4">
        <GoogleKeepAndPickerHub
          currentUser={user}
          needsAuth={!user}
          onAuthSuccess={() => {}}
          activeTheme={activeTheme}
          onScryQuery={onScryQuery}
          compact={false}
        />
      </div>

      {/* Tasks List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-2 mb-2">
          <div className="flex items-center gap-2">
            <LayoutList className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Current Active Tasks</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono">
            <span>{tasks.filter(t => t.status === 'completed').length} / {tasks.length} Completed</span>
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {tasks.length === 0 && !loading ? (
            <div className="text-center py-20 bg-black/20 border border-dashed border-white/10 rounded-2xl">
              <div className="p-3 rounded-full bg-white/5 border border-white/10 w-fit mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-500 font-serif italic">Your sacred list is clear. All tasks have been manifested.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task, idx) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-4 rounded-xl border group transition-all duration-300 ${
                    task.status === 'completed' 
                      ? 'bg-black/20 border-white/5 opacity-60' 
                      : 'bg-black/40 border-white/10 hover:border-amber-500/30 shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleTask(task)}
                      className={`mt-0.5 transition-colors ${
                        task.status === 'completed' ? 'text-emerald-500' : 'text-slate-500 hover:text-amber-500'
                      }`}
                    >
                      {task.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </button>
                    
                    <div className="flex-1">
                      <h4 className={`text-sm font-serif font-bold ${
                        task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-100'
                      }`}>
                        {task.title}
                      </h4>
                      {task.notes && (
                        <p className={`text-[11px] mt-1.5 leading-relaxed font-sans ${
                          task.status === 'completed' ? 'text-slate-600' : 'text-slate-400'
                        }`}>
                          {task.notes}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <div className="flex items-center gap-1 text-[9px] font-mono text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>Last Sync: {new Date(task.updated).toLocaleDateString()}</span>
                        </div>
                        {task.due && (
                          <div className="flex items-center gap-1 text-[9px] font-mono text-amber-500/80 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10">
                            <Calendar className="w-3 h-3" />
                            <span>Due: {new Date(task.due).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-rose-500 hover:bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-all"
                      title="Banish Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-xs text-rose-300 font-mono animate-pulse">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Error from Archival stream: {error}</span>
          <button onClick={() => setError(null)} className="ml-auto hover:text-white">✕</button>
        </div>
      )}
    </div>
  );
};

export default GoogleTasksPortal;
