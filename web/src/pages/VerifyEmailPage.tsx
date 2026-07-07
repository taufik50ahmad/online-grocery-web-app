import { useState, type FormEvent } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { verifyEmail } from "../services/authService";
import axios from "axios";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !password) {
      alert("Token dan password wajib diisi");
      return;
    }

    if (password.length < 8) {
      alert("Password minimal 8 karakter");
      return;
    }

    setLoading(true);

    try {
      const result = await verifyEmail(token, password);
      alert(result.message || "Email berhasil diverifikasi. Silakan login.");
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Gagal verifikasi email");
      } else {
        alert("Gagal verifikasi email");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto my-6 max-w-md rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Verifikasi Email</h2>

      <p className="mb-4 text-sm text-slate-600">
        Silakan masukkan password baru untuk menyelesaikan verifikasi email
        Anda.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="hidden"
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />

        <label className="mb-1 block text-sm font-medium text-slate-700">
          Token
        </label>
        <input
          type="text"
          placeholder="Verification token"
          className="mb-3 w-full rounded border px-3 py-2"
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />

        <label className="mb-1 block text-sm font-medium text-slate-700">
          Password Baru (min. 8 karakter)
        </label>
        <input
          type="password"
          placeholder="Set password"
          className="mb-4 w-full rounded border px-3 py-2"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Verifikasi Email"}
        </button>
      </form>

      <Link
        to="/login"
        className="mt-3 block text-center text-sm text-green-700"
      >
        Kembali ke Login
      </Link>
    </section>
  );
}