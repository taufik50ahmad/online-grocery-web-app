import type { Request, Response, NextFunction } from "express";
import { prisma } from "../service/prismaService.js";
import bcrypt from "bcryptjs";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
    isVerified: boolean;
  };
}

// GET /api/users - semua user
export const getAllUsers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/admins - hanya store admin
export const getStoreAdmins = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "STORE_ADMIN" },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: admins });
  } catch (error) {
    next(error);
  }
};

// POST /api/users/admins - buat store admin baru
export const createStoreAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, name, password, phone } = req.body;

    if (!email || !name || !password) {
      res.status(400).json({ message: "Email, name, password wajib diisi" });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ message: "Email sudah terdaftar" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        phone: phone || null,
        role: "STORE_ADMIN",
        isVerified: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    res
      .status(201)
      .json({ message: "Store Admin berhasil dibuat", data: admin });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/admins/:id - update store admin
export const updateStoreAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { name, phone, password } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ message: "ID tidak valid" });
      return;
    }

    const existing = await prisma.user.findFirst({
      where: { id, role: "STORE_ADMIN" },
    });

    if (!existing) {
      res.status(404).json({ message: "Store Admin tidak ditemukan" });
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isVerified: true,
        updatedAt: true,
      },
    });

    res.json({ message: "Store Admin berhasil diupdate", data: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/admins/:id - hapus store admin
export const deleteStoreAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "ID tidak valid" });
      return;
    }

    const existing = await prisma.user.findFirst({
      where: { id, role: "STORE_ADMIN" },
    });

    if (!existing) {
      res.status(404).json({ message: "Store Admin tidak ditemukan" });
      return;
    }

    await prisma.user.delete({ where: { id } });

    res.json({ message: "Store Admin berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};
