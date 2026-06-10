import type { Request, Response } from "express";
import {
  getProfile,
  loginUser,
  registerUser,
  requestResetPassword,
  resetPassword,
  updateProfile as updateUserProfileService,
  verifyEmailAndSetPassword,
  verifyJwtToken,
} from "../service/authService.js";

function getTokenFromHeader(req: Request) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return null;
  }

  return authorization.replace("Bearer ", "");
}

export async function register(req: Request, res: Response) {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email wajib diisi",
      });
    }

    const result = await registerUser(email, name);

    return res.status(201).json({
      message: "Registrasi berhasil. Silakan verifikasi email.",
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Gagal register",
    });
  }
}

export async function verifyEmail(req: Request, res: Response) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Token dan password wajib diisi",
      });
    }

    const result = await verifyEmailAndSetPassword(token, password);

    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Gagal verifikasi email",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    const result = await loginUser(email, password);

    return res.json({
      message: "Login berhasil",
      ...result,
    });
  } catch (error) {
    return res.status(401).json({
      message: error instanceof Error ? error.message : "Gagal login",
    });
  }
}

export async function me(req: Request, res: Response) {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({
        message: "Token tidak ditemukan",
      });
    }

    const decoded = verifyJwtToken(token);
    const user = await getProfile(decoded.id);

    return res.json({
      user,
    });
  } catch (error) {
    console.error("ME ERROR:", error);

    return res.status(401).json({
      message: "Token tidak valid",
      error: error instanceof Error ? error.message : error,
    });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email wajib diisi",
      });
    }

    const result = await requestResetPassword(email);

    return res.json({
      message: "Reset password link berhasil dibuat.",
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Gagal request reset password",
    });
  }
}

export async function confirmResetPassword(req: Request, res: Response) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Token dan password wajib diisi",
      });
    }

    const result = await resetPassword(token, password);

    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Gagal reset password",
    });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({
        message: "Token tidak ditemukan",
      });
    }

    const decoded = verifyJwtToken(token);

    const user = await updateUserProfileService(decoded.id, {
      name: req.body.name,
      phone: req.body.phone,
      profilePicture: req.body.profilePicture,
    });

    return res.json({
      message: "Profile berhasil diperbarui",
      user,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return res.status(500).json({
      message: "Gagal update profile",
      error: error instanceof Error ? error.message : error,
    });
  }
}
