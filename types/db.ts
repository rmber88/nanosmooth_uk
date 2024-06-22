/**
 * "Data" = fetched from server
 * "DTO" = sent
 */

// Users

export type userRole = "admin";

export type loginDto = {
  email: string;
  password: string;
};

export type userData = {
  id: string;
  name: string;
  email: string;
  role?: userRole;
  shippingAddress: {
    name: string;
    street: string;
    apartment: string;
    town: string;
    postcode: string;
    country: string;
    email: string;
  };
  billingAddress: {
    name: string;
    street: string;
    apartment: string;
    town: string;
    postcode: string;
    country: string;
    email: string;
  };
};

export type userDto = {
  id?: string;
  name?: string;
  email?: string;
  role?: userRole;
  shippingAddress?: {
    name?: string;
    street?: string;
    apartment?: string;
    town?: string;
    postcode?: string;
    country?: string;
    email?: string;
  };
  billingAddress?: {
    street?: string;
    apartment?: string;
    town?: string;
    postcode?: string;
    country?: string;
    email?: string;
  };
};

// Orders
export type orderData = {
  id: string;
  userId: string;
  status: "pending" | "confirmed" | "delivered";
  date: string;
  totalPrice: number;
  items: {
    name: string;
    quantity: number;
  }[];
};

export type orderDto = {
  userId?: string;
  status?: "pending" | "confirmed" | "delivered";
  date?: string;
  totalPrice?: number;
  items?: {
    name: string;
    quantity: number;
  }[];
};

// Subscriptions
export type subscriptionData = {
  id: string;
  userId: string;
  quantity: number;
  totalPrice: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  stripeId?: string;
  stripePaused?: boolean;
};

export type subscriptionDto = {
  userId?: string;
  quantity?: number;
  totalPrice?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  stripeId?: string;
  stripePaused?: boolean;
};

// Mailing
export type MailDto = {
  to: { email: string; name?: string }[];
  template?: "Order Success";
  firstName?: string;
  subject: string;
  variables?: {
    name?: string;
    ORDER_ID?: string;
    ORDER_ITEMS?: string;
    USER_ADRESS?: string;
    USER_CITY?: string;
    USER_COUNTRY?: string;
  } & { [key: string]: string };
  text?: string;
};

export type MailingListDto = {
  email: string;
  variables: {
    name: string;
    [key: string]: string;
  };
};

// Royal mail
export type RoyalMailDto = {
  items: {
    orderReference: string;
    recipient: {
      address: {
        fullName: string;
        addressLine1: string;
        addressLine2: string;
        city: string;
        postcode: string;
        countryCode: "UK";
      };
      emailAddress: string;
    };
    sender: {
      tradingName: "NANOSMOOTHIES LTD";
      phoneNumber: "+44 7359 012117";
      emailAddress: "simfxuk@yahoo.co.uk";
    };
    billing: {
      address: {
        fullName: string;
        addressLine1: string;
        addressLine2: string;
        city: string;
        postcode: string;
        countryCode: "UK";
      };
      emailAddress: string;
    };
    packages: [
      {
        weightInGrams: 350;
        packageFormatIdentifier: "largeLetter";
        contents: {
          name: string;
          UnitValue: number;
          UnitWeightInGrams: 350;
          quantity: number;
        }[];
      }
    ];
    orderDate: string;
    subtotal: number;
    shippingCostCharged: 1.54;
    total: number;
    currencyCode: "GBP";
    label: {
      includeLabelInResponse: true;
      includeCN: true;
      includeReturnsLabel: true;
    };
  }[];
};
