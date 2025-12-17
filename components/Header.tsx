
import React from 'react';
import { Icons } from './Icons';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-3">
          <Icons.Stethoscope className="h-8 w-8 text-teal-500" />
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Medical Check-Up Report Generator
          </h1>
        </div>
      </div>
    </header>
  );
};
