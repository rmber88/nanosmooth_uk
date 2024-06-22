import axios from "axios";

interface Order {
  first_name: string;
  address_1: string;
  address_2: string;
  city: string;
  email: string;
  items: any[];
  date_created: string;
  postcode: string;
  id: number;
}

interface Subscription {
  parent_id: number;
}

async function createOrderOnRoyalMail(
  subscription: Subscription,
  order?: Order
): Promise<void> {
  const url = "https://api.parcel.royalmail.com/api/v1/orders";

  const headers = {
    Authorization: "Bearer df5f2215-9fee-40cd-bed8-709aa9a0174b",
    "Content-Type": "application/json",
  };

  const getOrderDetails = (order: Order): any => {
    const fullName = order.first_name;
    const addressLine1 = order.address_1;
    const addressLine2 = order.address_2;
    const city = order.city;
    const emailAddress = order.email;
    const postalCode = order.postcode;
    const orderDate = order.date_created;
    const total = 23;
    const shippingCostCharged = 1.54;
    const quantity = 1; // Get quantity of first item

    const subtotal = total - shippingCostCharged;

    return {
      fullName,
      addressLine1,
      addressLine2,
      city,
      emailAddress,
      postalCode,
      orderDate,
      total,
      shippingCostCharged,
      subtotal,
      quantity,
    };
  };

  const orderData = getOrderDetails(order!); //getOrderDetails(order || wc_get_order(subscription.get_parent_id()));

  for (let i = 1; i <= orderData.quantity; i++) {
    const orderReference = `${orderData.order_id}_${i}`;

    const data = {
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
    };

    try {
      const response = await axios.post(url, data, { headers });
      console.log("Order created on Royal Mail:", response.data);
    } catch (error) {
      console.error("Error creating order on Royal Mail:", error);
    }

    if (orderData.quantity % 5 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Pause execution for 500ms
    }
  }
}

export default createOrderOnRoyalMail;
