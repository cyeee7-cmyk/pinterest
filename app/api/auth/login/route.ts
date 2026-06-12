import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "密码错误" },
        { status: 401 }
      );
    }

    // 生成简单token (实际应用使用JWT)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");

    return NextResponse.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "登录失败" },
      { status: 500 }
    );
  }
}
