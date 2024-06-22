import { NextApiRequest, NextApiResponse } from "next";
import { subscriptionDto } from "../../../types/db";
import Stripe from "stripe";
import { doc, setDoc } from "firebase/firestore";
import { firebaseDb } from "../../../firebase/config";

const sk = process.env.NEXT_PUBLIC_STRIPE_SK!;
const stripe = new Stripe(sk);

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { users }: { users: { userId: string; stripeId: string }[] } =
        req.body;

      if (!users) {
        return res.status(400).json({
          statusCode: 400,
          message: "Missing users",
        });
      }

      const pauseSubscriptions = users?.map((user) => {
        const subscriptionId = user?.stripeId;
        const userId = user?.userId;

        const subsDto: subscriptionDto = {
          stripePaused: false,
        };

        const subsRef = doc(firebaseDb, "subscriptions", userId);

        return new Promise(async (res, rej) => {
          try {
            // resume their stripe subscriptions
            const stripeRes = await stripe.subscriptions.update(
              subscriptionId,
              {
                pause_collection: "",
              }
            );

            // update their firebase document
            const firebaseRes = await setDoc(subsRef, subsDto, {
              merge: true,
            });

            res({ stripeRes, firebaseRes });
          } catch (error) {
            rej(error);
          }
        });
      });

      const response = await Promise.all(pauseSubscriptions);

      res.status(200).json(response);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ statusCode: 500, message: error });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
