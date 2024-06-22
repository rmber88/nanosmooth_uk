import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { subscriptionDto } from "../../../types/db";
import { doc, setDoc } from "firebase/firestore";
import { firebaseDb } from "../../../firebase/config";

const sk = process.env.NEXT_PUBLIC_STRIPE_SK!;
const stripe = new Stripe(sk);
type ResponseData = {
  message: string;
  statusCode?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { customerId, subscriptionId } = req.body;

      if (!customerId || !subscriptionId) {
        return res.status(400).json({
          statusCode: 400,
          message: "Missing customer ID or subscription ID",
        });
      }

      // Cancel the subscription in Stripe
      const deletedSubscription = await stripe.subscriptions.cancel(
        subscriptionId
      );

      if (deletedSubscription.status !== "canceled") {
        throw new Error("Failed to cancel the subscription in Stripe");
      }

      // Update the subscription in firebase
      const subscriptionDto: subscriptionDto = {
        isActive: false,
      };

      const subsRef = doc(firebaseDb, "subscriptions", customerId);
      const resp = await setDoc(subsRef, subscriptionDto, {
        merge: true,
      });

      // Send the user an email with sendpulse about the cancellation

      res
        .status(200)
        .json({ message: "Subscription canceled successfully", resp });
    } catch (error) {
      console.log({ error });
      res.status(500).json({ statusCode: 500, message: error });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
