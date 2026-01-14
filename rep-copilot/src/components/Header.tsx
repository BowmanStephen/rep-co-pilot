'use client';

import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <TooltipProvider>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="bg-gradient-to-r from-primary to-primary/95 text-primary-foreground px-6 py-3.5 flex items-center justify-between shadow-[0_2px_8px_rgba(131,0,81,0.15),0_1px_3px_rgba(131,0,81,0.1)] relative overflow-hidden"
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Logo + Title */}
        <div className="flex items-center gap-3 relative z-10">
          <motion.div
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-9 h-9 bg-white/95 rounded-md flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
          >
            <span className="text-primary font-bold text-sm tracking-tight">
              AZ
            </span>
          </motion.div>
          <h1 className="text-xl font-semibold tracking-tight">Rep Co-Pilot</h1>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 relative z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 transition-colors"
                >
                  <Bell className="h-5 w-5" />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>

          <div className="flex items-center gap-2.5 ml-3 pl-3 border-l border-white/20">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Avatar className="h-8 w-8 ring-2 ring-white/20 shadow-sm">
                <AvatarFallback className="bg-white/20 text-primary-foreground text-sm font-medium">
                  S
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <span className="text-sm font-medium">Sarah</span>
          </div>
        </div>
      </motion.header>
    </TooltipProvider>
  );
}
