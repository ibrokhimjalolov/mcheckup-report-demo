
export interface MedicalReport {
  cover_letter: CoverLetter;
  diagnoses: Diagnoses;
  physical_examination: PhysicalExamination;
  laboratory_results: LaboratoryResult[];
  instrumental_examinations: InstrumentalExamination[];
  specialist_consultations: SpecialistConsultation[];
  treatment_plan: TreatmentPlan;
  nutrition_recommendations: NutritionRecommendations;
  physical_activity: PhysicalActivity;
  sleep_hygiene: SleepHygiene[];
  expected_improvements: ExpectedImprovement[];
  follow_up_plan: FollowUpPlan;
  final_conclusion: FinalConclusion;
}

export interface CoverLetter {
  patient_name: string;
  date_of_birth: string;
  gender: string;
  consulting_doctor: string;
  report_date: string;
  letter_text: string;
}

export interface Diagnosis {
  name: string;
  explanation: string;
}

export interface Diagnoses {
  main_diagnosis: Diagnosis;
  comorbid_diagnoses: Diagnosis[];
}

export interface ObjectiveStatus {
  height: string;
  weight: string;
  bmi: string;
  blood_pressure: string;
  pulse: string;
  spo2: string;
  cardiovascular: string;
  respiratory: string;
  abdomen: string;
}

export interface PhysicalExamination {
  complaints: string;
  medical_history: string;
  objective_status: ObjectiveStatus;
}

export interface LaboratoryResult {
  test_group: string;
  purpose: string;
  results_summary: string;
  interpretation: string;
}

export interface InstrumentalExamination {
  exam_name: string;
  conclusion: string;
  explanation: string;
}

export interface SpecialistConsultation {
  specialist: string;
  diagnosis: string;
  comments: string;
}

export interface Medication {
  name: string;
  purpose: string;
  instructions: string;
  duration: string;
}

export interface TreatmentPlan {
  lifestyle_instructions: string;
  medications: Medication[];
}

export interface Recommendation {
  recommendation: string;
  reason: string;
  frequency: string;
}

export interface DiagnosisSpecificRecommendation extends Recommendation {
  diagnosis: string;
}

export interface NutritionRecommendations {
  general: Recommendation[];
  diagnosis_specific: DiagnosisSpecificRecommendation[];
}

export interface Exercise {
  name: string;
  benefits: string;
  frequency: string;
  duration: string;
  precautions: string;
}

export interface PhysicalActivity {
  general_activity: string;
  exercises: Exercise[];
}

export interface SleepHygiene {
  recommendation: string;
  explanation: string;
}

export interface ExpectedImprovement {
  condition: string;
  expected_effect: string;
}

export interface FollowUpPlan {
  specialist_visits: string;
  additional_tests: string;
  timing: string;
}

export interface FinalConclusion {
  summary: string;
  closing_message: string;
}
