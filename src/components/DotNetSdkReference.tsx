/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Code, 
  Terminal, 
  Cpu, 
  Copy, 
  Check, 
  ArrowRight, 
  Info, 
  ShieldCheck, 
  HelpCircle,
  FileCode,
  Activity
} from 'lucide-react';

interface DotNetSdkReferenceProps {
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

export default function DotNetSdkReference({ activeTheme }: DotNetSdkReferenceProps) {
  const [activeSubTab, setActiveSubTab] = useState<'contracts' | 'handler' | 'client' | 'workflow' | 'errors' | 'cancellation' | 'java-env' | 'native-messaging' | 'observability'>('contracts');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const nativeMessagingCode = `// 1. Minimal Manifest V3 Example (Required Keys: manifest_version, name, version)
{
  "manifest_version": 3,
  "name": "Minimal Manifest",
  "version": "1.0.0",
  "description": "A basic example extension with only required keys",
  "icons": {
    "48": "images/icon-48.png",
    "128": "images/icon-128.png"
  }
}

// 2. Full Extension manifest.json (Manifest V3 with Native Messaging)
{
  "name": "My extension",
  "version": "1.0.0",
  "manifest_version": 3,
  "description": "WebExtension manifest configured with native messaging and web-accessible resources.",
  "permissions": [
    "nativeMessaging"
  ],
  "web_accessible_resources": [
    {
      "resources": [ "logo.png", "assets/*" ],
      "matches": [ "https://*/*" ]
    }
  ],
  "background": {
    "service_worker": "background.js"
  }
}

// 2. Fetching & inspecting manifest at runtime via getManifest():
const manifest = chrome.runtime.getManifest(); 
// Cross-browser WebExtension syntax: const manifest = browser.runtime.getManifest();

console.log("Extension Name:", manifest.name);
console.log("Manifest Version:", manifest.manifest_version);
console.log("Active Permissions:", manifest.permissions);
console.log("Web Accessible Resources:", manifest.web_accessible_resources);

// 3. Resolving packaged asset URLs via chrome.runtime.getURL():
{ // Scope block used to avoid setting global variables
  const img = document.createElement('img');
  img.src = chrome.runtime.getURL('logo.png');
  document.body.append(img);
}

// 4. Inspecting platform architecture via chrome.runtime.getPlatformInfo():
// API Signature: chrome.runtime.getPlatformInfo(): Promise<PlatformInfo>
async function queryExtensionPlatform() {
  const platformInfo = await chrome.runtime.getPlatformInfo();
  console.log("Host Platform OS & Arch:", platformInfo.os, platformInfo.arch);
  // Returns: { os: "mac" | "win" | "cros" | "linux" | "openbsd" | "fuchsia", arch: "x86-32" | "x86-64" | "arm" | "arm64" }
}
queryExtensionPlatform();

if (manifest.permissions?.includes("nativeMessaging")) {
  // Open bi-directional stdio pipe with registered native IPC host
  const port = chrome.runtime.connectNative("com.my_company.my_application");
  port.onMessage.addListener((response) => {
    console.log("Native host IPC response:", response);
  });
  port.postMessage({ command: "INSPECT_ALCHEMICAL_RESONANCE", massGrams: 500 });
}

// 5. Native Host Manifest Registration (com.my_company.my_application.json)
{
  "name": "com.my_company.my_application",
  "description": "Native Host Bridge for Local Execution & Nexus IPC Gateway",
  "path": "C:\\\\Program Files\\\\MyApplication\\\\chrome_native_host.exe",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://knldjhhbcgopydicidgnkggoebhoomqa/"
  ]
}`;

  const contractsCode = `namespace Temporal.Nexus.Sdk
{
    public enum OperationState
    {
        Pending,
        Running,
        Succeeded,
        Failed,
        Canceled
    }

    public record OperationInfo(
        string Id,
        string Name,
        OperationState State,
        DateTime CreatedTime,
        DateTime LastUpdatedTime,
        double Progress, // 0 to 100
        List<string> LogTrace
    );

    public record OperationStartOptions(
        string RequestId = null,
        string CallbackUrl = null,
        bool IsAsync = true
    );

    /// <summary>
    /// Represents an asynchronous handle to a running Nexus Operation.
    /// Can be polled for status, cancelled, or awaited until completion.
    /// </summary>
    public interface IOperation<TInput, TOutput>
    {
        string Id { get; }
        string Name { get; }
        OperationState InitialState { get; }

        /// <summary>
        /// Retrieves current execution metadata, progress and log trace.
        /// </summary>
        Task<OperationInfo> GetInfoAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Retrieves the final result of the operation if succeeded.
        /// Throws if the operation failed, was canceled, or is still running.
        /// </summary>
        Task<TOutput> GetResultAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Dispatches a cancellation command to gracefully terminate the operation.
        /// </summary>
        Task CancelAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Awaits the final outcome of the operation by polling the state automatically.
        /// </summary>
        Task<TOutput> AwaitCompletionAsync(TimeSpan? pollInterval = null, CancellationToken cancellationToken = default);
    }

    public interface IOperationStateUpdater
    {
        /// <summary>
        /// Atomically updates background execution state, progress percentage, and logging traces.
        /// </summary>
        Task UpdateStateAsync(OperationState state, double progress, string logMessage, object result = null);
    }

    public class HandlerContext
    {
        public bool IsCancellationRequested { get; set; }
        public void Cancel() => IsCancellationRequested = true;
    }

    public class NexusOperationContext
    {
        public HandlerContext HandlerContext { get; set; } = new();
        public void Cancel() => HandlerContext.Cancel();
    }

    public interface IOperationHandler<TInput, TOutput>
    {
        string Name { get; }
        string Description { get; }

        /// <summary>
        /// Begins operation execution. Uses async/await to initiate.
        /// If options.IsAsync is false, completes synchronously.
        /// </summary>
        Task<OperationStartResult<TOutput>> StartAsync(
            string operationId,
            TInput input,
            OperationStartOptions options,
            IOperationStateUpdater updater,
            NexusOperationContext context,
            CancellationToken cancellationToken
        );

        /// <summary>
        /// Signal ongoing background execution cancellation gracefully.
        /// </summary>
        Task CancelAsync(string operationId, CancellationToken cancellationToken);
    }

    public record OperationStartResult<TOutput>(
        string Id,
        OperationState State,
        TOutput Result = default
    );

    public class NexusClient
    {
        private readonly string _endpoint;
        
        public NexusClient(string endpoint)
        {
            _endpoint = endpoint;
        }

        /// <summary>
        /// Launches a Nexus Operation. Returns a handle supporting polling and asynchronous awaiting.
        /// </summary>
        public async Task<IOperation<TInput, TOutput>> StartOperationAsync<TInput, TOutput>(
            string operationName,
            TInput input,
            OperationStartOptions options = null,
            CancellationToken cancellationToken = default)
        {
            // Internal dispatch, returns the implemented IOperation handle
            return new NexusOperationHandle<TInput, TOutput>(this, "op-id-123", operationName, OperationState.Pending);
        }

        internal Task<OperationInfo> GetOperationInfoAsync(string operationId) => Task.FromResult<OperationInfo>(null);
        internal Task<TResult> GetOperationResultAsync<TResult>(string operationId) => Task.FromResult<TResult>(default);
        internal Task CancelOperationAsync(string operationId) => Task.CompletedTask;
    }

    internal class NexusOperationHandle<TInput, TOutput> : IOperation<TInput, TOutput>
    {
        private readonly NexusClient _client;

        public string Id { get; }
        public string Name { get; }
        public OperationState InitialState { get; }

        public NexusOperationHandle(NexusClient client, string id, string name, OperationState initialState)
        {
            _client = client;
            Id = id;
            Name = name;
            InitialState = initialState;
        }

        public Task<OperationInfo> GetInfoAsync(CancellationToken cancellationToken = default) => 
            _client.GetOperationInfoAsync(Id);

        public Task<TOutput> GetResultAsync(CancellationToken cancellationToken = default) => 
            _client.GetOperationResultAsync<TOutput>(Id);

        public Task CancelAsync(CancellationToken cancellationToken = default) => 
            _client.CancelOperationAsync(Id);

        public async Task<TOutput> AwaitCompletionAsync(TimeSpan? pollInterval = null, CancellationToken cancellationToken = default)
        {
            var interval = pollInterval ?? TimeSpan.FromSeconds(2);
            while (!cancellationToken.IsCancellationRequested)
            {
                var info = await GetInfoAsync(cancellationToken);
                if (info.State == OperationState.Succeeded)
                {
                    return await GetResultAsync(cancellationToken);
                }
                if (info.State == OperationState.Failed)
                {
                    throw new Exception($"Operation {Id} failed.");
                }
                if (info.State == OperationState.Canceled)
                {
                    throw new OperationCanceledException($"Operation {Id} was canceled.");
                }
                await Task.Delay(interval, cancellationToken);
            }
            throw new OperationCanceledException();
        }
    }

    public record SayHelloInput(string Name, string Language = null);
    public record SayHelloOutput(string Greeting, string Timestamp);

    public record WorkflowCallbackInput(string WorkflowId, string CallbackToken, string Payload);
    public record WorkflowCallbackOutput(string Status, string ProcessedAt, string Acknowledgement);

    /// <summary>
    /// Represents a completion Task or result wrapper for long-running Nexus processes.
    /// Provides the durable operation identifier, status poll endpoint, callback registration, and the awaitable completion Task.
    /// </summary>
    public class NexusTaskCompletion<TResult>
    {
        public string OperationId { get; init; }
        public OperationState Status { get; init; }
        public string PollUrl { get; init; }
        public string CallbackUrl { get; init; }
        public DateTime StartedAt { get; init; }

        /// <summary>
        /// The completion Task representing the ongoing asynchronous long-running process.
        /// Callers can await this Task directly to receive the final result or catch exceptions.
        /// </summary>
        public Task<TResult> Task { get; init; }

        public NexusOperationResultWrapper<TResult> ResultWrapper { get; init; }

        public Func<CancellationToken, Task<OperationInfo>> GetStatusAsync { get; init; }
        public Func<CancellationToken, Task> CancelAsync { get; init; }
    }

    /// <summary>
    /// Strongly-typed Result Wrapper for asynchronous operations and long-running processes.
    /// Encapsulates execution state, progress, task completion handling, error tracking, and unwrapping.
    /// </summary>
    public class NexusOperationResultWrapper<TResult>
    {
        public string OperationId { get; init; }
        public OperationState Status { get; init; }
        public string PollUrl { get; init; }
        public string CallbackUrl { get; init; }
        public DateTime StartedAt { get; init; }
        public bool IsCompleted { get; init; }
        public bool IsSuccess { get; init; }
        public bool IsFaulted { get; init; }
        public bool IsCanceled { get; init; }
        public int Progress { get; init; }
        public TResult Result { get; init; }
        public string Error { get; init; }

        /// <summary>
        /// Awaitable Task completion representing the underlying long-running background process.
        /// </summary>
        public Task<TResult> CompletionTask { get; init; }

        public Task<TResult> UnwrapAsync() => CompletionTask;
    }

    /// <summary>
    /// Canonical Nexus Service Definition contract for Temporal Nexus Services.
    /// Declares service metadata and supports both synchronous and asynchronous operations.
    /// Includes interface methods that return a completion Task or result wrapper for long-running processes.
    /// </summary>
    public interface INexusServiceDefinition
    {
        string ServiceName { get; }
        string Endpoint { get; }
        string Description { get; }

        /// <summary>
        /// Interface method that starts a long-running asynchronous operation and returns a completion Task or result wrapper.
        /// Returns an identifier for the caller to poll, receive a callback, or await completion via Task.
        /// </summary>
        Task<NexusTaskCompletion<TOutput>> StartAsyncOperation<TInput, TOutput>(
            string operationName,
            TInput input,
            OperationStartOptions options = null,
            CancellationToken cancellationToken = default
        );

        /// <summary>
        /// Executes a long-running process asynchronously, returning a rich NexusOperationResultWrapper.
        /// </summary>
        Task<NexusOperationResultWrapper<TOutput>> ExecuteLongRunningProcess<TInput, TOutput>(
            string operationName,
            TInput input,
            OperationStartOptions options = null,
            IProgress<(int Progress, string Message)> progress = null,
            CancellationToken cancellationToken = default
        );

        /// <summary>
        /// Queries the current status of an asynchronous operation by ID.
        /// </summary>
        Task<OperationInfo> GetOperationStatusAsync(
            string operationId,
            CancellationToken cancellationToken = default
        );

        /// <summary>
        /// Cancels an ongoing long-running asynchronous process.
        /// </summary>
        Task CancelOperationAsync(
            string operationId,
            CancellationToken cancellationToken = default
        );
    }

    /// <summary>
    /// A strongly-typed service contract for the SayHello and WorkflowCallback asynchronous operations.
    /// Extends INexusServiceDefinition to provide interface methods returning completion Tasks and result wrappers.
    /// </summary>
    public interface ISayHelloNexusService : INexusServiceDefinition
    {
        /// <summary>
        /// Starts the SayHello operation asynchronously. Returns a handle to check status, cancel, or await completion.
        /// </summary>
        Task<IOperation<SayHelloInput, SayHelloOutput>> StartSayHelloAsync(
            SayHelloInput input,
            OperationStartOptions options = null,
            CancellationToken cancellationToken = default
        );

        /// <summary>
        /// Starts an asynchronous operation returning a completion Task or result wrapper for long-running processes.
        /// Returns a NexusTaskCompletion containing tracking ID, poll URL, and the awaitable completion Task.
        /// </summary>
        Task<NexusTaskCompletion<SayHelloOutput>> StartAsyncOperation(
            SayHelloInput input,
            OperationStartOptions options = null,
            CancellationToken cancellationToken = default
        );

        /// <summary>
        /// Starts a long-running process returning an interactive result wrapper for progress inspection and cancellation.
        /// </summary>
        Task<NexusOperationResultWrapper<SayHelloOutput>> StartLongRunningProcess(
            SayHelloInput input,
            OperationStartOptions options = null,
            CancellationToken cancellationToken = default
        );

        /// <summary>
        /// Retrieves the current execution information, progress, and logs of a long-running SayHello operation.
        /// </summary>
        Task<OperationInfo> GetSayHelloStatusAsync(
            string operationId,
            CancellationToken cancellationToken = default
        );

        /// <summary>
        /// Retrieves the final greeting results once completed.
        /// </summary>
        Task<SayHelloOutput> GetSayHelloResultAsync(
            string operationId,
            CancellationToken cancellationToken = default
        );

        /// <summary>
        /// Starts the WorkflowCallback operation asynchronously.
        /// Demonstrates returning an operation handle and allowing the caller to poll for results.
        /// </summary>
        Task<IOperation<WorkflowCallbackInput, WorkflowCallbackOutput>> StartWorkflowCallbackAsync(
            WorkflowCallbackInput input,
            OperationStartOptions options = null,
            CancellationToken cancellationToken = default
        );

        /// <summary>
        /// Retrieves the current execution information, progress, and logs of a long-running WorkflowCallback operation.
        /// </summary>
        Task<OperationInfo> GetWorkflowCallbackStatusAsync(
            string operationId,
            CancellationToken cancellationToken = default
        );

        /// <summary>
        /// Retrieves the final workflow callback results once completed.
        /// </summary>
        Task<WorkflowCallbackOutput> GetWorkflowCallbackResultAsync(
            string operationId,
            CancellationToken cancellationToken = default
        );
    }

    /// <summary>
    /// Base class for asynchronous, long-running Nexus operation handlers backed by a Temporal Workflow.
    /// Manages validating input, starting the backing workflow, tracking status, and cascading cancellation.
    /// </summary>
    public abstract class WorkflowAsyncOperationHandler<TInput, TOutput> : IOperationHandler<TInput, TOutput>
    {
        protected readonly ITemporalClient Client;

        public abstract string Name { get; }
        public abstract string Description { get; }

        protected WorkflowAsyncOperationHandler(ITemporalClient client)
        {
            Client = client;
        }

        public async Task<OperationStartResult<TOutput>> StartAsync(
            string operationId,
            TInput input,
            OperationStartOptions options,
            IOperationStateUpdater updater,
            NexusOperationContext context,
            CancellationToken cancellationToken)
        {
            // Validate incoming payload
            await ValidateInputAsync(input);

            // Construct unique tracking identity and options
            var workflowId = GetWorkflowId(operationId, input);
            var workflowOptions = GetWorkflowOptions(workflowId, input, options);

            await updater.UpdateStateAsync(OperationState.Running, 10, $"Chamber calibration starting. Invoking backing workflow: '{workflowId}'...");
            
            // Invoke the workflow and obtain its handle
            var handle = await StartWorkflowRunAsync(workflowId, input, options, workflowOptions, cancellationToken);
            
            await updater.UpdateStateAsync(OperationState.Running, 30, $"Backing workflow successfully bound. RunId: {handle.Id}. Operation pending resolution.");

            return new OperationStartResult<TOutput>(operationId, OperationState.Pending);
        }

        public async Task CancelAsync(string operationId, CancellationToken cancellationToken)
        {
            var workflowId = GetWorkflowId(operationId, default!);
            try
            {
                var handle = Client.GetWorkflowHandle(workflowId);
                await handle.CancelAsync(cancellationToken: cancellationToken);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Cancellation Failed] Failed to cancel backing workflow {workflowId}: {ex.Message}");
            }
        }

        protected virtual Task ValidateInputAsync(TInput input) => Task.CompletedTask;

        protected virtual string GetWorkflowId(string operationId, TInput input) => $"nexus-{Name.ToLower()}-{operationId}";

        protected abstract Task<WorkflowHandle> StartWorkflowRunAsync(
            string workflowId,
            TInput input,
            OperationStartOptions startOptions,
            WorkflowOptions workflowOptions,
            CancellationToken cancellationToken
        );

        protected virtual WorkflowOptions GetWorkflowOptions(string workflowId, TInput input, OperationStartOptions startOptions)
        {
            return new WorkflowOptions(id: workflowId, taskQueue: "nexus-queue")
            {
                WorkflowRunTimeout = TimeSpan.FromMinutes(30),
                WorkflowExecutionTimeout = TimeSpan.FromHours(2)
            };
        }
    }
}`;

  const handlerCode = `using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using Temporal.Nexus.Sdk;
using Temporalio.Client;
using Temporalio.Workflows;
using OpenTelemetry.Trace;

public record TransmutationInput(
    string BaseMaterial, 
    double MassGrams, 
    double TargetResonance, 
    string CallbackUrl = null, 
    string CallbackToken = null
);

public record TransmutationOutput(
    double GoldYieldGrams, 
    double PurityPercent, 
    double AethericResonance, 
    string TransmutedMaterial
);

public record WorkflowCallbackInput(string WorkflowId, string CallbackToken);
public record WorkflowCallbackOutput(string Status, string ProcessedAt, string Acknowledgement);

/// <summary>
/// Workflow interface defining the durable alchemical transmutation process execution contract.
/// </summary>
public interface IAlchemyWorkflow
{
    Task<TransmutationOutput> TransmuteAsync(string baseMaterial, double massGrams, double targetResonance, string callbackUrl, string callbackToken);
}

/// <summary>
/// Asynchronous Nexus Operation Handler that delegates durable execution to a backing Workflow.
/// Inherits from WorkflowAsyncOperationHandler to manage operations that take a longer time to complete.
/// </summary>
public class AethericTransmutationHandler : WorkflowAsyncOperationHandler<TransmutationInput, TransmutationOutput>
{
    public override string Name => "AethericTransmutation";
    public override string Description => "Transmutes base metals (lead/iron) into refined Gold using high SWR frequency alignment.";

    public AethericTransmutationHandler(ITemporalClient client) : base(client)
    {
    }

    protected override Task ValidateInputAsync(TransmutationInput input)
    {
        if (input.MassGrams <= 0)
        {
            throw new ArgumentException("Transmutation mass must be greater than 0 grams.");
        }
        return Task.CompletedTask;
    }

    protected override string GetWorkflowId(string operationId, TransmutationInput input) =>
        $"alchemy-transmute-{operationId}";

    protected override WorkflowOptions GetWorkflowOptions(string workflowId, TransmutationInput input, OperationStartOptions startOptions)
    {
        return new WorkflowOptions(id: workflowId, taskQueue: "alchemical-processes")
        {
            WorkflowRunTimeout = TimeSpan.FromMinutes(30),
            WorkflowExecutionTimeout = TimeSpan.FromHours(2),
        };
    }

    protected override async Task<WorkflowHandle> StartWorkflowRunAsync(
        string workflowId,
        TransmutationInput input,
        OperationStartOptions startOptions,
        WorkflowOptions workflowOptions,
        CancellationToken cancellationToken)
    {
        // Start backing durable alchemical workflow and return the workflow handle
        return await Client.StartWorkflowAsync<IAlchemyWorkflow>(
            wf => wf.TransmuteAsync(
                input.BaseMaterial, 
                input.MassGrams, 
                input.TargetResonance,
                startOptions.CallbackUrl,
                startOptions.CallbackUrl != null ? "token-xyz-789" : null
            ),
            workflowOptions
        );
    }
}

/// <summary>
/// Corrected Callback Handler demonstrating a long-running alchemical process using
/// Workflow.SignalExternalWorkflowAsync to safely resume callers without memory leaks.
/// </summary>
public class WorkflowCallbackOperationHandler : IOperationHandler<WorkflowCallbackInput, WorkflowCallbackOutput>
{
    public string Name => "WorkflowCallback";
    public string Description => "Demonstrates a durable, long-running workflow callback operation that registers an asynchronous handle.";

    public async Task<OperationStartResult<WorkflowCallbackOutput>> StartAsync(
        string operationId,
        WorkflowCallbackInput input,
        OperationStartOptions options,
        IOperationStateUpdater updater,
        NexusOperationContext context,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(input.WorkflowId))
        {
            throw new ArgumentException("Workflow ID cannot be empty.");
        }

        if (!options.IsAsync)
        {
            var syncResult = new WorkflowCallbackOutput(
                Status: "COMPLETED_SYNC",
                ProcessedAt: DateTime.UtcNow.ToString("o"),
                Acknowledgement: $"Workflow callback processed synchronously for ID: {input.WorkflowId}"
            );
            return new OperationStartResult<WorkflowCallbackOutput>(operationId, OperationState.Succeeded, syncResult);
        }

        // Instead of raw in-memory Task.Run delays, we delegate callback orchestration to durable Workflows.
        // Below is the completed block demonstrating asynchronous execution and callback signals.
        _ = Task.Run(async () =>
        {
            try
            {
                if (context.HandlerContext.IsCancellationRequested)
                {
                    throw new OperationCanceledException();
                }

                await updater.UpdateStateAsync(OperationState.Running, 25, "Intercepting asynchronous callback event. Workflow token verified.");
                await Task.Delay(1500, cancellationToken);

                if (context.HandlerContext.IsCancellationRequested)
                {
                    throw new OperationCanceledException();
                }

                await updater.UpdateStateAsync(OperationState.Running, 60, "Registering webhook state listener. Parsing input payload and callback token signature.");
                await Task.Delay(1500, cancellationToken);

                if (context.HandlerContext.IsCancellationRequested)
                {
                    throw new OperationCanceledException();
                }

                // SIMULATION: Perform signaling to the external waiting workflow asynchronously.
                // Demonstrates how Workflow.SignalExternalWorkflowAsync or an Activity callback POST is performed.
                await updater.UpdateStateAsync(OperationState.Running, 85, "Executing internal state reconciliation. Dispatching durable signal to listener queues.");
                await Task.Delay(1500, cancellationToken);

                if (context.HandlerContext.IsCancellationRequested)
                {
                    throw new OperationCanceledException();
                }

                var finalOutput = new WorkflowCallbackOutput(
                    Status: "COMPLETED_ASYNC",
                    ProcessedAt: DateTime.UtcNow.ToString("o"),
                    Acknowledgement: $"Durable callback handshake processed asynchronously. Workflow \"{input.WorkflowId}\" with token \"{input.CallbackToken}\" successfully resumed."
                );

                await updater.UpdateStateAsync(OperationState.Succeeded, 100, "Callback handshake completed. Target workflow resumed successfully.", finalOutput);
            }
            catch (OperationCanceledException)
            {
                await updater.UpdateStateAsync(OperationState.Canceled, 100, "Callback operation was explicitly canceled.");
            }
            catch (Exception ex)
            {
                await updater.UpdateStateAsync(OperationState.Failed, 100, $"Internal callback process failure: {ex.Message}");
            }
        }, CancellationToken.None);

        return new OperationStartResult<WorkflowCallbackOutput>(operationId, OperationState.Pending);
    }

    public Task CancelAsync(string operationId, CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}

/// <summary>
/// A Nexus Service Handler registration showing how individual operations are mapped.
/// Demonstrates mapping the 'AethericTransmutation' operation directly to a backing alchemical workflow
/// using the native 'WorkflowRunOperationHandler.FromHandleFactory' API.
/// This simplifies management of long-running operations, automatic cancellation propagation, and timeouts.
/// </summary>
[NexusService(Name = "AethericNexusService")]
public class AethericNexusService
{
    private readonly ITemporalClient _client;

    public AethericNexusService(ITemporalClient client)
    {
        _client = client;
    }

    /// <summary>
    /// Binds 'AethericTransmutation' to starting and tracking a backing Temporal Workflow.
    /// WorkflowRunOperationHandler.FromHandleFactory automatically manages:
    /// - Launching the workflow run or retrieving a run handle.
    /// - Polling backing workflow execution status and forwarding logs/progress.
    /// - Bounding execution times via WorkflowRunTimeout / WorkflowExecutionTimeout.
    /// - Graceful Cancellation propagation: if the Nexus operation is canceled,
    ///   it invokes handle.CancelAsync() to safely interrupt the workflow.
    /// </summary>
    [NexusOperation]
    public IOperationHandler<TransmutationInput, TransmutationOutput> AethericTransmutation =>
        WorkflowRunOperationHandler.FromHandleFactory<TransmutationInput, TransmutationOutput>(
            async (context, input) =>
            {
                // Start a trace span for the Nexus operation handler
                using var activity = new ActivitySource("Temporal.Nexus").StartActivity(
                    "Nexus.AethericTransmutation.Start", 
                    ActivityKind.Server);
                
                activity?.SetTag("nexus.operation.id", context.OperationId);
                activity?.SetTag("nexus.base.material", input.BaseMaterial);

                // Check if cancellation has been requested
                if (context.IsCancellationRequested)
                {
                    activity?.SetStatus(ActivityStatusCode.Error, "Cancelled");
                    throw new NexusOperationException(
                        "The transmutation operation was cancelled.",
                        "AethericTransmutation",
                        new NonRetryableFailure("OperationCancelled")
                    );
                }

                // Validate input parameters first; validation errors abort the operation immediately
                if (input.MassGrams <= 0)
                {
                    activity?.SetStatus(ActivityStatusCode.Error, "Invalid Input");
                    throw new ArgumentException("Transmutation mass must be greater than 0 grams.");
                }

                try 
                {
                    // Configure execution parameters for the workflow
                    var options = new WorkflowOptions(
                        id: $"alchemy-transmute-{context.OperationId}",
                        taskQueue: "alchemical-processes"
                    )
                    {
                        // State Management & Resiliency Timeouts
                        WorkflowRunTimeout = TimeSpan.FromMinutes(30),
                        WorkflowExecutionTimeout = TimeSpan.FromHours(2),
                    };

                    // Trigger backing durable alchemical workflow
                    var handle = await _client.StartWorkflowAsync<IAlchemyWorkflow>(
                        wf => wf.TransmuteAsync(
                            input.BaseMaterial, 
                            input.MassGrams, 
                            input.TargetResonance,
                            context.CallbackUrl,
                            context.CallbackToken
                        ),
                        options
                    );

                    activity?.SetTag("temporal.workflow.id", options.Id);
                    return handle;
                }
                catch (Exception ex)
                {
                    activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
                    activity?.RecordException(ex);
                    throw;
                }
            }
        );

    [NexusOperation]
    public IOperationHandler<SayHelloInput, SayHelloOutput> SayHello =>
        WorkflowRunOperationHandler.FromHandleFactory<SayHelloInput, SayHelloOutput>(
            async (context, input) =>
            {
                using var activity = NexusDiagnostics.Source.StartActivity("Nexus.Operation.SayHello.Start");
                try
                {
                    // Check if cancellation has been requested before commencing
                    if (context.IsCancellationRequested)
                    {
                        throw new NexusOperationException(
                            "The SayHello operation was cancelled prior to execution.",
                            "SayHello",
                            new NonRetryableFailure("OperationCancelled")
                        );
                    }

                    // Validate input parameters (Non-Retryable InvalidArgument failure)
                    if (string.IsNullOrEmpty(input.Name))
                    {
                        throw new NexusNonRetryableException(
                            "Name property cannot be null or empty.",
                            "SayHello",
                            new { Field = "Name", Reason = "EmptyOrNull" }
                        );
                    }

                    if (input.Name.Length > 100)
                    {
                        throw new NexusNonRetryableException(
                            "Name property exceeds maximum permitted length of 100 characters.",
                            "SayHello",
                            new { Field = "Name", Reason = "ExcessivelyLong" }
                        );
                    }

                    // Configure execution parameters for the backing greeting workflow
                    var options = new WorkflowOptions(
                        id: $"say-hello-{context.OperationId}",
                        taskQueue: "celestial-greetings"
                    );

                    // Trigger backing durable greeting workflow
                    var handle = await _client.StartWorkflowAsync<ISayHelloWorkflow>(
                        wf => wf.GreetAsync(input.Name, input.Language),
                        options
                    );

                    activity?.SetTag("temporal.workflow.id", options.Id);
                    return handle;
                }
                catch (OperationCanceledException ex)
                {
                    activity?.SetStatus(ActivityStatusCode.Error, "Operation cancelled");
                    throw new NexusNonRetryableException(
                        "SayHello operation execution was cancelled by caller.",
                        "SayHello",
                        new { FailureType = "OperationCancelled", Error = ex.Message }
                    );
                }
                catch (NexusOperationException)
                {
                    // Propagate typed Nexus exceptions directly to caller
                    throw;
                }
                catch (HttpRequestException ex) // Transient network / transport issue
                {
                    activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
                    activity?.RecordException(ex);
                    throw new NexusRetryableException(
                        $"Transient transport error connecting to greeting cluster: {ex.Message}",
                        "SayHello",
                        backoffDelayMs: 3000
                    );
                }
                catch (Exception ex) // Fatal unexpected error
                {
                    activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
                    activity?.RecordException(ex);
                    throw new NexusNonRetryableException(
                        $"Non-retryable execution error in SayHello workflow: {ex.Message}",
                        "SayHello",
                        new { OriginalException = ex.GetType().Name }
                    );
                }
            }
        );

    [NexusOperation]
    public IOperationHandler<WorkflowCallbackInput, WorkflowCallbackOutput> WorkflowCallback =>
        new WorkflowCallbackOperationHandler();
}
`;

  const clientCode = `using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Temporal.Nexus.Sdk;
using OpenTelemetry;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

public class NexusClientProgram
{
    public static async Task Main(string[] args)
    {
        // 1. Configure OpenTelemetry Tracing for the Nexus Client
        using var tracerProvider = Sdk.CreateTracerProviderBuilder()
            .SetResourceBuilder(ResourceBuilder.CreateDefault().AddService("NexusClient"))
            .AddSource("Temporal.Nexus") // Capture Nexus-specific spans
            .AddHttpClientInstrumentation() // Capture underlying HTTP traffic
            .AddConsoleExporter()
            .Build();

        // 2. Configure local client reference
        var client = new NexusClient("https://nexus.greatwheel.org");

        var input = new TransmutationInput(BaseMaterial: "Lead", MassGrams: 500, TargetResonance: 1.25);
        
        // Start a root span for the client operation
        using var activity = new ActivitySource("Temporal.Nexus").StartActivity("Client.InitiateTransmutation");
        
        // Define options: Request asynchronous execution, providing a callback endpoint
        var options = new OperationStartOptions(
            RequestId: $"req-{Guid.NewGuid().ToString().Substring(0, 6)}",
            CallbackUrl: "https://my-listener.service/api/callbacks",
            IsAsync: true
        );

        Console.WriteLine("Initiating Aetheric Transmutation Operation...");
        
        // Start the operation, returning an asynchronous handle of IOperation
        IOperation<TransmutationInput, TransmutationOutput> operation = 
            await client.StartOperationAsync<TransmutationInput, TransmutationOutput>(
                "AethericTransmutation", 
                input, 
                options
            );

        activity?.SetTag("nexus.operation.id", operation.Id);
        Console.WriteLine($"Operation Inscribed! ID: {operation.Id} | Status: {operation.InitialState}");

        // APPROACH A: Await the operation directly to wait for completion (non-blocking automatic polling)
        Console.WriteLine("Awaiting operation completion asynchronously...");
        TransmutationOutput finalData = await operation.AwaitCompletionAsync(
            pollInterval: TimeSpan.FromSeconds(1)
        );
        
        Console.WriteLine("\\n================ TRANSMUTATION COMPLETE (Await) ================");
        Console.WriteLine($"Yield: {finalData.GoldYieldGrams}g | Purity: {finalData.PurityPercent}% | Mat: {finalData.TransmutedMaterial}");

        // APPROACH B: Manual status and progress polling for rich metrics
        Console.WriteLine("\\nCommencing manual client-side polling monitor loop...");
        while (true)
        {
            await Task.Delay(1000); // Poll interval limit

            OperationInfo info = await operation.GetInfoAsync();
            Console.WriteLine($"[Poll] Progress: {info.Progress}% | State: {info.State} | Logs: {info.LogTrace[^1]}");

            if (info.State == OperationState.Succeeded)
            {
                TransmutationOutput data = await operation.GetResultAsync();
                Console.WriteLine($"Gold Yield: {data.GoldYieldGrams}g");
                break;
            }
            else if (info.State == OperationState.Failed || info.State == OperationState.Canceled)
            {
                Console.WriteLine($"Operation terminated. State: {info.State}");
                break;
            }
        }
    }
}

/// <summary>
/// APPROACH C: Webhook/Notification Handler (Caller endpoint receiving asynchronous completion callbacks)
/// Uses ASP.NET Core WebApplication host (public sealed class WebApplication : IAsyncDisposable, IDisposable, IApplicationBuilder, IEndpointRouteBuilder, IHost)
/// This demonstrates how the caller's server handles completion notifications pushed from the Nexus service.
/// </summary>
namespace Temporal.Nexus.Callbacks
{
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;

    /// <summary>
    /// ASP.NET Core Host signature reference:
    /// public sealed class WebApplication : IAsyncDisposable, IDisposable, Microsoft.AspNetCore.Builder.IApplicationBuilder, Microsoft.AspNetCore.Routing.IEndpointRouteBuilder, Microsoft.Extensions.Hosting.IHost
    /// </summary>
    public class CallbackListenerProgram
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();

            // Minimal API Endpoint to receive asynchronous completion notifications from Nexus
            app.MapPost("/api/callbacks", async ([FromBody] NexusNotificationPayload payload) =>
            {
                Console.WriteLine($"[Notification Received] Operation ID: {payload.Id} has reached state: {payload.State}");

                if (payload.State == "SUCCEEDED")
                {
                    // Deserializing output and triggering post-completion alchemical logic
                    var result = payload.Result.Deserialize<TransmutationOutput>();
                    Console.WriteLine($"[Success notification] Gold Yield: {result.GoldYieldGrams}g, Purity: {result.PurityPercent}%");
                    
                    // Do notification work (e.g., update alchemical ledger, signal wait workflows)
                    await ProcessTransmutationSuccessAsync(payload.Id, result);
                }
                else
                {
                    Console.WriteLine($"[Failure notification] Operation failed or was canceled. Error: {payload.ErrorMessage}");
                    await ProcessTransmutationFailureAsync(payload.Id, payload.ErrorMessage);
                }

                return Results.Ok(new { status = "acknowledged" });
            });

            app.Run("http://localhost:5001");
        }

        private static Task ProcessTransmutationSuccessAsync(string opId, TransmutationOutput output) => Task.CompletedTask;
        private static Task ProcessTransmutationFailureAsync(string opId, string error) => Task.CompletedTask;
    }

    public record NexusNotificationPayload(
        string Id,
        string State,
        System.Text.Json.JsonElement Result,
        string ErrorMessage = null
    );
}`;

  const workflowCode = `using System;
using System.Threading;
using System.Threading.Tasks;
using Temporal.Nexus.Sdk;
using Temporalio.Workflows;

namespace Temporal.Nexus.Examples
{
    /// <summary>
    /// Specialized Caller Workflow for SayHelloNexusServiceHandler operation.
    /// Initiates a long-running SayHello Nexus operation, obtains an IOperation handle,
    /// polls status or awaits asynchronous callback, and gracefully handles cancellation tokens,
    /// operation cancellation requests via operationHandle.CancelAsync(), and retryable vs non-retryable errors.
    /// </summary>
    [Workflow]
    public class SayHelloCallerWorkflow
    {
        [WorkflowRun]
        public async Task<SayHelloOutput> RunAsync(SayHelloInput input, CancellationToken cancellationToken = default)
        {
            Console.WriteLine($"[SayHello Caller Workflow] Scheduling Nexus operation via SayHelloNexusServiceHandler for target '{input.Name}'...");

            try
            {
                // Initiate asynchronous operation via Nexus endpoint
                IOperation<SayHelloInput, SayHelloOutput> operationHandle = 
                    await Workflow.StartNexusOperationAsync<SayHelloInput, SayHelloOutput>(
                        endpoint: "celestial-nexus-endpoint",
                        service: "ISayHelloNexusService",
                        operation: "SayHello",
                        input: input,
                        options: new WorkflowNexusOperationOptions
                        {
                            ScheduleToCloseTimeout = TimeSpan.FromMinutes(10)
                        }
                    );

                Console.WriteLine($"[SayHello Caller Workflow] Received operation token: {operationHandle.Id}. Polling execution progress...");

                while (true)
                {
                    // Check if caller workflow itself received a cancellation token signal
                    if (cancellationToken.IsCancellationRequested)
                    {
                        Console.WriteLine($"[SayHello Caller Workflow] Cancellation token signaled! Requesting operation cancellation via operationHandle.CancelAsync() for token {operationHandle.Id}...");
                        await operationHandle.CancelAsync();
                        throw new OperationCanceledException($"SayHello workflow cancelled by caller token for operation {operationHandle.Id}.");
                    }

                    OperationInfo status = await operationHandle.GetInfoAsync();
                    Console.WriteLine($"[Caller Poller] Token: {operationHandle.Id} | Status: {status.State} | Progress: {status.Progress}% | Log: {status.LogTrace[^1]}");

                    if (status.State == OperationState.Succeeded)
                    {
                        SayHelloOutput result = await operationHandle.GetResultAsync();
                        Console.WriteLine($"[SayHello Caller Workflow] Operation Succeeded! Result: \"{result.Greeting}\"");
                        return result;
                    }
                    else if (status.State == OperationState.Failed)
                    {
                        throw new NexusOperationException(status.ErrorMessage ?? "Operation failed.", "SayHello");
                    }
                    else if (status.State == OperationState.Canceled)
                    {
                        Console.WriteLine($"[SayHello Caller Workflow] Operation {operationHandle.Id} transitioned to CANCELED state. Halting caller workflow execution cleanly.");
                        throw new OperationCanceledException($"SayHello operation {operationHandle.Id} was canceled.");
                    }

                    await Workflow.SleepAsync(TimeSpan.FromSeconds(1), cancellationToken);
                }
            }
            catch (OperationCanceledException ex)
            {
                Console.WriteLine($"[SayHello Caller Workflow] CANCELLATION HANDLED: '{ex.Message}'. Execution halted cleanly without failure.");
                throw; // Workflow engine registers as canceled state
            }
            catch (NexusRetryableException ex)
            {
                Console.WriteLine($"[SayHello Caller Workflow] CAUGHT RETRYABLE ERROR: '{ex.Message}'. Temporal worker backing off for {ex.BackoffDelayMs}ms before retrying...");
                throw; // Workflow engine automatically retries
            }
            catch (NexusNonRetryableException ex)
            {
                Console.WriteLine($"[SayHello Caller Workflow] CAUGHT FATAL NON-RETRYABLE ERROR: '{ex.Message}'. Aborting caller workflow immediately.");
                throw; // Fatal error, workflow aborts without retry
            }
        }
    }

    /// <summary>
    /// Caller Workflow demonstrating the asynchronous invocation pattern for Nexus Operations.
    /// The Nexus operation handler returns an IOperationHandler that signals completion asynchronously.
    /// The CallerWorkflow can poll for status using GetInfoAsync / AwaitCompletionAsync or receive a callback.
    /// Supports explicit operation cancellation via operationHandle.CancelAsync() and cancellation tokens.
    /// </summary>
    [Workflow]
    public class CallerWorkflow
    {
        [WorkflowRun]
        public async Task<TransmutationOutput> RunAsync(
            string baseMaterial, 
            double massGrams, 
            bool useCallbackPattern = false,
            CancellationToken cancellationToken = default)
        {
            var input = new TransmutationInput(
                BaseMaterial: baseMaterial, 
                MassGrams: massGrams, 
                TargetResonance: 1.85,
                CallbackUrl: useCallbackPattern ? "https://workflow-listener.internal/nexus-callback" : null
            );

            Console.WriteLine($"[Caller Workflow] Initiating asynchronous Nexus operation for {massGrams}g of {baseMaterial}...");

            try
            {
                if (!useCallbackPattern)
                {
                    // PATTERN 1: Asynchronous Status Polling Pattern
                    // Start operation and obtain an IOperation handle to poll status until completion
                    Console.WriteLine("[Caller Workflow] Invoking Nexus operation with Status Polling Pattern...");

                    IOperation<TransmutationInput, TransmutationOutput> operationHandle = 
                        await Workflow.StartNexusOperationAsync<TransmutationInput, TransmutationOutput>(
                            endpoint: "alchemy-nexus-endpoint",
                            service: "AethericNexusService",
                            operation: "AethericTransmutation",
                            input: input,
                            options: new WorkflowNexusOperationOptions
                            {
                                ScheduleToCloseTimeout = TimeSpan.FromHours(1)
                            }
                        );

                    Console.WriteLine($"[Caller Workflow] Asynchronous operation token issued: {operationHandle.Id}. Polling status...");

                    // Poll status asynchronously
                    while (true)
                    {
                        // Check for explicit caller cancellation token signal
                        if (cancellationToken.IsCancellationRequested)
                        {
                            Console.WriteLine($"[Caller Workflow] Cancellation requested by token. Invoking operationHandle.CancelAsync() for ID {operationHandle.Id}...");
                            await operationHandle.CancelAsync();
                            throw new OperationCanceledException($"Caller workflow cancelled operation {operationHandle.Id}.");
                        }

                        OperationInfo status = await operationHandle.GetInfoAsync();
                        Console.WriteLine($"[Caller Workflow Poller] Operation ID: {operationHandle.Id} | Status: {status.State} | Progress: {status.Progress}%");

                        if (status.State == OperationState.Succeeded)
                        {
                            TransmutationOutput result = await operationHandle.GetResultAsync();
                            Console.WriteLine($"[Caller Workflow] Operation succeeded! Yield: {result.GoldYieldGrams}g Gold.");
                            return result;
                        }
                        else if (status.State == OperationState.Canceled)
                        {
                            Console.WriteLine($"[Caller Workflow] Nexus Operation {operationHandle.Id} was CANCELED. Terminating caller execution cleanly.");
                            throw new OperationCanceledException($"Nexus Operation {operationHandle.Id} was canceled.");
                        }
                        else if (status.State == OperationState.Failed)
                        {
                            throw new NexusOperationException(status.ErrorMessage ?? "Nexus Operation failed.", "AethericTransmutation");
                        }

                        // Suspend caller workflow thread durably before next poll cycle
                        await Workflow.SleepAsync(TimeSpan.FromSeconds(2), cancellationToken);
                    }
                }
                else
                {
                    // PATTERN 2: Asynchronous Callback Pattern
                    // Invoke Nexus operation with registered CallbackUrl; the caller workflow yield-awaits completion signal
                    Console.WriteLine("[Caller Workflow] Invoking Nexus operation with Asynchronous Callback Pattern...");

                    TransmutationOutput result = await Workflow.ExecuteNexusOperationAsync<TransmutationOutput>(
                        endpoint: "alchemy-nexus-endpoint",
                        service: "AethericNexusService",
                        operation: "AethericTransmutation",
                        input: input,
                        options: new WorkflowNexusOperationOptions
                        {
                            ScheduleToCloseTimeout = TimeSpan.FromHours(1)
                        }
                    );

                    Console.WriteLine($"[Caller Workflow] Received asynchronous completion callback! Yield: {result.GoldYieldGrams}g Gold.");
                    return result;
                }
            }
            catch (OperationCanceledException ex)
            {
                Console.WriteLine($"[Caller Workflow] CANCELLATION HANDLED: '{ex.Message}'. Workflow halted cleanly.");
                throw;
            }
        }
    }

    /// <summary>
    /// Backing alchemical workflow implementation demonstrating durability, cancellation tolerance,
    /// and state management using 'Workflow.ContinueAsNewAsync' for long-running execution loops.
    /// </summary>
    [Workflow]
    public class AlchemyWorkflow : IAlchemyWorkflow
    {
        [WorkflowRun]
        public async Task<TransmutationOutput> TransmuteAsync(
            string baseMaterial, 
            double massGrams, 
            double targetResonance, 
            string callbackUrl, 
            string callbackToken,
            int currentCycle = 0)
        {
            Console.WriteLine($"[Alchemy Workflow] Cycle #{currentCycle}: Starting long-running transmutation of {massGrams}g of {baseMaterial}...");

            // 1. Resilience & History Optimization via Continue-As-New
            // For workflows with multi-step cycles that may run indefinitely or exceed the 50K event history limit,
            // we perform a ContinueAsNew invocation to reset the thread history while keeping state continuous.
            if (currentCycle >= 20)
            {
                Console.WriteLine("[Alchemy Workflow] Max cycle batch size reached. Resetting history thread using Continue-As-New...");
                // Clears history events and spins up a brand new workflow run carrying state forward
                await Workflow.ContinueAsNewAsync<TransmutationOutput>(
                    baseMaterial, 
                    massGrams, 
                    targetResonance, 
                    callbackUrl, 
                    callbackToken,
                    0 // Reset cyclic counter for the fresh run
                );
            }

            // 2. Cancellation and Timeout Handling
            // We can check if cancellation is requested or handle cancellation tokens directly
            try
            {
                // Manage long-running steps using durable sleep. This suspends the thread
                // without memory overhead and wakes up when the timer expires.
                await Workflow.SleepAsync(TimeSpan.FromSeconds(5));
            }
            catch (Exception ex) when (Workflow.Info.CancellationToken.IsCancellationRequested)
            {
                Console.WriteLine("[Alchemy Workflow] Cancellation caught during deep sleep! Safe-releasing chamber pressures...");
                throw; // Propagate cancellation cleanly
            }

            double purity = 98.5 + (new Random().NextDouble() * 1.4);
            double yieldAmt = massGrams * (purity / 100) * 0.48;

            var output = new TransmutationOutput(
                GoldYieldGrams: Math.Round(yieldAmt, 3),
                PurityPercent: Math.Round(purity, 2),
                AethericResonance: targetResonance,
                TransmutedMaterial: $"Refined Alchemical Gold (from {baseMaterial} - Cycle {currentCycle})"
            );

            // 3. Dispatch external event signaling callbacks if registered
            if (!string.IsNullOrEmpty(callbackUrl))
            {
                Console.WriteLine($"[Alchemy Workflow] Dispatching external event completion signal to: {callbackUrl}");
                using var httpClient = new HttpClient();
                
                if (!string.IsNullOrEmpty(callbackToken))
                {
                    httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {callbackToken}");
                }

                var payload = new 
                { 
                    id = Workflow.Info.WorkflowId, 
                    state = "SUCCEEDED", 
                    result = output 
                };

                await httpClient.PostAsJsonAsync(callbackUrl, payload);
            }

            return output;
        }
    }
}`;

  const errorHandlingCode = `using System;
using System.Threading;
using System.Threading.Tasks;
using Temporal.Nexus.Sdk;
using Temporalio.Client;
using Temporalio.Exceptions;
using Temporalio.Workflows;
using Microsoft.Extensions.Logging;

namespace Temporal.Nexus.ErrorHandling
{
    // =========================================================================
    // 1. CANONICAL ERROR TYPES & CLASSIFICATION
    // =========================================================================
    public static class AlchemicalErrorTypes
    {
        public const string InvalidMaterials = "InvalidMaterialsFailure";
        public const string ResonanceSpike = "ResonanceSpikeFailure";
        public const string TransientCalibratorOffline = "TransientCalibratorOffline";
        public const string ChamberPressureHigh = "ChamberPressureHigh";
        public const string InternalWorkflowFailure = "InternalWorkflowFailure";
    }

    /// <summary>
    /// Extension helper to classify application-specific errors into Nexus retry patterns.
    /// </summary>
    public static class NexusErrorClassifier
    {
        public static NexusOperationException ToNexusException(this Exception ex, string opName)
        {
            return ex switch
            {
                ArgumentException or InvalidOperationException => 
                    new NonRetryableNexusException(ex.Message, opName, "VALIDATION_FAILED"),
                
                UnauthorizedAccessException => 
                    new NonRetryableNexusException("Access denied to sacred chamber.", opName, "UNAUTHORIZED"),
                
                // Classify transient network or resource issues as retryable
                System.Net.Http.HttpRequestException or TimeoutException => 
                    new RetryableNexusException("Aetheric link timed out. Retrying resonance...", opName, 3000),

                _ => new NonRetryableNexusException(ex.Message, opName, "UNKNOWN_FATAL_ERROR")
            };
        }
    }

    // =========================================================================
    // 2. BACKING WORKFLOW (HANDLER SIDE): DURABLE EXECUTION ERROR HANDLING
    // =========================================================================
    [Workflow]
    public class TransmutationBackingWorkflow
    {
        [WorkflowRun]
        public async Task<TransmutationOutput> RunAsync(TransmutationInput input)
        {
            try
            {
                // Core durable alchemical logic
                await Workflow.DelayAsync(TimeSpan.FromSeconds(10));
                
                if (input.BaseMaterial == "Lead" && input.MassGrams > 500)
                {
                    // Fail the workflow if safety thresholds are exceeded
                    throw new ApplicationException("Safety breach: Excessive lead mass for single-chamber refinement.");
                }

                return new TransmutationOutput(450.0, 99.5, input.TargetResonance, "Refined Gold");
            }
            catch (Exception ex)
            {
                // In Nexus, if the backing workflow fails, the operation transitions to FAILED.
                // Re-throwing as ApplicationFailureException allows us to set the Failure.Type 
                // which the Caller Workflow can then use for recovery logic.
                throw new ApplicationFailureException(
                    message: "Distillation phase failed.",
                    type: AlchemicalErrorTypes.InternalWorkflowFailure,
                    nonRetryable: false,
                    innerException: ex
                );
            }
        }
    }

    // =========================================================================
    // 3. OPERATION HANDLER: INITIALIZATION ERROR HANDLING
    // =========================================================================
    public class SecureTransmutationHandler : WorkflowAsyncOperationHandler<TransmutationInput, TransmutationOutput>
    {
        public override string Name => "AethericTransmutation";

        public SecureTransmutationHandler(ITemporalClient client) : base(client) { }

        protected override string GetWorkflowId(string operationId, TransmutationInput input) =>
            $"alchemy-transmute-{operationId}";

        protected override WorkflowOptions GetWorkflowOptions(string workflowId, TransmutationInput input, OperationStartOptions startOptions) =>
            new(id: workflowId, taskQueue: "alchemical-processes");

        public override async Task<OperationStartResult<TransmutationOutput>> StartAsync(
            string operationId, TransmutationInput input, OperationStartOptions options,
            IOperationStateUpdater updater, NexusOperationContext context, CancellationToken cancellationToken)
        {
            // A. SYNCHRONOUS PRE-FLIGHT VALIDATION
            if (input.MassGrams <= 0)
            {
                throw new NonRetryableNexusException("Mass must be positive.", Name, "INVALID_INPUT");
            }

            try
            {
                // B. START BACKING WORKFLOW (OR CONNECT TO EXISTING)
                // If this fails (e.g. Temporal is down), base class might throw.
                return await base.StartAsync(operationId, input, options, updater, context, cancellationToken);
            }
            catch (Exception ex)
            {
                // C. RECOVERY & CLASSIFICATION
                // Ensure errors starting the operation are properly classified as retryable or not.
                throw ex.ToNexusException(Name);
            }
        }
    }

    // =========================================================================
    // 4. CALLER WORKFLOW: CATCHING PROPAGATED ERRORS & RECOVERY
    // =========================================================================
    [Workflow]
    public class MasterAlchemistWorkflow
    {
        [WorkflowRun]
        public async Task<TransmutationOutput> RunAsync(string material, double mass)
        {
            var options = new WorkflowNexusOperationOptions 
            { 
                ScheduleToCloseTimeout = TimeSpan.FromMinutes(45) 
            };

            try
            {
                // The caller executes the Nexus operation across namespaces.
                // Temporal handles retries of the operation itself based on the Service's retry status.
                return await Workflow.ExecuteNexusOperationAsync<TransmutationOutput>(
                    endpoint: "celestial-nexus",
                    service: "IAlchemyService",
                    operation: "AethericTransmutation",
                    input: new TransmutationInput(material, mass, 1.2),
                    options: options
                );
            }
            catch (NexusOperationFailedException ex)
            {
                // COMPREHENSIVE ERROR HANDLING STRATEGY:
                
                // 1. Recover based on propagated failure type from the target namespace
                if (ex.Failure?.Type == AlchemicalErrorTypes.InternalWorkflowFailure)
                {
                    Workflow.Logger.LogWarning("Remote workflow failed. Redirecting to backup sanctuary...");
                    return await ExecuteBackupProtocolAsync(material, mass);
                }

                // 2. Handle non-retryable validation errors
                if (ex.Failure?.Message.Contains("VALIDATION_FAILED") == true)
                {
                    Workflow.Logger.LogError("Input was rejected by target service. Aborting alchemy.");
                    throw; // Abort master workflow
                }

                // 3. Fallback for all other Nexus failures
                Workflow.Logger.LogError($"Nexus Operation Failed: {ex.Failure?.Message}");
                return await LeadPurificationFallbackAsync(material, mass);
            }
            catch (TemporalException ex)
            {
                // Handle platform-level issues (e.g. Namespace not found, Timeout)
                Workflow.Logger.LogCritical($"Temporal Platform Failure: {ex.Message}");
                throw;
            }
        }

        private async Task<TransmutationOutput> ExecuteBackupProtocolAsync(string mat, double g) =>
            new(0, 0, 0, "BackupRefined_Result");

        private async Task<TransmutationOutput> LeadPurificationFallbackAsync(string mat, double g) =>
            new(0, 0, 0, "PurifiedLead_Fallback");
    }

    // --- Supporting Records ---
    public record TransmutationInput(string BaseMaterial, double MassGrams, double TargetResonance);
    public record TransmutationOutput(double GoldYield, double Purity, double Resonance, string Material);
}
`;

  const cancellationCode = `using System;
using System.Threading;
using System.Threading.Tasks;
using Temporal.Nexus.Sdk;
using Temporalio.Client;
using Temporalio.Exceptions;
using Temporalio.Workflows;

namespace Temporal.Nexus.Cancellation
{
    // =========================================================================
    // 1. CALLER WORKFLOW: CANCELLATION PROPAGATION INITIATION
    // =========================================================================
    [Workflow]
    public class CallerAlchemistWorkflow
    {
        [WorkflowRun]
        public async Task<TransmutationOutput> RunAsync(string baseMaterial, double massGrams)
        {
            var input = new TransmutationInput(BaseMaterial: baseMaterial, MassGrams: massGrams, TargetResonance: 1.85);

            try
            {
                Console.WriteLine("[Caller Workflow] Invoking heavy alchemical Nexus operation...");
                
                // When calling ExecuteNexusOperationAsync, the caller's cancellation scope is linked.
                // If this Caller Workflow is cancelled, Temporal automatically propagates a Cancel request
                // across the namespace boundary to the Nexus Operation Handler.
                TransmutationOutput result = await Workflow.ExecuteNexusOperationAsync<TransmutationOutput>(
                    endpoint: "alchemy-nexus-endpoint",
                    service: "AethericNexusService",
                    operation: "AethericTransmutation",
                    input: input,
                    options: new WorkflowNexusOperationOptions
                    {
                        ScheduleToCloseTimeout = TimeSpan.FromHours(1)
                    }
                );

                return result;
            }
            catch (Exception ex) when (Workflow.Info.CancellationToken.IsCancellationRequested)
            {
                // Catching workflow cancellation locally for debugging or logging
                Console.WriteLine("[Caller Workflow] Caller was explicitly cancelled. Nexus cancellation propagated.");
                throw; // Re-throw to complete the workflow as Canceled
            }
        }
    }

    // =========================================================================
    // 2. NEXUS OPERATION HANDLER: CANCELLATION DISPATCHING
    // =========================================================================
    /// <summary>
    /// Nexus Handler responsible for starting the operation and forwarding the cancellation signal
    /// down to the backing Temporal workflow in the target namespace.
    /// </summary>
    public class AethericTransmutationHandler : WorkflowAsyncOperationHandler<TransmutationInput, TransmutationOutput>
    {
        public override string Name => "AethericTransmutation";
        public override string Description => "Handles heavy transmutation with explicit cross-namespace cancellation.";

        public AethericTransmutationHandler(ITemporalClient client) : base(client)
        {
        }

        // The base WorkflowAsyncOperationHandler implements CancelAsync like this:
        public override async Task CancelAsync(string operationId, CancellationToken cancellationToken)
        {
            // Resolve the identical workflow ID mapped to this operation ID
            var workflowId = GetWorkflowId(operationId, default!);
            
            try
            {
                Console.WriteLine($"[Nexus Handler] Received cross-namespace cancellation for Operation: {operationId}. Propagating to backing Workflow: {workflowId}");
                
                // Fetch the workflow handle and trigger a graceful Temporal cancellation signal
                var handle = Client.GetWorkflowHandle(workflowId);
                await handle.CancelAsync(cancellationToken: cancellationToken);
                
                Console.WriteLine($"[Nexus Handler] Cancellation signal successfully dispatched to backing workflow {workflowId}.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Nexus Handler] Failed to propagate cancellation to workflow {workflowId}: {ex.Message}");
                throw;
            }
        }

        protected override string GetWorkflowId(string operationId, TransmutationInput input) =>
            $"alchemy-transmute-{operationId}";

        protected override async Task<WorkflowHandle> StartWorkflowRunAsync(
            string workflowId,
            TransmutationInput input,
            OperationStartOptions startOptions,
            WorkflowOptions workflowOptions,
            CancellationToken cancellationToken)
        {
            return await Client.StartWorkflowAsync<IAlchemyWorkflow>(
                wf => wf.TransmuteAsync(input.BaseMaterial, input.MassGrams, input.TargetResonance, startOptions.CallbackUrl, null),
                workflowOptions
            );
        }
    }

    // =========================================================================
    // 3. BACKING WORKFLOW: GRACEFUL TERMINATION AND CLEANUP
    // =========================================================================
    /// <summary>
    /// Backing workflow running in the target namespace that executes the long-running task.
    /// It must monitor Workflow.Info.CancellationToken to gracefully interrupt itself and cleanup resources.
    /// </summary>
    [Workflow]
    public class BackingAlchemyWorkflow : IAlchemyWorkflow
    {
        [WorkflowRun]
        public async Task<TransmutationOutput> TransmuteAsync(
            string baseMaterial, 
            double massGrams, 
            double targetResonance, 
            string callbackUrl, 
            string callbackToken)
        {
            Console.WriteLine("[Backing Workflow] Transmutation started. Engaging chamber stabilization grid.");

            try
            {
                // Step 1: Simulated chamber heating phase (durable sleep)
                Console.WriteLine("[Backing Workflow] Step 1: Heating vessel chambers (awaiting durable sleep)...");
                await Workflow.SleepAsync(TimeSpan.FromSeconds(10));

                // Step 2: Simulated particle alignment phase
                Console.WriteLine("[Backing Workflow] Step 2: Transmuting atomic frequencies...");
                await Workflow.SleepAsync(TimeSpan.FromSeconds(15));

                return new TransmutationOutput(
                    GoldYieldGrams: massGrams * 0.48,
                    PurityPercent: 99.9,
                    AethericResonance: targetResonance,
                    TransmutedMaterial: "Refined Gold"
                );
            }
            catch (Exception ex) when (Workflow.Info.CancellationToken.IsCancellationRequested)
            {
                // Catching the cancellation request delivered via cross-namespace handle.CancelAsync()
                Console.WriteLine("[Backing Workflow] CANCELLATION REQUESTED across namespace boundary! Performing immediate alchemical shutdown safety protocol...");
                
                // Execute alchemical emergency cooldown and discharge safely
                await SafeDepressurizeChambersAsync();
                
                Console.WriteLine("[Backing Workflow] Safe cooldown completed. Propagating cancellation to terminate workflow gracefully in CANCELED state.");
                
                // Re-throw to terminate the workflow execution as Canceled
                throw;
            }
        }

        private async Task SafeDepressurizeChambersAsync()
        {
            // Execute non-blocking, clean shutdown procedure
            Console.WriteLine("[Backing Workflow] [SAFETY] Discharging high-resonance magic grids.");
            Console.WriteLine("[Backing Workflow] [SAFETY] Coolant valves opened. Chamber pressure returned to 1.0 atm.");
            await Task.Delay(500); // Quick non-durable cleanup
        }
    }
}`;

  const javaEnvCode = `package io.temporal.samples.envconfig;

// @@@SNIPSTART java-env-config-profile
import io.temporal.client.WorkflowClient;
import io.temporal.client.WorkflowClientOptions;
import io.temporal.envconfig.ClientConfigProfile;
import io.temporal.envconfig.LoadClientConfigProfileOptions;
import io.temporal.serviceclient.WorkflowServiceStubs;
import io.temporal.serviceclient.WorkflowServiceStubsOptions;
import java.nio.file.Paths;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This sample demonstrates loading the default environment configuration profile from a TOML file.
 */
public class LoadFromFile {

  private static final Logger logger = LoggerFactory.getLogger(LoadFromFile.class);

  public static void main(String[] args) {
    try {
      // For this sample to be self-contained, we explicitly provide the path to
      // the config.toml file included in this directory.
      // By default though, the config.toml file will be loaded from
      // ~/.config/temporal/temporal.toml (or the equivalent standard config directory on your OS).
      String configFilePath =
          Paths.get(LoadFromFile.class.getResource("/config.toml").toURI()).toString();

      logger.info("--- Loading 'default' profile from {} ---", configFilePath);

      // Load client profile from file. By default, this loads the "default" profile
      // and applies any environment variable overrides.
      ClientConfigProfile profile =
          ClientConfigProfile.load(
              LoadClientConfigProfileOptions.newBuilder()
                  .setConfigFilePath(configFilePath)
                  .build());

      // Convert profile to client options (equivalent to Python's load_client_connect_config)
      WorkflowServiceStubsOptions serviceStubsOptions = profile.toWorkflowServiceStubsOptions();
      WorkflowClientOptions clientOptions = profile.toWorkflowClientOptions();

      logger.info("Loaded 'default' profile from {}", configFilePath);
      logger.info("  Address: {}", serviceStubsOptions.getTarget());
      logger.info("  Namespace: {}", clientOptions.getNamespace());
      if (serviceStubsOptions.getHeaders() != null
          && !serviceStubsOptions.getHeaders().keys().isEmpty()) {
        logger.info("  gRPC Metadata keys: {}", serviceStubsOptions.getHeaders().keys());
      }

      logger.info("\\nAttempting to connect to client...");

      try {
        // Create the workflow client using the loaded configuration
        WorkflowClient client =
            WorkflowClient.newInstance(
                WorkflowServiceStubs.newServiceStubs(serviceStubsOptions), clientOptions);

        // Test the connection by getting system info
        var systemInfo =
            client
                .getWorkflowServiceStubs()
                .blockingStub()
                .getSystemInfo(
                    io.temporal.api.workflowservice.v1.GetSystemInfoRequest.getDefaultInstance());

        logger.info("✅ Client connected successfully!");
        logger.info("  Server version: {}", systemInfo.getServerVersion());

      } catch (Exception e) {
        logger.error("❌ Failed to connect: {}", e.getMessage());
      }

    } catch (Exception e) {
      logger.error("Failed to load configuration: {}", e.getMessage(), e);
      System.exit(1);
    }
  }
}
// @@@SNIPEND`;

  const observabilityCode = `using System.Diagnostics;
using OpenTelemetry;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace Temporal.Nexus.Observability
{
    /// <summary>
    /// Centralized observability configuration for Nexus operations.
    /// Defines the ActivitySource used for both Caller and Handler instrumentation.
    /// </summary>
    public static class NexusTracing
    {
        // ActivitySource name should match the one added to the TracerProvider
        public static readonly ActivitySource Source = new ActivitySource("Temporal.Nexus");
    }

    /// <summary>
    /// 1. HANDLER-SIDE INSTRUMENTATION
    /// </summary>
    public class InstrumentedHandler : IOperationHandler<Input, Output>
    {
        public string Name => "InstrumentedOp";
        
        public async Task<OperationStartResult<Output>> StartAsync(
            string operationId,
            Input input,
            OperationStartOptions options,
            IOperationStateUpdater updater,
            NexusOperationContext context,
            CancellationToken cancellationToken)
        {
            // StartActivity creates a span. Kind.Server indicates it's a handler/entry point.
            using var activity = NexusTracing.Source.StartActivity("Nexus.Handler.StartAsync", ActivityKind.Server);
            
            activity?.SetTag("nexus.operation.id", operationId);
            activity?.SetTag("nexus.operation.name", Name);

            try 
            {
                // Execution logic...
                await Task.Delay(500); 
                return new OperationStartResult<Output>(operationId, OperationState.Succeeded, new Output());
            }
            catch (Exception ex)
            {
                // Log exception details to the span
                activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
                activity?.RecordException(ex);
                throw;
            }
        }
    }

    /// <summary>
    /// 2. CALLER-SIDE INSTRUMENTATION (Entry Point)
    /// </summary>
    public class Program
    {
        public static async Task Main(string[] args)
        {
            // Configure the OpenTelemetry SDK
            using var tracerProvider = Sdk.CreateTracerProviderBuilder()
                .SetResourceBuilder(ResourceBuilder.CreateDefault().AddService("NexusQuickstart"))
                // Register the source used by Nexus instrumentation
                .AddSource("Temporal.Nexus") 
                // Capture traces from the underlying HTTP client (propagation occurs here)
                .AddHttpClientInstrumentation() 
                .AddConsoleExporter() // In production, use OTLP or Jaeger
                .Build();

            // Start a root span for the business process
            using var activity = NexusTracing.Source.StartActivity("Nexus.Caller.InitiateWork", ActivityKind.Client);
            
            var client = new NexusClient("https://nexus-endpoint");
            var result = await client.StartOperationAsync<Input, Output>("InstrumentedOp", new Input());
            
            activity?.SetTag("nexus.operation.id", result.Id);
            Console.WriteLine("Nexus operation trace context propagated.");
        }
    }
}`;

  return (
    <section className={`rounded-xl border ${activeTheme.borderAccent} bg-[#141416]/95 shadow-xl flex flex-col overflow-hidden`}>
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg border border-teal-500/30 text-teal-400 bg-teal-500/5">
            <FileCode className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-md font-serif font-bold text-slate-100 tracking-wider flex items-center gap-2">
              .NET SDK ASYNCHRONOUS OPERATIONS
              <span className="text-[9px] font-mono tracking-widest px-1.5 py-0.5 rounded-full border border-sky-500/30 text-sky-400 bg-sky-500/5">C# / NET 8</span>
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Production guidelines and interface contracts for executing and monitoring heavy tasks.
            </p>
          </div>
        </div>

        {/* Subtabs */}
        <div className="flex items-center bg-black/40 p-1 rounded-lg border border-white/5 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('contracts')}
            className={`px-3 py-1.5 rounded text-xs font-serif transition-all cursor-pointer ${
              activeSubTab === 'contracts'
                ? `bg-white/5 text-slate-200 border border-white/10`
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Interfaces
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('handler')}
            className={`px-3 py-1.5 rounded text-xs font-serif transition-all cursor-pointer ${
              activeSubTab === 'handler'
                ? `bg-white/5 text-slate-200 border border-white/10`
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Operation Handler
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('client')}
            className={`px-3 py-1.5 rounded text-xs font-serif transition-all cursor-pointer ${
              activeSubTab === 'client'
                ? `bg-white/5 text-slate-200 border border-white/10`
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Client Polling
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('workflow')}
            className={`px-3 py-1.5 rounded text-xs font-serif transition-all cursor-pointer ${
              activeSubTab === 'workflow'
                ? `bg-white/5 text-slate-200 border border-white/10`
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Workflow Orchestration
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('errors')}
            className={`px-3 py-1.5 rounded text-xs font-serif transition-all cursor-pointer ${
              activeSubTab === 'errors'
                ? `bg-white/5 text-slate-200 border border-white/10`
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            5. Error Handling
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('cancellation')}
            className={`px-3 py-1.5 rounded text-xs font-serif transition-all cursor-pointer ${
              activeSubTab === 'cancellation'
                ? `bg-white/5 text-slate-200 border border-white/10`
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            6. Cancellation
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('java-env')}
            className={`px-3 py-1.5 rounded text-xs font-serif transition-all cursor-pointer ${
              activeSubTab === 'java-env'
                ? `bg-amber-500/10 text-amber-300 border border-amber-500/30`
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            7. Java Env Config
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('native-messaging')}
            className={`px-3 py-1.5 rounded text-xs font-serif transition-all cursor-pointer ${
              activeSubTab === 'native-messaging'
                ? `bg-emerald-500/10 text-emerald-300 border border-emerald-500/30`
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            8. Native Messaging
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('observability')}
            className={`px-3 py-1.5 rounded text-xs font-serif transition-all cursor-pointer ${
              activeSubTab === 'observability'
                ? `bg-sky-500/10 text-sky-300 border border-sky-500/30`
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            9. Observability
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-6">
        {activeSubTab === 'contracts' && (
          <div className="flex flex-col gap-4">
            <div className="text-xs text-slate-400 leading-relaxed font-sans">
              To support asynchronous Nexus Operations in the **C# .NET SDK**, the service defines 
              strongly-typed models for states, input/output containers, and the core 
              <code className="text-teal-400 mx-1 font-mono text-xs font-bold">IOperationHandler&lt;TIn, TOut&gt;</code>. 
              The handler receives a callback state updater allowing deep workflow integrations.
            </div>

            <div className="relative">
              <div className="absolute right-3 top-3 z-10">
                <button
                  type="button"
                  onClick={() => handleCopy(contractsCode, 'contracts')}
                  className="p-1.5 rounded bg-black/80 hover:bg-black text-slate-400 hover:text-slate-200 border border-white/5 cursor-pointer text-xs flex items-center gap-1 font-mono transition-all"
                >
                  {copiedText === 'contracts' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === 'contracts' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 bg-black/50 border border-white/5 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto max-h-[420px] leading-relaxed">
                <code>{contractsCode}</code>
              </pre>
            </div>
          </div>
        )}

        {activeSubTab === 'handler' && (
          <div className="flex flex-col gap-4">
            <div className="text-xs text-slate-400 leading-relaxed font-sans">
              Below is the complete implementation of the Nexus operations and service. 
              Rather than writing a custom handler class, we map the operation to a backing 
              <code className="text-amber-400 font-mono mx-1">Temporal Workflow</code> using the native 
              <code className="text-teal-400 font-mono mx-1">WorkflowRunOperationHandler.FromHandleFactory</code> API.
              This automates starting the workflow, returning a <code className="text-sky-400 font-mono mx-1">Pending</code> status,
              handling polling/callback state updates, and propagating cancellation and timeout boundaries down to the backing thread.
            </div>

            <div className="relative">
              <div className="absolute right-3 top-3 z-10">
                <button
                  type="button"
                  onClick={() => handleCopy(handlerCode, 'handler')}
                  className="p-1.5 rounded bg-black/80 hover:bg-black text-slate-400 hover:text-slate-200 border border-white/5 cursor-pointer text-xs flex items-center gap-1 font-mono transition-all"
                >
                  {copiedText === 'handler' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === 'handler' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 bg-black/50 border border-white/5 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto max-h-[420px] leading-relaxed">
                <code>{handlerCode}</code>
              </pre>
            </div>
          </div>
        )}

        {activeSubTab === 'client' && (
          <div className="flex flex-col gap-4">
            <div className="text-xs text-slate-400 leading-relaxed font-sans">
              The caller triggers the operation with <code className="text-teal-400 font-mono font-bold">IsAsync = true</code>. 
              If the call returns a pending state token, the caller can execute a client-side polling loop to retrieve periodic 
              progress and status logs until a terminal state is achieved.
            </div>

            <div className="relative">
              <div className="absolute right-3 top-3 z-10">
                <button
                  type="button"
                  onClick={() => handleCopy(clientCode, 'client')}
                  className="p-1.5 rounded bg-black/80 hover:bg-black text-slate-400 hover:text-slate-200 border border-white/5 cursor-pointer text-xs flex items-center gap-1 font-mono transition-all"
                >
                  {copiedText === 'client' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === 'client' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 bg-black/50 border border-white/5 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto max-h-[420px] leading-relaxed">
                <code>{clientCode}</code>
              </pre>
            </div>

            {/* ASP.NET Core WebApplication Host Signature Card */}
            <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-sky-300 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-sky-400" />
                  ASP.NET Core WebApplication Type Signature
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Microsoft.AspNetCore.Builder
                </span>
              </div>
              <pre className="p-3 bg-black/60 border border-sky-500/30 rounded-lg text-xs font-mono text-sky-200 overflow-x-auto">
                <code>{`public sealed class WebApplication : IAsyncDisposable, IDisposable, Microsoft.AspNetCore.Builder.IApplicationBuilder, Microsoft.AspNetCore.Routing.IEndpointRouteBuilder, Microsoft.Extensions.Hosting.IHost`}</code>
              </pre>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1">
                <div className="p-2.5 rounded bg-black/40 border border-white/5 text-[11px] text-slate-300">
                  <span className="font-mono text-sky-400 font-bold block mb-0.5">IEndpointRouteBuilder</span>
                  Enables Minimal API endpoint mapping (<code className="text-amber-300 font-mono">app.MapPost(...)</code>) for receiving asynchronous webhook completion callbacks.
                </div>
                <div className="p-2.5 rounded bg-black/40 border border-white/5 text-[11px] text-slate-300">
                  <span className="font-mono text-sky-400 font-bold block mb-0.5">IHost & IApplicationBuilder</span>
                  Manages the underlying Kestrel server lifecycle, dependency injection, and HTTP middleware pipeline execution.
                </div>
                <div className="p-2.5 rounded bg-black/40 border border-white/5 text-[11px] text-slate-300">
                  <span className="font-mono text-sky-400 font-bold block mb-0.5">IAsyncDisposable & IDisposable</span>
                  Guarantees clean, non-blocking asynchronous resource disposal upon server shutdown or container termination.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'workflow' && (
          <div className="flex flex-col gap-4">
            <div className="text-xs text-slate-400 leading-relaxed font-sans">
              Within a Temporal **Workflow**, asynchronous Nexus Operations are scheduled on a Workflow Thread. 
              This example shows how a parent Workflow launches the operation returning a 
              <code className="text-teal-400 font-mono mx-1">Task&lt;IOperation&lt;TIn, TOut&gt;&gt;</code> handle, 
              waits for the final result asynchronously without blocking the system, and implements 
              durable lifecycle management (including automatic cancellation propagate to the Nexus handler).
            </div>

            <div className="relative">
              <div className="absolute right-3 top-3 z-10">
                <button
                  type="button"
                  onClick={() => handleCopy(workflowCode, 'workflow')}
                  className="p-1.5 rounded bg-black/80 hover:bg-black text-slate-400 hover:text-slate-200 border border-white/5 cursor-pointer text-xs flex items-center gap-1 font-mono transition-all"
                >
                  {copiedText === 'workflow' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === 'workflow' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 bg-black/50 border border-white/5 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto max-h-[420px] leading-relaxed">
                <code>{workflowCode}</code>
              </pre>
            </div>
          </div>
        )}

        {activeSubTab === 'errors' && (
          <div className="flex flex-col gap-4">
            <div className="text-xs text-slate-400 leading-relaxed font-sans">
              Nexus Error Handling in .NET utilizes strongly-typed exceptions and failure classification to manage durable cross-namespace executions. 
              This pattern distinguishes between **synchronous validation failures** (throwing <code className="text-rose-400 font-mono font-bold">NonRetryableNexusException</code> during start-up) and **asynchronous workflow failures** (propagated via <code className="text-amber-400 font-mono font-bold">ApplicationFailureException</code> from backing handlers).
              Callers catch <code className="text-teal-400 font-mono font-bold">NexusOperationFailedException</code> and inspect the <code className="text-sky-300 font-mono">Failure.Type</code> to implement alchemical recovery strategies, fallback sanctums, or graceful degradations.
            </div>

            <div className="relative">
              <div className="absolute right-3 top-3 z-10">
                <button
                  type="button"
                  onClick={() => handleCopy(errorHandlingCode, 'errors')}
                  className="p-1.5 rounded bg-black/80 hover:bg-black text-slate-400 hover:text-slate-200 border border-white/5 cursor-pointer text-xs flex items-center gap-1 font-mono transition-all"
                >
                  {copiedText === 'errors' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === 'errors' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 bg-black/50 border border-white/5 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto max-h-[420px] leading-relaxed">
                <code>{errorHandlingCode}</code>
              </pre>
            </div>
          </div>
        )}

        {activeSubTab === 'cancellation' && (
          <div className="flex flex-col gap-4">
            <div className="text-xs text-slate-400 leading-relaxed font-sans">
              Temporal Nexus supports fully automatic **Cross-Namespace Cancellation Propagation**. When a caller Workflow is cancelled, the cancellation request propagates to the target namespace's Nexus Service. The service handler invokes <code className="text-amber-400 font-mono font-bold">CancelAsync</code> to safely propagate the cancellation down to the backing Workflow thread, allowing it to gracefully clean up, depressurize vessels, and shut down safely.
            </div>

            <div className="relative">
              <div className="absolute right-3 top-3 z-10">
                <button
                  type="button"
                  onClick={() => handleCopy(cancellationCode, 'cancellation')}
                  className="p-1.5 rounded bg-black/80 hover:bg-black text-slate-400 hover:text-slate-200 border border-white/5 cursor-pointer text-xs flex items-center gap-1 font-mono transition-all"
                >
                  {copiedText === 'cancellation' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === 'cancellation' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 bg-black/50 border border-white/5 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto max-h-[420px] leading-relaxed">
                <code>{cancellationCode}</code>
              </pre>
            </div>
          </div>
        )}

        {activeSubTab === 'java-env' && (
          <div className="flex flex-col gap-4">
            <div className="text-xs text-slate-400 leading-relaxed font-sans">
              Demonstrates loading the default environment configuration profile from a TOML file (<code className="text-amber-400 font-mono">config.toml</code>) using the **Temporal Java SDK** (<code className="text-teal-400 font-mono font-bold">ClientConfigProfile</code>). The profile automatically applies environment variable overrides, configures service stubs options, and initializes a connected <code className="text-sky-400 font-mono font-bold">WorkflowClient</code> instance.
            </div>

            <div className="relative">
              <div className="absolute right-3 top-3 z-10">
                <button
                  type="button"
                  onClick={() => handleCopy(javaEnvCode, 'java-env')}
                  className="p-1.5 rounded bg-black/80 hover:bg-black text-slate-400 hover:text-slate-200 border border-white/5 cursor-pointer text-xs flex items-center gap-1 font-mono transition-all"
                >
                  {copiedText === 'java-env' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === 'java-env' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 bg-black/50 border border-white/5 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto max-h-[420px] leading-relaxed">
                <code>{javaEnvCode}</code>
              </pre>
            </div>
          </div>
        )}

        {activeSubTab === 'native-messaging' && (
          <div className="flex flex-col gap-4">
            <div className="text-xs text-slate-400 leading-relaxed font-sans">
              Declaring the <code className="text-emerald-400 font-mono font-bold font-mono text-xs">"nativeMessaging"</code> permission inside a WebExtension or Chrome extension <code className="text-teal-400 font-mono">manifest.json</code> grants the extension authorization to exchange stdio messages with a registered local host process (such as a local .NET C# service or background daemon).
            </div>

            <div className="relative">
              <div className="absolute right-3 top-3 z-10">
                <button
                  type="button"
                  onClick={() => handleCopy(nativeMessagingCode, 'native-messaging')}
                  className="p-1.5 rounded bg-black/80 hover:bg-black text-slate-400 hover:text-slate-200 border border-white/5 cursor-pointer text-xs flex items-center gap-1 font-mono transition-all"
                >
                  {copiedText === 'native-messaging' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === 'native-messaging' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 bg-black/50 border border-white/5 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto max-h-[420px] leading-relaxed">
                <code>{nativeMessagingCode}</code>
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs text-slate-300">
                <div className="font-semibold text-emerald-400 font-mono mb-1">Minimal Manifest V3</div>
                Mandatory keys required by Chrome WebExtension V3 standard: <code className="text-amber-300 font-mono">"manifest_version": 3</code>, <code className="text-amber-300 font-mono">"name"</code>, and <code className="text-amber-300 font-mono">"version"</code>, along with metadata keys like <code className="text-emerald-300 font-mono">"icons"</code> and <code className="text-emerald-300 font-mono">"description"</code>.
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs text-slate-300">
                <div className="font-semibold text-emerald-400 font-mono mb-1">chrome.runtime.getManifest()</div>
                Returns the parsed manifest object at runtime, enabling scripts to verify declared permissions (<code className="text-emerald-300 font-mono">nativeMessaging</code>), extension name, and manifest version.
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs text-slate-300">
                <div className="font-semibold text-emerald-400 font-mono mb-1">chrome.runtime.getURL()</div>
                Converts relative paths into absolute extension URLs (<code className="text-emerald-300 font-mono">chrome-extension://&lt;id&gt;/logo.png</code>) to safely inject packaged images/assets into web DOMs.
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs text-slate-300">
                <div className="font-semibold text-emerald-400 font-mono mb-1">chrome.runtime.getPlatformInfo()</div>
                Returns a <code className="text-sky-300 font-mono">Promise&lt;PlatformInfo&gt;</code> containing host OS (<code className="text-amber-300 font-mono">mac, win, linux</code>) and processor architecture (<code className="text-amber-300 font-mono">x86-64, arm64</code>).
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs text-slate-300">
                <div className="font-semibold text-emerald-400 font-mono mb-1">web_accessible_resources</div>
                Manifest V3 object array specifying extension assets (e.g. <code className="text-amber-300 font-mono">"logo.png"</code>) exposed to target web origins (<code className="text-amber-300 font-mono">"matches": ["https://*/*"]</code>).
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs text-slate-300">
                <div className="font-semibold text-emerald-400 font-mono mb-1">manifest.json Permission</div>
                Declaring <code className="text-emerald-300 font-mono">"nativeMessaging"</code> in the permissions array unlocks <code className="text-sky-300 font-mono">chrome.runtime.connectNative()</code> and <code className="text-sky-300 font-mono">chrome.runtime.sendNativeMessage()</code>.
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs text-slate-300 col-span-1 md:col-span-2">
                <div className="font-semibold text-emerald-400 font-mono mb-1">Host Manifest & Stdio IPC</div>
                The OS host binary registers a JSON manifest for stdio IPC; length-prefixed 32-bit JSON messages enable fast bi-directional communication.
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'observability' && (
          <div className="flex flex-col gap-4">
            <div className="text-xs text-slate-400 leading-relaxed font-sans">
              Nexus provides first-class support for **OpenTelemetry (OTel)** tracing. 
              By instrumenting both the **Caller** and the **Handler** with a shared 
              <code className="text-sky-400 font-mono mx-1">ActivitySource</code>, you can achieve 
              distributed end-to-end visibility. The <code className="text-teal-400 font-mono mx-1">HttpClientInstrumentation</code> 
              automatically handles trace context propagation (W3C TraceContext) across network boundaries, 
              ensuring that spans created on the client are properly parented to those in the service handler.
            </div>

            <div className="relative">
              <div className="absolute right-3 top-3 z-10">
                <button
                  type="button"
                  onClick={() => handleCopy(observabilityCode, 'observability')}
                  className="p-1.5 rounded bg-black/80 hover:bg-black text-slate-400 hover:text-slate-200 border border-white/5 cursor-pointer text-xs flex items-center gap-1 font-mono transition-all"
                >
                  {copiedText === 'observability' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === 'observability' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 bg-black/50 border border-white/5 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto max-h-[420px] leading-relaxed">
                <code>{observabilityCode}</code>
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sky-300 font-semibold text-xs">
                  <Activity className="w-4 h-4" />
                  Distributed Tracing
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Connects the dots between the asynchronous caller and the long-running handler across different services and namespaces.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-teal-300 font-semibold text-xs">
                  <Cpu className="w-4 h-4" />
                  Context Propagation
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Uses W3C headers to move Trace IDs from the client request to the Nexus handler and down into backing Temporal Workflows.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
                  <Terminal className="w-4 h-4" />
                  Latency Analysis
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Visualize bottlenecks in operation startup, polling delays, or backing workflow execution time via Jaeger or Honeycomb.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Informational Footer */}
        <div className="bg-teal-500/5 border border-teal-500/10 rounded-lg p-4 flex gap-3 items-start text-xs text-slate-300">
          <Info className="w-4.5 h-4.5 text-teal-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="flex flex-col gap-1 leading-normal font-sans">
            <span className="font-semibold text-teal-300">Asynchronous Engineering Principles</span>
            <span>
              By isolating heavy operations from the main HTTP thread, the system maintains ultra-low request latency. Client consumers can easily select between **active state polling loops** or provide an HTTP webhook end-point to receive **server-driven completion callbacks** once work resolves.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
