import { AuthSection } from "../components/AuthSection";

export function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-red-600 text-2xl font-bold text-white">
            F
          </div>

          <h1 className="text-2xl font-black text-red-600">Finpro</h1>
          <p className="text-sm text-slate-500">
            Login or register to continue
          </p>
        </div>

        <AuthSection />
      </div>
    </main>
  );
}
