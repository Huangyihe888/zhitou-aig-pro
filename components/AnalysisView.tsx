
import React from 'react';
import { AnalysisResult } from '../types';
import StockChart from './StockChart';
import { ExternalLink, TrendingUp, TrendingDown, AlertCircle, FileText, Globe, RefreshCw, Info } from 'lucide-react';

interface AnalysisViewProps {
  result: AnalysisResult;
  onClose: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, onClose, onRefresh, isRefreshing }) => {
  const isPositive = !result.summary.includes("下跌") && !result.summary.includes("看空") && !result.summary.includes("绿");

  const formatText = (text: string) => {
    // 移除已经提取出来的公司概况部分，避免重复显示
    const cleanText = text.replace(/【公司概况】[\s\S]*?(?=【|$)/, "").trim();
    
    return cleanText.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return <div key={index} className="h-2" />;
      
      if (trimmedLine.startsWith('###') || trimmedLine.startsWith('**【') || trimmedLine.startsWith('【')) {
        return (
          <h3 key={index} className="text-lg font-bold text-white mt-6 mb-3 flex items-center">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
            {trimmedLine.replace(/[#*【】]/g, '')}
          </h3>
        );
      }
      
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('* ') || /^\d+\./.test(trimmedLine)) {
        return (
          <li key={index} className="ml-2 mb-3 text-slate-300 list-none flex items-start">
            <span className="text-blue-500 mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span className="text-sm md:text-base">{trimmedLine.replace(/^([-*]|\d+\.)\s*/, '').trim()}</span>
          </li>
        );
      }
      
      return <p key={index} className="mb-4 text-slate-400 leading-relaxed text-sm md:text-base pl-4 border-l border-slate-800">{trimmedLine.replace(/\*\*/g, '')}</p>;
    });
  };

  return (
    <div className="animate-fade-in space-y-6 pb-32">
      {/* 头部行情 */}
      <div className="bg-dark-card border border-dark-border rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group">
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-2">
               <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Live</span>
               <span className="text-slate-500 text-[10px] font-bold">实时分析引擎</span>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter">{result.stockName}</h2>
          </div>
          
          <div className="flex flex-col items-end">
            <button onClick={onRefresh} disabled={isRefreshing} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white mb-2">
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <div className={`flex items-center space-x-1 ${isPositive ? 'text-up' : 'text-down'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-xs font-black uppercase">{isPositive ? '震荡上行' : '震荡下行'}</span>
            </div>
          </div>
        </div>
        
        <StockChart stockName={result.stockName} isPositive={isPositive} />
      </div>

      {/* 公司概况板块 */}
      {result.companyInfo && (
        <div className="bg-blue-600/5 border border-blue-500/20 rounded-3xl p-6">
          <div className="flex items-center space-x-2 mb-3 text-blue-400">
            <Info className="w-4 h-4" />
            <h4 className="text-xs font-black uppercase tracking-widest">公司概况与核心逻辑</h4>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            {result.companyInfo}
          </p>
        </div>
      )}

      {/* 深度研报主体 */}
      <div className="bg-dark-card border border-dark-border rounded-[2rem] p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-blue-600 p-2 rounded-xl"><FileText className="text-white w-5 h-5" /></div>
          <h3 className="text-xl font-black text-white">AI 智能深度研报</h3>
        </div>
        <div>{formatText(result.summary)}</div>
      </div>

      {/* 关联报告列表 */}
      {result.sources.length > 0 && (
        <div className="bg-dark-card/40 border border-dark-border rounded-[2rem] p-6">
          <div className="flex items-center space-x-3 mb-5 px-2">
            <Globe className="text-blue-500 w-5 h-5" />
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">底层关联报告与资讯</h4>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {result.sources.map((source, idx) => (
              <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-slate-900/40 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all group">
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-slate-600 group-hover:text-blue-500" />
                  <span className="text-xs text-slate-300 group-hover:text-blue-400 line-clamp-1">{source.title}</span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-700" />
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-start space-x-4 px-8 py-6 bg-slate-900/50 border border-slate-800 rounded-3xl opacity-60">
        <AlertCircle className="w-4 h-4 text-slate-600 mt-1" />
        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
          数据通过 Google Search 检索所得，不构成投资建议。遵循中国股市习惯：<span className="text-up font-bold">红色上涨</span>，<span className="text-down font-bold">绿色下跌</span>。
        </p>
      </div>
    </div>
  );
};

export default AnalysisView;
