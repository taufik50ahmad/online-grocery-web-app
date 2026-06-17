import type { Request, Response } from "express";
import { z } from "zod";
import {
  assignStoreAdmin,
  createStore,
  deleteStore,
  getStores,
  registerMyStore,
  updateStore,
} from "../service/storeService.js";

const storeSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
});

const updateStoreSchema = storeSchema.partial();

const assignStoreAdminSchema = z.object({
  userId: z.number(),
});

export async function getStoreList(req: Request, res: Response) {
  try {
    const stores = await getStores();

    return res.json({
      stores,
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Gagal mengambil toko",
    });
  }
}

export async function createStoreData(req: Request, res: Response) {
  try {
    const validation = storeSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.issues[0]?.message || "Invalid request",
      });
    }

    const store = await createStore(validation.data);

    return res.status(201).json({
      message: "Store berhasil dibuat",
      store,
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Gagal membuat toko",
    });
  }
}

export async function updateStoreData(req: Request, res: Response) {
  try {
    const storeId = Number(req.params.id);

    const validation = updateStoreSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.issues[0]?.message || "Invalid request",
      });
    }

    const store = await updateStore(storeId, validation.data);

    return res.json({
      message: "Store berhasil diperbarui",
      store,
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Gagal update toko",
    });
  }
}

export async function registerMyStoreData(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Silakan login terlebih dahulu",
      });
    }

    const validation = storeSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.issues[0]?.message || "Invalid request",
      });
    }

    const result = await registerMyStore(req.user.id, validation.data);

    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Gagal register store",
    });
  }
}

export async function deleteStoreData(req: Request, res: Response) {
  try {
    const storeId = Number(req.params.id);

    await deleteStore(storeId);

    return res.json({
      message: "Store berhasil dihapus",
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Gagal hapus toko",
    });
  }
}

export async function assignAdminToStore(req: Request, res: Response) {
  try {
    const storeId = Number(req.params.id);

    const validation = assignStoreAdminSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.issues[0]?.message || "Invalid request",
      });
    }

    const store = await assignStoreAdmin(storeId, validation.data.userId);

    return res.json({
      message: "Store admin berhasil di-assign ke toko",
      store,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Gagal assign store admin",
    });
  }
}

type CreateStoreInput = {
  name: string;
  address?: string;
  city?: string;
  latitude: number;
  longitude: number;
};

type UpdateStoreInput = {
  name?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
};

type AuthenticatedRequest = Request & {
  user?: {
    id: number;
    role: string;
    isVerified: boolean;
  };
};

