'use client';

import { ArrowLeft, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SmartInputDock from './SmartInputDock';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface StreamingResponseViewProps {
  onBack: () => void;
  initialPrompt?: string;
  tabType?: 'reporting' | 'crm' | 'compliance';
  coachingEnabled?: boolean;
  onCoachingChange?: (enabled: boolean) => void;
}

export default function StreamingResponseView({
  onBack,
  initialPrompt,
  tabType = 'reporting',
  coachingEnabled = true,
  onCoachingChange,
}: StreamingResponseViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);

  const tabConfig = {
    reporting: { label: 'REPORTING', icon: '📊', color: 'bg-primary' },
    crm: { label: 'CRM', icon: '👥', color: 'bg-primary' },
    compliance: { label: 'COMPLIANCE', icon: '🛡️', color: 'bg-primary' },
  };

  const currentTab = tabConfig[tabType];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const handleSubmit = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setStreamingContent('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: text,
          tabType,
          coachingMode: coachingEnabled,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          setStreamingContent(fullContent);
        }
      }

      // Add the complete assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullContent,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingContent('');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Sorry, I encountered an error processing your request. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [tabType, coachingEnabled]);

  // Process initial prompt on mount
  useEffect(() => {
    if (initialPrompt && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      handleSubmit(initialPrompt);
    }
  }, [initialPrompt, handleSubmit]);

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    // Handle bullet points and formatting
    const lines = content.split('\n');
    return lines.map((line, i) => {
      // Handle headers
      if (line.startsWith('### ')) {
        return (
          <h3 key={i} className="text-lg font-semibold mt-4 mb-2 text-foreground">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={i} className="text-xl font-bold mt-4 mb-2 text-foreground">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h1 key={i} className="text-2xl font-bold mt-4 mb-2 text-foreground">
            {line.replace('# ', '')}
          </h1>
        );
      }
      // Handle bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={i} className="ml-4 text-foreground">
            {formatInlineText(line.substring(2))}
          </li>
        );
      }
      // Handle numbered lists
      if (/^\d+\. /.test(line)) {
        return (
          <li key={i} className="ml-4 list-decimal text-foreground">
            {formatInlineText(line.replace(/^\d+\. /, ''))}
          </li>
        );
      }
      // Handle empty lines
      if (!line.trim()) {
        return <br key={i} />;
      }
      // Regular paragraph
      return (
        <p key={i} className="text-foreground mb-1">
          {formatInlineText(line)}
        </p>
      );
    });
  };

  // Handle inline formatting like **bold** and *italic*
  const formatInlineText = (text: string) => {
    // Handle bold
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Handle warning emoji
      if (part.includes('⚠️') || part.includes('🛑')) {
        return (
          <span key={i} className="text-gold font-medium">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Response Header */}
      <header className={`${currentTab.color} text-primary-foreground px-6 py-3 flex items-center justify-between sticky top-0 z-10`}>
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-primary-foreground hover:bg-dark-mulberry hover:text-primary-foreground gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Button>
        <h1 className="text-lg font-semibold tracking-wide flex items-center gap-2">
          {currentTab.icon} {currentTab.label}
        </h1>
        <div className="w-20" />
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-3xl mx-auto p-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`border-border/50 shadow-sm ${
                  message.role === 'user' 
                    ? 'bg-primary/5 border-primary/20' 
                    : 'bg-card'
                }`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-foreground'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 text-sm leading-relaxed">
                        {message.role === 'user' ? (
                          <p className="text-foreground">{message.content}</p>
                        ) : (
                          <div className="prose prose-sm max-w-none">
                            {renderContent(message.content)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Streaming response */}
            {isLoading && (
              <motion.div
                key="streaming"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-border/50 shadow-sm bg-card">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-secondary text-foreground">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-sm leading-relaxed">
                        {streamingContent ? (
                          <div className="prose prose-sm max-w-none">
                            {renderContent(streamingContent)}
                            <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Thinking...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Dock */}
      <SmartInputDock
        onSubmit={handleSubmit}
        coachingEnabled={coachingEnabled}
        onCoachingChange={onCoachingChange}
        disabled={isLoading}
      />
    </div>
  );
}
