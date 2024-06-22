import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type Data = {
  status: number;
  result?: any;
  error?: string;
};

export default function usePostcode() {
  return useMutation(async (postcode: string) => {
    const res = await axios.get(
      `https://api.postcodes.io/postcodes/${postcode}`
    );

    return res.data as Data;
  });
}
