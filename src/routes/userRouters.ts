import { error } from "console";
import express, { NextFunction, Request, Response } from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/userController";

// Middlewarer de JWT para ver si estamos autenticados
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Error en la autenticación", err);
      return res.status(403).json({ error: "No tiene accesp a este recurso" });
    }

    next();
  });
};

router.post("/", authenticateToken, createUser);
router.get("/", authenticateToken, getAllUsers);
router.get("/:id", authenticateToken, getUserById);
router.put("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);

export default router;
