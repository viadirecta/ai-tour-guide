

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, MessageSender, TourConfig } from '../types';
import { createChat } from '../services/geminiService';
import { getTourConfig, getTourById } from '../services/configService';
import type { Chat, Part } from '@google/genai';
import ChatBubble from './ChatBubble';
import Icon from './Icon';
import CameraCapture from './CameraCapture';
import ThemeSwitcher from './ThemeSwitcher';
import { useLanguage } from '../hooks/useLanguage';

interface ChatInterfaceProps {
  tourId?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ tourId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [config, setConfig] = useState<TourConfig | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { languageName } = useLanguage();

  useEffect(() => {
    if (!tourId) {
      setError("No tour specified. Please select a tour from the list.");
      return;
    }
    const tourConfig = getTourConfig(tourId);
    if (tourConfig) {
        setConfig(tourConfig);
        const welcomeMessage = `Welcome to the ${tourConfig.tourName}! I am your virtual tour guide. Use the camera to show me something or ask me a question to begin.`;
        setMessages([{ 
          id: 'intro', 
          text: welcomeMessage,
          sender: MessageSender.GEMINI 
        }]);
        try {
          // Instruct AI to respond in the user's selected language
          const instructionWithLang = `${tourConfig.systemInstruction}. IMPORTANT: You must respond in ${languageName}.`;
          setChat(createChat(instructionWithLang));
        } catch (e: any) {
          setError(`Initialization failed: ${e.message}`);
        }
    } else {
        setError(`Could not find configuration for tour "${tourId}".`);
    }
  }, [tourId, languageName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleCapture = useCallback((imageData: string) => {
    setCapturedImage(imageData);
    setIsCameraOpen(false);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if ((!input.trim() && !capturedImage) || isLoading || !config) return;

    const trimmedInput = input.trim();
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: trimmedInput,
      sender: MessageSender.USER,
      image: capturedImage || undefined,
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput('');
    setCapturedImage(null);
    
    // If there's no image, check for local references first
    if (!capturedImage && trimmedInput) {
        const localReference = config.references.find(ref => ref.keyword.toLowerCase() === trimmedInput.toLowerCase());
        if (localReference) {
            const systemMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: localReference.description,
                sender: MessageSender.SYSTEM,
                image: localReference.imageUrl,
                videoUrl: localReference.videoUrl,
            };
            setMessages(prev => [...prev, systemMessage]);
            return;
        }
    }

    if (!chat) {
        setError("Chat service is not available.");
        return;
    }

    setIsLoading(true);
    setError(null);

    const aiResponseId = (Date.now() + 1).toString();
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: aiResponseId, text: '...', sender: MessageSender.GEMINI },
    ]);
    
    try {
      const messageParts: Part[] = [];
      if (capturedImage) {
          const imagePart = {
              inlineData: {
                  mimeType: 'image/jpeg',
                  data: capturedImage.split(',')[1], // Remove the base64 prefix
              },
          };
          messageParts.push(imagePart);
      }
       if (trimmedInput) {
        messageParts.push({ text: trimmedInput });
      }
      
      const stream = await chat.sendMessageStream({ message: messageParts });
      let fullResponse = '';
      
      setMessages((prev) => prev.map(msg => msg.id === aiResponseId ? {...msg, text: ''} : msg));

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiResponseId ? { ...msg, text: fullResponse } : msg
          )
        );
      }
    } catch (e: any) {
      const errorMessage = `Error: ${e.message || 'An unknown error occurred.'}`;
      setError(errorMessage);
      setMessages((prev) => prev.filter(msg => msg.id !== aiResponseId));
    } finally {
      setIsLoading(false);
    }
  }, [input, capturedImage, isLoading, chat, config]);

  if (!config || !tourId) {
     return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-red-500 dark:text-red-400">Error</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">{error || "Loading tour..."}</p>
                 <a href="/#" className="mt-6 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">Return to Tour List</a>
            </div>
        </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {isCameraOpen && <CameraCapture onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />}
      
      <aside className="w-1/3 h-full bg-slate-50 dark:bg-slate-950 p-6 overflow-y-auto hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center min-w-0">
            <Icon name="walking" className="w-8 h-8 mr-3 text-sky-500 dark:text-sky-400 flex-shrink-0" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white truncate">{config.tourName}</h1>
          </div>
          <ThemeSwitcher />
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">
          {config.systemInstruction}
        </p>

        <div className="text-center mt-auto pt-8">
             <a href={`/#/tip/${tourId}`} className="w-full mb-4 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-colors">
                <Icon name="tip" className="w-5 h-5 mr-2" />
                Leave a Tip
            </a>
            <a href={`/#/admin/${tourId}`} className="text-sm text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                <Icon name="settings" className="w-4 h-4 inline-block mr-1" />
                Admin Panel
            </a>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen bg-white dark:bg-slate-900">
        <header className="p-4 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between md:hidden">
             <div className="flex items-center min-w-0">
                <Icon name="walking" className="w-6 h-6 mr-2 text-sky-500 dark:text-sky-400 flex-shrink-0" />
                <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">{config.tourName}</h1>
            </div>
             <div className="flex items-center gap-4">
                <a href={`/#/tip/${tourId}`} className="flex-shrink-0 px-3 py-1.5 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-500 transition-colors flex items-center">
                    <Icon name="tip" className="w-4 h-4 mr-1.5" />
                    Tip Guide
                </a>
                <ThemeSwitcher />
            </div>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="px-6 pb-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto pt-4">
             {error && (
              <div className="bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4 text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}
            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 flex items-start gap-2">
                <button onClick={() => setIsCameraOpen(true)} className="text-slate-500 dark:text-slate-400 rounded-lg w-10 h-10 flex-shrink-0 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Capture with camera">
                    <Icon name="camera" className="w-6 h-6" />
                </button>
                <div className="flex-1 relative">
                    {capturedImage && (
                        <div className="absolute bottom-full left-0 mb-2 p-1 bg-white dark:bg-slate-900 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                            <img src={capturedImage} alt="Captured" className="h-20 w-auto rounded-md" />
                            <button onClick={() => setCapturedImage(null)} className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full p-0.5 hover:bg-red-500">
                                <Icon name="x-circle" className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} placeholder="Ask a question or add a note..." className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none resize-none px-2 py-2.5 h-10 max-h-40" rows={1} disabled={isLoading} />
                </div>
                <button onClick={handleSendMessage} disabled={isLoading || (!input.trim() && !capturedImage)} className="self-center bg-indigo-600 text-white rounded-lg w-10 h-10 flex-shrink-0 flex items-center justify-center disabled:bg-slate-400 dark:disabled:bg-slate-600 hover:bg-indigo-500 transition-colors">
                    {isLoading ? (<div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>) : (<Icon name="send" className="w-5 h-5" />)}
                </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatInterface;