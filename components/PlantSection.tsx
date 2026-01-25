
import React from 'react';
import { PlantData } from '../types';

interface PlantSectionProps {
  title: string;
  data: PlantData;
  onChange: (newData: PlantData) => void;
}

const PlantSection: React.FC<PlantSectionProps> = ({ title, data, onChange }) => {
  const handleChange = (field: keyof PlantData, value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange({ ...data, [field]: numValue });
  };

  const isPlantaC = title.toUpperCase().includes('C');
  const label1 = isPlantaC ? 'C1' : 'D1';
  const label2 = isPlantaC ? 'C2' : 'D2';
  const remanescente = data.initial + data.abastecimento - (data.c1 + data.c2) - data.magnetitePit;

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center">
          <i className={`fas fa-cube mr-2 ${isPlantaC ? 'text-blue-500' : 'text-emerald-500'}`}></i>
          Magnetite {title}
        </h3>
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg ${remanescente < 50 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
          RESTO: {remanescente}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-3">
          <div>
            <label className="block text-[8px] font-black text-slate-400 uppercase mb-1 px-1">Início</label>
            <input type="number" value={data.initial} onChange={(e) => handleChange('initial', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white outline-none" />
          </div>
          <div>
            <label className="block text-[8px] font-black text-slate-400 uppercase mb-1 px-1">Abast.</label>
            <input type="number" value={data.abastecimento} onChange={(e) => handleChange('abastecimento', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white outline-none" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex gap-2">
             <div className="flex-1">
                <label className="block text-[8px] font-black text-slate-400 uppercase mb-1 px-1">{label1}</label>
                <input type="number" value={data.c1} onChange={(e) => handleChange('c1', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
             </div>
             <div className="flex-1">
                <label className="block text-[8px] font-black text-slate-400 uppercase mb-1 px-1">{label2}</label>
                <input type="number" value={data.c2} onChange={(e) => handleChange('c2', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
             </div>
          </div>
          <div>
            <label className="block text-[8px] font-black text-slate-400 uppercase mb-1 px-1">Pit</label>
            <input type="number" value={data.magnetitePit} onChange={(e) => handleChange('magnetitePit', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantSection;
