'use client';

import { Bell, Settings, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  getProfile,
  getProfileIds,
  getProfileLabel,
  type DemoProfile,
} from '@/lib/demo-profiles';

/**
 * Header with Profile Switcher
 *
 * Displays the app branding and allows switching between demo profiles
 * to showcase the adaptive interface functionality.
 */
export default function Header() {
  const [currentProfileId, setCurrentProfileId] = useState('sarah');
  const [profile, setProfile] = useState<DemoProfile>(getProfile('sarah'));

  // Update profile when selection changes
  const handleProfileChange = (value: string) => {
    const newProfile = getProfile(value);
    setCurrentProfileId(value);
    setProfile(newProfile);

    // Dispatch custom event for other components to listen
    window.dispatchEvent(
      new CustomEvent('profile-change', { detail: newProfile })
    );
  };

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
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Logo + Title */}
        <div className="flex items-center gap-3 relative z-10">
          <motion.div
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-9 h-9 bg-white/95 rounded-md flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
          >
            <span className="text-primary font-bold text-sm tracking-tight">
              AZ
            </span>
          </motion.div>
          <h1 className="text-xl font-semibold tracking-tight">
            Rep Co-Pilot
          </h1>
        </div>

        {/* Profile Switcher (Demo Mode) */}
        <div className="flex items-center gap-4 relative z-10">
          {/* Profile Selector Dropdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <span className="text-xs text-primary-foreground/70 font-medium">
              Demo Profile:
            </span>
            <Select value={currentProfileId} onValueChange={handleProfileChange}>
              <SelectTrigger className="w-64 bg-white/10 border-white/20 text-primary-foreground focus:bg-white/15 focus:ring-white/30">
                <SelectValue placeholder="Select profile" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/60">
                {getProfileIds().map((id) => {
                  const p = getProfile(id);
                  return (
                    <SelectItem
                      key={id}
                      value={id}
                      className="focus:bg-mulberry/10"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="bg-mulberry/20 text-foreground text-xs">
                            {p.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{p.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {p.region} · {p.timeContext}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Divider */}
          <div className="h-6 w-px bg-white/20" />

          {/* Right Actions */}
          <div className="flex items-center gap-1">
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

            {/* Current User Display */}
            <div className="flex items-center gap-2.5 ml-3 pl-3 border-l border-white/20">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Avatar className="h-8 w-8 ring-2 ring-white/20 shadow-sm">
                  <AvatarFallback className="bg-white/20 text-primary-foreground text-sm font-medium">
                    {profile.initials}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <span className="text-sm font-medium">{profile.name}</span>
            </div>
          </div>
        </div>
      </motion.header>
    </TooltipProvider>
  );
}
