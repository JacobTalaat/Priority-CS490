import { NextResponse } from "next/server";
import { getUserFromRequest, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized();
  }
  return NextResponse.json({ id: user.id, email: user.email });
}
