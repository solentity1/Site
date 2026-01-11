import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TOOLS, MOCK_LOGS } from '../constants';
import { ToolConfig, ToolId, ToolState, AnalysisResult, Issue } from '../types';
import * as Icons from 'lucide-react';
import { analyzeWithGemini } from '../services/gemini';
import { TrendChart, RevenueBarChart, StructureTree } from '../components/Charts';

const IssueCard = ({ issue }: { issue: Issue }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (issue.fixCode) {
            navigator.clipboard.writeText(issue.fixCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const severityColor = {
        low: 'bg-blue-100 text-blue-800 border-blue-200',
        medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        high: 'bg-orange-100 text-orange-800 border-orange-200',
        critical: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                    {issue.severity === 'critical' || issue.severity === 'high' ? (
                        <Icons.AlertOctagon className="w-6 h-6 text-red-500" />
                    ) : (
                        <Icons.AlertTriangle className="w-6 h-6 text-yellow-500" />
                    )}
                    <h4 className="font-bold text-slate-900">{issue.title}</h4>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${severityColor[issue.severity] || severityColor.medium} uppercase tracking-wide`}>
                    {issue.severity}
                </span>
            </div>
            
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">{issue.description}</p>
            
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex items-center mb-2">
                    <Icons.Wrench className="w-4 h-4 text-indigo-600 mr-2" />
                    <span className="text-sm font-semibold text-slate-800">How to Fix</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">{issue.fixExplanation}</p>
                
                {issue.fixCode && (
                    <div className="relative mt-3">
                        <div className="absolute top-0 right-0 p-2">
                            <button 
                                onClick={handleCopy}
                                className="flex items-center space-x-1 px-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded text-xs text-slate-600 transition-colors"
                            >
                                {copied ? <Icons.Check className="w-3 h-3 text-green-600" /> : <Icons.Copy className="w-3 h-3" />}
                                <span>{copied ? 'Copied' : 'Copy'}</span>
                            </button>
                        </div>
                        <pre className="bg-slate-800 text-slate-50 rounded-lg p-4 pt-8 text-xs font-mono overflow-x-auto">
                            <code>{issue.fixCode}</code>
                        </pre>
                        {issue.fixLanguage && (
                            <div className="absolute top-2 left-4 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                {issue.fixLanguage}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const ResultSection = ({ toolId, result }: { toolId: ToolId, result: AnalysisResult }) => {
    
    // Dynamic rendering based on tool type
    const isChartTool = [ToolId.TRAFFIC_DETECTOR, ToolId.SERP_OWNERSHIP].includes(toolId);
    const isRevenueTool = toolId === ToolId.REVENUE_MODEL;
    const isStructureTool = toolId === ToolId.STRUCTURE_VISUALIZER;
    const isIssueTool = toolId === ToolId.WEAKNESS_SCANNER; // Now Auto-Fixer

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Score & Age Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-slate-900">Analysis Summary</h3>
                        {result.domainAge && (
                             <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                <Icons.Calendar className="w-3 h-3 mr-1" />
                                Age: {result.domainAge}
                             </span>
                        )}
                    </div>
                    <p className="text-slate-600 leading-relaxed">{result.summary}</p>
                </div>
                {result.score !== undefined && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"></div>
                        <span className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-2">Overall Score</span>
                        <div className="relative">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                                <circle cx="64" cy="64" r="56" stroke={result.score > 70 ? "#10b981" : result.score > 40 ? "#f59e0b" : "#ef4444"} strokeWidth="8" fill="transparent" strokeDasharray={351} strokeDashoffset={351 - (351 * result.score) / 100} className="transition-all duration-1000 ease-out" />
                            </svg>
                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-slate-900">
                                {result.score}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Metrics Grid */}
            {result.metrics && result.metrics.length > 0 && (
                <div>
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Key Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {result.metrics.map((metric, i) => (
                            <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col">
                                <span className="text-slate-500 text-sm mb-1">{metric.label}</span>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-semibold text-slate-900 truncate">{metric.value}</span>
                                    <div className={`w-3 h-3 rounded-full ${metric.status === 'good' ? 'bg-green-500' : metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Auto-Fix Issues List */}
            {isIssueTool && result.issues && result.issues.length > 0 && (
                <div>
                    <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center">
                        <Icons.Zap className="w-5 h-5 text-indigo-600 mr-2" />
                        Detected Issues & Auto-Fixes
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                        {result.issues.map((issue, idx) => (
                            <IssueCard key={idx} issue={issue} />
                        ))}
                    </div>
                </div>
            )}

            {/* Visualization Areas */}
            {isChartTool && result.graphData && (
                 <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Trend Analysis</h3>
                    <TrendChart data={result.graphData} />
                 </div>
            )}

            {isRevenueTool && result.revenueModel && (
                 <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Monetization Probability</h3>
                    <RevenueBarChart data={result.revenueModel} />
                 </div>
            )}

            {isStructureTool && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Sitemap Visualization</h3>
                    <StructureTree />
                    <p className="text-xs text-slate-500 mt-2">Visual representation of inferred hierarchy.</p>
                </div>
            )}

            {/* General Solutions (Fallback) */}
            {result.details && result.details.length > 0 && !isIssueTool && (
                 <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center">
                        <Icons.Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                        Actionable Solutions
                    </h3>
                    <div className="space-y-4">
                        {result.details.map((detail, idx) => (
                            <div key={idx} className="flex items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <Icons.CheckCircle2 className="w-5 h-5 text-indigo-600 mr-3 shrink-0 mt-0.5" />
                                <span className="text-slate-700 text-sm leading-relaxed">{detail}</span>
                            </div>
                        ))}
                    </div>
                 </div>
            )}

             <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-xs text-blue-700 flex items-start">
                <Icons.Info className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                <p>Results generated by Site Intel AI. Data is estimated based on live search results. "N/A" indicates a new site or insufficient data.</p>
            </div>
        </div>
    );
};

export default function ToolRunner() {
  const { toolId } = useParams<{ toolId: string }>();
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [appState, setAppState] = useState<ToolState>({ status: 'idle', result: null, logs: [] });
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const config = TOOLS.find(t => t.id === toolId);
  
  // Reset state when tool changes
  useEffect(() => {
    setInputs({});
    setAppState({ status: 'idle', result: null, logs: [] });
    setErrorDetails(null);
  }, [toolId]);

  // Scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [appState.logs]);

  if (!config) return <div className="text-center text-slate-900 py-20">Tool not found.</div>;

  const Icon = (Icons as any)[config.icon];

  const handleInputChange = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const runAnalysis = async () => {
    // Check fields
    const missing = config.inputs.some(i => !inputs[i.key]);
    if (missing) {
        alert("Please fill in all fields.");
        return;
    }

    setAppState({ status: 'analyzing', result: null, logs: ["Initializing engine...", "Checking Domain Age...", "Connecting to live search index..."] });
    setErrorDetails(null);

    // Simulate logs for UX
    let step = 0;
    const interval = setInterval(() => {
        if (step < MOCK_LOGS.length) {
            setAppState(prev => ({ ...prev, logs: [...prev.logs, MOCK_LOGS[step]] }));
            step++;
        }
    }, 400);

    try {
        const result = await analyzeWithGemini(config.id, inputs);
        clearInterval(interval);
        // Add a small delay so user sees the "Processing" phase
        setTimeout(() => {
             setAppState({ status: 'complete', result, logs: [] });
        }, 1500);
    } catch (e: any) {
        clearInterval(interval);
        setAppState({ status: 'error', result: null, logs: [] });
        
        // Improve error message handling
        console.error("Analysis Error:", e);
        let msg = e.message || "Unknown error occurred.";
        
        // Detect specific API Key errors
        if (msg.includes("400") && msg.includes("API key not valid")) {
            setErrorDetails("Invalid API Key. Please verify the key in services/gemini.ts matches your Google Cloud Project.");
        } else if (msg.includes("API_KEY_INVALID")) {
            setErrorDetails("Access Denied. If using a browser-restricted key, please ensure 'https://site-intel.netlify.app' is added to your Allowed Referrers in Google Cloud Console.");
        } else {
            setErrorDetails(msg);
        }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
            <Icons.ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-10 text-center md:text-left">
            <div className="inline-flex p-3 rounded-xl bg-white border border-gray-200 mb-4 shadow-sm">
                <Icon className={`w-8 h-8 ${config.color}`} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{config.title}</h1>
            {config.badge && (
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 align-middle">
                    {config.badge}
                </span>
            )}
            <p className="text-slate-600 text-lg max-w-2xl mt-2">{config.description}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24 shadow-lg shadow-gray-200/50">
                    <div className="space-y-6">
                        {config.inputs.map((input) => (
                            <div key={input.key}>
                                <label className="block text-sm font-medium text-slate-700 mb-2">{input.label}</label>
                                {input.type === 'textarea' ? (
                                    <textarea 
                                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                        rows={4}
                                        placeholder={input.placeholder}
                                        value={inputs[input.key] || ''}
                                        onChange={(e) => handleInputChange(input.key, e.target.value)}
                                    />
                                ) : (
                                    <input 
                                        type={input.type} 
                                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                        placeholder={input.placeholder}
                                        value={inputs[input.key] || ''}
                                        onChange={(e) => handleInputChange(input.key, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}

                        <button 
                            onClick={runAnalysis}
                            disabled={appState.status === 'analyzing'}
                            className={`w-full py-4 rounded-lg font-bold text-lg shadow-md transform transition-all 
                                ${appState.status === 'analyzing' 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02] hover:shadow-indigo-500/25 active:scale-95'}`}
                        >
                            {appState.status === 'analyzing' ? 'Processing...' : 'Analyze Now'}
                        </button>

                        <div className="text-xs text-center text-slate-500">
                            100% Free • No Login Required • AdSense Safe
                        </div>
                    </div>
                </div>
            </div>

            {/* Output Panel */}
            <div className="lg:col-span-2 min-h-[400px]">
                {appState.status === 'idle' && (
                    <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-12 text-slate-400 bg-gray-50">
                        <Icons.Search className="w-16 h-16 mb-4 opacity-50" />
                        <p className="text-lg">Enter details and hit Analyze to start.</p>
                    </div>
                )}

                {appState.status === 'analyzing' && (
                    <div className="h-full bg-gray-50 rounded-xl border border-gray-200 p-6 font-mono text-sm relative overflow-hidden shadow-inner">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-slide"></div>
                        <div className="space-y-2 h-full overflow-y-auto" ref={logContainerRef}>
                            {appState.logs.map((log, i) => (
                                <div key={i} className="flex items-center text-slate-700 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <span className="mr-2 opacity-50 text-slate-400">[{new Date().toLocaleTimeString()}]</span>
                                    <span>{'>'} {log}</span>
                                </div>
                            ))}
                            <div className="animate-pulse text-indigo-500 mt-4">_</div>
                        </div>
                    </div>
                )}

                {appState.status === 'complete' && appState.result && (
                    <ResultSection toolId={config.id} result={appState.result} />
                )}
                
                {appState.status === 'error' && (
                     <div className="h-full flex flex-col items-center justify-center border border-red-200 bg-red-50 rounded-xl p-12 text-center">
                        <Icons.AlertOctagon className="w-16 h-16 mb-4 text-red-600" />
                        <h3 className="text-lg font-bold text-red-700 mb-2">Analysis Failed</h3>
                        <p className="text-sm text-red-600 max-w-md mx-auto mb-4">{errorDetails || "The AI service is temporarily unavailable. Please try again."}</p>
                        {errorDetails && errorDetails.includes("Access Denied") && (
                            <div className="text-xs bg-white p-3 rounded border border-red-200 text-left w-full max-w-sm">
                                <strong>Troubleshooting:</strong>
                                <ul className="list-disc pl-4 mt-1 space-y-1">
                                    <li>Go to Google Cloud Console {'>'} API & Services {'>'} Credentials.</li>
                                    <li>Click on your API Key ("SiteIntel").</li>
                                    <li>Under "Application restrictions", check "HTTP referrers (web sites)".</li>
                                    <li>Ensure <code>https://site-intel.netlify.app/*</code> is added to the allowed list.</li>
                                    <li>Wait 1-2 minutes for changes to propagate.</li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}