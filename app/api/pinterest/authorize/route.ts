import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const appId = process.env.PINTEREST_APP_ID;
    const redirectUri = process.env.PINTEREST_REDIRECT_URI;
    const state = Buffer.from(Date.now().toString()).toString("base64");

    // 保存state到cookie以验证回调
    const response = NextResponse.redirect(
      `https://api.pinterest.com/v1/oauth/?client_id=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=read_public,write_public&state=${state}`
    );

    response.cookies.set("pinterest_state", state, { maxAge: 600 });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "初始化Pinterest授权失败" },
      { status: 500 }
    );
  }
}
