import { GoogleGenAI, Type } from "@google/genai";
import { ToolId, AnalysisResult } from '../types';

const SYSTEM_INSTRUCTION = `
You are Site Intel AI, a strict and accurate SEO Auditor & Code Fixer.
Your goal is to provide REALISTIC data based on Google Search grounding and generate SAFE code fixes.
Rules:
1. FIRST, check the "Domain Age" or "Creation Date" of the URL.
2. IF a site is NEW (less than 1 month old) or has no search footprint:
   - Report Traffic as "0" or "Low (New Site)".
   - Report Authority as "N/A (New Site)".
   - Do NOT hallucinate random numbers for new sites.
3. For "details", provide specific, actionable SOLUTIONS to fix the problems found.
4. Output STRICT JSON only.
`;

// Hardcoded API key provided by user to ensure immediate functionality
const API_KEY = "AlzaSyATqDz8vuCwjmbcWlbjIdRoV0Kw-vNXBDM";

export const analyzeWithGemini = async (toolId: ToolId, inputs: Record<string, string>): Promise<AnalysisResult> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please configure the API key in services/gemini.ts");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  let prompt = "";
  let schema: any = {};
  
  // Default Schema Parts
  const baseProperties = {
    score: { type: Type.NUMBER },
    domainAge: { type: Type.STRING, description: "The age of the domain (e.g., '2 months', '5 years')" },
    summary: { type: Type.STRING },
    metrics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          value: { type: Type.STRING },
          status: { type: Type.STRING, description: "One of: good, warning, critical" }
        }
      }
    },
    details: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of specific solutions or fixes" }
  };

  switch (toolId) {
    case ToolId.WEAKNESS_SCANNER:
      prompt = `
      1. Analyze ${inputs.url} for 5 critical Technical SEO or content issues.
      2. For each issue, provide:
         - A title and description.
         - Severity (low, medium, high, critical).
         - A clear explanation of how to fix it.
         - A "Fix Code" snippet if applicable (e.g., provide the missing <meta> tag, the JSON-LD schema code, or the robots.txt rule).
      3. Determine Domain Age.
      4. Assign an overall site health score.
      `;
      // Enhanced Schema for Issue Detector
      schema = {
        type: Type.OBJECT,
        properties: {
            ...baseProperties,
            issues: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        severity: { type: Type.STRING, enum: ['low', 'medium', 'high', 'critical'] },
                        description: { type: Type.STRING },
                        fixExplanation: { type: Type.STRING },
                        fixCode: { type: Type.STRING, description: "The code snippet to fix the issue (e.g. HTML, JSON)" },
                        fixLanguage: { type: Type.STRING, description: "html, css, javascript, json, or text" }
                    }
                }
            }
        }
      };
      break;

    case ToolId.TRAFFIC_DETECTOR:
      prompt = `
      1. Search for "${inputs.url} creation date" or "whois ${inputs.url}" to find Domain Age.
      2. Search for "${inputs.url} monthly visits similarweb" or "semrush traffic".
      3. IF the site is < 3 months old, set graph values to 0 and state "New Site - Insufficient Data".
      4. IF data exists, provide 6 months of trend data.
      5. In "details", explain HOW to increase traffic for this specific site type.
      `;
      schema = {
        type: Type.OBJECT,
        properties: {
            ...baseProperties,
            graphData: {
                type: Type.ARRAY,
                items: {
                   type: Type.OBJECT,
                   properties: {
                       name: { type: Type.STRING },
                       value: { type: Type.NUMBER }
                   }
                }
             }
        }
      };
      break;

    case ToolId.AUTHORITY_BREAKDOWN:
      prompt = `
      1. Search for domain age of ${inputs.url}.
      2. Estimate Authority based on backlink count and brand mentions found in search.
      3. If new site, Authority Score is 0-10.
      4. Provide solutions on how to build authority (e.g., "Guest post on X", "Fix broken links").
      `;
      schema = { type: Type.OBJECT, properties: baseProperties };
      break;

    case ToolId.KEYWORD_GAP:
      prompt = `Compare ${inputs.myUrl} vs ${inputs.competitorUrl}. Identify 5 missing keyword clusters. In "details", explain how to create content for these keywords.`;
      schema = { type: Type.OBJECT, properties: baseProperties };
      break;

    case ToolId.SERP_OWNERSHIP:
      prompt = `Search SERP for "${inputs.keyword}". Analyze dominance. Estimate difficulty. In "details", provide a strategy to rank for this keyword.`;
      schema = {
        type: Type.OBJECT,
        properties: {
            ...baseProperties,
            graphData: {
                type: Type.ARRAY,
                items: {
                   type: Type.OBJECT,
                   properties: {
                       name: { type: Type.STRING },
                       value: { type: Type.NUMBER }
                   }
                }
             }
        }
      };
      break;

    case ToolId.REVENUE_MODEL:
      prompt = `Analyze ${inputs.url}. Identify revenue model. If new/blog, suggest likely monetization (AdSense). In "details", suggest how they can improve monetization.`;
      schema = {
        type: Type.OBJECT,
        properties: {
            ...baseProperties,
            revenueModel: {
                type: Type.ARRAY,
                items: {
                   type: Type.OBJECT,
                   properties: {
                       type: { type: Type.STRING },
                       probability: { type: Type.NUMBER }
                   }
                }
             }
        }
      };
      break;

    case ToolId.CONTENT_REPLICATION:
      prompt = `Compare "${inputs.content1}" vs "${inputs.content2}". Give overlap %. In "details", explain how to rewrite the content to avoid plagiarism.`;
      schema = { type: Type.OBJECT, properties: baseProperties };
      break;

    case ToolId.EXPANSION_PREDICTOR:
      prompt = `Predict 3 likely future category expansions for ${inputs.url}. In "details", explain why these categories are good opportunities.`;
      schema = { type: Type.OBJECT, properties: baseProperties };
      break;

    case ToolId.STRUCTURE_VISUALIZER:
      prompt = `Generate a JSON tree structure for ${inputs.url}. In "details", suggest improvements to the site structure (e.g., "Flatten depth", "Add silos").`;
      schema = {
        type: Type.OBJECT,
        properties: {
            ...baseProperties,
            treeData: { type: Type.OBJECT } // Simplified for now
        }
      };
      break;

    case ToolId.PENALTY_RISK:
      prompt = `Search for spam signals for ${inputs.url}. If new, risk is low but warn about "Sandbox". In "details", provide safety tips to avoid penalties.`;
      schema = { type: Type.OBJECT, properties: baseProperties };
      break;

    default:
      throw new Error("Unknown Tool ID");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], 
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI returned an empty response. Please try again.");
    
    const jsonStr = text.replace(/```json\n|\n```/g, '').trim();
    return JSON.parse(jsonStr) as AnalysisResult;

  } catch (error: any) {
    throw error;
  }
};