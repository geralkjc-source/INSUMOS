
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Report, Thresholds } from '../types';

interface Props {
  reports: Report[];
}

const Dashboard: React.FC<Props> = ({ reports }) => {
  const [thresholds, setThresholds] = useState<Thresholds>(() => {
    const saved = localStorage.getItem('supply-thresholds');
    return saved ? JSON.parse(saved) : { plantaC: 50, plantaD: 50, flocculante: 5, reagentes: {} };
  });

  const lastReport = reports[0];

  const remC = lastReport ? (lastReport.plantaC.initial + lastReport.plantaC.abastecimento - (lastReport.plantaC.c1 + lastReport.plantaC.c2) - lastReport.plantaC.magnetitePit) : 0;
  const remD = lastReport ? (lastReport.plantaD.initial + lastReport.plantaD.abastecimento - (lastReport.plantaD.c1 + lastReport.plantaD.c2) - lastReport.plantaD.magnetitePit) : 0;
  const remFloc = lastReport ? (lastReport.flocculante.initialCount + lastReport.flocculante.abastecimento - lastReport.flocculante.consumido) : 0;

  const isLowC = remC < thresholds.plantaC;
  const isLowD = remD < thresholds.plantaD;
  const isLowFloc = remFloc < thresholds.flocculante;

  const consumptionData = reports.length > 0 ? [
    { name: 'Planta C', consumido: lastReport.plantaC.c1 + lastReport.plantaC.c2 },
    { name: 'Planta D', consumido: lastReport.plantaD.c1 + lastReport.plantaD.c2 },
    { name: 'Floculante', consumido: lastReport.flocculante.consumido },
  ] : [];

  const COLORS = ['#3b82f6', '#10b981', '#6366f1'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${isLowC ? 'bg-red-600 shadow-red-200' : 'bg-blue-600 shadow-blue-200'} p-6 rounded-2xl text-white shadow-lg relative overflow-hidden transition-colors duration-500`}>
          <i className="fas fa-box absolute -right-4 -bottom-4 text-7xl opacity-20"></i>
          <h4 className={`${isLowC ? 'text-red-100' : 'text-blue-100'} text-sm font-medium uppercase tracking-wider mb-2 flex items-center`}>
            Planta C Remanescente {isLowC && <i className="fas fa-exclamation-circle ml-2"></i>}
          </h4>
          <p className="text-3xl font-bold">{remC} Bags</p>
          {isLowC && <p className="text-xs text-red-100 mt-2 font-semibold">NÍVEL CRÍTICO</p>}
        </div>
        
        <div className={`${isLowD ? 'bg-red-600 shadow-red-200' : 'bg-emerald-600 shadow-emerald-200'} p-6 rounded-2xl text-white shadow-lg relative overflow-hidden transition-colors duration-500`}>
          <i className="fas fa-industry absolute -right-4 -bottom-4 text-7xl opacity-20"></i>
          <h4 className={`${isLowD ? 'text-red-100' : 'text-emerald-100'} text-sm font-medium uppercase tracking-wider mb-2 flex items-center`}>
            Planta D Remanescente {isLowD && <i className="fas fa-exclamation-circle ml-2"></i>}
          </h4>
          <p className="text-3xl font-bold">{remD} Bags</p>
          {isLowD && <p className="text-xs text-red-100 mt-2 font-semibold">NÍVEL CRÍTICO</p>}
        </div>
        
        <div className={`${isLowFloc ? 'bg-red-600 shadow-red-200' : 'bg-indigo-600 shadow-indigo-200'} p-6 rounded-2xl text-white shadow-lg relative overflow-hidden transition-colors duration-500`}>
          <i className="fas fa-vial absolute -right-4 -bottom-4 text-7xl opacity-20"></i>
          <h4 className={`${isLowFloc ? 'text-red-100' : 'text-indigo-100'} text-sm font-medium uppercase tracking-wider mb-2 flex items-center`}>
            Floculante em Estoque {isLowFloc && <i className="fas fa-exclamation-circle ml-2"></i>}
          </h4>
          <p className="text-3xl font-bold">{remFloc} Bags</p>
          {isLowFloc && <p className="text-xs text-red-100 mt-2 font-semibold">NÍVEL CRÍTICO</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Consumo Último Turno</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consumptionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="consumido" radius={[4, 4, 0, 0]}>
                  {consumptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Relatórios Recentes</h3>
          <div className="space-y-4">
            {reports.length === 0 ? (
              <p className="text-slate-500 text-center py-10">Nenhum relatório cadastrado.</p>
            ) : (
              reports.slice(0, 5).map(report => (
                <div key={report.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-700">{report.data} - {report.turno}</p>
                    <p className="text-xs text-slate-500">Operador: {report.operador}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${report.turma === 'A' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                    Turma {report.turma}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
