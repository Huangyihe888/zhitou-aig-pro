
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * 深度分析：使用 Gemini 3 Pro + Search Grounding
 */
export const analyzeStockPro = async (query: string): Promise<AnalysisResult> => {
  const ai = getAI();
  const modelId = "gemini-3-pro-preview";

  const prompt = `
    你是一名资深的 A 股证券分析师。
    任务：利用 Google Search 实时检索并深度分析 A 股标的 "${query}"。
    
    分析维度：
    1. 【公司概况】：简述主营业务、核心竞争力及行业地位（50-100字）。
    2. 【实时行情】：当前股价走势、主力资金动向。
    3. 【技术形态】：支撑压力位及短期走势研判。
    4. 【研报精华】：汇总近期主流券商的核心观点。
    
    输出要求：
    - 结构化 Markdown 格式。
    - 颜色：红色上涨(up)，绿色下跌(down)。
    - 必须包含“公司概况”板块。
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    const text = response.text || "检索失败。";
    
    // 简单解析出公司概况（假设 AI 按照约定输出了该板块）
    const companyInfoMatch = text.match(/【公司概况】([\s\S]*?)(?=【|$)/);
    const companyInfo = companyInfoMatch ? companyInfoMatch[1].trim() : "";

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({ uri: web.uri, title: web.title }));

    return {
      stockName: query,
      stockCode: "A-Share Pro",
      summary: text,
      companyInfo,
      sources: Array.from(new Map(sources.map((item:any) => [item.uri, item])).values()) as any[]
    };
  } catch (error) {
    console.error("Pro Analysis Error:", error);
    throw error;
  }
};

export const createChatSession = () => {
  const ai = getAI();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: '你是一位专业的 A 股投顾机器人，擅长解答股票知识、宏观经济分析及投资策略咨询。',
    },
  });
};

export const getMarketHotspots = async (): Promise<string[]> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "搜索今日 A 股最热门的 4 个研报主题关键词，用逗号分隔。",
      config: { tools: [{ googleSearch: {} }] },
    });
    return (response.text || "").split(/[,，]/).map(s => s.trim()).slice(0, 4);
  } catch {
    return ["中特估", "低空经济", "半导体", "出海链"];
  }
};
