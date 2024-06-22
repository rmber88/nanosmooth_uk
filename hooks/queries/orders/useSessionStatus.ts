import { useQuery } from "@tanstack/react-query";
import queryKeys from "../../../constants/querykeys";
import axios from "axios";

type DTO = {
  sessionId?: string;
  userId?: string;
  orderId?: string;
};

export default function useSessionStatus({ sessionId, orderId, userId }: DTO) {
  const appendedString = `${userId ? `&uid=${userId}` : ""}${
    orderId ? `&order_id=${orderId}` : ""
  }`;

  return useQuery(
    [queryKeys.session, sessionId],
    async () => {
      const res = await axios.get(
        `/api/checkout/session_status?session_id=${sessionId}${appendedString}`
      );

      return res.data as {
        customer_email: string;
        payment_status: "paid" | string;
        status: "complete" | "open";
      };
    },
    {
      enabled: !!sessionId,
    }
  );
}
