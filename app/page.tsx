"use client";

import { useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { 
  CalendarDays, 
  Sparkles, 
  Bell, 
  Users, 
  Bot, 
  Moon, 
  Shield,
  Gift,
  ChevronRight,
  Check,
  Cake,
  PartyPopper
} from "lucide-react";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [activeMonth, setActiveMonth] = useState(0);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/calendar");
    }
  }, [isLoaded, isSignedIn, router]);

  // Animate through months for the preview
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMonth((prev) => (prev + 1) % 12);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse">
          <Logo width={80} height={80} className="rounded-xl opacity-50" />
        </div>
      </div>
    );
  }

  // If signed in, show nothing while redirecting
  if (isSignedIn) {
    return null;
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthColors = [
    'from-rose-400 to-pink-500',
    'from-red-400 to-rose-500',
    'from-emerald-400 to-teal-500',
    'from-green-400 to-emerald-500',
    'from-lime-400 to-green-500',
    'from-yellow-400 to-amber-500',
    'from-orange-400 to-amber-500',
    'from-amber-400 to-orange-500',
    'from-sky-400 to-blue-500',
    'from-violet-400 to-purple-500',
    'from-purple-400 to-violet-500',
    'from-blue-400 to-indigo-500',
  ];

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-amber-50 to-violet-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] animate-blob rounded-full bg-rose-200/40 mix-blend-multiply blur-3xl filter dark:bg-rose-900/20" />
        <div className="absolute top-1/4 right-1/4 h-[500px] w-[500px] animate-blob animation-delay-2000 rounded-full bg-amber-200/40 mix-blend-multiply blur-3xl filter dark:bg-amber-900/20" />
        <div className="absolute bottom-0 left-1/3 h-[500px] w-[500px] animate-blob animation-delay-4000 rounded-full bg-violet-200/40 mix-blend-multiply blur-3xl filter dark:bg-violet-900/20" />
      </div>

      {/* Hero Section */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left side - Text content */}
            <div className="text-center lg:text-left">
              {/* Floating celebration icons */}
              <div className="relative mb-6 inline-block">
                <span className="absolute -top-6 -left-10 animate-float text-3xl md:text-4xl">🎈</span>
                <span className="absolute -top-10 right-4 animate-float animation-delay-1000 text-2xl md:text-3xl">✨</span>
                <span className="absolute top-2 -right-10 animate-float animation-delay-2000 text-3xl md:text-4xl">🎂</span>
                <span className="absolute -bottom-4 -left-6 animate-float animation-delay-3000 text-2xl md:text-3xl">🎁</span>
                
                {/* Logo with glow effect */}
                <div className="relative mx-auto lg:mx-0 w-fit">
                  <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-rose-400 to-amber-400 opacity-40 blur-xl" />
                  <Logo width={100} height={100} className="relative rounded-2xl shadow-2xl" />
                </div>
              </div>

              {/* Headline */}
              <h1 className="mb-6 bg-gradient-to-r from-rose-600 via-amber-600 to-violet-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl dark:from-rose-400 dark:via-amber-400 dark:to-violet-400">
                Never Forget a Birthday Again
              </h1>

              {/* Subtitle */}
              <p className="mx-auto lg:mx-0 mb-8 max-w-xl text-lg text-zinc-600 sm:text-xl dark:text-zinc-300">
                WishDay is your personal birthday companion. Keep track of all the special days, 
                get smart reminders, and never miss a chance to make someone feel loved.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <SignUpButton mode="modal">
                  <Button
                    size="lg"
                    className="group h-14 min-w-[200px] bg-gradient-to-r from-rose-500 to-amber-500 text-base font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-rose-500/30 dark:shadow-rose-500/10"
                  >
                    Get Started Free
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 min-w-[200px] border-2 text-base font-semibold transition-all hover:scale-105 hover:bg-white/50 dark:hover:bg-zinc-800/50"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500 dark:text-zinc-400 lg:justify-start">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>No Credit Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Secure & Private</span>
                </div>
              </div>
            </div>

            {/* Right side - App Preview */}
            <div className="relative hidden lg:block">
              <div className="relative mx-auto w-full max-w-md">
                {/* Glowing backdrop */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-rose-500/20 via-amber-500/20 to-violet-500/20 blur-2xl" />
                
                {/* Preview Card */}
                <div className="relative rounded-2xl border border-white/20 bg-white/80 p-6 shadow-2xl backdrop-blur-xl dark:bg-zinc-900/80">
                  {/* Mini Calendar Grid */}
                  <div className="mb-6">
                    <h3 className="mb-4 text-lg font-semibold text-zinc-800 dark:text-zinc-200">Birthday Calendar</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {monthNames.map((month, idx) => (
                        <div
                          key={month}
                          className={`relative overflow-hidden rounded-xl p-3 text-center transition-all duration-500 ${
                            idx === activeMonth 
                              ? `bg-gradient-to-br ${monthColors[idx]} text-white shadow-lg scale-105` 
                              : 'bg-zinc-100 dark:bg-zinc-800'
                          }`}
                        >
                          <div className="text-xs font-medium">{month}</div>
                          {idx === activeMonth && (
                            <Cake className="mx-auto mt-1 h-4 w-4 animate-bounce" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats Preview */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 p-3 text-center text-white shadow-lg">
                      <Gift className="mx-auto mb-1 h-5 w-5" />
                      <div className="text-xl font-bold">24</div>
                      <div className="text-[10px] opacity-90">Total</div>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 p-3 text-center text-white shadow-lg">
                      <CalendarDays className="mx-auto mb-1 h-5 w-5" />
                      <div className="text-xl font-bold">3</div>
                      <div className="text-[10px] opacity-90">This Month</div>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-3 text-center text-white shadow-lg">
                      <PartyPopper className="mx-auto mb-1 h-5 w-5" />
                      <div className="text-xl font-bold">5</div>
                      <div className="text-[10px] opacity-90">Upcoming</div>
                    </div>
                  </div>

                  {/* AI Chat Preview */}
                  <div className="mt-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 p-4 border border-violet-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">AI Assistant</span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      &quot;Mom&apos;s birthday is in 5 days! 🎂 Would you like gift suggestions?&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500/10 to-amber-500/10 px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 mb-4">
              <Sparkles className="h-4 w-4" />
              Powerful Features
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-50">
              Everything You Need to
              <span className="block bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent dark:from-rose-400 dark:to-amber-400">
                Celebrate Better
              </span>
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={CalendarDays}
              iconGradient="from-violet-500 to-purple-600"
              title="Beautiful Calendar View"
              description="See all 12 months at a glance with color-coded birthdays. Navigate through years effortlessly."
            />
            <FeatureCard
              icon={Bot}
              iconGradient="from-fuchsia-500 to-purple-600"
              title="AI Birthday Assistant"
              description="Chat with our AI for gift ideas, celebration tips, and to quickly find upcoming birthdays."
            />
            <FeatureCard
              icon={Bell}
              iconGradient="from-rose-500 to-pink-600"
              title="Smart Reminders"
              description="Never miss a celebration with timely notifications before the big day arrives."
            />
            <FeatureCard
              icon={Users}
              iconGradient="from-amber-500 to-orange-600"
              title="Contact Management"
              description="Easily add, edit, and organize your contacts with notes for gift ideas and preferences."
            />
            <FeatureCard
              icon={Moon}
              iconGradient="from-indigo-500 to-blue-600"
              title="Dark & Light Mode"
              description="Beautiful themes that adapt to your preference. Easy on the eyes, day or night."
            />
            <FeatureCard
              icon={Shield}
              iconGradient="from-emerald-500 to-teal-600"
              title="Secure & Private"
              description="Your data is encrypted and secure. We never share your information with anyone."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 lg:py-28 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Get started in minutes, stay organized forever
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <StepCard
              number="1"
              title="Create Your Account"
              description="Sign up for free in seconds. No credit card required."
              icon="🚀"
            />
            <StepCard
              number="2"
              title="Add Your Contacts"
              description="Import or manually add birthdays for friends, family, and colleagues."
              icon="👥"
            />
            <StepCard
              number="3"
              title="Never Miss a Birthday"
              description="Get reminders, use AI assistance, and celebrate every special moment."
              icon="🎉"
            />
          </div>
        </div>
      </section>

      {/* AI Assistant Highlight Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 mb-4">
                <Bot className="h-4 w-4" />
                AI-Powered
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50 mb-6">
                Meet Your Personal
                <span className="block bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-fuchsia-400">
                  Birthday Assistant
                </span>
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                Our AI assistant helps you stay on top of celebrations. Ask about upcoming birthdays, 
                get personalized gift suggestions based on your notes, or plan the perfect celebration.
              </p>
              <ul className="space-y-4">
                {[
                  "Find birthdays by name or date instantly",
                  "Get personalized gift recommendations",
                  "Celebration planning tips and ideas",
                  "Quick answers about your contacts"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-zinc-700 dark:text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chat Preview */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 blur-2xl" />
              <div className="relative rounded-2xl border border-violet-500/20 bg-white/80 shadow-2xl backdrop-blur-xl dark:bg-zinc-900/80 overflow-hidden">
                {/* Header */}
                <div className="relative px-5 py-4 border-b border-zinc-200 dark:border-zinc-700 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">Wishday Assistant</h3>
                      <p className="text-xs text-emerald-500 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Online
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-4 space-y-4 min-h-[300px]">
                  <ChatBubble isUser>
                    Who has a birthday this month?
                  </ChatBubble>
                  <ChatBubble>
                    🎂 You have <strong>3 birthdays</strong> this month!
                    <br /><br />
                    • <strong>Sarah</strong> - December 5th (in 2 days)<br />
                    • <strong>Mike</strong> - December 12th<br />
                    • <strong>Emma</strong> - December 24th
                  </ChatBubble>
                  <ChatBubble isUser>
                    Any gift ideas for Sarah?
                  </ChatBubble>
                  <ChatBubble>
                    Based on your notes, Sarah loves books and cooking! 📚🍳
                    <br /><br />
                    Here are some ideas:
                    <br />• A new cookbook from her favorite chef
                    <br />• Bestselling novel in her favorite genre
                    <br />• Cooking class experience
                  </ChatBubble>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="relative">
            {/* Floating elements */}
            <span className="absolute -top-8 left-1/4 animate-float text-4xl">🎈</span>
            <span className="absolute -top-4 right-1/4 animate-float animation-delay-1000 text-3xl">🎁</span>
            <span className="absolute top-12 right-1/6 animate-float animation-delay-2000 text-4xl">🎂</span>
            
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-50 mb-6">
              Start Celebrating
              <span className="block bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent dark:from-rose-400 dark:to-amber-400">
                The People You Love
              </span>
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Join thousands of people who never miss a birthday. 
              It&apos;s free, easy, and makes celebrating effortless.
            </p>
            
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="group h-14 min-w-[250px] bg-gradient-to-r from-rose-500 to-amber-500 text-lg font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-rose-500/30 dark:shadow-rose-500/10"
              >
                Create Free Account
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </SignUpButton>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  iconGradient,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconGradient: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-white/60 p-6 shadow-lg backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900/60">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-rose-500/5 opacity-0 transition-opacity group-hover:opacity-100 dark:to-rose-500/10" />
      
      <div className={`relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${iconGradient} shadow-lg`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="relative mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>
      <p className="relative text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="relative text-center">
      {/* Connector line */}
      <div className="absolute top-8 left-1/2 hidden h-0.5 w-full bg-gradient-to-r from-rose-500/50 to-amber-500/50 md:block" />
      
      <div className="relative">
        {/* Number badge */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-2xl shadow-lg shadow-rose-500/25">
          {icon}
        </div>
        <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
        <p className="text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>
    </div>
  );
}

function ChatBubble({
  children,
  isUser = false,
}: {
  children: React.ReactNode;
  isUser?: boolean;
}) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
          isUser
            ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white rounded-br-md'
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-md'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
