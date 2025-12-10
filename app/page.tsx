import Link from "next/link";
import { BirthdayList } from "./components/BirthdayList";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <main className="flex flex-1 flex-col items-center p-8">
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Welcome back!
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Here are the upcoming birthdays to celebrate.
            </p>
          </div>

          <div className="flex flex-col justify-center sm:justify-start gap-4">
            <BirthdayList />
            <div className="flex justify-center sm:justify-start">
              <Button asChild variant="outline">
                <Link href="/calendar">View All</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
