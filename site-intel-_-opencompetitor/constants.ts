import { ToolConfig, ToolId } from './types';
import { 
  Activity, AlertTriangle, BarChart3, GitBranch, Globe, 
  Layers, Layout, Search, ShieldAlert, Zap, Wrench
} from 'lucide-react';

export const TOOLS: ToolConfig[] = [
  {
    id: ToolId.WEAKNESS_SCANNER,
    title: "Issue Detector & Auto-Fixer",
    description: "Scans for SEO & technical errors, then generates the actual code (HTML, Schema, etc.) to fix them instantly.",
    icon: "Wrench",
    color: "text-red-600",
    badge: "CORE ENGINE",
    inputs: [{ key: 'url', label: 'Target URL', placeholder: 'https://example.com', type: 'url' }]
  },
  {
    id: ToolId.TRAFFIC_DETECTOR,
    title: "Traffic Drop / Gain Detector",
    description: "Estimate organic volatility and diagnose potential algorithm hits using live signals.",
    icon: "BarChart3",
    color: "text-green-600",
    inputs: [{ key: 'url', label: 'Domain', placeholder: 'example.com', type: 'text' }]
  },
  {
    id: ToolId.AUTHORITY_BREAKDOWN,
    title: "Website Authority Breakdown",
    description: "A deep dive into brand trust, content freshness, and domain maturity.",
    icon: "ShieldAlert",
    color: "text-blue-600",
    inputs: [{ key: 'url', label: 'Domain', placeholder: 'example.com', type: 'text' }]
  },
  {
    id: ToolId.KEYWORD_GAP,
    title: "Competitor Keyword Gap",
    description: "Compare two domains to find missing keyword clusters and opportunities.",
    icon: "Search",
    color: "text-yellow-600",
    inputs: [
      { key: 'myUrl', label: 'Your Domain', placeholder: 'yoursite.com', type: 'text' },
      { key: 'competitorUrl', label: 'Competitor Domain', placeholder: 'competitor.com', type: 'text' }
    ]
  },
  {
    id: ToolId.SERP_OWNERSHIP,
    title: "SERP Ownership Checker",
    description: "Visual dominance meter for specific keywords to check monopoly scores.",
    icon: "Layers",
    color: "text-purple-600",
    inputs: [{ key: 'keyword', label: 'Keyword', placeholder: 'best running shoes', type: 'text' }]
  },
  {
    id: ToolId.REVENUE_MODEL,
    title: "Revenue Model Detector",
    description: "Reverse engineer how a website makes money (Ads, Affiliates, SaaS).",
    icon: "Zap",
    color: "text-emerald-600",
    inputs: [{ key: 'url', label: 'Website URL', placeholder: 'https://example.com', type: 'url' }]
  },
  {
    id: ToolId.CONTENT_REPLICATION,
    title: "Content Replication Detector",
    description: "Analyze topic overlap and potential duplicate content issues.",
    icon: "Layout",
    color: "text-orange-600",
    inputs: [
        { key: 'content1', label: 'Source Content / URL', placeholder: 'Paste text or URL', type: 'textarea' },
        { key: 'content2', label: 'Comparison Content / URL', placeholder: 'Paste text or URL', type: 'textarea' }
    ]
  },
  {
    id: ToolId.EXPANSION_PREDICTOR,
    title: "Site Expansion Predictor",
    description: "Forecast likely new categories and future content velocity.",
    icon: "Globe",
    color: "text-cyan-600",
    inputs: [{ key: 'url', label: 'Domain', placeholder: 'example.com', type: 'text' }]
  },
  {
    id: ToolId.STRUCTURE_VISUALIZER,
    title: "Structure Visualizer",
    description: "Generate a visual map of likely URL silos and orphan pages.",
    icon: "GitBranch",
    color: "text-pink-600",
    inputs: [{ key: 'url', label: 'Domain', placeholder: 'example.com', type: 'text' }]
  },
  {
    id: ToolId.PENALTY_RISK,
    title: "Google Penalty Risk",
    description: "Detect dangerous patterns like anchor abuse and spammy footprints.",
    icon: "AlertTriangle",
    color: "text-rose-600",
    inputs: [{ key: 'url', label: 'Domain', placeholder: 'example.com', type: 'text' }]
  }
];

export const MOCK_LOGS = [
    "Resolving DNS...",
    "Querying WHOIS database for age...",
    "Verifying Search Index status...",
    "Retrieving competitive signals...",
    "Cross-referencing authority nodes...",
    "Synthesizing solutions...",
    "Generating final report..."
];