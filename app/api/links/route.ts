import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function isValidCode(code: unknown) {
  return typeof code === "string" && /^[A-Za-z0-9]{6,8}$/.test(code);
}

function generateCode(length = 6) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

// GET → List all short links
export async function GET() {
  const links = await prisma.link.findMany();
  return NextResponse.json(links);
}

// POST → Create new short link
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = typeof body.url === "string" ? body.url.trim() : "";
    const code = body.code ? String(body.code).trim() : undefined;

    if (!url)
      return NextResponse.json({ error: "URL is required" }, { status: 400 });

    // Validate URL
    try {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Validate custom code
    if (code && !isValidCode(code)) {
      return NextResponse.json(
        { error: "Code must be 6–8 alphanumeric characters" },
        { status: 400 }
      );
    }

    // Check uniqueness if custom code provided
    if (code) {
      const existing = await prisma.link.findUnique({ where: { code } });
      if (existing)
        return NextResponse.json({ error: "Code already exists" }, { status: 409 });
    }

    // Generate unique code
    let shortCode = code;
    if (!shortCode) {
      for (let i = 0; i < 6; i++) {
        const candidate = generateCode(6);
        const exists = await prisma.link.findUnique({
          where: { code: candidate },
        });
        if (!exists) {
          shortCode = candidate;
          break;
        }
      }
      if (!shortCode)
        return NextResponse.json(
          { error: "Failed to generate unique code" },
          { status: 500 }
        );
    }

    const created = await prisma.link.create({
      data: { code: shortCode, url },
    });

    return NextResponse.json(created);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
