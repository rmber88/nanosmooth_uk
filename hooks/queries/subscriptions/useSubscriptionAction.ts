import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type dto = {
  action: "pause" | "resume";
  users: { userId: string; stripeId: string }[];
};

export default function useSubscriptionAction() {
  return useMutation(async ({ action, users }: dto) => {
    const res = await axios.post(`/api/admin/${action}`, { users });
    return res.data;
  });
}
