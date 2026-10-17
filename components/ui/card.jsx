export function Card({ children, className = "", ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`card-content ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = "", ...props }) {
  return (
    <h3 className={`text-xl font-bold ${className}`} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = "", ...props }) {
  return (
    <p className={`text-sm text-gray-400 ${className}`} {...props}>
      {children}
    </p>
  )
}

export function CardFooter({ children, className = "", ...props }) {
  return (
    <div className={`card-content border-t border-orange-500/20 ${className}`} {...props}>
      {children}
    </div>
  )
}

