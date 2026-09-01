import type { JSX } from "react";
import { Zap, Coins, Star } from "lucide-react";

const TopBar = (): JSX.Element => {
  return (
    <header className="h-full flex items-center justify-between px-6 border-b border-white/10">
      <h1></h1>
      {/* <h1 className="text-lg font-semibold tracking-wide text-accent">
        NEON ODYSSEY
      </h1> */}

      <div className="flex items-center gap-8">
        {/* LVL Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow/10 shadow-[0_0_10px_rgba(255,228,131,0.4)]">
          <Star size={14} className="text-yellow" />
          {/* <span className="text-sm font-semibold text-yellow">LVL 1</span> */}
        </div>

        {/* Lightning */}
        <div className="flex items-center gap-1 text-gray-400">
          <Zap size={16} />
          {/* <span className="text-sm">0</span> */}
        </div>

        {/* Coins */}
        <div className="flex items-center gap-1 text-yellow">
          <Coins size={16} />
          {/* <span className="text-sm font-medium">30,000</span> */}
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gray-600 overflow-hidden">
          {/*  */}
        </div>
      </div>
    </header>
  );
};

export default TopBar;