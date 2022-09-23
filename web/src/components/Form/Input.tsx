import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps) {
  return (
    <input
      {...props}
      className="bg-zinc-900 sm:py-3 sm:px-4 py-2 px-3 rounded text-sm placeholder:text-zinc-500"
    />
  );
}
