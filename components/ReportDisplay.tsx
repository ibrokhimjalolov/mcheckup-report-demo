
import React from 'react';
import type { MedicalReport, Diagnosis, LaboratoryResult, InstrumentalExamination, SpecialistConsultation, Medication, Recommendation, DiagnosisSpecificRecommendation, Exercise, SleepHygiene, ExpectedImprovement } from '../types';

interface ReportDisplayProps {
  report: MedicalReport;
  onReset: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <section className={`py-6 border-b border-slate-200 ${className}`}>
    <h2 className="text-2xl font-serif font-semibold text-slate-800 mb-4">{title}</h2>
    <div className="space-y-4 text-slate-700">{children}</div>
  </section>
);

const InfoPair: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <p className="font-semibold text-slate-600">{label}</p>
    <p className="text-slate-800">{value || 'N/A'}</p>
  </div>
);

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, onReset }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10">
      <div className="text-center mb-8 border-b pb-6">
        <h1 className="text-4xl font-serif font-bold text-teal-700">Ваша медицинская консультация</h1>
        <p className="text-slate-500 mt-2">Medical Consultation Report</p>
      </div>

      <Section title="Титульное письмо (Cover Letter)">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InfoPair label="Имя пациента" value={report.cover_letter.patient_name} />
          <InfoPair label="Дата рождения" value={report.cover_letter.date_of_birth} />
          <InfoPair label="Пол" value={report.cover_letter.gender} />
          <InfoPair label="Консультирующий врач" value={report.cover_letter.consulting_doctor} />
          <InfoPair label="Дата отчета" value={report.cover_letter.report_date} />
        </div>
        <p className="mt-4 pt-4 border-t border-slate-200 text-justify">{report.cover_letter.letter_text}</p>
      </Section>

      <Section title="Диагнозы (Diagnoses)">
        <div className="p-4 bg-teal-50 rounded-lg">
          <h3 className="font-bold text-teal-800">Основной диагноз</h3>
          <p className="font-semibold text-lg">{report.diagnoses.main_diagnosis.name}</p>
          <p className="text-sm text-teal-700">{report.diagnoses.main_diagnosis.explanation}</p>
        </div>
        {report.diagnoses.comorbid_diagnoses.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold text-slate-800">Сопутствующие диагнозы</h3>
            <ul className="list-disc list-inside mt-2 space-y-2">
              {report.diagnoses.comorbid_diagnoses.map((diag: Diagnosis, index: number) => (
                <li key={index}>
                  <span className="font-semibold">{diag.name}:</span> <span className="text-sm">{diag.explanation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <Section title="Физикальное обследование (Physical Examination)">
        <InfoPair label="Жалобы" value={report.physical_examination.complaints} />
        <InfoPair label="Анамнез" value={report.physical_examination.medical_history} />
        <h3 className="font-bold text-slate-800 pt-4 mt-4 border-t">Объективное состояние</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(report.physical_examination.objective_status).map(([key, value]) => (
            <InfoPair key={key} label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} value={value as string} />
          ))}
        </div>
      </Section>

      <Section title="Результаты лабораторных исследований (Laboratory Results)">
        {report.laboratory_results.map((res: LaboratoryResult, index: number) => (
          <div key={index} className="p-4 border border-slate-200 rounded-lg">
            <h3 className="font-bold text-lg text-slate-800">{res.test_group}</h3>
            <p className="text-sm italic text-slate-500 mb-2">{res.purpose}</p>
            <InfoPair label="Резюме результатов" value={res.results_summary} />
            <InfoPair label="Интерпретация" value={res.interpretation} />
          </div>
        ))}
      </Section>
      
      <Section title="Инструментальные исследования (Instrumental Examinations)">
        {report.instrumental_examinations.map((exam: InstrumentalExamination, index: number) => (
          <div key={index} className="p-4 border border-slate-200 rounded-lg">
            <h3 className="font-bold text-lg text-slate-800">{exam.exam_name}</h3>
            <InfoPair label="Заключение" value={exam.conclusion} />
            <InfoPair label="Объяснение" value={exam.explanation} />
          </div>
        ))}
      </Section>

      <Section title="Консультации специалистов (Specialist Consultations)">
        {report.specialist_consultations.map((consult: SpecialistConsultation, index: number) => (
          <div key={index} className="p-4 border border-slate-200 rounded-lg">
            <h3 className="font-bold text-lg text-slate-800">{consult.specialist}</h3>
            <InfoPair label="Диагноз" value={consult.diagnosis} />
            <InfoPair label="Комментарии" value={consult.comments} />
          </div>
        ))}
      </Section>

      <Section title="План лечения (Treatment Plan)">
        <InfoPair label="Инструкции по образу жизни" value={report.treatment_plan.lifestyle_instructions} />
        <h3 className="font-bold text-slate-800 pt-4 mt-4 border-t">Медикаменты</h3>
        {report.treatment_plan.medications.map((med: Medication, index: number) => (
          <div key={index} className="p-3 bg-slate-50 rounded-md">
            <p className="font-semibold">{med.name} ({med.duration})</p>
            <p className="text-sm"><span className="font-medium">Назначение:</span> {med.purpose}</p>
            <p className="text-sm"><span className="font-medium">Инструкция:</span> {med.instructions}</p>
          </div>
        ))}
      </Section>

      <Section title="Рекомендации по питанию (Nutrition Recommendations)">
        <h3 className="font-bold text-slate-800">Общие</h3>
        <ul className="list-disc list-inside space-y-1">
          {report.nutrition_recommendations.general.map((rec: Recommendation, i: number) => <li key={i}>{rec.recommendation}</li>)}
        </ul>
        <h3 className="font-bold text-slate-800 pt-4 mt-4 border-t">Специфичные для диагноза</h3>
        {report.nutrition_recommendations.diagnosis_specific.map((rec: DiagnosisSpecificRecommendation, i: number) => (
          <div key={i} className="p-3 bg-slate-50 rounded-md">
            <p className="font-semibold">{rec.diagnosis}</p>
            <p className="text-sm">{rec.recommendation}</p>
          </div>
        ))}
      </Section>

      <Section title="Физическая активность (Physical Activity)">
        <InfoPair label="Общая активность" value={report.physical_activity.general_activity} />
        <h3 className="font-bold text-slate-800 pt-4 mt-4 border-t">Упражнения</h3>
        {report.physical_activity.exercises.map((ex: Exercise, i: number) => (
          <div key={i} className="p-3 bg-slate-50 rounded-md">
            <p className="font-semibold">{ex.name}</p>
            <p className="text-sm"><span className="font-medium">Польза:</span> {ex.benefits}</p>
            <p className="text-sm"><span className="font-medium">Частота:</span> {ex.frequency} ({ex.duration})</p>
            <p className="text-sm"><span className="font-medium">Меры предосторожности:</span> {ex.precautions}</p>
          </div>
        ))}
      </Section>

      <Section title="Гигиена сна (Sleep Hygiene)">
        <ul className="list-disc list-inside space-y-2">
          {report.sleep_hygiene.map((rec: SleepHygiene, i: number) => (
            <li key={i}><span className="font-semibold">{rec.recommendation}:</span> {rec.explanation}</li>
          ))}
        </ul>
      </Section>

      <Section title="Ожидаемые улучшения (Expected Improvements)">
        {report.expected_improvements.map((imp: ExpectedImprovement, i: number) => (
          <div key={i} className="p-3 bg-slate-50 rounded-md">
            <p className="font-semibold">{imp.condition}</p>
            <p className="text-sm">{imp.expected_effect}</p>
          </div>
        ))}
      </Section>

      <Section title="План последующего наблюдения (Follow-up Plan)">
        <InfoPair label="Визиты к специалистам" value={report.follow_up_plan.specialist_visits} />
        <InfoPair label="Дополнительные анализы" value={report.follow_up_plan.additional_tests} />
        <InfoPair label="Сроки" value={report.follow_up_plan.timing} />
      </Section>

      <Section title="Заключение (Final Conclusion)" className="border-b-0">
        <p className="font-semibold">{report.final_conclusion.summary}</p>
        <p className="mt-4 italic">{report.final_conclusion.closing_message}</p>
      </Section>

      <div className="mt-10 pt-6 border-t border-slate-200 flex justify-center">
        <button
          onClick={onReset}
          className="inline-flex items-center rounded-md border border-teal-600 bg-white py-2 px-6 text-base font-medium text-teal-700 shadow-sm hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
        >
          Create Another Report
        </button>
      </div>
    </div>
  );
};
