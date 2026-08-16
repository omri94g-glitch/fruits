import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { session: null, response: new Response("Unauthorized", { status: 401 }) };
  }
  return { session, response: null };
}
