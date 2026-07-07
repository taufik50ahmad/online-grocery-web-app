import type { NextFunction, Request, Response } from "express";
import { verifyJwtToken } from "../service/authService.js";
import { prisma } from "../service/prismaService.js";

type AuthenticatedRequest = Request & {
  user?: {
    id: number;
    role: string;
    isVerified: boolean;
  };
};

function getTokenFromHeader(req: Request) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return null;
  }

  return authorization.replace("Bearer ", "");
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({
        message: "Silakan login terlebih dahulu",
      });
    }

    const decoded = verifyJwtToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        role: true,
        isVerified: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "User tidak ditemukan",
      });
    }

    req.user = user;

    next();
  } catch {
    return res.status(401).json({
      message: "Token tidak valid",
    });
  }
}

export function requireVerified(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.user?.isVerified) {
    return res.status(403).json({
      message:
        "Akun belum terverifikasi. Silakan verifikasi email terlebih dahulu.",
    });
  }

  next();
}

export function requireRole(allowedRoles: string[]) {
  return function (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.user) {
      return res.status(401).json({
        message: "Silakan login terlebih dahulu",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Anda tidak memiliki akses ke fitur ini",
      });
    }

    next();
  };
}
