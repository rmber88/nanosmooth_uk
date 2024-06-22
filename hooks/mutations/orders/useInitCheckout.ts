import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

type dto = {
  products: {
    name: string;
    priceInCents: number;
    currency?: "gbp" | "usd" | "eur" | string;
  }[];
  customerEmail: string;
  orderId?: string;
  subscriptionId?: string;
  userId: string;
};

export default function useInitCheckout(body: dto, isSubscription?: boolean) {
  const route = isSubscription ? "/api/checkout/subscribe" : "/api/checkout";
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch(route, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log({ data });
        return data?.clientSecret;
      });
  }, [body, route]);

  return { fetchClientSecret };
}
