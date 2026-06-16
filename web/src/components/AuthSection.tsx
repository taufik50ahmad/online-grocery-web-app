import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import {
  getProfile,
  loginUser,
  registerUser,
  registerStoreAdmin,
  updateProfile,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
} from "../services/authService";
import { StoreManagement } from "./storeManagement";

type User = {
  id: number;
  email: string;
  name?: string;
  phone?: string;
  profilePicture?: string;
  isVerified: boolean;
  role: "USER" | "CUSTOMER" | "STORE_ADMIN" | "SUPER_ADMIN" | "ADMIN";
};

export function AuthSection() {
  const [user, setUser] = useState<User | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const [mode, setMode] = useState<"login" | "register" | "verify" | "forgot" | "reset">("login");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function loadProfile() {
    try {
      const result = await getProfile();
      setUser(result.user);
      setName(result.user?.name || "");
      setPhone(result.user?.phone || "");
      setProfilePicture(result.user?.profilePicture || "");
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      loadProfile();
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (mode === "register") {
    const result = await registerUser(name, email);
    alert(result.message || "Register berhasil. Silakan verifikasi e mail.");
      setMode("verify");
      return;
  }

      const result = await loginUser(email, password);

      localStorage.setItem("token", result.token);
      alert("Login berhasil");

      await loadProfile();
    } 
    catch (error) {
  if (axios.isAxiosError(error)) {
    alert(error.response?.data?.message || "Terjadi kesalahan");
    return;
  }

  alert("Terjadi kesalahan");
}
  }

async function handleResendVerificationEmail() {
  try {
    if (!email) {
      alert("Masukkan email terlebih dahulu");
      return;
    }

    const result = await resendVerificationEmail(email);

    console.log("RESEND VERIFICATION RESULT:", result);

    alert(result.message || "Verification email berhasil dikirim ulang.");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      alert(error.response?.data?.message || "Gagal resend verification email");
      return;
    }

    alert("Gagal resend verification email");
  }
}

  async function handleUpdateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const result = await updateProfile({
        name,
        phone,
        profilePicture,
      });

      alert(result.message || "Profile berhasil diperbarui");
      setUser(result.user);
    } 
    catch (error) {
  if (axios.isAxiosError(error)) {
    alert(error.response?.data?.message || "Gagal update profile");
    return;
  }

  alert("Gagal update profile");
}
  }

  async function handleRegisterStoreAdmin() {
  try {
    const result = await registerStoreAdmin();

    alert(result.message || "Berhasil register sebagai Store Admin");
    setUser(result.user);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      alert(error.response?.data?.message || "Gagal register Store Admin");
      return;
    }

    alert("Gagal register Store Admin");
  }
}

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    setEmail("");
    setPassword("");
  }

  async function handleVerifyEmail(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  try {
    
    const result = await verifyEmail(token, newPassword);

    alert(result.message || "Email berhasil diverifikasi. Silakan login.");
    setMode("login");
    setToken("");
    setNewPassword("");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      alert(error.response?.data?.message || "Gagal verifikasi email");
      return;
    }

    alert("Gagal verifikasi email");
  }
}

async function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  try {
    const result = await forgotPassword(email);

    alert(result.message || "Link reset password berhasil dikirim.");
    setMode("reset");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      alert(error.response?.data?.message || "Gagal request reset password");
      return;
    }

    alert("Gagal request reset password");
  }
}

async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  try {
    const result = await resetPassword(token, newPassword);

    alert(result.message || "Password berhasil direset. Silakan login.");
    setMode("login");
    setToken("");
    setNewPassword("");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      alert(error.response?.data?.message || "Gagal reset password");
      return;
    }

    alert("Gagal reset password");
  }
}

  if (user) {
    return (
      <section className="mx-auto my-6 max-w-md rounded-xl bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <div>
          <h2 className="text-xl font-semibold">Profile</h2>

          <p className="text-sm text-slate-500">{user.email}</p>

          <p className="text-sm text-slate-500">
            Role: {user.role}
            </p>

           <p className="text-sm text-slate-500">
            Status: {user.isVerified ? "Verified" : "Not Verified"}
          </p>
        </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded bg-red-500 px-3 py-1 text-sm text-white"
          >
            Logout
          </button>
        </div>

{user.role === "CUSTOMER" && (
  <button
    type="button"
    onClick={handleRegisterStoreAdmin}
    className="mb-4 w-full rounded bg-blue-600 px-4 py-2 text-white"
  >
    Register as Store Admin
  </button>
)}

        <form onSubmit={handleUpdateProfile}>
          <input
            type="text"
            placeholder="Name"
            className="mb-3 w-full rounded border px-3 py-2"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <input
            type="text"
            placeholder="Phone"
            className="mb-3 w-full rounded border px-3 py-2"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />

          <input
            type="text"
            placeholder="Profile picture URL"
            className="mb-4 w-full rounded border px-3 py-2"
            value={profilePicture}
            onChange={(event) => setProfilePicture(event.target.value)}
          />

          <button
            type="submit"
            className="w-full rounded bg-green-600 px-4 py-2 text-white"
          >
            Update Profile
          </button>
        </form>
        {user.role === "SUPER_ADMIN" && <StoreManagement />}
      </section>
    );
  }

  if (mode === "verify") {
  return (
    <section className="mx-auto my-6 max-w-md rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Verify Email</h2>

      <form onSubmit={handleVerifyEmail}>
        <input
  type="email"
  placeholder="Email"
  className="mb-3 w-full rounded border px-3 py-2"
  value={email}
  onChange={(event) => setEmail(event.target.value)}
/>
        
        <input
          type="text"
          placeholder="Verification token"
          className="mb-3 w-full rounded border px-3 py-2"
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />

        <input
          type="password"
          placeholder="Set password"
          className="mb-4 w-full rounded border px-3 py-2"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />

        <button
          type="submit"
          className="w-full rounded bg-green-600 px-4 py-2 text-white"
        >
          Verify Email
        </button>

        <button
  type="button"
  onClick={handleResendVerificationEmail}
  className="mt-3 w-full rounded bg-slate-600 px-4 py-2 text-white"
>
  Resend Verification Email
</button>
      </form>

      <button
        type="button"
        onClick={() => setMode("login")}
        className="mt-3 text-sm text-green-700"
      >
        Back to Login
      </button>
    </section>
  );
}

if (mode === "forgot") {
  return (
    <section className="mx-auto my-6 max-w-md rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Forgot Password</h2>

      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full rounded border px-3 py-2"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <button
          type="submit"
          className="w-full rounded bg-green-600 px-4 py-2 text-white"
        >
          Send Reset Link
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode("login")}
        className="mt-3 text-sm text-green-700"
      >
        Back to Login
      </button>
    </section>
  );
}

if (mode === "reset") {
  return (
    <section className="mx-auto my-6 max-w-md rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Reset Password</h2>

      <form onSubmit={handleResetPassword}>
        <input
          type="text"
          placeholder="Reset token"
          className="mb-3 w-full rounded border px-3 py-2"
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />

        <input
          type="password"
          placeholder="New password"
          className="mb-4 w-full rounded border px-3 py-2"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />

        <button
          type="submit"
          className="w-full rounded bg-green-600 px-4 py-2 text-white"
        >
          Reset Password
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode("login")}
        className="mt-3 text-sm text-green-700"
      >
        Back to Login
      </button>
    </section>
  );
}

  return (
    <section className="mx-auto my-6 max-w-md rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">
        {mode === "register" ? "Register" : "Login"}
      </h2>

      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <input
            type="text"
            placeholder="Name"
            className="mb-3 w-full rounded border px-3 py-2"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="mb-3 w-full rounded border px-3 py-2"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        {mode === "login" && (
          <input
            type="password"
            placeholder="Password"
            className="mb-4 w-full rounded border px-3 py-2"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        )}

        <button
          type="submit"
          className="w-full rounded bg-green-600 px-4 py-2 text-white"
        >
          {mode === "register" ? "Register" : "Login"}
        </button>
      </form>

      <button
  type="button"
  onClick={() => setMode(mode === "register" ? "login" : "register")}
  className="mt-3 text-sm text-green-700"
>
  {mode === "register" ? "Sudah punya akun? Login" : "Belum punya akun? Register"}
</button>

<button
  type="button"
  onClick={() => setMode("verify")}
  className="mt-3 block text-sm text-green-700"
>
  Verify email
</button>

<button
  type="button"
  onClick={() => setMode("forgot")}
  className="mt-2 block text-sm text-green-700"
>
  Forgot password?
</button>
    </section>
  );
}