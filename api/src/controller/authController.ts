import type { Request, Response } from "express";
import {
  getProfile,
  loginUser,
  registerUser,
  registerStoreAdmin,
  requestResetPassword,
  resetPassword,
  updateProfile as updateUserProfileService,
  verifyEmailAndSetPassword,
  verifyJwtToken,
  resendVerificationEmail as resendVerificationEmailService,
  loginWithGoogle as loginWithGoogleService,
} from "../service/authService.js";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string()
  .min(1, "email is required")
  .email("email invalid adress"),
  name: z.string().min(2).max(100).optional(),
});

const loginSchema = z.object({
  email: z.string().
  min(1, "email is required")
  .email("email invalid adress"),
  password: z.
  string()
  .min(1, "password must be at least 6 characters")
  .min(8, "must be at least 8 characters"),
});

const verifyEmailSchema = z.object({
  token: z.string()
  .min(1, "Token is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

const forgotPasswordSchema = z.object({
  email: z.string()
  .min(1, "Email is needed")
  .email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

const resendVerificationSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

const googleLoginSchema = z.object({
  idToken: z.string().min(1, "Google token is required"),
});

//----------------------------------------//

function getTokenFromHeader(req: Request) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return null;
  }

  return authorization.replace("Bearer ", "");
}

export async function googleLogin(req: Request, res: Response) {
  try {
    const validation = googleLoginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.issues[0]?.message || "Invalid request",
      });
    }

    const result = await loginWithGoogleService(validation.data.idToken);

    return res.json({
      message: "Google login berhasil",
      ...result,
    });
  } catch (error) {
    return res.status(401).json({
      message:
        error instanceof Error ? error.message : "Gagal login dengan Google",
    });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const validation = registerSchema.safeParse(req.body);

if (!validation.success) {
  return res.status(400).json({
    message: validation.error.issues[0]?.message || "Invalid request",
  });
}

const { email, name } = validation.data;

    const result = await registerUser(email, name);

    return res.status(201).json({
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
    const validation = verifyEmailSchema.safeParse(req.body);

if (!validation.success) {
  return res.status(400).json({
    message: validation.error.issues[0]?.message || "Invalid request",
  });
}

const { token, password } = validation.data;

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
    const validation = loginSchema.safeParse(req.body);

if (!validation.success) {
  return res.status(400).json({
    message: validation.error.issues[0]?.message || "Invalid request",
  });
}

const { email, password } = validation.data;

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

export async function resendVerificationEmail(req: Request, res: Response) {
  try {
    const validation = resendVerificationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.issues[0]?.message || "Invalid request",
      });
    }

    const { email } = validation.data;

    const result = await resendVerificationEmailService(email);

    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Gagal mengirim ulang verification email",
    });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const validation = forgotPasswordSchema.safeParse(req.body);

if (!validation.success) {
  return res.status(400).json({
    message: validation.error.issues[0]?.message || "Invalid request",
  });
}

const { email } = validation.data;

    const result = await requestResetPassword(email);

    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Gagal request reset password",
    });
  }
}

export async function confirmResetPassword(req: Request, res: Response) {
  try {
    const validation = resetPasswordSchema.safeParse(req.body);

if (!validation.success) {
  return res.status(400).json({
    message: validation.error.issues[0]?.message || "Invalid request",
  });
}

const { token, password } = validation.data;

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

type AuthenticatedRequest = Request & {
  user?: {
    id: number;
    role: string;
    isVerified: boolean;
  };
};

export async function registerAsStoreAdmin(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Silakan login terlebih dahulu",
      });
    }

    const result = await registerStoreAdmin(req.user.id);

    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Gagal register sebagai Store Admin",
    });
  }}