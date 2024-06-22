import { NextApiRequest, NextApiResponse } from "next";

export default function validatePostRequest(
  body: any,
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!body || req.method !== "POST") {
    res?.send({
      error: "404",
      message: "Invalid Request",
    });
    return;
  }
}
