import { useState } from "react";
import { loginUser } from "../services/authService";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const result = await loginUser(email, password);

      localStorage.setItem("token", result.token);

      alert("Login berhasil");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Login gagal");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto my-6 max-w-md rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Login</h2>

      <input
        type="email"
        placeholder="Email"
        className="mb-3 w-full rounded border px-3 py-2"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="mb-4 w-full rounded border px-3 py-2"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button type="submit" className="w-full rounded bg-green-600 px-4 py-2 text-white">
        Login
      </button>
    </form>
  );
}
