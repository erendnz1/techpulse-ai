"use client";

import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({
  onMenuClick,
}: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-xl dark:border-gray-700 dark:bg-gray-900/80 lg:hidden">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Menu size={24} />
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-base font-bold">
          TechPulse <span className="text-blue-600">AI</span>
        </h1>

        <span className="text-[10px] text-gray-500 dark:text-gray-400">
          Technology Intelligence
        </span>
      </div>

      <ThemeToggle />
    </header>
  );
}