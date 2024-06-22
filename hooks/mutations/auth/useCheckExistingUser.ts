import { useMutation } from "@tanstack/react-query";

type dto = {
  email: string;
};

export default function useCheckExistingUser() {
  return useMutation(async ({ email }: dto) => {
    //query the users collection for a document that the email corresponds

    return {};
  });
}
