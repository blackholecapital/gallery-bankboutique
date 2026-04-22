import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
  }
>;

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-blue-600 text-white shadow-[0_2px_4px_rgba(37,99,235,0.45),0_6px_20px_-3px_rgba(37,99,235,0.35)] hover:bg-blue-700 hover:shadow-[0_2px_6px_rgba(37,99,235,0.55),0_8px_24px_-3px_rgba(37,99,235,0.4)] hover:scale-[1.03] active:bg-blue-800 active:shadow-[0_1px_2px_rgba(37,99,235,0.3)] active:scale-[0.96]',
  secondary: 'border-blue-100/70 bg-blue-50/60 text-blue-600/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:bg-blue-50/90 hover:border-blue-200/80 hover:shadow-[0_2px_6px_rgba(37,99,235,0.10)] hover:scale-[1.03] active:bg-blue-100 active:scale-[0.96]',
  ghost: 'border-transparent bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/80 hover:shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:scale-[1.03] active:bg-slate-100 active:scale-[0.96]',
};

export function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center rounded-xl border px-4 py-2 text-[13px] font-bold transition-all duration-150 disabled:cursor-default disabled:opacity-40 disabled:shadow-none disabled:scale-100 ${variantStyles[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
