import jwt from "jsonwebtoken";

export default function generateToken({
  id,
  email,
  provider,
}: {
  id: string;
  email: string;
  provider: "CREDENTIALS" | "GOOGLE";
}) {
  const secretKey = process.env.JWT_SECRET;
  if (secretKey) {
    let data = { id: id, email: email, provider: provider };
    const token = jwt.sign(data, secretKey);
    return token;
  }
  throw Error("Env file Not found");
}
