import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { schedulePinPublish } from "@/lib/queue";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const userId = Buffer.from(token, "base64").toString().split(":")[0];
    const { title, description, imageUrl, scheduledAt } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.pinterestConnected) {
      return NextResponse.json(
        { error: "需要Pinterest授权" },
        { status: 400 }
      );
    }

    // 创建Pin记录
    const pin = await prisma.pin.create({
      data: {
        userId,
        title,
        description: description || "",
        imageUrl,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: scheduledAt ? "scheduled" : "draft",
      },
    });

    // 如果有定时时间，添加到队列
    if (scheduledAt) {
      try {
        await schedulePinPublish(pin.id, new Date(scheduledAt));
      } catch (error: any) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true, pin });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "创建失败" },
      { status: 500 }
    );
  }
}
