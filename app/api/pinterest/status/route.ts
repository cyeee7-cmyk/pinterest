import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const userId = Buffer.from(token, "base64").toString().split(":")[0];
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      connected: user.pinterestConnected,
      pinterestUserId: user.pinterestUserId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "获取状态失败" },
      { status: 500 }
    );
  }
}
