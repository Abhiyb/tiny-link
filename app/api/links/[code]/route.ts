import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET → Get one link details
export async function GET(
  req: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params;

  const link = await prisma.link.findUnique({ where: { code } });

  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(link);
}

// DELETE → Delete link
export async function DELETE(
  req: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params;

  try {
    await prisma.link.delete({ where: { code } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
