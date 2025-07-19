import { cn } from "@/lib/utils";

interface AnnouncementProps {
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom' | 'right-top' | 'right-bottom';
  showLed?: boolean;
  ledColor?: 'red' | 'green' | 'yellow';
}

export function Announcement({ 
  children, 
  className, 
  position = 'top',
  showLed = false,
  ledColor = 'red'
}: AnnouncementProps) {
  const positionClasses = {
    'top': 'top-4 right-4',
    'bottom': 'bottom-4 right-4', 
    'right-top': 'top-8 -right-4',
    'right-bottom': 'bottom-8 -right-4'
  };

  const ledColors = {
    'red': 'bg-red-500',
    'green': 'bg-green-500', 
    'yellow': 'bg-yellow-500'
  };

  return (
    <div
      className={cn(
        "absolute z-20 px-4 py-2 text-white text-sm font-medium rounded-full",
        "backdrop-blur-md bg-gradient-to-r from-black/40 via-gray-900/30 to-black/40",
        "border border-gray-600/50 shadow-2xl",
        "hover:scale-105 transition-all duration-300",
        positionClasses[position],
        className
      )}
    >
      <div className="flex items-center gap-2">
        {showLed && (
          <div className={cn(
            "w-2 h-2 rounded-full animate-pulse",
            ledColors[ledColor]
          )} />
        )}
        {children}
      </div>
    </div>
  );
}
