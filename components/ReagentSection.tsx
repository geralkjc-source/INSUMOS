
import React from 'react';
import { ReagentTank } from '../types';

interface Props {
  tanks: ReagentTank[];
  onChange: (newTanks: ReagentTank[]) => void;
}

const ReagentSection: React.FC<Props> = ({ tanks, onChange }) => {
  const handleChange = (index: number, field: 'initial' | 'final', value: string) => {
    const newTanks = [...tanks];
    newTanks[index] = { ...newTanks[index], [field]: parseFloat(value) || 0 };
    onChange(newTanks);
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center">
          <i className="fas fa-tint mr-2 text-emerald-500"></i> Reagentes (L)
        </h3>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cálculo Automático</span>
      </div>
      
      <div className="space-y-4">
        {tanks.map((tank, idx) => {
          const consumption = tank.initial - tank.final;
          const isNegative = consumption < 0;

          return (
            <div key={tank.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">{tank.id}</span>
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${isNegative ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  <span className="text-[8px] font-black uppercase">Consumo:</span>
                  <span className="text-[10px] font-black">{consumption.toLocaleString('pt-BR')} L</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[8px] font-black text-slate-400 uppercase mb-1 px-1">Nível Inicial</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={tank.initial} 
                      onChange={(e) => handleChange(idx, 'initial', e.target.value)} 
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#1e1e1e] transition-all" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[8px] font-black text-slate-400 uppercase mb-1 px-1">Nível Final</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={tank.final} 
                      onChange={(e) => handleChange(idx, 'final', e.target.value)} 
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#1e1e1e] transition-all" 
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReagentSection;
