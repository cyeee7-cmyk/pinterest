import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

async function publishPinToPinterest(pin: any, user: any) {
  if (!user.pinterestToken) {
    throw new Error("无效的Pinterest token");
  }

  const response = await axios.post(
    "https://api.pinterest.com/v1/pins/",
    {
      board: "test/test",
      note: pin.title,
      description: pin.description,
      image_url: pin.imageUrl,
    },
    {
      params: { access_token: user.pinterestToken },
    }
  );

  return response.data.url;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const userId = Buffer.from(token, "base64").toString().split(":")[0];
    const { pinId } = await req.json();

    const pin = await prisma.pin.findUnique({
      where: { id: pinId },
      include: { user: true },
    });

    if (!pin) {
      return NextResponse.json({ error: "Pin不存在" }, { status: 404 });
    }

    if (pin.userId !== userId) {
      return NextResponse.json({ error: "权限不足" }, { status: 403 });
    }

    // 发布到Pinterest
    const pinUrl = await publishPinToPinterest(pin, pin.user);

    // 更新Pin状态
    const updated = await prisma.pin.update({
      where: { id: pinId },
      data: {
        status: "published",
        publishedAt: new Date(),
        pinUrl,
      },
    });

    return NextResponse.json({ success: true, pin: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "发布失败" },
      { status: 500 }
    );
  }
}
