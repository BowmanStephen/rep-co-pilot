'use client';

import { Mic, Camera, Sparkles, Shield, Send, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface SmartInputDockProps {
  onSubmit: (text: string) => void;
  coachingEnabled?: boolean;
  onCoachingChange?: (enabled: boolean) => void;
  onVoiceStart?: () => void;
  onCameraCapture?: () => void;
  disabled?: boolean;
}

export default function SmartInputDock({
  onSubmit,
  coachingEnabled,
  onCoachingChange,
  onVoiceStart,
  onCameraCapture,
}: SmartInputDockProps) {
  const [inputValue, setInputValue] = useState('');
  // Use controlled state if provided, otherwise fallback to local state
  const [localCoachingOn, setLocalCoachingOn] = useState(true);
  const coachingOn = coachingEnabled ?? localCoachingOn;
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  // Real speech recognition using Web Speech API
  const {
    isListening,
    isSupported: isSpeechSupported,
    transcript,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onResult: (text) => {
      setInputValue(text);
      setCharCount(text.length);
      setVoiceError(null);
      if (onVoiceStart) onVoiceStart();
    },
    onError: (error) => {
      setVoiceError(error);
      console.warn('Speech recognition error:', error);
    },
  });

  // Update input as user speaks (interim results)
  useEffect(() => {
    if (transcript && isListening) {
      setInputValue(transcript);
      setCharCount(transcript.length);
    }
  }, [transcript, isListening]);

  const handleCoachingToggle = () => {
    const newValue = !coachingOn;
    if (onCoachingChange) {
      onCoachingChange(newValue);
    } else {
      setLocalCoachingOn(newValue);
    }
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSubmit(inputValue);
      setInputValue('');
      setCharCount(0);
    }
  };

  const handleVoiceInput = () => {
    if (!isSpeechSupported) {
      setVoiceError('Speech recognition not supported in this browser');
      return;
    }
    
    setVoiceError(null);
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleCameraCapture = () => {
    setIsCapturing(true);
    // Simulate camera capture
    setTimeout(() => {
      setIsCapturing(false);
      const simulatedText = "I'm at [current location]. What's the best route to my next meeting?";
      setInputValue(simulatedText);
      setCharCount(simulatedText.length);
      if (onCameraCapture) onCameraCapture();
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setCharCount(value.length);
  };

  const handleEnhancePrompt = async () => {
    if (!inputValue.trim() || isEnhancing) return;

    setIsEnhancing(true);
    const originalPrompt = inputValue;

    try {
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: originalPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to enhance prompt');
      }

      // Read the streaming response (plain text stream)
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let enhancedText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          enhancedText += chunk;
          setInputValue(enhancedText);
        }
      }
    } catch (error) {
      console.error('Error enhancing prompt:', error);
      // On error, restore the original prompt
      setInputValue(originalPrompt);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-background/95 backdrop-blur-sm"
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 p-2 bg-card rounded-xl border border-border/60 shadow-[0_4px_20px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]">
            {/* Mic Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleVoiceInput}
                    disabled={isListening}
                    className={cn(
                      "h-10 w-10 rounded-lg transition-colors relative",
                      isListening
                        ? "bg-red-500 text-white animate-pulse"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {isListening ? (
                        <motion.div
                          key="listening"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="relative"
                        >
                          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                          <Mic className="h-5 w-5 relative" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="mic"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Mic className="h-5 w-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                {isListening ? 'Listening...' : 'Voice input'}
              </TooltipContent>
            </Tooltip>

            {/* Camera Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCameraCapture}
                    disabled={isCapturing}
                    className={cn(
                      "h-10 w-10 rounded-lg transition-colors relative",
                      isCapturing
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {isCapturing ? (
                        <motion.div
                          key="capturing"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Camera className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="camera"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Camera className="h-5 w-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {isCapturing && (
                      <motion.div
                        className="absolute inset-0 bg-white/20 rounded-lg"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                {isCapturing ? 'Capturing...' : 'Upload photo'}
              </TooltipContent>
            </Tooltip>

            {/* Divider */}
            <div className="w-px h-6 bg-border/60" />

            {/* Text Input */}
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                className={cn(
                  "flex-1 h-10 bg-secondary/50 border-0 rounded-lg pr-16",
                  "focus-visible:ring-2 focus-visible:ring-primary/50",
                  "placeholder:text-muted-foreground/70",
                  isEnhancing && "opacity-50 cursor-wait"
                )}
                disabled={isEnhancing}
              />
              {/* Character count indicator */}
              <AnimatePresence>
                {inputValue.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
                  >
                    {charCount}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-border/60" />

            {/* Magic Wand Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEnhancePrompt}
                    disabled={!inputValue.trim() || isEnhancing}
                    className="h-10 w-10 rounded-lg text-gold hover:bg-gold/10 transition-colors relative group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <AnimatePresence mode="wait">
                      {isEnhancing ? (
                        <motion.div
                          key="loading"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Loader2 className="h-5 w-5 animate-spin" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="sparkles"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        >
                          <Sparkles className="h-5 w-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gold/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                {isEnhancing ? 'Enhancing...' : 'Enhance prompt with AI'}
              </TooltipContent>
            </Tooltip>

            {/* Coaching Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCoachingToggle}
                  className={cn(
                    'flex items-center gap-1.5 h-10 px-3 rounded-lg text-xs font-semibold transition-all duration-200',
                    coachingOn
                      ? 'bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(131,0,81,0.15)] hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  <motion.div
                    animate={coachingOn ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.5, ease: "backOut" }}
                  >
                    <Shield className="h-4 w-4" />
                  </motion.div>
                  {coachingOn ? 'ON' : 'OFF'}
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                {coachingOn ? 'Compliance coaching enabled' : 'Compliance coaching disabled'}
              </TooltipContent>
            </Tooltip>

            {/* Send Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleSubmit}
                size="icon"
                className="h-10 w-10 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_2px_8px_rgba(131,0,81,0.2)] hover:shadow-[0_4px_12px_rgba(131,0,81,0.3)] transition-all"
              >
                <Send className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
