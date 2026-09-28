import jwt from "jsonwebtoken";

export type TokenPayload = {
  id: string;
  email: string;
  provider: "CREDENTIALS" | "GOOGLE";
  iat: number;
};

export default function tokenParser(token: string): TokenPayload {
  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    throw new Error("JWT secret is not configured");
  }

  const payload = jwt.verify(token, secretKey);

  if (typeof payload === "string") {
    throw new Error("Invalid token payload");
  }

  return payload as TokenPayload;
}
