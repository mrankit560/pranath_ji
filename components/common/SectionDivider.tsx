import React from "react";

interface SectionDividerProps {
  symbol?: string;
  className?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  symbol = "✦",
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center gap-4 py-8 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-500/35 to-transparent" />
      <span className="text-gold-400 text-sm sm:text-base drop-shadow-gold-sm">
        {symbol}
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-500/35 to-transparent" />
    </div>
  );
};
