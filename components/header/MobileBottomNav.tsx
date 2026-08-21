"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import {
  Home,
  BookOpen,
  Flower2,
  Video,
  Menu,
} from "lucide-react";

interface MobileBottomNavProps {
  onToggleMenu: () => void;
  isMenuOpen: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onToggleMenu,
  isMenuOpen,
}) => {
  const pathname = usePathname();
  const { language } = useI18n();
  const isEn = language === "en";

  const navItems = [
    {
      label: isEn ? "Home" : "होम",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: isEn ? "Library" : "लाइब्रेरी",
      href: "/library",
      icon: BookOpen,
      isActive: pathname.startsWith("/library"),
    },
    {
      label: isEn ? "Meditation" : "ध्यान",
      href: "/meditation",
      icon: Flower2,
      isActive: pathname.startsWith("/meditation"),
    },
    {
      label: isEn ? "Media" : "मीडिया",
      href: "/media",
      icon: Video,
      isActive: pathname.startsWith("/media"),
    },
  ];

  return (
    <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d0a08]/95 backdrop-blur-2xl border-t border-gold-500/30 px-2 py-1.5 shadow-[0_-8px_25px_rgba(0,0,0,0.85)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                item.isActive
                  ? "text-gold-300 font-bold scale-105"
                  : "text-spiritual-ivory/65 hover:text-gold-300 font-medium"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  item.isActive
                    ? "bg-gold-500/20 text-gold-300 border border-gold-400/40 shadow-gold-sm"
                    : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Menu Drawer Toggle Button */}
        <button
          onClick={onToggleMenu}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
            isMenuOpen
              ? "text-gold-300 font-bold scale-105"
              : "text-spiritual-ivory/65 hover:text-gold-300 font-medium"
          }`}
          aria-label={isEn ? "All Categories" : "सभी श्रेणियां"}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              isMenuOpen
                ? "bg-gold-500 text-spiritual-dark font-bold shadow-gold-sm"
                : "bg-gold-500/10 border border-gold-400/30 text-gold-300"
            }`}
          >
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight leading-none">
            {isEn ? "Menu" : "मेन्यू"}
          </span>
        </button>
      </div>
    </nav>
  );
};
