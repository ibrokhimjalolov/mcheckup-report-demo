
import React, { useState, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { ReportDisplay } from './components/ReportDisplay';
import { Loader } from './components/Loader';
import { Header } from './components/Header';
import { useGemini } from './hooks/useGemini';
import type { MedicalReport } from './types';
import { OCR_TEXT } from './constants';

export default function App() {
  const [step, setStep] = useState<'input' | 'loading' | 'report'>('input');
  const [doctorLetter, setDoctorLetter] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [generatedReport, setGeneratedReport] = useState<MedicalReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { generateReport, isGenerating } = useGemini();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFileName(event.target.files[0].name);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!fileName) {
      setError('Please "upload" a medical document first.');
      return;
    }
    setError(null);
    setStep('loading');
    setGeneratedReport(null);

    const fullPrompt = `
INPUT DATA:
${OCR_TEXT}

---
ADDITIONAL NOTES FROM DOCTOR:
${doctorLetter}
---
`;

    try {
      const report = await generateReport(fullPrompt);
      setGeneratedReport(report);
      setStep('report');
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate report. ${errorMessage}`);
      setStep('input');
    }
  }, [doctorLetter, fileName, generateReport]);

  const handleReset = () => {
    setStep('input');
    setDoctorLetter('');
    setFileName(null);
    setGeneratedReport(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {step === 'input' && (
          <InputForm
            doctorLetter={doctorLetter}
            setDoctorLetter={setDoctorLetter}
            onGenerate={handleGenerate}
            isLoading={isGenerating}
            handleFileChange={handleFileChange}
            fileName={fileName}
          />
        )}

        {step === 'loading' && (
          <Loader message="Generating your comprehensive medical report. This may take a few moments..." />
        )}

        {step === 'report' && generatedReport && (
          <ReportDisplay report={generatedReport} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
