import { prisma } from "./prismaService.js";

export async function getStores(userId: number, role: string) {
    if (role === "SUPER_ADMIN") {
    return prisma.store.findMany({
      include: {
        storeAdmin: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

if (role === "STORE_ADMIN") {
    return prisma.store.findMany({
      where: {
        storeAdminId: userId,
      },
      include: {
        storeAdmin: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return [];
}

export async function createStore(data: {
  name: string;
  address?: string;
  city?: string;
  latitude: number;
  longitude: number;
}) {
  return prisma.store.create({
    data: {
      name: data.name,
      address: data.address ?? null,
      city: data.city ?? null,
      latitude: data.latitude,
      longitude: data.longitude,
    },
  });
}

export async function updateStore(
  id: number,
  data: {
    name?: string;
    address?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  }
) {
  return prisma.store.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteStore(id: number) {
  return prisma.store.delete({
    where: { id },
  });
}

export async function registerMyStore(
  userId: number,
  data: {
    name: string;
    address?: string;
    city?: string;
    latitude: number;
    longitude: number;
  }
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      managedStores: true,
    },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  if (!user.isVerified) {
    throw new Error("Silakan verifikasi email terlebih dahulu");
  }

  if (user.role === "SUPER_ADMIN") {
    throw new Error("Super Admin tidak perlu register store");
  }

  // if (user.role === "STORE_ADMIN" || user.managedStores.length > 0) {
  //   throw new Error("User sudah memiliki store");
  // }

if (user.managedStores.length > 0) {
  throw new Error("User sudah memiliki store");
}

  if (user.role !== "CUSTOMER" && user.role !== "STORE_ADMIN") {
  throw new Error("Role tidak bisa membuat store");
}

  const store = await prisma.store.create({
    data: {
      name: data.name,
      address: data.address ?? null,
      city: data.city ?? null,
      latitude: data.latitude,
      longitude: data.longitude,
      storeAdminId: userId,
    },
  });

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: "STORE_ADMIN",
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      profilePicture: true,
      isVerified: true,
      role: true,
    },
  });

  return {
    message: "Store berhasil dibuat. Akun kamu sekarang menjadi Store Admin.",
    store,
    user: updatedUser,
  };
}

export async function assignStoreAdmin(storeId: number, userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  if (user.role !== "STORE_ADMIN") {
    throw new Error("User harus memiliki role STORE_ADMIN");
  }

  return prisma.store.update({
    where: { id: storeId },
    data: {
      storeAdminId: userId,
    },
    include: {
      storeAdmin: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}