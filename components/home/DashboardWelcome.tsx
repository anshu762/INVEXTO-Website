import type { User } from "@/src/types";

export function DashboardWelcome({ user }: { user: User }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Welcome back, {user.name}
      </h1>
      <p className="max-w-md text-muted-foreground">
        Head over to{" "}
        <a
          href="/stocks"
          className="text-amber-400 underline underline-offset-2"
        >
          Stocks
        </a>{" "}
        to start trading or check your{" "}
        <a
          href="/portfolio"
          className="text-amber-400 underline underline-offset-2"
        >
          Portfolio
        </a>
        .
      </p>
    </main>
  );
}
