'use client';

import { BarChart3, Users, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type TabType = 'reporting' | 'crm' | 'compliance';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'reporting', label: 'Reporting', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'crm', label: 'CRM', icon: <Users className="h-4 w-4" /> },
  { id: 'compliance', label: 'Compliance', icon: <Shield className="h-4 w-4" /> },
];

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex justify-center pt-6 pb-4 px-4">
      <div className="inline-flex bg-secondary/60 backdrop-blur-sm rounded-xl p-1.5 gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)] border border-border/40">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium',
                'transition-all duration-300 ease-out',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(131,0,81,0.2),0_1px_3px_rgba(131,0,81,0.15)]'
                  : 'text-foreground/70 hover:text-foreground hover:bg-white/50'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {tab.icon}
              {tab.label}

              {/* Active indicator with smooth animation */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gold rounded-full shadow-[0_0_8px_rgba(240,171,0,0.5)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
