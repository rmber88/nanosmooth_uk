import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { MailDto } from "../../../types/db";

export default function useSendMail() {
  return useMutation(async (data: MailDto) => {
    console.log("sending mail");

    const res = await axios.post(`/api/mail/send`, data);

    return res.data;
  });
}
