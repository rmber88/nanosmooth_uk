import toast from "react-hot-toast";

export default function handleError(error: unknown) {
  toast.error(`An error occurred - ${error}`);
  console.log({ error });
}
