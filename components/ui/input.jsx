export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 bg-black/40 border border-orange-500/30 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500 ${className}`}
      {...props}
    />
  )
}

