import requestMailAuth from "./requestMailAuth";

export default async function getMailTemplate(search: string) {
  const SMTP_URL = process.env.NEXT_PUBLIC_SMTP_URL;
  const auth = await requestMailAuth();

  //   Getting all templates
  let headers: any = {};
  headers["Content-Type"] = "application/json";
  headers["Authorization"] = `Bearer ${auth?.access_token}`;

  const res = await fetch(`${SMTP_URL}/templates/?owner=me`, {
    headers,
  });
  const data = await res.json();

  if (!data) {
    return { status: "error", message: "Unable to reach the server" };
  }

  //   Finding the searched templates
  const result = data?.find((res: any) => res?.name === search);
  if (!result) return { status: "error", message: "No results found" };
  return result;
}
