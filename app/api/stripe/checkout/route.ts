import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(req: NextRequest) {
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

    let stripeCustomerId = user.stripeCustomerId;

    // 创建或获取Stripe Customer
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId },
      });
      stripeCustomerId = customer.id;
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId },
      });
    }

    // 创建Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=subscription`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: error.message || "创建支付会话失败" },
      { status: 500 }
    );
  }
}
