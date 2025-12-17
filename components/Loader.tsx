
import React from 'react';
import { Icons } from './Icons';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="text-center py-20 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Icons.Spinner className="h-12 w-12 animate-spin text-teal-500" />
        <p className="text-lg font-medium text-slate-700">{message}</p>
        <p className="text-sm text-slate-500">AI is analyzing the data and compiling the report...</p>
      </div>
    </div>
  );
};
