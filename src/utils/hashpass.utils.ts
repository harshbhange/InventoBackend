import bcrypt from "bcrypt";
export async function hashPassword(password: string) {
  const hashPassword = await bcrypt.hash(password, 9);
  return hashPassword;
}
export async function comparePassword({
  password,
  hashPass,
}: {
  password: string;
  hashPass: string;
}) {
  const hashPassword = await bcrypt.compare(password, hashPass);
  return hashPassword;
}
