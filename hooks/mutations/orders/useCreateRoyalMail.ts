import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const url = "https://api.parcel.royalmail.com/api/v1";

const headers = {
  Authorization: "Bearer df5f2215-9fee-40cd-bed8-709aa9a0174b",
  "Content-Type": "application/json",
};

type royalMailDto = {
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

export default function useCreateRoyalMail() {
  const sender = {
    tradingName: "NANOSMOOTHIES LTD",
    phoneNumber: "+44 7359 012117",
    emailAddress: "simfxuk@yahoo.co.uk",
  };

  return useMutation(async (data: royalMailDto) => {
    const res = await axios.post(`${url}/orders`, data);

    return res.data;
  });
}
