import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const sk = process.env.NEXT_PUBLIC_STRIPE_SK!;
import * as Sentry from "@sentry/nextjs";
const stripe = new Stripe(sk);

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { products, customerEmail, subscriptionId, userId } = req.body; // Destructure products from request body

      if (!userId) {
        return res.status(400).json({
          statusCode: 400,
          message: "Missing user id",
        });
      }

      if (!subscriptionId) {
        return res.status(400).json({
          statusCode: 400,
          message: "Missing subscription id",
        });
      }

      if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          statusCode: 400,
          message: "Missing or invalid product data",
        });
      }

      if (!customerEmail) {
        return res.status(400).json({
          statusCode: 400,
          message: "Missing customer email",
        });
      }

      const session = await stripe.checkout.sessions.create({
        customer_email: customerEmail,
        line_items: products.map((product) => ({
          price_data: {
            currency: product.currency || "usd", // Set default currency if not provided
            product_data: {
              name: product.name,
            },
            unit_amount: Math.floor(product.priceInCents), // Assuming price is provided in cents
            recurring: {
              interval: "month",
              interval_count: 1,
            },
          },
          quantity: product.quantity || 1, // Set default quantity if not provided
        })),
        mode: "subscription",
        ui_mode: "embedded",
        return_url: `${process.env.NEXT_PUBLIC_URL}/membership?session_id={CHECKOUT_SESSION_ID}&subscription_id=${subscriptionId}&uid=${userId}`,
      });

      console.log({ clientSecret: session.client_secret });

      // update user subscription
      // send a sendpulse  email

      res.status(200).json({ clientSecret: session.client_secret });
    } catch (error) {
      console.log({ error });
      Sentry.captureException(error);
      res.status(500).json({ statusCode: 500, message: error });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
