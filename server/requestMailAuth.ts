// Requesting SMTP Provider Authorization

export default async function requestMailAuth() {
  const SMTP_URL = process.env.NEXT_PUBLIC_SMTP_URL;

  let headers: any = {};
  let body = JSON.stringify({
    grant_type: "client_credentials",
    client_id: process.env.NEXT_PUBLIC_SMTP_ID,
    client_secret: process.env.NEXT_PUBLIC_SMTP_SECRET,
  });

  headers["Content-Type"] = "application/json";
  headers["Content-Length"] = Buffer.byteLength(body);

  const res = await fetch(`${SMTP_URL}/oauth/access_token`, {
    method: "POST",
    body,
    headers,
  });

  const data = await res.json();
  return data;
}
