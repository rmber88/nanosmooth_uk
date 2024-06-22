import Cors from "micro-cors";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import {
  RoyalMailDto,
  subscriptionData,
  subscriptionDto,
  userData,
} from "../../../types/db";
import getThirtyDaysFromToday from "../../../utils/getThirtyDaysFromToday";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firebaseDb } from "../../../firebase/config";
import axios from "axios";
import getRoyalMailConfig from "../../../server/getRoyalMailConfig";

const sk = process.env.NEXT_PUBLIC_STRIPE_SK!;
const stripe = new Stripe(sk);

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const endpointSecret =
  "whsec_83de3f1fdf50bac2b70d3b7e8d1ad909167f767baf07ae9771a5efe5ff3153f8";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = headers().get("stripe-signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, {
      status: 400,
    });
  }

  switch (event.type) {
    case "checkout.session.async_payment_failed":
      const checkoutSessionAsyncPaymentFailed = event.data.object;
      // Maybe send an email tha payment has failed
      break;
    case "checkout.session.async_payment_succeeded":
      const checkoutSessionAsyncPaymentSucceeded = event.data.object;
      // Payment is succsssful

      break;
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object;
      const stripeId = checkoutSessionCompleted.subscription?.toString();

      //Get the corresponding user
      const subsQuery = query(
        collection(firebaseDb, "subscriptions"),
        where("stripeId", "==", stripeId)
      );
      const subsSnapshot = await getDocs(subsQuery);
      const userSubDoc = subsSnapshot.docs?.map((d) => {
        return { id: d.id, ...d.data() };
      })[0] as DocumentData & subscriptionData;

      const userRef = doc(firebaseDb, "users", userSubDoc.userId);
      const userRes = await getDoc(userRef);
      const userDoc = { id: userRes.id, ...userRes.data() } as userData;

      // Update the firebase document
      const dto: subscriptionDto = {
        isActive: true,
        endDate: getThirtyDaysFromToday().toISOString(),
      };

      const subsRef = doc(firebaseDb, "subscriptions", userSubDoc.userId);
      const updateSub = await setDoc(subsRef, dto);

      console.log(updateSub);

      // Create a royalmail order
      const royalInfo = {
        email: userDoc?.email!,
        name: userDoc?.name!,
        orderId: userSubDoc?.id!,
        packages: [
          {
            name: "Smoothies",
            quantity: userSubDoc?.quantity!,
            value: 23,
          },
        ],
        subtotal: 23 * (userSubDoc?.quantity ?? 1),
        total: 23 * (userSubDoc?.quantity ?? 1),
      };
      const orderReference = royalInfo.orderId;
      const orderData = {
        fullName: royalInfo.name,
        addressLine1: userDoc?.shippingAddress.street,
        addressLine2: "",
        city: userDoc?.shippingAddress.town,
        postalCode: userDoc?.shippingAddress.postcode,
        emailAddress: userDoc?.shippingAddress.email,
        orderDate: new Date().toISOString(),
        subtotal: royalInfo.subtotal,
        total: royalInfo.total,
      };

      const recipient: any = {
        address: {
          fullName: orderData.fullName,
          addressLine1: orderData.addressLine1 ?? "",
          addressLine2: orderData.addressLine2,
          city: orderData.city ?? "",
          postcode: orderData.postalCode ?? "",
          countryCode: "UK",
        },
        emailAddress: orderData.emailAddress ?? "",
      };

      const rmConfig = getRoyalMailConfig();
      const rmData: RoyalMailDto = {
        items: [
          {
            orderReference,
            recipient: recipient,
            sender: {
              tradingName: "NANOSMOOTHIES LTD",
              phoneNumber: "+44 7359 012117",
              emailAddress: "simfxuk@yahoo.co.uk",
            },
            billing: recipient,
            packages: [
              {
                weightInGrams: 350,
                packageFormatIdentifier: "largeLetter",
                contents: royalInfo.packages.map((item) => {
                  return {
                    name: `Nano - ${item.name}`,
                    UnitValue: item.value,
                    UnitWeightInGrams: 350,
                    quantity: item.quantity,
                  };
                }),
              },
            ],
            orderDate: orderData.orderDate,
            subtotal: orderData.subtotal,
            shippingCostCharged: 1.54,
            total: orderData.total,
            currencyCode: "GBP",
            label: {
              includeLabelInResponse: true,
              includeCN: true,
              includeReturnsLabel: true,
            },
          },
        ],
      };

      const res = await axios.post(`${rmConfig.url}/orders`, rmData, {
        headers: rmConfig.headers,
      });

      console.log(res.data);

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return new Response("RESPONSE EXECUTE", {
    status: 200,
  });
}
