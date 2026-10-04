/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Type declarations and contracts representing the Temporal Nexus Service specification.
 * Nexus enables cross-service, cross-namespace communication through durable asynchronous operations.
 */

export type OperationState = 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';

export class NexusOperationException extends Error {
  public details?: any;
  public operationName: string;

  constructor(message: string, operationName: string, details?: any) {
    super(message);
    this.name = 'NexusOperationException';
    this.operationName = operationName;
    this.details = details;
    Object.setPrototypeOf(this, NexusOperationException.prototype);
  }
}

/**
 * Custom exception representing a transient, retryable error in a Nexus Operation.
 * Examples include short-lived network drops, temporary crucible temperature instability,
 * or brief database transaction locks.
 */
export class NexusRetryableException extends NexusOperationException {
  public isRetryable = true;
  public backoffDelayMs: number;

  constructor(message: string, operationName: string, backoffDelayMs: number = 2000, details?: any) {
    super(message, operationName, details);
    this.name = 'NexusRetryableException';
    this.backoffDelayMs = backoffDelayMs;
    Object.setPrototypeOf(this, NexusRetryableException.prototype);
  }
}

/**
 * Custom exception representing a permanent, non-retryable error in a Nexus Operation.
 * Examples include structural crucible cracks, forbidden core ingredients, or permission errors.
 * Initiating a retry on these errors would be futile and potentially dangerous.
 */
export class NexusNonRetryableException extends NexusOperationException {
  public isRetryable = false;

  constructor(message: string, operationName: string, details?: any) {
    super(message, operationName, details);
    this.name = 'NexusNonRetryableException';
    Object.setPrototypeOf(this, NexusNonRetryableException.prototype);
  }
}

export interface OperationInfo {
  id: string;
  name: string;
  state: OperationState;
  createdTime: string;
  lastUpdatedTime: string;
  progress: number; // 0 to 100
  logTrace: string[];
  errorType?: 'retryable' | 'non_retryable' | null;
  errorMessage?: string | null;
}

/**
 * Strongly-typed status container for an asynchronous Nexus operation.
 */
export interface NexusOperationStatus<O = any> extends OperationInfo {
  result?: O;
}

/**
 * Result payload returned upon completion of an asynchronous Nexus operation or callback payload.
 */
export interface NexusAsyncOperationResult<O = any> {
  operationId: string;
  state: OperationState;
  result?: O;
  error?: string;
  callbackAcknowledged?: boolean;
  completedAt?: string;
}

/**
 * Interface representing an asynchronous handle to a running Nexus Operation in .NET / TS SDKs.
 * Enables status polling, result retrieval, cancellation, or awaiting completion.
 */
export interface IOperation<I = any, O = any> {
  id: string;
  name: string;
  initialState: OperationState;
  getInfoAsync(): Promise<OperationInfo | null>;
  getResultAsync(): Promise<O | null>;
  cancelAsync(): Promise<void>;
  awaitCompletionAsync(pollIntervalMs?: number): Promise<O>;
}

/**
 * Strongly-typed handle returned when starting an asynchronous Nexus Operation (e.g. via Workflow.StartWorkflowAsync).
 * Represents an ongoing operation without awaiting immediate completion.
 * Callers can poll status, register callbacks, cancel, or await final results.
 */
export interface IOperationHandle<I = any, O = any> extends IOperation<I, O> {
  id: string;
  name: string;
  status: OperationState;
  initialState: OperationState;
  getStatusAsync(): Promise<NexusOperationStatus<O>>;
  getInfoAsync(): Promise<OperationInfo | null>;
  getResultAsync(): Promise<O | null>;
  cancelAsync(): Promise<void>;
  onCompletion(callback: (result: NexusAsyncOperationResult<O>) => void): void;
  awaitCompletionAsync(pollIntervalMs?: number): Promise<O>;
  onProgress?(callback: (progress: number, logMessage: string) => void): void;
}

// Caller Workflow Simulation Structures
export interface WorkflowSimulationStep {
  timestamp: string;
  message: string;
  type: 'info' | 'warn' | 'error' | 'success';
}

export interface WorkflowSimulation {
  id: string;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELED';
  operationName?: 'SayHello' | 'ResonantVesselRefining';
  pattern?: 'polling' | 'callback';
  callbackUrl?: string;
  input: any;
  steps: WorkflowSimulationStep[];
  currentAttempt: number;
  maxAttempts: number;
  activeOperationId?: string;
  isCancellationRequested?: boolean;
}

export interface OperationStartOptions {
  requestId?: string;
  callbackUrl?: string; // Callback URL to notify on completion
  isAsync?: boolean;    // Whether to run asynchronously
}

export interface OperationStartResult<O> {
  id: string;
  state: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
  result?: O; // Present if completed synchronously
}

export interface CancellationToken {
  readonly isCancellationRequested: boolean;
  readonly IsCancellationRequested: boolean;
  onCancellationRequested(listener: (reason?: string) => void): () => void;
  throwIfCancellationRequested(): void;
}

export class CancellationTokenSource {
  private _isCancelled = false;
  private _reason: string = 'Operation was canceled.';
  private _listeners: Array<(reason?: string) => void> = [];

  public get token(): CancellationToken {
    return {
      isCancellationRequested: this._isCancelled,
      IsCancellationRequested: this._isCancelled,
      onCancellationRequested: (listener: (reason?: string) => void) => {
        if (this._isCancelled) {
          listener(this._reason);
          return () => {};
        }
        this._listeners.push(listener);
        return () => {
          this._listeners = this._listeners.filter(l => l !== listener);
        };
      },
      throwIfCancellationRequested: () => {
        if (this._isCancelled) {
          throw new NexusNonRetryableException(
            this._reason || "Operation was canceled.",
            "NexusOperation",
            { failureType: "OperationCancelled" }
          );
        }
      }
    };
  }

  public cancel(reason: string = 'Operation was canceled.'): void {
    if (this._isCancelled) return;
    this._isCancelled = true;
    this._reason = reason;
    this._listeners.forEach(fn => {
      try { fn(reason); } catch (e) { console.error('Cancellation listener error:', e); }
    });
  }
}

export interface HandlerContext {
  IsCancellationRequested: boolean;
  isCancellationRequested?: boolean;
  cancellationToken?: CancellationToken;
  CancellationToken?: CancellationToken;
  Cancel(reason?: string): void;
  cancel?(reason?: string): void;
}

export interface NexusOperationContext {
  HandlerContext: HandlerContext;
  cancellationToken?: CancellationToken;
  CancellationToken?: CancellationToken;
  Cancel(reason?: string): void;
  cancel?(reason?: string): void;
}

export interface NexusOperationHandler<I, O> {
  name: string;
  description: string;
  
  /**
   * Start the operation. Uses async/await to initiate.
   * If synchronous, returns SUCCEEDED/FAILED immediately with the result.
   * If asynchronous, returns PENDING with an operation token/ID, starting background processes.
   */
  start: (
    id: string,
    input: I, 
    options: OperationStartOptions,
    updateState: (state: OperationState, progress: number, log: string, result?: O) => void,
    context?: NexusOperationContext
  ) => Promise<OperationStartResult<O>>;

  /**
   * Optional asynchronous handler executing long-running activities via Workflow.ExecuteActivityAsync.
   */
  executeActivityAsync?: (
    input: I,
    context?: NexusOperationContext,
    updateProgress?: (progress: number, log: string) => void
  ) => Promise<O>;

  /**
   * Cancel an ongoing operation by its token/ID.
   */
  cancel?: (id: string, logTrace: (log: string) => void) => Promise<void>;
}

/**
 * Alias for NexusOperationHandler to align with standard C# .NET SDK patterns.
 * Defines a strongly-typed handler for asynchronous and synchronous execution of cross-service operations.
 */
export interface IOperationHandler<I, O> extends NexusOperationHandler<I, O> {}

// Concrete Interfaces for Operation Inputs/Outputs

export interface RefiningInput {
  vesselType: string;
  targetTemperature: number;
  triggerErrorMode: 'none' | 'retryable' | 'non_retryable';
  allowTransientFluctuations: boolean;
}

export interface RefiningOutput {
  purityCoefficient: number;
  crystallizedEssenceGrams: number;
  finalTemperature: number;
}

/**
 * Concrete implementation of the Resonant Vessel Refining Operation.
 * Intentionally raises custom retryable or non-retryable exceptions to demonstrate Temporal-style
 * cross-service error propagation.
 */
export const ResonantVesselRefiningOperation: NexusOperationHandler<RefiningInput, RefiningOutput> = {
  name: 'ResonantVesselRefining',
  description: 'Refines high-resonance essences within alchemical crucibles. Integrates custom error injection controls.',

  start: async (id, input, options, updateState, context) => {
    const isAsync = options.isAsync !== false;

    // Direct synchronous validation error (non-retryable)
    if (input.targetTemperature < 100 || input.targetTemperature > 2000) {
      throw new NexusNonRetryableException(
        "Temperature limit breached. Target temperature must be between 100°C and 2000°C for this vessel.",
        "ResonantVesselRefining",
        { code: "TEMP_LIMIT_BREACHED", limit: "100-2000" }
      );
    }

    if (!isAsync) {
      // Synchronous execution: immediately check for error injection
      if (input.triggerErrorMode === 'retryable') {
        throw new NexusRetryableException(
          "Transient heater frequency drift detected in vessel chamber during synchronous initialization. Retryable with backoff.",
          "ResonantVesselRefining",
          1500,
          { errorCode: "TRANSIENT_IMBALANCE", attempt: 1 }
        );
      } else if (input.triggerErrorMode === 'non_retryable') {
        throw new NexusNonRetryableException(
          "Permanent alchemical vessel structural fracture detected synchronously. Non-retryable.",
          "ResonantVesselRefining",
          { errorCode: "VESSEL_FRACTURED", critical: true }
        );
      }

      return {
        id,
        state: 'SUCCEEDED',
        result: {
          purityCoefficient: 0.985,
          crystallizedEssenceGrams: 35.4,
          finalTemperature: input.targetTemperature
        }
      };
    }

    // Asynchronous mode: Background simulation handles the rest
    return {
      id,
      state: 'PENDING'
    };
  }
};

export interface TransmutationInput {
  baseMaterial: string;
  massGrams: number;
  targetResonance: number; // 1.1 to 3.5 SWR
}

export interface TransmutationOutput {
  goldYieldGrams: number;
  purityPercent: number;
  aethericResonance: number;
  transmutedMaterial: string;
}

export interface DecryptionInput {
  fragmentText: string;
  language: string;
  academicTradition: string;
}

export interface DecryptionOutput {
  decryptedText: string;
  confidenceScore: number;
  thematicCrossOver: string;
}

/**
 * Concrete implementation of the Transmutation Operation Handler.
 * Simulates a long-running chemical reaction of metals.
 */
export const AethericTransmutationOperation: NexusOperationHandler<TransmutationInput, TransmutationOutput> = {
  name: 'AethericTransmutation',
  description: 'Transmutes base metals (lead/iron) into refined Gold using high SWR frequency alignment.',
  
  start: async (id, input, options, updateState, context) => {
    const isAsync = options.isAsync !== false;
    
    // Initial sync validation
    if (input.massGrams <= 0) {
      throw new Error("Transmutation mass must be greater than 0 grams.");
    }

    if (!isAsync) {
      // Synchronous execution: immediately process (blocking-like)
      const purity = parseFloat((92.5 + Math.random() * 7.4).toFixed(2));
      const yieldAmt = parseFloat((input.massGrams * (purity / 100) * 0.48).toFixed(3));
      const resonance = input.targetResonance;
      
      return {
        id,
        state: 'SUCCEEDED',
        result: {
          goldYieldGrams: yieldAmt,
          purityPercent: purity,
          aethericResonance: resonance,
          transmutedMaterial: `Refined Alchemical Gold (from ${input.baseMaterial})`
        }
      };
    }

    // Asynchronous Execution: Start long-running workflow and return PENDING instantly
    // We initiate a background simulation and return immediately
    return {
      id,
      state: 'PENDING'
    };
  }
};

/**
 * Concrete implementation of the Scriptural Decryption Operation Handler.
 * Simulates deep academic database searches, palaeography scans, and AI reconstructive analyses.
 */
export const ScripturalDecryptionOperation: NexusOperationHandler<DecryptionInput, DecryptionOutput> = {
  name: 'ScripturalDecryption',
  description: 'Decrypts, fills, and translates fragmented ancient scripts across multiple wisdom lines.',

  start: async (id, input, options, updateState, context) => {
    const isAsync = options.isAsync !== false;

    if (!input.fragmentText.trim()) {
      throw new Error("Cannot decrypt empty scriptural fragments.");
    }

    if (!isAsync) {
      // Synchronous execution
      const confidence = Math.floor(75 + Math.random() * 24);
      return {
        id,
        state: 'SUCCEEDED',
        result: {
          decryptedText: `[Restored] In the quiet center of the soul, the unmanifested spark [Ein Sof] recognizes its own eternal vibration.`,
          confidenceScore: confidence,
          thematicCrossOver: `Crossover: Connects the Kabbalistic contraction (Tzimtzum) with Gnostic internal Sophia reclamation.`
        }
      };
    }

    // Asynchronous Execution
    return {
      id,
      state: 'PENDING'
    };
  }
};

// --- ISayHelloNexusService and SayHello asynchronous contracts ---

/**
 * Temporal Workflow orchestration primitives for executing activities in Nexus operations.
 */
export const Workflow = {
  /**
   * Starts an asynchronous workflow operation without awaiting the full result immediately.
   * Returns an IOperationHandle that represents the ongoing operation.
   * The caller can poll for status using handle.getStatusAsync() / handle.getInfoAsync(),
   * receive a callback upon completion using handle.onCompletion(cb),
   * cancel via handle.cancelAsync(), or await completion via handle.awaitCompletionAsync().
   */
  StartWorkflowAsync<TInput = any, TOutput = any>(
    workflowName: string,
    input: TInput,
    options: {
      opId?: string;
      callbackUrl?: string;
      onCallback?: (payload: NexusAsyncOperationResult<TOutput>) => void;
      requestId?: string;
    } = {}
  ): IOperationHandle<TInput, TOutput> {
    const handler = (globalNexusService.getOperationHandler<TInput, TOutput>(workflowName) ||
      SayHelloOperation) as unknown as NexusOperationHandler<TInput, TOutput>;

    const opId = options.opId || `op-wf-${Math.random().toString(36).substring(2, 11)}`;

    // Initiate operation execution asynchronously without blocking caller
    globalNexusService.startOperation<TInput, TOutput>(
      handler,
      input,
      {
        requestId: options.requestId || `req-wf-${Math.random().toString(36).substring(2, 8)}`,
        callbackUrl: options.callbackUrl,
        isAsync: true
      },
      options.onCallback ? (payload) => {
        options.onCallback!({
          operationId: payload.id,
          state: payload.state,
          result: payload.result,
          error: payload.error,
          completedAt: new Date().toISOString()
        });
      } : undefined
    ).catch(err => {
      console.error(`[Workflow.StartWorkflowAsync] Operation start error for ${workflowName}:`, err);
    });

    // Return handle representing the ongoing operation immediately
    const handle = globalNexusService.createOperationHandle<TInput, TOutput>(opId);
    if (options.onCallback) {
      handle.onCompletion(options.onCallback);
    }

    return handle;
  },

  /**
   * Executes a long-running activity asynchronously in a Workflow context using Workflow.ExecuteActivityAsync.
   * Provides real-time progress updates to the caller.
   */
  async ExecuteActivityAsync<TInput = any, TOutput = any>(
    activityName: string,
    input: TInput,
    options: {
      opId?: string;
      startToCloseTimeoutMs?: number;
      updateProgress?: (progress: number, log: string) => void;
      context?: NexusOperationContext;
    } = {}
  ): Promise<TOutput> {
    const { updateProgress, context } = options;

    if (context?.HandlerContext?.IsCancellationRequested) {
      throw new NexusOperationException(`Activity '${activityName}' was canceled prior to execution.`, activityName);
    }

    if (updateProgress) {
      updateProgress(15, `[Workflow.ExecuteActivityAsync] Dispatched activity '${activityName}' to task queue.`);
    }

    const nameVal = (input as any)?.name || (input as any)?.Name || 'Seeker';

    // Simulate progressive execution steps
    const steps = [
      { progress: 35, log: `[Activity: ${activityName}] Harmonizing aetheric frequencies for target '${nameVal}'.` },
      { progress: 70, log: `[Activity: ${activityName}] Synthesizing Enochian greeting waveform across nodes.` },
      { progress: 100, log: `[Activity: ${activityName}] Long-running activity concluded successfully.` }
    ];

    for (const s of steps) {
      await new Promise(res => setTimeout(res, 400));
      if (context?.HandlerContext?.IsCancellationRequested) {
        throw new NexusOperationException(`Activity '${activityName}' was canceled during step.`, activityName);
      }
      if (updateProgress) {
        updateProgress(s.progress, s.log);
      }
    }

    return {
      greeting: `Divine salutations, ${nameVal}. The seven stars welcome your query via asynchronous activity.`,
      timestamp: new Date().toISOString()
    } as unknown as TOutput;
  }
};

export interface SayHelloInput {
  name?: string | null;
  Name?: string | null;
  language?: string;
  Language?: string;
  triggerErrorMode?: 'none' | 'retryable' | 'non_retryable';
}

export interface SayHelloOutput {
  greeting: string;
  timestamp: string;
}

/**
 * SayHelloNexusServiceHandler implements IOperationHandler<SayHelloInput, SayHelloOutput>
 * representing a long-running or asynchronous Nexus operation. It supports:
 * - Returning an IOperationHandler instance for cross-service workflow scheduling.
 * - Comprehensive try-catch error handling differentiating retryable vs non-retryable errors.
 * - Cancellation token support and workflow context signaling.
 * - Progressive multi-step activity execution via Workflow.ExecuteActivityAsync.
 * - Asynchronous webhook callbacks and status polling.
 */
export class SayHelloNexusServiceHandler implements IOperationHandler<SayHelloInput, SayHelloOutput> {
  public name = 'SayHello';
  public description = 'Initiates a heavy Gnostic/Enochian greeting frequency calculation across dimensions via asynchronous Workflow activities with Temporal Nexus error handling and cancellation support.';

  /**
   * Factory method to obtain an IOperationHandler instance for the SayHello operation.
   */
  public static createHandler(): IOperationHandler<SayHelloInput, SayHelloOutput> {
    return new SayHelloNexusServiceHandler();
  }

  /**
   * Starts a SayHello operation asynchronously using Workflow.StartWorkflowAsync.
   * Immediately returns an IOperationHandle representing the ongoing operation without blocking.
   */
  public static startWorkflowAsync(
    input: SayHelloInput,
    options?: OperationStartOptions & { onCallback?: (payload: NexusAsyncOperationResult<SayHelloOutput>) => void }
  ): IOperationHandle<SayHelloInput, SayHelloOutput> {
    return Workflow.StartWorkflowAsync<SayHelloInput, SayHelloOutput>(
      'SayHello',
      input,
      options
    );
  }

  public async start(
    id: string,
    input: SayHelloInput,
    options: OperationStartOptions = {},
    updateState?: (state: OperationState, progress: number, log: string, result?: SayHelloOutput) => void,
    context?: NexusOperationContext
  ): Promise<OperationStartResult<SayHelloOutput>> {
    try {
      const isAsync = options.isAsync !== false;
      const nameVal = input.name !== undefined ? input.name : input.Name;
      const langVal = input.language !== undefined ? input.language : input.Language;

      // 1. Cancellation Token Check (Non-Retryable Cancellation State)
      const isCancelled = context?.HandlerContext?.IsCancellationRequested || 
                          context?.HandlerContext?.isCancellationRequested || 
                          context?.cancellationToken?.isCancellationRequested ||
                          context?.CancellationToken?.IsCancellationRequested;

      if (isCancelled) {
        throw new NexusNonRetryableException(
          "The SayHello operation was cancelled prior to commencement.",
          "SayHello",
          { failureType: "OperationCancelled", operationId: id }
        );
      }

      // 2. Input Validation (Non-Retryable Errors)
      if (nameVal === null || nameVal === undefined) {
        throw new NexusNonRetryableException(
          "Name property cannot be null or undefined.",
          "SayHello",
          { field: "Name", reason: "NullOrUndefined", failureType: "InvalidArgument" }
        );
      }

      const trimmedName = typeof nameVal === 'string' ? nameVal.trim() : '';
      if (trimmedName === "") {
        throw new NexusNonRetryableException(
          "Name property cannot be empty.",
          "SayHello",
          { field: "Name", reason: "Empty", failureType: "InvalidArgument" }
        );
      }

      if (trimmedName.length > 100) {
        throw new NexusNonRetryableException(
          "Name property is excessively long (maximum length is 100 characters).",
          "SayHello",
          { field: "Name", reason: "ExcessivelyLong", failureType: "InvalidArgument", length: trimmedName.length }
        );
      }

      if (langVal && typeof langVal === 'string' && langVal.trim() !== "") {
        const allowedLangs = ['en', 'la', 'cop', 'he', 'gr', 'enochian', 'celestial', 'english', 'latin', 'coptic', 'hebrew', 'greek'];
        const normalizedLang = langVal.trim().toLowerCase();
        if (!allowedLangs.some(l => normalizedLang.includes(l))) {
          throw new NexusNonRetryableException(
            `Unsupported greeting language '${langVal}'. Allowed languages: Enochian, Celestial, Latin, Coptic, Hebrew, Greek, English.`,
            "SayHello",
            { field: "Language", reason: "UnsupportedLanguage", failureType: "InvalidArgument", language: langVal }
          );
        }
      }

      // 3. Error Injection Simulation Modes
      if (input.triggerErrorMode === 'non_retryable') {
        throw new NexusNonRetryableException(
          "Fatal application failure in underlying SayHelloWorkflow: Target entity does not exist in celestial registry.",
          "SayHello",
          { sourceWorkflow: "SayHelloWorkflow", errorCode: "ENTITY_NOT_FOUND", failureType: "ApplicationFailure" }
        );
      }

      if (input.triggerErrorMode === 'retryable' && !isAsync) {
        throw new NexusRetryableException(
          "Transient failure in SayHelloWorkflow: Aetheric resonance frequency timeout during greeting synthesis.",
          "SayHello",
          3000,
          { sourceWorkflow: "SayHelloWorkflow", errorCode: "RESONANCE_TIMEOUT", failureType: "TransientFailure" }
        );
      }

      // 4. Synchronous Execution Path
      if (!isAsync) {
        return {
          id,
          state: 'SUCCEEDED',
          result: {
            greeting: `Divine salutations, ${trimmedName}. The seven stars welcome your query via SayHelloNexusServiceHandler.`,
            timestamp: new Date().toISOString()
          }
        };
      }

      // 5. Asynchronous Execution Path
      return {
        id,
        state: 'PENDING'
      };
    } catch (err: any) {
      // Differentiate and re-throw typed Nexus exceptions according to Nexus best practices
      if (err instanceof NexusRetryableException || err instanceof NexusNonRetryableException) {
        throw err;
      }
      if (err?.name === 'OperationCanceledException' || (err.message && err.message.toLowerCase().includes('cancel'))) {
        throw new NexusNonRetryableException(
          err.message || "SayHello operation was cancelled.",
          "SayHello",
          { failureType: "OperationCancelled", originalError: err }
        );
      }
      // Differentiate transient network / connection drops as retryable
      const isTransient = /timeout|econnreset|etimedout|econnrefused|socket|503|429|temporary|transient/i.test(err.message || '');
      if (isTransient) {
        throw new NexusRetryableException(
          `Transient error during SayHello execution: ${err.message}`,
          "SayHello",
          2500,
          { failureType: "TransientNetworkError", originalError: err.message }
        );
      }
      // Default unexpected fatal failure as non-retryable
      throw new NexusNonRetryableException(
        `SayHello workflow execution failed: ${err.message}`,
        "SayHello",
        { failureType: "ApplicationFailure", originalError: err.message }
      );
    }
  }

  public async executeActivityAsync(
    input: SayHelloInput,
    context?: NexusOperationContext,
    updateProgress?: (progress: number, log: string) => void
  ): Promise<SayHelloOutput> {
    try {
      const isCancelled = context?.HandlerContext?.IsCancellationRequested || 
                          context?.HandlerContext?.isCancellationRequested || 
                          context?.cancellationToken?.isCancellationRequested;

      if (isCancelled) {
        throw new NexusNonRetryableException(
          "SayHello operation execution was cancelled prior to activity dispatch.",
          "SayHello",
          { failureType: "OperationCancelled" }
        );
      }

      if (input.triggerErrorMode === 'non_retryable') {
        throw new NexusNonRetryableException(
          "Fatal exception during SayHelloActivity execution: Permanent waveform breakdown.",
          "SayHello",
          { failureType: "FatalActivityFailure" }
        );
      }

      if (input.triggerErrorMode === 'retryable') {
        throw new NexusRetryableException(
          "Transient activity failure in SayHelloActivity: Network packet loss on celestial node.",
          "SayHello",
          2000,
          { failureType: "TransientActivityFailure" }
        );
      }

      return await Workflow.ExecuteActivityAsync<SayHelloInput, SayHelloOutput>(
        'SayHelloActivity',
        input,
        { context, updateProgress }
      );
    } catch (err: any) {
      if (err instanceof NexusRetryableException || err instanceof NexusNonRetryableException) {
        throw err;
      }
      const isTransient = /timeout|econnreset|etimedout|network|packet loss|socket/i.test(err.message || '');
      if (isTransient) {
        throw new NexusRetryableException(
          `Transient failure in SayHelloActivity: ${err.message}`,
          "SayHello",
          2000,
          { failureType: "TransientActivityError", originalError: err.message }
        );
      }
      throw new NexusNonRetryableException(
        `Fatal activity error in SayHelloActivity: ${err.message}`,
        "SayHello",
        { failureType: "ActivityFailure", originalError: err.message }
      );
    }
  }

  /**
   * Handles cancellation requests for the SayHello operation by signaling the workflow context.
   */
  public async cancel(
    id: string, 
    logTrace: (log: string) => void,
    context?: NexusOperationContext
  ): Promise<void> {
    try {
      logTrace(`[SayHelloNexusServiceHandler] Cancellation request received for operation token ${id}.`);
      
      // Signal cancellation into the workflow context
      if (context) {
        if (typeof context.Cancel === 'function') {
          context.Cancel('SayHello operation canceled via handler cancel request.');
        }
        if (context.HandlerContext && typeof context.HandlerContext.Cancel === 'function') {
          context.HandlerContext.Cancel('SayHello operation canceled via HandlerContext.');
        }
        logTrace(`[SayHelloNexusServiceHandler] Successfully signaled workflow context and CancellationToken.`);
      }

      logTrace(`[SayHelloNexusServiceHandler] Signaled CancellationToken for active SayHelloWorkflow task.`);
      logTrace(`[SayHelloNexusServiceHandler] Releasing active worker thread and cleaning up intermediate speech synthesis buffers.`);
    } catch (err: any) {
      logTrace(`[SayHelloNexusServiceHandler] Error encountered while signaling cancellation: ${err.message}`);
    }
  }

  /**
   * Explicitly signals cancellation to the underlying workflow and context.
   */
  public async signalCancellation(
    id: string,
    reason: string = 'Operation cancelled by caller',
    logTrace?: (log: string) => void,
    context?: NexusOperationContext
  ): Promise<void> {
    const logger = logTrace || ((msg: string) => console.log(msg));
    logger(`[SayHelloNexusServiceHandler] Explicit cancellation signal received for operation ${id}. Reason: "${reason}".`);
    await this.cancel(id, logger, context);
  }
}

export const SayHelloOperation: IOperationHandler<SayHelloInput, SayHelloOutput> = new SayHelloNexusServiceHandler();

export interface WorkflowCallbackInput {
  workflowId: string;
  callbackToken: string;
  payload: string;
}

export interface WorkflowCallbackOutput {
  status: string;
  processedAt: string;
  acknowledgement: string;
}

/**
 * WorkflowCallback operation handler supporting asynchronous execution.
 */
export const WorkflowCallbackOperationHandler: NexusOperationHandler<WorkflowCallbackInput, WorkflowCallbackOutput> = {
  name: 'WorkflowCallback',
  description: 'Demonstrates a durable, long-running workflow callback operation that registers an asynchronous handle, performs alchemical signal checks, and returns a verified state upon polling.',

  start: async (id, input, options, updateState, context) => {
    const isAsync = options.isAsync !== false;

    if (!input.workflowId.trim()) {
      throw new Error("Workflow ID cannot be empty.");
    }

    if (!isAsync) {
      // Synchronous execution: immediately process
      return {
        id,
        state: 'SUCCEEDED',
        result: {
          status: 'COMPLETED_SYNC',
          processedAt: new Date().toISOString(),
          acknowledgement: `Workflow callback processed synchronously for ID: ${input.workflowId}`
        }
      };
    }

    // Asynchronous Execution: Return acknowledgment instantly
    return {
      id,
      state: 'PENDING'
    };
  }
};

export interface WorkflowCompletionInput {
  workflowId: string;
  runId?: string;
  targetState?: string;
}

export interface WorkflowCompletionOutput {
  status: string;
  workflowId: string;
  completedAt: string;
  resultSummary: string;
}

/**
 * WorkflowCompletion operation handler supporting asynchronous execution and polling.
 */
export const WorkflowCompletionOperationHandler: NexusOperationHandler<WorkflowCompletionInput, WorkflowCompletionOutput> = {
  name: 'WorkflowCompletion',
  description: 'A durable asynchronous Nexus operation that allows clients to poll and be notified when a long-running Workflow execution concludes.',

  start: async (id, input, options, updateState, context) => {
    const isAsync = options.isAsync !== false;

    if (!input.workflowId.trim()) {
      throw new Error("Workflow ID cannot be empty.");
    }

    if (!isAsync) {
      // Synchronous execution: immediately process
      return {
        id,
        state: 'SUCCEEDED',
        result: {
          status: 'COMPLETED_SYNC',
          workflowId: input.workflowId,
          completedAt: new Date().toISOString(),
          resultSummary: `Workflow ${input.workflowId} completed synchronously instantly on default cluster.`
        }
      };
    }

    // Asynchronous Execution: Return acknowledgment instantly
    return {
      id,
      state: 'PENDING'
    };
  }
};

/**
 * Strongly-typed Result Wrapper for asynchronous operations and long-running processes.
 * Encapsulates the execution state, completion task, status polling, cancellation, and unwrapping.
 */
export interface NexusOperationResultWrapper<T = any> {
  readonly operationId: string;
  readonly status: OperationState;
  readonly pollUrl: string;
  readonly callbackUrl?: string;
  readonly startedAt: string;
  readonly isCompleted: boolean;
  readonly isSuccess: boolean;
  readonly isFaulted: boolean;
  readonly isCanceled: boolean;
  readonly progress: number;
  readonly result?: T;
  readonly error?: string;

  /**
   * The completion Task representing the ongoing asynchronous process.
   * Can be awaited directly with `await wrapper.completionTask` or chained with `.then()`.
   */
  readonly completionTask: Promise<T>;

  /**
   * Unwraps or awaits the final result of the long-running process, throwing if the operation faulted or was canceled.
   */
  unwrap(): Promise<T>;

  /**
   * Queries the current operation status snapshot from the service.
   */
  getStatusAsync(): Promise<NexusOperationStatus<T>>;

  /**
   * Signals cooperative cancellation to the long-running background operation.
   */
  cancelAsync(): Promise<void>;

  /**
   * Registers a completion listener invoked when the long-running process terminates.
   */
  onCompletion(callback: (result: NexusAsyncOperationResult<T>) => void): void;
}

/**
 * Completion object (Task / custom result wrapper) representing an asynchronous Nexus operation.
 * Encapsulates the long-running task, tracking identifier, poll endpoint, and status snapshot.
 */
export interface NexusTaskCompletion<T = any> {
  operationId: string;
  status: OperationState;
  pollUrl: string;
  callbackUrl?: string;
  startedAt: string;
  task: Promise<T>; // Completion Task representing the ongoing long-running process
  resultWrapper?: NexusOperationResultWrapper<T>;
  getStatus(): Promise<NexusOperationStatus<T>>;
  cancel(): Promise<void>;
  awaitCompletionAsync?(pollIntervalMs?: number): Promise<T>;
  onCompletion?(callback: (result: NexusAsyncOperationResult<T>) => void): void;
}

/**
 * Helper to construct a comprehensive NexusOperationResultWrapper for long-running processes.
 */
export function createOperationResultWrapper<T = any>(
  opId: string,
  handle: IOperationHandle<any, T>,
  pollUrl: string,
  callbackUrl?: string
): NexusOperationResultWrapper<T> {
  const startedAt = new Date().toISOString();
  const completionTask = handle.awaitCompletionAsync();

  let isCompleted = false;
  let isSuccess = false;
  let isFaulted = false;
  let isCanceled = false;
  let resultVal: T | undefined;
  let errorMsg: string | undefined;

  completionTask.then(
    (res) => {
      isCompleted = true;
      isSuccess = true;
      resultVal = res;
    },
    (err) => {
      isCompleted = true;
      if (err.message && err.message.toLowerCase().includes('cancel')) {
        isCanceled = true;
      } else {
        isFaulted = true;
      }
      errorMsg = err.message || 'Operation failed';
    }
  );

  return {
    get operationId() { return opId; },
    get status() { return handle.status; },
    pollUrl,
    callbackUrl,
    startedAt,
    get isCompleted() { return isCompleted; },
    get isSuccess() { return isSuccess; },
    get isFaulted() { return isFaulted; },
    get isCanceled() { return isCanceled; },
    get progress() {
      const info = globalNexusService.getOperationInfo(opId);
      return info?.progress || 0;
    },
    get result() { return resultVal; },
    get error() { return errorMsg; },
    completionTask,
    unwrap: async () => completionTask,
    getStatusAsync: async () => handle.getStatusAsync(),
    cancelAsync: async () => handle.cancelAsync(),
    onCompletion: (cb) => handle.onCompletion(cb)
  };
}

/**
 * Canonical Nexus Service Definition contract representing a Temporal Nexus Service.
 * Declares the service endpoint, metadata, and supports both synchronous and asynchronous operations.
 * Includes interface methods that return a completion Task or result wrapper for long-running processes.
 */
export interface INexusServiceDefinition {
  readonly serviceName: string;
  readonly endpoint: string;
  readonly description?: string;

  /**
   * Interface method that starts a long-running asynchronous operation and returns a completion Task or result wrapper.
   * Starts a long-running process and returns a tracking identifier for the caller to poll or receive a callback.
   */
  startAsyncOperation<TInput = any, TOutput = any>(
    operationName: string,
    input: TInput,
    options?: OperationStartOptions & { callbackUrl?: string }
  ): Promise<NexusTaskCompletion<TOutput>>;

  /**
   * Executes a long-running process asynchronously, returning a rich NexusOperationResultWrapper.
   */
  executeLongRunningProcess<TInput = any, TOutput = any>(
    operationName: string,
    input: TInput,
    options?: OperationStartOptions & { callbackUrl?: string; onProgress?: (progress: number, log: string) => void }
  ): Promise<NexusOperationResultWrapper<TOutput>>;

  /**
   * Query status of an asynchronous operation by ID.
   */
  getOperationStatus(operationId: string): Promise<NexusOperationStatus | null>;

  /**
   * Cancel an ongoing long-running asynchronous process.
   */
  cancelOperationAsync(operationId: string): Promise<void>;
}

/**
 * Service contract representing the SayHello asynchronous operation endpoint.
 * Extends INexusServiceDefinition to provide strongly-typed operations and completion Task wrappers.
 */
export interface ISayHelloNexusService extends INexusServiceDefinition {
  /**
   * Starts an asynchronous operation returning a completion object (Task / custom result wrapper).
   * Starts a long-running process and returns an identifier for the caller to poll or receive a callback.
   */
  startAsync(
    input: SayHelloInput,
    options?: OperationStartOptions & { callbackUrl?: string }
  ): Promise<NexusTaskCompletion<SayHelloOutput>>;

  /**
   * Explicit interface method that starts a long-running process and returns
   * a completion Task or result wrapper (NexusTaskCompletion / NexusOperationResultWrapper).
   */
  startAsyncOperation<TInput = any, TOutput = any>(
    operationOrInput: string | TInput | SayHelloInput,
    inputOrOptions?: any,
    options?: OperationStartOptions & { callbackUrl?: string; forceError?: 'none' | 'retryable' | 'non_retryable'; durationMs?: number }
  ): Promise<NexusTaskCompletion<TOutput>>;

  /**
   * Starts a long-running process returning an interactive result wrapper for progress inspection and cancellation.
   */
  startLongRunningProcess(
    input: SayHelloInput,
    options?: OperationStartOptions & { callbackUrl?: string }
  ): Promise<NexusOperationResultWrapper<SayHelloOutput>>;

  /**
   * Starts the SayHello operation asynchronously using Workflow.StartWorkflowAsync.
   * Immediately returns an IOperationHandle representing the ongoing operation without blocking.
   * The caller can poll for status using handle.getStatusAsync() / handle.getInfoAsync(),
   * receive a callback upon completion via handle.onCompletion(),
   * or await completion via handle.awaitCompletionAsync().
   */
  startSayHelloWorkflowAsync(
    input: SayHelloInput,
    options?: OperationStartOptions & { onCallback?: (payload: NexusAsyncOperationResult<SayHelloOutput>) => void }
  ): IOperationHandle<SayHelloInput, SayHelloOutput>;

  /**
   * Alias for startSayHelloWorkflowAsync demonstrating Workflow.StartWorkflowAsync.
   */
  startWorkflowAsync(
    input: SayHelloInput,
    options?: OperationStartOptions & { onCallback?: (payload: NexusAsyncOperationResult<SayHelloOutput>) => void }
  ): IOperationHandle<SayHelloInput, SayHelloOutput>;

  /**
   * Executes a long-running activity asynchronously using Workflow.ExecuteActivityAsync mechanism,
   * publishing progress updates to allow callers to track execution progress.
   */
  executeActivityAsync<TInput = any, TOutput = any>(
    activityName: string,
    input: TInput,
    options?: OperationStartOptions,
    onProgress?: (progress: number, logMessage: string) => void
  ): Promise<TOutput>;

  /**
   * Strongly-typed asynchronous method to run a long-running SayHello task
   * with real-time progress tracking until completion.
   */
  sayHelloAsync(
    input: SayHelloInput,
    onProgress?: (progress: number, logMessage: string) => void
  ): Promise<SayHelloOutput>;

  /**
   * Starts the SayHello operation asynchronously.
   * Returns an acknowledgment immediately with a pending state.
   */
  startSayHello(
    input: SayHelloInput,
    options?: OperationStartOptions
  ): Promise<OperationStartResult<SayHelloOutput>>;

  /**
   * Query current execution info of a long-running SayHello operation.
   */
  getSayHelloStatus(opId: string): Promise<OperationInfo | null>;

  /**
   * Retrieves final greeting output once completed.
   */
  getSayHelloResult(opId: string): Promise<SayHelloOutput | null>;

  /**
   * Cancel an ongoing SayHello operation.
   */
  cancelSayHello(opId: string, reason?: string): Promise<void>;

  /**
   * Explicitly signals cancellation for a long-running operation.
   */
  signalCancellation(opId: string, reason?: string): Promise<void>;

  /**
   * Requests cancellation of an asynchronous operation by operation token ID.
   */
  requestCancellation(opId: string, reason?: string): Promise<void>;

  /**
   * Alias method for canceling an operation.
   */
  cancel(opId: string, reason?: string): Promise<void>;

  /**
   * Starts the WorkflowCallback operation asynchronously.
   * Demonstrates returning an operation handle and allowing the caller to poll.
   */
  startWorkflowCallback(
    input: WorkflowCallbackInput,
    options?: OperationStartOptions
  ): Promise<OperationStartResult<WorkflowCallbackOutput>>;

  /**
   * Query current execution info of a long-running WorkflowCallback operation.
   */
  getWorkflowCallbackStatus(opId: string): Promise<OperationInfo | null>;

  /**
   * Retrieves final workflow callback output once completed.
   */
  getWorkflowCallbackResult(opId: string): Promise<WorkflowCallbackOutput | null>;

  /**
   * Cancel an ongoing WorkflowCallback operation.
   */
  cancelWorkflowCallback(opId: string): Promise<void>;

  /**
   * Starts the WorkflowCompletion operation asynchronously.
   */
  startWorkflowCompletion(
    input: WorkflowCompletionInput,
    options?: OperationStartOptions
  ): Promise<OperationStartResult<WorkflowCompletionOutput>>;

  /**
   * Query current execution info of a long-running WorkflowCompletion operation.
   */
  getWorkflowCompletionStatus(opId: string): Promise<OperationInfo | null>;

  /**
   * Retrieves final workflow completion output once completed.
   */
  getWorkflowCompletionResult(opId: string): Promise<WorkflowCompletionOutput | null>;

  /**
   * Cancel an ongoing WorkflowCompletion operation.
   */
  cancelWorkflowCompletion(opId: string): Promise<void>;
}

/**
 * Service contract for Aetheric Nexus Services managing metallurgical transmutation and crucible refining.
 * Supports asynchronous operations returning completion Tasks or result wrappers.
 */
export interface IAethericNexusService extends INexusServiceDefinition {
  startTransmutationAsync(
    input: TransmutationInput,
    options?: OperationStartOptions & { callbackUrl?: string }
  ): Promise<NexusTaskCompletion<TransmutationOutput>>;

  startRefiningAsync(
    input: RefiningInput,
    options?: OperationStartOptions & { callbackUrl?: string }
  ): Promise<NexusTaskCompletion<RefiningOutput>>;
}

export namespace ISayHelloNexusService {
  export interface MyInput extends SayHelloInput {}
}

/**
 * Active Operation Engine simulating a Temporal Worker hosting Nexus endpoints.
 */
export class TemporalNexusService implements ISayHelloNexusService, IAethericNexusService {
  private activeOperations: Map<string, OperationInfo> = new Map();
  private operationResults: Map<string, any> = new Map();
  private timers: Map<string, NodeJS.Timeout[]> = new Map();
  private callbackCallbacks: Map<string, (payload: any) => void> = new Map();
  private contexts: Map<string, NexusOperationContext> = new Map();

  constructor() {}

  public getOperationContext(opId: string): NexusOperationContext {
    let ctx = this.contexts.get(opId);
    if (!ctx) {
      const cts = new CancellationTokenSource();
      const handlerCtx: HandlerContext = {
        IsCancellationRequested: false,
        isCancellationRequested: false,
        cancellationToken: cts.token,
        CancellationToken: cts.token,
        Cancel: (reason?: string) => {
          handlerCtx.IsCancellationRequested = true;
          handlerCtx.isCancellationRequested = true;
          cts.cancel(reason);
          this.triggerContextCancel(opId, 'HandlerContext', reason);
        },
        cancel: (reason?: string) => {
          handlerCtx.IsCancellationRequested = true;
          handlerCtx.isCancellationRequested = true;
          cts.cancel(reason);
          this.triggerContextCancel(opId, 'HandlerContext', reason);
        }
      };
      ctx = {
        HandlerContext: handlerCtx,
        cancellationToken: cts.token,
        CancellationToken: cts.token,
        Cancel: (reason?: string) => {
          handlerCtx.IsCancellationRequested = true;
          handlerCtx.isCancellationRequested = true;
          cts.cancel(reason);
          this.triggerContextCancel(opId, 'NexusOperationContext', reason);
        },
        cancel: (reason?: string) => {
          handlerCtx.IsCancellationRequested = true;
          handlerCtx.isCancellationRequested = true;
          cts.cancel(reason);
          this.triggerContextCancel(opId, 'NexusOperationContext', reason);
        }
      };
      this.contexts.set(opId, ctx);
    }
    return ctx;
  }

  private triggerContextCancel(opId: string, origin: string, reason?: string) {
    const currentOp = this.activeOperations.get(opId);
    if (!currentOp || currentOp.state === 'CANCELED' || currentOp.state === 'FAILED' || currentOp.state === 'SUCCEEDED') {
      return;
    }

    currentOp.state = 'CANCELED';
    currentOp.logTrace.push(`[Handler] Checked context.HandlerContext.IsCancellationRequested: True`);
    currentOp.logTrace.push(`[Handler] Detected active cancellation signal inside operation handler (triggered via ${origin}.Cancel()${reason ? `: "${reason}"` : ''}).`);
    currentOp.logTrace.push(`[Handler] Gracefully aborting ongoing workflow operations and releasing resources.`);
    currentOp.logTrace.push(`[Worker] Cleaned up temporal caches and terminated task thread.`);
    currentOp.logTrace.push(`[Nexus] Operation successfully transitioned to terminal state 'CANCELED'.`);
    currentOp.lastUpdatedTime = new Date().toISOString();

    // Cancel all scheduled setTimeout timers
    const opTimers = this.timers.get(opId);
    if (opTimers) {
      opTimers.forEach(t => clearTimeout(t));
      this.timers.delete(opId);
    }

    // Trigger callback if defined
    const cb = this.callbackCallbacks.get(opId);
    if (cb) {
      currentOp.logTrace.push(`[Callback] Outgoing callback triggered with status 'CANCELED'.`);
      cb({ id: opId, state: 'CANCELED', error: reason || 'Operation canceled via context.Cancel().' });
    }
  }

  public readonly serviceName: string = 'ISayHelloNexusService';
  public readonly endpoint: string = 'celestial-nexus-endpoint';
  public readonly description: string = 'Temporal Nexus Service orchestrating celestial communications, aetheric transmutations, and long-running workflows with Task completion wrappers.';

  /**
   * Starts an asynchronous operation returning a completion object (Task / result wrapper).
   * Starts a long-running process and returns an identifier for the caller to poll or receive a callback.
   */
  public async startAsync(
    input: SayHelloInput,
    options: OperationStartOptions & { callbackUrl?: string } = {}
  ): Promise<NexusTaskCompletion<SayHelloOutput>> {
    const handle = this.startSayHelloWorkflowAsync(input, options);
    const opId = handle.id;
    const startedAt = new Date().toISOString();
    const pollUrl = `/api/nexus/workflow-status/${opId}`;

    const task = handle.awaitCompletionAsync();
    const resultWrapper = createOperationResultWrapper<SayHelloOutput>(
      opId,
      handle,
      pollUrl,
      options.callbackUrl
    );

    return {
      operationId: opId,
      status: 'PENDING',
      pollUrl,
      callbackUrl: options.callbackUrl,
      startedAt,
      task,
      resultWrapper,
      getStatus: async () => handle.getStatusAsync(),
      cancel: async () => handle.cancelAsync(),
      awaitCompletionAsync: async (intervalMs) => handle.awaitCompletionAsync(intervalMs),
      onCompletion: (cb) => handle.onCompletion(cb)
    };
  }

  /**
   * Extended interface method implementing INexusServiceDefinition.startAsyncOperation.
   * Can be invoked with (operationName, input, options) or (input, options) defaulting to SayHello.
   * Returns a completion Task or result wrapper for long-running processes.
   */
  public async startAsyncOperation<TInput = any, TOutput = any>(
    operationOrInput: string | TInput,
    inputOrOptions?: any,
    options?: OperationStartOptions & { callbackUrl?: string }
  ): Promise<NexusTaskCompletion<TOutput>> {
    let operationName = 'SayHello';
    let input: any;
    let opts: (OperationStartOptions & { callbackUrl?: string }) | undefined;

    if (typeof operationOrInput === 'string') {
      operationName = operationOrInput;
      input = inputOrOptions;
      opts = options;
    } else {
      input = operationOrInput;
      opts = inputOrOptions;
    }

    // Normalized input
    const normalizedInput = typeof input === 'string' ? { name: input } : (input || {});
    const handle = Workflow.StartWorkflowAsync<any, TOutput>(
      operationName,
      normalizedInput,
      opts
    );
    const opId = handle.id;
    const pollUrl = `/api/nexus/workflow-status/${opId}`;
    const task = handle.awaitCompletionAsync();
    const resultWrapper = createOperationResultWrapper<TOutput>(
      opId,
      handle,
      pollUrl,
      opts?.callbackUrl
    );

    return {
      operationId: opId,
      status: 'PENDING',
      pollUrl,
      callbackUrl: opts?.callbackUrl,
      startedAt: new Date().toISOString(),
      task,
      resultWrapper,
      getStatus: async () => handle.getStatusAsync(),
      cancel: async () => handle.cancelAsync(),
      awaitCompletionAsync: async (intervalMs) => handle.awaitCompletionAsync(intervalMs),
      onCompletion: (cb) => handle.onCompletion(cb)
    };
  }

  /**
   * Starts a long-running process returning an interactive NexusOperationResultWrapper.
   */
  public async startLongRunningProcess(
    input: SayHelloInput,
    options: OperationStartOptions & { callbackUrl?: string } = {}
  ): Promise<NexusOperationResultWrapper<SayHelloOutput>> {
    const handle = this.startSayHelloWorkflowAsync(input, options);
    const opId = handle.id;
    const pollUrl = `/api/nexus/workflow-status/${opId}`;
    return createOperationResultWrapper<SayHelloOutput>(opId, handle, pollUrl, options.callbackUrl);
  }

  /**
   * Executes a long-running process asynchronously, returning a rich NexusOperationResultWrapper.
   */
  public async executeLongRunningProcess<TInput = any, TOutput = any>(
    operationName: string,
    input: TInput,
    options: OperationStartOptions & { callbackUrl?: string; onProgress?: (progress: number, log: string) => void } = {}
  ): Promise<NexusOperationResultWrapper<TOutput>> {
    const handle = Workflow.StartWorkflowAsync<TInput, TOutput>(
      operationName,
      input,
      options
    );
    const opId = handle.id;
    const pollUrl = `/api/nexus/workflow-status/${opId}`;

    if (options.onProgress && handle.onProgress) {
      handle.onProgress(options.onProgress);
    }

    return createOperationResultWrapper<TOutput>(opId, handle, pollUrl, options.callbackUrl);
  }

  /**
   * Queries operation status by ID.
   */
  public async getOperationStatus(operationId: string): Promise<NexusOperationStatus | null> {
    const handle = this.createOperationHandle(operationId);
    return handle.getStatusAsync();
  }

  /**
   * Cancels a long-running asynchronous operation by ID.
   */
  public async cancelOperationAsync(operationId: string): Promise<void> {
    const handle = this.createOperationHandle(operationId);
    return handle.cancelAsync();
  }

  /**
   * Starts a transmutation operation asynchronously returning a completion Task / result wrapper.
   */
  public async startTransmutationAsync(
    input: TransmutationInput,
    options: OperationStartOptions & { callbackUrl?: string } = {}
  ): Promise<NexusTaskCompletion<TransmutationOutput>> {
    return this.startAsyncOperation<TransmutationInput, TransmutationOutput>('AethericTransmutation', input, options);
  }

  /**
   * Starts a crucible refining operation asynchronously returning a completion Task / result wrapper.
   */
  public async startRefiningAsync(
    input: RefiningInput,
    options: OperationStartOptions & { callbackUrl?: string } = {}
  ): Promise<NexusTaskCompletion<RefiningOutput>> {
    return this.startAsyncOperation<RefiningInput, RefiningOutput>('ResonantVesselRefining', input, options);
  }

  /**
   * Starts the SayHello operation asynchronously using Workflow.StartWorkflowAsync.
   * Returns an IOperationHandle immediately representing the ongoing operation without blocking.
   * The caller can poll status, register completion callbacks, cancel, or await final output.
   */
  public startSayHelloWorkflowAsync(
    input: SayHelloInput,
    options: OperationStartOptions & { onCallback?: (payload: NexusAsyncOperationResult<SayHelloOutput>) => void } = {}
  ): IOperationHandle<SayHelloInput, SayHelloOutput> {
    return Workflow.StartWorkflowAsync<SayHelloInput, SayHelloOutput>(
      'SayHello',
      input,
      options
    );
  }

  /**
   * Alias for startSayHelloWorkflowAsync demonstrating Workflow.StartWorkflowAsync.
   */
  public startWorkflowAsync(
    input: SayHelloInput,
    options: OperationStartOptions & { onCallback?: (payload: NexusAsyncOperationResult<SayHelloOutput>) => void } = {}
  ): IOperationHandle<SayHelloInput, SayHelloOutput> {
    return this.startSayHelloWorkflowAsync(input, options);
  }

  /**
   * Executes a long-running activity asynchronously using Workflow.ExecuteActivityAsync mechanism,
   * publishing progress updates to allow callers to track execution progress.
   */
  public async executeActivityAsync<TInput = any, TOutput = any>(
    activityName: string,
    input: TInput,
    options: OperationStartOptions = {},
    onProgress?: (progress: number, logMessage: string) => void
  ): Promise<TOutput> {
    const handler = (this.getOperationHandler<TInput, TOutput>(activityName) || SayHelloOperation) as unknown as IOperationHandler<TInput, TOutput>;

    const startResult = await this.startOperation<TInput, TOutput>(
      handler,
      input,
      { ...options, isAsync: true }
    );

    const opId = startResult.id;

    return new Promise<TOutput>((resolve, reject) => {
      let completed = false;
      const pollTimer = setInterval(() => {
        if (completed) return;
        const info = this.getOperationInfo(opId);
        if (!info) return;

        if (onProgress) {
          const lastLog = info.logTrace[info.logTrace.length - 1] || '';
          onProgress(info.progress, lastLog);
        }

        if (info.state === 'SUCCEEDED') {
          completed = true;
          clearInterval(pollTimer);
          resolve(this.getOperationResult(opId));
        } else if (info.state === 'FAILED') {
          completed = true;
          clearInterval(pollTimer);
          reject(new NexusOperationException(info.errorMessage || 'Asynchronous activity failed.', activityName));
        } else if (info.state === 'CANCELED') {
          completed = true;
          clearInterval(pollTimer);
          reject(new NexusOperationException('Asynchronous activity was canceled.', activityName));
        }
      }, 350);
    });
  }

  /**
   * Strongly-typed asynchronous method to run a long-running SayHello task
   * with real-time progress tracking until completion.
   */
  public async sayHelloAsync(
    input: SayHelloInput,
    onProgress?: (progress: number, logMessage: string) => void
  ): Promise<SayHelloOutput> {
    return this.executeActivityAsync<SayHelloInput, SayHelloOutput>(
      'SayHello',
      input,
      { isAsync: true },
      onProgress
    );
  }

  /**
   * Starts the SayHello operation asynchronously.
   * Returns an acknowledgment immediately with a pending state.
   */
  public async startSayHello(
    input: SayHelloInput,
    options: OperationStartOptions = {},
    onCallbackTriggered?: (payload: { id: string; state: OperationState; result?: SayHelloOutput; error?: string }) => void
  ): Promise<OperationStartResult<SayHelloOutput>> {
    return this.startOperation<SayHelloInput, SayHelloOutput>(
      SayHelloOperation,
      input,
      options,
      onCallbackTriggered
    );
  }

  /**
   * Query current execution info of a long-running SayHello operation.
   */
  public async getSayHelloStatus(opId: string): Promise<OperationInfo | null> {
    return this.getOperationInfo(opId);
  }

  /**
   * Retrieves final greeting output once completed.
   */
  public async getSayHelloResult(opId: string): Promise<SayHelloOutput | null> {
    return this.getOperationResult(opId);
  }

  /**
   * Cancel an ongoing SayHello operation.
   */
  public async cancelSayHello(opId: string, reason?: string): Promise<void> {
    return this.cancelOperation(opId, reason);
  }

  /**
   * Explicitly signals cancellation for a long-running operation.
   */
  public async signalCancellation(opId: string, reason?: string): Promise<void> {
    return this.cancelOperation(opId, reason);
  }

  /**
   * Requests cancellation of an asynchronous operation by operation token ID.
   */
  public async requestCancellation(opId: string, reason?: string): Promise<void> {
    return this.cancelOperation(opId, reason);
  }

  /**
   * Alias method for canceling an operation.
   */
  public async cancel(opId: string, reason?: string): Promise<void> {
    return this.cancelOperation(opId, reason);
  }

  /**
   * Starts the WorkflowCallback operation asynchronously.
   */
  public async startWorkflowCallback(
    input: WorkflowCallbackInput,
    options: OperationStartOptions = {},
    onCallbackTriggered?: (payload: { id: string; state: OperationState; result?: WorkflowCallbackOutput; error?: string }) => void
  ): Promise<OperationStartResult<WorkflowCallbackOutput>> {
    return this.startOperation<WorkflowCallbackInput, WorkflowCallbackOutput>(
      WorkflowCallbackOperationHandler,
      input,
      options,
      onCallbackTriggered
    );
  }

  /**
   * Query current execution info of a long-running WorkflowCallback operation.
   */
  public async getWorkflowCallbackStatus(opId: string): Promise<OperationInfo | null> {
    return this.getOperationInfo(opId);
  }

  /**
   * Retrieves final workflow callback output once completed.
   */
  public async getWorkflowCallbackResult(opId: string): Promise<WorkflowCallbackOutput | null> {
    return this.getOperationResult(opId);
  }

  /**
   * Cancel an ongoing WorkflowCallback operation.
   */
  public async cancelWorkflowCallback(opId: string): Promise<void> {
    return this.cancelOperation(opId);
  }

  /**
   * Starts the WorkflowCompletion operation asynchronously.
   */
  public async startWorkflowCompletion(
    input: WorkflowCompletionInput,
    options: OperationStartOptions = {},
    onCallbackTriggered?: (payload: { id: string; state: OperationState; result?: WorkflowCompletionOutput; error?: string }) => void
  ): Promise<OperationStartResult<WorkflowCompletionOutput>> {
    return this.startOperation<WorkflowCompletionInput, WorkflowCompletionOutput>(
      WorkflowCompletionOperationHandler,
      input,
      options,
      onCallbackTriggered
    );
  }

  /**
   * Query current execution info of a long-running WorkflowCompletion operation.
   */
  public async getWorkflowCompletionStatus(opId: string): Promise<OperationInfo | null> {
    return this.getOperationInfo(opId);
  }

  /**
   * Retrieves final workflow completion output once completed.
   */
  public async getWorkflowCompletionResult(opId: string): Promise<WorkflowCompletionOutput | null> {
    return this.getOperationResult(opId);
  }

  /**
   * Cancel an ongoing WorkflowCompletion operation.
   */
  public async cancelWorkflowCompletion(opId: string): Promise<void> {
    return this.cancelOperation(opId);
  }

  /**
   * Start a Nexus operation. Handled asynchronously with async/await.
   */
  public async startOperation<I, O>(
    handler: NexusOperationHandler<I, O>,
    input: I,
    options: OperationStartOptions,
    onCallbackTriggered?: (payload: { id: string; state: OperationState; result?: O; error?: string }) => void
  ): Promise<OperationStartResult<O>> {
    const opId = `op-${Math.random().toString(36).substring(2, 11)}`;
    const createdTime = new Date().toISOString();
    
    // Register callback if provided
    if (options.callbackUrl && onCallbackTriggered) {
      this.callbackCallbacks.set(opId, onCallbackTriggered);
    }

    const logTrace = [
      `[Nexus] Incoming request received. Service: GreatWheelService, Operation: ${handler.name}`,
      `[Nexus] Connection authentication verified. Request ID: ${options.requestId || 'req-auto'}`,
      options.callbackUrl ? `[Nexus] Registered asynchronous callback hook: ${options.callbackUrl}` : `[Nexus] No callback URL provided. Polling expected from client.`,
      `[Nexus] Invoking operation start handler using async/await pattern...`
    ];

    // Create the tracking state record
    const opInfo: OperationInfo = {
      id: opId,
      name: handler.name,
      state: 'PENDING',
      createdTime,
      lastUpdatedTime: createdTime,
      progress: 0,
      logTrace
    };
    
    this.activeOperations.set(opId, opInfo);

    try {
      // Execute the start handler (using async/await)
      const context = this.getOperationContext(opId);
      const startResult = await handler.start(opId, input, options, () => {}, context);

      if (startResult.state === 'SUCCEEDED') {
        opInfo.state = 'SUCCEEDED';
        opInfo.progress = 100;
        opInfo.logTrace.push(`[Handler] Synchronous execution completed successfully.`);
        opInfo.logTrace.push(`[Nexus] Operation finished instantly. Succeeded.`);
        this.operationResults.set(opId, startResult.result);
        opInfo.lastUpdatedTime = new Date().toISOString();
        
        // Trigger callback instantly if defined
        if (options.callbackUrl && onCallbackTriggered) {
          onCallbackTriggered({ id: opId, state: 'SUCCEEDED', result: startResult.result });
        }
        
        return startResult;
      }

      // If asynchronous, simulate the lifecycle
      opInfo.state = 'RUNNING';
      opInfo.logTrace.push(`[Nexus] Handler returned asynchronous state 'PENDING'. Operation token issued.`);
      opInfo.logTrace.push(`[Worker] Spawning asynchronous task thread...`);
      opInfo.lastUpdatedTime = new Date().toISOString();

      this.runAsyncLifecycle(opId, handler, input, options);

      return {
        id: opId,
        state: 'PENDING'
      };

    } catch (err: any) {
      opInfo.state = 'FAILED';
      opInfo.progress = 0;
      opInfo.logTrace.push(`[Error] Handler crashed during start: ${err.message}`);
      opInfo.lastUpdatedTime = new Date().toISOString();
      
      if (options.callbackUrl && onCallbackTriggered) {
        onCallbackTriggered({ id: opId, state: 'FAILED', error: err.message });
      }

      throw err;
    }
  }

  /**
   * Simulates the async workflow execution steps over time.
   */
  private runAsyncLifecycle<I, O>(
    opId: string, 
    handler: NexusOperationHandler<I, O>, 
    input: any, 
    options: OperationStartOptions
  ) {
    const opInfo = this.activeOperations.get(opId);
    if (!opInfo) return;

    const opTimers: NodeJS.Timeout[] = [];
    this.timers.set(opId, opTimers);

    const steps = handler.name === 'AethericTransmutation' 
      ? [
          { delay: 1500, progress: 20, log: "[Transmutation] Activating induction furnace... Ground potential matching at 102\" whip is stable." },
          { delay: 3000, progress: 45, log: "[Transmutation] Heating heavy barrel spring coil. Temperature rising to 840°C. SWR Symmetrical matching active." },
          { delay: 5000, progress: 70, log: "[Transmutation] Calcination phase completed. Separating pure spiritus sparks from coarse metal impurities..." },
          { delay: 6800, progress: 90, log: "[Transmutation] Dissolution completed. Crystallizing alchemical gold from gold-fluid. Finalizing structure." },
          { delay: 8000, progress: 100, log: "[Transmutation] Transmutation cycle finalized. Power shut down. Resonant vessel cooling down." }
        ]
      : handler.name === 'ResonantVesselRefining'
      ? [
          { delay: 1000, progress: 20, log: "[Refining] Activating resonant heating coils. Calibrating spiritual impedance..." },
          { delay: 2500, progress: 45, log: "[Refining] Compressing essence fluid inside the crucible. Temperature reaching 450°C..." },
          { delay: 4000, progress: 75, log: "[Refining] Commencing crystallization phase. Aligning structural lattice..." },
          { delay: 5500, progress: 100, log: "[Refining] Essence fully crystallized. De-activating cooling systems. Process complete." }
        ]
      : handler.name === 'ScripturalDecryption'
      ? [
          { delay: 1200, progress: 25, log: "[Decryption] Loading ancient Coptic and Latin dictionaries. Scanning fragment coordinates." },
          { delay: 2800, progress: 55, log: "[Decryption] Applying Hermeneutics model. Synthesizing missing gaps in papyrus thread patterns." },
          { delay: 4500, progress: 85, log: "[Decryption] Resolving cross-traditional comparisons (Gnostic vs Kabbalistic Ein Sof models)." },
          { delay: 6000, progress: 100, log: "[Decryption] Decryption verified against Cairo Genizah text structures. Output generated." }
        ]
      : handler.name === 'WorkflowCallback'
      ? [
          { delay: 1000, progress: 25, log: "[WorkflowCallback] Intercepting asynchronous callback event. Workflow token verified." },
          { delay: 2500, progress: 60, log: "[WorkflowCallback] Registering webhook state listener. Parsing input payload and callback token signature." },
          { delay: 4500, progress: 85, log: "[WorkflowCallback] Executing internal state reconciliation. Dispatching durable signal to listener queues." },
          { delay: 5500, progress: 100, log: "[WorkflowCallback] Callback handshake completed. Target workflow resumed successfully." }
        ]
      : handler.name === 'WorkflowCompletion'
      ? [
          { delay: 1200, progress: 20, log: `[WorkflowCompletion] Subscribing to history events for Workflow ID: ${input?.workflowId || 'unknown'}...` },
          { delay: 2800, progress: 50, log: `[WorkflowCompletion] Workflow is currently in RUNNING state. Watching for terminal execution tokens...` },
          { delay: 4500, progress: 80, log: `[WorkflowCompletion] Detected workflow closing sequence. Compiling final output payloads...` },
          { delay: 6000, progress: 100, log: `[WorkflowCompletion] Workflow execution concluded. Dispatched terminal notification to Nexus.` }
        ]
      : [
          { delay: 1000, progress: 30, log: "[SayHello] Directing aetheric pathways. Harmonizing voice frequencies." },
          { delay: 2500, progress: 65, log: "[SayHello] Aligning vocal resonances with standard Enochian greeting formats." },
          { delay: 4000, progress: 100, log: "[SayHello] Greeting fully synthesized and propagated through the Nexus." }
        ];

    // Schedule progressive logs
    steps.forEach((step, idx) => {
      const t = setTimeout(() => {
        const currentOp = this.activeOperations.get(opId);
        if (!currentOp || currentOp.state === 'CANCELED' || currentOp.state === 'FAILED' || currentOp.state === 'SUCCEEDED') {
          return;
        }

        const context = this.getOperationContext(opId);
        if (context.HandlerContext.IsCancellationRequested) {
          currentOp.state = 'CANCELED';
          currentOp.logTrace.push(`[Handler] Checked context.HandlerContext.IsCancellationRequested: True`);
          currentOp.logTrace.push(`[Handler] Detected active cancellation signal inside operation handler.`);
          if (handler.name === 'SayHello') {
            currentOp.logTrace.push(`[Error] Throwing NexusOperationException with NonRetryableFailure (OperationCancelled) indicating that the operation was cancelled.`);
          }
          currentOp.logTrace.push(`[Handler] Gracefully aborting ongoing workflow operations and releasing resources.`);
          currentOp.logTrace.push(`[Worker] Cleaned up temporal caches and terminated task thread.`);
          currentOp.logTrace.push(`[Nexus] Operation successfully transitioned to terminal state 'CANCELED'.`);
          currentOp.lastUpdatedTime = new Date().toISOString();

          // Dispatch callback for CANCELED
          const cb = this.callbackCallbacks.get(opId);
          if (cb) {
            currentOp.logTrace.push(`[Callback] Outgoing callback triggered with status 'CANCELED'.`);
            cb({ id: opId, state: 'CANCELED', error: 'Operation canceled by user command.' });
          }
          return;
        }

        // Intercept and inject error if simulating ResonantVesselRefining failure
        if (handler.name === 'ResonantVesselRefining') {
          const inputData = input as RefiningInput;
          if (step.progress === 45 && inputData.triggerErrorMode === 'retryable') {
            currentOp.state = 'FAILED';
            currentOp.progress = 45;
            currentOp.errorType = 'retryable';
            currentOp.errorMessage = "Transient heater frequency drift detected in vessel chamber during crystallization.";
            currentOp.logTrace.push(`[Error] [NexusRetryableException] ${currentOp.errorMessage} (Backoff recommended: 2000ms)`);
            currentOp.logTrace.push(`[Worker] Asynchronous task failed with a RETRYABLE exception.`);
            currentOp.logTrace.push(`[Nexus] Operation status marked as FAILED (Retryable).`);
            currentOp.lastUpdatedTime = new Date().toISOString();

            // Cancel any remaining timers in this operation
            const opTimers = this.timers.get(opId);
            if (opTimers) {
              opTimers.forEach(timer => clearTimeout(timer));
              this.timers.delete(opId);
            }

            // Dispatch callback with failure
            const cb = this.callbackCallbacks.get(opId);
            if (cb) {
              currentOp.logTrace.push(`[Callback] Webhook notification dispatched with failure state 'FAILED'.`);
              cb({ id: opId, state: 'FAILED', error: currentOp.errorMessage });
            }
            return;
          }

          if (step.progress === 75 && inputData.triggerErrorMode === 'non_retryable') {
            currentOp.state = 'FAILED';
            currentOp.progress = 75;
            currentOp.errorType = 'non_retryable';
            currentOp.errorMessage = "Permanent alchemical vessel structural fracture detected. Refinement vessel destroyed.";
            currentOp.logTrace.push(`[Error] [NexusNonRetryableException] ${currentOp.errorMessage} (Non-retryable/Fatal error)`);
            currentOp.logTrace.push(`[Worker] Asynchronous task failed with a FATAL NON-RETRYABLE exception.`);
            currentOp.logTrace.push(`[Nexus] Operation status marked as FAILED (Non-retryable).`);
            currentOp.lastUpdatedTime = new Date().toISOString();

            // Cancel any remaining timers in this operation
            const opTimers = this.timers.get(opId);
            if (opTimers) {
              opTimers.forEach(timer => clearTimeout(timer));
              this.timers.delete(opId);
            }

            // Dispatch callback with failure
            const cb = this.callbackCallbacks.get(opId);
            if (cb) {
              currentOp.logTrace.push(`[Callback] Webhook notification dispatched with failure state 'FAILED'.`);
              cb({ id: opId, state: 'FAILED', error: currentOp.errorMessage });
            }
            return;
          }
        }

        // Intercept and inject error if simulating SayHello failure
        if (handler.name === 'SayHello') {
          const inputData = input as SayHelloInput;
          if (step.progress === 65 && inputData.triggerErrorMode === 'retryable') {
            currentOp.state = 'FAILED';
            currentOp.progress = 65;
            currentOp.errorType = 'retryable';
            currentOp.errorMessage = "Transient failure in underlying SayHelloWorkflow: Aetheric resonance frequency timeout during vocal synthesis.";
            currentOp.logTrace.push(`[Error] [NexusRetryableException] ${currentOp.errorMessage} (Backoff recommended: 3000ms)`);
            currentOp.logTrace.push(`[SayHelloWorkflow] Execution threw retryable exception: Temporal worker will apply backoff policy.`);
            currentOp.logTrace.push(`[Nexus] Operation status transitioned to 'FAILED' (Retryable).`);
            currentOp.lastUpdatedTime = new Date().toISOString();

            const opTimers = this.timers.get(opId);
            if (opTimers) {
              opTimers.forEach(timer => clearTimeout(timer));
              this.timers.delete(opId);
            }

            const cb = this.callbackCallbacks.get(opId);
            if (cb) {
              currentOp.logTrace.push(`[Callback] Webhook notification dispatched with failure state 'FAILED'.`);
              cb({ id: opId, state: 'FAILED', error: currentOp.errorMessage });
            }
            return;
          }

          if (step.progress === 65 && inputData.triggerErrorMode === 'non_retryable') {
            currentOp.state = 'FAILED';
            currentOp.progress = 65;
            currentOp.errorType = 'non_retryable';
            currentOp.errorMessage = "Fatal application failure in underlying SayHelloWorkflow: Target entity does not exist in celestial registry.";
            currentOp.logTrace.push(`[Error] [NexusNonRetryableException] ${currentOp.errorMessage} (Non-retryable/Fatal error)`);
            currentOp.logTrace.push(`[SayHelloWorkflow] Execution threw non-retryable exception: Permanent application error.`);
            currentOp.logTrace.push(`[Nexus] Operation status transitioned to 'FAILED' (Non-retryable).`);
            currentOp.lastUpdatedTime = new Date().toISOString();

            const opTimers = this.timers.get(opId);
            if (opTimers) {
              opTimers.forEach(timer => clearTimeout(timer));
              this.timers.delete(opId);
            }

            const cb = this.callbackCallbacks.get(opId);
            if (cb) {
              currentOp.logTrace.push(`[Callback] Webhook notification dispatched with failure state 'FAILED'.`);
              cb({ id: opId, state: 'FAILED', error: currentOp.errorMessage });
            }
            return;
          }
        }

        currentOp.progress = step.progress;
        currentOp.logTrace.push(step.log);
        currentOp.lastUpdatedTime = new Date().toISOString();

        if (step.progress === 100) {
          // Finalize success
          currentOp.state = 'SUCCEEDED';
          currentOp.logTrace.push(`[Nexus] Operation completed. State changed to 'SUCCEEDED'.`);
          
          let result: any = {};
          if (handler.name === 'AethericTransmutation') {
            const inputData = input as TransmutationInput;
            const purity = parseFloat((95.5 + Math.random() * 4.3).toFixed(2));
            const yieldAmt = parseFloat((inputData.massGrams * (purity / 100) * 0.52).toFixed(3));
            result = {
              goldYieldGrams: yieldAmt,
              purityPercent: purity,
              aethericResonance: inputData.targetResonance,
              transmutedMaterial: `Subtle Philosopher's Gold (transmuted from ${inputData.baseMaterial})`
            };
          } else if (handler.name === 'ResonantVesselRefining') {
            const inputData = input as RefiningInput;
            result = {
              purityCoefficient: parseFloat((0.978 + Math.random() * 0.021).toFixed(4)),
              crystallizedEssenceGrams: parseFloat((inputData.targetTemperature * 0.045 + Math.random() * 4).toFixed(2)),
              finalTemperature: inputData.targetTemperature
            };
          } else if (handler.name === 'ScripturalDecryption') {
            const inputData = input as DecryptionInput;
            const confidence = Math.floor(88 + Math.random() * 11);
            result = {
              decryptedText: `[Restored] What is below is like what is above, and what is above is like what is below, to accomplish the miracles of the One Thing.`,
              confidenceScore: confidence,
              thematicCrossOver: `Crossover: Bridges the Hermetic Emerald Tablet lines directly with Jacob Boehme's Seven Qualities of Eternal Nature.`
            };
          } else if (handler.name === 'WorkflowCallback') {
            const inputData = input as WorkflowCallbackInput;
            result = {
              status: 'COMPLETED_ASYNC',
              processedAt: new Date().toISOString(),
              acknowledgement: `Durable callback handshake processed asynchronously. Workflow "${inputData.workflowId}" with token "${inputData.callbackToken}" successfully resumed.`
            };
          } else if (handler.name === 'WorkflowCompletion') {
            const inputData = input as WorkflowCompletionInput;
            result = {
              status: 'COMPLETED_ASYNC',
              workflowId: inputData.workflowId,
              completedAt: new Date().toISOString(),
              resultSummary: `Durable asynchronous poll completed. Workflow "${inputData.workflowId}" successfully completed execution in the celestial cluster (targetState: ${inputData.targetState || 'COMPLETED'}).`
            };
          } else {
            const inputData = input as SayHelloInput;
            result = {
              greeting: `Divine salutations, ${inputData.name || 'Seeker'}. The seven stars welcome your query.`,
              timestamp: new Date().toISOString()
            };
          }

          this.operationResults.set(opId, result);
          currentOp.logTrace.push(`[Nexus] Dispatched success response payload to client.`);

          // Dispatch callback
          const cb = this.callbackCallbacks.get(opId);
          if (cb) {
            currentOp.logTrace.push(`[Callback] Outgoing webhook POST triggered to: ${options.callbackUrl}`);
            currentOp.logTrace.push(`[Callback] Response 200 OK received from callback server.`);
            cb({ id: opId, state: 'SUCCEEDED', result });
          }
        }
      }, step.delay);

      opTimers.push(t);
    });
  }

  /**
   * Cancel an ongoing asynchronous operation.
   */
  public async cancelOperation(opId: string, reason?: string): Promise<void> {
    const opInfo = this.activeOperations.get(opId);
    if (!opInfo) {
      throw new Error(`Operation with ID ${opId} not found.`);
    }

    if (opInfo.state === 'SUCCEEDED' || opInfo.state === 'FAILED' || opInfo.state === 'CANCELED') {
      opInfo.logTrace.push(`[Nexus] Warning: Cancel requested, but operation is already in terminal state: ${opInfo.state}`);
      return;
    }

    opInfo.logTrace.push(`[Nexus] Cancellation command received from caller.${reason ? ` Reason: "${reason}"` : ''}`);

    const context = this.getOperationContext(opId);

    // Route to handler-specific cancel method if implemented
    const handler = this.getOperationHandler(opInfo.name || 'SayHello');
    if (handler && typeof (handler as any).cancel === 'function') {
      await (handler as any).cancel(opId, (log: string) => opInfo.logTrace.push(log), context);
    }

    opInfo.logTrace.push(`[Nexus] Routing cancellation request via context.Cancel() mechanism...`);
    opInfo.lastUpdatedTime = new Date().toISOString();

    // Trigger cancellation on context
    context.Cancel(reason);
  }

  /**
   * Query the current status of an operation (polling endpoint).
   */
  public getOperationInfo(opId: string): OperationInfo | null {
    return this.activeOperations.get(opId) || null;
  }

  /**
   * Retrieve the final result of a succeeded operation.
   */
  public getOperationResult(opId: string): any {
    return this.operationResults.get(opId) || null;
  }

  /**
   * List all operations managed by the service.
   */
  public listOperations(): OperationInfo[] {
    return Array.from(this.activeOperations.values()).sort((a, b) => 
      new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
    );
  }

  /**
   * Purge log trace and database
   */
  public clearOperations() {
    this.activeOperations.clear();
    this.operationResults.clear();
    this.timers.forEach(timers => timers.forEach(t => clearTimeout(t)));
    this.timers.clear();
    this.callbackCallbacks.clear();
  }

  /**
   * Retrieves an operation handler by name.
   * Demonstrates returning an IOperationHandler instance capable of managing long-running tasks
   * and supporting asynchronous execution, polling, callbacks, and cancellations.
   */
  public getOperationHandler<I, O>(operationName: string): IOperationHandler<I, O> | null {
    if (operationName === 'AethericTransmutation') {
      return AethericTransmutationOperation as unknown as IOperationHandler<I, O>;
    }
    if (operationName === 'ResonantVesselRefining') {
      return ResonantVesselRefiningOperation as unknown as IOperationHandler<I, O>;
    }
    if (operationName === 'ScripturalDecryption') {
      return ScripturalDecryptionOperation as unknown as IOperationHandler<I, O>;
    }
    if (operationName === 'SayHello') {
      return SayHelloNexusServiceHandler.createHandler() as unknown as IOperationHandler<I, O>;
    }
    if (operationName === 'WorkflowCallback') {
      return WorkflowCallbackOperationHandler as unknown as IOperationHandler<I, O>;
    }
    if (operationName === 'WorkflowCompletion') {
      return WorkflowCompletionOperationHandler as unknown as IOperationHandler<I, O>;
    }
    return null;
  }

  // --- Caller Workflow Simulation Engine ---
  private activeSimulations: Map<string, WorkflowSimulation> = new Map();

  public getSimulation(simId: string): WorkflowSimulation | null {
    return this.activeSimulations.get(simId) || null;
  }

  public listSimulations(): WorkflowSimulation[] {
    return Array.from(this.activeSimulations.values());
  }

  public clearSimulations() {
    this.activeSimulations.clear();
  }

  public cancelWorkflowSimulation(simId: string) {
    const sim = this.activeSimulations.get(simId);
    if (sim) {
      sim.isCancellationRequested = true;
      if (sim.activeOperationId) {
        this.cancelOperation(sim.activeOperationId, "Cancelled by caller workflow CancellationToken.");
      }
    }
  }

  /**
   * Helper factory to create an IOperationHandle for client/workflow polling and control.
   */
  public createOperationHandle<I, O>(opId: string): IOperationHandle<I, O> {
    const info = this.getOperationInfo(opId);
    const completionListeners: Array<(result: NexusAsyncOperationResult<O>) => void> = [];

    // Register internal completion callback hook
    if (!this.callbackCallbacks.has(opId)) {
      this.callbackCallbacks.set(opId, (payload: any) => {
        const asyncRes: NexusAsyncOperationResult<O> = {
          operationId: opId,
          state: payload.state,
          result: payload.result,
          error: payload.error,
          completedAt: new Date().toISOString()
        };
        completionListeners.forEach(fn => {
          try { fn(asyncRes); } catch (e) { console.error('Error in onCompletion listener:', e); }
        });
      });
    } else {
      const existingCb = this.callbackCallbacks.get(opId)!;
      this.callbackCallbacks.set(opId, (payload: any) => {
        existingCb(payload);
        const asyncRes: NexusAsyncOperationResult<O> = {
          operationId: opId,
          state: payload.state,
          result: payload.result,
          error: payload.error,
          completedAt: new Date().toISOString()
        };
        completionListeners.forEach(fn => {
          try { fn(asyncRes); } catch (e) { console.error('Error in onCompletion listener:', e); }
        });
      });
    }

    const handle: IOperationHandle<I, O> = {
      id: opId,
      name: info?.name || 'NexusOperation',
      status: info?.state || 'PENDING',
      initialState: info?.state || 'PENDING',
      getStatusAsync: async (): Promise<NexusOperationStatus<O>> => {
        const currentInfo = this.getOperationInfo(opId);
        const result = this.getOperationResult(opId);
        if (!currentInfo) {
          return {
            id: opId,
            name: info?.name || 'NexusOperation',
            state: 'FAILED',
            createdTime: new Date().toISOString(),
            lastUpdatedTime: new Date().toISOString(),
            progress: 0,
            logTrace: ['[Error] Operation metadata not found.']
          };
        }
        return {
          ...currentInfo,
          result
        };
      },
      getInfoAsync: async () => this.getOperationInfo(opId),
      getResultAsync: async () => this.getOperationResult(opId),
      cancelAsync: async () => this.cancelOperation(opId),
      onCompletion: (callback: (result: NexusAsyncOperationResult<O>) => void) => {
        completionListeners.push(callback);
        // If operation has already reached terminal state, invoke callback immediately
        const current = this.getOperationInfo(opId);
        if (current && (current.state === 'SUCCEEDED' || current.state === 'FAILED' || current.state === 'CANCELED')) {
          const res = this.getOperationResult(opId);
          setTimeout(() => {
            callback({
              operationId: opId,
              state: current.state,
              result: res,
              error: current.errorMessage || undefined,
              completedAt: current.lastUpdatedTime
            });
          }, 0);
        }
      },
      awaitCompletionAsync: async (pollIntervalMs = 500) => {
        while (true) {
          const current = this.getOperationInfo(opId);
          if (current?.state === 'SUCCEEDED') {
            return this.getOperationResult(opId);
          }
          if (current?.state === 'FAILED') {
            throw new NexusOperationException(current.errorMessage || `Operation ${opId} failed.`, info?.name || 'NexusOperation');
          }
          if (current?.state === 'CANCELED') {
            throw new NexusOperationException(`Operation ${opId} was canceled.`, info?.name || 'NexusOperation');
          }
          await new Promise(res => setTimeout(res, pollIntervalMs));
        }
      },
      onProgress: (callback: (progress: number, logMessage: string) => void) => {
        const intervalId = setInterval(() => {
          const current = this.getOperationInfo(opId);
          if (current) {
            callback(current.progress, current.logTrace[current.logTrace.length - 1] || '');
            if (current.state === 'SUCCEEDED' || current.state === 'FAILED' || current.state === 'CANCELED') {
              clearInterval(intervalId);
            }
          }
        }, 200);
      }
    };

    return handle;
  }

  /**
   * Initiates a durable simulation of a Caller Workflow scheduling a Nexus Operation (SayHello or ResonantVesselRefining).
   * Demonstrates catching custom retryable and non-retryable exceptions in the caller,
   * supports both status polling and callback-driven execution patterns, and executes appropriate workflow reactions.
   */
  public async startWorkflowSimulation(
    input: RefiningInput | SayHelloInput,
    onStepUpdate: (sim: WorkflowSimulation) => void,
    operationName: 'ResonantVesselRefining' | 'SayHello' = 'ResonantVesselRefining',
    pattern: 'polling' | 'callback' = 'polling',
    callbackUrl: string = 'http://caller.internal/oracle-webhook'
  ): Promise<string> {
    const simId = `wf-sim-${Math.random().toString(36).substring(2, 9)}`;
    const sim: WorkflowSimulation = {
      id: simId,
      status: 'RUNNING',
      operationName,
      pattern,
      callbackUrl,
      input,
      steps: [],
      currentAttempt: 1,
      maxAttempts: 3
    };

    const addStep = (message: string, type: 'info' | 'warn' | 'error' | 'success' = 'info') => {
      sim.steps.push({
        timestamp: new Date().toLocaleTimeString(),
        message,
        type
      });
      // Fire UI update
      onStepUpdate({ ...sim });
    };

    this.activeSimulations.set(simId, sim);

    if (operationName === 'SayHello') {
      const sayHelloIn = input as SayHelloInput;
      addStep(`🎬 [Caller Workflow] Initiated 'CelestialGreetingOrchestrator' Caller Workflow (${pattern.toUpperCase()} pattern).`, 'info');
      addStep(`📥 [Caller] Load variables: Target Name = "${sayHelloIn.name || sayHelloIn.Name || 'Seeker'}", Language = "${sayHelloIn.language || 'Default'}", Mode = ${pattern}.`, 'info');
    } else {
      const refIn = input as RefiningInput;
      addStep(`🎬 [Caller Workflow] Initiated 'ResonantEssenceExtraction' Caller Workflow Orchestrator (${pattern.toUpperCase()} pattern).`, 'info');
      addStep(`📥 [Caller] Load variables: Vessel Type = ${refIn.vesselType}, Target Temperature = ${refIn.targetTemperature}°C, Mode = ${pattern}.`, 'info');
    }

    // Run execution in background (asynchronous caller workflow thread)
    this.executeWorkflowOrchestrationLoop(sim, addStep, onStepUpdate);

    return simId;
  }

  private async executeWorkflowOrchestrationLoop(
    sim: WorkflowSimulation,
    addStep: (message: string, type: 'info' | 'warn' | 'error' | 'success') => void,
    onStepUpdate: (sim: WorkflowSimulation) => void
  ) {
    let keepRunning = true;
    let currentMode = sim.input.triggerErrorMode || 'none';
    const opName = sim.operationName || 'ResonantVesselRefining';
    const isCallback = sim.pattern === 'callback';

    while (keepRunning) {
      if (sim.isCancellationRequested) {
        addStep(`⏹️ [Caller Workflow] Caller cancellation token triggered prior to attempt! Halted caller workflow execution.`, 'warn');
        sim.status = 'CANCELED';
        break;
      }

      addStep(`🚀 [Caller Workflow Thread] [Attempt #${sim.currentAttempt}/${sim.maxAttempts}] Scheduling durable Nexus Operation '${opName}' via ${sim.pattern} pattern...`, 'info');
      
      try {
        const options: OperationStartOptions = {
          isAsync: true,
          callbackUrl: isCallback ? (sim.callbackUrl || 'http://caller.internal/oracle-webhook') : undefined,
          requestId: `req-sim-${sim.id}-${sim.currentAttempt}`
        };

        const currentInput = {
          ...sim.input,
          triggerErrorMode: currentMode
        };

        const handler = (opName === 'SayHello' ? SayHelloOperation : ResonantVesselRefiningOperation) as NexusOperationHandler<any, any>;

        let callbackFired = false;
        let callbackPayload: any = null;

        const handleSimCallback = (payload: any) => {
          callbackFired = true;
          callbackPayload = payload;
          addStep(`📩 [Caller Callback Handler] Webhook POST received from Nexus Service! State: ${payload.state}`, 'info');
        };

        // Start operation using standard Nexus awaitable pattern
        const result = await this.startOperation(
          handler,
          currentInput,
          options,
          isCallback ? handleSimCallback : undefined
        );

        sim.activeOperationId = result.id;
        onStepUpdate({ ...sim });

        if (isCallback) {
          addStep(`🔗 [Caller Workflow Thread] Nexus operation registered with callback hook '${options.callbackUrl}'. Issued token: ${result.id}. Awaiting webhook completion payload...`, 'info');
        } else {
          addStep(`🔗 [Caller Workflow Thread] Nexus scheduling acknowledged. Issued operation token: ${result.id}. Awaiting terminal state via polling...`, 'info');
        }

        let operationTerminated = false;
        let info: OperationInfo | null = null;

        while (!operationTerminated) {
          // Check for workflow cancellation
          if (sim.isCancellationRequested) {
            addStep(`⏹️ [Caller Workflow] Caller cancellation token triggered! Sending cancellation signal to Nexus Operation via handle.CancelAsync() for token ${result.id}...`, 'warn');
            await this.cancelOperation(result.id, "Caller workflow CancellationToken requested cancellation.");
            operationTerminated = true;
            keepRunning = false;
            sim.status = 'CANCELED';
            break;
          }

          // Poll/Await step every 1.5s inside simulation
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          if (sim.isCancellationRequested) continue; // Skip to cancellation logic on next tick

          info = this.getOperationInfo(result.id);
          if (!info) {
            addStep(`⚠️ [Caller Workflow Thread] Could not retrieve operation metadata for token ${result.id}. Retrying check...`, 'warn');
            break;
          }

          if (isCallback) {
            addStep(`🔔 [Workflow Callback Listener] Awaiting async webhook trigger... Current progress: ${info.progress}%.`, 'info');
          } else {
            addStep(`👀 [Workflow Await Poller] GET /api/operations/${result.id} -> State: ${info.state} (${info.progress}% complete).`, 'info');
          }

          if (info.state === 'SUCCEEDED') {
            operationTerminated = true;
            const res = this.getOperationResult(result.id);
            addStep(`🎉 [Caller Workflow Thread] Nexus Operation completed successfully!`, 'success');
            if (isCallback) {
              addStep(`✅ [Callback Processing] Deserialized result payload from webhook notification.`, 'success');
            }
            if (opName === 'SayHello') {
              addStep(`📦 [Caller] Greeting response retrieved: "${res?.greeting}" (Timestamp: ${res?.timestamp})`, 'success');
            } else {
              addStep(`📦 [Caller] Output parameters retrieved: Purity = ${(res?.purityCoefficient * 100).toFixed(2)}%, Essence Yield = ${res?.crystallizedEssenceGrams}g, Chamber Temp = ${res?.finalTemperature}°C.`, 'success');
            }
            sim.status = 'COMPLETED';
            keepRunning = false;
          } else if (info.state === 'FAILED') {
            operationTerminated = true;
            addStep(`❌ [Caller Workflow Thread] Nexus Operation '${opName}' failed in target namespace 'celestial-sanctum'. Propagating error across namespace boundary...`, 'error');
            
            const isRetryable = info.errorType === 'retryable';
            const errorMsg = info.errorMessage || "Unknown operation failure.";

            if (isRetryable) {
              addStep(`⚠️ [Caller Exception Handler] CAUGHT RETRYABLE EXCEPTION: "${errorMsg}"`, 'warn');
              if (sim.currentAttempt < sim.maxAttempts) {
                addStep(`🔁 [Caller Exception Handler] REACTION: Temporal retry policy triggered. Backing off 2000ms before re-executing '${opName}' operation...`, 'info');
                sim.currentAttempt++;
                
                // On retry, heal the simulation so the next run succeeds (simulating a transient failure that is auto-resolved)
                currentMode = 'none';
                
                await new Promise(resolve => setTimeout(resolve, 2000));
                addStep(`🔄 [Caller Exception Handler] Backoff finished. Re-executing Nexus Operation '${opName}' handler...`, 'info');
              } else {
                addStep(`🚨 [Caller Exception Handler] REACTION: Maximum retry threshold (${sim.maxAttempts}) reached for '${opName}'. Escalating to Gnostic Fallback Protocol...`, 'error');
                addStep(`🛡️ [Fallback Protocol] Redirecting refining process to backup alchemical sanctuary locally...`, 'info');
                await new Promise(resolve => setTimeout(resolve, 1000));
                addStep(`✅ [Fallback Protocol] Fallback completed. Refining finalized in backup sanctuary with purity 88.0%.`, 'success');
                sim.status = 'COMPLETED';
                keepRunning = false;
              }
            } else {
              addStep(`🚨 [Caller Exception Handler] CAUGHT FATAL NON-RETRYABLE EXCEPTION: "${errorMsg}"`, 'error');
              addStep(`🛑 [Caller Exception Handler] REACTION: Operation is flagged as NON-RETRYABLE (Fatal). Initiating Gnostic Fallback Protocol...`, 'warn');
              addStep(`🛡️ [Fallback Protocol] Executing backup Gnostic ritual locally. Transmuting lead ingot using secondary Gnostic frequency matcher...`, 'info');
              await new Promise(resolve => setTimeout(resolve, 1000));
              addStep(`✅ [Fallback Protocol] Gnostic Fallback completed successfully with purity 74.2% (reduced target resonance).`, 'success');
              sim.status = 'COMPLETED';
              keepRunning = false;
            }
          } else if (info.state === 'CANCELED') {
            operationTerminated = true;
            addStep(`⏹️ [Caller Workflow Thread] Operation '${opName}' was canceled. Caught OperationCanceledException. Halting caller workflow execution cleanly.`, 'warn');
            sim.status = 'CANCELED';
            keepRunning = false;
          }
        }

      } catch (err: any) {
        if (sim.isCancellationRequested) {
          addStep(`⏹️ [Caller Workflow] Caller cancellation token triggered during invocation! Halted.`, 'warn');
          sim.status = 'CANCELED';
          break;
        }

        const isRetryable = err instanceof NexusRetryableException || err?.isRetryable === true;
        if (isRetryable) {
          addStep(`⚠️ [Caller Exception Handler] CAUGHT RETRYABLE EXCEPTION ON START: "${err.message}"`, 'warn');
          if (sim.currentAttempt < sim.maxAttempts) {
            addStep(`🔁 [Caller Exception Handler] REACTION: Retrying operation start (Attempt #${sim.currentAttempt + 1}/${sim.maxAttempts})...`, 'info');
            sim.currentAttempt++;
            currentMode = 'none';
            await new Promise(resolve => setTimeout(resolve, 2000));
          } else {
            addStep(`🚨 [Caller Exception Handler] REACTION: Maximum retries reached on operation start. Initiating Gnostic Fallback Protocol...`, 'error');
            addStep(`🛡️ [Fallback Protocol] Activating local alchemical battery fallback...`, 'info');
            await new Promise(resolve => setTimeout(resolve, 1000));
            addStep(`✅ [Fallback Protocol] Fallback completed with safe local yield.`, 'success');
            sim.status = 'COMPLETED';
            keepRunning = false;
          }
        } else {
          addStep(`❌ [Caller Workflow Thread] Nexus scheduling exception (Fatal Non-Retryable) in target namespace: ${err.message}`, 'error');
          addStep(`🛑 [Caller Exception Handler] REACTION: Non-retryable error on start. Initiating Gnostic Fallback Protocol...`, 'warn');
          addStep(`🛡️ [Fallback Protocol] Invoking emergency local containment and local transmutation...`, 'info');
          await new Promise(resolve => setTimeout(resolve, 1000));
          addStep(`✅ [Fallback Protocol] Fallback completed. Refined material contained locally with reduced density.`, 'success');
          sim.status = 'COMPLETED';
          keepRunning = false;
        }
      }
    }

    onStepUpdate({ ...sim });
  }
}

export const globalNexusService = new TemporalNexusService();
