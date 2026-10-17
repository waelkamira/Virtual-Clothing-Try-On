import Link from "next/link"
import {
  Camera,
  ShoppingBag,
  User,
  Settings,
  HelpCircle,
  Mail,
  Twitter,
  Instagram,
  Facebook,
  Home,
  LinkIcon,
} from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">VF</span>
                <span className="absolute -right-1 -top-1 w-4 h-4 bg-orange-400 rounded-full flex items-center justify-center text-[10px] font-bold">
                  3D
                </span>
              </div>
              <div>
                <h1 className="font-bold text-xl text-foreground">
                  Virtual<span className="text-orange-500">Fit</span>
                </h1>
                <p className="text-[10px] text-muted-foreground -mt-1">TRY BEFORE YOU BUY</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Experience clothes shopping like never before with our revolutionary virtual try-on technology.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-muted-foreground hover:text-orange-500 hover:bg-orange-500/20 transition-colors"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-muted-foreground hover:text-orange-500 hover:bg-orange-500/20 transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-muted-foreground hover:text-orange-500 hover:bg-orange-500/20 transition-colors"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home", icon: <Home size={16} /> },
                { href: "/try-on", label: "Virtual Try-On", icon: <Camera size={16} /> },
                { href: "/catalog", label: "Browse Catalog", icon: <ShoppingBag size={16} /> },
                { href: "/import", label: "Import from URL", icon: <LinkIcon size={16} /> },
                { href: "/profile", label: "My Profile", icon: <User size={16} /> },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-orange-500 transition-colors flex items-center gap-2"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
              {[
                { href: "/help", label: "Help Center", icon: <HelpCircle size={16} /> },
                { href: "/contact", label: "Contact Us", icon: <Mail size={16} /> },
                { href: "/faq", label: "FAQs", icon: <HelpCircle size={16} /> },
                { href: "/privacy", label: "Privacy Policy", icon: <Settings size={16} /> },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-orange-500 transition-colors flex items-center gap-2"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">Newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter to get updates on new features and clothing collections.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 bg-background border border-input rounded-l-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-foreground w-full"
              />
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-r-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} VirtualFit. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/terms" className="text-muted-foreground hover:text-orange-500 text-sm">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-orange-500 text-sm">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-orange-500 text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

