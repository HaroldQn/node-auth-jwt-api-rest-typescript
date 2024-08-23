import { Request, Response } from "express";
import { comparePasswords, hashPassword } from "../services/password.service";
import prisma from "../models/user";
import { generateToken } from "../services/auth.service";
import { Console, error } from "console";

// SE TIENEN DE TYPAR
export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email) {
      res.status(400).json({ message: "El Email es requerido" });
      return;
    }
    if (!password) {
      res.status(400).json({ message: "La contraseña es requerida" });
      return;
    }
    const hashedPassword = await hashPassword(password);
    console.log(hashedPassword);

    const user = await prisma.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user);

    res.status(201).json({ token });
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(400).json({ message: "El Email ya existe" });
    }
    console.log(error);
    res.status(500).json({ error: "Hubo un error en el registro" });
  }
};
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email) {
      res.status(400).json({ message: "El Email es requerido" });
      return;
    }
    if (!password) {
      res.status(400).json({ message: "La contraseña es requerida" });
      return;
    }

    const user = await prisma.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ error: "Usuario no encontrado" });
      return;
    }

    const passwordMatch = await comparePasswords(password, user.password); // Comparador de contraseñas
    if (!passwordMatch) {
      res.status(402).json({ error: "Usuario o contraseña incorrecta" });
    }

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error: any) {
    console.log(error);
  }
};
