
import React from 'react';
import { Thresholds } from '../types';

interface Props {
  thresholds: Thresholds;
  onUpdate: (newThresholds: Thresholds) => void;
}

const ThresholdSettings: React.FC<Props> = ({ thresholds, onUpdate }) => {
  const handleChange = (category: keyof Thresholds, field: string | null, value: string) => {
    const numValue = parseFloat(value) || 0;
    if (category === 'reagentes' && field) {
      onUpdate({
        ...thresholds,
        reagentes: { ...thresholds.reagentes, [field]: numValue }
      });
    } else if (category !== 'reagentes') {
      onUpdate({
        ...thresholds,
        [category]: numValue
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <i className="fas fa-bell text-amber-500 mr-3"></i> Limites de Alerta
        </h3>
        <p className="text-slate-500 mb-8 text-sm">
          Defina os níveis mínimos para cada insumo. O sistema notificará quando o estoque remanescente atingir esses valores.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Plantas e Floculante (Bags)</h4>
            <div className="flex items-center justify-between">
              <label className="text-slate-700 font-medium">Planta C</label>
              <input
                type="number"
                value={thresholds.plantaC}
                onChange={(e) => handleChange('plantaC', null, e.target.value)}
                className="w-32 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-slate-700 font-medium">Planta D</label>
              <input
                type="number"
                value={thresholds.plantaD}
                onChange={(e) => handleChange('plantaD', null, e.target.value)}
                className="w-32 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-slate-700 font-medium">Floculante</label>
              <input
                type="number"
                value={thresholds.flocculante}
                onChange={(e) => handleChange('flocculante', null, e.target.value)}
                className="w-32 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Reagentes (Litros)</h4>
            {Object.entries(thresholds.reagentes).map(([id, value]) => (
              <div key={id} className="flex items-center justify-between">
                <label className="text-slate-700 font-medium">{id}</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleChange('reagentes', id, e.target.value)}
                  className="w-32 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThresholdSettings;
