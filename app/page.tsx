"use client";

import { useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/calendar");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse">
          <Image
            src="/logo.png"
            alt="WishDay"
            width={80}
            height={80}
            className="rounded-xl opacity-50"
          />
        </div>
      </div>
    );
  }

  // If signed in, show nothing while redirecting
  if (isSignedIn) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-amber-50 to-violet-50 dark:from-rose-950/20 dark:via-amber-950/20 dark:to-violet-950/20" />
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] animate-blob rounded-full bg-rose-200/40 mix-blend-multiply blur-3xl filter dark:bg-rose-900/20" />
        <div className="absolute top-1/4 right-1/4 h-[500px] w-[500px] animate-blob animation-delay-2000 rounded-full bg-amber-200/40 mix-blend-multiply blur-3xl filter dark:bg-amber-900/20" />
        <div className="absolute bottom-0 left-1/3 h-[500px] w-[500px] animate-blob animation-delay-4000 rounded-full bg-violet-200/40 mix-blend-multiply blur-3xl filter dark:bg-violet-900/20" />
      </div>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Floating confetti/celebration icons */}
          <div className="relative mb-8">
            <span className="absolute -top-4 -left-8 animate-float text-4xl">🎈</span>
            <span className="absolute -top-8 right-0 animate-float animation-delay-1000 text-3xl">✨</span>
            <span className="absolute top-4 -right-12 animate-float animation-delay-2000 text-4xl">🎂</span>
            <span className="absolute -bottom-4 -left-4 animate-float animation-delay-3000 text-3xl">🎁</span>
          </div>

          {/* Logo with glow effect */}
          <div className="relative mx-auto mb-8 w-fit">
            <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-rose-400 to-amber-400 opacity-40 blur-xl" />
            <Image
              src="/logo.png"
              alt="WishDay"
              width={120}
              height={120}
              className="relative rounded-2xl shadow-2xl"
              priority
            />
          </div>

          {/* Headline */}
          <h1 className="mb-6 bg-gradient-to-r from-rose-600 via-amber-600 to-violet-600 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl dark:from-rose-400 dark:via-amber-400 dark:to-violet-400">
            Never Forget a Birthday Again
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-600 sm:text-xl dark:text-zinc-300">
            WishDay helps you keep track of all the special days for the people you love.
            Get reminders, organize contacts, and make every celebration memorable.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="h-12 min-w-[180px] bg-gradient-to-r from-rose-500 to-amber-500 text-base font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-rose-500/30 dark:shadow-rose-500/10"
              >
                Get Started Free
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button
                variant="outline"
                size="lg"
                className="h-12 min-w-[180px] border-2 text-base font-semibold transition-all hover:scale-105"
              >
                Sign In
              </Button>
            </SignInButton>
          </div>
        </div>

        {/* Features Section */}
        <div className="mx-auto mt-24 grid max-w-5xl gap-8 px-4 sm:grid-cols-3">
          <FeatureCard
            icon="📅"
            title="Calendar View"
            description="See all upcoming birthdays at a glance with a beautiful calendar interface."
            delay="0"
          />
          <FeatureCard
            icon="🔔"
            title="Smart Reminders"
            description="Never miss a celebration with timely notifications before the big day."
            delay="100"
          />
          <FeatureCard
            icon="👥"
            title="Organize Contacts"
            description="Keep all your important dates organized in one secure place."
            delay="200"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50 py-8 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>Made with ❤️ for celebrating the people who matter most</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: string;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div
      className="group rounded-2xl border border-border/50 bg-white/60 p-6 shadow-lg backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900/60"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 text-4xl transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  );
}
