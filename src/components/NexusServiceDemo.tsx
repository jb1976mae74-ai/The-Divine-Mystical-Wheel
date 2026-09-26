import React, { useState, useRef, useEffect } from 'react';
import {
  globalNexusService,
  IOperationHandle,
  NexusOperationStatus,
  SayHelloInput,
  SayHelloOutput,
  NexusAsyncOperationResult,
  NexusTaskCompletion,
  NexusOperationResultWrapper
} from '../utils/nexusService';
import {
  Activity,
  Play,
  RefreshCw,
  XCircle,
  Clock,
  Zap,
  Sparkles,
  Radio,
  Sliders,
  Terminal,
  Bell,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function NexusServiceDemo() {
  const [name, setName] = useState('Aetheric Seeker');
  const [forceError, setForceError] = useState<'none' | 'retryable' | 'non_retryable'>('none');
  const [status, setStatus] = useState('');
  const [result, setResult] = useState('');
  const [progress, setProgress] = useState(0);
  const [progressLog, setProgressLog] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // --- Workflow.StartWorkflowAsync Operation Handle State ---
  const [activeHandle, setActiveHandle] = useState<IOperationHandle<SayHelloInput, SayHelloOutput> | null>(null);
  const [handleStatus, setHandleStatus] = useState<NexusOperationStatus<SayHelloOutput> | null>(null);
  const [callbackNotification, setCallbackNotification] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const pollTimerRef = useRef<any>(null);

  // --- Extended Nexus Service Definition: Completion Task & Result Wrapper State ---
  const [activeCompletion, setActiveCompletion] = useState<NexusTaskCompletion<SayHelloOutput> | null>(null);
  const [activeResultWrapper, setActiveResultWrapper] = useState<NexusOperationResultWrapper<SayHelloOutput> | null>(null);
  const [taskState, setTaskState] = useState<'IDLE' | 'PENDING' | 'RESOLVED' | 'REJECTED'>('IDLE');

  // Poll active handle status
  const pollCurrentHandle = async (handleToPoll = activeHandle) => {
    if (!handleToPoll) return;
    try {
      setIsPolling(true);
      const opStatus = await handleToPoll.getStatusAsync();
      setHandleStatus(opStatus);
      if (opStatus.state === 'SUCCEEDED' && opStatus.result) {
        setResult(opStatus.result.greeting);
      }
    } catch (err: any) {
      console.error('Error polling operation status:', err);
    } finally {
      setIsPolling(false);
    }
  };

  // Setup auto-polling whenever an activeHandle is present
  useEffect(() => {
    if (activeHandle) {
      pollCurrentHandle(activeHandle);
      pollTimerRef.current = setInterval(() => {
        pollCurrentHandle(activeHandle);
      }, 400);
    }
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [activeHandle]);

  // Clean up auto-polling when terminal state is reached
  useEffect(() => {
    if (handleStatus && (handleStatus.state === 'SUCCEEDED' || handleStatus.state === 'FAILED' || handleStatus.state === 'CANCELED')) {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    }
  }, [handleStatus?.state]);

  // 1. Invoke Synchronous (sayHello)
  const handleInvokeSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setStatus('Invoking synchronous sayHello()...');
    setResult('');
    setProgress(0);
    setProgressLog('');
    setIsLoading(true);
    setCallbackNotification(null);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('/api/nexus/say-hello', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), forceError }),
        signal: abortControllerRef.current.signal
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(`Error (${data.type || res.status}): ${data.error || 'Unknown Error'}`);
        setResult('');
      } else {
        setStatus('Synchronous Operation Completed');
        setResult(data.result);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setStatus('Operation Cancelled via Client Token.');
      } else {
        setStatus(`Fetch Error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // 2. Invoke Async Activity Execution (sayHelloAsync)
  const handleInvokeActivityAsync = async () => {
    if (!name.trim()) return;

    setStatus('Executing Async Activity via Workflow.ExecuteActivityAsync...');
    setResult('');
    setProgress(0);
    setProgressLog('Initiating activity schedule...');
    setIsLoading(true);
    setCallbackNotification(null);

    try {
      const output = await globalNexusService.sayHelloAsync(
        { name: name.trim() },
        (pPercent, pLog) => {
          setProgress(pPercent);
          setProgressLog(pLog);
        }
      );

      setStatus('Asynchronous Activity Concluded Successfully');
      setResult(output.greeting);
      setProgress(100);
    } catch (err: any) {
      setStatus(`Async Activity Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Start Asynchronous Workflow Operation via Workflow.StartWorkflowAsync
  const handleStartWorkflowAsync = () => {
    if (!name.trim()) return;

    setStatus('Starting Asynchronous Operation via Workflow.StartWorkflowAsync...');
    setResult('');
    setProgress(0);
    setProgressLog('');
    setCallbackNotification(null);

    // Call Workflow.StartWorkflowAsync - immediately returns IOperationHandle
    const handle = globalNexusService.startSayHelloWorkflowAsync(
      { name: name.trim(), triggerErrorMode: forceError },
      {
        callbackUrl: 'http://localhost:3000/api/nexus/callback'
      }
    );

    setActiveHandle(handle);

    // Register completion callback on the operation handle
    handle.onCompletion((cbResult: NexusAsyncOperationResult<SayHelloOutput>) => {
      setCallbackNotification(
        `Callback Notification Received! Op ID: ${cbResult.operationId} | Terminal State: ${cbResult.state} at ${new Date(cbResult.completedAt).toLocaleTimeString()}`
      );
      pollCurrentHandle(handle);
    });

    setStatus(`Asynchronous Operation '${handle.id}' Initiated via Workflow.StartWorkflowAsync. Ongoing operation handle returned immediately.`);
  };

  // 4. Start Asynchronous Operation returning Completion Object (Task wrapper) via startAsync
  const handleStartAsyncCompletion = async () => {
    if (!name.trim()) return;
    setStatus('Starting Async Operation returning completion Task and Result Wrapper via startAsync()...');
    setResult('');
    setProgress(0);
    setProgressLog('Initializing async task completion...');
    setCallbackNotification(null);
    setIsLoading(true);
    setTaskState('PENDING');

    try {
      // Call ISayHelloNexusService.startAsync returning NexusTaskCompletion
      const completion = await globalNexusService.startAsync(
        { name: name.trim(), triggerErrorMode: forceError },
        { callbackUrl: 'https://example.com/api/nexus/callback' }
      );

      setActiveCompletion(completion);
      setActiveResultWrapper(completion.resultWrapper || null);
      setStatus(`Async Operation '${completion.operationId}' started. Received completion object (Task wrapper). Poll URL: ${completion.pollUrl}`);
      
      const handle = globalNexusService.createOperationHandle<any, any>(completion.operationId);
      setActiveHandle(handle);

      // Await task completion directly on the returned completion object
      completion.task.then((output) => {
        setResult(output.greeting);
        setTaskState('RESOLVED');
        setStatus(`Completion Task resolved successfully! Op ID: ${completion.operationId}`);
        pollCurrentHandle(handle);
      }).catch((err) => {
        setTaskState('REJECTED');
        setStatus(`Completion Task rejected: ${err.message}`);
        pollCurrentHandle(handle);
      }).finally(() => {
        setIsLoading(false);
      });
    } catch (err: any) {
      setTaskState('REJECTED');
      setStatus(`Start error: ${err.message}`);
      setIsLoading(false);
    }
  };

  // 5. Extended interface method: startAsyncOperation returning completion Task and result wrapper
  const handleStartAsyncOperation = async () => {
    if (!name.trim()) return;
    setStatus('Invoking ISayHelloNexusService.startAsyncOperation() interface method...');
    setResult('');
    setProgress(0);
    setProgressLog('Invoking startAsyncOperation returning Task completion and Result Wrapper...');
    setCallbackNotification(null);
    setIsLoading(true);
    setTaskState('PENDING');

    try {
      const completion = await globalNexusService.startAsyncOperation<SayHelloInput, SayHelloOutput>(
        { name: name.trim(), triggerErrorMode: forceError },
        { callbackUrl: 'https://example.com/api/nexus/callback' }
      );

      setActiveCompletion(completion);
      setActiveResultWrapper(completion.resultWrapper || null);
      setStatus(`Long-running operation '${completion.operationId}' initiated via startAsyncOperation(). Poll URL: ${completion.pollUrl}`);

      const handle = globalNexusService.createOperationHandle<any, any>(completion.operationId);
      setActiveHandle(handle);

      completion.task.then((output) => {
        setResult(output.greeting);
        setTaskState('RESOLVED');
        setStatus(`Completion Task resolved! Greeting received from '${completion.operationId}'`);
        pollCurrentHandle(handle);
      }).catch((err) => {
        setTaskState('REJECTED');
        setStatus(`Completion Task rejected: ${err.message}`);
        pollCurrentHandle(handle);
      }).finally(() => {
        setIsLoading(false);
      });
    } catch (err: any) {
      setTaskState('REJECTED');
      setStatus(`startAsyncOperation error: ${err.message}`);
      setIsLoading(false);
    }
  };

  // 6. Extended interface method: startLongRunningProcess returning NexusOperationResultWrapper
  const handleStartLongRunningProcess = async () => {
    if (!name.trim()) return;
    setStatus('Invoking ISayHelloNexusService.startLongRunningProcess() returning Result Wrapper...');
    setResult('');
    setProgress(0);
    setProgressLog('Starting long-running process wrapper...');
    setCallbackNotification(null);
    setIsLoading(true);
    setTaskState('PENDING');

    try {
      const wrapper = await globalNexusService.startLongRunningProcess(
        { name: name.trim(), triggerErrorMode: forceError },
        { callbackUrl: 'https://example.com/api/nexus/callback' }
      );

      setActiveResultWrapper(wrapper);
      const handle = globalNexusService.createOperationHandle<any, any>(wrapper.operationId);
      setActiveHandle(handle);

      setStatus(`Long-running process wrapper started: '${wrapper.operationId}'. Awaiting unwrapping or polling...`);

      wrapper.completionTask.then((output) => {
        setResult(output.greeting);
        setTaskState('RESOLVED');
        setStatus(`Result wrapper completed successfully! Op ID: ${wrapper.operationId}`);
        pollCurrentHandle(handle);
      }).catch((err) => {
        setTaskState('REJECTED');
        setStatus(`Result wrapper faulted: ${err.message}`);
        pollCurrentHandle(handle);
      }).finally(() => {
        setIsLoading(false);
      });
    } catch (err: any) {
      setTaskState('REJECTED');
      setStatus(`startLongRunningProcess error: ${err.message}`);
      setIsLoading(false);
    }
  };

  // Cancel handle operation
  const handleCancelOperation = async () => {
    if (activeHandle) {
      try {
        await activeHandle.cancelAsync();
        setStatus(`Operation '${activeHandle.id}' cancellation requested.`);
        await pollCurrentHandle(activeHandle);
      } catch (err: any) {
        setStatus(`Cancellation error: ${err.message}`);
      }
    }
  };

  // Await handle completion
  const handleAwaitCompletion = async () => {
    if (!activeHandle) return;
    try {
      setIsLoading(true);
      setStatus(`Awaiting completion of '${activeHandle.id}'...`);
      const res = await activeHandle.awaitCompletionAsync(300);
      setResult(res.greeting);
      setStatus(`Operation '${activeHandle.id}' completed via awaitCompletionAsync().`);
      await pollCurrentHandle(activeHandle);
    } catch (err: any) {
      setStatus(`Await error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-8 p-6 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl relative z-10 text-neutral-200">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-serif text-cyan-400 flex items-center gap-3">
            <Zap className="w-6 h-6 text-cyan-400" />
            ISayHelloNexusService & Asynchronous Operations
          </h2>
          <p className="text-sm text-neutral-400 font-serif italic mt-1">
            Demonstrates asynchronous operations using <code className="text-cyan-300 font-mono text-xs">Workflow.StartWorkflowAsync</code> returning an <code className="text-purple-300 font-mono text-xs">IOperationHandle</code>, real-time status polling, callbacks, and graceful cancellation.
          </p>
        </div>
        <span className="px-3 py-1 bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-mono rounded-full flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          Nexus Service Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input & Action Panel */}
        <div className="space-y-4 bg-neutral-950 p-5 rounded-lg border border-neutral-800">
          <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            Operation Parameters
          </h3>

          <div>
            <label className="block text-xs text-neutral-400 mb-1 font-mono uppercase tracking-wider">Target Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter target seeker name..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-4 py-2 text-neutral-200 focus:outline-none focus:border-cyan-500 transition-colors font-sans text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-400 mb-1 font-mono uppercase tracking-wider">Exception Simulation</label>
            <select
              value={forceError}
              onChange={(e) => setForceError(e.target.value as any)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-4 py-2 text-neutral-200 focus:outline-none focus:border-cyan-500 transition-colors font-sans text-sm"
            >
              <option value="none">None (Normal Successful Execution)</option>
              <option value="retryable">RetryableError (Simulate transient network glitch)</option>
              <option value="non_retryable">NonRetryableError (Simulate invalid format fault)</option>
            </select>
          </div>

          <div className="pt-2 border-t border-neutral-800/80 flex flex-col gap-2">
            <p className="text-xs text-neutral-500 font-mono">Invocation Modes:</p>

            <button
              type="button"
              onClick={handleStartWorkflowAsync}
              disabled={!name.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 hover:from-cyan-600/30 hover:to-purple-600/30 text-cyan-300 border border-cyan-500/40 rounded transition-all font-mono uppercase text-xs tracking-wider shadow-lg font-semibold cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Start Workflow Async (<code className="lowercase font-mono text-xs">Workflow.StartWorkflowAsync</code>)
            </button>

            <button
              type="button"
              onClick={handleStartAsyncOperation}
              disabled={isLoading || !name.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 text-emerald-300 border border-emerald-500/40 rounded transition-all font-mono uppercase text-xs tracking-wider shadow-lg font-semibold cursor-pointer"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              startAsyncOperation() — Return Completion Task
            </button>

            <button
              type="button"
              onClick={handleStartLongRunningProcess}
              disabled={isLoading || !name.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600/20 to-orange-600/20 hover:from-amber-600/30 hover:to-orange-600/30 text-amber-300 border border-amber-500/40 rounded transition-all font-mono uppercase text-xs tracking-wider shadow-lg font-semibold cursor-pointer"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              startLongRunningProcess() — Return Result Wrapper
            </button>

            <button
              type="button"
              onClick={handleStartAsyncCompletion}
              disabled={isLoading || !name.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 hover:from-teal-600/30 hover:to-cyan-600/30 text-teal-300 border border-teal-500/40 rounded transition-all font-mono uppercase text-xs tracking-wider shadow-lg font-semibold cursor-pointer"
            >
              <Zap className="w-4 h-4 text-teal-400" />
              startAsync() — Return Task Wrapper
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleInvokeActivityAsync}
                disabled={isLoading || !name.trim()}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-900/20 hover:bg-purple-900/40 text-purple-300 border border-purple-800/50 rounded transition-colors font-mono uppercase text-xs tracking-wider disabled:opacity-50 cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5 text-purple-400" />
                sayHelloAsync()
              </button>

              <button
                type="button"
                onClick={handleInvokeSync}
                disabled={isLoading || !name.trim()}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 rounded transition-colors font-mono uppercase text-xs tracking-wider disabled:opacity-50 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                sayHello() Sync
              </button>
            </div>
          </div>
        </div>

        {/* Active IOperationHandle Inspector Panel */}
        <div className="bg-neutral-950 p-5 rounded-lg border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
              <h3 className="text-sm font-mono text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Active Operation Handle
              </h3>
              {activeHandle && (
                <span className="font-mono text-xs text-neutral-500">
                  ID: <span className="text-cyan-300">{activeHandle.id}</span>
                </span>
              )}
            </div>

            {activeHandle ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono bg-neutral-900/80 p-3 rounded border border-neutral-800">
                  <span className="text-neutral-400">Status State:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded font-bold uppercase ${
                      handleStatus?.state === 'SUCCEEDED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : handleStatus?.state === 'FAILED'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : handleStatus?.state === 'CANCELED'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-cyan-950 text-cyan-400 border border-cyan-800 animate-pulse'
                    }`}
                  >
                    {handleStatus?.state || activeHandle.status}
                  </span>
                </div>

                {handleStatus && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-neutral-400">
                      <span>Progress</span>
                      <span>{handleStatus.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${handleStatus.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Log Trace Terminal */}
                {handleStatus?.logTrace && handleStatus.logTrace.length > 0 && (
                  <div className="bg-neutral-900/90 p-3 rounded border border-neutral-800 font-mono text-xs max-h-36 overflow-y-auto space-y-1 text-neutral-300">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-widest border-b border-neutral-800 pb-1 mb-1">
                      Execution Log Trace
                    </div>
                    {handleStatus.logTrace.map((log, idx) => (
                      <div key={idx} className="text-neutral-300 leading-relaxed font-mono">
                        {log}
                      </div>
                    ))}
                  </div>
                )}

                {/* Handle Control Actions */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <button
                    onClick={() => pollCurrentHandle(activeHandle)}
                    disabled={isPolling}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 rounded text-xs font-mono uppercase cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isPolling ? 'animate-spin text-cyan-400' : ''}`} />
                    Poll Status
                  </button>

                  <button
                    onClick={handleAwaitCompletion}
                    disabled={handleStatus?.state === 'SUCCEEDED' || handleStatus?.state === 'FAILED' || handleStatus?.state === 'CANCELED'}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-800/60 rounded text-xs font-mono uppercase disabled:opacity-40 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    Await Result
                  </button>

                  <button
                    onClick={handleCancelOperation}
                    disabled={handleStatus?.state === 'SUCCEEDED' || handleStatus?.state === 'FAILED' || handleStatus?.state === 'CANCELED'}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/60 rounded text-xs font-mono uppercase disabled:opacity-40 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-500 font-serif italic text-sm border border-dashed border-neutral-800 rounded">
                Click &quot;Start Workflow Async&quot; to launch an asynchronous operation returning an active handle.
              </div>
            )}
          </div>

          {/* Callback Notification Toast */}
          {callbackNotification && (
            <div className="mt-3 p-3 bg-cyan-950/60 border border-cyan-800/80 rounded flex items-center gap-2 text-xs font-mono text-cyan-300">
              <Bell className="w-4 h-4 text-cyan-400 shrink-0 animate-bounce" />
              <span>{callbackNotification}</span>
            </div>
          )}
        </div>
      </div>

      {/* Completion Task & Result Wrapper Inspector Card */}
      {(activeCompletion || activeResultWrapper) && (
        <div className="mt-6 p-5 rounded-lg bg-neutral-950 border border-emerald-900/60 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Nexus Asynchronous Operation Task & Result Wrapper Inspector
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-neutral-400">Task State:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                taskState === 'RESOLVED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                taskState === 'REJECTED' ? 'bg-red-950 text-red-300 border border-red-700' :
                taskState === 'PENDING' ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 animate-pulse' :
                'bg-neutral-800 text-neutral-400'
              }`}>
                {taskState}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-neutral-900/90 p-2.5 rounded border border-neutral-800">
              <span className="text-neutral-500 block text-[10px] uppercase">Operation ID</span>
              <span className="text-cyan-300 truncate block">{activeCompletion?.operationId || activeResultWrapper?.operationId}</span>
            </div>
            <div className="bg-neutral-900/90 p-2.5 rounded border border-neutral-800">
              <span className="text-neutral-500 block text-[10px] uppercase">isCompleted</span>
              <span className={activeResultWrapper?.isCompleted ? 'text-emerald-400' : 'text-neutral-400'}>
                {String(activeResultWrapper?.isCompleted ?? false)}
              </span>
            </div>
            <div className="bg-neutral-900/90 p-2.5 rounded border border-neutral-800">
              <span className="text-neutral-500 block text-[10px] uppercase">isSuccess / isFaulted</span>
              <span className="text-neutral-300">
                {String(activeResultWrapper?.isSuccess ?? false)} / {String(activeResultWrapper?.isFaulted ?? false)}
              </span>
            </div>
            <div className="bg-neutral-900/90 p-2.5 rounded border border-neutral-800">
              <span className="text-neutral-500 block text-[10px] uppercase">isCanceled</span>
              <span className={activeResultWrapper?.isCanceled ? 'text-amber-400' : 'text-neutral-400'}>
                {String(activeResultWrapper?.isCanceled ?? false)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {activeResultWrapper && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    setStatus(`Unwrapping Result Wrapper for '${activeResultWrapper.operationId}'...`);
                    const unwrapped = await activeResultWrapper.unwrap();
                    setResult(unwrapped.greeting);
                    setStatus(`Result unwrapped successfully!`);
                  } catch (err: any) {
                    setStatus(`Unwrap error: ${err.message}`);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/80 rounded text-xs font-mono uppercase cursor-pointer"
              >
                Unwrap Result (resultWrapper.unwrap())
              </button>
            )}

            {activeCompletion && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    setStatus(`Awaiting completion.task for '${activeCompletion.operationId}'...`);
                    const out = await activeCompletion.task;
                    setResult(out.greeting);
                    setStatus(`Task resolved with greeting!`);
                  } catch (err: any) {
                    setStatus(`Task await error: ${err.message}`);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="px-3 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/80 rounded text-xs font-mono uppercase cursor-pointer"
              >
                Await Task (completion.task)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar for sayHelloAsync */}
      {progress > 0 && progress < 100 && !activeHandle && (
        <div className="mt-6 p-4 rounded-lg bg-neutral-950 border border-neutral-800">
          <div className="flex justify-between items-center text-xs font-mono text-purple-400 mb-2">
            <span>Workflow.ExecuteActivityAsync Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-xs font-mono text-neutral-400 truncate">{progressLog}</div>
        </div>
      )}

      {/* Status & Result Banner */}
      {(status || result) && (
        <div className="mt-6 pt-6 border-t border-neutral-800">
          <h4 className="text-xs text-neutral-500 font-mono uppercase tracking-widest mb-2">Service Response & Outcome</h4>
          
          {status && (
            <div
              className={`p-3.5 rounded-lg font-mono text-xs border ${
                status.includes('Error') || status.includes('Fault')
                  ? 'bg-red-950/40 border-red-900/60 text-red-400'
                  : status.includes('Cancelled')
                  ? 'bg-amber-950/40 border-amber-900/60 text-amber-400'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-300'
              }`}
            >
              {status}
            </div>
          )}

          {result && (
            <div className="mt-3 p-4 rounded-lg font-serif text-base bg-cyan-950/30 border border-cyan-900/60 text-cyan-200 shadow-inner flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] font-mono uppercase text-cyan-400 tracking-wider mb-1">Returned Greeting Payload</span>
                {result}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
