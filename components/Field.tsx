import { LucideIcon } from 'lucide-react';
import React from 'react'

type FieldProps = {
    label: string;
    icon: LucideIcon;
    children: React.ReactNode;
    error?: string;
}

const errorStyle = "mt-2 ml-2 text-xs text-red-600";
const errorInputStyle = "border-red-400 border-2 outline-red-500";
const inputStyle = "w-full p-3 border rounded-lg";

const Field = ({ label, icon: Icon, children, error }: FieldProps) => (
  <div className="space-y-3 w-full">
    <label className="text-sm mb-2 block font-medium text-foreground/90">{label}</label>
    <div
      className={`input-glass flex border border-[#3f3f3f] items-center gap-3 rounded-xl px-4 h-12 ${
        error ? "border-red-500/60" : ""
      }`}
    >
      <Icon className={` ${error ? "animate-bounce" : ""} w-5 h-5 text-muted-foreground shrink-0`} strokeWidth={1.75} />
      {children}
    </div>
    {error && <p className="pl-1 text-xs text-red-400/90">{error}</p>}
  </div>
);

export default Field;
