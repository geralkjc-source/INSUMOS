
import { GoogleGenAI } from "@google/genai";
import { Report } from "../types";

export const analyzeReportJustification = async (report: Report) => {
  try {
    // Inicialização correta dentro da função para garantir que pega a API_KEY atualizada
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const j = report.magnetiteJustification;
    const prompt = `Analise o seguinte relatório de consumo industrial e forneça um breve insight sobre as justificativas de consumo por unidade e os dados reais.
    Relatório:
    - Turma: ${report.turma}
    - Operador: ${report.operador}
    - Consumo Planta C: C1(${report.plantaC.c1}), C2(${report.plantaC.c2}) Bags
    - Consumo Planta D: D1(${report.plantaD.c1}), D2(${report.plantaD.c2}) Bags
    - Justificativas Planta C: C1(${j.c1}), C2(${j.c2})
    - Justificativas Planta D: D1(${j.d1}), D2(${j.d2})
    
    Responda em Português de forma profissional e concisa, focando em anomalias ou eficiências.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Você é um analista de eficiência operacional industrial sênior especializado em mineração e processamento de minérios.",
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Não foi possível analisar os dados no momento.";
  }
};
