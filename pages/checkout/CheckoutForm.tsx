import tw from "twin.macro";
import { FormEvent, useCallback, useEffect } from "react";
import Typography from "../../components/typography";
import FormInput from "../../components/FormInput";
import stripe from "../../public/icons/stripe.svg";
import ActionButton from "../../components/buttons/ActionButton";
import { useRouter } from "next/router";
import SubmitButton from "../../components/buttons/SubmitButton";
import useCurrentUserDb from "../../hooks/queries/auth/useCurrentUserDb";
import useForm from "../../hooks/custom/useForm";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import useCreateOrder from "../../hooks/mutations/orders/useCreateOrder";
import handleError from "../../utils/handleError";
import { useUpdateUserDb } from "../../hooks/mutations/auth/useUpdateUserDb";


const initialState = {
  name: "",
  street: "",
  apartment: "",
  town: "",
  country: "",
  postcode: "",
  email: "",
};

export default function CheckoutForm() {
  const router = useRouter();

  const currentUserDb = useCurrentUserDb();
  const updateUserDb = useUpdateUserDb();
  const shippingInfo = currentUserDb.data?.shippingAddress;
  const createOrder = useCreateOrder();
  const { formData, updateForm } = useForm({ initialState });

  const { cartItems, totalPrice } = useCart();

  const isLoading =
    createOrder.isLoading || currentUserDb.isLoading || updateUserDb.isLoading;

  useEffect(() => {
    if (!cartItems.length) {
      router.replace("/nano");
    }
  }, [cartItems.length, router]);

  useEffect(() => {
    if (!shippingInfo) {
      return;
    }

    Object.keys(shippingInfo)?.forEach((k) => {
      const key = k as keyof typeof shippingInfo;

      const value = shippingInfo[key];
      updateForm(key, value);
    });
  }, [shippingInfo, updateForm]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      // check if form fields are fillded
      const compulsoryShipping = [
        formData.street,
        formData.country,
        formData.email,
        formData.name,
        formData.town,
        formData.postcode,
      ];
      // if there's no billing or shipping details, ask them to fill the fields
      if (!compulsoryShipping.every((val) => !!val)) {
        toast.error("Please fill in your shipping details");
        return;
      }

      // create a new pending order
      const items = cartItems.map((item) => {
        return {
          name: item.name,
          quantity: item.quantity,
        };
      });

      createOrder.mutate(
        {
          date: new Date().toISOString(),
          status: "pending",
          userId: currentUserDb.data?.id!,
          totalPrice,
          items,
        },
        {
          onSuccess: (res) => {
            // Update the shipping address
            updateUserDb.mutate(
              { shippingAddress: { ...shippingInfo, ...formData } },
              {
                onError: handleError,
                onSuccess: () => {
                  currentUserDb.refetch();
                  toast.success("Address updated!");

                  // proceed to stripe checkout
                  console.log({ res });
                  router.push(`/checkout/pay?order_id=${res.id}`);
                },
              }
            );
          },
          onError: handleError,
        }
      );
    },
    [
      currentUserDb,
      formData,
      shippingInfo,
      updateUserDb,
      createOrder,
      totalPrice,
      cartItems,
      router,
    ]
  );

  return (
    <form
      onSubmit={handleSubmit}
      tw="lg:w-[50%] w-full flex flex-col items-start gap-5"
    >
      <div tw="w-full flex flex-col gap-3">
        <Typography.P tw="text-blue-500 font-bold">
          1. Contact Information
        </Typography.P>
        <Typography.P>
          We&apos;ll use this email to send you details and updates about your
          order.
        </Typography.P>
        <FormInput
          id="email"
          type="text"
          title="Email"
          tw="ml-auto"
          required
          placeholder={shippingInfo?.email ?? "Email"}
          onChange={(e) => updateForm("email", e.target.value)}
          value={formData?.email}
        />
      </div>

      <div tw="w-full flex flex-col gap-3">
        <Typography.P tw="text-blue-500 font-bold">
          2. Shipping Address
        </Typography.P>
        <Typography.P>
          Enter the address where you want your order delivered.
        </Typography.P>

        <div tw="w-full flex flex-col items-center justify-between gap-4">
          <FormInput
            id="name"
            type="text"
            title="Full Name"
            placeholder={shippingInfo?.name ?? "Full name"}
            onChange={(e) => updateForm("name", e.target.value)}
            required
            value={formData?.name}
          />

          <span tw="w-full flex items-center justify-between gap-3">
            <FormInput
              id="street"
              type="text"
              title="Street address"
              tw="w-full"
              required
              placeholder={shippingInfo?.street ?? "Street"}
              onChange={(e) => updateForm("street", e.target.value)}
              value={formData?.street}
            />

            <FormInput
              id="apartment"
              type="text"
              title="Aptmnt, etc."
              placeholder={shippingInfo?.apartment ?? "Apt"}
              onChange={(e) => updateForm("apartment", e.target.value)}
              value={formData?.apartment}
            />
          </span>

          <FormInput
            id="town"
            type="text"
            title="Town / City"
            placeholder={shippingInfo?.town ?? "Town"}
            onChange={(e) => updateForm("town", e.target.value)}
            required
            value={formData?.town}
          />

          <span tw="w-full flex items-center justify-between gap-3">
            <FormInput
              id="country"
              type="text"
              title="Country"
              required
              placeholder={shippingInfo?.country ?? "Country"}
              onChange={(e) => updateForm("country", e.target.value)}
              value={formData?.country}
            />
            <FormInput
              id="postcode"
              type="text"
              title="Postcode"
              required
              placeholder={shippingInfo?.postcode ?? "Postcode"}
              onChange={(e) => updateForm("postcode", e.target.value)}
              value={formData?.postcode}
            />
          </span>
        </div>
      </div>

      <Typography.P>
        By proceeding with your purchase you agree to our Terms and Conditions
        and Privacy Policy
      </Typography.P>

      <div tw="w-full flex items-center justify-between gap-4">
        <ActionButton
          title="← Return to Cart"
          onClick={() => router.push("/cart")}
          tw="w-full"
        />
        <SubmitButton
          type="submit"
          title="Place Order"
          tw="w-full !rounded-lg !px-3 !py-2"
          isLoading={isLoading}
          disabled={isLoading}
        />
      </div>
    </form>
  );
}
