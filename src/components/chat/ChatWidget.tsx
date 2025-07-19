'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useChatbot } from '@/hooks/useChatbot';
import type { ChatMessage } from '@/types/buildship';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    isLoading, 
    isConnected, 
    error, 
    sendMessage, 
    clearChat 
  } = useChatbot();

  // Auto-scroll a los mensajes más recientes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const messageToSend = inputMessage.trim();
    setInputMessage('');
    
    await sendMessage(messageToSend);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = (message: ChatMessage) => {
    const isBot = message.sender === 'bot';
    const isError = message.type === 'error';
    
    return (
      <div
        key={message.id}
        className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
      >
        <div
          className={`max-w-[80%] p-3 rounded-lg ${
            isBot
              ? isError
                ? 'bg-destructive/10 border border-destructive/20 text-destructive'
                : 'bg-muted text-muted-foreground'
              : 'bg-primary text-primary-foreground'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
          <span className="text-xs opacity-70 mt-1 block">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full shadow-lg"
          size="lg"
        >
          {isOpen ? '✕' : '💬'}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] z-50">
          <Card className="h-full bg-card border-border shadow-xl flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">HeyMou</h3>
                  <p className="text-xs text-muted-foreground">
                    {isConnected ? 'En línea' : 'Desconectado'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="text-xs"
                  >
                    Limpiar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map(renderMessage)}
              
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 bg-input border-border"
                  disabled={isLoading || !isConnected}
                />
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={isLoading || !inputMessage.trim() || !isConnected}
                >
                  Enviar
                </Button>
              </form>
              
              {error && (
                <p className="text-xs text-destructive mt-2">
                  {error}
                </p>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
