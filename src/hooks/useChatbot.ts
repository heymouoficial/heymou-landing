'use client';

import { useState, useCallback, useEffect } from 'react';
import { buildshipClient, formatChatMessage, generateSessionId } from '@/lib/buildship';
import type { ChatMessage, ChatState } from '@/types/buildship';

export function useChatbot() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    isConnected: false,
    sessionId: '',
    error: null,
  });

  // Inicializar sesión de chat
  useEffect(() => {
    const sessionId = generateSessionId();
    setState(prev => ({
      ...prev,
      sessionId,
      isConnected: true,
      messages: [
        {
          id: 'welcome',
          content: '¡Hola! Soy HeyMou. Estoy aquí para ayudarte a transformar tus ideas audaces en ecosistemas digitales funcionales. ¿En qué puedo asistirte hoy?',
          sender: 'bot',
          timestamp: new Date(),
          type: 'text',
        },
      ],
    }));
  }, []);

  const sendMessage = useCallback(async (messageContent: string): Promise<boolean> => {
    if (!messageContent.trim() || state.isLoading) {
      return false;
    }

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      content: messageContent.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    // Agregar mensaje del usuario
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      // Formatear mensaje para BuildShip
      const chatData = formatChatMessage(
        messageContent,
        state.sessionId,
        undefined // userId opcional
      );

      // Enviar a BuildShip webhook
      const response = await buildshipClient.chatInteractionWebhook(chatData);

      if (response.success && response.data?.chatReply) {
        const botMessage: ChatMessage = {
          id: `bot_${Date.now()}`,
          content: response.data.chatReply,
          sender: 'bot',
          timestamp: new Date(),
          type: 'text',
        };

        setState(prev => ({
          ...prev,
          messages: [...prev.messages, botMessage],
          isLoading: false,
        }));

        // Analytics tracking
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'chat_interaction', {
            event_category: 'engagement',
            event_label: 'chatbot',
            value: 1,
          });
        }

        return true;
      } else {
        throw new Error(response.error || 'Error en la respuesta del chatbot');
      }
    } catch (error) {
      console.error('Error sending chat message:', error);

      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        content: 'Disculpa, hubo un problema al procesar tu mensaje. Por favor intenta nuevamente o contáctame directamente.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'error',
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error inesperado',
      }));

      return false;
    }
  }, [state.sessionId, state.isLoading]);

  const clearChat = useCallback(() => {
    const newSessionId = generateSessionId();
    setState({
      messages: [
        {
          id: 'welcome_new',
          content: '¡Hola! Soy HeyMou. ¿En qué puedo ayudarte hoy?',
          sender: 'bot',
          timestamp: new Date(),
          type: 'text',
        },
      ],
      isLoading: false,
      isConnected: true,
      sessionId: newSessionId,
      error: null,
    });
  }, []);

  const retryLastMessage = useCallback(() => {
    const lastUserMessage = state.messages
      .filter(msg => msg.sender === 'user')
      .pop();

    if (lastUserMessage) {
      // Remover mensajes de error
      setState(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg.type !== 'error'),
        error: null,
      }));

      // Reenviar último mensaje
      return sendMessage(lastUserMessage.content);
    }

    return Promise.resolve(false);
  }, [state.messages, sendMessage]);

  return {
    ...state,
    sendMessage,
    clearChat,
    retryLastMessage,
  };
}
