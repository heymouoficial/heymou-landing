# Chatbot Component

## Overview

The Chatbot component provides an interactive AI assistant powered by BuildShip workflows. It features a modern floating chat interface with real-time messaging capabilities.

## Features

- **Floating Chat Interface**: Modern, responsive design with smooth animations
- **Real-time Messaging**: Instant responses from BuildShip AI workflow
- **Session Management**: Maintains conversation context across messages
- **Bilingual Support**: Spanish and English interface
- **Minimizable**: Can be minimized while keeping the conversation active
- **Mobile Responsive**: Optimized for all screen sizes
- **Accessibility**: Keyboard navigation and screen reader support

## Usage

```tsx
import Chatbot from '@/components/ui/Chatbot';

export default function Page() {
  return (
    <div>
      {/* Your page content */}
      <Chatbot />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes |

## BuildShip Integration

The chatbot integrates with BuildShip workflow endpoint:
- **Endpoint**: `https://2m5s5r.buildship.run/executeWorkflow/P8FqOO35EihjfxhgWdUW/f3941596-6c47-40f7-8dc1-f27f99a78bd5`
- **Method**: POST
- **Headers**: `BUILDSHIP_API_KEY`

### Payload Structure

```json
{
  "origen": "website_chat",
  "mensajePayload": {
    "message": "User message",
    "sessionId": "unique_session_id",
    "locale": "es|en",
    "context": {},
    "metadata": {
      "userAgent": "...",
      "referer": "...",
      "timestamp": "...",
      "ip": "...",
      "source": "website_chatbot"
    }
  },
  "telegramChatId": ""
}
```

## Environment Variables

Required environment variables:

```bash
BUILDSHIP_API_KEY=your_buildship_api_key
BUILDSHIP_CHATBOT_ENDPOINT=https://2m5s5r.buildship.run/executeWorkflow/P8FqOO35EihjfxhgWdUW/f3941596-6c47-40f7-8dc1-f27f99a78bd5
```

## API Endpoint

The component uses the internal API endpoint:
- **Route**: `/api/buildship/chatbot`
- **Method**: POST
- **Content-Type**: `application/json`

## Styling

The component uses Tailwind CSS classes and follows the design system:
- **Primary Color**: Uses `primary` and `primary-light` theme colors
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React icons
- **Responsive**: Mobile-first design approach

## Message Types

### User Messages
- Displayed on the right side
- Blue background (`bg-primary`)
- User icon

### Bot Messages
- Displayed on the left side
- White background with border
- Bot icon
- Typing indicator while loading

## Session Management

- Each chat session gets a unique `sessionId`
- Session persists during the browser session
- Context is maintained across messages
- Page information is included in context

## Error Handling

- Network errors are handled gracefully
- User-friendly error messages in both languages
- Automatic retry capabilities
- Fallback responses for failed requests

## Accessibility Features

- Keyboard navigation support
- Screen reader compatible
- Focus management
- ARIA labels and roles
- High contrast support

## Performance Optimizations

- Lazy loading of messages
- Efficient re-renders with React.memo patterns
- Optimized animations
- Debounced input handling
- Auto-scroll optimization

## Customization

The component can be customized through:
- CSS classes via `className` prop
- Theme colors in Tailwind config
- Message templates
- Animation timings
- Welcome messages per locale

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers