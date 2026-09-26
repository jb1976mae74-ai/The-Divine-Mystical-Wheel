/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Play, 
  Trash2, 
  Compass, 
  RefreshCw, 
  Sliders, 
  Terminal, 
  Info, 
  Hourglass, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  AlertTriangle,
  ArrowRight, 
  Webhook, 
  Loader2, 
  Copy, 
  Check,
  Layers
} from 'lucide-react';
import { 
  globalNexusService, 
  AethericTransmutationOperation, 
  ResonantVesselRefiningOperation,
  ScripturalDecryptionOperation, 
  SayHelloOperation,
  WorkflowCallbackOperationHandler,
  OperationInfo, 
  OperationState, 
  TransmutationInput, 
  RefiningInput,
  RefiningOutput,
  DecryptionInput,
  SayHelloInput,
  WorkflowCallbackInput,
  WorkflowCompletionOperationHandler,
  WorkflowCompletionInput,
  WorkflowCompletionOutput,
  NexusOperationException,
  WorkflowSimulation,
  WorkflowSimulationStep
} from '../utils/nexusService';
import DotNetSdkReference from './DotNetSdkReference';
import NexusServiceDemo from './NexusServiceDemo';

interface TemporalNexusSanctumProps {
  activeTheme: {
    id: string;
    textPrimary: string;
    textAccent: string;
    textAccentHex: string;
    accentGradient: string;
    borderAccent: string;
    borderAccentSemi: string;
    accentGlow: string;
  };
}

export default function TemporalNexusSanctum({ activeTheme }: TemporalNexusSanctumProps) {
  // Config state
  const [showServiceDemo, setShowServiceDemo] = useState(false);
  const [selectedOp, setSelectedOp] = useState<'transmute' | 'resonantrefining' | 'decrypt' | 'sayhello' | 'workflowcallback' | 'workflowcompletion'>('transmute');
  const [completionTargetState, setCompletionTargetState] = useState('COMPLETED');
  const [executionMode, setExecutionMode] = useState<'async' | 'sync'>('async');
  const [notificationType, setNotificationType] = useState<'polling' | 'callback'>('polling');
  const [callbackUrl, setCallbackUrl] = useState('http://caller.internal/oracle-webhook');
  
  // Input parameters
  const [baseMaterial, setBaseMaterial] = useState('Lead ingot');
  const [massGrams, setMassGrams] = useState(120);
  const [targetResonance, setTargetResonance] = useState(2.1);

  // Refining parameters (custom error handling simulation)
  const [vesselType, setVesselType] = useState('Quartz Crucible');
  const [targetTemperature, setTargetTemperature] = useState(450);
  const [triggerErrorMode, setTriggerErrorMode] = useState<'none' | 'retryable' | 'non_retryable'>('retryable');
  const [allowTransientFluctuations, setAllowTransientFluctuations] = useState(true);

  // Workflow simulation state
  const [simulation, setSimulation] = useState<WorkflowSimulation | null>(null);
  const [isSimulatingWorkflow, setIsSimulatingWorkflow] = useState(false);
  const simBottomRef = useRef<HTMLDivElement | null>(null);
  
  const [fragmentText, setFragmentText] = useState('In silentium anima invenit Ein Sof...');
  const [language, setLanguage] = useState('Latin & Hebrew Gnostic Fragment');
  const [academicTradition, setAcademicTradition] = useState('Gnosticism & Kabbalah');

  const [helloName, setHelloName] = useState('Enosh the Seeker');
  const [helloLang, setHelloLang] = useState('Enochian / Celestial');

  const [workflowId, setWorkflowId] = useState('wf-spiritual-handshake-999');
  const [callbackToken, setCallbackToken] = useState('token-astar-7-lucifer');
  const [workflowPayload, setWorkflowPayload] = useState('{"message": "Durable star coordinates aligned", "glory": "power"}');

  // Runtime state
  const [operations, setOperations] = useState<OperationInfo[]>([]);
  const [activeOpId, setActiveOpId] = useState<string | null>(null);
  const [liveOpInfo, setLiveOpInfo] = useState<OperationInfo | null>(null);
  
  // Client polling state
  const [pollCount, setPollCount] = useState(0);
  const [pollLogs, setPollLogs] = useState<string[]>([]);
  const [isPollingActive, setIsPollingActive] = useState(false);
  
  // Callback listener state
  const [callbackReceivedPayload, setCallbackReceivedPayload] = useState<any | null>(null);
  const [callbackFlash, setCallbackFlash] = useState(false);

  // General state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const consoleBottomRef = useRef<HTMLDivElement | null>(null);

  // Sync operations list on load
  useEffect(() => {
    setOperations(globalNexusService.listOperations());
  }, []);

  // Scroll to bottom of active console
  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [liveOpInfo?.logTrace, pollLogs]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Update operations list and current active op status
  const refreshStatus = () => {
    setOperations(globalNexusService.listOperations());
    if (activeOpId) {
      const info = globalNexusService.getOperationInfo(activeOpId);
      setLiveOpInfo(info);
      
      if (info && (info.state === 'SUCCEEDED' || info.state === 'FAILED' || info.state === 'CANCELED')) {
        setIsPollingActive(false);
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      }
    }
  };

  // Trigger operation execution
  const handleExecute = async () => {
    setErrorMsg(null);
    // Reset previous client listeners
    setCallbackReceivedPayload(null);
    setPollLogs([]);
    setPollCount(0);
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    if (selectedOp === 'decrypt' && !fragmentText.trim()) {
      setErrorMsg("Cannot decrypt empty scriptural fragments.");
      return;
    }

    if (selectedOp === 'workflowcallback' && !workflowId.trim()) {
      setErrorMsg("Workflow ID cannot be empty for WorkflowCallback operation.");
      return;
    }

    if (selectedOp === 'workflowcompletion' && !workflowId.trim()) {
      setErrorMsg("Workflow ID cannot be empty for WorkflowCompletion operation.");
      return;
    }

    const options = {
      isAsync: executionMode === 'async',
      callbackUrl: notificationType === 'callback' ? callbackUrl : undefined,
      requestId: `req-${Math.random().toString(36).substring(2, 8)}`
    };

    try {
      let result;

      // When callback is triggered, the service triggers this handler simulating an HTTP POST request
      const handleCallbackDispatch = (payload: any) => {
        setCallbackReceivedPayload(payload);
        setCallbackFlash(true);
        setTimeout(() => setCallbackFlash(false), 2000);
        refreshStatus();
      };

      if (selectedOp === 'transmute') {
        const input: TransmutationInput = { baseMaterial, massGrams, targetResonance };
        result = await globalNexusService.startOperation(
          AethericTransmutationOperation, 
          input, 
          options, 
          handleCallbackDispatch
        );
      } else if (selectedOp === 'resonantrefining') {
        const input: RefiningInput = { vesselType, targetTemperature, triggerErrorMode, allowTransientFluctuations };
        result = await globalNexusService.startOperation(
          ResonantVesselRefiningOperation, 
          input, 
          options, 
          handleCallbackDispatch
        );
      } else if (selectedOp === 'decrypt') {
        const input: DecryptionInput = { fragmentText, language, academicTradition };
        result = await globalNexusService.startOperation(
          ScripturalDecryptionOperation, 
          input, 
          options, 
          handleCallbackDispatch
        );
      } else if (selectedOp === 'sayhello') {
        const input: SayHelloInput = { name: helloName, language: helloLang, triggerErrorMode };
        result = await globalNexusService.startSayHello(
          input,
          options,
          handleCallbackDispatch
        );
      } else if (selectedOp === 'workflowcompletion') {
        const input: WorkflowCompletionInput = { workflowId, targetState: completionTargetState };
        result = await globalNexusService.startWorkflowCompletion(
          input,
          options,
          handleCallbackDispatch
        );
      } else {
        const input: WorkflowCallbackInput = { workflowId, callbackToken, payload: workflowPayload };
        result = await globalNexusService.startWorkflowCallback(
          input,
          options,
          handleCallbackDispatch
        );
      }

      setActiveOpId(result.id);
      
      // Initialize states instantly
      const info = globalNexusService.getOperationInfo(result.id);
      setLiveOpInfo(info);
      setOperations(globalNexusService.listOperations());

      // If finished instantly (synchronous)
      if (result.state === 'SUCCEEDED') {
        setPollLogs(prev => [...prev, `[Client] Operation completed instantly in Synchronous mode. Retrieved result immediately.`]);
        return;
      }

      // If asynchronous, start client-side polling monitor if set to polling
      if (executionMode === 'async') {
        if (notificationType === 'polling') {
          setIsPollingActive(true);
          setPollLogs([`[Client] Operation started asynchronously. Commencing client polling loop...`]);
          let localPollCount = 0;
          
          pollIntervalRef.current = setInterval(() => {
            localPollCount++;
            setPollCount(localPollCount);
            
            const currentInfo = globalNexusService.getOperationInfo(result.id);
            if (currentInfo) {
              setLiveOpInfo(currentInfo);
              setPollLogs(prev => [
                ...prev, 
                `[Client Poll #${localPollCount}] GET /api/operations/${result.id} -> Status: ${currentInfo.state} (${currentInfo.progress}%)`
              ]);

              if (currentInfo.state === 'SUCCEEDED' || currentInfo.state === 'FAILED' || currentInfo.state === 'CANCELED') {
                const finalResult = globalNexusService.getOperationResult(result.id);
                setPollLogs(prev => [
                  ...prev,
                  `[Client] Operation reached terminal state '${currentInfo.state}'. Fetched final results successfully. Polling ended.`
                ]);
                setIsPollingActive(false);
                if (pollIntervalRef.current) {
                  clearInterval(pollIntervalRef.current);
                }
                setOperations(globalNexusService.listOperations());
              }
            } else {
              setIsPollingActive(false);
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
              }
            }
          }, 1000);
        } else {
          // Callback notification mode
          setPollLogs([
            `[Client] Operation started asynchronously. Polling inactive. Waiting for server Callback webhook to hit ${callbackUrl}...`
          ]);
        }

        // Setup real-time listener to update progress visually in UI (combining with polling interval simulation)
        const uiSyncTimer = setInterval(() => {
          const currentInfo = globalNexusService.getOperationInfo(result.id);
          if (currentInfo) {
            setLiveOpInfo(currentInfo);
            setOperations(globalNexusService.listOperations());
            if (currentInfo.state === 'SUCCEEDED' || currentInfo.state === 'FAILED' || currentInfo.state === 'CANCELED') {
              clearInterval(uiSyncTimer);
            }
          } else {
            clearInterval(uiSyncTimer);
          }
        }, 300);
      }

    } catch (err: any) {
      console.warn(err);
      if (err.name === 'NexusRetryableException') {
        const backoffStr = err.backoffDelayMs ? ` [Recommended Backoff: ${err.backoffDelayMs}ms]` : '';
        setErrorMsg(`[NexusRetryableException - Transient Error] ${err.message}${backoffStr}`);
      } else if (err.name === 'NexusNonRetryableException') {
        setErrorMsg(`[NexusNonRetryableException - Fatal Error] ${err.message}`);
      } else if (err instanceof NexusOperationException || err.name === 'NexusOperationException') {
        const detailsStr = err.details ? ` (Details: ${JSON.stringify(err.details)})` : '';
        setErrorMsg(`[NexusOperationException] ${err.message}${detailsStr}`);
      } else {
        setErrorMsg(`Nexus operation start failed: ${err.message}`);
      }
    }
  };

  // Trigger Caller Workflow Simulation
  const handleExecuteSimulation = async () => {
    setErrorMsg(null);
    setSimulation(null);
    setIsSimulatingWorkflow(true);

    try {
      if (selectedOp === 'sayhello') {
        const input: SayHelloInput = {
          name: helloName,
          language: helloLang,
          triggerErrorMode
        };

        await globalNexusService.startWorkflowSimulation(
          input, 
          (updatedSim) => {
            setSimulation(updatedSim);
            setOperations(globalNexusService.listOperations());
            
            // Auto-scroll simulation logger
            setTimeout(() => {
              if (simBottomRef.current) {
                simBottomRef.current.scrollIntoView({ behavior: 'smooth' });
              }
            }, 50);

            if (updatedSim.status === 'COMPLETED' || updatedSim.status === 'FAILED') {
              setIsSimulatingWorkflow(false);
            }
          },
          'SayHello',
          notificationType,
          callbackUrl
        );
      } else {
        const input: RefiningInput = {
          vesselType,
          targetTemperature,
          triggerErrorMode,
          allowTransientFluctuations
        };

        await globalNexusService.startWorkflowSimulation(
          input, 
          (updatedSim) => {
            setSimulation(updatedSim);
            setOperations(globalNexusService.listOperations());
            
            // Auto-scroll simulation logger
            setTimeout(() => {
              if (simBottomRef.current) {
                simBottomRef.current.scrollIntoView({ behavior: 'smooth' });
              }
            }, 50);

            if (updatedSim.status === 'COMPLETED' || updatedSim.status === 'FAILED') {
              setIsSimulatingWorkflow(false);
            }
          },
          'ResonantVesselRefining',
          notificationType,
          callbackUrl
        );
      }
    } catch (err: any) {
      setErrorMsg(`Simulation initiation failed: ${err.message}`);
      setIsSimulatingWorkflow(false);
    }
  };

  // Trigger cancel command (async/await)
  const handleCancel = async (opId: string) => {
    try {
      await globalNexusService.cancelOperation(opId);
      refreshStatus();
      setPollLogs(prev => [...prev, `[Client] Cancellation command dispatched successfully for operation: ${opId}`]);
    } catch (err: any) {
      setErrorMsg(`Failed to cancel operation: ${err.message}`);
    }
  };

  const handleClearHistory = () => {
    globalNexusService.clearOperations();
    setOperations([]);
    setActiveOpId(null);
    setLiveOpInfo(null);
    setPollLogs([]);
    setCallbackReceivedPayload(null);
    setIsPollingActive(false);
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getStatusStyle = (state?: OperationState) => {
    switch (state) {
      case 'SUCCEEDED':
        return { text: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', glow: 'shadow-emerald-500/10', icon: CheckCircle2 };
      case 'FAILED':
        return { text: 'text-rose-400 bg-rose-500/10 border-rose-500/30', glow: 'shadow-rose-500/10', icon: XCircle };
      case 'CANCELED':
        return { text: 'text-amber-400 bg-amber-500/10 border-amber-500/30', glow: 'shadow-amber-500/10', icon: AlertCircle };
      case 'RUNNING':
        return { text: 'text-violet-400 bg-violet-500/10 border-violet-500/30 animate-pulse', glow: 'shadow-violet-500/10', icon: Loader2 };
      default:
        return { text: 'text-slate-400 bg-slate-500/10 border-slate-500/30', glow: 'shadow-slate-500/10', icon: Hourglass };
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      
      {/* Educational Concept Header */}
      <section className={`rounded-2xl border ${activeTheme.borderAccent} bg-black/40 backdrop-blur-md p-6 flex flex-col md:flex-row gap-6 items-center shadow-xl`}>
        <div className={`p-4 rounded-xl bg-gradient-to-br ${activeTheme.accentGradient} text-black shrink-0 shadow-lg`}>
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-serif font-bold tracking-wider text-slate-100 flex items-center gap-2">
              TEMPORAL NEXUS SERVICE SANCTUM
              <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded-full border border-teal-500/30 text-teal-400 bg-teal-500/5 uppercase">ASYNCHRONOUS ENGINE</span>
            </h2>
            <button
              type="button"
              onClick={() => setShowServiceDemo(!showServiceDemo)}
              className="px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 font-mono text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>{showServiceDemo ? 'Hide Service Definition Demo' : 'Live INexusServiceDefinition Async Demo'}</span>
            </button>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed font-sans">
            A **Temporal Nexus** allows services in different namespaces, clusters, or organizations to communicate using strictly-typed API endpoints. Because cross-service operations (like heavy scriptural decoding or massive physical transmutations) can take hours, they **MUST** support **asynchronous workflows**. 
            This interactive dashboard demonstrates how handlers use <code className="text-amber-400 font-mono text-xs font-bold">async/await</code>, returns PENDING tokens, and exposes state polling or webhook callback webhooks to let clients safely wait for completion without blocking resources.
          </p>
        </div>
      </section>

      {/* Embedded Live INexusServiceDefinition Demo Panel */}
      {showServiceDemo && (
        <section className="w-full">
          <NexusServiceDemo />
        </section>
      )}

      {/* Main Panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Configuration Form (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className={`rounded-xl border ${activeTheme.borderAccent} bg-[#141416]/95 p-6 shadow-xl flex flex-col gap-6`}>
            
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Sliders className={`w-4 h-4 ${activeTheme.textAccent}`} />
              <h3 className="text-sm font-serif font-semibold text-slate-200 tracking-wide">OPERATION PARAMETERS</h3>
            </div>

            {/* Operation Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-serif text-slate-400">SELECT CONTRACT OPERATION</label>
              <div className="grid grid-cols-2 gap-1.5 bg-black/30 p-1 rounded-lg border border-white/5 text-[10px] font-serif">
                <button
                  type="button"
                  onClick={() => { setSelectedOp('transmute'); setErrorMsg(null); }}
                  className={`py-1.5 px-1 rounded-md transition-all cursor-pointer text-center ${
                    selectedOp === 'transmute'
                      ? 'bg-amber-500/15 text-[#D4AF37] border border-[#D4AF37]/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Transmutation
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedOp('decrypt'); setErrorMsg(null); }}
                  className={`py-1.5 px-1 rounded-md transition-all cursor-pointer text-center ${
                    selectedOp === 'decrypt'
                      ? 'bg-violet-500/15 text-[#c084fc] border border-[#c084fc]/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Decryption
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedOp('sayhello'); setErrorMsg(null); }}
                  className={`py-1.5 px-1 rounded-md transition-all cursor-pointer text-center ${
                    selectedOp === 'sayhello'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  SayHello Async
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedOp('workflowcallback'); setErrorMsg(null); }}
                  className={`py-1.5 px-1 rounded-md transition-all cursor-pointer text-center ${
                    selectedOp === 'workflowcallback'
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Workflow Callback
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedOp('workflowcompletion'); setErrorMsg(null); }}
                  className={`col-span-2 py-1.5 px-1 rounded-md transition-all cursor-pointer text-center ${
                    selectedOp === 'workflowcompletion'
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Workflow Completion
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedOp('resonantrefining'); setErrorMsg(null); }}
                  className={`col-span-2 py-2 px-1 rounded-md transition-all cursor-pointer text-center ${
                    selectedOp === 'resonantrefining'
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200 bg-white/[0.02]'
                  }`}
                >
                  Crucible Refining (Error Propagation & Retries)
                </button>
              </div>
            </div>

            {/* Selected Operation Inputs */}
            {selectedOp === 'transmute' ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-500">BASE MATERIAL</label>
                    <select
                      value={baseMaterial}
                      onChange={(e) => setBaseMaterial(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500/50"
                    >
                      <option value="Lead ingot">Lead Ore (Heavy)</option>
                      <option value="Iron coil">Iron Coil (Rigid)</option>
                      <option value="Quicksilver mass">Quicksilver Fluid</option>
                      <option value="Meteorite scrap">Star Meteorite Ore</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-500">WEIGHT (GRAMS)</label>
                    <input
                      type="number"
                      value={massGrams}
                      onChange={(e) => setMassGrams(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500">AETHERIC RESONANCE (SWR)</span>
                    <span className="text-amber-400 font-bold">{targetResonance.toFixed(1)} SWR</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="3.5"
                    step="0.1"
                    value={targetResonance}
                    onChange={(e) => setTargetResonance(parseFloat(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <span className="text-[9px] font-sans text-slate-500 italic">Adjusting antenna impedance to synchronize spiritual wave forms.</span>
                </div>
              </div>
            ) : selectedOp === 'resonantrefining' ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-500">VESSEL TYPE</label>
                    <select
                      value={vesselType}
                      onChange={(e) => setVesselType(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500/50"
                    >
                      <option value="Quartz Crucible">Quartz Crucible</option>
                      <option value="Zirconia Chamber">Zirconia Chamber</option>
                      <option value="Graphite Retort">Graphite Retort</option>
                      <option value="Obsidian Basin">Obsidian Basin</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-500">TARGET TEMP (°C)</label>
                    <input
                      type="number"
                      value={targetTemperature}
                      onChange={(e) => setTargetTemperature(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-rose-500/50"
                      placeholder="e.g. 450 (100-2000)"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-500">ERROR PROPAGATION MODE</label>
                  <select
                    value={triggerErrorMode}
                    onChange={(e) => setTriggerErrorMode(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500/50"
                  >
                    <option value="none">🟢 None (Success Path)</option>
                    <option value="retryable">🟡 NexusRetryableException (Transient, Auto-Retried)</option>
                    <option value="non_retryable">🔴 NexusNonRetryableException (Permanent, Fatal)</option>
                  </select>
                  <span className="text-[9px] font-sans text-rose-400/80 italic font-medium">
                    {triggerErrorMode === 'none' && "The operation will complete smoothly without any errors."}
                    {triggerErrorMode === 'retryable' && "Throws a transient exception. The Caller Workflow catches it, backs off, and retries."}
                    {triggerErrorMode === 'non_retryable' && "Throws a fatal structural fracture exception. Caller Workflow catches it and aborts."}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <input
                    type="checkbox"
                    id="allowTransient"
                    checked={allowTransientFluctuations}
                    onChange={(e) => setAllowTransientFluctuations(e.target.checked)}
                    className="rounded accent-rose-500 cursor-pointer"
                  />
                  <label htmlFor="allowTransient" className="text-[10px] font-sans text-slate-400 cursor-pointer select-none">
                    Allow vessel automatic safety cooling and thermal backoff stabilization
                  </label>
                </div>
              </div>
            ) : selectedOp === 'decrypt' ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-500">FRAGMENT SCRIPT</label>
                  <textarea
                    rows={2}
                    value={fragmentText}
                    onChange={(e) => setFragmentText(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-violet-500/50 resize-none font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-500">LANGUAGES</label>
                    <input
                      type="text"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-500">ACADEMIC TRADITION</label>
                    <input
                      type="text"
                      value={academicTradition}
                      onChange={(e) => setAcademicTradition(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                </div>
              </div>
            ) : selectedOp === 'sayhello' ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-500">TARGET NAME</label>
                  <input
                    type="text"
                    value={helloName}
                    onChange={(e) => setHelloName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50 font-serif"
                    placeholder="E.g. Enosh the Seeker"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-500">VOICE FREQUENCY LANGUAGE</label>
                  <input
                    type="text"
                    value={helloLang}
                    onChange={(e) => setHelloLang(e.target.value)}
                    className="w-full bg-[#1e1e24] bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
                    placeholder="E.g. Enochian / Celestial"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-500">ERROR PROPAGATION MODE</label>
                  <select
                    value={triggerErrorMode}
                    onChange={(e) => setTriggerErrorMode(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="none">🟢 None (Success Path)</option>
                    <option value="retryable">🟡 NexusRetryableException (Transient, Auto-Retried)</option>
                    <option value="non_retryable">🔴 NexusNonRetryableException (Permanent, Fatal)</option>
                  </select>
                  <span className="text-[9px] font-sans text-emerald-400/80 italic font-medium">
                    {triggerErrorMode === 'none' && "The SayHello operation will complete smoothly."}
                    {triggerErrorMode === 'retryable' && "Throws a transient Nexus error from SayHelloWorkflow. Caller workflow catches it and retries."}
                    {triggerErrorMode === 'non_retryable' && "Throws a fatal non-retryable error from SayHelloWorkflow. Caller workflow catches it and aborts."}
                  </span>
                </div>
              </div>
            ) : selectedOp === 'workflowcallback' ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-500">WORKFLOW ID</label>
                  <input
                    type="text"
                    value={workflowId}
                    onChange={(e) => setWorkflowId(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 font-mono"
                    placeholder="wf-durable-id-123"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-500">CALLBACK TOKEN</label>
                  <input
                    type="text"
                    value={callbackToken}
                    onChange={(e) => setCallbackToken(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 font-mono"
                    placeholder="token-astar-7-lucifer"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-500">PAYLOAD DATA</label>
                  <textarea
                    rows={2}
                    value={workflowPayload}
                    onChange={(e) => setWorkflowPayload(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 font-mono resize-none"
                    placeholder='{"message": "Aligning values"}'
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-500">MONITOR WORKFLOW ID</label>
                  <input
                    type="text"
                    value={workflowId}
                    onChange={(e) => setWorkflowId(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50 font-mono"
                    placeholder="wf-completion-target-456"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-500">EXPECTED TERMINAL STATE</label>
                  <select
                    value={completionTargetState}
                    onChange={(e) => setCompletionTargetState(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="COMPLETED">🟢 COMPLETED (Success State)</option>
                    <option value="FAILED">🔴 FAILED (Fault/Crash State)</option>
                    <option value="CANCELED">🟡 CANCELED (Graceful Termination)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Execution Configurations */}
            <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif text-slate-400">EXECUTION PATTERN</span>
                <div className="flex bg-black/30 p-0.5 rounded-lg border border-white/5 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setExecutionMode('sync')}
                    className={`px-2 py-1 rounded transition-all cursor-pointer ${
                      executionMode === 'sync' ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30' : 'text-slate-500'
                    }`}
                  >
                    Synchronous
                  </button>
                  <button
                    type="button"
                    onClick={() => setExecutionMode('async')}
                    className={`px-2 py-1 rounded transition-all cursor-pointer ${
                      executionMode === 'async' ? 'bg-violet-500/20 text-violet-200 border border-violet-500/30' : 'text-slate-500'
                    }`}
                  >
                    Asynchronous
                  </button>
                </div>
              </div>

              {executionMode === 'async' && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif text-slate-400">RESULT NOTIFICATION</span>
                    <div className="flex bg-black/30 p-0.5 rounded-lg border border-white/5 text-[10px] font-mono">
                      <button
                        type="button"
                        onClick={() => setNotificationType('polling')}
                        className={`px-2 py-1 rounded transition-all cursor-pointer ${
                          notificationType === 'polling' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-500'
                        }`}
                      >
                        Client Polling
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotificationType('callback')}
                        className={`px-2 py-1 rounded transition-all cursor-pointer ${
                          notificationType === 'callback' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-500'
                        }`}
                      >
                        Webhook Callback
                      </button>
                    </div>
                  </div>

                  {notificationType === 'callback' && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono text-slate-500">CALLBACK WEBHOOK URL</label>
                      <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] font-mono text-slate-400">
                        <Webhook className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                        <input
                          type="text"
                          value={callbackUrl}
                          onChange={(e) => setCallbackUrl(e.target.value)}
                          className="w-full bg-transparent border-none text-slate-300 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/5 text-red-400 text-xs font-sans flex items-start gap-2">
                <span className="font-semibold text-red-300">Error:</span>
                <span className="flex-1">{errorMsg}</span>
                <button 
                  type="button" 
                  onClick={() => setErrorMsg(null)} 
                  className="text-red-400 hover:text-red-300 font-bold ml-1 text-xs"
                >
                  ×
                </button>
              </div>
            )}

            {/* Execute Button */}
            {selectedOp === 'resonantrefining' || selectedOp === 'sayhello' ? (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleExecuteSimulation}
                  disabled={isSimulatingWorkflow}
                  className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${selectedOp === 'sayhello' ? 'from-emerald-500 to-teal-600 text-black font-bold' : 'from-rose-500 to-orange-600 text-white font-bold'} font-serif text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50`}
                >
                  {isSimulatingWorkflow ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Activity className="w-3.5 h-3.5" />
                  )}
                  <span>RUN CALLER WORKFLOW SIMULATION ({selectedOp === 'sayhello' ? 'SayHelloNexusServiceHandler' : 'RefiningHandler'})</span>
                </button>
                <button
                  type="button"
                  onClick={handleExecute}
                  disabled={isPollingActive}
                  className={`w-full py-2 rounded-xl bg-black/40 border ${selectedOp === 'sayhello' ? 'border-emerald-500/30 text-emerald-300' : 'border-rose-500/30 text-rose-300'} font-sans text-[10px] tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:bg-black/60 active:scale-[0.98] transition-all disabled:opacity-50`}
                >
                  {isPollingActive ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className={`w-2.5 h-2.5 ${selectedOp === 'sayhello' ? 'fill-emerald-300' : 'fill-rose-300'}`} />
                  )}
                  <span>Execute as Bare Nexus Operation</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleExecute}
                className={`w-full py-3 rounded-xl bg-gradient-to-r ${selectedOp === 'decrypt' ? 'from-violet-500 to-indigo-600' : selectedOp === 'workflowcallback' ? 'from-cyan-500 to-blue-600' : 'from-amber-500 to-amber-600'} text-black font-serif font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110 active:scale-[0.98] transition-all`}
              >
                {isPollingActive ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-black" />
                )}
                <span>EXECUTE CROSS-SERVICE OPERATION</span>
              </button>
            )}

          </div>
        </section>

        {/* Right Column: Execution Live Inspect (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Active Operation Status Panel */}
          <div className={`rounded-xl border ${activeTheme.borderAccent} bg-[#141416]/95 p-6 shadow-xl flex flex-col gap-4 relative overflow-hidden`}>
            
            {/* Background Accent glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-serif font-semibold text-slate-200 tracking-wide">LIVE OPERATION MONITOR</h3>
              </div>
              
              {liveOpInfo && (
                <span className="text-[10px] font-mono text-slate-500">ID: {liveOpInfo.id}</span>
              )}
            </div>

            {liveOpInfo ? (
              <div className="flex flex-col gap-5">
                
                {/* Status Indicator Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2.5">
                    {(() => {
                      const style = getStatusStyle(liveOpInfo.state);
                      const Icon = style.icon;
                      return (
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold uppercase tracking-wider shadow-inner ${style.text} ${style.glow}`}>
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span>{liveOpInfo.state}</span>
                        </div>
                      );
                    })()}
                    
                    <span className="text-xs font-serif text-slate-300 font-medium">
                      Operation: {liveOpInfo.name}
                    </span>
                  </div>

                  {/* Cancel Button */}
                  {(liveOpInfo.state === 'RUNNING' || liveOpInfo.state === 'PENDING') && (
                    <button
                      onClick={() => handleCancel(liveOpInfo.id)}
                      className="px-3 py-1 text-xs rounded-lg border border-rose-500/35 hover:border-rose-400 text-rose-400 hover:bg-rose-500/10 cursor-pointer font-serif transition-all"
                    >
                      Cancel Operation
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span>ENGINE PROCESS CYCLE</span>
                    <span className="text-slate-300 font-bold">{liveOpInfo.progress}%</span>
                  </div>
                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${liveOpInfo.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Final Result Render (if succeeded) */}
                {liveOpInfo.state === 'SUCCEEDED' && (
                  <div className="bg-emerald-500/5 border border-emerald-500/25 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xs font-serif font-semibold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>CONTRACT RESULT DISPATCHED SUCCESSFULLY</span>
                    </div>

                    {(() => {
                      const res = globalNexusService.getOperationResult(liveOpInfo.id);
                      if (!res) return null;
                      return (
                        <div className="grid grid-cols-1 gap-2 text-xs font-mono bg-black/40 p-3 rounded-lg border border-emerald-500/10 text-slate-300">
                          {liveOpInfo.name === 'AethericTransmutation' ? (
                            <>
                              <div><span className="text-emerald-500 font-bold">transmutedMaterial:</span> "{res.transmutedMaterial}"</div>
                              <div><span className="text-emerald-500 font-bold">goldYieldGrams:</span> {res.goldYieldGrams}g</div>
                              <div><span className="text-emerald-500 font-bold">purityPercent:</span> {res.purityPercent}% Fine Gold</div>
                              <div><span className="text-emerald-500 font-bold">aethericResonance:</span> {res.aethericResonance} SWR (Synchronized)</div>
                            </>
                          ) : liveOpInfo.name === 'ScripturalDecryption' ? (
                            <>
                              <div><span className="text-emerald-500 font-bold">decryptedText:</span> <span className="italic text-slate-200">"{res.decryptedText}"</span></div>
                              <div><span className="text-emerald-500 font-bold">confidenceScore:</span> {res.confidenceScore}% (Deep Hermeneutics Verification)</div>
                              <div><span className="text-emerald-500 font-bold">thematicCrossOver:</span> "{res.thematicCrossOver}"</div>
                            </>
                          ) : liveOpInfo.name === 'ResonantVesselRefining' ? (
                            <>
                              <div><span className="text-emerald-500 font-bold">purityCoefficient:</span> {res.purityCoefficient} ({(res.purityCoefficient * 100).toFixed(2)}%)</div>
                              <div><span className="text-emerald-500 font-bold">crystallizedEssenceGrams:</span> {res.crystallizedEssenceGrams}g of refined soul-essence</div>
                              <div><span className="text-emerald-500 font-bold">finalTemperature:</span> {res.finalTemperature}°C</div>
                            </>
                          ) : liveOpInfo.name === 'WorkflowCallback' ? (
                            <>
                              <div><span className="text-emerald-500 font-bold">status:</span> <span className="text-teal-400">"{res.status}"</span></div>
                              <div><span className="text-emerald-500 font-bold">acknowledgement:</span> <span className="text-slate-200">"{res.acknowledgement}"</span></div>
                              <div><span className="text-emerald-500 font-bold">processedAt:</span> <span className="text-slate-400">"{res.processedAt}"</span></div>
                            </>
                          ) : (
                            <>
                              <div><span className="text-emerald-500 font-bold">greeting:</span> <span className="italic text-slate-200">"{res.greeting}"</span></div>
                              <div><span className="text-emerald-500 font-bold">timestamp:</span> <span className="text-slate-400">"{res.timestamp}"</span></div>
                            </>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Live Client Receivers Panels (Polling Logs or Callback Webhooks) */}
                {executionMode === 'async' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    
                    {/* Polling client logs */}
                    <div className="flex flex-col gap-2 bg-black/20 p-3 rounded-lg border border-white/5 min-h-[140px]">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-serif tracking-wider text-slate-400 flex items-center gap-1">
                          <Compass className={`w-3.5 h-3.5 text-teal-400 ${isPollingActive ? 'animate-spin' : ''}`} />
                          CLIENT POLLING MONITOR
                        </span>
                        {isPollingActive && (
                          <span className="text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-teal-400/10 text-teal-400 animate-pulse uppercase">GET LOOP</span>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[150px] font-mono text-[9px] text-slate-400 scrollbar-thin">
                        {pollLogs.length === 0 ? (
                          <span className="text-slate-600 italic">No polling started. Client polling GET requests will render here in real-time.</span>
                        ) : (
                          pollLogs.map((log, idx) => (
                            <div key={idx} className="border-b border-white/[0.02] pb-0.5 last:border-0 leading-tight">
                              {log}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Callback Webhook post listener */}
                    <div className={`flex flex-col gap-2 p-3 rounded-lg border min-h-[140px] transition-all duration-500 ${
                      callbackFlash 
                        ? 'bg-fuchsia-500/10 border-fuchsia-400' 
                        : callbackReceivedPayload 
                        ? 'bg-fuchsia-500/5 border-fuchsia-500/20' 
                        : 'bg-black/20 border-white/5'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-serif tracking-wider text-slate-400 flex items-center gap-1">
                          <Webhook className="w-3.5 h-3.5 text-fuchsia-400" />
                          DISPATCHED CALLBACK LISTENER
                        </span>
                        {callbackReceivedPayload && (
                          <span className="text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-fuchsia-400/10 text-fuchsia-400 animate-pulse uppercase">POST 200 OK</span>
                        )}
                      </div>
                      <div className="flex-1 overflow-y-auto max-h-[150px] font-mono text-[9px] text-slate-400 leading-normal">
                        {callbackReceivedPayload ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-[8px] text-fuchsia-400 font-semibold">[POST /webhook Callback Dispatched]</span>
                            <pre className="text-slate-300 overflow-x-auto whitespace-pre-wrap leading-tight bg-black/40 p-2 rounded border border-fuchsia-500/10">
                              {JSON.stringify(callbackReceivedPayload, null, 2)}
                            </pre>
                          </div>
                        ) : (
                          <span className="text-slate-600 italic">Waiting for asynchronous callback. When operation completes, the service dispatches result HTTP POST payloads here.</span>
                        )}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 italic text-sm font-sans flex flex-col items-center justify-center gap-3">
                <Compass className="w-10 h-10 text-slate-700 animate-spin-slow" />
                <span>No active operation currently running. Define parameters on the left and hit Execute to spawn a Temporal Nexus cycle.</span>
              </div>
            )}

          </div>

          {/* Engine Terminal console trace */}
          {liveOpInfo && (
            <div className="rounded-xl border border-[#1e1b4b] bg-black/95 p-4 shadow-xl flex flex-col gap-2 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-white/5 pb-2 text-slate-400">
                <span className="text-[10px] tracking-widest text-violet-400 flex items-center gap-1.5 font-bold uppercase">
                  <Terminal className="w-3.5 h-3.5" />
                  TEMPORAL WORKER LOG TRACE
                </span>
                <button
                  onClick={() => copyToClipboard(liveOpInfo.logTrace.join('\n'), 'trace')}
                  className="p-1 hover:bg-white/5 rounded text-slate-500 hover:text-slate-350 flex items-center gap-1 text-[9px]"
                  title="Copy log trace to clipboard"
                >
                  {copiedId === 'trace' ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedId === 'trace' ? 'Copied!' : 'Copy Trace'}</span>
                </button>
              </div>
              <div className="max-h-[160px] overflow-y-auto flex flex-col gap-1 text-[10px] leading-relaxed text-slate-300 pr-1 scrollbar-thin">
                {liveOpInfo.logTrace.map((log, idx) => {
                  let textStyle = 'text-slate-300';
                  if (log.startsWith('[Error]')) textStyle = 'text-rose-400 font-bold';
                  else if (log.startsWith('[Nexus]')) textStyle = 'text-cyan-400';
                  else if (log.startsWith('[Worker]')) textStyle = 'text-indigo-400';
                  else if (log.startsWith('[Callback]')) textStyle = 'text-fuchsia-400';
                  else if (log.startsWith('[Transmutation]') || log.startsWith('[Decryption]')) textStyle = 'text-amber-300';
                  
                  return (
                    <div key={idx} className={`${textStyle} border-b border-white/[0.01] pb-0.5 last:border-0`}>
                      {log}
                    </div>
                  );
                })}
                <div ref={consoleBottomRef} />
              </div>
            </div>
          )}

          {/* Caller Workflow Simulation Console */}
          {simulation && (
            <div className="rounded-xl border border-rose-500/35 bg-black/95 p-4 shadow-xl flex flex-col gap-2 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-white/10 pb-2 text-slate-400">
                <span className="text-[10px] tracking-widest text-rose-400 flex items-center gap-1.5 font-bold uppercase">
                  <Activity className="w-3.5 h-3.5 text-rose-400" />
                  🎬 CALLER WORKFLOW: RESONENT-EXTRACTOR
                </span>
                <div className="flex items-center gap-3">
                  {simulation.status === 'RUNNING' ? (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-bold">
                      <Loader2 className="w-3 h-3 animate-spin text-rose-400" />
                      <span>RUNNING</span>
                    </div>
                  ) : simulation.status === 'COMPLETED' ? (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold font-sans">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>COMPLETED</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-bold font-sans">
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      <span>FAILED</span>
                    </div>
                  )}
                  <span className="text-[9px] text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded font-sans font-medium">
                    Attempt {simulation.currentAttempt}/{simulation.maxAttempts}
                  </span>
                </div>
              </div>

              <div className="max-h-[250px] overflow-y-auto flex flex-col gap-1.5 text-[10px] leading-relaxed text-slate-300 pr-1 scrollbar-thin">
                {simulation.steps.map((step, idx) => {
                  let textStyle = 'text-slate-400';
                  let prefix = '⚙️';
                  if (step.type === 'error') {
                    textStyle = 'text-red-400 font-bold bg-red-500/5 p-1.5 rounded border border-red-500/10';
                    prefix = '🚨';
                  } else if (step.type === 'warn') {
                    textStyle = 'text-amber-400 bg-amber-500/5 p-1.5 rounded border border-amber-500/10';
                    prefix = '⚠️';
                  } else if (step.type === 'success') {
                    textStyle = 'text-emerald-400 bg-emerald-500/5 p-1.5 rounded border border-emerald-500/10';
                    prefix = '🎉';
                  }

                  return (
                    <div key={idx} className={`${textStyle} leading-tight`}>
                      <span className="text-slate-600 mr-1.5 font-mono">[{step.timestamp}]</span>
                      <span className="mr-1">{prefix}</span>
                      <span>{step.message}</span>
                    </div>
                  );
                })}
                <div ref={simBottomRef} />
              </div>
            </div>
          )}

        </section>

      </div>

      {/* Bottom Row: Operations History (12 cols) */}
      <section className="w-full">
        <div className={`rounded-xl border ${activeTheme.borderAccent} bg-[#141416]/95 p-6 shadow-xl flex flex-col gap-4`}>
          
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-sm font-serif font-semibold text-slate-200 tracking-wide">NEXUS OPERATIONS REGISTER</h3>
            </div>
            
            {operations.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="px-2.5 py-1 text-xs rounded border border-rose-500/20 hover:border-rose-400 text-rose-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all cursor-pointer font-serif flex items-center gap-1.5"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Register</span>
              </button>
            )}
          </div>

          {operations.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                    <th className="py-2.5 px-3">OPERATION ID</th>
                    <th className="py-2.5 px-3">SERVICE / METHOD</th>
                    <th className="py-2.5 px-3">CREATED TIME</th>
                    <th className="py-2.5 px-3">STATE</th>
                    <th className="py-2.5 px-3 text-right">PROGRESS</th>
                    <th className="py-2.5 px-3 text-right">DETAILS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {operations.map((op) => {
                    const status = getStatusStyle(op.state);
                    const StatusIcon = status.icon;
                    return (
                      <tr 
                        key={op.id}
                        onClick={() => {
                          setActiveOpId(op.id);
                          setLiveOpInfo(op);
                        }}
                        className={`hover:bg-white/[0.01] transition-all cursor-pointer ${activeOpId === op.id ? 'bg-white/[0.02]' : ''}`}
                      >
                        <td className="py-3 px-3 font-mono text-slate-400 font-medium">
                          {op.id}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-200">{op.name}</span>
                            <span className="text-[10px] text-slate-500">Service: GreatWheelService</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-mono text-[10px]">
                          {new Date(op.createdTime).toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-mono font-bold tracking-wider uppercase ${status.text}`}>
                            <StatusIcon className="w-3 h-3 shrink-0" />
                            <span>{op.state}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-300 font-semibold">
                          {op.progress}%
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            className={`text-[10px] font-serif underline ${activeTheme.textPrimary} hover:text-slate-300 cursor-pointer`}
                          >
                            Load Trace
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-6 text-center text-slate-600 italic text-xs font-sans">
              Operation history register is empty. Trigger an operation above to populate records.
            </div>
          )}

        </div>
      </section>

      {/* .NET SDK Asynchronous Reference Panel */}
      <DotNetSdkReference activeTheme={activeTheme} />

    </div>
  );
}
