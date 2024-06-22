import type { NextApiRequest, NextApiResponse } from "next";
import getMailTemplate from "../../../server/getMailTemplate";
import requestMailAuth from "../../../server/requestMailAuth";
import validatePostRequest from "../../../server/validatePostRequest";
import { MailDto } from "../../../types/db";

export default async function sendMailHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const SMTP_URL = process.env.NEXT_PUBLIC_SMTP_URL;
  const reqBody: MailDto = req.body;
  validatePostRequest(reqBody, req, res);

  const template = !!reqBody?.template
    ? await getMailTemplate(reqBody?.template)
    : undefined;
  const auth = await requestMailAuth();

  let headers: any = {};
  headers["Content-Type"] = "application/json";
  headers["Authorization"] = `Bearer ${auth?.access_token}`;

  let email: any = {
    email: {
      subject: reqBody.subject,
      template: {
        id: template?.real_id,
        variables: {
          ...reqBody?.variables,
          current_year: new Date().getFullYear(),
        },
      },
      from: {
        name: "Sim from nanosmoothies",
        email: "sim@nanosmoothies.com",
      },
      to: reqBody.to,
    },
  };

  if (!reqBody.template)
    email = {
      email: {
        subject: reqBody.subject,
        from: {
          name: "Sim from nanosmoothies",
          email: "sim@nanosmoothies.com",
        },
        to: reqBody.to,
        text: reqBody?.text,
      },
    };

  console.log(email);

  const resp = await fetch(`${SMTP_URL}/smtp/emails`, {
    headers,
    method: "POST",
    body: JSON.stringify(email),
  });

  const responseData = await resp.text();
  console.log(responseData); // Log the response to see its content

  const data = JSON.parse(responseData);
  res.send(data);
}
