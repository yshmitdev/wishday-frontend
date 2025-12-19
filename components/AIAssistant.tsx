'use client';

import { useRef, useEffect, useState, useMemo, memo } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useAuth, SignedIn } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bot, MessageSquare, Send, X, Sparkles, RotateCcw } from 'lucide-react';
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
    code: ({ children }: { children?: React.ReactNode }) => <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-xs">{children}</code>,
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

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const text = inputValue.trim();
        setInputValue('');
        await sendMessage({ text });
        inputRef.current?.focus();
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
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'fixed bottom-6 right-6 z-50',
                    'w-14 h-14 rounded-full',
                    'bg-gradient-to-br from-violet-500 to-fuchsia-500',
                    'shadow-lg shadow-violet-500/30',
                    'flex items-center justify-center',
                    'transition-all duration-300 ease-out',
                    'hover:scale-110 hover:shadow-xl hover:shadow-violet-500/40',
                    'active:scale-95',
                    isOpen && 'rotate-90'
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
                    'fixed bottom-24 right-6 z-50',
                    'w-[380px] h-[520px]',
                    'bg-card/95 backdrop-blur-xl',
                    'rounded-2xl border border-border/50',
                    'shadow-2xl shadow-black/20',
                    'flex flex-col overflow-hidden',
                    'transition-all duration-300 ease-out origin-bottom-right',
                    isOpen
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                )}
            >
                {/* Header */}
                <div className="relative px-5 py-4 border-b border-border/50 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                            <h3 className="font-semibold text-foreground">Wishday Assistant</h3>
                            {isStreaming ? (
                                <p className="text-xs text-violet-500 flex items-center gap-1.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                                    </span>
                                    Writing...
                                </p>
                            ) : (
                                <p className="text-xs text-muted-foreground">Ask me anything about birthdays</p>
                            )}
                            </div>
                        </div>
                        {messages.length > 0 && (
                            <button
                                onClick={handleClearChat}
                                disabled={isLoading}
                                className={cn(
                                    'p-2 rounded-lg',
                                    'text-muted-foreground hover:text-foreground',
                                    'hover:bg-black/5 dark:hover:bg-white/5',
                                    'transition-all duration-200',
                                    'disabled:opacity-50 disabled:cursor-not-allowed'
                                )}
                                title="Clear conversation"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center px-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mb-4">
                                <MessageSquare className="w-8 h-8 text-violet-500" strokeWidth={1.5} />
                            </div>
                            <h4 className="font-medium text-foreground mb-1">Start a conversation</h4>
                            <p className="text-sm text-muted-foreground">
                                I can help you find birthdays, suggest gift ideas, or remind you about upcoming celebrations!
                            </p>
                        </div>
                    )}

                    {messages.filter(hasContent).map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                'flex',
                                message.role === 'user' ? 'justify-end' : 'justify-start'
                            )}
                        >
                            <div
                                className={cn(
                                    'max-w-[80%] px-4 py-2.5 rounded-2xl text-sm',
                                    message.role === 'user'
                                        ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white rounded-br-md'
                                        : 'bg-muted text-foreground rounded-bl-md'
                                )}
                            >
                                {message.role === 'user' ? (
                                    getMessageContent(message)
                                ) : (
                                    <MemoizedMarkdown content={getMessageContent(message)} />
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && messages.filter(hasContent).at(-1)?.role === 'user' && (
                        <div className="flex justify-start">
                            <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
                                <div className="flex gap-1.5">
                                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="flex justify-start">
                            <div className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm bg-red-500/10 text-red-500 rounded-bl-md">
                                Sorry, I encountered an error. Please try again.
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-border/50 bg-card/50">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type a message..."
                            disabled={isLoading}
                            className={cn(
                                'flex-1 px-4 py-2.5 rounded-xl',
                                'bg-muted/50 border border-border/50',
                                'text-sm text-foreground placeholder:text-muted-foreground',
                                'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50',
                                'disabled:opacity-50 disabled:cursor-not-allowed',
                                'transition-all duration-200'
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={!inputValue.trim() || isLoading}
                            size="icon"
                            className="bg-gradient-to-br from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 rounded-xl shadow-lg shadow-violet-500/20"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </form>
            </div>
        </SignedIn>
    );
}
