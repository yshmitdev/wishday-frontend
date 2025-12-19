import { Heart } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 py-8 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo width={96} height={96} className="rounded-lg" />
          <p className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            Made with <Heart className="h-4 w-4 text-rose-500 fill-rose-500" /> for celebrating the people who matter most
          </p>
        </div>
      </div>
    </footer>
  );
}

