import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

type dto = {
  customerId: string;
  subscriptionId: string;
};

export default function useCancelSubscription() {
  return useMutation(async (dto: dto) => {
    const res = await axios.post(`/api/subscription/cancel`, dto);

    return res.data;
  });
}
