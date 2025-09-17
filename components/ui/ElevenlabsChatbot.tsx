'use client';

import Script from 'next/script';

interface ElevenlabsChatbotProps {
  className?: string;
}

export default function ElevenlabsChatbot({ className = '' }: ElevenlabsChatbotProps) {
  return (
    <div className={className}>
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="afterInteractive"
      />
      {/* @ts-expect-error Custom element from Elevenlabs */}
      <elevenlabs-convai agent-id="agent_9901k2zg121ff1xamgf890xem16k"></elevenlabs-convai>
    </div>
  );
}