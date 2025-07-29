import { useState, useCallback, useRef } from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  metadata?: {
    source?: 'buildship' | 'knowledge_base' | 'suggestions' | 'error' | 'welcome';
    suggestions?: string[];
  };
}

export interface UseChatbotOptions {
  locale?: 'es' | 'en';
  sessionId?: string;
}

export function useChatbot(options: UseChatbotOptions = {}) {
  const { locale = 'es', sessionId: providedSessionId } = options;
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sessionIdRef = useRef(
    providedSessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
  );

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/buildship/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: sessionIdRef.current,
          locale,
          context: {
            page: typeof window !== 'undefined' ? window.location.pathname : '',
            referrer: typeof document !== 'undefined' ? document.referrer : '',
            timestamp: new Date().toISOString(),
          },
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        const botMessage: ChatMessage = {
          id: `bot_${Date.now()}`,
          content: result.data.response,
          sender: 'bot',
          timestamp: new Date(),
          metadata: {
            source: result.data.context?.source || 'unknown',
            suggestions: result.data.context?.suggestions || [],
          },
        };
        
        setMessages(prev => [...prev, botMessage]);

        // Add suggestions as a separate message if available
        if (result.data.context?.suggestions?.length > 0) {
          setTimeout(() => {
            const suggestionsMessage: ChatMessage = {
              id: `suggestions_${Date.now()}`,
              content: `💡 ${locale === 'es' ? 'También puedes preguntarme:' : 'You can also ask me:'}\n\n${result.data.context.suggestions.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}`,
              sender: 'bot',
              timestamp: new Date(),
              metadata: {
                source: 'suggestions',
              },
            };
            setMessages(prev => [...prev, suggestionsMessage]);
          }, 1500);
        }
      } else {
        throw new Error(result.error || 'Failed to get response');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      const botErrorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        content: locale === 'es'
          ? 'Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo o contacta directamente a hi@heymou.com'
          : 'Sorry, there was an error processing your message. Please try again or contact directly at hi@heymou.com',
        sender: 'bot',
        timestamp: new Date(),
        metadata: {
          source: 'error',
        },
      };
      
      setMessages(prev => [...prev, botErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, locale]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const addWelcomeMessage = useCallback(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      content: locale === 'es'
        ? '¡Hola! 👋 Soy el asistente de HeyMou, tu aliado tecnológico.\n\n¿En qué puedo ayudarte hoy? Puedes preguntarme sobre servicios, proyectos o cualquier duda tecnológica.'
        : 'Hello! 👋 I\'m HeyMou\'s assistant, your technology ally.\n\nHow can I help you today? You can ask me about services, projects or any tech questions.',
      sender: 'bot',
      timestamp: new Date(),
      metadata: {
        source: 'welcome',
      },
    };
    
    setMessages([welcomeMessage]);
  }, [locale]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    addWelcomeMessage,
    sessionId: sessionIdRef.current,
  };
}