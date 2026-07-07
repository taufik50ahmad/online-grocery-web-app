import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "./prismaService.js";
import { OAuth2Client } from "google-auth-library";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "./emailService.js";

function createRandomToken() {
  return crypto.randomBytes(32).toString("hex");
}

function createJwtToken(user: { id: number; email: string; role: string }) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
    },
  );
}

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function registerUser(email: string, name?: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email sudah terdaftar");
  }

  const temporaryPassword = crypto.randomUUID();
  const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name: name ?? null,
      password: hashedPassword,
      isVerified: false,
    },
  });

  const verificationToken = createRandomToken();

  await prisma.userToken.create({
    data: {
      userId: user.id,
      token: verificationToken,
      type: "EMAIL_VERIFICATION",
      expiredAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  await sendVerificationEmail(user.email, verificationToken);


  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isVerified: user.isVerified,
      role: user.role,
    },
    message: "Registrasi berhasil. silahkan cek email untuk verifikasi.",
    verificationLink: `http://localhost:5173/verify-email?token=${verificationToken}`,
  };
}

//store admin diluar user
export async function registerStoreAdmin(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  if (!user.isVerified) {
    throw new Error("Silakan verifikasi email terlebih dahulu");
  }

  if (user.role === "STORE_ADMIN") {
    throw new Error("User sudah terdaftar sebagai Store Admin");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
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
    message: "Berhasil register sebagai Store Admin",
    user: updatedUser,
  };
}

export async function verifyEmailAndSetPassword(
  token: string,
  password: string,
) {
  const userToken = await prisma.userToken.findUnique({
    where: { token },
    include: {
      user: true,
    },
  });

  if (!userToken) {
    throw new Error("Token tidak valid");
  }

  if (userToken.type !== "EMAIL_VERIFICATION") {
    throw new Error("Tipe token tidak valid");
  }

  if (userToken.expiredAt < new Date()) {
    throw new Error("Token sudah expired");
  }

  if (userToken.user.isVerified) {
    throw new Error("Email sudah diverifikasi");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: userToken.userId },
    data: {
      password: hashedPassword,
      isVerified: true,
    },
  });

  await prisma.userToken.delete({
    where: { id: userToken.id },
  });

  return {
    message: "Verifikasi berhasil. Silakan login.",
  };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Email atau password salah");
  }

  if (!user.isVerified) {
    throw new Error("Akun belum terverifikasi");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Email atau password salah");
  }

const token = createJwtToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
    },
  };
}

export async function loginWithGoogle(idToken: string) {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error("Google token tidak valid");
  }

  if (!payload.email) {
    throw new Error("Email Google tidak ditemukan");
  }

  if (!payload.email_verified) {
    throw new Error("Email Google belum terverifikasi");
  }

  let user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    const temporaryPassword = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    user = await prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name ?? null,
        password: hashedPassword,
        isVerified: true,
        profilePicture: payload.picture ?? null,
        role: "CUSTOMER",
      },
    });
  } else {
    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
        name: user.name || payload.name || null,
        profilePicture: user.profilePicture || payload.picture || null,
      },
    });
  }

  const token = createJwtToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      profilePicture: user.profilePicture,
      role: user.role,
      isVerified: user.isVerified,
    },
  };
}

export async function getProfile(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      profilePicture: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  return user;
}


export async function requestResetPassword(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  await prisma.userToken.deleteMany({
    where: {
      userId: user.id,
      type: "PASSWORD_RESET",
    },
  });

  const resetToken = createRandomToken();

  await prisma.userToken.create({
    data: {
      userId: user.id,
      token: resetToken,
      type: "PASSWORD_RESET",
      expiredAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  await sendResetPasswordEmail(user.email, resetToken);

  return {
    message: "Reset password email berhasil dikirim.",
    resetLink: `http://localhost:5173/confirm-reset-password?token=${resetToken}`,
  };
}

export async function resetPassword(token: string, password: string) {
  const userToken = await prisma.userToken.findUnique({
    where: { token },
    include: {
      user: true,
    },
  });

  if (!userToken) {
    throw new Error("Token tidak valid");
  }

  if (userToken.type !== "PASSWORD_RESET") {
    throw new Error("Tipe token tidak valid");
  }

  if (userToken.expiredAt < new Date()) {
    throw new Error("Token sudah expired");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: userToken.userId },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.userToken.delete({
    where: { id: userToken.id },
  });

  return {
    message: "Password berhasil direset. Silakan login.",
  };
}

export async function updateProfile(
  userId: number,
  data: {
    name?: string;
    phone?: string;
    profilePicture?: string;
  },
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      profilePicture: true,
      role: true,
      isVerified: true,
    },
  });

  return user;
}

export async function resendVerificationEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  if (user.isVerified) {
    throw new Error("Email sudah terverifikasi");
  }

  await prisma.userToken.deleteMany({
    where: {
      userId: user.id,
      type: "EMAIL_VERIFICATION",
    },
  });

const token = createRandomToken();

  await prisma.userToken.create({
    data: {
      userId: user.id,
      token,
      type: "EMAIL_VERIFICATION",
      expiredAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  await sendVerificationEmail(user.email, token);

  return {
    message: "Verification email berhasil dikirim ulang.",
    verificationToken: token,
  };
}

export function verifyJwtToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET as string) as {
    id: number;
    email: string;
    role: string;
  };
}