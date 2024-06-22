import { NextApiRequest, NextApiResponse } from "next";
import requestMailAuth from "../../../server/requestMailAuth";

export default async function mailingListsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const SMTP_URL = process.env.NEXT_PUBLIC_SMTP_URL;
  const auth = await requestMailAuth();

  let headers: any = {};
  headers["Content-Type"] = "application/json";
  headers["Authorization"] = `Bearer ${auth?.access_token}`;

  const resp = await fetch(`${SMTP_URL}/addressbooks`, {
    method: "GET",
    headers,
  });

  const data = await resp.json();

  res.send(data);
}
