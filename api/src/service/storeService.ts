import { prisma } from "./prismaService.js";

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

export async function getStores() {
  return prisma.store.findMany({
    include: {
      users: {
        select: { id: true, email: true, name: true, role: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createStore(data: CreateStoreInput) {
  return prisma.store.create({ data });
}

export async function updateStore(id: number, data: UpdateStoreInput) {
  return prisma.store.update({ where: { id }, data });
}

export async function deleteStore(id: number) {
  return prisma.store.delete({ where: { id } });
}

export async function registerMyStore(userId: number, data: CreateStoreInput) {
  const store = await prisma.store.create({ data });

  await prisma.user.update({
    where: { id: userId },
    data: { role: "STORE_ADMIN", storeId: store.id },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, storeId: true },
  });

  return {
    message: "Store berhasil dibuat dan role diubah menjadi STORE_ADMIN",
    store,
    user,
  };
}

export async function assignStoreAdmin(storeId: number, userId: number) {
  await prisma.user.update({
    where: { id: userId },
    data: { role: "STORE_ADMIN", storeId },
  });

  return prisma.store.findUnique({
    where: { id: storeId },
    include: {
      users: {
        select: { id: true, email: true, name: true, role: true },
      },
    },
  });
}
