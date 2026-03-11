"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const navLinks = [
  { href: "/login", label: "Survey" },
  { href: "/profile", label: "Class Profile" },
  { href: "/graduates", label: "Graduates" },
  { href: "/rewind", label: "Rewind" },
  { href: "/about", label: "About" },
] as const;

function DesktopNav() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-1">
        {navLinks.map(({ href, label }) => (
          <NavigationMenuItem key={href}>
            <NavigationMenuLink asChild>
              <Link
                href={href}
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-base h-10 px-5"
                )}
              >
                {label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileMenuButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="md:hidden flex items-center justify-center size-10 rounded-lg hover:bg-black/5 aria-expanded:bg-black/5 transition-colors"
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
    >
      {open ? (
        <X className="size-6 text-foreground" aria-hidden />
      ) : (
        <Menu className="size-6 text-foreground" aria-hidden />
      )}
    </button>
  );
}

function MobilePopout({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            role="presentation"
            className="fixed inset-0 z-50 bg-black/40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[280px] bg-background shadow-xl md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold text-foreground">
                Menu
              </span>
              <button
                type="button"
                onClick={onClose}
                className="flex size-10 items-center justify-center rounded-lg hover:bg-black/5"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={cn(
                    "rounded-lg px-4 py-3 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="flex w-full items-center justify-between gap-4 p-4 sm:p-6">
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 min-w-0"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/logo.png"
            alt=""
            width={40}
            height={40}
            className="shrink-0"
          />
          <span className="font-bold text-xl sm:text-2xl truncate">
            JFSS Class of 2026
          </span>
        </Link>

        <DesktopNav />
        <MobileMenuButton open={menuOpen} onClick={() => setMenuOpen((o) => !o)} />
      </div>

      <MobilePopout open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
