import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.user.update({
          where: { stripeCustomerId: subscription.customer as string },
          data: {
            subscriptionStatus: subscription.status === "active" ? "active" : "canceled",
            stripeSubscriptionId: subscription.id,
            subscriptionEndDate: new Date(subscription.current_period_end * 1000),
          },
        });
        break;

      case "customer.subscription.deleted":
        const deletedSub = event.data.object as Stripe.Subscription;
        await prisma.user.update({
          where: { stripeCustomerId: deletedSub.customer as string },
          data: {
            subscriptionStatus: "canceled",
          },
        });
        break;

      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Payment succeeded for ${invoice.customer}`);
        break;

      case "invoice.payment_failed":
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log(`Payment failed for ${failedInvoice.customer}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
