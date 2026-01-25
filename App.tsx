
import React, { useState, useEffect } from 'react';
import { Report, PlantData, FlocculantData, ReagentTank, MagnetiteJustification, AppView } from './types';
import PlantSection from './components/PlantSection';
import FlocculantSection from './components/FlocculantSection';
import ReagentSection from './components/ReagentSection';
import Dashboard from './components/Dashboard';

const DEFAULT_PLANT: PlantData = { initial: 0, abastecimento: 0, c1: 0, c2: 0, magnetitePit: 0 };
const DEFAULT_FLOC: FlocculantData = { initialCount: 24, initialWeight: 500, consumido: 0, abastecimento: 0 };
const DEFAULT_REAGENTS: ReagentTank[] = [
  { id: '9C-TK-501', initial: 59000, final: 59000 },
  { id: '9C-TK-301', initial: 59000, final: 59000 },
  { id: '9C-TK-302', initial: 21200, final: 21200 },
];
const DEFAULT_JUSTIFICATION: MagnetiteJustification = { c1: '', c2: '', d1: '', d2: '' };

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('industrial-reports-v3');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState<Partial<Report>>({
    turma: 'A',
    operador: '',
    data: new Date().toISOString().split('T')[0],
    turno: '14h a 22h',
    plantaC: { ...DEFAULT_PLANT },
    plantaD: { ...DEFAULT_PLANT },
    flocculante: { ...DEFAULT_FLOC },
    reagentes: [...DEFAULT_REAGENTS],
    magnetiteJustification: { ...DEFAULT_JUSTIFICATION }
  });

  const [copyStatus, setCopyStatus] = useState(false);

  useEffect(() => {
    if (reports.length > 0) {
      const last = reports[0];
      setFormData(prev => ({
        ...prev,
        operador: last.operador,
        turma: last.turma,
        plantaC: { ...DEFAULT_PLANT, initial: calculateRem(last.plantaC) },
        plantaD: { ...DEFAULT_PLANT, initial: calculateRem(last.plantaD) },
        flocculante: { ...DEFAULT_FLOC, initialCount: (last.flocculante.initialCount + last.flocculante.abastecimento - last.flocculante.consumido) },
        reagentes: last.reagentes.map(r => ({ ...r, initial: r.final, final: r.final })),
      }));
    }
    localStorage.setItem('industrial-reports-v3', JSON.stringify(reports));
  }, [reports]);

  const calculateRem = (p: PlantData) => p.initial + p.abastecimento - (p.c1 + p.c2) - p.magnetitePit;

  const validateForm = () => {
    if (!formData.operador) { alert("Informe o nome do operador."); return false; }
    
    const j = formData.magnetiteJustification;
    const errors = [];
    if (formData.plantaC!.c1 > 0 && !j?.c1.trim()) errors.push("Justificativa Planta C - C1");
    if (formData.plantaC!.c2 > 0 && !j?.c2.trim()) errors.push("Justificativa Planta C - C2");
    if (formData.plantaD!.c1 > 0 && !j?.d1.trim()) errors.push("Justificativa Planta D - D1");
    if (formData.plantaD!.c2 > 0 && !j?.d2.trim()) errors.push("Justificativa Planta D - D2");

    if (errors.length > 0) {
      alert(`Erro: Justificativa obrigatória para consumo registrado em:\n${errors.join('\n')}`);
      return false;
    }
    return true;
  };

  const handleSaveAndCopy = async () => {
    if (!validateForm()) return;

    const newReport: Report = { ...formData as Report, id: Date.now().toString() };
    setReports([newReport, ...reports]);
    
    const text = formatReportForWhatsApp(newReport);
    await navigator.clipboard.writeText(text);
    setCopyStatus(true);
    setTimeout(() => { setCopyStatus(false); setView('dashboard'); }, 2000);
  };

  const formatReportForWhatsApp = (report: Report) => {
    const remC = calculateRem(report.plantaC);
    const remD = calculateRem(report.plantaD);
    const j = report.magnetiteJustification;
    return `*Relatório de Insumos - VULCAN*\n*Turma ${report.turma}*\nOp: ${report.operador}\nData: ${report.data}\n\n*Planta C:* Rem: ${remC} Bags\n*Planta D:* Rem: ${remD} Bags\n\n*Justificativa Magnetite:*\n▪️C1: ${j.c1 || 'N/A'}\n▪️C2: ${j.c2 || 'N/A'}\n▪️D1: ${j.d1 || 'N/A'}\n▪️D2: ${j.d2 || 'N/A'}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-slate-900">VULCAN</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Supply Platform</span>
          </div>
          <div className="flex gap-1">
             {['dashboard', 'new-report', 'history'].map((v) => (
               <button 
                key={v}
                onClick={() => setView(v as AppView)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${view === v ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:bg-slate-50'}`}
               >
                 {v === 'new-report' ? 'Novo' : v}
               </button>
             ))}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {view === 'dashboard' && <Dashboard reports={reports} />}

        {view === 'new-report' && (
          <div className="space-y-6 pb-20">
            <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Operador</label>
                  <input type="text" value={formData.operador} onChange={e => setFormData({...formData, operador: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900" placeholder="Nome Completo" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Turma</label>
                  <select value={formData.turma} onChange={e => setFormData({...formData, turma: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                    {['A', 'B', 'C', 'D'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Data</label>
                  <input type="date" value={formData.data} onChange={e => setFormData({...formData, data: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                </div>
              </div>
            </section>

            <PlantSection title="Planta C" data={formData.plantaC!} onChange={val => setFormData({...formData, plantaC: val})} />
            <PlantSection title="Planta D" data={formData.plantaD!} onChange={val => setFormData({...formData, plantaD: val})} />
            <FlocculantSection data={formData.flocculante!} onChange={val => setFormData({...formData, flocculante: val})} />
            <ReagentSection tanks={formData.reagentes!} onChange={val => setFormData({...formData, reagentes: val})} />

            <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Justificativa de Magnetite (Obrigatório)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'c1', label: 'C1', active: formData.plantaC!.c1 > 0 },
                  { id: 'c2', label: 'C2', active: formData.plantaC!.c2 > 0 },
                  { id: 'd1', label: 'D1', active: formData.plantaD!.c1 > 0 },
                  { id: 'd2', label: 'D2', active: formData.plantaD!.c2 > 0 },
                ].map(item => (
                  <div key={item.id}>
                    <label className="text-[8px] font-black text-slate-400 uppercase mb-1 flex justify-between">
                      {item.label} {item.active && <span className="text-red-500">* Obrigatório</span>}
                    </label>
                    <input 
                      type="text" 
                      placeholder={item.active ? "Descreva o motivo do consumo..." : "Opcional"}
                      className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold outline-none transition-all ${item.active && !formData.magnetiteJustification?.[item.id as keyof MagnetiteJustification] ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-slate-900'}`}
                      value={formData.magnetiteJustification?.[item.id as keyof MagnetiteJustification]}
                      onChange={e => setFormData({...formData, magnetiteJustification: {...formData.magnetiteJustification!, [item.id]: e.target.value}})}
                    />
                  </div>
                ))}
              </div>
              <button 
                onClick={handleSaveAndCopy}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98] ${copyStatus ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
              >
                {copyStatus ? <><i className="fas fa-check"></i> SALVO!</> : <><i className="fab fa-whatsapp"></i> GERAR RELATÓRIO</>}
              </button>
            </section>
          </div>
        )}

        {view === 'history' && (
          <div className="space-y-3">
            {reports.length === 0 ? (
              <div className="text-center py-20 text-slate-300 font-black uppercase text-xs tracking-widest">Vazio</div>
            ) : (
              reports.map(r => (
                <div key={r.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase">Turma {r.turma} • {r.data}</span>
                    <p className="text-sm font-bold text-slate-800">{r.operador}</p>
                  </div>
                  <button onClick={() => navigator.clipboard.writeText(formatReportForWhatsApp(r))} className="p-3 bg-slate-50 text-slate-900 rounded-xl hover:bg-slate-100">
                    <i className="fab fa-whatsapp"></i>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
