'use client';

import { useRef, useEffect, useState, useMemo, memo, useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useAuth, SignedIn } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bot, MessageSquare, Send, X, Sparkles, RotateCcw, ChevronDown, Minimize2 } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Memoized markdown config - defined outside component to be truly static
const remarkPlugins = [remarkGfm];
const markdownComponents = {
    p: ({ children }: { children?: React.ReactNode }) => <p className="mb-2 last:mb-0">{children}</p>,
    ul: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc pl-4 mb-2 last:mb-0 space-y-1">{children}</ul>,
    ol: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal pl-4 mb-2 last:mb-0 space-y-1">{children}</ol>,
    li: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
    strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: { children?: React.ReactNode }) => <em className="italic">{children}</em>,
    code: ({ children }: { children?: React.ReactNode }) => <code className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>,
    h1: ({ children }: { children?: React.ReactNode }) => <h1 className="font-bold text-base mb-2">{children}</h1>,
    h2: ({ children }: { children?: React.ReactNode }) => <h2 className="font-bold text-sm mb-2">{children}</h2>,
    h3: ({ children }: { children?: React.ReactNode }) => <h3 className="font-semibold text-sm mb-1">{children}</h3>,
    table: ({ children }: { children?: React.ReactNode }) => (
        <div className="overflow-x-auto mb-2 last:mb-0 -mx-1">
            <table className="min-w-full border-collapse text-xs">{children}</table>
        </div>
    ),
    thead: ({ children }: { children?: React.ReactNode }) => <thead className="bg-black/5 dark:bg-white/5">{children}</thead>,
    tbody: ({ children }: { children?: React.ReactNode }) => <tbody>{children}</tbody>,
    tr: ({ children }: { children?: React.ReactNode }) => <tr className="border-b border-black/10 dark:border-white/10">{children}</tr>,
    th: ({ children }: { children?: React.ReactNode }) => <th className="px-2 py-1.5 text-left font-semibold">{children}</th>,
    td: ({ children }: { children?: React.ReactNode }) => <td className="px-2 py-1.5">{children}</td>,
};

// Memoized markdown renderer - only re-renders when content changes
const MemoizedMarkdown = memo(function MemoizedMarkdown({ content }: { content: string }) {
    return (
        <Markdown remarkPlugins={remarkPlugins} components={markdownComponents}>
            {content}
        </Markdown>
    );
});

// Quick suggestion chips for empty state
const suggestions = [
    "Who has a birthday this week?",
    "Upcoming birthdays this month",
    "Gift ideas for my friend",
];

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [showScrollButton, setShowScrollButton] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const { getToken } = useAuth();

    const transport = useMemo(() => new DefaultChatTransport({
        api: `${process.env.NEXT_PUBLIC_API_URL}/api/assistant/chat`,
        headers: async () => {
            const token = await getToken();
            return {
                Authorization: `Bearer ${token}`,
            };
        },
    }), [getToken]);

    const { messages, sendMessage, setMessages, status, error } = useChat({ transport });

    const handleClearChat = () => {
        setMessages([]);
    };

    const isLoading = status === 'submitted' || status === 'streaming';
    const isStreaming = status === 'streaming';

    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    }, []);

    // Handle scroll events to show/hide scroll button
    const handleScroll = useCallback(() => {
        if (!messagesContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollButton(!isNearBottom);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            // Delay focus to allow animation to complete
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // Lock body scroll when chat is open on mobile
    useEffect(() => {
        if (isOpen && window.innerWidth < 640) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = '';
            };
        }
    }, [isOpen]);

    // Auto-resize textarea
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        // Auto-resize
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const text = inputValue.trim();
        setInputValue('');
        // Reset textarea height
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
        }
        await sendMessage({ text });
        inputRef.current?.focus();
    };

    // Handle keyboard shortcuts
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    // Quick suggestion handler
    const handleSuggestionClick = async (suggestion: string) => {
        if (isLoading) return;
        await sendMessage({ text: suggestion });
    };

    // Helper to extract displayable text content from message parts
    const getMessageContent = (message: typeof messages[number]) => {
        return message.parts
            .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
            .map(part => part.text)
            .filter(text => text.trim())
            .join('');
    };

    // Check if message has displayable text content (ignore tool outputs)
    const hasContent = (message: typeof messages[number]) => {
        return message.parts.some(
            part => part.type === 'text' && (part as { text: string }).text.trim().length > 0
        );
    };


    return (
        <SignedIn>
            {/* Backdrop for mobile */}
            <div
                className={cn(
                    'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm sm:hidden',
                    'transition-opacity duration-300',
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                onClick={() => setIsOpen(false)}
            />

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
                className={cn(
                    'fixed z-50',
                    // Mobile: bottom safe area + padding
                    'bottom-4 right-4 sm:bottom-6 sm:right-6',
                    // Size - slightly larger touch target on mobile
                    'w-14 h-14 sm:w-14 sm:h-14',
                    'rounded-full',
                    'bg-gradient-to-br from-violet-500 to-fuchsia-500',
                    'shadow-lg shadow-violet-500/30',
                    'flex items-center justify-center',
                    'transition-all duration-300 ease-out',
                    'hover:scale-110 hover:shadow-xl hover:shadow-violet-500/40',
                    'active:scale-95',
                    // Hide on mobile when chat is open (use header X instead)
                    isOpen && 'sm:rotate-90 max-sm:opacity-0 max-sm:pointer-events-none'
                )}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <Sparkles className="w-6 h-6 text-white" />
                )}
            </button>

            {/* Chat Panel */}
            <div
                className={cn(
                    'fixed z-50',
                    // Mobile: full screen with safe areas
                    'inset-0 sm:inset-auto',
                    // Desktop positioning
                    'sm:bottom-24 sm:right-6',
                    // Desktop sizing
                    'sm:w-[400px] sm:h-[560px] md:w-[420px] md:h-[600px]',
                    // Styling
                    'bg-card sm:bg-card/95 backdrop-blur-xl',
                    'sm:rounded-2xl sm:border sm:border-border/50',
                    'sm:shadow-2xl sm:shadow-black/20',
                    'flex flex-col overflow-hidden',
                    // Animations
                    'transition-all duration-300 ease-out',
                    'sm:origin-bottom-right',
                    isOpen
                        ? 'opacity-100 sm:scale-100 sm:translate-y-0 translate-y-0'
                        : 'opacity-0 sm:scale-95 sm:translate-y-4 translate-y-full pointer-events-none'
                )}
            >
                {/* Header */}
                <div className="relative shrink-0 px-4 sm:px-5 py-3 sm:py-4 border-b border-border/50 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="shrink-0 w-10 h-10 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-foreground truncate">Wishday Assistant</h3>
                                {isStreaming ? (
                                    <p className="text-xs text-violet-500 flex items-center gap-1.5">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                                        </span>
                                        Thinking...
                                    </p>
                                ) : (
                                    <p className="text-xs text-muted-foreground truncate">Ask me anything about birthdays</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {messages.length > 0 && (
                                <button
                                    onClick={handleClearChat}
                                    disabled={isLoading}
                                    className={cn(
                                        'p-2.5 rounded-lg',
                                        'text-muted-foreground hover:text-foreground',
                                        'hover:bg-black/5 dark:hover:bg-white/5',
                                        'transition-all duration-200',
                                        'disabled:opacity-50 disabled:cursor-not-allowed',
                                        'active:scale-95'
                                    )}
                                    title="Clear conversation"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            )}
                            {/* Mobile close button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    'sm:hidden p-2.5 rounded-lg',
                                    'text-muted-foreground hover:text-foreground',
                                    'hover:bg-black/5 dark:hover:bg-white/5',
                                    'transition-all duration-200',
                                    'active:scale-95'
                                )}
                                title="Minimize"
                            >
                                <Minimize2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                </div>

                {/* Messages */}
                <div
                    ref={messagesContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 scroll-smooth overscroll-contain"
                >
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4 sm:px-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mb-4 shadow-inner">
                                <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-violet-500" strokeWidth={1.5} />
                            </div>
                            <h4 className="font-medium text-foreground mb-1 text-base sm:text-lg">Start a conversation</h4>
                            <p className="text-sm text-muted-foreground mb-6 max-w-[280px]">
                                I can help you find birthdays, suggest gift ideas, or remind you about upcoming celebrations!
                            </p>

                            {/* Quick suggestions */}
                            <div className="w-full space-y-2">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Try asking</p>
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        disabled={isLoading}
                                        className={cn(
                                            'w-full text-left px-4 py-3 rounded-xl',
                                            'bg-muted/50 hover:bg-muted',
                                            'border border-border/50 hover:border-violet-500/30',
                                            'text-sm text-foreground',
                                            'transition-all duration-200',
                                            'hover:shadow-md hover:shadow-violet-500/5',
                                            'active:scale-[0.98]',
                                            'disabled:opacity-50 disabled:cursor-not-allowed'
                                        )}
                                    >
                                        <span className="text-violet-500 mr-2">→</span>
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.filter(hasContent).map((message, index) => (
                        <div
                            key={message.id}
                            className={cn(
                                'flex animate-in fade-in-0 slide-in-from-bottom-2 duration-300',
                                message.role === 'user' ? 'justify-end' : 'justify-start'
                            )}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div
                                className={cn(
                                    'max-w-[85%] sm:max-w-[80%] px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-sm leading-relaxed',
                                    message.role === 'user'
                                        ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white rounded-br-md shadow-lg shadow-violet-500/20'
                                        : 'bg-muted text-foreground rounded-bl-md'
                                )}
                            >
                                {message.role === 'user' ? (
                                    <span className="whitespace-pre-wrap">{getMessageContent(message)}</span>
                                ) : (
                                    <MemoizedMarkdown content={getMessageContent(message)} />
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && messages.filter(hasContent).at(-1)?.role === 'user' && (
                        <div className="flex justify-start animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                            <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
                                <div className="flex gap-1.5">
                                    <span className="w-2 h-2 bg-violet-500/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-violet-500/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-violet-500/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="flex justify-start animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                            <div className="max-w-[85%] sm:max-w-[80%] px-4 py-3 rounded-2xl text-sm bg-red-500/10 text-red-500 rounded-bl-md border border-red-500/20">
                                <p className="font-medium mb-1">Oops! Something went wrong</p>
                                <p className="text-xs opacity-80">Please try again or rephrase your question.</p>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Scroll to bottom button */}
                {showScrollButton && messages.length > 0 && (
                    <button
                        onClick={() => scrollToBottom()}
                        className={cn(
                            'absolute bottom-24 sm:bottom-20 left-1/2 -translate-x-1/2',
                            'w-8 h-8 rounded-full',
                            'bg-card border border-border shadow-lg',
                            'flex items-center justify-center',
                            'text-muted-foreground hover:text-foreground',
                            'transition-all duration-200',
                            'hover:scale-110 active:scale-95',
                            'animate-in fade-in-0 zoom-in-95 duration-200'
                        )}
                    >
                        <ChevronDown className="w-4 h-4" />
                    </button>
                )}

                {/* Input */}
                <form onSubmit={handleSubmit} className="shrink-0 p-3 sm:p-4 border-t border-border/50 bg-card/80 backdrop-blur-sm">
                    <div className="flex gap-2 items-end">
                        <textarea
                            ref={inputRef}
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            disabled={isLoading}
                            rows={1}
                            className={cn(
                                'flex-1',
                                'w-full px-4 py-3 rounded-xl resize-none',
                                'bg-muted/50 border border-border/50',
                                'text-sm text-foreground placeholder:text-muted-foreground',
                                'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50',
                                'disabled:opacity-50 disabled:cursor-not-allowed',
                                'transition-all duration-200',
                                'max-h-[120px] min-h-[44px] overflow-y-auto',
                                '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={!inputValue.trim() || isLoading}
                            size="icon"
                            className={cn(
                                'shrink-0 w-11 h-11 sm:w-10 sm:h-10',
                                'bg-gradient-to-br from-violet-500 to-fuchsia-500',
                                'hover:from-violet-600 hover:to-fuchsia-600',
                                'rounded-xl shadow-lg shadow-violet-500/20',
                                'transition-all duration-200',
                                'disabled:opacity-50 disabled:shadow-none',
                                'active:scale-95'
                            )}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </form>
            </div>
        </SignedIn>
    );
}
