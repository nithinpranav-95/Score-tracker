import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Gamepad2, LogIn, Mail, Plus, User, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createTroop, enterTroop, spiritAnimals, useAuth, signOut } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Enter Your Troop — Troop Connect" },
      {
        name: "description",
        content: "Enter your troop name and trooper name, or create a new troop on Troop Connect.",
      },
      { property: "og:title", content: "Enter Your Troop — Troop Connect" },
      {
        property: "og:description",
        content: "Enter your troop name and trooper name, or create a new troop on Troop Connect.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const inputCls =
  "h-12 w-full rounded-xl border border-border bg-secondary/80 px-4 text-sm font-semibold outline-none transition focus:border-primary focus:ring-1 focus:ring-primary";
const labelCls = "block text-xs font-bold uppercase tracking-wider text-muted-foreground";

export function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [mode, setMode] = useState<"enter" | "create">(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "create") return "create";
    }
    return "enter";
  });
  const [troop, setTroop] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [animal, setAnimal] = useState("lion");
  const [troopers, setTroopers] = useState<string[]>(["", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function switchMode(m: "enter" | "create") {
    setMode(m);
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      const { user: u } =
        mode === "enter"
          ? await enterTroop({ troop, name })
          : await createTroop({ troop, name, email, spirit_animal: animal, troopers });
      setSuccess(`Welcome, ${u.name}! Entering ${u.troop}...`);
      setTimeout(() => navigate({ to: "/" }), 600);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-between bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <img
          src="/squad-bg.jpg"
          alt=""
          className="size-full object-cover object-top opacity-30 filter saturate-75 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
      </div>

      <header className="relative z-20 border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center px-4 py-4 md:px-7">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-md">
              🎲
            </span>
            <span className="font-heading text-xl font-bold tracking-tight">Troop Connect</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          {user && mode !== "create" ? (
            <div className="space-y-6 text-center">
              <div className="mx-auto grid size-20 place-items-center rounded-3xl border border-primary/30 bg-primary/20 text-4xl">
                {spiritAnimals[user.spirit_animal]?.emoji || "🦊"}
              </div>
              <div>
                <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
                  {user.troop ?? "Troop"}
                </span>
                <h1 className="mt-2 font-heading text-3xl font-bold">{user.name}</h1>
              </div>
              <div className="flex flex-col gap-3">
                <Button onClick={() => navigate({ to: "/" })} className="h-12 rounded-xl font-bold">
                  <Gamepad2 className="mr-2 size-4" /> Go to Game Board
                </Button>
                <Button
                  onClick={() => switchMode("create")}
                  variant="outline"
                  className="h-12 rounded-xl font-bold"
                >
                  <Users className="mr-2 size-4" /> Create a New Troop
                </Button>
                <Button
                  onClick={() => signOut()}
                  variant="ghost"
                  className="h-11 rounded-xl text-xs"
                >
                  Leave / Switch Trooper
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex rounded-2xl border border-border/80 bg-secondary/60 p-1.5">
                {(
                  [
                    ["enter", "Enter Troop", LogIn],
                    ["create", "Create Troop", Users],
                  ] as const
                ).map(([m, label, Icon]) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                      mode === m
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 text-center">
                <h1 className="font-heading text-2xl font-bold sm:text-3xl">
                  {mode === "enter" ? "Enter your troop" : "Start a new troop"}
                </h1>
                <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                  {mode === "enter"
                    ? "Type your troop name and trooper name to get in"
                    : "Name your troop and add your friends as troopers"}
                </p>
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-destructive/50 bg-destructive/10 p-3.5 text-xs font-semibold text-destructive">
                  ⚠️ {error}
                </div>
              )}
              {success && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-primary/50 bg-primary/10 p-3.5 text-xs font-semibold text-primary">
                  <Check className="size-4" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="auth-troop" className={labelCls}>
                    Troop Name
                  </label>
                  <input
                    id="auth-troop"
                    required
                    value={troop}
                    onChange={(e) => setTroop(e.target.value)}
                    placeholder="e.g. Connect with pani poori"
                    className={`mt-1.5 ${inputCls}`}
                  />
                </div>
                <div>
                  <label htmlFor="auth-name" className={labelCls}>
                    {mode === "enter" ? "Trooper Name" : "Your Trooper Name"}
                  </label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="auth-name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Nithin"
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>

                {mode === "create" && (
                  <>
                    <div>
                      <label htmlFor="auth-email" className={labelCls}>
                        Email Address
                      </label>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="auth-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. nithin@example.com"
                          className={`${inputCls} pl-10`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Your Spirit Animal</label>
                      <div className="mt-2 grid max-h-36 grid-cols-6 gap-2 overflow-y-auto rounded-xl border border-border/70 bg-secondary/40 p-2">
                        {Object.entries(spiritAnimals).map(([key, info]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setAnimal(key)}
                            title={info.title}
                            className={`rounded-xl p-2 text-2xl transition ${
                              animal === key ? "bg-primary scale-105" : "bg-card hover:bg-secondary"
                            }`}
                          >
                            {info.emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className={labelCls}>Other Troopers</label>
                      {troopers.map((t, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            aria-label={`Trooper ${i + 1}`}
                            value={t}
                            onChange={(e) =>
                              setTroopers((prev) =>
                                prev.map((x, j) => (j === i ? e.target.value : x)),
                              )
                            }
                            placeholder={`Trooper ${i + 1}`}
                            className={inputCls}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Remove trooper ${i + 1}`}
                            onClick={() => setTroopers((prev) => prev.filter((_, j) => j !== i))}
                            className="h-12 w-12 shrink-0"
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setTroopers((prev) => [...prev, ""])}
                        className="h-11 w-full rounded-xl border-dashed"
                      >
                        <Plus className="mr-2 size-4" /> Add trooper
                      </Button>
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 h-12 w-full rounded-xl font-bold"
                >
                  {isSubmitting
                    ? "Please wait..."
                    : mode === "enter"
                      ? "Enter Troop"
                      : "Create Troop & Enter"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 py-4 text-center text-xs text-muted-foreground">
        Troop Connect · Live scoring and glory for your troop
      </footer>
    </div>
  );
}
