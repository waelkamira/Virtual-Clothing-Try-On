"use client"

import type React from "react"
import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react"
import Link from "next/link"
import { useNavigation } from "@/lib/navigation-utils"
import { useToast } from "@/components/ui/use-toast"

type ButtonWrapperProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string
  isLink?: boolean
  isExternalLink?: boolean
  onClick?: () => void
  onClickFallback?: () => void
  fallbackMessage?: string
}

const ButtonWrapper = forwardRef<HTMLButtonElement, ButtonWrapperProps>(
  (
    {
      children,
      href,
      isLink = false,
      isExternalLink = false,
      onClick,
      onClickFallback,
      fallbackMessage = "This feature is coming soon!",
      ...props
    },
    ref,
  ) => {
    const { navigateTo } = useNavigation()
    const { toast } = useToast()

    const handleClick = (e: React.MouseEvent) => {
      // If onClick is provided, call it
      if (onClick) {
        onClick()
        return
      }

      // If it's a link, navigate to the href
      if (isLink && href) {
        if (isExternalLink) {
          // For external links, we use window.open
          window.open(href, "_blank", "noopener,noreferrer")
        } else {
          // For internal links, we use the router
          navigateTo(href)
        }
        return
      }

      // If no onClick or href is provided, show a fallback message
      if (onClickFallback) {
        onClickFallback()
      } else {
        toast({
          title: "Coming Soon",
          description: fallbackMessage,
        })
      }
    }

    // If it's a link with an href, use Next.js Link component
    if (isLink && href && !isExternalLink) {
      return (
        <Link href={href} passHref legacyBehavior>
          <a {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>
        </Link>
      )
    }

    // Otherwise, render a button
    return (
      <button ref={ref} onClick={handleClick} {...props}>
        {children}
      </button>
    )
  },
)

ButtonWrapper.displayName = "ButtonWrapper"

export default ButtonWrapper

