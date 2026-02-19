import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Shield,
  LayoutDashboard,
  Map,
  ClipboardList,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Home", icon: Shield },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/heatmap", label: "Risk Heatmap", icon: Map },
  { to: "/logs", label: "Entry Logs", icon: ClipboardList },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className={cn(
          "sticky top-0 z-50 border-b backdrop-blur-md",
          isHome
            ? "bg-primary/95 border-primary/20"
            : "bg-card/95 border-border",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg",
                isHome ? "bg-accent" : "bg-primary",
              )}
            >
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span
              className={cn(
                "text-lg font-extrabold tracking-tight",
                isHome ? "text-primary-foreground" : "text-foreground",
              )}
            >
              ManholeGuard
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === item.to
                    ? isHome
                      ? "bg-accent text-accent-foreground"
                      : "bg-primary text-primary-foreground"
                    : isHome
                      ? "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg",
              isHome ? "text-primary-foreground" : "text-foreground",
            )}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div
            className={cn(
              "md:hidden border-t px-4 pb-4 pt-2",
              isHome ? "bg-primary border-primary/20" : "bg-card border-border",
            )}
          >
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium",
                  location.pathname === item.to
                    ? isHome
                      ? "bg-accent text-accent-foreground"
                      : "bg-primary text-primary-foreground"
                    : isHome
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-card py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          © 2026 ManholeGuard — Solapur Municipal Corporation. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
