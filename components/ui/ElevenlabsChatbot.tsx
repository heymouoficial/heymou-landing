'use client';

import Script from 'next/script';
import { useState, useEffect } from 'react';

interface ExtendedWindow extends Window {
  ElevenLabsConvaiWidget?: unknown;
}

interface ElevenlabsChatbotProps {
  className?: string;
}

export default function ElevenlabsChatbot({ className = '' }: ElevenlabsChatbotProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (typeof window !== 'undefined' && (window as ExtendedWindow).ElevenLabsConvaiWidget) {
      setIsLoaded(true);
    }
  }, []);

  const handleScriptLoad = () => {
    setIsLoaded(true);
  };

  const handleScriptError = () => {
    setHasError(true);
  };

  if (hasError) {
    return null; // Don't render anything if there's an error
  }

  return (
    <div className={className}>
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed@latest/dist/index.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />
      {isLoaded && (
        // @ts-expect-error Custom element from Elevenlabs
        <elevenlabs-convai
          agent-id="agent_9901k2zg121ff1xamgf890xem16k"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999
          }}
        />
      )}
    </div>
  );
}