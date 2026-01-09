
import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, HelpCircle, ArrowLeft, TrendingUp, Zap, FileText, Globe, RefreshCw, Newspaper, ArrowRight, MessageSquare, Layout, Send, Loader2 } from 'lucide-react';
import { analyzeStockPro, createChatSession, getMarketHotspots } from './services/geminiService';
import AnalysisView from './components/AnalysisView';
import UsageGuide from './components/UsageGuide';
import { AnalysisResult, AnalysisStatus } from './types';

enum AppTab {
  MARKET = 'MARKET',
  CHAT = 'CHAT'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.MARKET);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [showGuide, setShowGuide] = useState(false);
  const [hotspots, setHotspots] = useState<string[]>([]);
  
  // Chat State
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const chatSessionRef = useRef<any>(null);

  useEffect(() => {
    getMarketHotspots().then(setHotspots);
  }, []);

  const handleSearch = async (targetQuery?: string) => {
    const finalQuery = targetQuery || query;
    if (!finalQuery.trim()) return;
    setStatus(AnalysisStatus.LOADING);
    setError('');
    try {
      const data = await analyzeStockPro(finalQuery);
      setResult(data);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || '分析失败');
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || isChatting) return;
    const msg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setIsChatting(true);
    try {
      if (!chatSessionRef.current) chatSessionRef.current = createChatSession();
      const response = await chatSessionRef.current.sendMessage({ message: msg });
      setChatMessages(prev => [...prev, { role: 'ai', text: response.text }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'ai', text: '抱歉，对话引擎出现波动。' }]);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-200 safe-pt flex flex-col font-sans">
      {/* 顶部固定栏 */}
      <header className="sticky top-0 z-50 glass-header border-b border-dark-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => {setStatus(AnalysisStatus.IDLE); setActiveTab(AppTab.MARKET);}}>
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/20">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <h1 className="text-xl font-black text-white">智投 A股 Pro</h1>
          </div>
          <button onClick={() => setShowGuide(true)} className="p-2 text-slate-500 hover:text-white"><HelpCircle className="w-5 h-5" /></button>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="max-w-4xl mx-auto w-full px-6 flex-1 pt-6 pb-24">
        {activeTab === AppTab.MARKET && (
          <div className="animate-fade-in">
            {status === AnalysisStatus.IDLE && (
              <div className="mt-12 text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">深度投研引擎</span>
                </div>
                <h2 className="text-5xl font-black text-white tracking-tighter mb-10 leading-none">洞察 A 股 <br/> <span className="text-blue-500">公司逻辑</span></h2>
                
                <div className="max-w-xl mx-auto relative">
                  <div className="flex bg-dark-card border-2 border-slate-800 rounded-3xl p-2 focus-within:border-blue-600 transition-all shadow-2xl">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="搜索公司名、代码、研报主题..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-white px-5 py-3 text-lg font-bold"
                    />
                    <button onClick={() => handleSearch()} className="bg-blue-600 text-white px-8 rounded-2xl font-black active:scale-95 transition-all">分析</button>
                  </div>
                </div>

                <div className="mt-16 text-left">
                  <div className="flex items-center space-x-3 mb-6 px-2 text-slate-500"><Newspaper className="w-5 h-5"/><span className="text-xs font-black uppercase tracking-widest">近期研报热点</span></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hotspots.map((h, i) => (
                      <button key={i} onClick={() => {setQuery(h); handleSearch(h);}} className="flex items-center justify-between p-5 bg-slate-900/40 border border-slate-800 rounded-2xl hover:bg-blue-600/5 hover:border-blue-500/50 transition-all group text-left">
                        <span className="font-bold text-slate-200">{h}</span>
                        <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {status === AnalysisStatus.LOADING && (
              <div className="flex flex-col items-center justify-center mt-32 space-y-6">
                <div className="w-16 h-16 border-4 border-slate-800 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-black uppercase tracking-widest animate-pulse">正在穿透全网搜寻深度报告...</p>
              </div>
            )}

            {status === AnalysisStatus.SUCCESS && result && (
              <AnalysisView result={result} onClose={() => setStatus(AnalysisStatus.IDLE)} onRefresh={() => handleSearch(result.stockName)} />
            )}
            
            {status === AnalysisStatus.ERROR && (
              <div className="text-center mt-32 space-y-6">
                <div className="text-6xl">📡</div>
                <h3 className="text-xl font-bold">连接超时</h3>
                <p className="text-slate-500 text-sm">{error}</p>
                <button onClick={handleReset} className="px-8 py-3 bg-white text-black rounded-xl font-bold">重试</button>
              </div>
            )}
          </div>
        )}

        {activeTab === AppTab.CHAT && (
          <div className="flex flex-col h-[calc(100vh-200px)] animate-fade-in">
            <div className="flex-1 overflow-y-auto space-y-4 mb-6 px-2">
              {chatMessages.length === 0 && (
                <div className="text-center mt-20 text-slate-600 space-y-4">
                  <MessageSquare className="w-12 h-12 mx-auto opacity-20" />
                  <p className="text-sm font-bold">咨询公司基本面、投资术语或宏观策略</p>
                </div>
              )}
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white font-medium' : 'bg-slate-800 text-slate-200 shadow-xl'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isChatting && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 p-4 rounded-2xl"><Loader2 className="w-4 h-4 animate-spin text-blue-500" /></div>
                </div>
              )}
            </div>
            <div className="flex space-x-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-2xl">
              <input 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                placeholder="发送您的投资疑问..." 
                className="flex-1 bg-transparent border-none focus:ring-0 text-white px-4"
              />
              <button onClick={handleChatSend} className="bg-blue-600 p-3 rounded-xl hover:bg-blue-500 transition-colors"><Send className="w-5 h-5 text-white" /></button>
            </div>
          </div>
        )}
      </main>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 glass-header border-t border-dark-border safe-pb z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-4xl mx-auto flex justify-around py-3">
          <TabButton icon={<Layout/>} label="深度分析" active={activeTab === AppTab.MARKET} onClick={() => setActiveTab(AppTab.MARKET)} />
          <TabButton icon={<MessageSquare/>} label="AI 投顾" active={activeTab === AppTab.CHAT} onClick={() => setActiveTab(AppTab.CHAT)} />
        </div>
      </nav>

      {showGuide && <UsageGuide onClose={() => setShowGuide(false)} />}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const handleReset = () => { window.location.reload(); };

const TabButton = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center space-y-1 px-12 py-1 transition-all ${active ? 'text-blue-500 scale-105' : 'text-slate-600 hover:text-slate-400'}`}>
    {React.cloneElement(icon, { className: 'w-5 h-5' })}
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
