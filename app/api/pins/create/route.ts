import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const userId = Buffer.from(token, "base64").toString().split(":")[0];
    const { title, description, imageUrl } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.pinterestToken) {
      return NextResponse.json(
        { error: "需要Pinterest授权" },
        { status: 400 }
      );
    }

    // 调用Pinterest API发布Pin
    const response = await axios.post(
      "https://api.pinterest.com/v1/pins/",
      {
        board: "test/board",
        note: title,
        description,
        image_url: imageUrl,
      },
      {
        params: { access_token: user.pinterestToken },
      }
    );

    // 保存到数据库
    const pin = await prisma.pin.create({
      data: {
        userId,
        title,
        description: description || "",
        imageUrl,
        pinUrl: response.data.url,
      },
    });

    return NextResponse.json({ success: true, pin });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "发布失败" },
      { status: 500 }
    );
  }
}
