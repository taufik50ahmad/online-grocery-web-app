import { prisma } from "./prismaService.js";

export async function getStores() {
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