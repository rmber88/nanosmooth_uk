import tw from "twin.macro";
import createOrderOnRoyalMail from "../hooks/mutations/orders/useRoyalMail";
import useSendMail from "../hooks/mutations/orders/useSendMail";
import useCreateRoyalMail from "../hooks/mutations/orders/useCreateRoyalMail";
import handleError from "../utils/handleError";

export default function Test() {
  const createRoyalMail = useCreateRoyalMail();
  const onSend = () => {
    // createOrderOnRoyalMail(
    //   { parent_id: 12 },
    //   {
    //     first_name: "John",
    //     email: "doziben@gmail.com",
    //     address_1: "209 Deansgate",
    //     address_2: "",
    //     city: "Manchester",
    //     date_created: new Date().toISOString(),
    //     id: 12,
    //     items: [{}],
    //     postcode: "M33NW",
    //   }
    // )
    //   .then((res: any) => {
    //     console.log({ res });
    //   })
    //   .catch((e) => console.log(e));

    const orderReference = "ns-test1";
    const orderData = {
      fullName: "Sim Johal",
      addressLine1: "3 HOLBURN STREET",
      addressLine2: "",
      city: "ABERDEEN",
      postalCode: "AB10 6DN",
      emailAddress: "doziben@gmail.com",
      orderDate: new Date().toISOString(),
      subtotal: 5,
      total: 5,
    };

    createRoyalMail.mutate(
      {
        items: [
          {
            orderReference,
            recipient: {
              address: {
                fullName: orderData.fullName,
                addressLine1: orderData.addressLine1,
                addressLine2: orderData.addressLine2,
                city: orderData.city,
                postcode: orderData.postalCode,
                countryCode: "UK",
              },
              emailAddress: orderData.emailAddress,
            },
            sender: {
              tradingName: "NANOSMOOTHIES LTD",
              phoneNumber: "+44 7359 012117",
              emailAddress: "simfxuk@yahoo.co.uk",
            },
            billing: {
              address: {
                fullName: orderData.fullName,
                addressLine1: orderData.addressLine1,
                addressLine2: orderData.addressLine2,
                city: orderData.city,
                postcode: orderData.postalCode,
                countryCode: "UK",
              },
              emailAddress: orderData.emailAddress,
            },
            packages: [
              {
                weightInGrams: 350,
                packageFormatIdentifier: "largeLetter",
                contents: [
                  {
                    name: "Nano Smoothies",
                    UnitValue: 23,
                    UnitWeightInGrams: 350,
                    quantity: 1,
                  },
                ],
              },
            ],
            orderDate: orderData.orderDate,
            subtotal: orderData.subtotal,
            shippingCostCharged: 1.54,
            total: orderData.total,
            currencyCode: "GBP",
            label: {
              includeLabelInResponse: true,
              includeCN: true,
              includeReturnsLabel: true,
            },
          },
        ],
      },
      {
        onSuccess: (s) => {
          console.log({ s });
        },
        onError: handleError,
      }
    );
  };

  const sendMail = useSendMail();

  const onSendMail = () => {
    sendMail.mutate({
      subject: "Test",
      to: [{ name: "Solomon", email: "doziben@gmail.com" }],
      firstName: "Sim from nanosmoothies",
      text: "Test email from nanosmoothies",
      template: "Order Success",
      variables: {
        name: "solomon",
        ORDER_ITEMS: "Test Items",
        ORDER_ID: "testid",
        USER_ADRESS: "Test address",
        USER_CITY: "Manchester",
        USER_COUNTRY: "United Kingdom",
      },
    });
  };

  return (
    <main>
      {sendMail.isLoading && "loading..."}
      {createRoyalMail.isLoading && "loading..."}
      <button onClick={onSend}>Test Royal Send</button>
      <button onClick={onSendMail}>Test Sendpulse mail</button>
    </main>
  );
}
