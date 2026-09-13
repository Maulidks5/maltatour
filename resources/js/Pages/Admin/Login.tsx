import { FormEvent } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";

export default function AdminLogin() {
  const { flash } = usePage<{ flash: { error: string | null } }>().props;
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    post("/admin/login");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[var(--sand)]/50 px-4 py-12">
      <Head title="Admin login" />
      <section className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)] sm:p-9">
        <a href="/" className="mx-auto block w-fit">
          <img src="/brand/malta-logo.webp" alt="Malta Tours and Safari" className="h-28 w-auto" />
        </a>
        <h1 className="mt-4 text-center font-display text-3xl font-bold">Admin login</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Manage tours, prices, media and bookings.</p>

        {flash.error && (
          <div role="alert" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            {flash.error}
          </div>
        )}

        <form onSubmit={submit} className="mt-8 grid gap-5">
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider">Email</span>
            <input
              type="email"
              value={data.email}
              onChange={(event) => setData("email", event.target.value)}
              autoComplete="email"
              required
              className="rounded-xl border border-input bg-background px-4 py-3 outline-none focus:border-[var(--turquoise)]"
            />
            {errors.email && <span className="text-xs text-red-600">{errors.email}</span>}
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider">Password</span>
            <input
              type="password"
              value={data.password}
              onChange={(event) => setData("password", event.target.value)}
              autoComplete="current-password"
              required
              className="rounded-xl border border-input bg-background px-4 py-3 outline-none focus:border-[var(--turquoise)]"
            />
            {errors.password && <span className="text-xs text-red-600">{errors.password}</span>}
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={data.remember} onChange={(event) => setData("remember", event.target.checked)} />
            Keep me signed in
          </label>
          <button disabled={processing} className="rounded-full bg-[var(--ocean)] px-5 py-3 font-bold text-white disabled:opacity-60">
            {processing ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </section>
    </div>
  );
}
