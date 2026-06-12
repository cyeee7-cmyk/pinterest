import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        `/dashboard?error=Pinterest授权被拒绝`
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: "缺少授权码" },
        { status: 400 }
      );
    }

    // 验证state
    const cookieState = req.cookies.get("pinterest_state")?.value;
    if (state !== cookieState) {
      return NextResponse.json(
        { error: "State验证失败" },
        { status: 401 }
      );
    }

    // 获取token
    const tokenResponse = await axios.post(
      "https://api.pinterest.com/v1/oauth/token",
      {
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.PINTEREST_REDIRECT_URI,
      },
      {
        auth: {
          username: process.env.PINTEREST_APP_ID || "",
          password: process.env.PINTEREST_APP_SECRET || "",
        },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;

    // 获取用户信息
    const userResponse = await axios.get(
      "https://api.pinterest.com/v1/me/",
      {
        params: { access_token },
      }
    );

    const userId = userResponse.data.id;

    // 从token获取user id (简单实现)
    const userToken = req.cookies.get("user_token")?.value;
    if (!userToken) {
      return NextResponse.redirect("/auth");
    }

    const dbUserId = Buffer.from(userToken, "base64")
      .toString()
      .split(":")[0];

    // 更新数据库
    await prisma.user.update({
      where: { id: dbUserId },
      data: {
        pinterestConnected: true,
        pinterestToken: access_token,
        pinterestRefreshToken: refresh_token,
        pinterestUserId: userId,
      },
    });

    const response = NextResponse.redirect("/dashboard?success=Pinterest连接成功");
    response.cookies.delete("pinterest_state");
    return response;
  } catch (error: any) {
    console.error("Pinterest OAuth error:", error);
    return NextResponse.redirect(
      `/dashboard?error=${error.message || "Pinterest连接失败"}`
    );
  }
}
