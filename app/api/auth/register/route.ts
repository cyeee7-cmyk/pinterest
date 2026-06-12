import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { error: "用户已存在" },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hash, name },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    return NextResponse.json(
      { error: "注册失败" },
      { status: 500 }
    );
  }
}
