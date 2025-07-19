import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  className?: string
  children: React.ReactNode
}

export function Container({ 
  as: Component = 'div', 
  className, 
  children, 
  ...props 
}: ContainerProps) {
  return (
    <Component 
      className={cn(
        "w-full mx-auto px-6 lg:px-8 max-w-[1240px]",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
