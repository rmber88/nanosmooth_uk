export default function getRoyalMailConfig() {
  const url = "https://api.parcel.royalmail.com/api/v1";

  const headers = {
    Authorization: "Bearer df5f2215-9fee-40cd-bed8-709aa9a0174b",
    "Content-Type": "application/json",
  };

  return { url, headers };
}
