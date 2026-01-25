
import React from 'react';
import { FlocculantData } from '../types';

interface Props {
  data: FlocculantData;
  onChange: (newData: FlocculantData) => void;
}

const FlocculantSection: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (field: keyof FlocculantData, value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange({ ...data, [field]: numValue });
  };

  const finalCount = data.initialCount + data.abastecimento - data.consumido;

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
      <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center">
        <i className="fas fa-flask mr-2 text-indigo-500"></i> Floculante
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[8px] font-black text-slate-400 uppercase mb-1 px-1">Estoque Inicial (Bags)</label>
          <input type="number" value={data.initialCount} onChange={(e) => handleChange('initialCount', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
        </div>
        <div>
          <label className="block text-[8px] font-black text-slate-400 uppercase mb-1 px-1">Consumo</label>
          <input type="number" value={data.consumido} onChange={(e) => handleChange('consumido', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
        </div>
        <div>
          <label className="block text-[8px] font-black text-slate-400 uppercase mb-1 px-1">Abast.</label>
          <input type="number" value={data.abastecimento} onChange={(e) => handleChange('abastecimento', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
        </div>
        <div className="flex flex-col justify-end">
           <div className="h-full w-full bg-indigo-600 rounded-xl flex items-center justify-center text-white text-[10px] font-black tracking-widest">
              FINAL: {finalCount}
           </div>
        </div>
      </div>
    </div>
  );
};

export default FlocculantSection;
