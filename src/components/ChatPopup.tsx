import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiCpu, FiClock, FiDatabase, FiX, FiMessageSquare } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
    metrics?: {
        tokens: {
            prompt: number;
            completion: number;
            total: number;
        };
        responseTime: number;
    };
}

interface ChatPopupProps {
    isOpen: boolean;
    onClose: () => void;
    messages: Message[];
    currentMessage?: string;
    isLoading?: boolean;
    streamingContent?: string;
}

export default function ChatPopup({
    isOpen,
    onClose,
    messages,
    currentMessage,
    isLoading,
    streamingContent,
}: ChatPopupProps) {
    const { isDarkTheme } = useApp();
    const { t } = useLanguage();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showHistory, setShowHistory] = useState(false);

    const [lastUserMessage, setLastUserMessage] = useState<string>('');
    const [isOriginalMessageVisible, setIsOriginalMessageVisible] = useState(false);
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        let lastMessage: Message | null = null;
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === 'user') {
                lastMessage = messages[i];
                break;
            }
        }
        if (lastMessage) {
            setLastUserMessage(lastMessage.content);
        }
    }, [messages]);

    useEffect(() => {
        if (!lastMessageRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsOriginalMessageVisible(entry.isIntersecting);
            },
            { threshold: 0.5 }
        );

        observer.observe(lastMessageRef.current);

        return () => observer.disconnect();
    }, [messages.length]);

    useEffect(() => {
        if (isOpen && messages.length > 0) {
            const scrollTimeout = setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100); // Delay to allow animation completion
            return () => clearTimeout(scrollTimeout);
        }
    }, [messages, isOpen]);

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('default', {
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.3, opacity: 0, y: -386, x: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.3, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={`relative w-full h-[64vh] rounded-2xl shadow-2xl border border-violet-500/20 overflow-hidden pointer-events-auto flex flex-col ${isDarkTheme ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-purple-700 to-violet-700'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header - Now sticky */}
                        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-violet-500/20 backdrop-blur-sm bg-opacity-90 bg-inherit">
                            <div className="flex items-center space-x-2">
                                <FiMessageSquare className="w-5 h-5 text-violet-400" />
                                <h2 className="text-xl font-semibold text-white">{t('chat_with_ai')}</h2>
                            </div>
                            <div className="flex items-center space-x-3">
                                <motion.button
                                    onClick={() => setShowHistory(!showHistory)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-violet-600/20 hover:bg-violet-600/30 text-violet-200 rounded-lg transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiDatabase className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        {showHistory ? t('hide_history') : t('show_history')}
                                    </span>
                                </motion.button>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-violet-300 hover:text-white transition-colors"
                                    aria-label="Close"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Last User Message Header */}
                        {lastUserMessage && !isOriginalMessageVisible && (
                            <div className="sticky top-0 z-20 p-3 bg-violet-900/30 backdrop-blur-sm border-b border-violet-500/20">
                                <div className="flex items-start space-x-2"
                                    onMouseEnter={() => setIsHovering(true)}
                                    onMouseLeave={() => setIsHovering(false)}
                                >
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center mt-0.5">
                                        <FiUser className="w-3 h-3 text-white" />
                                    </div>
                                    <div className="group relative">
                                        <p
                                            className="text-sm text-violet-100 line-clamp-2 hover:opacity-75  transition-opacity cursor-pointer"
                                            onClick={() => {
                                                lastMessageRef.current?.scrollIntoView({
                                                    behavior: 'smooth',
                                                    block: 'start',
                                                });
                                            }}
                                        >
                                            {lastUserMessage}
                                        </p>
                                        {isHovering && (
                                            <div className="absolute left-0 top-full z-30 mt-0 p-4 bg-violet-900/95 backdrop-blur-sm rounded-xl border border-violet-500/20 max-w-[600px] max-h-[300px]  overflow-y-auto custom-scrollbar whitespace-pre-wrap break-words shadow-xl overflow-hidden"
                                            style={{ marginLeft: '-44px' }}>
                                                <p className="text-sm text-violet-100">{lastUserMessage}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Chat Container */}
                        <div className="flex flex-1 overflow-hidden">
                            {/* History Sidebar */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: showHistory ? '300px' : 0 }}
                                transition={{ duration: 0.3 }}
                                className="border-r border-violet-500/20 overflow-hidden"
                            >
                                <div className="p-4 space-y-4 overflow-y-auto h-full custom-scrollbar">
                                    <h3 className="text-lg font-semibold text-white">{t('chat_history')}</h3>
                                    {/* Add chat history items here */}
                                </div>
                            </motion.div>

                            {/* Main Chat Area */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                    <style>{`
                                        .custom-scrollbar::-webkit-scrollbar {
                                            width: 8px;
                                        }
                                        .custom-scrollbar::-webkit-scrollbar-track {
                                            background: rgba(139, 92, 246, 0.1);
                                            border-radius: 4px;
                                        }
                                        .custom-scrollbar::-webkit-scrollbar-thumb {
                                            background: linear-gradient(to bottom, rgba(139, 92, 246, 0.5), rgba(167, 139, 250, 0.5));
                                            border-radius: 4px;
                                        }
                                        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                            background: linear-gradient(to bottom, rgba(139, 92, 246, 0.7), rgba(167, 139, 250, 0.7));
                                        }
                                    `}</style>
                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        <AnimatePresence>
                                            {messages.map((message, index) => (
                                                <motion.div
                                                    key={index}
                                                    ref={index === messages.length - 1 ? lastMessageRef : undefined}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                                    >
                                                        <div
                                                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-violet-600' : 'bg-purple-700'} ml-2`}
                                                        >
                                                            {message.role === 'user' ? (
                                                                <FiUser className="w-5 h-5 text-white" />
                                                            ) : (
                                                                <FiCpu className="w-5 h-5 text-white" />
                                                            )}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div
                                                                className={`p-4 rounded-2xl ${message.role === 'user'
                                                                    ? 'bg-violet-600 bg-opacity-20 text-white'
                                                                    : 'bg-purple-700 bg-opacity-20 text-white'
                                                                    }`}
                                                            >
                                                                <p className="whitespace-pre-wrap">{message.content}</p>
                                                            </div>
                                                            <div
                                                                className={`flex items-center text-xs text-violet-300 space-x-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                            >
                                                                <span>{formatTime(message.timestamp)}</span>
                                                                {message.metrics && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <div className="flex items-center space-x-1">
                                                                            <FiDatabase className="w-3 h-3" />
                                                                            <span>{message.metrics.tokens.total} tokens</span>
                                                                        </div>
                                                                        <span>•</span>
                                                                        <div className="flex items-center space-x-1">
                                                                            <FiClock className="w-3 h-3" />
                                                                            <span>{message.metrics.responseTime}ms</span>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {(isLoading || streamingContent) && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex justify-start"
                                                >
                                                    <div className="flex max-w-[80%] flex-row">
                                                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-purple-700 ml-2">
                                                            <FiCpu className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="p-4 rounded-2xl bg-purple-700 bg-opacity-20 text-white">
                                                                {streamingContent ? (
                                                                    <p className="whitespace-pre-wrap">{streamingContent}</p>
                                                                ) : (
                                                                    <div className="flex items-center space-x-2">
                                                                        <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                                                                        <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse delay-75" />
                                                                        <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse delay-150" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>)}
        </AnimatePresence>
    );
}
