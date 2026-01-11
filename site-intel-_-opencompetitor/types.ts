export enum ToolId {
  WEAKNESS_SCANNER = 'weakness-scanner',
  TRAFFIC_DETECTOR = 'traffic-detector',
  AUTHORITY_BREAKDOWN = 'authority-breakdown',
  KEYWORD_GAP = 'keyword-gap',
  SERP_OWNERSHIP = 'serp-ownership',
  REVENUE_MODEL = 'revenue-model',
  CONTENT_REPLICATION = 'content-replication',
  EXPANSION_PREDICTOR = 'expansion-predictor',
  STRUCTURE_VISUALIZER = 'structure-visualizer',
  PENALTY_RISK = 'penalty-risk'
}

export interface ToolConfig {
  id: ToolId;
  title: string;
  description: string;
  icon: string;
  inputs: InputType[];
  color: string;
  badge?: string;
}

export interface InputType {
  key: string;
  label: string;
  placeholder: string;
  type: 'text' | 'url' | 'textarea';
}

export interface Issue {
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  fixExplanation: string;
  fixCode?: string; // The auto-generated code snippet
  fixLanguage?: string; // html, css, javascript, json, text
}

export interface AnalysisResult {
  score?: number;
  domainAge?: string;
  summary: string;
  metrics: { label: string; value: string | number; status: 'good' | 'warning' | 'critical' }[];
  details?: string[]; 
  issues?: Issue[]; // New field for the Resolver System
  graphData?: any[]; 
  treeData?: any; 
  revenueModel?: { type: string; probability: number }[];
}

export interface ToolState {
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  result: AnalysisResult | null;
  logs: string[];
}