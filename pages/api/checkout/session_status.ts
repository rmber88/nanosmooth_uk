import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { firebaseDb } from "../../../firebase/config";
import {
  MailDto,
  orderData,
  orderDto,
  RoyalMailDto,
  subscriptionData,
  subscriptionDto,
  userData,
} from "../../../types/db";
import axios from "axios";
import getRoyalMailConfig from "../../../server/getRoyalMailConfig";
import * as Sentry from "@sentry/nextjs";

const sk = process.env.NEXT_PUBLIC_STRIPE_SK!;
const stripe = new Stripe(sk);

const baseUrl = process.env.NEXT_PUBLIC_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sessionId = req.query?.session_id?.toString();
  const userId = req.query?.uid?.toString();
  const orderId = req.query?.order_id?.toString();

  if (!sessionId) {
    return res.status(400).json({
      statusCode: 400,
      message: "Missing session Id",
    });
  }

  if (!userId) {
    return res.status(400).json({
      statusCode: 400,
      message: "Missing user id",
    });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const isPaymentSuccessful = session.status === "complete";

  // check for if it's subscritption or order
  if (!orderId && isPaymentSuccessful) {
    try {
      // Update subscription
      const subscriptionDto: subscriptionDto = {
        isActive: true,
        stripeId: session.subscription?.toString()!,
      };

      const subsRef = doc(firebaseDb, "subscriptions", userId);
      const resp = await setDoc(subsRef, subscriptionDto, {
        merge: true,
      });

      // Get subscription details
      const subscriptionResp = await getDoc(subsRef);
      const subscriptionData = {
        id: subscriptionResp.id,
        ...subscriptionResp.data(),
      } as subscriptionData;

      // Get user details
      const userRef = doc(firebaseDb, "users", userId);
      const userResp = await getDoc(userRef);
      const userData = { id: userResp.id, ...userResp.data() } as userData;

      // Send them email
      const emailData: MailDto = {
        subject: "Subscription confirmed",
        template: "Order Success",
        to: [
          {
            name: userData?.name ?? userData?.billingAddress?.name,
            email: userData?.email! ?? userData?.billingAddress?.email,
          },
        ],
        firstName: userData?.name ?? userData?.billingAddress?.name,
        variables: {
          name: userData?.name ?? userData?.billingAddress?.name,
          ORDER_ID: userId,
          ORDER_ITEMS: `Nanosmoothies x ${subscriptionData?.quantity} - monthly`,
          USER_ADRESS: userData?.shippingAddress?.street ?? "Address",
          USER_CITY: userData?.shippingAddress?.town ?? "City",
          USER_COUNTRY: userData?.shippingAddress?.country ?? "Country",
          date: new Date().toDateString(),
        },
      };

      const emailRes = await axios.post(`${baseUrl}/api/mail/send`, emailData);

      // Create royal mail order
      const royalInfo = {
        email: userData?.email! ?? userData?.billingAddress?.email,
        name: userData?.name ?? userData?.billingAddress?.name,
        orderId: subscriptionData?.id!,
        packages: [
          {
            name: "Smoothies",
            quantity: subscriptionData?.quantity! / 14,
            value: 23,
          },
        ],
        subtotal: 23 * (subscriptionData?.quantity / 14 ?? 1),
        total: 23 * (subscriptionData?.quantity / 14 ?? 1),
      };
      const orderReference = royalInfo.orderId;
      const orderData = {
        fullName: royalInfo.name,
        addressLine1: (userData?.shippingAddress ?? userData?.billingAddress)
          .street,
        addressLine2: "",
        city: (userData?.shippingAddress ?? userData?.billingAddress).town,
        postalCode: (userData?.shippingAddress ?? userData?.billingAddress)
          .postcode,
        emailAddress: (userData?.shippingAddress ?? userData?.billingAddress)
          .email,
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

      const rmRes = await axios.post(`${rmConfig.url}/orders`, rmData, {
        headers: rmConfig.headers,
      });

      const returnedData = {
        emailSent: emailRes.data,
        subscriptionUpdate: resp,
        royalmailOrder: rmRes.data,
        status: session.status,
        payment_status: session.payment_status,
        customer_email: session?.customer_details?.email,
        subscriptionId: session?.subscription,
      };

      console.log({ returnedData });

      res.status(200).json(returnedData);
    } catch (error) {
      console.error("Error fetching subscription data:", error);
      Sentry.captureException(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  if (!!orderId && isPaymentSuccessful) {
    try {
      // update order
      const orderDto: orderDto = {
        status: "confirmed",
      };

      const orderRef = doc(firebaseDb, "orders", orderId);
      const resp = await updateDoc(orderRef, orderDto);

      // get order details
      const orderResp = await getDoc(orderRef);
      const orderData = {
        id: orderResp.id,
        ...orderResp.data(),
      } as orderData;

      // get user details
      const userRef = doc(firebaseDb, "users", userId);
      const userResp = await getDoc(userRef);
      const userData = { id: userResp.id, ...userResp.data() } as userData;

      // send mail concerning order
      const emailData: MailDto = {
        subject: "Order confirmed",
        template: "Order Success",
        to: [
          {
            name: userData?.name ?? userData?.billingAddress.name,
            email: userData?.email! ?? userData?.billingAddress.email,
          },
        ],
        firstName: userData?.name,
        variables: {
          name: userData?.name ?? userData?.billingAddress.name,
          ORDER_ID: orderId,
          ORDER_ITEMS: orderData?.items
            .map(
              (item, idx) =>
                `${item.name}x${item.quantity}${
                  idx === (orderData?.items.length ?? 0) - 1 ? "" : " ,"
                }`
            )
            .toString(),
          USER_ADRESS:
            (userData?.shippingAddress ?? userData?.billingAddress)?.street ??
            "Address",
          USER_CITY:
            (userData?.shippingAddress ?? userData?.billingAddress)?.town ??
            "City",
          USER_COUNTRY:
            (userData?.shippingAddress ?? userData?.billingAddress)?.country ??
            "Country",
          date: new Date().toDateString(),
        },
      };

      const emailRes = await axios.post(`${baseUrl}/api/mail/send`, emailData);

      const royalInfo = {
        email: userData?.email ?? userData?.billingAddress.email,
        name: userData?.name! ?? userData?.billingAddress.name,
        orderId: orderId,
        packages: orderData?.items.map((item) => {
          return {
            name: item.name,
            quantity: item.quantity,
            value: 9,
          };
        }),
        subtotal: 9 * (orderData?.items.length ?? 1),
        total: 9 * (orderData?.items.length ?? 1),
      };
      const orderReference = royalInfo.orderId;
      const royalOrderData = {
        fullName: royalInfo.name,
        addressLine1: (userData?.shippingAddress ?? userData?.billingAddress)
          .street,
        addressLine2: "",
        city: (userData?.shippingAddress ?? userData?.billingAddress).town,
        postalCode: (userData?.shippingAddress ?? userData?.billingAddress)
          .postcode,
        emailAddress: (userData?.shippingAddress ?? userData?.billingAddress)
          .email,
        orderDate: new Date().toISOString(),
        subtotal: royalInfo.subtotal,
        total: royalInfo.total,
      };

      const recipient: any = {
        address: {
          fullName: royalOrderData.fullName,
          addressLine1: royalOrderData.addressLine1 ?? "",
          addressLine2: royalOrderData.addressLine2,
          city: royalOrderData.city ?? "",
          postcode: royalOrderData.postalCode ?? "",
          countryCode: "UK",
        },
        emailAddress: royalOrderData.emailAddress ?? "",
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
            orderDate: royalOrderData.orderDate,
            subtotal: royalOrderData.subtotal,
            shippingCostCharged: 1.54,
            total: royalOrderData.total,
            currencyCode: "GBP",
            label: {
              includeLabelInResponse: true,
              includeCN: true,
              includeReturnsLabel: true,
            },
          },
        ],
      };

      const rmRes = await axios.post(`${rmConfig.url}/orders`, rmData, {
        headers: rmConfig.headers,
      });

      const responseData = {
        emailSent: emailRes.data,
        orderUpdate: resp,
        royalmailOrder: rmRes.data,
        status: session.status,
        payment_status: session.payment_status,
        customer_email: session?.customer_details?.email,
      };

      res.status(200).json(responseData);

      // create royalmail order
    } catch (error) {
      Sentry.captureException(error);
      console.error("Error fetching subscription data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
