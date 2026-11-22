import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getCollections, toObjectId, sanitizeUser } from "./db";

const JWT_SECRET =
  process.env.JWT_SECRET || "pizzahub_jwt_secret_key_2026_cat009_secure";

export function signToken(user) {
  return jwt.sign(
    {
      uid: user.uid || (user._id ? user._id.toString() : user.id),
      email: user.email.toLowerCase().trim(),
      role: user.role || "customer",
      name: user.name || "",
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

export async function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

export async function getUserFromRequest(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) return null;

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
      return null;
    }

    const token = parts[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.uid) return null;

    const { usersCollection } = await getCollections();
    const objectId = toObjectId(decoded.uid);
    if (!objectId) return null;

    const userDoc = await usersCollection.findOne({ _id: objectId });
    if (!userDoc || userDoc.isBlocked) return null;

    return sanitizeUser(userDoc);
  } catch (err) {
    return null;
  }
}
