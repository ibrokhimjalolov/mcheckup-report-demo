
import React from 'react';
import { Icons } from './Icons';

interface InputFormProps {
  doctorLetter: string;
  setDoctorLetter: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileName: string | null;
}

export const InputForm: React.FC<InputFormProps> = ({
  doctorLetter,
  setDoctorLetter,
  onGenerate,
  isLoading,
  handleFileChange,
  fileName,
}) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">1. Upload Medical Document</h2>
        <p className="text-slate-500 mt-1">
          Upload the patient's check-up results (PDF). For this demo, any file will work.
        </p>
        <div className="mt-4">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
          >
            <div className="flex items-center justify-center w-full h-32 px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Icons.Upload className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex text-sm text-slate-600">
                  <span className="text-teal-600">Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                </div>
                <p className="text-xs text-slate-500">PDF up to 10MB</p>
              </div>
            </div>
          </label>
          {fileName && (
            <div className="mt-3 flex items-center text-sm bg-slate-100 p-2 rounded-md">
              <Icons.Document className="h-5 w-5 text-slate-500 mr-2" />
              <span className="font-medium text-slate-700">{fileName}</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900">2. Add Doctor's Notes</h2>
        <p className="text-slate-500 mt-1">
          Include any additional notes, context, or specific instructions for the report.
        </p>
        <div className="mt-4">
          <textarea
            rows={6}
            className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-slate-300 rounded-md transition"
            placeholder="e.g., Patient is concerned about persistent headaches. Please focus on neurological findings and lifestyle recommendations."
            value={doctorLetter}
            onChange={(e) => setDoctorLetter(e.target.value)}
          />
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onGenerate}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex justify-center items-center rounded-md border border-transparent bg-teal-600 py-3 px-8 text-base font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Icons.Spinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Generating...
              </>
            ) : (
              'Generate Report'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
