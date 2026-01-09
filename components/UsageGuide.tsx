import React from 'react';
import { X, BookOpen, Search, Info, AlertTriangle } from 'lucide-react';

interface UsageGuideProps {
  onClose: () => void;
}

const UsageGuide: React.FC<UsageGuideProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-dark-bg/95 backdrop-blur-md flex flex-col p-6 animate-fade-in overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <BookOpen className="text-blue-500" />
          <h2 className="text-xl font-bold text-white">使用指南</h2>
        </div>
        <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-8 max-w-2xl mx-auto w-full">
        <section className="space-y-3">
          <div className="flex items-center space-x-2 text-blue-400">
            <Search className="w-5 h-5" />
            <h3 className="font-semibold">如何开始分析？</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            在首页搜索框输入股票的<strong>名称</strong>（如：腾讯控股）或<strong>代码</strong>（如：00700），点击“分析”按钮。AI 将实时检索全网最新数据并生成报告。
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center space-x-2 text-purple-400">
            <Info className="w-5 h-5" />
            <h3 className="font-semibold">报告包含哪些内容？</h3>
          </div>
          <ul className="text-slate-400 text-sm space-y-2 list-disc pl-5">
            <li><strong>实时行情：</strong>基于 Google Search 检索的最新价格。</li>
            <li><strong>技术分析：</strong>形态研判与支撑压力位。</li>
            <li><strong>消息面：</strong>近期重大利好利空及主力意图。</li>
            <li><strong>参考来源：</strong>点击报告底部的链接可查看原始新闻。</li>
          </ul>
        </section>

        <section className="space-y-3">
          <div className="flex items-center space-x-2 text-yellow-500">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold">特别提示</h3>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
            <p className="text-yellow-200/80 text-xs leading-relaxed">
              1. 遵循中国股市习惯：<span className="text-up font-bold">红涨</span>、<span className="text-down font-bold">绿跌</span>。<br/>
              2. 本工具基于 AI 生成，由于搜索数据的滞后性，请以专业行情软件为准。<br/>
              3. 股市有风险，投资需谨慎，AI 建议仅供学习与参考。
            </p>
          </div>
        </section>

        <button 
          onClick={onClose}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20"
        >
          我知道了，开始使用
        </button>
      </div>
    </div>
  );
};

export default UsageGuide;